const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get user by ID
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      status: user.status,
      lastSeen: user.lastSeen
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Search users by display name
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, limit = 20 } = req.query;

    if (!search || search.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const db = require('../services/firebase').getFirestore();
    
    // Simple search by display name (case-insensitive)
    // Note: For production, consider using Algolia or similar for better search
    const snapshot = await db.collection('users')
      .where('displayName', '>=', search)
      .where('displayName', '<=', search + '\uf8ff')
      .limit(parseInt(limit))
      .get();

    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        displayName: data.displayName,
        photoURL: data.photoURL,
        status: data.status
      };
    });

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Update user profile
router.patch('/me', authenticateToken, async (req, res) => {
  try {
    const { displayName, photoURL } = req.body;

    const user = await User.findById(req.user.uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (displayName !== undefined) {
      if (!displayName || displayName.trim().length === 0) {
        return res.status(400).json({ error: 'Display name cannot be empty' });
      }
      if (displayName.length > 32) {
        return res.status(400).json({ error: 'Display name too long (max 32 characters)' });
      }
      user.displayName = displayName.trim();
    }

    if (photoURL !== undefined) {
      user.photoURL = photoURL;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
