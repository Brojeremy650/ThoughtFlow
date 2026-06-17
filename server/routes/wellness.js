const express = require('express');
const authMiddleware = require('../middleware/auth.js');
const Thought = require('../models/Thought.js');

const router = express.Router();

// Get wellness dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const thoughts = await Thought.find({ userId: req.userId, status: 'active' });
    
    const wellness = {
      intellectualWellness: 0,
      spiritualWellness: 0,
      emotionalWellness: 0,
      financialWellness: 0,
      socialWellness: 0,
      environmentalWellness: 0,
      occupationalWellness: 0,
      physicalWellness: 0
    };
    
    // TODO: Calculate wellness scores based on thoughts
    
    res.json({ wellness, totalThoughts: thoughts.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
