import axios from 'axios';
import { getCurrentUserToken } from './firebase';

// API base URL - adjust based on your backend deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getCurrentUserToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // Health check
  health: () => api.get('/health'),

  // Authentication
  auth: {
    getProfile: () => api.get('/api/auth/me'),
    updateProfile: (data) => api.post('/api/auth/profile', data),
    updateStatus: (status) => api.patch('/api/auth/status', { status }),
  },

  // Channels
  channels: {
    getAll: (serverId) => api.get('/api/channels', { params: { serverId } }),
    getDemo: () => api.get('/api/channels/demo'), // Demo channels without auth
    getById: (channelId) => api.get(`/api/channels/${channelId}`),
    create: (data) => api.post('/api/channels', data),
    update: (channelId, data) => api.patch(`/api/channels/${channelId}`, data),
    delete: (channelId) => api.delete(`/api/channels/${channelId}`),
  },

  // Messages
  messages: {
    getByChannel: (channelId, params = {}) => 
      api.get(`/api/messages/channel/${channelId}`, { params }),
    send: (channelId, data) => api.post(`/api/messages/channel/${channelId}`, data),
    update: (messageId, data) => api.patch(`/api/messages/${messageId}`, data),
    delete: (messageId) => api.delete(`/api/messages/${messageId}`),
  },

  // Users
  users: {
    getById: (userId) => api.get(`/api/users/${userId}`),
    search: (query, limit = 20) => api.get('/api/users', { params: { search: query, limit } }),
    updateProfile: (data) => api.patch('/api/users/me', data),
  },
};

export default api;
