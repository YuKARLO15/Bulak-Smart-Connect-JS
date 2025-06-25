import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Mock AuthProvider for tests
const MockAuthProvider = ({ children, value }) => {
  const defaultValue = {
    login: jest.fn(),
    logout: jest.fn(),
    hasRole: jest.fn(() => false),
    isStaff: false,
    user: null,
    isAuthenticated: false,
    ...value,
  };

  return (
    <AuthProvider value={defaultValue}>
      {children}
    </AuthProvider>
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