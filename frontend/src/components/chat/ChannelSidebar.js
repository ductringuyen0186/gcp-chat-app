import React, { useState } from 'react';
import { Hash, Volume2, Plus, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ChannelSidebar = ({ 
  channels, 
  currentChannelId, 
  onChannelSelect, 
  onCreateChannel 
}) => {
  const { userProfile, logout, updateUserStatus } = useAuth();
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    
    if (!newChannelName.trim() || creating) return;

    setCreating(true);
    try {
      await onCreateChannel({
        name: newChannelName.trim(),
        type: 'text'
      });
      setNewChannelName('');
      setShowCreateChannel(false);
      toast.success('Channel created successfully!');
    } catch (error) {
      toast.error('Failed to create channel');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await updateUserStatus(status);
    } catch (error) {
      // Error handled in context
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="w-60 bg-discord-sidebar flex flex-col h-full">
      {/* Server Header */}
      <div className="p-4 border-b border-gray-600">
        <h1 className="text-white font-semibold text-lg">Discord Clone</h1>
        <p className="text-discord-light text-sm">Welcome to the chat!</p>
      </div>

      {/* Channels Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-discord-light text-xs font-semibold uppercase tracking-wide">
              Text Channels
            </h2>
            <button
              onClick={() => setShowCreateChannel(true)}
              className="text-discord-light hover:text-white p-1 rounded hover:bg-discord-channel transition-colors"
              title="Create Channel"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Create Channel Form */}
          {showCreateChannel && (
            <form onSubmit={handleCreateChannel} className="mb-3 p-2 bg-discord-channel rounded">
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="Channel name"
                className="w-full bg-discord-background text-white text-sm px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-discord-primary"
                autoFocus
                maxLength={100}
              />
              <div className="flex space-x-2 mt-2">
                <button
                  type="submit"
                  disabled={!newChannelName.trim() || creating}
                  className="text-xs bg-discord-primary hover:bg-discord-secondary text-white px-2 py-1 rounded disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateChannel(false);
                    setNewChannelName('');
                  }}
                  className="text-xs text-discord-light hover:text-white px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Channel List */}
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full flex items-center space-x-2 px-2 py-1 rounded text-left transition-colors ${
                  currentChannelId === channel.id
                    ? 'bg-discord-channel text-white'
                    : 'text-discord-light hover:text-white hover:bg-discord-channel'
                }`}
              >
                {channel.type === 'voice' ? (
                  <Volume2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <Hash className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="truncate text-sm">{channel.name}</span>
              </button>
            ))}
          </div>

          {channels.length === 0 && !showCreateChannel && (
            <div className="text-center py-8">
              <Hash className="w-8 h-8 text-discord-light mx-auto mb-2" />
              <p className="text-discord-light text-sm">No channels yet</p>
              <button
                onClick={() => setShowCreateChannel(true)}
                className="text-discord-primary hover:underline text-sm mt-1"
              >
                Create your first channel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Panel */}
      <div className="p-3 bg-discord-darker border-t border-gray-600">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-discord-primary flex items-center justify-center text-white text-sm font-semibold">
              {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-discord-darker ${getStatusColor(userProfile?.status)}`}></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {userProfile?.displayName || 'User'}
            </p>
            <p className="text-discord-light text-xs truncate">
              {userProfile?.status || 'offline'}
            </p>
          </div>

          {/* User Menu */}
          <div className="relative group">
            <button className="p-1 text-discord-light hover:text-white hover:bg-discord-channel rounded transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            
            <div className="absolute bottom-full right-0 mb-2 bg-discord-dark border border-gray-600 rounded shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="px-3 py-2 border-b border-gray-600">
                <p className="text-white text-sm font-medium">Set Status</p>
              </div>
              
              <button
                onClick={() => handleStatusChange('online')}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-discord-light hover:text-white hover:bg-discord-channel w-full text-left"
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Online</span>
              </button>
              
              <button
                onClick={() => handleStatusChange('away')}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-discord-light hover:text-white hover:bg-discord-channel w-full text-left"
              >
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>Away</span>
              </button>
              
              <button
                onClick={() => handleStatusChange('offline')}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-discord-light hover:text-white hover:bg-discord-channel w-full text-left"
              >
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <span>Invisible</span>
              </button>
              
              <div className="border-t border-gray-600 mt-1">
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-discord-danger hover:text-red-400 hover:bg-discord-channel w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelSidebar;
