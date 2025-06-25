import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

// Mock the AuthContext
const mockAuthContextValue = {
  login: vi.fn(),
  logout: vi.fn(),
  hasRole: vi.fn(() => false),
  isStaff: false,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Mock the AuthProvider and useAuth hook
vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => mockAuthContextValue,
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });
});
