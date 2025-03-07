import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LogInCard from '../LogInComponents/LogInCard';

describe('LogInCard component', () => {
  it('renders login form elements', () => {
    render(
      <BrowserRouter>
        <LogInCard />
      </BrowserRouter>
    );
    
    // Check if key elements are present
    expect(screen.getByText(/LOG IN/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot your password\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    render(
      <BrowserRouter>
        <LogInCard />
      </BrowserRouter>
    );
    
    // Enter invalid email
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Trigger form submission
    const submitButton = screen.getByRole('button', { name: /Log In/i });
    fireEvent.click(submitButton);
    
    // Check if validation error appears
    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });
});