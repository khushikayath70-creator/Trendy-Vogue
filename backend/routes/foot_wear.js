const express = require('express');
const router = express.Router();
const Foot_wear = require('../models/Foot_wear');

// GET all designers
router.get('/', async (req, res) => {
  try {
    const footWears = await Foot_wear.find().sort({ featured: -1, createdAt: -1 });
    res.json(footWears);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single foot wear
router.get('/:id', async (req, res) => {
  try {
    const footWear = await Foot_wear.findById(req.params.id);
    if (!footWear) return res.status(404).json({ message: 'Foot_wear not found' });
    res.json(footWear);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new foot wear
router.post('/', async (req, res) => {
  try {
    const newFoot_wear = new Foot_wear(req.body);
    const saved = await newFoot_wear.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update foot wear
router.put('/:id', async (req, res) => {
  try {
    const updated = await Foot_wear.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Foot_wear not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE foot wear
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Foot_wear.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Foot_wear not found' });
    res.json({ message: 'Foot_wear deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;