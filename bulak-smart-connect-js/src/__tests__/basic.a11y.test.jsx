import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

expect.extend(toHaveNoViolations);

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