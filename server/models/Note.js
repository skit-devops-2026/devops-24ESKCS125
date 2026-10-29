const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
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
    subject: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    content: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['text', 'file'],
      default: 'text'
    },
    fileName: {
      type: String,
      default: ''
    },
    fileSize: {
      type: String,
      default: ''
    },
    fileData: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

noteSchema.index({ userEmail: 1, id: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);
