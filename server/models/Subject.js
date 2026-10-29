const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  importance: { type: String, default: 'Normal' },
  completed: { type: Boolean, default: false }
});

const subjectSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      default: ''
    },
    teacher: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#3b82f6'
    },
    topics: [topicSchema],
    syllabus: {
      name: { type: String },
      size: { type: String },
      type: { type: String },
      data: { type: String }
    }
  },
  { timestamps: true }
);

subjectSchema.index({ userEmail: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
