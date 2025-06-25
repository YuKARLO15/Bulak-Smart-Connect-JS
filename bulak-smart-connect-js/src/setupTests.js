import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock CSS imports
vi.mock('*.css', () => ({}));
vi.mock('*.scss', () => ({}));
vi.mock('*.sass', () => ({}));
vi.mock('*.less', () => ({}));

// Fix window.matchMedia mock - make sure it returns the mock function result
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock navigator.standalone for PWA tests
Object.defineProperty(window.navigator, 'standalone', {
  writable: true,
  value: false,
});

// Mock beforeinstallprompt and other events
window.addEventListener = vi.fn();
window.removeEventListener = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock URL methods
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = vi.fn();

// Mock fetch for network requests
global.fetch = vi.fn();

// Silence console methods during tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock the usePWA hook directly
vi.mock('./hooks/usePWA', () => ({
  default: () => ({
    isInstalled: false,
    deferredPrompt: null,
    showInstallPrompt: vi.fn(),
  }),
}));

// Mock React Scan
vi.mock('react-scan', () => ({
  scan: vi.fn(),
}));

// Mock AuthContext for tests
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue({ success: true }),
    isAuthenticated: false,
    user: null
  })
}));
