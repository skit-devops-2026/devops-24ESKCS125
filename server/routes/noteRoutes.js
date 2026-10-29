const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userEmail: req.userEmail }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk sync
router.post('/sync', async (req, res) => {
  try {
    const { notes } = req.body;
    if (Array.isArray(notes)) {
      for (const n of notes) {
        if (n.id) {
          await Note.findOneAndUpdate({ userEmail: req.userEmail, id: n.id }, { ...n, userEmail: req.userEmail }, { upsert: true, new: true });
        }
      }
    }
    const all = await Note.find({ userEmail: req.userEmail }).sort({ createdAt: -1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create note
router.post('/', async (req, res) => {
  try {
    const noteData = { ...req.body, userEmail: req.userEmail };
    if (!noteData.id) {
      noteData.id = Date.now();
    }
    const note = new Note(noteData);
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    const noteId = Number(req.params.id);
    await Note.findOneAndDelete({ userEmail: req.userEmail, id: noteId });
    res.json({ success: true, id: noteId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
