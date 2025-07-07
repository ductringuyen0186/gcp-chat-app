import { renderHook, act, waitFor } from '@testing-library/react';
import { useAdvancedMockChannels } from './useAdvancedMockChannels';

// Mock the mockChannelManager
jest.mock('../utils/mockChannelManager', () => {
  const mockChannels = [
    { id: '1', name: 'general', type: 'text', category: 'General', memberCount: 100, isPublic: true, botEnabled: false },
    { id: '2', name: 'random', type: 'text', category: 'General', memberCount: 50, isPublic: true, botEnabled: false },
    { id: '3', name: 'music', type: 'voice', category: 'Entertainment', memberCount: 25, isPublic: true, botEnabled: true }
  ];

  return {
    __esModule: true,
    default: {
      initialize: jest.fn().mockResolvedValue({ total: 50, initialized: true }),
      loadChannels: jest.fn().mockResolvedValue({
        channels: mockChannels,
        loadedChannels: mockChannels,
        pagination: {
          currentPage: 0,
          pageSize: 10,
          totalPages: 1,
          total: 3,
          hasMore: false
        }
      }),
      loadMore: jest.fn().mockResolvedValue({
        channels: [],
        loadedChannels: mockChannels,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          totalPages: 1,
          total: 3,
          hasMore: false
        }
      }),
      createChannel: jest.fn().mockResolvedValue({
        channel: { id: '4', name: 'new-channel', type: 'text', category: 'General', memberCount: 1, isPublic: true, botEnabled: false },
        success: true
      }),
      createFromTemplate: jest.fn().mockResolvedValue({
        channel: { id: '5', name: 'welcome', type: 'text', category: 'Information', memberCount: 20, isPublic: true, botEnabled: true },
        success: true
      }),
      updateChannel: jest.fn().mockResolvedValue({
        channel: { id: '1', name: 'general-updated', type: 'text', category: 'General', memberCount: 100, isPublic: true, botEnabled: false },
        success: true
      }),
      deleteChannel: jest.fn().mockResolvedValue({
        success: true,
        deletedId: '1'
      }),
      getChannel: jest.fn().mockReturnValue(mockChannels[0]),
      getChannelsByCategory: jest.fn().mockReturnValue({ General: mockChannels.slice(0, 2), Entertainment: [mockChannels[2]] }),
      getStats: jest.fn().mockReturnValue({
        total: 3,
        loaded: 3,
        byType: { text: 2, voice: 1 },
        byCategory: { General: 2, Entertainment: 1 },
        withBots: 1,
        public: 3,
        private: 0
      }),
      getTemplates: jest.fn().mockReturnValue([
        { name: 'welcome', type: 'text', category: 'Information' },
        { name: 'general', type: 'text', category: 'General' }
      ]),
      reset: jest.fn(),
      isLoading: jest.fn().mockReturnValue(false)
    }
  };
});

describe('useAdvancedMockChannels', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize and load channels', async () => {
    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: true,
      initialLoad: true,
      pageSize: 10,
      totalChannels: 50
    }));

    // Initially should be loading and not initialized
    expect(result.current.loading).toBe(false); // Will be set to true during initialization
    expect(result.current.initialized).toBe(false);
    expect(result.current.channels).toEqual([]);

    // Wait for initialization
    await waitFor(() => {
      expect(result.current.initialized).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.channels.length).toBeGreaterThan(0);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.channels).toHaveLength(3);
    expect(result.current.pagination.total).toBe(3);
  });

  it('should search channels', async () => {
    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: false,
      initialLoad: false
    }));

    await act(async () => {
      await result.current.initialize();
    });

    await act(async () => {
      await result.current.searchChannels('general');
    });

    expect(result.current.searchQuery).toBe('general');
  });

  it('should apply filters', async () => {
    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: false,
      initialLoad: false
    }));

    await act(async () => {
      await result.current.initialize();
    });

    await act(async () => {
      await result.current.applyFilters({ type: 'text' });
    });

    expect(result.current.filters).toEqual({ type: 'text' });
  });

  it('should create a new channel', async () => {
    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: false,
      initialLoad: false
    }));

    await act(async () => {
      await result.current.initialize();
    });

    const channelData = {
      name: 'test-channel',
      type: 'text',
      description: 'Test channel',
      category: 'General'
    };

    await act(async () => {
      await result.current.createChannel(channelData);
    });

    // The mock returns a success response
    expect(result.current.channels).toHaveLength(4); // 3 initial + 1 new
  });

  it('should create channel from template', async () => {
    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: false,
      initialLoad: false
    }));

    await act(async () => {
      await result.current.initialize();
    });

    await act(async () => {
      await result.current.createFromTemplate('welcome');
    });

    expect(result.current.channels).toHaveLength(4); // 3 initial + 1 from template
  });

  it('should update a channel', async () => {
    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: false,
      initialLoad: false
    }));

    await act(async () => {
      await result.current.initialize();
    });

    await act(async () => {
      await result.current.updateChannel('1', { name: 'general-updated' });
    });

    const updatedChannel = result.current.channels.find(c => c.id === '1');
    expect(updatedChannel.name).toBe('general-updated');
  });

  it('should delete a channel', async () => {
    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: false,
      initialLoad: false
    }));

    await act(async () => {
      await result.current.initialize();
    });

    await act(async () => {
      await result.current.deleteChannel('1');
    });

    expect(result.current.channels).toHaveLength(2); // 3 initial - 1 deleted
    expect(result.current.channels.find(c => c.id === '1')).toBeUndefined();
  });

  it('should load more channels', async () => {
    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: false,
      initialLoad: false
    }));

    await act(async () => {
      await result.current.initialize();
    });

    // Mock pagination with hasMore = true
    result.current.pagination.hasMore = true;

    await act(async () => {
      await result.current.loadMore();
    });

    // The mock doesn't add more channels, but the function should be called
    expect(result.current.pagination.currentPage).toBe(1);
  });

  it('should reset to initial state', async () => {
    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: false,
      initialLoad: false
    }));

    await act(async () => {
      await result.current.initialize();
    });

    // Make some changes
    await act(async () => {
      await result.current.searchChannels('test');
    });

    await act(async () => {
      result.current.reset();
    });

    expect(result.current.channels).toEqual([]);
    expect(result.current.initialized).toBe(false);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.filters).toEqual({});
  });

  it('should get channel by ID', async () => {
    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: false,
      initialLoad: false
    }));

    await act(async () => {
      await result.current.initialize();
    });

    const channel = result.current.getChannel('1');
    expect(channel).toBeDefined();
    expect(channel.id).toBe('1');
  });

  it('should get channels by category', async () => {
    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: false,
      initialLoad: false
    }));

    await act(async () => {
      await result.current.initialize();
    });

    const channelsByCategory = result.current.getChannelsByCategory();
    expect(channelsByCategory).toHaveProperty('General');
    expect(channelsByCategory).toHaveProperty('Entertainment');
  });

  it('should provide available templates', () => {
    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: false,
      initialLoad: false
    }));

    expect(result.current.availableTemplates).toHaveLength(2);
    expect(result.current.availableTemplates[0]).toHaveProperty('name', 'welcome');
  });

  it('should handle errors gracefully', async () => {
    // Mock an error
    const mockChannelManager = require('../utils/mockChannelManager').default;
    mockChannelManager.initialize.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAdvancedMockChannels({
      autoInitialize: true,
      initialLoad: true
    }));

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.initialized).toBe(false);
  });
});
