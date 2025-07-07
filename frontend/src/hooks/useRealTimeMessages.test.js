import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRealTimeMessages } from './useRealTimeMessages';
import { apiEndpoints } from '../config/api';

// Mock the API
jest.mock('../config/api', () => ({
  apiEndpoints: {
    messages: {
      getByChannel: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock Firebase real-time listener
jest.mock('../config/firebase', () => ({
  onSnapshot: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  where: jest.fn(),
}));

describe('useRealTimeMessages Hook', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  test('should initialize with empty messages and loading state', () => {
    const { result } = renderHook(() => useRealTimeMessages('channel-1'), { wrapper });

    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(typeof result.current.sendMessage).toBe('function');
    expect(typeof result.current.editMessage).toBe('function');
    expect(typeof result.current.deleteMessage).toBe('function');
    expect(typeof result.current.loadMoreMessages).toBe('function');
  });

  test('should handle null channelId gracefully', () => {
    const { result } = renderHook(() => useRealTimeMessages(null), { wrapper });

    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  test('should send message successfully', async () => {
    const mockMessage = {
      id: 'msg-1',
      content: 'Test message',
      authorId: 'user-1',
      channelId: 'channel-1',
      createdAt: new Date().toISOString(),
    };

    apiEndpoints.messages.create.mockResolvedValueOnce({
      data: { message: mockMessage },
    });

    const { result } = renderHook(() => useRealTimeMessages('channel-1'), { wrapper });

    await result.current.sendMessage('Test message');

    expect(apiEndpoints.messages.create).toHaveBeenCalledWith({
      content: 'Test message',
      channelId: 'channel-1',
    });
  });

  test('should edit message successfully', async () => {
    const mockUpdatedMessage = {
      id: 'msg-1',
      content: 'Updated message',
      authorId: 'user-1',
      channelId: 'channel-1',
      updatedAt: new Date().toISOString(),
    };

    apiEndpoints.messages.update.mockResolvedValueOnce({
      data: { message: mockUpdatedMessage },
    });

    const { result } = renderHook(() => useRealTimeMessages('channel-1'), { wrapper });

    await result.current.editMessage('msg-1', 'Updated message');

    expect(apiEndpoints.messages.update).toHaveBeenCalledWith('msg-1', {
      content: 'Updated message',
    });
  });

  test('should delete message successfully', async () => {
    apiEndpoints.messages.delete.mockResolvedValueOnce({
      data: { success: true },
    });

    const { result } = renderHook(() => useRealTimeMessages('channel-1'), { wrapper });

    await result.current.deleteMessage('msg-1');

    expect(apiEndpoints.messages.delete).toHaveBeenCalledWith('msg-1');
  });
});
