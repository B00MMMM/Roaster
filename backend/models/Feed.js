const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'responded'],
    default: 'pending'
  }
});

// Add index for faster queries
feedbackSchema.index({ email: 1 });
feedbackSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Feed', feedbackSchema);