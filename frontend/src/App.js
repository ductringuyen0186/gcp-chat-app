import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import TestPage from './pages/TestPage';
import MockChannelDemo from './components/debug/MockChannelDemo';
import AdvancedChannelDemo from './components/debug/AdvancedChannelDemo';
import LoadingSpinner from './components/common/LoadingSpinner';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

// Public Route Component (redirect to chat if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return !isAuthenticated ? children : <Navigate to="/chat" replace />;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route
          path="/chat"
          element={<ChatPage />}
        />
        <Route
          path="/test"
          element={<TestPage />}
        />
        <Route
          path="/mock-demo"
          element={<MockChannelDemo />}
        />
        <Route
          path="/advanced-demo"
          element={<AdvancedChannelDemo />}
        />

        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </Router>
  );
};

// Main App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#2F3136',
                color: '#DCDDDE',
                border: '1px solid #40444B',
              },
              success: {
                iconTheme: {
                  primary: '#3BA55D',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ED4245',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
