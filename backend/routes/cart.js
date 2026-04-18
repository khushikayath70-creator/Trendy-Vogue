const express = require('express');
const Cart = require('../models/Cart');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

router.post('/add', authMiddleware, async (req, res) => {
  try {
    const product = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
      });
    }

    const exists = cart.items.find(
      (item) =>
        item.id === product.id &&
        item.selectedSize === product.selectedSize &&
        item.selectedColor === product.selectedColor
    );

    if (exists) {
      exists.quantity += product.quantity || 1;
    } else {
      cart.items.push(product);
    }

    await cart.save();
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add cart item' });
  }
});

router.put('/qty', authMiddleware, async (req, res) => {
  try {
    const { id, selectedSize, selectedColor, type } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.json([]);

    const item = cart.items.find(
      (i) =>
        i.id === id &&
        i.selectedSize === selectedSize &&
        i.selectedColor === selectedColor
    );

    if (item) {
      if (type === 'increase') item.quantity += 1;
      if (type === 'decrease') item.quantity = Math.max(1, item.quantity - 1);
    }

    await cart.save();
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update quantity' });
  }
});

router.delete('/remove', authMiddleware, async (req, res) => {
  try {
    const { id, selectedSize, selectedColor } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.json([]);

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.id === id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        )
    );

    await cart.save();
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove cart item' });
  }
});

module.exports = router;