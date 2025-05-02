import '@testing-library/jest-dom';

// Mock all CSS imports
vi.mock('*.css', () => ({}));

// Mock AuthContext for tests
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue({ success: true }),
    isAuthenticated: false,
    user: null
  })
}));
