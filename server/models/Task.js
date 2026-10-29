const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    subject: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'Assignment'
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      default: ''
    },
    duration: {
      type: String,
      default: '2 Hours'
    }
  },
  { timestamps: true }
);

taskSchema.index({ userEmail: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('Task', taskSchema);
