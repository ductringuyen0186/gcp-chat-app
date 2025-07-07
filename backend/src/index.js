const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Add error logging for debugging
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  process.exit(1);
});

const authRoutes = require('./routes/auth');
const channelRoutes = require('./routes/channels');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');

const { initializeFirebase } = require('./services/firebase');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Firebase Admin - re-enabling with better error handling
try {
  console.log('🔥 Attempting to initialize Firebase Admin SDK...');
  initializeFirebase();
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.error('📊 Error details:', error);
  console.warn('🔧 Please configure Firebase credentials in .env file');
  console.warn('📖 See backend/setup-firebase-credentials.md for help');
  console.warn('⚠️  Backend will continue running without Firebase features');
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`📥 Incoming ${req.method} request to ${req.path} at ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🔍 Health check request received at:', new Date().toISOString());
  console.log('🌐 Request headers:', req.headers);
  console.log('🔗 Request URL:', req.url);
  
  const response = { 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Discord Clone API',
    firebase: 'enabled'
  };
  
  console.log('✅ Sending health check response:', response);
  res.status(200).json(response);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
