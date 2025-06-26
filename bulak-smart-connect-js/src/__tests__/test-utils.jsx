import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Create a proper mock AuthContext
const AuthContext = React.createContext(null);

// Mock AuthProvider for tests
const MockAuthProvider = ({ children, value }) => {
  const defaultValue = {
    login: vi.fn().mockResolvedValue({ success: true }),
    logout: vi.fn(),
    hasRole: vi.fn(() => false),
    isStaff: false,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    ...value,
  };

  return (
    <AuthContext.Provider value={defaultValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const renderWithProviders = (
  ui,
  {
    authValue = {},
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <MockAuthProvider value={authValue}>
        {children}
      </MockAuthProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';