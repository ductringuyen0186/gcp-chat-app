import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, signOutUser } from '../config/firebase';
import { apiEndpoints } from '../config/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user profile in backend
  const initializeUserProfile = async (user) => {
    try {
      const response = await apiEndpoints.auth.updateProfile({
        displayName: user.displayName || user.email?.split('@')[0],
        photoURL: user.photoURL || null,
      });
      
      setUserProfile(response.data.user);
      toast.success('Welcome to Discord Clone!');
    } catch (error) {
      console.error('Error initializing user profile:', error);
      toast.error('Failed to initialize user profile');
    }
  };

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      const response = await apiEndpoints.auth.getProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.status === 404) {
        // Profile doesn't exist, create it
        if (currentUser) {
          await initializeUserProfile(currentUser);
        }
      }
    }
  };

  // Update user status
  const updateUserStatus = async (status) => {
    try {
      await apiEndpoints.auth.updateStatus(status);
      setUserProfile(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update status');
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await apiEndpoints.users.updateProfile(profileData);
      setUserProfile(response.data.user);
      toast.success('Profile updated successfully');
      return response.data.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await updateUserStatus('offline');
      await signOutUser();
      setCurrentUser(null);
      setUserProfile(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setCurrentUser(user);
      setError(null);
      
      if (user) {
        // User is signed in
        await fetchUserProfile();
      } else {
        // User is signed out
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Update status to online when user becomes active
  useEffect(() => {
    if (userProfile && currentUser) {
      updateUserStatus('online');
      
      // Set status to away after 5 minutes of inactivity
      let inactivityTimer;
      
      const resetTimer = () => {
        clearTimeout(inactivityTimer);
        if (userProfile.status !== 'online') {
          updateUserStatus('online');
        }
        
        inactivityTimer = setTimeout(() => {
          updateUserStatus('away');
        }, 5 * 60 * 1000); // 5 minutes
      };

      // Listen for user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => {
        document.addEventListener(event, resetTimer, true);
      });

      resetTimer();

      return () => {
        clearTimeout(inactivityTimer);
        events.forEach(event => {
          document.removeEventListener(event, resetTimer, true);
        });
      };
    }
  }, [userProfile, currentUser]);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    updateProfile,
    updateUserStatus,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
