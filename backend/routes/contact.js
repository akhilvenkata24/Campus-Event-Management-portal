const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const adminAuth = require('../middleware/adminAuth');

// POST /api/contact - Submit a contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message
    });

    await contact.save();
    res.json({ msg: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact save error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/contact - Admin: Get all messages (newest first)
router.get('/', adminAuth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/contact/:id - Admin: Mark message as read
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    
    message.isRead = true;
    await message.save();
    res.json(message);
  } catch (err) {
    console.error('Update message error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/contact/:id - Admin: Delete a message
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }
    
    await message.remove();
    res.json({ msg: 'Message deleted' });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;