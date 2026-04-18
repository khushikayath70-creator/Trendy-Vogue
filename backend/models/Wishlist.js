const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
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
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);