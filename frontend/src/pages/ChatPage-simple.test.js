import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@testing-library/jest-dom';
import { Toaster } from 'react-hot-toast';
import ChatPage from './ChatPage-new';
import { apiEndpoints } from '../config/api';

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
  useAuth: () => ({
    userProfile: { uid: 'test-user', displayName: 'Test User' },
    isAuthenticated: false,
  }),
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

    test('should handle creation errors', async () => {
      const mockChannels = [
        { id: 'channel-1', name: 'general', type: 'text' },
      ];

      apiEndpoints.channels.getAll.mockResolvedValueOnce({
        data: { channels: mockChannels },
      });

      apiEndpoints.channels.create.mockRejectedValueOnce(new Error('Creation failed'));

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

      // Should still have same number of channels
      await waitFor(() => {
        expect(screen.getByTestId('channels-count')).toHaveTextContent('1');
      });
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
