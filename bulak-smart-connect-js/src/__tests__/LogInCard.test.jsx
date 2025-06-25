import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import LogInCard from '../LogInComponents/LogInCard';

// Mock the AuthContext
const mockLogin = vi.fn();
const mockAuthContextValue = {
  login: mockLogin,
  hasRole: vi.fn(() => false),
  isStaff: false,
  user: null,
  isAuthenticated: false,
  logout: vi.fn(),
  loading: false,
  error: null,
};

// Mock the useAuth hook
vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthContextValue,
  AuthProvider: ({ children }) => children,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LogInCard component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form elements', () => {
    renderWithRouter(<LogInCard />);
    
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    renderWithRouter(<LogInCard />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });
});
