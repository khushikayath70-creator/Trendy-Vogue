const mongoose = require('mongoose');

const footWearSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  featured: { type: Boolean, default: false },
  collections: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Foot_wear', footWearSchema);    