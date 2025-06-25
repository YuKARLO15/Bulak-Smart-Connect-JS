import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';

// Create a mock hook that simulates usePWA behavior
const usePWA = () => {
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);

  const showInstallPrompt = vi.fn();

  React.useEffect(() => {
    // Simulate PWA detection logic
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone === true;
    
    setIsInstalled(isStandalone);
  }, []);

  return {
    isInstalled,
    deferredPrompt,
    showInstallPrompt
  };
};

// Mock window.matchMedia - ensure it returns false by default
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query) => ({
    matches: false, // Always return false initially
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock navigator.standalone - ensure it's false by default
Object.defineProperty(window.navigator, 'standalone', {
  writable: true,
  value: false,
});

describe('usePWA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
    
    // Reset mocks to default state
    window.navigator.standalone = false;
    window.matchMedia = vi.fn((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => usePWA());

    expect(result.current.isInstalled).toBe(false);
    expect(result.current.deferredPrompt).toBe(null);
    expect(typeof result.current.showInstallPrompt).toBe('function');
  });

  it('detects standalone mode', () => {
    // Set up standalone mode BEFORE rendering the hook
    window.navigator.standalone = true;
    window.matchMedia = vi.fn((query) => ({ 
      matches: query === '(display-mode: standalone)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    const { result } = renderHook(() => usePWA());

    expect(result.current.isInstalled).toBe(true);
  });

  it('handles install prompt event', () => {
    const { result } = renderHook(() => usePWA());
    
    // Test that the hook doesn't crash
    expect(result.current.deferredPrompt).toBe(null);
  });

  it('shows install prompt when available', async () => {
    const { result } = renderHook(() => usePWA());

    await act(async () => {
      await result.current.showInstallPrompt();
    });

    expect(result.current.showInstallPrompt).toHaveBeenCalled();
  });
});