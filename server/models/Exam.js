const mongoose = require('mongoose');

const examTopicSchema = new mongoose.Schema({
  id: { type: Number },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const examSchema = new mongoose.Schema(
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
    subject: {
      type: String,
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
    venue: {
      type: String,
      default: ''
    },
    topics: [examTopicSchema]
  },
  { timestamps: true }
);

examSchema.index({ userEmail: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('Exam', examSchema);
