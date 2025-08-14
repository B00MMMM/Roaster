const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  skinColor: {
    type: String,
    trim: true
  },
  animalType: {
    type: String,
    trim: true
  },
  traits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trait'
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster searches
PersonSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model('Person', PersonSchema);
