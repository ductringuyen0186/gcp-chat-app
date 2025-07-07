# Complete Discord Clone Testing Guide

This guide will help you test your Discord clone application end-to-end.

## 🚀 Quick Test Setup (5 Minutes)

### 1. Start Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Firebase credentials
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Firebase config
npm start
```

### 3. Quick API Test
```bash
# Test backend health
curl http://localhost:8080/health

# Or use the built-in test runner
cd backend
npm run test:local
```

## 🧪 Comprehensive Testing

### Backend API Testing

#### 1. Automated Tests
```bash
cd backend
npm run test:local
```

This runs comprehensive API tests including:
- Health check endpoint
- Authentication validation
- Route protection
- Error handling

#### 2. Manual API Testing

**Health Check:**
```bash
curl http://localhost:8080/health
```

**Test Authentication (should fail):**
```bash
curl http://localhost:8080/api/auth/me
# Expected: 401 Unauthorized
```

**Test with Firebase Token:**
```bash
# Get token from frontend after login, then:
curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
     http://localhost:8080/api/auth/me
```

### Frontend Testing

#### 1. Built-in Test Interface
1. Open `http://localhost:3000/test`
2. Click "Run All Tests"
3. Verify all tests pass

#### 2. Manual Frontend Testing

**Authentication Flow:**
1. Go to `http://localhost:3000`
2. Click "Register" 
3. Create account with email/password or Google
4. Verify redirect to chat interface

**Chat Functionality:**
1. Create a new channel
2. Send messages
3. Edit messages (click message menu)
4. Delete messages
5. Test emoji picker
6. Test real-time updates (open multiple tabs)

**User Management:**
1. Click user avatar in sidebar
2. Change status (online/away/offline)
3. Sign out and back in

## 🔄 Real-time Testing

### Test Real-time Messages
1. Open chat in two browser tabs/windows
2. Send message in one tab
3. Verify it appears instantly in the other tab
4. Test with multiple users (different accounts)

### Test Real-time Channels
1. Create channel in one tab
2. Verify it appears in other tabs
3. Test channel switching

### Test User Status
1. Change status in one tab
2. Verify status updates in other tabs
3. Test going offline/online

## 🌐 Production Testing

### Deploy Backend to Cloud Run
```bash
cd backend
chmod +x deploy.sh
./deploy.sh
```

### Deploy Frontend to Firebase Hosting
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Test Production Deployment
1. Update frontend `.env` with production API URL
2. Test all functionality on deployed version
3. Verify HTTPS connections
4. Test from different devices/networks

## 📊 Performance Testing

### Load Testing Backend
```bash
# Install Apache Bench
# Test health endpoint
ab -n 1000 -c 10 http://localhost:8080/health

# Test with authentication (replace TOKEN)
ab -n 100 -c 5 -H "Authorization: Bearer TOKEN" \
   http://localhost:8080/api/channels
```

### Frontend Performance
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run performance audit
4. Optimize based on recommendations

## 🐛 Common Issues & Solutions

### Backend Issues

**Port Already in Use:**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

**Firebase Auth Error:**
- Check service account key in `.env`
- Verify Firebase project ID
- Ensure Firestore rules are deployed

**Database Connection Failed:**
```bash
# Check Firestore rules
firebase firestore:rules:get

# Deploy rules
firebase deploy --only firestore:rules
```

### Frontend Issues

**Build Errors:**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

**Firebase Config Error:**
- Verify all Firebase config values in `.env`
- Check Firebase console for correct values
- Ensure domain is authorized in Firebase Auth

**API Connection Failed:**
- Check `REACT_APP_API_URL` in `.env`
- Verify backend is running
- Check CORS configuration

## 🔍 Debug Mode

### Enable Backend Debugging
```bash
# Add to backend/.env
LOG_LEVEL=DEBUG
NODE_ENV=development
```

### Enable Frontend Debugging
```bash
# Add to frontend/.env
REACT_APP_DEBUG=true
```

### Check Logs
```bash
# Backend logs (local)
npm run dev

# Backend logs (Cloud Run)
gcloud run services logs read discord-clone-api --region=us-central1

# Frontend logs
# Open browser console (F12)
```

## 📱 Mobile Testing

### Test on Mobile Devices
1. Connect phone to same WiFi network
2. Find your computer's IP address
3. Access `http://YOUR_IP:3000` on mobile
4. Test touch interactions
5. Verify responsive design

### Mobile-specific Tests
- Touch scrolling in message list
- Virtual keyboard behavior
- Portrait/landscape orientation
- Touch targets are large enough

## 🔐 Security Testing

### Authentication Security
1. Test without tokens (should get 401)
2. Test with expired tokens
3. Test with invalid tokens
4. Verify user can only edit own messages

### Input Validation
1. Test XSS in messages
2. Test SQL injection attempts
3. Test extremely long messages
4. Test special characters

### CORS Testing
```bash
# Test CORS from different origin
curl -H "Origin: http://evil-site.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:8080/api/channels
```

## 📈 Monitoring & Analytics

### Set up Monitoring
1. Enable Cloud Logging in GCP
2. Set up error reporting
3. Monitor API response times
4. Track user engagement

### Key Metrics to Monitor
- API response times
- Error rates
- User sign-ups
- Message volume
- Active users

## ✅ Testing Checklist

### Backend ✅
- [ ] Health check works
- [ ] Authentication required for protected routes
- [ ] CRUD operations for channels work
- [ ] CRUD operations for messages work
- [ ] Real-time updates via Firestore
- [ ] Error handling works
- [ ] Input validation works
- [ ] Deployment successful

### Frontend ✅
- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth works
- [ ] Channel creation works
- [ ] Message sending works
- [ ] Message editing works
- [ ] Message deletion works
- [ ] Real-time updates work
- [ ] Emoji picker works
- [ ] User status updates work
- [ ] Responsive design works
- [ ] Error handling works
- [ ] Loading states work

### Integration ✅
- [ ] Frontend connects to backend
- [ ] Authentication flow complete
- [ ] Real-time messaging works
- [ ] Multiple users can chat
- [ ] Data persists correctly
- [ ] Production deployment works

## 🎉 Success Criteria

Your Discord clone is working correctly if:

1. ✅ Users can register and login
2. ✅ Users can create and join channels
3. ✅ Messages appear in real-time
4. ✅ Users can edit/delete their messages
5. ✅ Multiple users can chat simultaneously
6. ✅ Data persists across sessions
7. ✅ Application works on mobile
8. ✅ Production deployment is successful

---

## 🚀 You're Ready to Launch!

Your Discord clone is now fully tested and ready for users. The application includes:

- **Real-time chat** with instant message delivery
- **User authentication** with Firebase Auth
- **Channel management** for organized conversations
- **Mobile-responsive** design
- **Production-ready** deployment
- **Comprehensive testing** suite

Start inviting users and building your community! 🎊
