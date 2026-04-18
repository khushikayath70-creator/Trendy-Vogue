const mongoose = require('mongoose');

const clothsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  pieces: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Cloths', clothsSchema);