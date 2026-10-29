const express = require('express');
const router = express.Router();
const FocusSession = require('../models/FocusSession');

// Get all focus sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await FocusSession.find({ userEmail: req.userEmail }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk sync
router.post('/sync', async (req, res) => {
  try {
    const { sessions } = req.body;
    if (Array.isArray(sessions)) {
      for (const s of sessions) {
        if (s.id) {
          await FocusSession.findOneAndUpdate({ userEmail: req.userEmail, id: s.id }, { ...s, userEmail: req.userEmail }, { upsert: true, new: true });
        }
      }
    }
    const all = await FocusSession.find({ userEmail: req.userEmail }).sort({ createdAt: -1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create session
router.post('/', async (req, res) => {
  try {
    const sessionData = { ...req.body, userEmail: req.userEmail };
    if (!sessionData.id) {
      sessionData.id = Date.now();
    }
    const session = new FocusSession(sessionData);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
