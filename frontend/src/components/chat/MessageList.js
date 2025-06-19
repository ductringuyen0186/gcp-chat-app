import React, { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MessageList = ({ 
  messages, 
  loading, 
  onEditMessage, 
  onDeleteMessage, 
  onLoadMore 
}) => {
  const { userProfile } = useAuth();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);

    // Load more messages when scrolled to top
    if (scrollTop === 0 && messages.length > 0) {
      onLoadMore?.();
    }
  };

  const handleEditStart = (message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  };

  const handleEditSave = async () => {
    if (editContent.trim() && editingMessageId) {
      try {
        await onEditMessage(editingMessageId, editContent.trim());
        setEditingMessageId(null);
        setEditContent('');
      } catch (error) {
        // Error handled in parent component
      }
    }
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-discord-light">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">👋</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Welcome to the beginning of this channel!
              </h3>
              <p className="text-discord-light">
                This is the start of your conversation. Send a message to get things going!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.authorId === userProfile?.uid;
            const showAvatar = index === 0 || messages[index - 1]?.authorId !== message.authorId;
            const isEditing = editingMessageId === message.id;

            return (
              <div
                key={message.id}
                className={`group flex items-start space-x-3 hover:bg-discord-message hover:bg-opacity-30 px-2 py-1 rounded ${
                  showAvatar ? 'mt-4' : 'mt-1'
                }`}
              >
                <div className="flex-shrink-0 w-10">
                  {showAvatar && (
                    <div className="w-10 h-10 rounded-full bg-discord-primary flex items-center justify-center text-white font-semibold">
                      {message.authorName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {showAvatar && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-white">
                        {message.authorName || 'Unknown User'}
                      </span>
                      <span className="text-xs text-discord-light">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                      {message.editedAt && (
                        <span className="text-xs text-discord-light">(edited)</span>
                      )}
                    </div>
                  )}

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full bg-discord-channel border border-gray-600 text-white rounded px-3 py-2 resize-none focus:outline-none focus:border-discord-primary"
                        rows="3"
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleEditSave}
                          className="text-xs bg-discord-primary hover:bg-discord-secondary text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="text-xs text-discord-light hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="message-content text-discord-lighter">
                      {message.content}
                    </div>
                  )}

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <div key={idx} className="bg-discord-channel rounded p-2">
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-discord-primary hover:underline"
                          >
                            {attachment.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isOwnMessage && !isEditing && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <button className="p-1 hover:bg-discord-channel rounded">
                        <MoreHorizontal className="w-4 h-4 text-discord-light" />
                      </button>
                      <div className="absolute right-0 top-8 bg-discord-dark border border-gray-600 rounded shadow-lg py-1 z-10 hidden group-hover:block">
                        <button
                          onClick={() => handleEditStart(message)}
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-discord-light hover:text-white hover:bg-discord-channel w-full text-left"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteMessage(message.id)}
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-discord-danger hover:text-red-400 hover:bg-discord-channel w-full text-left"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 bg-discord-primary hover:bg-discord-secondary text-white p-2 rounded-full shadow-lg transition-colors"
        >
          ↓
        </button>
      )}
    </div>
  );
};

export default MessageList;
