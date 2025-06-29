# 🎨 Frontend Environment Setup Guide

## 📋 Step-by-Step Setup

### 1. Create Environment File
```bash
cd bulak-smart-connect-js
cp .env.example .env
```

### 2. Configure Essential Variables
Edit your `.env` file with these settings:

```bash
# === ESSENTIAL CONFIGURATION ===
# API Backend URL (must match your backend)
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000

# Application Info
VITE_APP_TITLE=Bulak Smart Connect
VITE_NODE_ENV=development

# Feature Toggles
VITE_ENABLE_PWA=true
VITE_ENABLE_DEBUG=true
VITE_ENABLE_ANALYTICS=false

# Storage
VITE_STORAGE_PREFIX=
```

### 3. Advanced Configuration (Optional)
```bash
# === ADVANCED SETTINGS ===
# API Timeout (milliseconds)
VITE_API_TIMEOUT=15000

# Queue System
VITE_QUEUE_REFRESH_INTERVAL=5000
VITE_QUEUE_AUTO_REFRESH=true

# Print Settings (for thermal printer)
VITE_PRINT_ENABLED=true
VITE_PRINT_COPIES=1
VITE_PRINTER_NAME=default

# File Upload Limits
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png

# UI Theme
VITE_THEME_PRIMARY=#184a5b
VITE_THEME_SECONDARY=#ffffff

# External Services (if needed)
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

### 4. Start the Frontend
```bash
npm install
npm run dev
```

### 5. Verification
- ✅ Frontend running: http://localhost:5173
- ✅ Can connect to backend API
- ✅ WebSocket connection working
- ✅ All features loading properly

## 🔄 How to Use Environment Variables in Code

### ✅ CORRECT - Using the Config System:
```javascript
// Import the config
import config from './config/env.js';

// Use config values
const apiUrl = config.API_BASE_URL;
const wsUrl = config.WS_URL;
const printEnabled = config.PRINT.ENABLED;

// For API calls
axios.get(`${config.API_BASE_URL}/users`);

// For WebSocket
const socket = io(config.WS_URL);
```

### ❌ INCORRECT - Direct hardcoded values:
```javascript
// DON'T DO THIS:
const apiUrl = 'http://localhost:3000';
axios.get('http://localhost:3000/users');
const socket = io('http://localhost:3000');
```

## 🎯 Environment Variable Guidelines

### Naming Convention:
- All frontend env vars must start with `VITE_`
- Use UPPERCASE with underscores: `VITE_API_BASE_URL`
- Group related vars: `VITE_PRINT_ENABLED`, `VITE_PRINT_COPIES`

### Boolean Values:
- Use strings: `VITE_ENABLE_PWA=true` (not just `true`)
- Check with: `import.meta.env.VITE_ENABLE_PWA === 'true'`

### URLs:
- Always include protocol: `http://localhost:3000` (not `localhost:3000`)
- No trailing slashes: `http://localhost:3000` (not `http://localhost:3000/`)

## 🔧 Config File Usage

The config file (`src/config/env.js`) provides:
- ✅ Centralized configuration
- ✅ Type conversion (strings to numbers/booleans)
- ✅ Default fallback values
- ✅ Environment validation
- ✅ Debug logging

### Available Config Sections:
- `config.API_BASE_URL` - Backend API URL
- `config.WS_URL` - WebSocket URL
- `config.FEATURES.PWA` - Feature flags
- `config.PRINT.ENABLED` - Print settings
- `config.QUEUE.REFRESH_INTERVAL` - Queue settings
- `config.FILES.MAX_SIZE` - File upload limits
- `config.UI.THEME_PRIMARY` - UI theming
- `config.ENDPOINTS.AUTH` - API endpoints

## 🚨 Common Issues & Solutions

### "VITE_* environment variable not found"
- Ensure variable starts with `VITE_`
- Restart the dev server after adding new variables
- Check `.env` file exists and has correct syntax

### API Connection Failed
- Verify `VITE_API_BASE_URL` matches your backend URL
- Ensure backend is running on the specified port
- Check CORS configuration on backend

### WebSocket Not Connecting
- Verify `VITE_WS_URL` matches backend WebSocket configuration
- Check `WS_CORS_ORIGIN` on backend matches frontend URL

### Environment Variables Not Loading
```javascript
// Add this to debug what's loaded:
console.log('Environment variables:', import.meta.env);
```

## 🌍 Production Setup
For production, copy `.env.production.example` to `.env.production`:
- Update URLs to production domains
- Disable debug features
- Enable analytics if needed
- Use production API keys
