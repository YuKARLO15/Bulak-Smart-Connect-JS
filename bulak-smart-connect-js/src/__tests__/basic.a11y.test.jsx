import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

expect.extend(toHaveNoViolations);

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

vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => mockAuthContextValue,
}));

describe('Accessibility tests', () => {
  it('App component should have no accessibility violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Run axe
    const results = await axe(container);
    
    // Save results to file for CI workflow
    const fs = require('fs');
    fs.writeFileSync('a11y-results.json', JSON.stringify(results, null, 2));
    
    expect(results).toHaveNoViolations();
  });
});