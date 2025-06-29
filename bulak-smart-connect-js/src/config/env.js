/**
 * Environment Configuration
 * Centralized configuration for environment variables
 */

const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000,
  
  // WebSocket Configuration
  WS_URL: import.meta.env.VITE_WS_URL || 'http://localhost:3000',
  
  // Application Configuration
  APP: {
    TITLE: import.meta.env.VITE_APP_TITLE || 'Bulak Smart Connect',
    DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Municipal Services Digital Platform',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  
  // Environment
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  
  // Feature Flags
  FEATURES: {
    PWA: import.meta.env.VITE_ENABLE_PWA === 'true',
    ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  },
  
  // External Services
  EXTERNAL: {
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  },
  
  // Local Storage
  STORAGE_PREFIX: import.meta.env.VITE_STORAGE_PREFIX || '',
  
  // Print Settings
  PRINT: {
    ENABLED: import.meta.env.VITE_PRINT_ENABLED === 'true',
    COPIES: parseInt(import.meta.env.VITE_PRINT_COPIES) || 1,
    PRINTER_NAME: import.meta.env.VITE_PRINTER_NAME || 'default',
    SERVER_URL: import.meta.env.VITE_PRINT_SERVER_URL || 'http://localhost:3001',
  },
  
  // Queue System Configuration
  QUEUE: {
    REFRESH_INTERVAL: parseInt(import.meta.env.VITE_QUEUE_REFRESH_INTERVAL) || 5000,
    AUTO_REFRESH: import.meta.env.VITE_QUEUE_AUTO_REFRESH !== 'false',
  },
  
  // File Upload Configuration
  FILES: {
    MAX_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760,
    ALLOWED_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'pdf,doc,docx,jpg,jpeg,png').split(','),
  },
  
  // MinIO Configuration
  MINIO: {
    ENDPOINT: import.meta.env.VITE_MINIO_ENDPOINT || 'http://localhost:9000',
    BUCKET_NAME: import.meta.env.VITE_MINIO_BUCKET_NAME || 'bulak-smart-connect',
  },
  
  // Notification Settings
  NOTIFICATIONS: {
    TIMEOUT: parseInt(import.meta.env.VITE_NOTIFICATION_TIMEOUT) || 5000,
    SOUND_ENABLED: import.meta.env.VITE_ENABLE_SOUND_NOTIFICATIONS !== 'false',
  },
  
  // UI Configuration
  UI: {
    THEME_PRIMARY: import.meta.env.VITE_THEME_PRIMARY || '#184a5b',
    THEME_SECONDARY: import.meta.env.VITE_THEME_SECONDARY || '#ffffff',
    SIDEBAR_DEFAULT_OPEN: import.meta.env.VITE_SIDEBAR_DEFAULT_OPEN !== 'false',
  },
  
  // Page URLs
  URLS: {
    ADMIN_PANEL: import.meta.env.VITE_ADMIN_PANEL_URL || 'http://localhost:5173/AdminHome',
    USER_DASHBOARD: import.meta.env.VITE_USER_DASHBOARD_URL || 'http://localhost:5173/UserDashboard',
  },
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: import.meta.env.VITE_AUTH_ENDPOINT || '/auth',
    QUEUE: import.meta.env.VITE_QUEUE_ENDPOINT || '/queue',
    APPOINTMENTS: import.meta.env.VITE_APPOINTMENTS_ENDPOINT || '/appointments',
    ANNOUNCEMENTS: import.meta.env.VITE_ANNOUNCEMENTS_ENDPOINT || '/announcements',
    DOCUMENT_APPLICATIONS: import.meta.env.VITE_DOCUMENT_APPLICATIONS_ENDPOINT || '/document-applications',
    USERS: import.meta.env.VITE_USERS_ENDPOINT || '/users',
  },
};

// Validation function to check required environment variables
export const validateConfig = () => {
  const requiredVars = [
    'API_BASE_URL',
    'WS_URL',
  ];
  
  const missing = requiredVars.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ Environment configuration validated successfully');
  
  if (config.FEATURES.DEBUG) {
    console.log('🔧 Current configuration:', {
      API_BASE_URL: config.API_BASE_URL,
      WS_URL: config.WS_URL,
      NODE_ENV: config.NODE_ENV,
      FEATURES: config.FEATURES,
    });
  }
};

export default config;
