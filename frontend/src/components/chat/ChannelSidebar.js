import React, { useState } from 'react';
import { Hash, Volume2, Plus, Settings, LogOut, Music, Radio } from 'lucide-react';
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
  const [newChannelType, setNewChannelType] = useState('text');
  const [creating, setCreating] = useState(false);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    
    if (!newChannelName.trim() || creating) return;

    setCreating(true);
    try {
      await onCreateChannel({
        name: newChannelName.trim(),
        type: newChannelType,
        botEnabled: newChannelType === 'music',
        botType: newChannelType === 'music' ? 'youtube' : null
      });
      setNewChannelName('');
      setNewChannelType('text');
      setShowCreateChannel(false);
      toast.success('Channel created successfully!');
    } catch (error) {
      toast.error('Failed to create channel');
    } finally {
      setCreating(false);
    }
  };

  const getChannelIcon = (type) => {
    switch (type) {
      case 'voice':
        return <Volume2 className="w-4 h-4" />;
      case 'music':
        return <Music className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  // Group channels by type
  const textChannels = channels.filter(c => c.type === 'text');
  const voiceChannels = channels.filter(c => c.type === 'voice');
  const musicChannels = channels.filter(c => c.type === 'music');

  return (
    <div className="w-60 h-full bg-discord-darker flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-white font-bold text-lg">Discord Clone</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Text Channels Section */}
        <div>
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
          <div className="space-y-1">
            {textChannels.map((channel) => (
              <ChannelButton
                key={channel.id}
                channel={channel}
                isActive={currentChannelId === channel.id}
                onClick={() => onChannelSelect(channel.id)}
              />
            ))}
          </div>
        </div>

        {/* Voice Channels Section */}
        {voiceChannels.length > 0 && (
          <div>
            <h2 className="text-discord-light text-xs font-semibold uppercase tracking-wide mb-2">
              Voice Channels
            </h2>
            <div className="space-y-1">
              {voiceChannels.map((channel) => (
                <ChannelButton
                  key={channel.id}
                  channel={channel}
                  isActive={currentChannelId === channel.id}
                  onClick={() => onChannelSelect(channel.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Music Channels Section */}
        {musicChannels.length > 0 && (
          <div>
            <h2 className="text-discord-light text-xs font-semibold uppercase tracking-wide mb-2">
              Music Channels
            </h2>
            <div className="space-y-1">
              {musicChannels.map((channel) => (
                <ChannelButton
                  key={channel.id}
                  channel={channel}
                  isActive={currentChannelId === channel.id}
                  onClick={() => onChannelSelect(channel.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Create Channel Form */}
        {showCreateChannel && (
          <form onSubmit={handleCreateChannel} className="mb-3 p-4 bg-discord-channel rounded-lg space-y-4">
            <div>
              <label className="block text-discord-light text-sm mb-1">Channel Name</label>
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="new-channel"
                className="w-full bg-discord-background text-white text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-discord-primary"
                autoFocus
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-discord-light text-sm mb-1">Channel Type</label>
              <select
                value={newChannelType}
                onChange={(e) => setNewChannelType(e.target.value)}
                className="w-full bg-discord-background text-white text-sm px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-discord-primary"
              >
                <option value="text">Text Channel</option>
                <option value="voice">Voice Channel</option>
                <option value="music">Music Channel</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={!newChannelName.trim() || creating}
                className="flex-1 bg-discord-primary hover:bg-discord-secondary text-white px-4 py-2 rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? 'Creating...' : 'Create Channel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateChannel(false);
                  setNewChannelName('');
                  setNewChannelType('text');
                }}
                className="text-discord-light hover:text-white px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* User profile section */}
      <div className="p-4 bg-discord-darkest">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-white font-medium truncate">{userProfile?.displayName}</p>
            <p className="text-discord-light text-sm truncate">{userProfile?.email}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {/* TODO: Implement settings */}}
              className="text-discord-light hover:text-white p-2 rounded hover:bg-discord-channel transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={logout}
              className="text-discord-light hover:text-white p-2 rounded hover:bg-discord-channel transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Channel Button Component
const ChannelButton = ({ channel, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded text-left transition-colors ${
        isActive
          ? 'bg-discord-channel text-white'
          : 'text-discord-light hover:text-white hover:bg-discord-channel'
      }`}
    >
      {channel.type === 'voice' ? (
        <Volume2 className="w-4 h-4 flex-shrink-0" />
      ) : channel.type === 'music' ? (
        <Music className="w-4 h-4 flex-shrink-0" />
      ) : (
        <Hash className="w-4 h-4 flex-shrink-0" />
      )}
      <span className="truncate">{channel.name}</span>
      {channel.type === 'music' && channel.botEnabled && (
        <Radio className="w-3 h-3 text-discord-primary ml-auto flex-shrink-0" />
      )}
    </button>
  );
};

export default ChannelSidebar;
