# Discord Clone Frontend Setup Guide

Complete setup guide for the React frontend with real-time chat functionality.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Firebase configuration
```

### 3. Firebase Configuration
Get your Firebase config from [Firebase Console](https://console.firebase.google.com/):

1. Go to Project Settings > General > Your apps
2. Copy the config values to your `.env` file:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id

# Point to your backend API
REACT_APP_API_URL=http://localhost:8080
```

### 4. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🧪 Testing the Application

### 1. API Testing Interface
Visit `http://localhost:3000/test` to access the built-in API testing interface:

- Tests backend connectivity
- Validates API endpoints
- Shows response data
- Helps debug issues

### 2. Manual Testing Steps

1. **Start Backend**: Make sure your backend is running on port 8080
2. **Open Frontend**: Navigate to `http://localhost:3000`
3. **Create Account**: Sign up with email or Google
4. **Test Chat**: 
   - Create channels
   - Send messages
   - Edit/delete messages
   - Test real-time updates (open multiple tabs)

## 🎯 Features Included

### ✅ Authentication
- Firebase Auth integration
- Email/password signup
- Google OAuth
- Automatic profile creation
- User status management

### ✅ Real-time Chat
- Live message updates
- Firestore real-time listeners
- Message pagination
- Edit/delete messages
- Emoji picker

### ✅ Channel Management
- Create/delete channels
- Channel switching
- Real-time channel updates

### ✅ User Interface
- Discord-like design
- Responsive layout
- Dark theme
- Loading states
- Error handling
- Toast notifications

## 🔧 Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Project Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── chat/           # Chat interface components
│   │   └── common/         # Shared components
│   ├── contexts/
│   │   └── AuthContext.js  # Authentication state
│   ├── hooks/
│   │   └── useRealTimeMessages.js  # Real-time messaging
│   ├── pages/
│   │   ├── AuthPage.js     # Login/signup
│   │   ├── ChatPage.js     # Main chat interface
│   │   └── TestPage.js     # API testing
│   ├── config/
│   │   ├── firebase.js     # Firebase configuration
│   │   └── api.js          # API client
│   ├── App.js              # Main app component
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json
├── tailwind.config.js      # Tailwind CSS config
└── .env.example            # Environment template
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Auth Error**
   - Check your Firebase config in `.env`
   - Ensure Firebase Auth is enabled in console
   - Verify domain is added to authorized domains

2. **API Connection Failed**
   - Make sure backend is running on correct port
   - Check `REACT_APP_API_URL` in `.env`
   - Test API directly: `curl http://localhost:8080/health`

3. **Real-time Updates Not Working**
   - Check Firestore rules are deployed
   - Verify Firebase project ID matches
   - Check browser console for errors

4. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Mode
Enable debug logging by adding to `.env`:
```env
REACT_APP_DEBUG=true
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Deploy to Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Enable Firebase security rules
- Validate all user inputs
- Use HTTPS in production

## 📱 Mobile Support

The app is responsive and works on mobile devices:
- Touch-friendly interface
- Responsive design
- Mobile-optimized chat input
- Swipe gestures (future enhancement)

## 🎨 Customization

### Themes
Modify colors in `tailwind.config.js`:
```javascript
colors: {
  discord: {
    primary: '#5865F2',    // Change primary color
    secondary: '#4752C4',  // Change secondary color
    // ... other colors
  }
}
```

### Components
All components are modular and can be easily customized:
- `src/components/auth/` - Authentication UI
- `src/components/chat/` - Chat interface
- `src/components/common/` - Shared components

## 🔄 Real-time Features

The app uses Firestore real-time listeners for:
- Live message updates
- User status changes
- Channel updates
- Typing indicators (future)

## 📊 Performance

Optimizations included:
- React Query for API caching
- Lazy loading of components
- Optimized re-renders
- Efficient Firestore queries
- Image optimization

---

## 🎉 You're Ready!

Your Discord clone frontend is now set up with:
- ✅ Real-time chat functionality
- ✅ User authentication
- ✅ Channel management
- ✅ Testing interface
- ✅ Production-ready build

Start chatting and building your community! 🚀
