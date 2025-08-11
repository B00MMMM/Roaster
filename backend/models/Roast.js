const mongoose = require('mongoose');

const RoastSchema = new mongoose.Schema({
  text: { type: String, required: true },
  tags: [String],
  category: { 
    type: String, 
    required: true,
    enum: ['savage', 'friendly', 'professional', 'tech', 'food', 'animal', 'weather', 'transport', 'gaming', 'random']
  }
}, { timestamps: true });

module.exports = mongoose.model('Roast', RoastSchema);
