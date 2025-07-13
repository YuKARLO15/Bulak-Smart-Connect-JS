import './config/env.js';
import './utils/version.js';

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

// 🚀 **ENHANCED**: Service Worker with Auto-Update and Cache Busting
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      console.log('🔄 Registering service worker...');
      const registration = await navigator.serviceWorker.register('/sw.js');
      logger.log('✅ Service Worker registered successfully:', registration);
      
      // **CRITICAL**: Handle service worker updates immediately
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              logger.log('🔄 New content available - auto-updating...');
              
              // **AUTO-UPDATE**: Skip waiting and claim clients immediately
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              
              // Force reload to get new content
              setTimeout(() => {
                logger.log('🔄 Reloading page for updates...');
                window.location.reload();
              }, 1000);
            }
          });
        }
      });

      // **CHECK FOR UPDATES**: Periodically check for updates
      setInterval(() => {
        registration.update();
      }, 60000); // Check every 60 seconds

      // **IMMEDIATE UPDATE CHECK**: Check for updates on page load
      registration.update();

    } catch (error) {
      logger.error('❌ Service Worker registration failed:', error);
    }
  });

  // **HANDLE CONTROLLER CHANGE**: When new SW takes control
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    logger.log('🔄 Service Worker controller changed - reloading...');
    window.location.reload();
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