import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../App';

// Create a wrapper since your App uses React Router
const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

describe('App component', () => {
  it('renders without crashing', () => {
    render(<AppWithRouter />);
    // Basic smoke test - app renders without errors
  });
  
  // Add more specific tests as needed
});