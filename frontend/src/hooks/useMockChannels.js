import { useState, useCallback } from 'react';
import { mockChannels, generateRandomChannels, channelTemplates, filterChannels } from '../mocks/channelData';

/**
 * Hook for managing mock channel data
 * Useful for testing, demo mode, and development
 */
export const useMockChannels = (initialChannels = mockChannels) => {
  const [channels, setChannels] = useState(initialChannels);
  const [loading, setLoading] = useState(false);

  // Load mock channels (simulates API call)
  const loadMockChannels = useCallback(async (delay = 1000) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    setChannels(mockChannels);
    setLoading(false);
    
    return mockChannels;
  }, []);

  // Add a new mock channel
  const addMockChannel = useCallback((channelData) => {
    const newChannel = {
      id: `mock-${Date.now()}`,
      name: channelData.name || 'new-channel',
      type: channelData.type || 'text',
      description: channelData.description || 'A new channel',
      serverId: 'demo-server',
      memberCount: Math.floor(Math.random() * 50) + 1,
      isPublic: channelData.isPublic !== undefined ? channelData.isPublic : true,
      category: channelData.category || 'General',
      botEnabled: channelData.botEnabled || false,
      botType: channelData.botType || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'mock-user',
      ...channelData
    };

    setChannels(prev => [...prev, newChannel]);
    return newChannel;
  }, []);

  // Generate random channels
  const generateMockChannels = useCallback((count = 5) => {
    const newChannels = generateRandomChannels(count);
    setChannels(prev => [...prev, ...newChannels]);
    return newChannels;
  }, []);

  // Create channel from template
  const createFromTemplate = useCallback((templateName) => {
    const template = channelTemplates.find(t => t.name === templateName);
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    return addMockChannel(template);
  }, [addMockChannel]);

  // Remove a channel
  const removeMockChannel = useCallback((channelId) => {
    setChannels(prev => prev.filter(channel => channel.id !== channelId));
  }, []);

  // Update a channel
  const updateMockChannel = useCallback((channelId, updates) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, ...updates, updatedAt: new Date().toISOString() }
        : channel
    ));
  }, []);

  // Clear all channels
  const clearMockChannels = useCallback(() => {
    setChannels([]);
  }, []);

  // Reset to default channels
  const resetMockChannels = useCallback(() => {
    setChannels(mockChannels);
  }, []);

  // Filter channels
  const getFilteredChannels = useCallback((filters) => {
    return filterChannels(channels, filters);
  }, [channels]);

  // Get channels by category
  const getChannelsByCategory = useCallback(() => {
    return channels.reduce((acc, channel) => {
      const category = channel.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(channel);
      return acc;
    }, {});
  }, [channels]);

  // Get channel statistics
  const getChannelStats = useCallback(() => {
    const stats = {
      total: channels.length,
      byType: {},
      byCategory: {},
      withBots: 0,
      totalMembers: 0,
      averageMembers: 0
    };

    channels.forEach(channel => {
      // Count by type
      stats.byType[channel.type] = (stats.byType[channel.type] || 0) + 1;
      
      // Count by category
      const category = channel.category || 'Uncategorized';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      
      // Count bots
      if (channel.botEnabled) {
        stats.withBots++;
      }
      
      // Sum members
      stats.totalMembers += channel.memberCount || 0;
    });

    stats.averageMembers = stats.total > 0 ? Math.round(stats.totalMembers / stats.total) : 0;

    return stats;
  }, [channels]);

  return {
    channels,
    loading,
    
    // Actions
    loadMockChannels,
    addMockChannel,
    generateMockChannels,
    createFromTemplate,
    removeMockChannel,
    updateMockChannel,
    clearMockChannels,
    resetMockChannels,
    
    // Getters
    getFilteredChannels,
    getChannelsByCategory,
    getChannelStats,
    
    // Templates
    availableTemplates: channelTemplates.map(t => t.name)
  };
};

export default useMockChannels;
