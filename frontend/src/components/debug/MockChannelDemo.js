import React, { useState } from 'react';
import { Plus, Hash, Volume2, Music, Users, Bot, Trash2, RotateCcw } from 'lucide-react';
import { useMockChannels } from '../hooks/useMockChannels';

const MockChannelDemo = () => {
  const {
    loading,
    loadMockChannels,
    addMockChannel,
    generateMockChannels,
    createFromTemplate,
    removeMockChannel,
    clearMockChannels,
    resetMockChannels,
    getFilteredChannels,
    getChannelsByCategory,
    getChannelStats,
    availableTemplates
  } = useMockChannels();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [showBotOnly, setShowBotOnly] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  const stats = getChannelStats();
  const categorizedChannels = getChannelsByCategory();
  
  // Get filtered channels based on current filters
  const filteredChannels = getFilteredChannels({
    type: selectedType !== 'All' ? selectedType : undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    botEnabled: showBotOnly ? true : undefined
  });

  const getChannelIcon = (type, botEnabled) => {
    if (botEnabled) return <Bot className="w-4 h-4 text-blue-400" />;
    switch (type) {
      case 'voice': return <Volume2 className="w-4 h-4 text-green-400" />;
      case 'music': return <Music className="w-4 h-4 text-purple-400" />;
      default: return <Hash className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      addMockChannel({
        name: newChannelName.trim(),
        type: 'text',
        description: `Custom channel: ${newChannelName}`,
        category: 'Custom'
      });
      setNewChannelName('');
    }
  };

  const handleCreateFromTemplate = (templateName) => {
    createFromTemplate(templateName);
  };

  return (
    <div className="min-h-screen bg-discord-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mock Channel Data Demo</h1>
          <p className="text-discord-light">
            Demonstrating dynamic channel loading and management with mock data
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-discord-dark rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-discord-light text-sm">Total Channels</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Hash className="w-8 h-8 text-discord-primary" />
            </div>
          </div>
          
          <div className="bg-discord-dark rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-discord-light text-sm">With Bots</p>
                <p className="text-2xl font-bold text-white">{stats.withBots}</p>
              </div>
              <Bot className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-discord-dark rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-discord-light text-sm">Total Members</p>
                <p className="text-2xl font-bold text-white">{stats.totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-discord-dark rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-discord-light text-sm">Avg Members</p>
                <p className="text-2xl font-bold text-white">{stats.averageMembers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-discord-dark rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Channel Management</h2>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => loadMockChannels(500)}
              disabled={loading}
              className="bg-discord-primary hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load Mock Channels'}
            </button>
            
            <button
              onClick={() => generateMockChannels(3)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Generate Random
            </button>
            
            <button
              onClick={resetMockChannels}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            
            <button
              onClick={clearMockChannels}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>

          {/* Create Custom Channel */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="Enter channel name..."
              className="flex-1 bg-discord-background text-white px-3 py-2 rounded border border-gray-600 focus:border-discord-primary outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateChannel()}
            />
            <button
              onClick={handleCreateChannel}
              disabled={!newChannelName.trim()}
              className="bg-discord-primary hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Create Channel
            </button>
          </div>

          {/* Template Buttons */}
          <div className="mb-6">
            <p className="text-discord-light text-sm mb-2">Quick Templates:</p>
            <div className="flex flex-wrap gap-2">
              {availableTemplates.map(template => (
                <button
                  key={template}
                  onClick={() => handleCreateFromTemplate(template)}
                  className="bg-discord-background hover:bg-gray-600 text-discord-light px-3 py-1 rounded text-sm"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-discord-light text-sm mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-discord-background text-white px-3 py-2 rounded border border-gray-600"
              >
                <option value="All">All Categories</option>
                {Object.keys(categorizedChannels).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-discord-light text-sm mb-1">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-discord-background text-white px-3 py-2 rounded border border-gray-600"
              >
                <option value="All">All Types</option>
                <option value="text">Text</option>
                <option value="voice">Voice</option>
                <option value="music">Music</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <label className="flex items-center text-discord-light">
                <input
                  type="checkbox"
                  checked={showBotOnly}
                  onChange={(e) => setShowBotOnly(e.target.checked)}
                  className="mr-2"
                />
                Bot Channels Only
              </label>
            </div>
          </div>
        </div>

        {/* Channel List */}
        <div className="bg-discord-dark rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Channels ({filteredChannels.length})
          </h2>
          
          {filteredChannels.length === 0 ? (
            <div className="text-center py-12">
              <Hash className="w-16 h-16 text-discord-light mx-auto mb-4 opacity-50" />
              <p className="text-discord-light">No channels match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChannels.map(channel => (
                <div
                  key={channel.id}
                  className="bg-discord-background rounded-lg p-4 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getChannelIcon(channel.type, channel.botEnabled)}
                      <h3 className="font-semibold text-white">{channel.name}</h3>
                    </div>
                    <button
                      onClick={() => removeMockChannel(channel.id)}
                      className="text-red-400 hover:text-red-300 opacity-70 hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-discord-light text-sm mb-3 line-clamp-2">
                    {channel.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-discord-light">
                    <span className="bg-discord-primary bg-opacity-20 text-discord-primary px-2 py-1 rounded">
                      {channel.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{channel.memberCount}</span>
                    </div>
                  </div>
                  
                  {channel.botEnabled && (
                    <div className="mt-2">
                      <span className="bg-blue-600 bg-opacity-20 text-blue-400 text-xs px-2 py-1 rounded">
                        Bot: {channel.botType}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockChannelDemo;
