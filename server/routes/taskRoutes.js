const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userEmail: req.userEmail }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk sync or single create
router.post('/sync', async (req, res) => {
  try {
    const { tasks } = req.body;
    if (Array.isArray(tasks)) {
      for (const t of tasks) {
        if (t.id) {
          await Task.findOneAndUpdate({ userEmail: req.userEmail, id: t.id }, { ...t, userEmail: req.userEmail }, { upsert: true, new: true });
        }
      }
    }
    const all = await Task.find({ userEmail: req.userEmail }).sort({ createdAt: -1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create single task
router.post('/', async (req, res) => {
  try {
    const taskData = { ...req.body, userEmail: req.userEmail };
    if (!taskData.id) {
      taskData.id = Date.now();
    }
    const task = new Task(taskData);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const updated = await Task.findOneAndUpdate(
      { userEmail: req.userEmail, id: taskId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    await Task.findOneAndDelete({ userEmail: req.userEmail, id: taskId });
    res.json({ success: true, id: taskId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
