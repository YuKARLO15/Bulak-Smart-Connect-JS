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

// 🚀 **CRITICAL**: Register Service Worker for PWA BEFORE rendering app
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      console.log('🔄 Registering service worker...');
      const registration = await navigator.serviceWorker.register('/sw.js');
      logger.log('✅ Service Worker registered successfully:', registration);
      
      // Listen for service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              logger.log('🔄 New content available, reload to update');
            }
          });
        }
      });
    } catch (error) {
      logger.error('❌ Service Worker registration failed:', error);
    }
  });
} else {
  logger.warn('⚠️ Service Worker not supported');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);