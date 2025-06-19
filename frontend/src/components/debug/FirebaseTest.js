import React, { useState } from 'react';
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '../../config/firebase';
import toast from 'react-hot-toast';

const FirebaseTest = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const testSignUp = async () => {
    setLoading(true);
    try {
      console.log('Testing Firebase signup with:', { email, password });
      const result = await signUpWithEmail(email, password);
      console.log('Signup successful:', result);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(`Signup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    try {
      console.log('Testing Firebase signin with:', { email, password });
      const result = await signInWithEmail(email, password);
      console.log('Signin successful:', result);
      toast.success('Signed in successfully!');
    } catch (error) {
      console.error('Signin error:', error);
      toast.error(`Signin failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGoogleSignIn = async () => {
    setLoading(true);
    try {
      console.log('Testing Google signin...');
      const result = await signInWithGoogle();
      console.log('Google signin successful:', result);
      toast.success('Google signin successful!');
    } catch (error) {
      console.error('Google signin error:', error);
      toast.error(`Google signin failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testFirebaseConfig = () => {
    console.log('Firebase Config:', {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID
    });
  };

  return (
    <div className="p-6 bg-discord-dark rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Firebase Authentication Test</h2>
      
      <div className="space-y-4">
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
        
        <div className="space-y-2">
          <button
            onClick={testSignUp}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Testing...' : 'Test Sign Up'}
          </button>
          
          <button
            onClick={testSignIn}
            disabled={loading}
            className="btn-secondary w-full"
          >
            {loading ? 'Testing...' : 'Test Sign In'}
          </button>
          
          <button
            onClick={testGoogleSignIn}
            disabled={loading}
            className="bg-white hover:bg-gray-100 text-gray-900 font-medium py-2 px-4 rounded w-full"
          >
            {loading ? 'Testing...' : 'Test Google Sign In'}
          </button>
          
          <button
            onClick={testFirebaseConfig}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded w-full"
          >
            Log Firebase Config
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-discord-light">
        <p>Open browser console (F12) to see detailed logs</p>
        <p>Check Firebase Console for authentication events</p>
      </div>
    </div>
  );
};

export default FirebaseTest;
