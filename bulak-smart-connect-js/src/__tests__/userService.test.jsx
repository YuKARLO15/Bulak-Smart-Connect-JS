import { describe, it, expect, vi, beforeEach } from 'vitest';
import { userService } from '../services/userService';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: () => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    })
  }
}));

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

      await expect(userService.getUserById('nonexistent')).rejects.toThrow();
    });
  });

  describe('testAuth', () => {
    it('returns success for valid authentication', async () => {
      const result = await userService.testAuth();
      
      expect(result).toHaveProperty('success');
    });
  });
});