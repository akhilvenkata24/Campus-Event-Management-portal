const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const XLSX = require('xlsx');

// create a registration
router.post('/', async (req, res) => {
  try {
    const { name, section, regNo, mobile, eventId } = req.body;
    
    // Validate all required fields
    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!section) errors.section = 'Section is required';
    if (!regNo) errors.regNo = 'Registration number is required';
    if (!mobile) errors.mobile = 'Mobile number is required';
    if (!eventId) errors.eventId = 'Event ID is required';
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ 
        msg: 'Missing required fields',
        errors 
      });
    }

    // Validate mobile number format
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        msg: 'Invalid mobile number',
        errors: { mobile: 'Mobile number must be 10 digits' }
      });
    }

    // Check if event exists and has available seats
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    if (event.seats > 0 && event.attendees >= event.seats) {
      return res.status(400).json({ msg: 'Event is fully booked' });
    }

    // Check for duplicate registration
    const existingReg = await Registration.findOne({ regNo, event: eventId });
    if (existingReg) {
      return res.status(400).json({ msg: 'Already registered for this event' });
    }

    // Create registration and update event attendee count
    const reg = new Registration({ 
      name, 
      section, 
      regNo, 
      mobile, 
      event: eventId 
    });
    
    await reg.save();
    
    // Increment attendees count atomically
    await Event.findByIdAndUpdate(eventId, { $inc: { attendees: 1 } });

    // Return populated registration
    const populatedReg = await Registration.findById(reg._id)
      .populate('event', 'title date time location');

    res.status(201).json(populatedReg);
  } catch (err) {
    console.error('Registration error:', err);
    // Duplicate key (unique index)
    if (err && err.code === 11000) {
      // If the duplicate is only on regNo (old single-field unique index), inform admin
      try {
        const key = err.keyValue || {};
        if (key.regNo && !key.event) {
          return res.status(400).json({ msg: 'Registration number already exists (global unique). Please ask admin to fix DB indexes to allow same regNo across events.' });
        }
      } catch (ee) {
        // ignore parsing error and fallthrough
      }
      return res.status(400).json({ msg: 'Already registered for this event' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        msg: 'Invalid registration data',
        errors: Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message;
          return acc;
        }, {})
      });
    }
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// list registrations (admin only)
router.get('/', require('../middleware/adminAuth'), async (req, res) => {
  try {
    const regs = await Registration.find()
      .populate('event', 'title date')
      .sort({ createdAt: -1 }); // Latest first
    res.json(regs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Download registrations as Excel (admin only)
router.get('/download/:eventId', require('../middleware/adminAuth'), async (req, res) => {
  try {
    const eventId = req.params.eventId;
    
    // Get event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Get all registrations for this event
    const registrations = await Registration.find({ event: eventId })
      .populate('event', 'title date');

    // Prepare data for Excel
    const data = registrations.map(reg => ({
      'Name': reg.name,
      'Section': reg.section,
      'Registration No': reg.regNo,
      'Mobile': reg.mobile,
      'Registration Date': new Date(reg.createdAt).toLocaleDateString()
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const colWidths = [
      { wch: 20 }, // Name
      { wch: 10 }, // Section
      { wch: 15 }, // Registration No
      { wch: 12 }, // Mobile
      { wch: 15 }  // Registration Date
    ];
    ws['!cols'] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=registrations-${event.title}.xlsx`);

    // Send the file
    res.send(Buffer.from(excelBuffer));

  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
