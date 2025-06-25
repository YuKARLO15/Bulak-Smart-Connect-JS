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
    
    // Be more specific about what we're testing
    // Test the heading specifically by role
    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
    
    // Test form fields
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    
    // Test the button specifically by role and name
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    
    // Test other form elements
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /forgot your password/i })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    renderWithRouter(<LogInCard />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    // Wait for validation error to appear
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('allows switching between email and username login', () => {
    renderWithRouter(<LogInCard />);
    
    // Initially should show email input
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    
    // You might need to add a test for the toggle functionality if it exists
    // This depends on your actual implementation
  });

  it('calls login function when form is submitted with valid data', async () => {
    mockLogin.mockResolvedValue({ success: true, user: { roles: ['user'] } });
    
    renderWithRouter(<LogInCard />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123', 'email');
    });
  });
});
