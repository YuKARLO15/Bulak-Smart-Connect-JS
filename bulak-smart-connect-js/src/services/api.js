// Currently we use src/context/AuthContext.jsx for authentication and user data management.
// Currently we use src/services/api.js for API calls.
// This is still used for registering
// But logging in and getting user data is done in src/context/AuthContext.jsx

import axios from 'axios';
import config from '../config/env.js';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get current user ID from localStorage
const getCurrentUserId = () => {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return null;
  
  try {
    const userData = JSON.parse(currentUser);
    return userData?.id || userData?._id || null;
  } catch (e) {
    console.error('Error parsing user data from localStorage', e);
    return null;
  }
};

// Add token to requests if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  register: async userData => {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');

    const userId = getCurrentUserId();
  
    // Clear user specific data but leave generic data for backward compatibility
    localStorage.removeItem(`userQueue_${userId}`);
    localStorage.removeItem(`userQueues_${userId}`);

    // Then clear user data
    localStorage.removeItem('currentUser');
  },

  getProfile: async () => {
    return api.get('/auth/profile');
  },
  
  updateProfile: async (userData) => {
    const response = await api.post('/auth/update-profile', userData);
    return response.data;
  },
  
  adminUpdateUser: async (userId, userData) => {
    const response = await api.post(`/auth/admin/update-user/${userId}`, userData);
    return response.data;
  }
};

export default api;
