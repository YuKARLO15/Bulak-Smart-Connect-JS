import { scan } from 'react-scan'; // must be imported before React and React DOM, added this for easier debugging
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM from 'react-dom/client'
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { AuthProvider } from './context/AuthContext';
import { validateConfig } from './config/env.js';
import config from './config/env.js';

// Validate environment configuration before starting the app
try {
  validateConfig();
} catch (error) {
  console.error('Failed to start application:', error);
  // You could show an error page here instead of crashing
}

// 🔧 Only enable React Scan in development mode
if (config.FEATURES.REACT_SCAN) {
  scan({
    enabled: true,
  });
}

const root = ReactDOM.createRoot(document.getElementById('root')); // Create the root
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
