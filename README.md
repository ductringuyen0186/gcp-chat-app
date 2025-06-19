# Discord Clone - Google Cloud Platform Backend

A Discord-like chat application backend built with Node.js and Google Cloud Platform services, optimized for the free tier.

## 🏗️ Architecture

- **Compute**: Cloud Run (serverless)
- **Database**: Cloud Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **File Storage**: Cloud Storage
- **Real-time**: Firestore real-time listeners

## 🚀 Quick Start

1. **Follow the complete setup guide**: See `GCP_DISCORD_CLONE_GUIDE.md` for detailed instructions

2. **Set up environment**:
   ```bash
   cd backend
   cp .env.example .env
   # Fill in your Firebase credentials in .env
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Test the API**:
   ```bash
   curl http://localhost:8080/health
   ```

## 📁 Project Structure

```
discord-clone/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth & error handling
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Firebase services
│   │   └── utils/           # Utility functions
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── firebase/                # Firebase configuration
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── firebase.json
├── GCP_DISCORD_CLONE_GUIDE.md  # Complete setup guide
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/profile` - Create/update user profile
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/status` - Update user status

### Messages
- `GET /api/messages/channel/:channelId` - Get channel messages
- `POST /api/messages/channel/:channelId` - Send message
- `PATCH /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message

### Channels
- `GET /api/channels` - Get all channels
- `POST /api/channels` - Create channel

### Users
- `GET /api/users/:userId` - Get user profile

## 🌐 Deployment

Deploy to Cloud Run:
```bash
gcloud run deploy discord-clone-api --source . --region us-central1
```

## 💰 Cost Optimization

This setup is designed to stay within GCP free tier limits:
- Cloud Run: 2M requests/month
- Firestore: 50K reads, 20K writes/day
- Cloud Storage: 5GB storage
- Firebase Auth: Unlimited users

## 📚 Next Steps

1. Build a frontend (React/Vue.js) with Firebase Auth
2. Implement real-time messaging with WebSockets
3. Add file upload functionality
4. Implement server/guild management
5. Add voice chat capabilities

## 🔗 Resources

- [Complete Setup Guide](./GCP_DISCORD_CLONE_GUIDE.md)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Firebase Console](https://console.firebase.google.com/)

## 📄 License

MIT License - see LICENSE file for details
