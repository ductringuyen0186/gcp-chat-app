import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { signUpWithEmail, signInWithEmail, signInWithGoogle, auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const DebugAuthPage = () => {
  const { currentUser, userProfile } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [displayName, setDisplayName] = useState('Test User');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      console.log('🔥 Starting Firebase signup...');
      console.log('Config check:', {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY?.substring(0, 10) + '...',
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
      });

      const userCredential = await signUpWithEmail(email, password);
      console.log('✅ Firebase signup successful:', userCredential);
      
      // Update display name
      if (userCredential.user && displayName) {
        await userCredential.user.updateProfile({
          displayName: displayName
        });
        console.log('✅ Display name updated');
      }

      toast.success('Account created successfully!');
    } catch (error) {
      console.error('❌ Firebase signup error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to create account';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak (minimum 6 characters)';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error - check your internet connection';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      console.log('🔥 Starting Firebase signin...');
      const userCredential = await signInWithEmail(email, password);
      console.log('✅ Firebase signin successful:', userCredential);
      toast.success('Signed in successfully!');
    } catch (error) {
      console.error('❌ Firebase signin error:', error);
      
      let errorMessage = 'Failed to sign in';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      console.log('🔥 Starting Google signin...');
      const userCredential = await signInWithGoogle();
      console.log('✅ Google signin successful:', userCredential);
      toast.success('Google signin successful!');
    } catch (error) {
      console.error('❌ Google signin error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Google signin failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const checkFirebaseConfig = () => {
    const config = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    };
    
    console.log('🔧 Firebase Configuration:', config);
    
    const missing = Object.entries(config).filter(([key, value]) => !value || value.includes('your-'));
    if (missing.length > 0) {
      console.error('❌ Missing or invalid config values:', missing);
      toast.error('Firebase configuration is incomplete!');
    } else {
      console.log('✅ Firebase configuration looks good');
      toast.success('Firebase configuration is valid');
    }
  };

  return (
    <div className="min-h-screen bg-discord-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/chat"
            className="flex items-center space-x-2 text-discord-light hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Chat</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">🔥 Firebase Auth Debug</h1>
            <p className="text-discord-light">Test Firebase authentication directly</p>
          </div>
        </div>

        {/* Current User Status */}
        <div className="bg-discord-dark p-4 rounded-lg mb-6">
          <h3 className="text-white font-semibold mb-2">Current User Status</h3>
          {currentUser ? (
            <div className="space-y-2">
              <p className="text-green-400">✅ Authenticated</p>
              <p className="text-discord-light">Email: {currentUser.email}</p>
              <p className="text-discord-light">Display Name: {currentUser.displayName || 'Not set'}</p>
              <p className="text-discord-light">UID: {currentUser.uid}</p>
              {userProfile && (
                <p className="text-discord-light">Backend Profile: ✅ Created</p>
              )}
              <button
                onClick={handleSignOut}
                className="btn-danger mt-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <p className="text-red-400">❌ Not authenticated</p>
          )}
        </div>

        {/* Test Form */}
        <div className="bg-discord-dark p-6 rounded-lg mb-6">
          <h3 className="text-white font-semibold mb-4">Test Authentication</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-discord-light mb-1">Display Name:</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input-primary w-full"
                placeholder="Test User"
              />
            </div>
            
            <div>
              <label className="block text-sm text-discord-light mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-primary w-full"
                placeholder="test@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm text-discord-light mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-primary w-full"
                placeholder="password123"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
              
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="btn-secondary"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="bg-white hover:bg-gray-100 text-gray-900 font-medium py-2 px-4 rounded"
              >
                {loading ? 'Signing in...' : 'Google Sign In'}
              </button>
              
              <button
                onClick={checkFirebaseConfig}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded"
              >
                Check Config
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-discord-dark p-4 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Debug Instructions</h3>
          <ul className="text-discord-light text-sm space-y-1">
            <li>1. Open browser console (F12) to see detailed logs</li>
            <li>2. Check Firebase Console for authentication events</li>
            <li>3. Verify Firebase Auth is enabled in your project</li>
            <li>4. Make sure Email/Password provider is enabled</li>
            <li>5. Check if your domain is authorized in Firebase Auth settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugAuthPage;
