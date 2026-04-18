const express = require('express');
const router = express.Router();
const Cloths = require('../models/Cloths');

// GET all cloths
router.get('/', async (req, res) => {
  try {
    const cloths = await Cloths.find().sort({ createdAt: -1 });
    res.json(cloths);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single cloth
router.get('/:id', async (req, res) => {
  try {
    const cloth = await Cloths.findById(req.params.id);
    if (!cloth) return res.status(404).json({ message: 'Cloth not found' });
    res.json(cloth);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new cloth
router.post('/', async (req, res) => {
  try {
    const newCloth = new Cloths(req.body);
    const saved = await newCloth.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update cloth
router.put('/:id', async (req, res) => {
  try {
    const updated = await Cloths.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Cloth not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE cloth
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Cloths.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Cloth not found' });
    res.json({ message: 'Cloth deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;