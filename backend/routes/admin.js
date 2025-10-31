const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminAuth');
const Registration = require('../models/Registration');
const mongoose = require('mongoose');

// admin login - simple credential check from env
// Test endpoint to check admin route
router.get('/test', (req, res) => {
  res.json({ msg: 'Admin route is working' });
});

// Admin utility to inspect and fix registration indexes
router.post('/fix-registration-index', adminAuth, async (req, res) => {
  try {
    const coll = mongoose.connection.collection('registrations');
    const indexes = await coll.indexes();
    const actions = [];

    // If there's a single-field unique index on regNo, drop it
    const singleRegIndex = indexes.find(ix => ix.key && ix.key.regNo === 1 && ix.unique === true && Object.keys(ix.key).length === 1);
    if (singleRegIndex) {
      await coll.dropIndex(singleRegIndex.name);
      actions.push(`Dropped index ${singleRegIndex.name}`);
    }

    // Ensure the compound unique index exists
    const compoundIndexExists = indexes.some(ix => ix.key && ix.key.regNo === 1 && ix.key.event === 1);
    if (!compoundIndexExists) {
      await coll.createIndex({ regNo: 1, event: 1 }, { unique: true });
      actions.push('Created compound unique index on {regNo:1, event:1}');
    } else {
      actions.push('Compound index already present');
    }

    res.json({ ok: true, actions, indexes: await coll.indexes() });
  } catch (err) {
    console.error('Index fix error:', err);
    res.status(500).json({ ok: false, msg: 'Index operation failed', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password }); // For debugging

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@123';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide email and password' });
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = jwt.sign({ isAdmin: true, email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '8h' });
    console.log('Login successful:', { email }); // For debugging
    return res.json({ token });
  }

  console.log('Login failed:', { email }); // For debugging
  return res.status(401).json({ msg: 'Invalid credentials' });
});

module.exports = router;
