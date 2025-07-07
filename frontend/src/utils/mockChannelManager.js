// Enhanced mock channel management system
import { mockChannels, generateRandomChannels, channelTemplates } from '../mocks/channelData';

/**
 * Mock Channel Manager - Provides advanced mock data management
 * for channels with pagination, search, and dynamic loading
 */
class MockChannelManager {
  constructor() {
    this.channels = [...mockChannels];
    this.loadedChannels = [];
    this.currentPage = 0;
    this.pageSize = 10;
    this.totalChannels = 0;
    this.searchQuery = '';
    this.filters = {};
    this.loadingState = false;
  }

  // Initialize with additional random channels
  async initialize(totalChannels = 50) {
    this.loadingState = true;
    
    // Generate additional channels if needed
    const additionalCount = Math.max(0, totalChannels - this.channels.length);
    if (additionalCount > 0) {
      const additionalChannels = generateRandomChannels(additionalCount);
      this.channels.push(...additionalChannels);
    }
    
    this.totalChannels = this.channels.length;
    this.loadingState = false;
    
    return {
      total: this.totalChannels,
      initialized: true
    };
  }

  // Load channels with pagination
  async loadChannels(options = {}) {
    const {
      page = 0,
      pageSize = this.pageSize,
      search = '',
      filters = {},
      reset = false
    } = options;

    this.loadingState = true;
    
    // Simulate network delay (but not in test environment)
    if (process.env.NODE_ENV !== 'test') {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    }

    if (reset) {
      this.loadedChannels = [];
      this.currentPage = 0;
    }

    // Apply search and filters
    let filteredChannels = this.channels;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredChannels = filteredChannels.filter(channel =>
        channel.name.toLowerCase().includes(searchLower) ||
        channel.description.toLowerCase().includes(searchLower)
      );
    }

    if (Object.keys(filters).length > 0) {
      filteredChannels = filteredChannels.filter(channel => {
        if (filters.type && channel.type !== filters.type) return false;
        if (filters.category && channel.category !== filters.category) return false;
        if (filters.botEnabled !== undefined && channel.botEnabled !== filters.botEnabled) return false;
        if (filters.isPublic !== undefined && channel.isPublic !== filters.isPublic) return false;
        return true;
      });
    }

    // Paginate results
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const pageChannels = filteredChannels.slice(startIndex, endIndex);

    if (reset) {
      this.loadedChannels = pageChannels;
    } else {
      this.loadedChannels.push(...pageChannels);
    }

    this.currentPage = page;
    this.searchQuery = search;
    this.filters = filters;
    this.loadingState = false;

    return {
      channels: pageChannels,
      loadedChannels: this.loadedChannels,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(filteredChannels.length / pageSize),
        total: filteredChannels.length,
        hasMore: endIndex < filteredChannels.length
      },
      search,
      filters
    };
  }

  // Load more channels (for infinite scroll)
  async loadMore() {
    return this.loadChannels({
      page: this.currentPage + 1,
      search: this.searchQuery,
      filters: this.filters
    });
  }

  // Create a new channel
  async createChannel(channelData) {
    this.loadingState = true;
    
    // Simulate network delay (but not in test environment)
    if (process.env.NODE_ENV !== 'test') {
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    }

    const newChannel = {
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: channelData.name || 'new-channel',
      type: channelData.type || 'text',
      description: channelData.description || 'A new channel',
      serverId: 'demo-server',
      memberCount: Math.floor(Math.random() * 10) + 1,
      isPublic: channelData.isPublic !== undefined ? channelData.isPublic : true,
      category: channelData.category || 'General',
      botEnabled: channelData.botEnabled || false,
      botType: channelData.botType || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'demo-user',
      ...channelData
    };

    // Add to the beginning of the channels array
    this.channels.unshift(newChannel);
    this.loadedChannels.unshift(newChannel);
    this.totalChannels++;

    this.loadingState = false;

    return {
      channel: newChannel,
      success: true
    };
  }

  // Create channel from template
  async createFromTemplate(templateName, customData = {}) {
    const template = channelTemplates.find(t => t.name === templateName);
    if (!template) {
      throw new Error(`Template "${templateName}" not found`);
    }

    return this.createChannel({
      ...template,
      ...customData
    });
  }

  // Update channel
  async updateChannel(channelId, updates) {
    this.loadingState = true;
    
    // Simulate network delay
    // Simulate network delay (but not in test environment)
    if (process.env.NODE_ENV !== 'test') {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 500));
    }

    const channelIndex = this.channels.findIndex(c => c.id === channelId);
    const loadedIndex = this.loadedChannels.findIndex(c => c.id === channelId);

    if (channelIndex === -1) {
      this.loadingState = false;
      throw new Error('Channel not found');
    }

    const updatedChannel = {
      ...this.channels[channelIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.channels[channelIndex] = updatedChannel;
    if (loadedIndex !== -1) {
      this.loadedChannels[loadedIndex] = updatedChannel;
    }

    this.loadingState = false;

    return {
      channel: updatedChannel,
      success: true
    };
  }

  // Delete channel
  async deleteChannel(channelId) {
    this.loadingState = true;
    
    // Simulate network delay
    // Simulate network delay (but not in test environment)
    if (process.env.NODE_ENV !== 'test') {
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    }

    this.channels = this.channels.filter(c => c.id !== channelId);
    this.loadedChannels = this.loadedChannels.filter(c => c.id !== channelId);
    this.totalChannels--;

    this.loadingState = false;

    return {
      success: true,
      deletedId: channelId
    };
  }

  // Get channel by ID
  getChannel(channelId) {
    return this.channels.find(c => c.id === channelId);
  }

  // Get channels by category
  getChannelsByCategory() {
    return this.channels.reduce((acc, channel) => {
      const category = channel.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(channel);
      return acc;
    }, {});
  }

  // Get statistics
  getStats() {
    return {
      total: this.totalChannels,
      loaded: this.loadedChannels.length,
      byType: this.channels.reduce((acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1;
        return acc;
      }, {}),
      byCategory: this.channels.reduce((acc, c) => {
        const cat = c.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {}),
      withBots: this.channels.filter(c => c.botEnabled).length,
      public: this.channels.filter(c => c.isPublic).length,
      private: this.channels.filter(c => !c.isPublic).length
    };
  }

  // Reset to initial state
  reset() {
    this.channels = [...mockChannels];
    this.loadedChannels = [];
    this.currentPage = 0;
    this.totalChannels = this.channels.length;
    this.searchQuery = '';
    this.filters = {};
    this.loadingState = false;
  }

  // Get loading state
  isLoading() {
    return this.loadingState;
  }

  // Get available templates
  getTemplates() {
    return channelTemplates;
  }
}

// Create singleton instance
const mockChannelManager = new MockChannelManager();

export default mockChannelManager;
export { MockChannelManager };
