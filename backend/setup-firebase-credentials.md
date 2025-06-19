# Firebase Credentials Setup Guide

## 🔥 Quick Fix for Firebase Error

The error you're seeing is because the Firebase service account credentials are not properly configured. Here's how to fix it:

### Step 1: Get Firebase Service Account Key

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `discord-clone-d4bd0`
3. **Click the gear icon** ⚙️ → **Project Settings**
4. **Go to Service Accounts tab**
5. **Click "Generate new private key"**
6. **Download the JSON file** (save it as `firebase-service-account.json`)

### Step 2: Extract Values from JSON

Open the downloaded JSON file and copy these values to your `.env` file:

```json
{
  "type": "service_account",
  "project_id": "discord-clone-d4bd0",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xyz@discord-clone-d4bd0.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

### Step 3: Update Your .env File

Replace these values in `backend/.env`:

```env
FIREBASE_PROJECT_ID=discord-clone-d4bd0
FIREBASE_PRIVATE_KEY_ID=abc123...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@discord-clone-d4bd0.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789...
```

**Important**: Keep the quotes around the private key and don't remove the `\n` characters!

### Step 4: Test the Fix

```bash
cd backend
npm run dev
```

You should see:
```
✅ Firebase Admin initialized
🚀 Server running on port 8080
📊 Health check: http://localhost:8080/health
```

## 🚨 Alternative: Quick Test Without Firebase

If you want to test the basic API without Firebase first, temporarily comment out the Firebase initialization:

1. Open `backend/src/index.js`
2. Comment out line 19: `// initializeFirebase();`
3. Run `npm run dev`

This will start the server without Firebase, allowing you to test basic endpoints.

## 🔧 Troubleshooting

### Error: "Invalid PEM formatted message"
- Make sure the private key is properly formatted with `\n` characters
- Keep the quotes around the private key value
- Don't add extra spaces or line breaks

### Error: "Project not found"
- Verify the project ID is exactly `discord-clone-d4bd0`
- Make sure you're using the correct Firebase project

### Error: "Permission denied"
- Make sure you downloaded the service account key (not the web app config)
- Verify the service account has the correct permissions

## ✅ Success Check

Once configured correctly, you should be able to:

1. Start the backend: `npm run dev`
2. Test health endpoint: `curl http://localhost:8080/health`
3. See Firebase initialization message in console

## 🎯 Next Steps

After fixing the Firebase credentials:

1. **Test the API**: `npm run test:local`
2. **Start the frontend**: `cd ../frontend && npm start`
3. **Create your first account** and start chatting!
