const express = require('express');
const Wishlist = require('../models/Wishlist');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        items: [],
      });
    }

    res.json(wishlist.items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
});

router.post('/toggle', authMiddleware, async (req, res) => {
  try {
    const product = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        items: [],
      });
    }

    const exists = wishlist.items.find((item) => item.id === product.id);

    if (exists) {
      wishlist.items = wishlist.items.filter((item) => item.id !== product.id);
    } else {
      wishlist.items.push(product);
    }

    await wishlist.save();
    res.json(wishlist.items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update wishlist' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.json([]);
    }

    wishlist.items = wishlist.items.filter((item) => item.id !== req.params.id);
    await wishlist.save();

    res.json(wishlist.items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove wishlist item' });
  }
});

module.exports = router;