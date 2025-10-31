const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const adminAuth = require('../middleware/adminAuth');

// create event
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, date, time, location, category, image, seats } = req.body;
    
    // Basic validation
    if (!title || !date || !category) {
      return res.status(400).json({ 
        msg: 'Missing required fields',
        errors: {
          title: !title ? 'Title is required' : null,
          date: !date ? 'Date is required' : null,
          category: !category ? 'Category is required' : null
        }
      });
    }

    // Validate date is in the future
    if (new Date(date) < new Date()) {
      return res.status(400).json({ msg: 'Event date must be in the future' });
    }

    // Create event with validated data
    const eventData = {
      title,
      description,
      date,
      time,
      location,
      category,
      image: image || undefined,
      seats: seats || 0,
      organizer: req.admin.id // from adminAuth middleware
    };

    const ev = new Event(eventData);
    await ev.save();
    
    // Populate organizer details in response
    const populatedEvent = await Event.findById(ev._id).populate('organizer', 'name email');
    res.status(201).json(populatedEvent);
  } catch (err) {
    console.error('Event creation error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        msg: 'Invalid event data',
        errors: Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message;
          return acc;
        }, {})
      });
    }
    res.status(500).json({ msg: 'Server error creating event' });
  }
});

// delete event (admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id);
    if (!ev) return res.status(404).json({ msg: 'Not found' });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// seed events (admin) - accepts array of events in body
router.post('/seed/all', adminAuth, async (req, res) => {
  try {
    const list = req.body.events || [];
    if (!Array.isArray(list)) return res.status(400).json({ msg: 'events must be array' });
    const created = await Event.insertMany(list);
    res.json({ createdCount: created.length });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// list events with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { category, status, search, sort = '-date' } = req.query;
    
    // Build query
    const query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status && status !== 'all') {
      const now = new Date();
      if (status === 'upcoming') {
        query.date = { $gte: now };
      } else if (status === 'completed') {
        query.date = { $lt: now };
      }
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with sorting
    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort(sort)
      .lean();
    
    // Add computed status based on current date
    const eventsWithStatus = events.map(event => ({
      ...event,
      computedStatus: new Date(event.date) > new Date() ? 'upcoming' : 'completed'
    }));
    
    res.json(eventsWithStatus);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ msg: 'Server error fetching events' });
  }
});

// get single event
router.get('/:id', async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!ev) return res.status(404).json({ msg: 'Not found' });
    res.json(ev);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// update event
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updates = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      category: req.body.category,
      status: req.body.status,
    };
    
    // Only update image if a new one is provided
    if (req.body.image) {
      updates.image = req.body.image;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
