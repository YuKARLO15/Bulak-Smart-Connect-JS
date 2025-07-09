import './config/env.js';

import { scan } from 'react-scan';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { validateConfig } from './config/env.js';
import config from './config/env.js';
import logger from './utils/logger.js';

// Validate environment configuration before starting the app
try {
  validateConfig();
  logger.log('✅ Environment configuration validated successfully');
} catch (error) {
  logger.error('Failed to start application:', error);
}

// 🔧 Enable React Scan based on configuration
if (config.FEATURES.REACT_SCAN) {
  scan({
    enabled: true,
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);