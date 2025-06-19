const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Message = require('../models/Message');
const router = express.Router();

// Get messages for a channel
router.get('/channel/:channelId', authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params;
    const { limit = 50, before } = req.query;

    const messages = await Message.findByChannel(
      channelId, 
      parseInt(limit), 
      before
    );

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      hasMore: messages.length === parseInt(limit)
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a new message
router.post('/channel/:channelId', authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params;
    const { content, attachments } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    if (content.length > 2000) {
      return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
    }

    const message = await Message.create({
      content: content.trim(),
      authorId: req.user.uid,
      channelId,
      attachments: attachments || []
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Edit a message
router.patch('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Get the message first to check ownership
    const db = require('../services/firebase').getFirestore();
    const messageDoc = await db.collection('messages').doc(messageId).get();
    
    if (!messageDoc.exists) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const messageData = messageDoc.data();
    if (messageData.authorId !== req.user.uid) {
      return res.status(403).json({ error: 'You can only edit your own messages' });
    }

    const message = new Message({ id: messageId, ...messageData });
    await message.update({ content: content.trim() });

    res.json({
      message: 'Message updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ error: 'Failed to edit message' });
  }
});

// Delete a message
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;

    // Get the message first to check ownership
    const db = require('../services/firebase').getFirestore();
    const messageDoc = await db.collection('messages').doc(messageId).get();
    
    if (!messageDoc.exists) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const messageData = messageDoc.data();
    if (messageData.authorId !== req.user.uid) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }

    const message = new Message({ id: messageId, ...messageData });
    await message.delete();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
