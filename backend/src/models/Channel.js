const { getFirestore } = require('../services/firebase');

class Channel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type || 'text';
    this.serverId = data.serverId;
    this.description = data.description || '';
    this.position = data.position || 0;
    this.createdAt = data.createdAt || new Date();
  }

  static async create(channelData) {
    const db = getFirestore();
    const docRef = await db.collection('channels').add({
      name: channelData.name,
      type: channelData.type || 'text',
      serverId: channelData.serverId || 'default',
      description: channelData.description || '',
      position: channelData.position || 0,
      createdAt: new Date()
    });

    return new Channel({ id: docRef.id, ...channelData });
  }

  static async findAll(serverId = null, limit = 50) {
    const db = getFirestore();
    let query = db.collection('channels')
      .orderBy('position')
      .limit(limit);

    if (serverId) {
      query = query.where('serverId', '==', serverId);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => new Channel({ id: doc.id, ...doc.data() }));
  }

  static async findById(channelId) {
    const db = getFirestore();
    const doc = await db.collection('channels').doc(channelId).get();
    
    if (!doc.exists) {
      return null;
    }

    return new Channel({ id: channelId, ...doc.data() });
  }

  async update(updates) {
    const db = getFirestore();
    await db.collection('channels').doc(this.id).update(updates);
    Object.assign(this, updates);
  }

  async delete() {
    const db = getFirestore();
    await db.collection('channels').doc(this.id).delete();
  }
}

module.exports = Channel;
