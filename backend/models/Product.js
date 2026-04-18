const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    oldPrice: { type: String, default: '', trim: true },
    category: { type: String, required: true, trim: true },
    label: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    img: { type: String, required: true, trim: true },
    isNew: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);