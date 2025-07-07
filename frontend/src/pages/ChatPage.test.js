import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@testing-library/jest-dom';
import ChatPage from './ChatPage-new';
import { AuthProvider } from '../contexts/AuthContext';
import { apiEndpoints } from '../config/api';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../config/api', () => ({
  apiEndpoints: {
    channels: {
      getAll: jest.fn(),
      getDemo: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: jest.fn(() => ({
    userProfile: { uid: 'test-user', displayName: 'Test User' },
    isAuthenticated: false,
  })),
}));

jest.mock('../hooks/useRealTimeMessages', () => ({
  useRealTimeMessages: () => ({
    messages: [],
    loading: false,
    sendMessage: jest.fn(),
    editMessage: jest.fn(),
    deleteMessage: jest.fn(),
    loadMoreMessages: jest.fn(),
  }),
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock the child components
jest.mock('../components/chat/ChannelSidebar', () => {
  return function MockChannelSidebar({ channels, onChannelSelect, onCreateChannel }) {
    return (
      <div data-testid="channel-sidebar">
        <div data-testid="channels-list">
          {channels.map((channel) => (
            <div
              key={channel.id}
              data-testid={`channel-${channel.id}`}
              onClick={() => onChannelSelect(channel.id)}
              role="button"
              tabIndex={0}
            >
              {channel.name}
            </div>
          ))}
        </div>
        <button
          data-testid="create-channel-btn"
          onClick={() => onCreateChannel({
            name: 'test-channel',
            type: 'text',
            description: 'Test channel'
          })}
        >
          Create Channel
        </button>
      </div>
    );
  };
});

jest.mock('../components/chat/MessageList', () => {
  return function MockMessageList() {
    return <div data-testid="message-list">Messages</div>;
  };
});

jest.mock('../components/chat/MessageInput', () => {
  return function MockMessageInput({ placeholder, disabled }) {
    return (
      <div data-testid="message-input">
        <input 
          placeholder={placeholder}
          disabled={disabled}
          data-testid="message-input-field"
        />
      </div>
    );
  };
});

// Test wrapper component
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ChatPage - Channel Loading and Creation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Reset auth mock to default
    const { useAuth } = require('../contexts/AuthContext');
    useAuth.mockReturnValue({
      userProfile: { uid: 'test-user', displayName: 'Test User' },
      isAuthenticated: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Channel Loading', () => {
    test('should load authenticated channels successfully', async () => {
      const mockChannels = [
        {
          id: 'channel-1',
          name: 'general',
          type: 'text',
          description: 'General discussion',
          serverId: 'server-1',
        },
        {
          id: 'channel-2',
          name: 'random',
          type: 'text',
          description: 'Random chat',
          serverId: 'server-1',
        },
      ];

      apiEndpoints.channels.getAll.mockResolvedValueOnce({
        data: { channels: mockChannels },
      });

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Should show loading state initially
      expect(screen.getByText('Loading Discord Clone...')).toBeInTheDocument();

      // Wait for channels to load
      await waitFor(() => {
        expect(screen.getByTestId('channel-sidebar')).toBeInTheDocument();
      });

      // Should display all channels
      expect(screen.getByTestId('channel-channel-1')).toBeInTheDocument();
      expect(screen.getByTestId('channel-channel-2')).toBeInTheDocument();
      expect(screen.getByTestId('channel-channel-1')).toHaveTextContent('general');
      expect(screen.getByTestId('channel-channel-2')).toHaveTextContent('random');

      // Should not show demo mode banner
      expect(screen.queryByText(/Demo Mode/)).not.toBeInTheDocument();

      // Should call the correct API
      expect(apiEndpoints.channels.getAll).toHaveBeenCalledTimes(1);
    });

    test('should fallback to demo channels when authentication fails', async () => {
      const mockDemoChannels = [
        {
          id: 'demo-1',
          name: 'welcome',
          type: 'text',
          description: 'Welcome to the demo',
          serverId: 'demo-server',
        },
      ];

      // Mock authentication failure
      apiEndpoints.channels.getAll.mockRejectedValueOnce(new Error('Unauthorized'));
      apiEndpoints.channels.getDemo.mockResolvedValueOnce({
        data: { channels: mockDemoChannels },
      });

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Wait for channels to load
      await waitFor(() => {
        expect(screen.getByTestId('channel-sidebar')).toBeInTheDocument();
      });

      // Should display demo channels
      expect(screen.getByTestId('channel-demo-1')).toBeInTheDocument();
      expect(screen.getByTestId('channel-demo-1')).toHaveTextContent('welcome');

      // Should show demo mode banner
      expect(screen.getByText(/Demo Mode/)).toBeInTheDocument();

      // Should show demo toast
      expect(toast.success).toHaveBeenCalledWith(
        'Welcome to Discord Clone Demo! Sign in to save your data.',
        { duration: 5000, position: 'top-center' }
      );

      // Should call both APIs
      expect(apiEndpoints.channels.getAll).toHaveBeenCalledTimes(1);
      expect(apiEndpoints.channels.getDemo).toHaveBeenCalledTimes(1);
    });

    test('should handle channel loading errors gracefully', async () => {
      // Mock both API calls to fail
      apiEndpoints.channels.getAll.mockRejectedValueOnce(new Error('Network error'));
      apiEndpoints.channels.getDemo.mockRejectedValueOnce(new Error('Demo unavailable'));

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Wait for error handling
      await waitFor(() => {
        expect(screen.queryByText('Loading Discord Clone...')).not.toBeInTheDocument();
      });

      // Should show error toast
      expect(toast.error).toHaveBeenCalledWith('Failed to load channels');

      // Should show welcome message when no channels available
      expect(screen.getByText('Welcome to Discord Clone')).toBeInTheDocument();
      expect(screen.getByText('No channels available. Create your first channel!')).toBeInTheDocument();
    });

    test('should select first channel automatically when channels load', async () => {
      const mockChannels = [
        {
          id: 'channel-1',
          name: 'general',
          type: 'text',
          description: 'General discussion',
          serverId: 'server-1',
        },
        {
          id: 'channel-2',
          name: 'random',
          type: 'text',
          description: 'Random chat',
          serverId: 'server-1',
        },
      ];

      apiEndpoints.channels.getAll.mockResolvedValueOnce({
        data: { channels: mockChannels },
      });

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Wait for channels to load
      await waitFor(() => {
        expect(screen.getByTestId('channel-sidebar')).toBeInTheDocument();
      });

      // Should show channel header with first channel name
      expect(screen.getByRole('heading', { name: 'general' })).toBeInTheDocument();
      expect(screen.getByTestId('message-list')).toBeInTheDocument();
      expect(screen.getByTestId('message-input')).toBeInTheDocument();
    });
  });

  describe('Channel Creation', () => {
    test('should create authenticated channel successfully', async () => {
      const mockExistingChannels = [
        {
          id: 'channel-1',
          name: 'general',
          type: 'text',
          description: 'General discussion',
          serverId: 'server-1',
        },
      ];

      const mockNewChannel = {
        id: 'channel-2',
        name: 'new-channel',
        type: 'text',
        description: 'Test channel',
        serverId: 'server-1',
      };

      apiEndpoints.channels.getAll.mockResolvedValueOnce({
        data: { channels: mockExistingChannels },
      });

      apiEndpoints.channels.create.mockResolvedValueOnce({
        data: { channel: mockNewChannel },
      });

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Wait for initial channels to load
      await waitFor(() => {
        expect(screen.getByTestId('channel-sidebar')).toBeInTheDocument();
      });

      // Click create channel button
      const createButton = screen.getByTestId('create-channel-btn');
      
      fireEvent.click(createButton);

      // Wait for new channel to appear
      await waitFor(() => {
        expect(screen.getByTestId('channel-channel-2')).toBeInTheDocument();
      });

      // Should display new channel
      expect(screen.getByRole('heading', { name: 'new-channel' })).toBeInTheDocument();

      // Should call create API
      expect(apiEndpoints.channels.create).toHaveBeenCalledWith({
        name: 'test-channel',
        type: 'text',
        description: 'Test channel',
      });

      // Should show success toast
      expect(toast.success).toHaveBeenCalledWith('Channel created successfully!');
    });

    test('should create demo channel when in demo mode', async () => {
      const mockDemoChannels = [
        {
          id: 'demo-1',
          name: 'welcome',
          type: 'text',
          description: 'Welcome to the demo',
          serverId: 'demo-server',
        },
      ];

      // Mock authentication failure to trigger demo mode
      apiEndpoints.channels.getAll.mockRejectedValueOnce(new Error('Unauthorized'));
      apiEndpoints.channels.getDemo.mockResolvedValueOnce({
        data: { channels: mockDemoChannels },
      });

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Wait for demo channels to load
      await waitFor(() => {
        expect(screen.getByText(/Demo Mode/)).toBeInTheDocument();
      });

      // Click create channel button
      const createButton = screen.getByTestId('create-channel-btn');
      
      fireEvent.click(createButton);

      // Wait for new demo channel to appear
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'test-channel' })).toBeInTheDocument();
      });

      // Should NOT call create API (since it's demo mode)
      expect(apiEndpoints.channels.create).not.toHaveBeenCalled();

      // Should show demo success toast
      expect(toast.success).toHaveBeenCalledWith(
        'Demo channel created! Sign in to save your channels permanently.'
      );
    });

    test.skip('should handle channel creation errors', async () => {
      const { useAuth } = require('../contexts/AuthContext');
      
      // Mock authenticated user for this test
      useAuth.mockReturnValue({
        userProfile: { uid: 'test-user', displayName: 'Test User' },
        isAuthenticated: true,
      });

      const mockExistingChannels = [
        {
          id: 'channel-1',
          name: 'general',
          type: 'text',
          description: 'General discussion',
          serverId: 'server-1',
        },
      ];

      apiEndpoints.channels.getAll.mockResolvedValueOnce({
        data: { channels: mockExistingChannels },
      });

      // Mock the error response
      const mockError = { message: 'Creation failed', name: 'Error' };
      apiEndpoints.channels.create.mockRejectedValue(mockError);

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Wait for initial channels to load
      await waitFor(() => {
        expect(screen.getByTestId('channel-sidebar')).toBeInTheDocument();
      });

      // Click create channel button
      const createButton = screen.getByTestId('create-channel-btn');
      fireEvent.click(createButton);

      // Wait for the API call to be made
      await waitFor(() => {
        expect(apiEndpoints.channels.create).toHaveBeenCalledWith({
          name: 'test-channel',
          type: 'text',
          description: 'Test channel'
        });
      });

      // Wait for error handling
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to create channel');
      }, { timeout: 3000 });

      // Should still only have the original channel
      expect(screen.getByTestId('channel-channel-1')).toBeInTheDocument();
      expect(screen.queryByTestId('channel-channel-2')).not.toBeInTheDocument();
    });
  });

  describe('Channel Selection', () => {
    test('should switch channels when clicked', async () => {
      const mockChannels = [
        {
          id: 'channel-1',
          name: 'general',
          type: 'text',
          description: 'General discussion',
          serverId: 'server-1',
        },
        {
          id: 'channel-2',
          name: 'random',
          type: 'text',
          description: 'Random chat',
          serverId: 'server-1',
        },
      ];

      apiEndpoints.channels.getAll.mockResolvedValueOnce({
        data: { channels: mockChannels },
      });

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Wait for channels to load
      await waitFor(() => {
        expect(screen.getByTestId('channel-sidebar')).toBeInTheDocument();
      });

      // Initially should show first channel (general)
      expect(screen.getByRole('heading', { name: 'general' })).toBeInTheDocument();

      // Click on second channel
      const randomChannel = screen.getByTestId('channel-channel-2');
      fireEvent.click(randomChannel);

      // Should switch to random channel
      await waitFor(() => {
        expect(screen.getByText('Random chat')).toBeInTheDocument();
      });
    });
  });

  describe('Demo Mode Functionality', () => {
    test('should disable message input in demo mode', async () => {
      const mockDemoChannels = [
        {
          id: 'demo-1',
          name: 'welcome',
          type: 'text',
          description: 'Welcome to the demo',
          serverId: 'demo-server',
        },
      ];

      // Mock authentication failure to trigger demo mode
      apiEndpoints.channels.getAll.mockRejectedValueOnce(new Error('Unauthorized'));
      apiEndpoints.channels.getDemo.mockResolvedValueOnce({
        data: { channels: mockDemoChannels },
      });

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Wait for demo mode to load
      await waitFor(() => {
        expect(screen.getByText(/Demo Mode/)).toBeInTheDocument();
      });

      // Message input should be disabled with demo placeholder
      const messageInput = screen.getByTestId('message-input-field');
      expect(messageInput).toHaveAttribute('disabled');
      expect(messageInput).toHaveAttribute('placeholder', 'Sign in to send messages...');
    });

    test('should show demo mode banner with sign-in button', async () => {
      const mockDemoChannels = [
        {
          id: 'demo-1',
          name: 'welcome',
          type: 'text',
          description: 'Welcome to the demo',
          serverId: 'demo-server',
        },
      ];

      // Mock authentication failure to trigger demo mode
      apiEndpoints.channels.getAll.mockRejectedValueOnce(new Error('Unauthorized'));
      apiEndpoints.channels.getDemo.mockResolvedValueOnce({
        data: { channels: mockDemoChannels },
      });

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Wait for demo mode to load
      await waitFor(() => {
        expect(screen.getByText(/Demo Mode/)).toBeInTheDocument();
      });

      // Should show demo banner
      expect(screen.getByText('🚀 Demo Mode - Try the features! Sign in to save your data permanently.')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });
});
