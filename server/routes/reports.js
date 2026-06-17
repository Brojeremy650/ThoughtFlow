const express = require('express');
const authMiddleware = require('../middleware/auth.js');
const Thought = require('../models/Thought.js');

const router = express.Router();

// Get daily report
router.get('/daily', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thoughts = await Thought.find({
      userId: req.userId,
      createdAt: { $gte: today }
    });
    
    const report = {
      date: today,
      totalThoughtsCaptured: thoughts.length,
      tasksCompleted: thoughts.filter(t => t.status === 'completed').length,
      categoriesUsed: [...new Set(thoughts.map(t => t.category))],
      insights: 'Daily insights will be generated here'
    };
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get weekly report
router.get('/weekly', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thoughts = await Thought.find({
      userId: req.userId,
      createdAt: { $gte: weekAgo }
    });
    
    const report = {
      period: `${weekAgo.toDateString()} - ${today.toDateString()}`,
      totalThoughts: thoughts.length,
      tasksCompleted: thoughts.filter(t => t.status === 'completed').length,
      categoryBreakdown: {},
      trends: 'Weekly trends will be analyzed here'
    };
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
