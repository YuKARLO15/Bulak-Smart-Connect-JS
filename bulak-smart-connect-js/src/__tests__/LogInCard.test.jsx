import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LogInCard from '../LogInComponents/LogInCard';
import * as AuthContext from '../context/AuthContext';

// Mock the AuthContext
const mockLogin = jest.fn();
const mockAuthContextValue = {
  login: mockLogin,
  hasRole: jest.fn(() => false),
  isStaff: false,
  user: null,
  isAuthenticated: false,
  logout: jest.fn(),
};

// Mock the useAuth hook
jest.spyOn(AuthContext, 'useAuth').mockReturnValue(mockAuthContextValue);

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LogInCard component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
