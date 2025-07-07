import { renderHook, act } from '@testing-library/react';
import { useMockChannels } from './useMockChannels';
import { mockChannels } from '../mocks/channelData';

describe('useMockChannels Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with mock channels', () => {
    const { result } = renderHook(() => useMockChannels());
    
    expect(result.current.channels).toEqual(mockChannels);
    expect(result.current.loading).toBe(false);
  });

  test('should load mock channels', async () => {
    const { result } = renderHook(() => useMockChannels([]));
    
    expect(result.current.channels).toHaveLength(0);
    
    await act(async () => {
      await result.current.loadMockChannels(10); // Short delay for testing
    });
    
    expect(result.current.channels).toEqual(mockChannels);
  });

  test('should add a new mock channel', () => {
    const { result } = renderHook(() => useMockChannels([]));
    
    const channelData = {
      name: 'test-channel',
      type: 'text',
      description: 'Test channel',
      category: 'Test'
    };
    
    act(() => {
      result.current.addMockChannel(channelData);
    });
    
    expect(result.current.channels).toHaveLength(1);
    expect(result.current.channels[0].name).toBe('test-channel');
    expect(result.current.channels[0].category).toBe('Test');
  });

  test('should generate random channels', () => {
    const { result } = renderHook(() => useMockChannels([]));
    
    act(() => {
      result.current.generateMockChannels(3);
    });
    
    expect(result.current.channels).toHaveLength(3);
    result.current.channels.forEach(channel => {
      expect(channel.id).toMatch(/^generated-/);
      expect(channel.serverId).toBe('demo-server');
    });
  });

  test('should create channel from template', () => {
    const { result } = renderHook(() => useMockChannels([]));
    
    act(() => {
      result.current.createFromTemplate('welcome');
    });
    
    expect(result.current.channels).toHaveLength(1);
    expect(result.current.channels[0].name).toBe('welcome');
    expect(result.current.channels[0].botEnabled).toBe(true);
  });

  test('should remove a channel', () => {
    const { result } = renderHook(() => useMockChannels());
    
    const initialCount = result.current.channels.length;
    const channelToRemove = result.current.channels[0];
    
    act(() => {
      result.current.removeMockChannel(channelToRemove.id);
    });
    
    expect(result.current.channels).toHaveLength(initialCount - 1);
    expect(result.current.channels.find(c => c.id === channelToRemove.id)).toBeUndefined();
  });

  test('should update a channel', () => {
    const { result } = renderHook(() => useMockChannels());
    
    const channelToUpdate = result.current.channels[0];
    const updates = { name: 'updated-name', description: 'Updated description' };
    
    act(() => {
      result.current.updateMockChannel(channelToUpdate.id, updates);
    });
    
    const updatedChannel = result.current.channels.find(c => c.id === channelToUpdate.id);
    expect(updatedChannel.name).toBe('updated-name');
    expect(updatedChannel.description).toBe('Updated description');
  });

  test('should clear all channels', () => {
    const { result } = renderHook(() => useMockChannels());
    
    expect(result.current.channels.length).toBeGreaterThan(0);
    
    act(() => {
      result.current.clearMockChannels();
    });
    
    expect(result.current.channels).toHaveLength(0);
  });

  test('should reset to default channels', () => {
    const { result } = renderHook(() => useMockChannels());
    
    // Add some extra channels
    act(() => {
      result.current.addMockChannel({ name: 'extra-channel' });
    });
    
    const countAfterAdd = result.current.channels.length;
    expect(countAfterAdd).toBeGreaterThan(mockChannels.length);
    
    // Reset
    act(() => {
      result.current.resetMockChannels();
    });
    
    expect(result.current.channels).toEqual(mockChannels);
  });

  test('should filter channels correctly', () => {
    const { result } = renderHook(() => useMockChannels());
    
    // Filter by type
    const textChannels = result.current.getFilteredChannels({ type: 'text' });
    textChannels.forEach(channel => {
      expect(channel.type).toBe('text');
    });
    
    // Filter by category
    const generalChannels = result.current.getFilteredChannels({ category: 'General' });
    generalChannels.forEach(channel => {
      expect(channel.category).toBe('General');
    });
    
    // Filter by bot enabled
    const botChannels = result.current.getFilteredChannels({ botEnabled: true });
    botChannels.forEach(channel => {
      expect(channel.botEnabled).toBe(true);
    });
  });

  test('should group channels by category', () => {
    const { result } = renderHook(() => useMockChannels());
    
    const categorized = result.current.getChannelsByCategory();
    
    expect(typeof categorized).toBe('object');
    Object.keys(categorized).forEach(category => {
      expect(Array.isArray(categorized[category])).toBe(true);
      categorized[category].forEach(channel => {
        expect(channel.category || 'Uncategorized').toBe(category);
      });
    });
  });

  test('should calculate channel statistics', () => {
    const { result } = renderHook(() => useMockChannels());
    
    const stats = result.current.getChannelStats();
    
    expect(stats.total).toBe(result.current.channels.length);
    expect(typeof stats.byType).toBe('object');
    expect(typeof stats.byCategory).toBe('object');
    expect(typeof stats.withBots).toBe('number');
    expect(typeof stats.totalMembers).toBe('number');
    expect(typeof stats.averageMembers).toBe('number');
  });

  test('should provide available templates', () => {
    const { result } = renderHook(() => useMockChannels());
    
    expect(Array.isArray(result.current.availableTemplates)).toBe(true);
    expect(result.current.availableTemplates.length).toBeGreaterThan(0);
    expect(result.current.availableTemplates).toContain('welcome');
    expect(result.current.availableTemplates).toContain('rules');
  });

  test('should handle invalid template name', () => {
    const { result } = renderHook(() => useMockChannels([]));
    
    expect(() => {
      act(() => {
        result.current.createFromTemplate('invalid-template');
      });
    }).toThrow('Template "invalid-template" not found');
  });
});
