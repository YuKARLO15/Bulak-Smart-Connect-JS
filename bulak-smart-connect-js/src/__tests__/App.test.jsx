import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../App';

// A simple test that will pass
describe('App Component', () => {
  it('renders without crashing', () => {
    // Wrap with BrowserRouter since App likely uses React Router
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});
