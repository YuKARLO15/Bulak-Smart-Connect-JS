import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';

// Create a mock navigate function 
const mockNavigate = (...args) => {
  console.log('Navigation called in Storybook with:', args);
  return false;
};

// Override React Router's useNavigate
// This needs to be done before any components try to use it
import * as ReactRouterDOM from 'react-router-dom';
ReactRouterDOM.useNavigate = () => mockNavigate;

// Global decorator to wrap all stories in a Router
export const decorators = [
  (Story) => (
    <MemoryRouter initialEntries={['/']}>
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