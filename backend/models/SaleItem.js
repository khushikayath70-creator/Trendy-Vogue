const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalPrice: { type: String, required: true },
  salePrice: { type: String, required: true },
  discount: { type: String, required: true },
  category: { type: String, required: true },
  img: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SaleItem', saleItemSchema);