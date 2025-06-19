# Discord Clone - Quick Start Guide

Get your Discord clone backend running in 5 minutes!

## 🚀 Prerequisites

1. **Node.js 18+** installed
2. **Google Cloud account** with billing enabled
3. **Firebase project** created

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Firebase credentials
# Get these from Firebase Console > Project Settings > Service Accounts
```

### 3. Configure Firebase
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (from project root)
firebase init

# Select: Firestore, Authentication
# Use existing project: your-project-id
```

### 4. Set Up Google Cloud
```bash
# Install Google Cloud CLI (if not already installed)
# https://cloud.google.com/sdk/docs/install

# Login and set project
gcloud auth login
gcloud config set project your-project-id

# Enable required APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Test Your API
```bash
# Test health endpoint
curl http://localhost:8080/health

# Run comprehensive tests
npm run test:local
```

## 🌐 Deploy to Production

### Option 1: One-Click Deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deploy
```bash
gcloud run deploy discord-clone-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔧 Environment Variables

Required variables in `.env`:

```env
# Get from Firebase Console > Project Settings > Service Accounts
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id

# Generate a secure random string
JWT_SECRET=your-super-secret-jwt-key

# Your GCP project details
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_STORAGE_BUCKET=your-project-id-uploads
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/profile` - Create/update user profile
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/status` - Update user status

### Channels
- `GET /api/channels` - Get all channels
- `POST /api/channels` - Create channel
- `GET /api/channels/:id` - Get specific channel
- `PATCH /api/channels/:id` - Update channel
- `DELETE /api/channels/:id` - Delete channel

### Messages
- `GET /api/messages/channel/:channelId` - Get channel messages
- `POST /api/messages/channel/:channelId` - Send message
- `PATCH /api/messages/:messageId` - Edit message
- `DELETE /api/messages/:messageId` - Delete message

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users?search=name` - Search users
- `PATCH /api/users/me` - Update own profile

## 🔐 Authentication

All endpoints (except `/health`) require Firebase ID token:

```bash
curl -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
     http://localhost:8080/api/auth/me
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Auth Error**
   - Check your service account key in `.env`
   - Ensure Firebase project is correctly configured

2. **Port Already in Use**
   ```bash
   # Kill process on port 8080
   lsof -ti:8080 | xargs kill -9
   ```

3. **Firestore Permission Denied**
   - Deploy Firestore rules: `firebase deploy --only firestore:rules`
   - Check your security rules in `firebase/firestore.rules`

4. **Cloud Run Deployment Failed**
   - Check build logs: `gcloud builds list`
   - Verify environment variables are set

### Getting Help

- Check logs: `npm run dev` (local) or `gcloud run services logs read discord-clone-api --region=us-central1` (production)
- Test API: `npm run test:local`
- Firebase Console: https://console.firebase.google.com/
- Google Cloud Console: https://console.cloud.google.com/

## 🎯 Next Steps

1. **Build Frontend**: Create React/Vue.js app with Firebase Auth
2. **Add Real-time**: Implement WebSocket connections
3. **File Uploads**: Add image/file upload to Cloud Storage
4. **Voice Chat**: Integrate WebRTC for voice channels
5. **Scaling**: Add caching, CDN, and load balancing

## 💰 Cost Monitoring

Stay within free tier:
- Cloud Run: 2M requests/month
- Firestore: 50K reads, 20K writes/day
- Firebase Auth: Unlimited
- Cloud Storage: 5GB

Set up billing alerts at $5, $10, $20 thresholds.

---

**🎉 You're ready to build the next Discord!**

For detailed documentation, see `GCP_DISCORD_CLONE_GUIDE.md`
