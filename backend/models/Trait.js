const mongoose = require('mongoose');

const TraitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Personality', 'Funny/Embarrassing', 'Body Structure', 'physical', 'personality', 'behavior', 'style', 'other']
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trait', TraitSchema);
