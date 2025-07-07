import React, { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Edit, Trash2, Music, Youtube } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MessageList = ({ 
  messages, 
  loading, 
  onEditMessage, 
  onDeleteMessage,
  channel 
}) => {
  const { userProfile } = useAuth();
  const messagesEndRef = useRef(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditClick = (message) => {
    setEditingMessageId(message.id);
    setEditText(message.content);
  };

  const handleEditSubmit = async (messageId) => {
    try {
      await onEditMessage(messageId, editText);
      setEditingMessageId(null);
      setEditText('');
    } catch (error) {
      // Error handled in parent
    }
  };

  const renderBotMessage = (message) => {
    const isMusicCommand = message.botAction?.command === 'play';
    
    return (
      <div className="flex items-start space-x-3 p-2 rounded bg-discord-channel bg-opacity-50">
        <div className="flex-shrink-0">
          {isMusicCommand ? (
            <Youtube className="w-6 h-6 text-red-500" />
          ) : (
            <Music className="w-6 h-6 text-discord-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-discord-primary">Music Bot</span>
            <span className="text-xs text-discord-light">
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-white mt-1">{message.content}</p>
          {isMusicCommand && message.botAction?.args && (
            <div className="mt-2 text-sm text-discord-light">
              🎵 Now playing from YouTube
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-discord-channel rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-discord-channel rounded w-1/4" />
                <div className="h-4 bg-discord-channel rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => {
        const isConsecutive = index > 0 && 
          messages[index - 1].authorId === message.authorId &&
          new Date(message.createdAt) - new Date(messages[index - 1].createdAt) < 300000;

        if (message.type === 'bot') {
          return (
            <div key={message.id} className="mb-4">
              {renderBotMessage(message)}
            </div>
          );
        }

        return (
          <div key={message.id} className={`${isConsecutive ? 'mt-1' : 'mt-6'} group`}>
            {!isConsecutive && (
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-discord-primary flex items-center justify-center text-white font-medium text-lg">
                  {message.author?.displayName?.charAt(0) || '?'}
                </div>
                <div className="ml-4">
                  <span className="font-medium text-white">
                    {message.author?.displayName || 'Unknown User'}
                  </span>
                  <span className="ml-2 text-xs text-discord-light">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            )}
            <div className="pl-14">
              {editingMessageId === message.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 bg-discord-channel text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-discord-primary"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleEditSubmit(message.id);
                      } else if (e.key === 'Escape') {
                        setEditingMessageId(null);
                        setEditText('');
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSubmit(message.id)}
                    className="text-discord-primary hover:text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingMessageId(null);
                      setEditText('');
                    }}
                    className="text-discord-light hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="group relative">
                  <p className="text-white whitespace-pre-wrap break-words">{message.content}</p>
                  {message.authorId === userProfile?.uid && (
                    <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center space-x-1 bg-discord-darker rounded p-1">
                        <button
                          onClick={() => handleEditClick(message)}
                          className="p-1 text-discord-light hover:text-white rounded hover:bg-discord-channel transition-colors"
                          title="Edit message"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteMessage(message.id)}
                          className="p-1 text-discord-light hover:text-red-500 rounded hover:bg-discord-channel transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
