const { getFirestore } = require('../services/firebase');

class User {
  constructor(data) {
    this.uid = data.uid;
    this.email = data.email;
    this.displayName = data.displayName;
    this.photoURL = data.photoURL;
    this.createdAt = data.createdAt || new Date();
    this.lastSeen = data.lastSeen || new Date();
    this.status = data.status || 'online';
  }

  static async create(userData) {
    const db = getFirestore();
    const user = new User(userData);
    
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.createdAt,
      lastSeen: user.lastSeen,
      status: user.status
    });

    return user;
  }

  static async findById(uid) {
    const db = getFirestore();
    const doc = await db.collection('users').doc(uid).get();
    
    if (!doc.exists) {
      return null;
    }

    return new User({ uid, ...doc.data() });
  }

  static async updateLastSeen(uid) {
    const db = getFirestore();
    await db.collection('users').doc(uid).update({
      lastSeen: new Date(),
      status: 'online'
    });
  }

  async save() {
    const db = getFirestore();
    await db.collection('users').doc(this.uid).update({
      displayName: this.displayName,
      photoURL: this.photoURL,
      status: this.status
    });
  }
}

module.exports = User;
