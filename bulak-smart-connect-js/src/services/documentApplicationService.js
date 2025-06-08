import axios from 'axios';

// Create an axios instance with common configurations
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true, // Include cookies in requests if needed
  timeout: 15000, // 15 second timeout
  headers: {
    Accept: 'application/json',
  },
});

// Add request interceptor to include auth token in all requests
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to check if the response is actually JSON
apiClient.interceptors.response.use(
  response => {
    // Check if response is HTML instead of JSON
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html')) {
      return Promise.reject(
        new Error('Received HTML instead of JSON. You might need to log in again.')
      );
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export const documentApplicationService = {
  // Create a new application
  createApplication: async applicationData => {
    try {
      const response = await apiClient.post('/document-applications', applicationData);
      return response.data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  // Get all applications with multiple fallbacks
  getAllApplications: async () => {
    try {
      console.log('Trying to fetch all applications for admin...');

      // First, try to get data from backend
      try {
        // Basic endpoint for all applications - might work with proper auth
        const response = await apiClient.get('/document-applications');

        // Verify the response is an array
        if (Array.isArray(response.data)) {
          console.log(`Fetched ${response.data.length} applications from API`);
          return response.data;
        } else {
          console.warn('API response is not an array:', response.data);
          throw new Error('Invalid API response format');
        }
      } catch (apiError) {
        console.warn('API call failed:', apiError.message);

        // Fallback to localStorage
        console.log('Falling back to localStorage...');
        const localApps = JSON.parse(localStorage.getItem('applications') || '[]');

        if (Array.isArray(localApps) && localApps.length > 0) {
          console.log(`Found ${localApps.length} applications in localStorage`);
          return localApps;
        } else {
          console.warn('No applications found in localStorage');
          return [];
        }
      }
    } catch (error) {
      console.error('Error in getAllApplications:', error);
      return [];
    }
  },

  // Get a specific application by ID
  getApplication: async applicationId => {
    try {
      const response = await apiClient.get(`/document-applications/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting application ${applicationId}:`, error);

      // Fallback to localStorage
      const localApps = JSON.parse(localStorage.getItem('applications') || '[]');
      const app = localApps.find(a => a.id === applicationId);
      if (app) {
        return app;
      }

      throw error;
    }
  },

  // Update an application
  updateApplication: async (applicationId, updateData) => {
    try {
      const response = await apiClient.put(`/document-applications/${applicationId}`, updateData);

      // Also update localStorage
      try {
        const localApps = JSON.parse(localStorage.getItem('applications') || '[]');
        const index = localApps.findIndex(a => a.id === applicationId);
        if (index >= 0) {
          localApps[index] = { ...localApps[index], ...updateData };
          localStorage.setItem('applications', JSON.stringify(localApps));
        }
      } catch (localErr) {
        console.warn('Failed to update localStorage:', localErr);
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating application ${applicationId}:`, error);

      // Update localStorage even if API fails
      try {
        const localApps = JSON.parse(localStorage.getItem('applications') || '[]');
        const index = localApps.findIndex(a => a.id === applicationId);
        if (index >= 0) {
          localApps[index] = { ...localApps[index], ...updateData };
          localStorage.setItem('applications', JSON.stringify(localApps));
          return localApps[index];
        }
      } catch (localErr) {
        console.warn('Failed to update localStorage:', localErr);
      }

      throw error;
    }
  },

  // Update application status (new method)
  updateApplicationStatus: async (applicationId, statusData) => {
    try {
      // Try a different endpoint format that might work with your backend
      const response = await apiClient.patch(
        `/document-applications/${applicationId}/status`,
        statusData
      );

      // Also update localStorage
      try {
        const localApps = JSON.parse(localStorage.getItem('applications') || '[]');
        const index = localApps.findIndex(a => a.id === applicationId);
        if (index >= 0) {
          localApps[index] = { ...localApps[index], ...statusData };
          localStorage.setItem('applications', JSON.stringify(localApps));
        }
      } catch (localErr) {
        console.warn('Failed to update localStorage:', localErr);
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating application status ${applicationId}:`, error);

      // Update localStorage even if API fails
      try {
        const localApps = JSON.parse(localStorage.getItem('applications') || '[]');
        const index = localApps.findIndex(a => a.id === applicationId);
        if (index >= 0) {
          localApps[index] = { ...localApps[index], ...statusData };
          localStorage.setItem('applications', JSON.stringify(localApps));
          return localApps[index];
        }
      } catch (localErr) {
        console.warn('Failed to update localStorage:', localErr);
      }

      throw error;
    }
  },

  // Delete an application
  deleteApplication: async applicationId => {
    try {
      const response = await apiClient.delete(`/document-applications/${applicationId}`);

      // Also delete from localStorage
      try {
        const localApps = JSON.parse(localStorage.getItem('applications') || '[]');
        const filteredApps = localApps.filter(a => a.id !== applicationId);
        localStorage.setItem('applications', JSON.stringify(filteredApps));
      } catch (localErr) {
        console.warn('Failed to update localStorage:', localErr);
      }

      return response.data;
    } catch (error) {
      console.error(`Error deleting application ${applicationId}:`, error);
      throw error;
    }
  },

  // Upload a file for an application
  uploadFile: async (applicationId, file, documentType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await apiClient.post(
        `/document-applications/${applicationId}/files`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error uploading file for application ${applicationId}:`, error);
      throw error;
    }
  },

  // Get application files
  getApplicationFiles: async applicationId => {
    try {
      const response = await apiClient.get(`/document-applications/${applicationId}/files`);
      return response.data;
    } catch (error) {
      console.error(`Error getting files for application ${applicationId}:`, error);
      throw error;
    }
  },

  // Get user's applications (non-admin)
  getUserApplications: async () => {
    try {
      const response = await apiClient.get('/document-applications/user');
      return response.data;
    } catch (error) {
      console.error('Error getting user applications:', error);

      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('applications') || '[]');
    }
  },
};

export default documentApplicationService;
