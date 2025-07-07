import { mockChannels, generateRandomChannels, channelTemplates } from '../mocks/channelData';

/**
 * Mock API utilities for simulating server responses
 */

// Simulate API delay
const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockApi = {
  channels: {
    // Get all channels (simulates authenticated API call)
    getAll: async (delay = 1000) => {
      await simulateDelay(delay);
      return {
        data: {
          channels: mockChannels,
          total: mockChannels.length,
          page: 1,
          limit: 50
        }
      };
    },

    // Get demo channels (simulates demo API call)
    getDemo: async (delay = 500) => {
      await simulateDelay(delay);
      const demoChannels = mockChannels.slice(0, 6); // First 6 channels for demo
      return {
        data: {
          channels: demoChannels,
          total: demoChannels.length,
          isDemo: true
        }
      };
    },

    // Create new channel (simulates API call)
    create: async (channelData, delay = 800) => {
      await simulateDelay(delay);
      
      // Simulate validation
      if (!channelData.name || channelData.name.trim().length === 0) {
        throw new Error('Channel name is required');
      }
      
      if (channelData.name.length > 50) {
        throw new Error('Channel name is too long');
      }

      const newChannel = {
        id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: channelData.name.toLowerCase().replace(/\s+/g, '-'),
        type: channelData.type || 'text',
        description: channelData.description || '',
        serverId: channelData.serverId || 'demo-server',
        memberCount: 1,
        isPublic: channelData.isPublic !== undefined ? channelData.isPublic : true,
        category: channelData.category || 'General',
        botEnabled: channelData.botEnabled || false,
        botType: channelData.botType || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user'
      };

      return {
        data: {
          channel: newChannel,
          message: 'Channel created successfully'
        }
      };
    },

    // Update channel (simulates API call)
    update: async (channelId, updates, delay = 600) => {
      await simulateDelay(delay);
      
      const updatedChannel = {
        id: channelId,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      return {
        data: {
          channel: updatedChannel,
          message: 'Channel updated successfully'
        }
      };
    },

    // Delete channel (simulates API call)
    delete: async (channelId, delay = 500) => {
      await simulateDelay(delay);
      
      return {
        data: {
          message: 'Channel deleted successfully',
          deletedChannelId: channelId
        }
      };
    },

    // Get random channels
    getRandom: async (count = 5, delay = 800) => {
      await simulateDelay(delay);
      const randomChannels = generateRandomChannels(count);
      
      return {
        data: {
          channels: randomChannels,
          total: randomChannels.length
        }
      };
    },

    // Get templates
    getTemplates: async (delay = 200) => {
      await simulateDelay(delay);
      
      return {
        data: {
          templates: channelTemplates,
          total: channelTemplates.length
        }
      };
    },

    // Create from template
    createFromTemplate: async (templateName, customData = {}, delay = 700) => {
      await simulateDelay(delay);
      
      const template = channelTemplates.find(t => t.name === templateName);
      if (!template) {
        throw new Error(`Template "${templateName}" not found`);
      }

      const newChannel = {
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...template,
        ...customData,
        serverId: customData.serverId || 'demo-server',
        memberCount: 1,
        isPublic: template.isPublic !== undefined ? template.isPublic : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current-user'
      };

      return {
        data: {
          channel: newChannel,
          template: templateName,
          message: `Channel created from ${templateName} template`
        }
      };
    }
  },

  // Simulate network errors
  simulateError: async (errorType = 'network', delay = 1000) => {
    await simulateDelay(delay);
    
    const errors = {
      network: new Error('Network error: Unable to connect to server'),
      unauthorized: new Error('Unauthorized: Please log in'),
      forbidden: new Error('Forbidden: Insufficient permissions'),
      notFound: new Error('Not found: Channel does not exist'),
      validation: new Error('Validation error: Invalid channel data'),
      server: new Error('Server error: Internal server error')
    };

    throw errors[errorType] || errors.network;
  }
};

// Helper to create a mock API interceptor for development
export const createMockApiInterceptor = (useRealApi = false) => {
  if (useRealApi) {
    return null; // Use real API
  }

  return {
    channels: {
      getAll: () => mockApi.channels.getAll(),
      getDemo: () => mockApi.channels.getDemo(),
      create: (data) => mockApi.channels.create(data),
      update: (id, data) => mockApi.channels.update(id, data),
      delete: (id) => mockApi.channels.delete(id)
    }
  };
};

// Development utility to switch between mock and real API
export const withMockData = (apiCall, mockCall, useMock = process.env.NODE_ENV === 'development') => {
  return useMock ? mockCall() : apiCall();
};

export default mockApi;
