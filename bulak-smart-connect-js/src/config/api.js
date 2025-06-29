import axios from 'axios';
import config from './env.js';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(`${config.STORAGE_PREFIX}token`);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem(`${config.STORAGE_PREFIX}token`);
      localStorage.removeItem(`${config.STORAGE_PREFIX}user`);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
