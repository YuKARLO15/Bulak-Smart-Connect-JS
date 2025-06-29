import { scan } from "react-scan"; // must be imported before React and React DOM, added this for easier debugging
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM from 'react-dom/client'
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { AuthProvider } from './context/AuthContext';
import { validateConfig } from './config/env.js';

// Validate environment configuration before starting the app
try {
  validateConfig();
} catch (error) {
  console.error('Failed to start application:', error);
  // You could show an error page here instead of crashing
}

const root = ReactDOM.createRoot(document.getElementById('root')); // Create the root
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

scan({
  enabled: true, // Enable scanning for debugging, disable in production
});
