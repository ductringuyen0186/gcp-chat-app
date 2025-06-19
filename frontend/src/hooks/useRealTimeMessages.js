import { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { apiEndpoints } from '../config/api';
import toast from 'react-hot-toast';

export const useRealTimeMessages = (channelId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  // Load initial messages from API (for pagination support)
  const loadInitialMessages = async () => {
    if (!channelId) return;
    
    try {
      setLoading(true);
      const response = await apiEndpoints.messages.getByChannel(channelId, { limit: 50 });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading initial messages:', error);
      setError('Failed to load messages');
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time listener
  const setupRealTimeListener = () => {
    if (!channelId) return;

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('channelId', '==', channelId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newMessages = [];
        const changes = snapshot.docChanges();

        changes.forEach((change) => {
          const messageData = {
            id: change.doc.id,
            ...change.doc.data(),
            createdAt: change.doc.data().createdAt?.toDate() || new Date(),
            editedAt: change.doc.data().editedAt?.toDate() || null,
          };

          if (change.type === 'added') {
            newMessages.push(messageData);
          } else if (change.type === 'modified') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === messageData.id ? messageData : msg
              )
            );
          } else if (change.type === 'removed') {
            setMessages(prev => 
              prev.filter(msg => msg.id !== messageData.id)
            );
          }
        });

        if (newMessages.length > 0) {
          setMessages(prev => {
            const existingIds = new Set(prev.map(msg => msg.id));
            const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));
            
            if (uniqueNewMessages.length > 0) {
              return [...prev, ...uniqueNewMessages].sort((a, b) => 
                new Date(a.createdAt) - new Date(b.createdAt)
              );
            }
            return prev;
          });
        }
      },
      (error) => {
        console.error('Real-time messages error:', error);
        setError('Real-time connection failed');
      }
    );

    unsubscribeRef.current = unsubscribe;
  };

  // Send message
  const sendMessage = async (content, attachments = []) => {
    if (!content.trim() || !channelId) return;

    try {
      await apiEndpoints.messages.send(channelId, {
        content: content.trim(),
        attachments
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  };

  // Edit message
  const editMessage = async (messageId, newContent) => {
    if (!newContent.trim()) return;

    try {
      await apiEndpoints.messages.update(messageId, {
        content: newContent.trim()
      });
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Failed to edit message');
      throw error;
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    try {
      await apiEndpoints.messages.delete(messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
      throw error;
    }
  };

  // Load more messages (pagination)
  const loadMoreMessages = async () => {
    if (!channelId || messages.length === 0) return;

    try {
      const oldestMessage = messages[0];
      const response = await apiEndpoints.messages.getByChannel(channelId, {
        limit: 25,
        before: oldestMessage.id
      });

      const olderMessages = response.data.messages || [];
      if (olderMessages.length > 0) {
        setMessages(prev => [...olderMessages, ...prev]);
      }
      
      return olderMessages.length > 0;
    } catch (error) {
      console.error('Error loading more messages:', error);
      toast.error('Failed to load more messages');
      return false;
    }
  };

  useEffect(() => {
    if (channelId) {
      setMessages([]);
      setError(null);
      loadInitialMessages();
      setupRealTimeListener();
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [channelId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    editMessage,
    deleteMessage,
    loadMoreMessages,
  };
};
