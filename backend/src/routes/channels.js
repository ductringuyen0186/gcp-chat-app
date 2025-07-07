const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Channel = require('../models/Channel');
const router = express.Router();

// Function to generate rich demo channels
const generateDemoChannels = () => {
  const baseChannels = [
    {
      id: 'demo-general',
      name: 'general',
      type: 'text',
      description: '💬 General discussion for everyone',
      serverId: 'demo-server',
      memberCount: 156,
      isPublic: true,
      category: 'General',
      botEnabled: false,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-random',
      name: 'random',
      type: 'text',
      description: '🎲 Random conversations and off-topic discussions',
      serverId: 'demo-server',
      memberCount: 89,
      isPublic: true,
      category: 'General',
      botEnabled: false,
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-announcements',
      name: 'announcements',
      type: 'text',
      description: '📢 Important server announcements and updates',
      serverId: 'demo-server',
      memberCount: 201,
      isPublic: true,
      category: 'Information',
      botEnabled: false,
      permissions: { readOnly: true },
      createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-music',
      name: 'music-bot',
      type: 'music',
      description: '🎵 Play and control music with our bot',
      serverId: 'demo-server',
      memberCount: 134,
      isPublic: true,
      category: 'Entertainment',
      botEnabled: true,
      botType: 'music',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-tech',
      name: 'tech-talk',
      type: 'text',
      description: '💻 Discuss programming, tech news, and development',
      serverId: 'demo-server',
      memberCount: 67,
      isPublic: true,
      category: 'Development',
      botEnabled: false,
      createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-gaming',
      name: 'gaming',
      type: 'text',
      description: '🎮 Gaming discussions, LFG, and game reviews',
      serverId: 'demo-server',
      memberCount: 112,
      isPublic: true,
      category: 'Entertainment',
      botEnabled: true,
      botType: 'gaming',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-help',
      name: 'help-support',
      type: 'text',
      description: '❓ Get help and support from community members',
      serverId: 'demo-server',
      memberCount: 45,
      isPublic: true,
      category: 'Support',
      botEnabled: true,
      botType: 'support',
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-voice',
      name: 'voice-lounge',
      type: 'voice',
      description: '🎤 General voice chat and hangout space',
      serverId: 'demo-server',
      memberCount: 156,
      isPublic: true,
      category: 'Voice',
      botEnabled: false,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-showcase',
      name: 'project-showcase',
      type: 'text',
      description: '🚀 Share your projects and get feedback',
      serverId: 'demo-server',
      memberCount: 78,
      isPublic: true,
      category: 'Development',
      botEnabled: false,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-art',
      name: 'art-creativity',
      type: 'text',
      description: '🎨 Share artwork, designs, and creative projects',
      serverId: 'demo-server',
      memberCount: 93,
      isPublic: true,
      category: 'Creative',
      botEnabled: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Generate additional random channels
  const channelTypes = ['text', 'voice'];
  const categories = ['General', 'Development', 'Entertainment', 'Support', 'Creative', 'Education', 'Voice'];
  const adjectives = ['awesome', 'cool', 'fun', 'amazing', 'epic', 'great', 'fantastic', 'brilliant', 'stellar', 'incredible'];
  const nouns = ['chat', 'discussion', 'room', 'space', 'zone', 'hub', 'corner', 'lounge', 'hangout', 'spot'];
  const emojis = ['🚀', '💫', '⭐', '🔥', '💎', '🌟', '✨', '🎯', '🎪', '🎨', '🎵', '📱', '💻', '🎮', '📚', '🏆', '🌈', '⚡'];

  const additionalChannels = [];
  const count = 15; // Generate 15 additional channels

  for (let i = 0; i < count; i++) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const type = channelTypes[Math.floor(Math.random() * channelTypes.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const channelId = `demo-generated-${i + 1}`;
    const channelName = `${adjective}-${noun}`;
    
    additionalChannels.push({
      id: channelId,
      name: channelName,
      type: type,
      description: `${emoji} ${adjective.charAt(0).toUpperCase() + adjective.slice(1)} ${noun} for community members`,
      serverId: 'demo-server',
      memberCount: Math.floor(Math.random() * 200) + 10,
      isPublic: Math.random() > 0.2, // 80% chance of being public
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: `demo-user-${Math.floor(Math.random() * 10) + 1}`,
      botEnabled: Math.random() > 0.6, // 40% chance of having bot enabled
      botType: Math.random() > 0.5 ? 'general' : type,
      category: category
    });
  }

  return [...baseChannels, ...additionalChannels];
};

// Demo channels endpoint (no auth required) - for testing
router.get('/demo', async (req, res) => {
  try {
    const demoChannels = generateDemoChannels();

    // Pagination support
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedChannels = demoChannels.slice(startIndex, endIndex);

    res.json({ channels: paginatedChannels });
  } catch (error) {
    console.error('Get demo channels error:', error);
    res.status(500).json({ error: 'Failed to fetch demo channels' });
  }
});

// Enhanced demo channels endpoint with pagination and filtering
router.get('/demo/enhanced', async (req, res) => {
  try {
    const { page = 0, limit = 20, search, category, type } = req.query;
    let demoChannels = generateDemoChannels();

    // Apply filters
    if (search) {
      const searchTerm = search.toLowerCase();
      demoChannels = demoChannels.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm) ||
        channel.description.toLowerCase().includes(searchTerm)
      );
    }

    if (category) {
      demoChannels = demoChannels.filter(channel => channel.category === category);
    }

    if (type) {
      demoChannels = demoChannels.filter(channel => channel.type === type);
    }

    // Apply pagination
    const startIndex = parseInt(page) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedChannels = demoChannels.slice(startIndex, endIndex);

    res.json({ 
      channels: paginatedChannels,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: demoChannels.length,
        totalPages: Math.ceil(demoChannels.length / parseInt(limit)),
        hasMore: endIndex < demoChannels.length
      },
      stats: {
        total: demoChannels.length,
        byType: demoChannels.reduce((acc, channel) => {
          acc[channel.type] = (acc[channel.type] || 0) + 1;
          return acc;
        }, {}),
        byCategory: demoChannels.reduce((acc, channel) => {
          acc[channel.category] = (acc[channel.category] || 0) + 1;
          return acc;
        }, {}),
        withBots: demoChannels.filter(c => c.botEnabled).length,
        public: demoChannels.filter(c => c.isPublic).length,
        private: demoChannels.filter(c => !c.isPublic).length
      }
    });
  } catch (error) {
    console.error('Get enhanced demo channels error:', error);
    res.status(500).json({ error: 'Failed to fetch enhanced demo channels' });
  }
});

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
    const { name, type = 'text', description = '', serverId = 'default', botEnabled = false, botType = null } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Channel name is required' });
    }

    if (name.length > 100) {
      return res.status(400).json({ error: 'Channel name too long (max 100 characters)' });
    }

    if (!['text', 'voice', 'music'].includes(type)) {
      return res.status(400).json({ error: 'Invalid channel type' });
    }

    if (type === 'music' && !botEnabled) {
      return res.status(400).json({ error: 'Music channels require a bot' });
    }

    const channel = await Channel.create({
      name: name.trim(),
      type,
      description,
      serverId,
      position: 0,
      botEnabled,
      botType
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
        createdAt: channel.createdAt,
        botEnabled: channel.botEnabled,
        botType: channel.botType
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
