const mongoose = require('mongoose');

const RoastSchema = new mongoose.Schema({
  text: { type: String, required: true },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Roast', RoastSchema);
