const express = require('express');
const router = express.Router();
const CalendarEvent = require('../models/CalendarEvent');

// Get all calendar events
router.get('/', async (req, res) => {
  try {
    const events = await CalendarEvent.find({ userEmail: req.userEmail }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk sync
router.post('/sync', async (req, res) => {
  try {
    const { events } = req.body;
    if (Array.isArray(events)) {
      for (const ev of events) {
        if (ev.id) {
          await CalendarEvent.findOneAndUpdate({ userEmail: req.userEmail, id: ev.id }, { ...ev, userEmail: req.userEmail }, { upsert: true, new: true });
        }
      }
    }
    const all = await CalendarEvent.find({ userEmail: req.userEmail }).sort({ date: 1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create event
router.post('/', async (req, res) => {
  try {
    const evData = { ...req.body, userEmail: req.userEmail };
    if (!evData.id) {
      evData.id = Date.now();
    }
    const event = new CalendarEvent(evData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const updated = await CalendarEvent.findOneAndUpdate(
      { userEmail: req.userEmail, id: eventId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    await CalendarEvent.findOneAndDelete({ userEmail: req.userEmail, id: eventId });
    res.json({ success: true, id: eventId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
