const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Protected route - only accessible to patrons
router.get('/content', authMiddleware, (req, res) => {
  if (!req.session.isPatron) {
    return res.status(403).json({ error: 'Only patrons can access this content' });
  }

  // Return members-only content
  res.json({
    message: 'Welcome to the members-only blog!',
    user: {
      email: req.session.email,
      patreonId: req.session.userId
    },
    content: {
      title: 'Members-Only Blog',
      description: 'This content is only available to active Patreon supporters',
      posts: [
        {
          id: 1,
          title: 'Behind the Scenes',
          excerpt: 'Exclusive content for supporters...',
          date: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Work in Progress',
          excerpt: 'See what\'s being worked on...',
          date: new Date().toISOString()
        }
      ]
    }
  });
});

// Get current user status
router.get('/status', (req, res) => {
  if (req.session.userId) {
    res.json({
      authenticated: true,
      isPatron: req.session.isPatron,
      email: req.session.email
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
