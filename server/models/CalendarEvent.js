const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Task', 'Exam', 'Study', 'Personal'],
      default: 'Task'
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    date: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    },
    subject: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

calendarEventSchema.index({ userEmail: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
