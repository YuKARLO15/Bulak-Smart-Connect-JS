import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import * as AuthContext from '../context/AuthContext';

// Mock the AuthContext
const mockAuthContextValue = {
  login: jest.fn(),
  logout: jest.fn(),
  hasRole: jest.fn(() => false),
  isStaff: false,
  user: null,
  isAuthenticated: false,
};

jest.spyOn(AuthContext, 'useAuth').mockReturnValue(mockAuthContextValue);

// Mock the AuthProvider
jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
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
