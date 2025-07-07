import axios from 'axios';
import { apiEndpoints } from './api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('API Endpoints - Channels', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Channel API', () => {
    test('should fetch all channels', async () => {
      const mockChannels = [
        { id: '1', name: 'general', type: 'text' },
        { id: '2', name: 'random', type: 'text' },
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { channels: mockChannels },
      });

      const result = await apiEndpoints.channels.getAll();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/channels');
      expect(result.data.channels).toEqual(mockChannels);
    });

    test('should fetch demo channels', async () => {
      const mockDemoChannels = [
        { id: 'demo-1', name: 'welcome', type: 'text' },
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { channels: mockDemoChannels },
      });

      const result = await apiEndpoints.channels.getDemo();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/channels/demo');
      expect(result.data.channels).toEqual(mockDemoChannels);
    });

    test('should create a new channel', async () => {
      const channelData = {
        name: 'new-channel',
        type: 'text',
        description: 'A new channel',
      };

      const mockCreatedChannel = {
        id: '3',
        ...channelData,
        createdAt: '2023-01-01T00:00:00Z',
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: { channel: mockCreatedChannel },
      });

      const result = await apiEndpoints.channels.create(channelData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/channels', channelData);
      expect(result.data.channel).toEqual(mockCreatedChannel);
    });

    test('should handle API errors gracefully', async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
      };

      mockedAxios.get.mockRejectedValueOnce(errorResponse);

      await expect(apiEndpoints.channels.getAll()).rejects.toEqual(errorResponse);
    });

    test('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockedAxios.get.mockRejectedValueOnce(networkError);

      await expect(apiEndpoints.channels.getAll()).rejects.toEqual(networkError);
    });
  });

  describe('Messages API', () => {
    test('should fetch messages by channel', async () => {
      const mockMessages = [
        { id: '1', content: 'Hello', channelId: 'channel-1' },
        { id: '2', content: 'World', channelId: 'channel-1' },
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { messages: mockMessages },
      });

      const result = await apiEndpoints.messages.getByChannel('channel-1');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/messages/channel/channel-1');
      expect(result.data.messages).toEqual(mockMessages);
    });

    test('should create a new message', async () => {
      const messageData = {
        content: 'Hello World',
      };

      const mockCreatedMessage = {
        id: '3',
        content: 'Hello World',
        channelId: 'channel-1',
        authorId: 'user-1',
        createdAt: '2023-01-01T00:00:00Z',
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: { message: mockCreatedMessage },
      });

      const result = await apiEndpoints.messages.send('channel-1', messageData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/messages/channel/channel-1', messageData);
      expect(result.data.message).toEqual(mockCreatedMessage);
    });

    test('should update a message', async () => {
      const updateData = {
        content: 'Updated message',
      };

      const mockUpdatedMessage = {
        id: '1',
        content: 'Updated message',
        channelId: 'channel-1',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockedAxios.put.mockResolvedValueOnce({
        data: { message: mockUpdatedMessage },
      });

      const result = await apiEndpoints.messages.update('1', updateData);

      expect(mockedAxios.put).toHaveBeenCalledWith('/api/messages/1', updateData);
      expect(result.data.message).toEqual(mockUpdatedMessage);
    });

    test('should delete a message', async () => {
      mockedAxios.delete.mockResolvedValueOnce({
        data: { success: true },
      });

      const result = await apiEndpoints.messages.delete('1');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/messages/1');
      expect(result.data.success).toBe(true);
    });
  });
});
