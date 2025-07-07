import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@testing-library/jest-dom';
import { Toaster } from 'react-hot-toast';
import ChatPage from './ChatPage-new';
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
  useAuth: jest.fn(() => ({
    userProfile: { uid: 'test-user', displayName: 'Test User' },
    isAuthenticated: false,
  })),
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
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

// Mock child components to avoid complexity
jest.mock('../components/chat/ChannelSidebar', () => {
  return function MockChannelSidebar({ channels, onChannelSelect, onCreateChannel }) {
    return (
      <div data-testid="channel-sidebar">
        <div data-testid="channels-count">{channels.length}</div>
        {channels.map((channel) => (
          <button
            key={channel.id}
            data-testid={`channel-btn-${channel.id}`}
            onClick={() => onChannelSelect(channel.id)}
          >
            {channel.name}
          </button>
        ))}
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
  return function MockMessageInput({ disabled, placeholder }) {
    return (
      <div data-testid="message-input">
        <input 
          data-testid="message-input-field"
          disabled={disabled}
          placeholder={placeholder}
        />
      </div>
    );
  };
});

// Test wrapper
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
        {children}
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ChatPage - Channel Loading and Creation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset toast mocks
    toast.success.mockClear();
    toast.error.mockClear();
    toast.info.mockClear();
    
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
        { id: 'channel-1', name: 'general', type: 'text' },
        { id: 'channel-2', name: 'random', type: 'text' },
      ];

      apiEndpoints.channels.getAll.mockResolvedValueOnce({
        data: { channels: mockChannels },
      });

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Should show loading initially
      expect(screen.getByText('Loading Discord Clone...')).toBeInTheDocument();

      // Wait for channels to load
      await waitFor(() => {
        expect(screen.getByTestId('channels-count')).toHaveTextContent('2');
      });

      // Should display channels
      expect(screen.getByTestId('channel-btn-channel-1')).toBeInTheDocument();
      expect(screen.getByTestId('channel-btn-channel-2')).toBeInTheDocument();

      // Should not show demo banner
      expect(screen.queryByText(/Demo Mode/)).not.toBeInTheDocument();

      expect(apiEndpoints.channels.getAll).toHaveBeenCalledTimes(1);
    });

    test('should fallback to demo channels when authentication fails', async () => {
      const mockDemoChannels = [
        { id: 'demo-1', name: 'welcome', type: 'text' },
      ];

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
        expect(screen.getByTestId('channels-count')).toHaveTextContent('1');
      });

      // Should display demo channel
      expect(screen.getByTestId('channel-btn-demo-1')).toBeInTheDocument();

      // Should show demo banner
      expect(screen.getByText(/Demo Mode/)).toBeInTheDocument();

      expect(apiEndpoints.channels.getAll).toHaveBeenCalledTimes(1);
      expect(apiEndpoints.channels.getDemo).toHaveBeenCalledTimes(1);
    });

    test('should handle loading errors gracefully', async () => {
      apiEndpoints.channels.getAll.mockRejectedValueOnce(new Error('Network error'));
      apiEndpoints.channels.getDemo.mockRejectedValueOnce(new Error('Demo unavailable'));

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Wait for error state
      await waitFor(() => {
        expect(screen.queryByText('Loading Discord Clone...')).not.toBeInTheDocument();
      });

      // Should show welcome message when no channels
      expect(screen.getByText('Welcome to Discord Clone')).toBeInTheDocument();
      expect(screen.getByText(/No channels available/)).toBeInTheDocument();
    });
  });

  describe('Channel Creation', () => {
    test('should create authenticated channel successfully', async () => {
      const mockExistingChannels = [
        { id: 'channel-1', name: 'general', type: 'text' },
      ];

      const mockNewChannel = {
        id: 'channel-2',
        name: 'test-channel',
        type: 'text',
        description: 'Test channel',
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

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('channels-count')).toHaveTextContent('1');
      });

      // Click create channel
      fireEvent.click(screen.getByTestId('create-channel-btn'));

      // Wait for new channel to appear
      await waitFor(() => {
        expect(screen.getByTestId('channels-count')).toHaveTextContent('2');
      });

      expect(screen.getByTestId('channel-btn-channel-2')).toBeInTheDocument();
      expect(apiEndpoints.channels.create).toHaveBeenCalledWith({
        name: 'test-channel',
        type: 'text',
        description: 'Test channel',
      });
    });

    test('should create demo channel when in demo mode', async () => {
      const mockDemoChannels = [
        { id: 'demo-1', name: 'welcome', type: 'text' },
      ];

      apiEndpoints.channels.getAll.mockRejectedValueOnce(new Error('Unauthorized'));
      apiEndpoints.channels.getDemo.mockResolvedValueOnce({
        data: { channels: mockDemoChannels },
      });

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Wait for demo mode
      await waitFor(() => {
        expect(screen.getByText(/Demo Mode/)).toBeInTheDocument();
      });

      // Click create channel
      fireEvent.click(screen.getByTestId('create-channel-btn'));

      // Wait for new demo channel
      await waitFor(() => {
        expect(screen.getByTestId('channels-count')).toHaveTextContent('2');
      });

      // Should NOT call create API in demo mode
      expect(apiEndpoints.channels.create).not.toHaveBeenCalled();
    });

    test.skip('should handle creation errors', async () => {
      const { useAuth } = require('../contexts/AuthContext');
      
      // Mock authenticated user for this test
      useAuth.mockReturnValue({
        userProfile: { uid: 'test-user', displayName: 'Test User' },
        isAuthenticated: true,
      });

      const mockChannels = [
        { id: 'channel-1', name: 'general', type: 'text' },
      ];

      apiEndpoints.channels.getAll.mockResolvedValueOnce({
        data: { channels: mockChannels },
      });

      // Mock the error response
      const mockError = { message: 'Creation failed', name: 'Error' };
      apiEndpoints.channels.create.mockRejectedValue(mockError);

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId('channels-count')).toHaveTextContent('1');
      });

      // Click create channel
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

      // Should still have same number of channels
      expect(screen.getByTestId('channels-count')).toHaveTextContent('1');
    });
  });

  describe('Demo Mode Features', () => {
    test('should disable message input in demo mode', async () => {
      const mockDemoChannels = [
        { id: 'demo-1', name: 'welcome', type: 'text' },
      ];

      apiEndpoints.channels.getAll.mockRejectedValueOnce(new Error('Unauthorized'));
      apiEndpoints.channels.getDemo.mockResolvedValueOnce({
        data: { channels: mockDemoChannels },
      });

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Demo Mode/)).toBeInTheDocument();
      });

      const messageInput = screen.getByTestId('message-input-field');
      expect(messageInput).toBeDisabled();
      expect(messageInput).toHaveAttribute('placeholder', 'Sign in to send messages...');
    });

    test('should show demo banner with sign in button', async () => {
      const mockDemoChannels = [
        { id: 'demo-1', name: 'welcome', type: 'text' },
      ];

      apiEndpoints.channels.getAll.mockRejectedValueOnce(new Error('Unauthorized'));
      apiEndpoints.channels.getDemo.mockResolvedValueOnce({
        data: { channels: mockDemoChannels },
      });

      render(
        <TestWrapper>
          <ChatPage />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(/Demo Mode/)).toBeInTheDocument();
      });

      expect(screen.getByText('🚀 Demo Mode - Try the features! Sign in to save your data permanently.')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });
});
