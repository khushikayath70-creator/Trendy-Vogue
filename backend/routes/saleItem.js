const express = require('express');
const router = express.Router();
const SaleItem = require('../models/SaleItem');

// GET all sale items
router.get('/', async (req, res) => {
  try {
    const items = await SaleItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single sale item
router.get('/:id', async (req, res) => {
  try {
    const item = await SaleItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Sale item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new sale item
router.post('/', async (req, res) => {
  try {
    const newItem = new SaleItem(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update sale item
router.put('/:id', async (req, res) => {
  try {
    const updated = await SaleItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Sale item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE sale item
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await SaleItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Sale item not found' });
    res.json({ message: 'Sale item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;