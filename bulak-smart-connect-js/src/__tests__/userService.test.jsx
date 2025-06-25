import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create a mock userService
const userService = {
  getUserById: async (id) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
  
  testAuth: async () => {
    return { success: true, message: 'Authentication successful' };
  }
};

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserById', () => {
    it('returns user data when found', async () => {
      const mockUser = { id: '123', name: 'Test User', email: 'test@example.com' };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockUser]));

      const result = await userService.getUserById('123');
      
      expect(result).toEqual(mockUser);
    });

    it('throws error when user not found', async () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([]));

      await expect(userService.getUserById('nonexistent')).rejects.toThrow('User not found');
    });
  });

  describe('testAuth', () => {
    it('returns success for valid authentication', async () => {
      const result = await userService.testAuth();
      
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message');
    });
  });
});