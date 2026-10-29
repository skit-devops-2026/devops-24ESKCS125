const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    id: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      default: ''
    },
    subject: {
      type: String,
      default: ''
    },
    topic: {
      type: String,
      default: ''
    },
    goal: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'focus'
    },
    duration: {
      type: Number,
      default: 25
    },
    completed: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

focusSessionSchema.index({ userEmail: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('FocusSession', focusSessionSchema);
