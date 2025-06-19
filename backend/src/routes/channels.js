const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Channel = require('../models/Channel');
const router = express.Router();

// Get all channels (simplified - in real app, filter by server membership)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { serverId } = req.query;
    const channels = await Channel.findAll(serverId, 50);

    res.json({ channels });
  } catch (error) {
    console.error('Get channels error:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

// Get a specific channel
router.get('/:channelId', authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    res.json({ channel });
  } catch (error) {
    console.error('Get channel error:', error);
    res.status(500).json({ error: 'Failed to fetch channel' });
  }
});

// Create a new channel (simplified)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, type = 'text', description = '', serverId = 'default' } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Channel name is required' });
    }

    if (name.length > 100) {
      return res.status(400).json({ error: 'Channel name too long (max 100 characters)' });
    }

    if (!['text', 'voice'].includes(type)) {
      return res.status(400).json({ error: 'Invalid channel type' });
    }

    const channel = await Channel.create({
      name: name.trim(),
      type,
      description,
      serverId,
      position: 0
    });

    res.status(201).json({
      message: 'Channel created successfully',
      channel: {
        id: channel.id,
        name: channel.name,
        type: channel.type,
        description: channel.description,
        serverId: channel.serverId,
        position: channel.position,
        createdAt: channel.createdAt
      }
    });
  } catch (error) {
    console.error('Create channel error:', error);
    res.status(500).json({ error: 'Failed to create channel' });
  }
});

// Update a channel
router.patch('/:channelId', authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params;
    const { name, description, position } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const updates = {};
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: 'Channel name cannot be empty' });
      }
      updates.name = name.trim();
    }
    if (description !== undefined) updates.description = description;
    if (position !== undefined) updates.position = position;

    await channel.update(updates);

    res.json({
      message: 'Channel updated successfully',
      channel
    });
  } catch (error) {
    console.error('Update channel error:', error);
    res.status(500).json({ error: 'Failed to update channel' });
  }
});

// Delete a channel
router.delete('/:channelId', authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    await channel.delete();

    res.json({ message: 'Channel deleted successfully' });
  } catch (error) {
    console.error('Delete channel error:', error);
    res.status(500).json({ error: 'Failed to delete channel' });
  }
});

module.exports = router;
