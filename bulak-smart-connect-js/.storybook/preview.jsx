import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';

// Create a mock of react-router-dom's useNavigate
import * as router from 'react-router-dom';

// Global decorator to wrap all stories in a Router
export const decorators = [
  (Story) => {
    // Create a mock navigate function that will be available in stories
    const navigate = jest.fn();

    // Override the useNavigate hook before rendering
    // This needs to be done before rendering the component
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);

    return (
      <MemoryRouter>
        <AuthProvider>
          <Story />
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