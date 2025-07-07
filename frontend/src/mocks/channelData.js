// Mock data for channels - useful for testing and demo mode

export const mockChannels = [
  {
    id: 'general-001',
    name: 'general',
    type: 'text',
    description: 'General discussion for everyone',
    serverId: 'demo-server',
    memberCount: 156,
    isPublic: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-06-29T14:30:00Z',
    createdBy: 'admin-001',
    botEnabled: false,
    category: 'General'
  },
  {
    id: 'random-002',
    name: 'random',
    type: 'text',
    description: 'Random conversations and off-topic discussions',
    serverId: 'demo-server',
    memberCount: 89,
    isPublic: true,
    createdAt: '2025-01-02T14:20:00Z',
    updatedAt: '2025-06-29T12:15:00Z',
    createdBy: 'admin-001',
    botEnabled: false,
    category: 'General'
  },
  {
    id: 'announcements-003',
    name: 'announcements',
    type: 'text',
    description: '📢 Important server announcements and updates',
    serverId: 'demo-server',
    memberCount: 201,
    isPublic: true,
    createdAt: '2025-01-01T10:05:00Z',
    updatedAt: '2025-06-28T16:45:00Z',
    createdBy: 'admin-001',
    botEnabled: false,
    category: 'Information',
    permissions: {
      readOnly: true,
      allowedRoles: ['admin', 'moderator']
    }
  },
  {
    id: 'music-bot-004',
    name: 'music-bot',
    type: 'music',
    description: '🎵 Play and control music with our bot',
    serverId: 'demo-server',
    memberCount: 134,
    isPublic: true,
    createdAt: '2025-01-03T09:30:00Z',
    updatedAt: '2025-06-29T11:20:00Z',
    createdBy: 'user-002',
    botEnabled: true,
    botType: 'music',
    category: 'Entertainment'
  },
  {
    id: 'tech-talk-005',
    name: 'tech-talk',
    type: 'text',
    description: '💻 Discuss programming, tech news, and development',
    serverId: 'demo-server',
    memberCount: 67,
    isPublic: true,
    createdAt: '2025-01-05T11:45:00Z',
    updatedAt: '2025-06-29T13:10:00Z',
    createdBy: 'user-003',
    botEnabled: false,
    category: 'Development'
  },
  {
    id: 'gaming-006',
    name: 'gaming',
    type: 'text',
    description: '🎮 Gaming discussions, LFG, and game reviews',
    serverId: 'demo-server',
    memberCount: 112,
    isPublic: true,
    createdAt: '2025-01-07T16:20:00Z',
    updatedAt: '2025-06-29T10:05:00Z',
    createdBy: 'user-004',
    botEnabled: true,
    botType: 'gaming',
    category: 'Entertainment'
  },
  {
    id: 'help-support-007',
    name: 'help-support',
    type: 'text',
    description: '❓ Get help and support from community members',
    serverId: 'demo-server',
    memberCount: 45,
    isPublic: true,
    createdAt: '2025-01-10T13:15:00Z',
    updatedAt: '2025-06-29T15:30:00Z',
    createdBy: 'admin-001',
    botEnabled: true,
    botType: 'support',
    category: 'Support'
  },
  {
    id: 'project-showcase-008',
    name: 'project-showcase',
    type: 'text',
    description: '🚀 Share your projects and get feedback',
    serverId: 'demo-server',
    memberCount: 78,
    isPublic: true,
    createdAt: '2025-01-12T10:30:00Z',
    updatedAt: '2025-06-29T09:45:00Z',
    createdBy: 'user-005',
    botEnabled: false,
    category: 'Development'
  },
  {
    id: 'art-creativity-009',
    name: 'art-creativity',
    type: 'text',
    description: '🎨 Share artwork, designs, and creative projects',
    serverId: 'demo-server',
    memberCount: 93,
    isPublic: true,
    createdAt: '2025-01-15T14:00:00Z',
    updatedAt: '2025-06-29T12:30:00Z',
    createdBy: 'user-006',
    botEnabled: false,
    category: 'Creative'
  },
  {
    id: 'voice-lounge-010',
    name: 'voice-lounge',
    type: 'voice',
    description: '🎤 General voice chat and hangout space',
    serverId: 'demo-server',
    memberCount: 156,
    isPublic: true,
    createdAt: '2025-01-18T12:00:00Z',
    updatedAt: '2025-06-29T14:15:00Z',
    createdBy: 'user-007',
    botEnabled: false,
    category: 'Voice'
  },
  {
    id: 'study-group-011',
    name: 'study-group',
    type: 'text',
    description: '📚 Study together and share educational resources',
    serverId: 'demo-server',
    memberCount: 34,
    isPublic: true,
    createdAt: '2025-01-20T15:30:00Z',
    updatedAt: '2025-06-29T11:00:00Z',
    createdBy: 'user-008',
    botEnabled: true,
    botType: 'study',
    category: 'Education'
  },
  {
    id: 'feedback-012',
    name: 'feedback',
    type: 'text',
    description: '💬 Share feedback and suggestions for the server',
    serverId: 'demo-server',
    memberCount: 28,
    isPublic: true,
    createdAt: '2025-01-22T09:15:00Z',
    updatedAt: '2025-06-29T13:45:00Z',
    createdBy: 'admin-001',
    botEnabled: false,
    category: 'Information'
  }
];

// Generate additional channels dynamically
export const generateRandomChannels = (count = 5) => {
  const channelTypes = ['text', 'voice', 'music'];
  const categories = ['General', 'Development', 'Entertainment', 'Support', 'Creative', 'Education'];
  const adjectives = ['awesome', 'cool', 'fun', 'amazing', 'epic', 'great', 'fantastic', 'brilliant'];
  const nouns = ['chat', 'discussion', 'room', 'space', 'zone', 'hub', 'corner', 'lounge'];
  const emojis = ['🚀', '💫', '⭐', '🔥', '💎', '🌟', '✨', '🎯', '🎪', '🎨', '🎵', '📱', '💻', '🎮'];

  const channels = [];
  
  for (let i = 0; i < count; i++) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const type = channelTypes[Math.floor(Math.random() * channelTypes.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const channelId = `generated-${Date.now()}-${i}`;
    const channelName = `${adjective}-${noun}`;
    
    channels.push({
      id: channelId,
      name: channelName,
      type: type,
      description: `${emoji} ${adjective.charAt(0).toUpperCase() + adjective.slice(1)} ${noun} for community members`,
      serverId: 'demo-server',
      memberCount: Math.floor(Math.random() * 200) + 10,
      isPublic: Math.random() > 0.2, // 80% chance of being public
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
      updatedAt: new Date().toISOString(),
      createdBy: `user-${Math.floor(Math.random() * 10) + 1}`,
      botEnabled: Math.random() > 0.6, // 40% chance of having bot enabled
      botType: Math.random() > 0.5 ? 'general' : type,
      category: category
    });
  }
  
  return channels;
};

// Predefined channel templates for quick creation
export const channelTemplates = [
  {
    name: 'welcome',
    type: 'text',
    description: '👋 Welcome new members to the server',
    category: 'Information',
    botEnabled: true,
    botType: 'welcome'
  },
  {
    name: 'rules',
    type: 'text',
    description: '📋 Server rules and guidelines',
    category: 'Information',
    permissions: { readOnly: true }
  },
  {
    name: 'memes',
    type: 'text',
    description: '😂 Share memes and funny content',
    category: 'Entertainment'
  },
  {
    name: 'dev-resources',
    type: 'text',
    description: '📖 Development resources and tutorials',
    category: 'Development'
  },
  {
    name: 'music-requests',
    type: 'text',
    description: '🎵 Request songs for the music bot',
    category: 'Entertainment',
    botEnabled: true,
    botType: 'music'
  },
  {
    name: 'screenshots',
    type: 'text',
    description: '📸 Share screenshots and images',
    category: 'Creative'
  },
  {
    name: 'polls',
    type: 'text',
    description: '📊 Community polls and voting',
    category: 'General',
    botEnabled: true,
    botType: 'poll'
  },
  {
    name: 'events',
    type: 'text',
    description: '📅 Server events and announcements',
    category: 'Information'
  }
];

// Helper function to get channels by category
export const getChannelsByCategory = (channels = mockChannels) => {
  return channels.reduce((acc, channel) => {
    const category = channel.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(channel);
    return acc;
  }, {});
};

// Helper function to filter channels
export const filterChannels = (channels = mockChannels, filters = {}) => {
  return channels.filter(channel => {
    if (filters.type && channel.type !== filters.type) return false;
    if (filters.category && channel.category !== filters.category) return false;
    if (filters.botEnabled !== undefined && channel.botEnabled !== filters.botEnabled) return false;
    if (filters.isPublic !== undefined && channel.isPublic !== filters.isPublic) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return channel.name.toLowerCase().includes(searchTerm) || 
             channel.description.toLowerCase().includes(searchTerm);
    }
    return true;
  });
};

export default mockChannels;
