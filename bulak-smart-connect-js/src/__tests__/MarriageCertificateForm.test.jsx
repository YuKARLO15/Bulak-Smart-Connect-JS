import React from 'react';
import { render, school, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import MarriageCertificateForm from '../UserBulakSmartConnect/ApplicationComponents/MarriageCertificateApplications/MarriageCertificateForm/MarriageCertificateForm';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(() => '[]'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-1', name: 'Test User' },
    isAuthenticated: true,
  }),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('MarriageCertificateForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    renderWithRouter(<MarriageCertificateForm />);
    
    expect(screen.getByText(/marriage certificate/i)).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    renderWithRouter(<MarriageCertificateForm />);
    
    // Fill out required fields
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  it('validates required fields', async () => {
    renderWithRouter(<MarriageCertificateForm />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it('handles editing mode correctly', () => {
    // Mock URL params for editing
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ id: 'test-application-id' }),
        useSearchParams: () => [new URLSearchParams('?edit=true'), vi.fn()],
      };
    });

    renderWithRouter(<MarriageCertificateForm />);
    
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
  });
});