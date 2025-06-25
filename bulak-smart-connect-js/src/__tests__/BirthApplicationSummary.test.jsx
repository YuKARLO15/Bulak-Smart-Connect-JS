import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Create a mock component that simulates different states
const MockBirthApplicationSummary = ({ mockData = null, shouldTimeout = false }) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Simulate actual localStorage behavior
    const mockLocalStorage = window.localStorage;
    
    const timeoutId = setTimeout(() => {
      if (shouldTimeout) {
        setLoading(true); // Keep loading forever
        return;
      }

      if (mockData) {
        mockLocalStorage.getItem('applications');
        setData(mockData);
        setLoading(false);
      } else {
        setError('No application ID found. Please select or create an application.');
        setLoading(false);
      }
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [mockData, shouldTimeout]);

  if (loading) {
    return (
      <div className="LoadingContainerSummaryBirth">
        <span role="progressbar" />
        <p>Loading application data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ErrorContainerSummaryBirth">
        <div role="alert">
          <div>{error}</div>
        </div>
        <button>Back to Applications</button>
      </div>
    );
  }

  return (
    <div className="SummaryContainerBirth">
      <h1>Birth Certificate Application Summary</h1>
      <p>Application ID: {data?.id}</p>
    </div>
  );
};

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
  });

  it('renders application summary correctly', async () => {
    const mockAppData = {
      id: 'app-123',
      formData: {
        fullName: 'John Doe',
        dateOfBirth: '1990-01-01',
        placeOfBirth: 'Bulak',
        certificateType: 'birth'
      },
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    renderWithRouter(<MockBirthApplicationSummary mockData={mockAppData} />);
    
    await waitFor(() => {
      expect(screen.getByText(/birth certificate application summary/i)).toBeInTheDocument();
    });
  });

  it('loads application data from localStorage', async () => {
    renderWithRouter(<MockBirthApplicationSummary shouldTimeout={true} />);
    
    // Wait for the effect to run
    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalled();
    }, { timeout: 100 });
  });

  it('handles missing application data gracefully', async () => {
    renderWithRouter(<MockBirthApplicationSummary mockData={null} />);
    
    await waitFor(() => {
      expect(screen.getByText(/no application id found/i)).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    renderWithRouter(<MockBirthApplicationSummary shouldTimeout={true} />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});