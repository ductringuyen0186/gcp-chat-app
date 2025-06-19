import React, { useState, useRef } from 'react';
import { Send, Plus, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const MessageInput = ({ onSendMessage, disabled = false, placeholder = "Message..." }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || sending || disabled) return;

    setSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
      textareaRef.current?.focus();
    } catch (error) {
      // Error handled in parent component
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.emoji;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newMessage = message.slice(0, start) + emoji + message.slice(end);
    setMessage(newMessage);
    
    // Set cursor position after emoji
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    }, 0);
    
    setShowEmojiPicker(false);
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="p-4 bg-discord-background border-t border-gray-600">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end space-x-3 bg-discord-channel rounded-lg p-3">
          {/* Attachment button */}
          <button
            type="button"
            className="flex-shrink-0 p-2 text-discord-light hover:text-white hover:bg-discord-background rounded transition-colors"
            disabled={disabled || sending}
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Message input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled || sending}
              className="w-full bg-transparent text-white placeholder-discord-light resize-none focus:outline-none max-h-32 min-h-[24px]"
              rows="1"
              style={{ height: '24px' }}
            />
          </div>

          {/* Emoji picker button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex-shrink-0 p-2 text-discord-light hover:text-white hover:bg-discord-background rounded transition-colors"
              disabled={disabled || sending}
            >
              <Smile className="w-5 h-5" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0 z-50">
                <div className="bg-white rounded-lg shadow-xl">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    disableAutoFocus
                    native
                    theme="dark"
                    width={300}
                    height={400}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim() || disabled || sending}
            className="flex-shrink-0 p-2 text-discord-light hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-discord-background rounded transition-colors"
          >
            {sending ? (
              <div className="w-5 h-5">
                <div className="spinner border-discord-light"></div>
              </div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Character count */}
        {message.length > 1800 && (
          <div className="absolute -top-6 right-0 text-xs text-discord-light">
            {message.length}/2000
          </div>
        )}
      </form>

      {/* Click outside to close emoji picker */}
      {showEmojiPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
};

export default MessageInput;
