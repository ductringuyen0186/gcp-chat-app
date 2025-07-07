const { getFirestore } = require('../services/firebase');

class Message {
  constructor(data) {
    this.id = data.id;
    this.content = data.content;
    this.authorId = data.authorId;
    this.channelId = data.channelId;
    this.createdAt = data.createdAt || new Date();
    this.editedAt = data.editedAt;
    this.attachments = data.attachments || [];
    this.type = data.type || 'user';
    this.botAction = data.botAction;
  }

  static async create(messageData) {
    const db = getFirestore();
    const docRef = await db.collection('messages').add({
      content: messageData.content,
      authorId: messageData.authorId,
      channelId: messageData.channelId,
      createdAt: new Date(),
      attachments: messageData.attachments || [],
      type: messageData.type || 'user',
      botAction: messageData.botAction
    });

    return new Message({ id: docRef.id, ...messageData });
  }

  static async findByChannel(channelId, limit = 50, lastMessageId = null) {
    const db = getFirestore();
    let query = db.collection('messages')
      .where('channelId', '==', channelId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (lastMessageId) {
      const lastDoc = await db.collection('messages').doc(lastMessageId).get();
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => new Message({ id: doc.id, ...doc.data() }));
  }

  async update(updates) {
    const db = getFirestore();
    const updateData = { ...updates, editedAt: new Date() };
    await db.collection('messages').doc(this.id).update(updateData);
    Object.assign(this, updateData);
  }

  async delete() {
    const db = getFirestore();
    await db.collection('messages').doc(this.id).delete();
  }
}

module.exports = Message;
