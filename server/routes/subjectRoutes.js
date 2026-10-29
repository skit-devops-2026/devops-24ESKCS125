const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find({ userEmail: req.userEmail }).sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk sync
router.post('/sync', async (req, res) => {
  try {
    const { subjects } = req.body;
    if (Array.isArray(subjects)) {
      for (const s of subjects) {
        if (s.name) {
          const existing = await Subject.findOne({ userEmail: req.userEmail, name: s.name });
          const subjectData = { ...s, userEmail: req.userEmail, id: s.id || (existing && existing.id) || Date.now() };
          await Subject.findOneAndUpdate(
            { userEmail: req.userEmail, name: s.name },
            subjectData,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
      }
    }
    const all = await Subject.find({ userEmail: req.userEmail }).sort({ createdAt: -1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create subject
router.post('/', async (req, res) => {
  try {
    const subData = req.body;
    if (!subData.id) {
      subData.id = Date.now();
    }
    const existing = await Subject.findOne({ userEmail: req.userEmail, name: subData.name });
    if (existing) {
      return res.status(400).json({ error: 'Subject already exists' });
    }
    const subject = new Subject({ ...subData, userEmail: req.userEmail });
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update subject details / topics / syllabus by subject name
router.get('/:name/details', async (req, res) => {
  try {
    const subject = await Subject.findOne({ userEmail: req.userEmail, name: req.params.name });
    if (!subject) {
      return res.json({ topics: [], syllabus: null });
    }
    res.json({ topics: subject.topics || [], syllabus: subject.syllabus || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:name/topics', async (req, res) => {
  try {
    const { topics } = req.body;
    const subject = await Subject.findOneAndUpdate(
      { userEmail: req.userEmail, name: req.params.name },
      { $set: { topics, userEmail: req.userEmail } },
      { new: true, upsert: true }
    );
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:name/syllabus', async (req, res) => {
  try {
    const { syllabus } = req.body;
    const subject = await Subject.findOneAndUpdate(
      { userEmail: req.userEmail, name: req.params.name },
      { $set: { syllabus, userEmail: req.userEmail } },
      { new: true, upsert: true }
    );
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete subject by ID or Name
router.delete('/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const num = Number(identifier);
    if (!isNaN(num)) {
      await Subject.findOneAndDelete({ userEmail: req.userEmail, $or: [{ id: num }, { name: identifier }] });
    } else {
      await Subject.findOneAndDelete({ userEmail: req.userEmail, name: identifier });
    }
    res.json({ success: true, identifier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
