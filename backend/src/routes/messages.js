const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Message = require('../models/Message');
const Channel = require('../models/Channel');
const musicBot = require('../services/musicBot');

const router = express.Router();

// Helper function to handle music bot commands
const handleMusicBotCommand = async (content, channelId, requestedBy) => {
  const command = content.slice(1).split(' ')[0].toLowerCase();
  const args = content.slice(command.length + 2).trim();

  switch (command) {
    case 'play': {
      if (!args) {
        return { error: 'Please provide a YouTube URL' };
      }
      try {
        const track = await musicBot.addToQueue(channelId, args, requestedBy);
        return {
          type: 'bot',
          content: `🎵 Added to queue: ${track.title}`,
          botAction: { command: 'play', track }
        };
      } catch (e) {
        return { error: e.message };
      }
    }
    case 'skip': {
      const nextTrack = musicBot.skipTrack(channelId);
      if (nextTrack) {
        return {
          type: 'bot',
          content: `⏭️ Skipped! Now playing: ${nextTrack.title}`,
          botAction: { command: 'play', track: nextTrack }
        };
      } else {
        return {
          type: 'bot',
          content: '⏭️ Skipped! No more tracks in queue.',
          botAction: { command: 'skip' }
        };
      }
    }
    case 'queue': {
      const queue = musicBot.getQueue(channelId);
      if (queue.length === 0) {
        return { type: 'bot', content: 'Queue is empty.', botAction: { command: 'queue' } };
      }
      const list = queue.map((t, i) => `${i === 0 ? '▶️' : `${i+1}.`} ${t.title}`).join('\n');
      return {
        type: 'bot',
        content: `Current queue:\n${list}`,
        botAction: { command: 'queue', queue }
      };
    }
    case 'clear': {
      musicBot.clearQueue(channelId);
      return {
        type: 'bot',
        content: '🗑️ Queue cleared.',
        botAction: { command: 'clear' }
      };
    }
    default:
      return { error: 'Unknown command' };
  }
};

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

    // Check if this is a music channel and handle bot commands
    const channel = await Channel.findById(channelId);
    if (channel?.type === 'music' && channel?.botEnabled && content.startsWith('!')) {
      const botResponse = await handleMusicBotCommand(content, channelId, req.user.email || req.user.uid);
      
      if (botResponse.error) {
        return res.status(400).json({ error: botResponse.error });
      }

      // Create bot response message
      const botMessage = await Message.create({
        content: botResponse.content,
        authorId: 'music-bot',
        channelId,
        type: 'bot',
        botAction: botResponse.botAction
      });

      return res.status(201).json({
        message: 'Bot command processed',
        data: botMessage
      });
    }

    // Regular message handling
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

// Music bot API endpoints
router.get('/music/:channelId/queue', authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params;
    const queue = musicBot.getQueue(channelId);
    res.json({ queue });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

router.post('/music/:channelId/queue', authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params;
    const { youtubeUrl } = req.body;
    const track = await musicBot.addToQueue(channelId, youtubeUrl, req.user.email || req.user.uid);
    res.status(201).json({ track });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/music/:channelId/skip', authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params;
    const nextTrack = musicBot.skipTrack(channelId);
    res.json({ nextTrack });
  } catch (error) {
    res.status(500).json({ error: 'Failed to skip track' });
  }
});

router.post('/music/:channelId/clear', authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params;
    musicBot.clearQueue(channelId);
    res.json({ message: 'Queue cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear queue' });
  }
});

module.exports = router;
