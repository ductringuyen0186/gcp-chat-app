import React, { useState, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  Hash, 
  Volume2,
  Eye,
  EyeOff,
  Bot,
  RefreshCw,
  MoreVertical,
  TrendingUp
} from 'lucide-react';
import { useAdvancedMockChannels } from '../../hooks/useAdvancedMockChannels';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdvancedChannelDemo = () => {
  const {
    channels,
    pagination,
    searchQuery,
    filters,
    stats,
    error,
    loading,
    initialized,
    loadMore,
    searchChannels,
    applyFilters,
    createChannel,
    createFromTemplate,
    updateChannel,
    deleteChannel,
    reset,
    getChannelsByCategory,
    availableTemplates
  } = useAdvancedMockChannels({
    initialLoad: true,
    pageSize: 12,
    totalChannels: 100
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChannelData, setNewChannelData] = useState({
    name: '',
    type: 'text',
    description: '',
    category: 'General',
    isPublic: true,
    botEnabled: false,
    botType: ''
  });

  const searchInputRef = useRef(null);

  // Handle search
  const handleSearch = async (e) => {
    const query = e.target.value;
    try {
      await searchChannels(query);
    } catch (err) {
      toast.error('Search failed');
    }
  };

  // Handle filter changes
  const handleFilterChange = async (filterKey, value) => {
    const newFilters = { ...filters };
    if (value === '' || value === 'all') {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = value;
    }
    
    try {
      await applyFilters(newFilters);
    } catch (err) {
      toast.error('Filter failed');
    }
  };

  // Handle channel creation
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelData.name.trim()) {
      toast.error('Channel name is required');
      return;
    }

    try {
      await createChannel(newChannelData);
      setNewChannelData({
        name: '',
        type: 'text',
        description: '',
        category: 'General',
        isPublic: true,
        botEnabled: false,
        botType: ''
      });
      setShowCreateForm(false);
      toast.success('Channel created successfully!');
    } catch (err) {
      toast.error('Failed to create channel');
    }
  };

  // Handle create from template
  const handleCreateFromTemplate = async (templateName) => {
    try {
      await createFromTemplate(templateName);
      toast.success(`Channel created from ${templateName} template!`);
    } catch (err) {
      toast.error('Failed to create channel from template');
    }
  };

  // Handle channel update
  const handleEditChannel = async (channel) => {
    const newName = prompt('Enter new channel name:', channel.name);
    if (newName && newName !== channel.name) {
      try {
        await updateChannel(channel.id, { name: newName });
        toast.success('Channel updated successfully!');
      } catch (err) {
        toast.error('Failed to update channel');
      }
    }
  };

  // Handle channel deletion
  const handleDeleteChannel = async (channelId) => {
    if (!window.confirm('Are you sure you want to delete this channel?')) {
      return;
    }

    try {
      await deleteChannel(channelId);
      toast.success('Channel deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete channel');
    }
  };

  // Handle load more
  const handleLoadMore = async () => {
    try {
      await loadMore();
    } catch (err) {
      toast.error('Failed to load more channels');
    }
  };

  // Get channel categories
  const channelsByCategory = getChannelsByCategory();
  const categories = Object.keys(channelsByCategory);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Initializing mock channels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Channel Manager</h1>
            <p className="mt-2 text-gray-600">
              Comprehensive mock data management with pagination, search, and filters
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <Plus size={16} />
              <span>New Channel</span>
            </button>
            
            <button
              onClick={reset}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700"
            >
              <RefreshCw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <TrendingUp className="text-blue-600" size={20} />
              <span className="text-2xl font-bold text-blue-600">{stats.total || 0}</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">Total Channels</p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <Hash className="text-green-600" size={20} />
              <span className="text-2xl font-bold text-green-600">{stats.byType?.text || 0}</span>
            </div>
            <p className="text-sm text-green-600 mt-1">Text Channels</p>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <Volume2 className="text-purple-600" size={20} />
              <span className="text-2xl font-bold text-purple-600">{stats.byType?.voice || 0}</span>
            </div>
            <p className="text-sm text-purple-600 mt-1">Voice Channels</p>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <Bot className="text-orange-600" size={20} />
              <span className="text-2xl font-bold text-orange-600">{stats.withBots || 0}</span>
            </div>
            <p className="text-sm text-orange-600 mt-1">With Bots</p>
          </div>
          
          <div className="bg-indigo-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <Eye className="text-indigo-600" size={20} />
              <span className="text-2xl font-bold text-indigo-600">{stats.public || 0}</span>
            </div>
            <p className="text-sm text-indigo-600 mt-1">Public</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <EyeOff className="text-gray-600" size={20} />
              <span className="text-2xl font-bold text-gray-600">{stats.private || 0}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Private</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search channels..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={handleSearch}
              defaultValue={searchQuery}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="text">Text</option>
              <option value="voice">Voice</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.botEnabled !== undefined ? filters.botEnabled.toString() : ''}
              onChange={(e) => handleFilterChange('botEnabled', e.target.value === '' ? undefined : e.target.value === 'true')}
            >
              <option value="">All Bots</option>
              <option value="true">With Bots</option>
              <option value="false">No Bots</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Channels Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Channels ({pagination.total} total, {channels.length} loaded)
          </h2>
          
          {/* Template Quick Actions */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Quick create:</span>
            {availableTemplates.slice(0, 3).map(template => (
              <button
                key={template.name}
                onClick={() => handleCreateFromTemplate(template.name)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded"
                disabled={loading}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {loading && channels.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {channels.map(channel => (
                <div key={channel.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {channel.type === 'voice' ? (
                        <Volume2 className="text-green-600" size={16} />
                      ) : (
                        <Hash className="text-gray-600" size={16} />
                      )}
                      <h3 className="font-medium text-gray-900 truncate">{channel.name}</h3>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {channel.botEnabled && (
                        <Bot className="text-orange-500" size={14} />
                      )}
                      {!channel.isPublic && (
                        <EyeOff className="text-gray-500" size={14} />
                      )}
                      
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={14} />
                        </button>
                        <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <button
                            onClick={() => handleEditChannel(channel)}
                            className="block w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                          >
                            <Edit3 size={12} className="inline mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteChannel(channel.id)}
                            className="block w-full text-left px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={12} className="inline mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{channel.description}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users size={12} />
                        <span>{channel.memberCount}</span>
                      </div>
                      <span className="bg-gray-100 px-2 py-1 rounded">{channel.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {pagination.hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? <LoadingSpinner size="sm" /> : null}
                  <span>Load More ({pagination.total - channels.length} remaining)</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Channel Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Channel</h3>
            
            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newChannelData.name}
                  onChange={(e) => setNewChannelData({...newChannelData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newChannelData.type}
                  onChange={(e) => setNewChannelData({...newChannelData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="text">Text</option>
                  <option value="voice">Voice</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newChannelData.description}
                  onChange={(e) => setNewChannelData({...newChannelData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newChannelData.category}
                  onChange={(e) => setNewChannelData({...newChannelData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newChannelData.isPublic}
                    onChange={(e) => setNewChannelData({...newChannelData, isPublic: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Public</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newChannelData.botEnabled}
                    onChange={(e) => setNewChannelData({...newChannelData, botEnabled: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enable Bot</span>
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Channel'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedChannelDemo;
