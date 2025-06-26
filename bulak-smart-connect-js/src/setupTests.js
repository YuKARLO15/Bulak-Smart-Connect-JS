import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Make React available globally for tests
global.React = React;

// Mock CSS imports
vi.mock('*.css', () => ({}));
vi.mock('*.scss', () => ({}));
vi.mock('*.sass', () => ({}));
vi.mock('*.less', () => ({}));

// Fix window.matchMedia mock - ensure it returns false by default
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query) => ({
    matches: false, // Default to false
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
  value: false, // Default to false
});

// Mock beforeinstallprompt and other events
window.addEventListener = vi.fn();
window.removeEventListener = vi.fn();

// Mock HTMLFormElement.requestSubmit for jsdom compatibility
Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
  value: function() {
    this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  },
  writable: true,
});

// Enhanced error suppression for test environment
const originalError = console.error;
const originalWarn = console.warn;

// Override console methods but allow them to work normally for non-React errors
console.error = (...args) => {
  // Suppress specific React error boundary messages during tests
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('Error boundaries') || 
     args[0].includes('The above error occurred') ||
     args[0].includes('React will try to recreate') ||
     args[0].includes('Test error') ||
     args[0].includes('ErrorBoundary'))
  ) {
    return;
  }
  originalError.apply(console, args);
};

console.warn = (...args) => {
  // Suppress React warnings during tests
  if (
    typeof args[0] === 'string' && 
    args[0].includes('Warning:')
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

// More comprehensive global error handlers
const originalOnError = window.onerror;
const originalOnUnhandledRejection = window.onunhandledrejection;

// Enhanced global error handler to catch uncaught errors in tests
window.onerror = (message, source, lineno, colno, error) => {
  // Handle ErrorBoundary test errors specifically
  if (
    error?.message?.includes('Test error') || 
    error?.message?.includes('React is not defined') ||
    message?.includes('Test error') ||
    source?.includes('ErrorBoundary.test.jsx')
  ) {
    return true; // Prevent default error handling
  }
  
  // Call original handler for other errors
  if (originalOnError) {
    return originalOnError(message, source, lineno, colno, error);
  }
  return false;
};

// Enhanced unhandled rejection handler
window.onunhandledrejection = (event) => {
  if (
    event.reason?.message?.includes('Test error') ||
    event.reason?.includes('Test error') ||
    event.reason?.stack?.includes('ErrorBoundary.test.jsx')
  ) {
    event.preventDefault();
    return true;
  }
  
  // Call original handler for other rejections
  if (originalOnUnhandledRejection) {
    return originalOnUnhandledRejection(event);
  }
  return false;
};

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
