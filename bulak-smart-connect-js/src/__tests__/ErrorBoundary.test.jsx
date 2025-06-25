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
    // Don't log to console in tests
    if (process.env.NODE_ENV !== 'test') {
      console.error('Error caught by boundary:', error, errorInfo);
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

describe('ErrorBoundary', () => {
  // Suppress console.error and window.onerror for this test
  const originalError = console.error;
  const originalOnError = window.onerror;
  
  beforeAll(() => {
    console.error = vi.fn();
    // Prevent jsdom from treating the error as uncaught
    window.onerror = vi.fn(() => true);
  });

  afterAll(() => {
    console.error = originalError;
    window.onerror = originalOnError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldError={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error message when child component throws', () => {
    // Use a custom wrapper to catch the error
    const ErrorWrapper = () => {
      try {
        return (
          <ErrorBoundary>
            <ThrowError shouldError={true} />
          </ErrorBoundary>
        );
      } catch (error) {
        // Error is caught by boundary, not here
        return null;
      }
    };

    render(<ErrorWrapper />);

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });
});