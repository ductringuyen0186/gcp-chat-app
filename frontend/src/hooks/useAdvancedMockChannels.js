import { useState, useEffect, useCallback, useRef } from 'react';
import mockChannelManager from '../utils/mockChannelManager';

/**
 * Hook for managing channels with advanced mock data features
 * Supports pagination, search, filtering, and real-time updates
 */
export const useAdvancedMockChannels = (options = {}) => {
  const {
    initialLoad = true,
    pageSize = 10,
    totalChannels = 50,
    autoInitialize = true
  } = options;

  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize,
    totalPages: 0,
    total: 0,
    hasMore: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState({});
  const [error, setError] = useState(null);

  const isInitializing = useRef(false);

  // Initialize the mock channel manager
  const initialize = useCallback(async () => {
    if (isInitializing.current || initialized) return;
    
    try {
      isInitializing.current = true;
      setLoading(true);
      setError(null);

      await mockChannelManager.initialize(totalChannels);
      setInitialized(true);
      
      // Update stats
      setStats(mockChannelManager.getStats());

      if (initialLoad) {
        // Load initial channels after initialization
        const result = await mockChannelManager.loadChannels({
          pageSize,
          reset: true
        });
        setChannels(result.channels);
        setPagination(result.pagination);
      }
    } catch (err) {
      console.error('Failed to initialize mock channels:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      isInitializing.current = false;
    }
  }, [totalChannels, initialLoad, initialized, pageSize]);

  // Load channels with options
  const loadChannels = useCallback(async (loadOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await mockChannelManager.loadChannels({
        pageSize,
        search: searchQuery,
        filters,
        ...loadOptions
      });

      if (result) {
        if (loadOptions.reset) {
          setChannels(result.channels || []);
        } else {
          setChannels(result.loadedChannels || []);
        }

        setPagination(result.pagination || {});
        setStats(mockChannelManager.getStats());
      }

      return result;
    } catch (err) {
      console.error('Failed to load channels:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pageSize, searchQuery, filters]);

  // Load more channels (for infinite scroll)
  const loadMore = useCallback(async () => {
    if (!pagination.hasMore || loading) return;

    try {
      const result = await mockChannelManager.loadMore();
      if (result && result.loadedChannels) {
        setChannels(result.loadedChannels);
        setPagination(result.pagination);
        setStats(mockChannelManager.getStats());
        return result;
      }
      return null;
    } catch (err) {
      console.error('Failed to load more channels:', err);
      setError(err.message);
      throw err;
    }
  }, [pagination.hasMore, loading]);

  // Search channels
  const searchChannels = useCallback(async (query) => {
    setSearchQuery(query);
    return loadChannels({ 
      search: query, 
      reset: true, 
      page: 0 
    });
  }, [loadChannels]);

  // Apply filters
  const applyFilters = useCallback(async (newFilters) => {
    setFilters(newFilters);
    return loadChannels({ 
      filters: newFilters, 
      reset: true, 
      page: 0 
    });
  }, [loadChannels]);

  // Create new channel
  const createChannel = useCallback(async (channelData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await mockChannelManager.createChannel(channelData);
      
      // Update local state
      if (result && result.channel) {
        setChannels(prev => [result.channel, ...prev]);
        setStats(mockChannelManager.getStats());
      }

      return result;
    } catch (err) {
      console.error('Failed to create channel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create channel from template
  const createFromTemplate = useCallback(async (templateName, customData = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await mockChannelManager.createFromTemplate(templateName, customData);
      
      // Update local state
      if (result && result.channel) {
        setChannels(prev => [result.channel, ...prev]);
        setStats(mockChannelManager.getStats());
      }

      return result;
    } catch (err) {
      console.error('Failed to create channel from template:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update channel
  const updateChannel = useCallback(async (channelId, updates) => {
    try {
      setLoading(true);
      setError(null);

      const result = await mockChannelManager.updateChannel(channelId, updates);
      
      // Update local state
      setChannels(prev => prev.map(channel => 
        channel.id === channelId ? result.channel : channel
      ));
      setStats(mockChannelManager.getStats());

      return result;
    } catch (err) {
      console.error('Failed to update channel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete channel
  const deleteChannel = useCallback(async (channelId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await mockChannelManager.deleteChannel(channelId);
      
      // Update local state
      setChannels(prev => prev.filter(channel => channel.id !== channelId));
      setStats(mockChannelManager.getStats());

      return result;
    } catch (err) {
      console.error('Failed to delete channel:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get channel by ID
  const getChannel = useCallback((channelId) => {
    return mockChannelManager.getChannel(channelId);
  }, []);

  // Get channels by category
  const getChannelsByCategory = useCallback(() => {
    return mockChannelManager.getChannelsByCategory();
  }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    mockChannelManager.reset();
    setChannels([]);
    setInitialized(false);
    setPagination({
      currentPage: 0,
      pageSize,
      totalPages: 0,
      total: 0,
      hasMore: false
    });
    setSearchQuery('');
    setFilters({});
    setStats({});
    setError(null);
  }, [pageSize]);

  // Auto-initialize on mount
  useEffect(() => {
    if (autoInitialize && !initialized && !isInitializing.current) {
      initialize();
    }
  }, [autoInitialize, initialized, initialize]);

  return {
    // Data
    channels,
    pagination,
    searchQuery,
    filters,
    stats,
    error,
    
    // State
    loading,
    initialized,
    
    // Actions
    initialize,
    loadChannels,
    loadMore,
    searchChannels,
    applyFilters,
    createChannel,
    createFromTemplate,
    updateChannel,
    deleteChannel,
    reset,
    
    // Getters
    getChannel,
    getChannelsByCategory,
    
    // Templates
    availableTemplates: mockChannelManager.getTemplates()
  };
};

export default useAdvancedMockChannels;
