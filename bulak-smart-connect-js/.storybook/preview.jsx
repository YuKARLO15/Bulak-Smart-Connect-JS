import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';

// Global decorator to wrap all stories in a Router
export const decorators = [
  (Story) => (
    <MemoryRouter>
      <AuthProvider>
        <Story />
      </AuthProvider>
    </MemoryRouter>
  ),
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