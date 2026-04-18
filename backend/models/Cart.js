const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        id: String,
        name: String,
        category: String,
        subCategory: String,
        badge: String,
        price: Number,
        oldPrice: Number,
        img: String,
        image: String,
        description: String,
        colors: [String],
        sizes: [String],
        isNew: Boolean,
        quantity: {
          type: Number,
          default: 1,
        },
        selectedSize: {
          type: String,
          default: '',
        },
        selectedColor: {
          type: String,
          default: '',
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);