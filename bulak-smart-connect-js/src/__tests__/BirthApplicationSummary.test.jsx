import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import BirthApplicationSummary from '../UserBulakSmartConnect/ApplicationComponents/BirthCertificateApplications/BirthApplicationSummary';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-1', name: 'Test User' },
    isAuthenticated: true,
    hasRole: vi.fn(() => true),
  }),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BirthApplicationSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      id: 'app-123',
      formData: {
        fullName: 'John Doe',
        dateOfBirth: '1990-01-01',
        placeOfBirth: 'Bulak',
        certificateType: 'birth'
      },
      status: 'pending',
      submittedAt: new Date().toISOString()
    }));
  });

  it('renders application summary correctly', () => {
    renderWithRouter(<BirthApplicationSummary />);
    
    expect(screen.getByText(/application summary/i)).toBeInTheDocument();
  });

  it('loads application data from localStorage', async () => {
    renderWithRouter(<BirthApplicationSummary />);
    
    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalled();
    });
  });

  it('handles missing application data gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    renderWithRouter(<BirthApplicationSummary />);
    
    expect(screen.getByText(/application not found/i)).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    renderWithRouter(<BirthApplicationSummary />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});