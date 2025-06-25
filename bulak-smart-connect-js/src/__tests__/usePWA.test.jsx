import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import usePWA from '../hooks/usePWA';

// Mock window.matchMedia
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

// Mock navigator
Object.defineProperty(window.navigator, 'standalone', {
  writable: true,
  value: false,
});

describe('usePWA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => usePWA());

    expect(result.current.isInstalled).toBe(false);
    expect(result.current.deferredPrompt).toBe(null);
    expect(typeof result.current.showInstallPrompt).toBe('function');
  });

  it('detects standalone mode', () => {
    window.matchMedia = vi.fn(() => ({ matches: true }));
    
    const { result } = renderHook(() => usePWA());

    expect(result.current.isInstalled).toBe(true);
  });

  it('handles install prompt event', () => {
    const { result } = renderHook(() => usePWA());
    
    act(() => {
      const mockEvent = { preventDefault: vi.fn() };
      // Simulate beforeinstallprompt event
      window.addEventListener.mock.calls.find(
        call => call[0] === 'beforeinstallprompt'
      )?.[1](mockEvent);
    });

    expect(result.current.deferredPrompt).toBeDefined();
  });

  it('shows install prompt when available', async () => {
    const mockPrompt = {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };

    const { result } = renderHook(() => usePWA());

    // Set up deferred prompt
    act(() => {
      result.current.deferredPrompt = mockPrompt;
    });

    await act(async () => {
      await result.current.showInstallPrompt();
    });

    expect(mockPrompt.prompt).toHaveBeenCalled();
  });
});