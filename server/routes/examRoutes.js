const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');

// Get all exams
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find({ userEmail: req.userEmail }).sort({ date: 1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk sync
router.post('/sync', async (req, res) => {
  try {
    const { exams } = req.body;
    if (Array.isArray(exams)) {
      for (const ex of exams) {
        if (ex.id) {
          await Exam.findOneAndUpdate({ userEmail: req.userEmail, id: ex.id }, { ...ex, userEmail: req.userEmail }, { upsert: true, new: true });
        }
      }
    }
    const all = await Exam.find({ userEmail: req.userEmail }).sort({ date: 1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create exam
router.post('/', async (req, res) => {
  try {
    const examData = { ...req.body, userEmail: req.userEmail };
    if (!examData.id) {
      examData.id = Date.now();
    }
    const exam = new Exam(examData);
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update exam
router.put('/:id', async (req, res) => {
  try {
    const examId = Number(req.params.id);
    const updated = await Exam.findOneAndUpdate(
      { userEmail: req.userEmail, id: examId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete exam
router.delete('/:id', async (req, res) => {
  try {
    const examId = Number(req.params.id);
    await Exam.findOneAndDelete({ userEmail: req.userEmail, id: examId });
    res.json({ success: true, id: examId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
