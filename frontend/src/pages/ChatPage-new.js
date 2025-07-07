import React, { useState, useEffect } from 'react';
import { Hash, Users } from 'lucide-react';
import ChannelSidebar from '../components/chat/ChannelSidebar';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { useRealTimeMessages } from '../hooks/useRealTimeMessages';
import { apiEndpoints } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const { userProfile } = useAuth();
  const [channels, setChannels] = useState([]);
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const {
    messages,
    loading: messagesLoading,
    sendMessage,
    editMessage,
    deleteMessage,
    loadMoreMessages
  } = useRealTimeMessages(currentChannelId);

  // Load channels
  const loadChannels = React.useCallback(async () => {
    try {
      setLoadingChannels(true);
      let response;
      
      try {
        // Try to load authenticated channels first
        response = await apiEndpoints.channels.getAll();
        setIsDemo(false);
      } catch (authError) {
        // If authentication fails, load demo channels
        console.log('Authentication failed, loading demo channels');
        response = await apiEndpoints.channels.getDemo();
        setIsDemo(true);
        toast.success('Welcome to Discord Clone Demo! Sign in to save your data.', {
          duration: 5000,
          position: 'top-center'
        });
      }
      
      const channelList = response.data.channels || [];
      setChannels(channelList);

      // Select first channel if none selected
      if (channelList.length > 0 && !currentChannelId) {
        setCurrentChannelId(channelList[0].id);
        setCurrentChannel(channelList[0]);
      }
    } catch (error) {
      console.error('Error loading channels:', error);
      toast.error('Failed to load channels');
    } finally {
      setLoadingChannels(false);
    }
  }, [currentChannelId]);

  // Create new channel
  const createChannel = React.useCallback(async (channelData) => {
    try {
      if (isDemo) {
        // Create a local demo channel
        const newChannel = {
          id: `demo-${Date.now()}`,
          name: channelData.name,
          type: channelData.type,
          description: channelData.description || '',
          serverId: 'demo-server',
          botEnabled: channelData.botEnabled,
          botType: channelData.botType,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setChannels(prev => [...prev, newChannel]);
        setCurrentChannelId(newChannel.id);
        setCurrentChannel(newChannel);
        toast.success('Demo channel created! Sign in to save your channels permanently.');
        return newChannel;
      } else {
        // Create authenticated channel
        const response = await apiEndpoints.channels.create(channelData);
        const newChannel = response.data.channel;
        setChannels(prev => [...prev, newChannel]);
        setCurrentChannelId(newChannel.id);
        setCurrentChannel(newChannel);
        toast.success('Channel created successfully!');
        return newChannel;
      }
    } catch (error) {
      console.error('Error creating channel:', error);
      toast.error('Failed to create channel');
      throw error;
    }
  }, [isDemo]);

  // Handle channel selection
  const handleChannelSelect = (channelId) => {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      setCurrentChannelId(channelId);
      setCurrentChannel(channel);
    }
  };

  // Handle sending messages
  const handleSendMessage = async (content) => {
    if (!currentChannelId) {
      toast.error('Please select a channel first');
      return;
    }

    try {
      if (isDemo) {
        toast.info('This is demo mode. Sign in to send real messages!');
        return;
      }
      await sendMessage(content);
    } catch (error) {
      // Error handled in hook
      throw error;
    }
  };

  // Handle message editing
  const handleEditMessage = async (messageId, newContent) => {
    try {
      if (isDemo) {
        toast.info('This is demo mode. Sign in to edit messages!');
        return;
      }
      await editMessage(messageId, newContent);
    } catch (error) {
      // Error handled in hook
      throw error;
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async (messageId) => {
    if (isDemo) {
      toast.info('This is demo mode. Sign in to delete messages!');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(messageId);
      } catch (error) {
        // Error handled in hook
        throw error;
      }
    }
  };

  // Load channels on mount
  useEffect(() => {
    loadChannels();
  }, []);

  if (loadingChannels) {
    return (
      <div className="h-screen bg-discord-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-discord-primary"></div>
          <p className="text-discord-light mt-4">Loading Discord Clone...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-discord-background flex flex-col">
      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="bg-discord-primary text-white text-center py-3 px-4 flex items-center justify-center space-x-2">
          <span className="text-sm font-medium">
            🚀 Demo Mode - Try the features! Sign in to save your data permanently.
          </span>
          <button className="ml-4 bg-white text-discord-primary px-3 py-1 rounded text-sm hover:bg-gray-100 transition-colors">
            Sign In
          </button>
        </div>
      )}
      
      {/* Main Chat Container */}
      <div className="flex-1 flex">
        {/* Channel Sidebar */}
        <ChannelSidebar
          channels={channels}
          currentChannelId={currentChannelId}
          onChannelSelect={handleChannelSelect}
          onCreateChannel={createChannel}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentChannel ? (
            <>
              {/* Channel Header */}
              <div className="h-16 bg-discord-dark border-b border-gray-600 flex items-center px-4">
                <div className="flex items-center space-x-3">
                  <Hash className="w-6 h-6 text-discord-light" />
                  <div>
                    <h1 className="text-white font-semibold">{currentChannel.name}</h1>
                    {currentChannel.description && (
                      <p className="text-discord-light text-sm">{currentChannel.description}</p>
                    )}
                  </div>
                  {currentChannel.type === 'music' && (
                    <span className="ml-2 bg-discord-primary text-white text-xs px-2 py-1 rounded">
                      Music Bot
                    </span>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 flex flex-col min-h-0">
                <MessageList
                  messages={messages}
                  loading={messagesLoading}
                  onEditMessage={handleEditMessage}
                  onDeleteMessage={handleDeleteMessage}
                  onLoadMore={loadMoreMessages}
                />
                <MessageInput
                  onSendMessage={handleSendMessage}
                  channelType={currentChannel.type}
                  disabled={isDemo}
                  placeholder={isDemo ? 'Sign in to send messages...' : `Message #${currentChannel.name}`}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-16 h-16 text-discord-light mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Discord Clone</h2>
                <p className="text-discord-light">
                  {channels.length === 0 
                    ? 'No channels available. Create your first channel!' 
                    : 'Select a channel to start chatting'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
