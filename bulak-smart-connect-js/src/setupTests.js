import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock navigator.standalone for PWA tests
Object.defineProperty(window.navigator, 'standalone', {
  writable: true,
  value: false,
});

// Mock beforeinstallprompt event
window.addEventListener = jest.fn();
window.removeEventListener = jest.fn();

// Mock AuthContext for tests
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue({ success: true }),
    isAuthenticated: false,
    user: null
  })
}));
