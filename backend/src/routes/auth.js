const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Register/Login user (handled by Firebase Auth on frontend)
// This endpoint creates user profile in Firestore
router.post('/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, photoURL } = req.body;
    
    // Check if user already exists
    let user = await User.findById(req.user.uid);
    
    if (!user) {
      // Create new user profile
      user = await User.create({
        uid: req.user.uid,
        email: req.user.email,
        displayName: displayName || req.user.name,
        photoURL: photoURL || req.user.picture
      });
    } else {
      // Update existing user
      if (displayName) user.displayName = displayName;
      if (photoURL) user.photoURL = photoURL;
      await user.save();
    }

    res.status(200).json({
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
    console.error('Profile creation error:', error);
    res.status(500).json({ error: 'Failed to create/update profile' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.uid);
    
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Update last seen
    await User.updateLastSeen(req.user.uid);

    res.json({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      status: user.status,
      lastSeen: user.lastSeen
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user status
router.patch('/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['online', 'away', 'offline'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await User.findById(req.user.uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json({ message: 'Status updated', status });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
