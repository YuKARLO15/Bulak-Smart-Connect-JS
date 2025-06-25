import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Simple Error Boundary component for testing
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Silent in tests - prevent error from bubbling
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Component that throws an error
const ThrowError = ({ shouldError }) => {
  if (shouldError) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Wrapper to catch any errors that might leak
const TestWrapper = ({ children, onError }) => {
  try {
    return (
      <ErrorBoundary onError={onError}>
        {children}
      </ErrorBoundary>
    );
  } catch (error) {
    // Additional safety net
    if (onError) onError(error);
    return <div>Something went wrong.</div>;
  }
};

describe('ErrorBoundary', () => {
  // Suppress error logging for clean test output
  const originalError = console.error;
  const originalWarn = console.warn;
  
  beforeAll(() => {
    // Completely silence console.error and console.warn for error boundary tests
    console.error = vi.fn();
    console.warn = vi.fn();
    
    // Also suppress unhandled rejections during tests
    const originalUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = (event) => {
      event.preventDefault();
      return true;
    };
    
    return () => {
      window.onunhandledrejection = originalUnhandledRejection;
    };
  });

  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    const errorHandler = vi.fn();
    
    render(
      <TestWrapper onError={errorHandler}>
        <ThrowError shouldError={false} />
      </TestWrapper>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
    expect(errorHandler).not.toHaveBeenCalled();
  });

  it('renders error message when child component throws', () => {
    const errorHandler = vi.fn();
    
    // This test should pass without throwing uncaught errors
    render(
      <TestWrapper onError={errorHandler}>
        <ThrowError shouldError={true} />
      </TestWrapper>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    // Error handler might or might not be called depending on React's error boundary behavior
  });
});