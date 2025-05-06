import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';

// Global decorator to wrap all stories in a Router
export const decorators = [
  (Story) => {
    // Create a mock navigate function for Storybook
    const mockNavigate = () => console.log('Navigation triggered in Storybook');
    
    // Create a wrapper that provides both Router context and the navigate mock
    return (
      <MemoryRouter>
        <AuthProvider>
          <Story navigate={mockNavigate} />
        </AuthProvider>
      </MemoryRouter>
    );
  },
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};