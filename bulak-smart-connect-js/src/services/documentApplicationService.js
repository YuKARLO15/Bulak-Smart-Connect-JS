import axios from 'axios';

// Create an axios instance with common configurations
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true, // Include cookies in requests if needed
  timeout: 15000, // 15 second timeout
  headers: {
    'Accept': 'application/json'
  }
});

// Add request interceptor to include auth token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to check if the response is actually JSON
apiClient.interceptors.response.use(
  (response) => {
    // Check if response is HTML instead of JSON
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html')) {
      return Promise.reject(new Error('Received HTML instead of JSON. You might need to log in again.'));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const documentApplicationService = {
  // Create a new application
  createApplication: async (applicationData) => {
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
  getApplication: async (applicationId) => {
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
      const response = await apiClient.patch(`/document-applications/${applicationId}`, updateData);
      
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
      // Use the regular PATCH endpoint instead of the admin-only /status endpoint
      const response = await apiClient.patch(`/document-applications/${applicationId}`, statusData);

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
  deleteApplication: async (applicationId) => {
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
      // Sanitize filename to remove emojis and special characters
      const sanitizedFileName = file.name
        .replace(/[^\w\s.-]/g, '') // Remove special characters except word chars, spaces, dots, hyphens
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/_{2,}/g, '_') // Replace multiple underscores with single
        .trim();

      // Create a new File object with sanitized name
      const sanitizedFile = new File([file], sanitizedFileName, {
        type: file.type,
        lastModified: file.lastModified,
      });

      const formData = new FormData();
      formData.append('file', sanitizedFile);
      
      // Make sure documentCategory is properly set
      if (documentType && documentType !== 'undefined') {
        formData.append('documentCategory', documentType);
      } else {
        throw new Error('Document type/category is required');
      }
      
      console.log('Uploading file with category:', documentType);
      console.log('Original filename:', file.name);
      console.log('Sanitized filename:', sanitizedFileName);
      
      const response = await apiClient.post(
        `/document-applications/${applicationId}/files`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout for file uploads
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading file for application ${applicationId}:`, error);
      
      // Provide more specific error messages
      if (error.response?.status === 500) {
        throw new Error('Server error during file upload. Please try again.');
      } else if (error.response?.status === 413) {
        throw new Error('File too large. Please upload a smaller file.');
      }
      
      throw error;
    }
  },
  
  // Get application files
  getApplicationFiles: async (applicationId) => {
    try {
      console.log(`Frontend Service: Fetching files for application ${applicationId}...`);
      const response = await apiClient.get(`/document-applications/${applicationId}/files`);
      console.log('Frontend Service: Files response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Frontend Service: Error getting files for application ${applicationId}:`, error);
      
      if (error.response?.status === 404) {
        console.log('Frontend Service: Application or files not found, returning empty array');
        return [];
      }
      
      throw error;
    }
  },
  
  // Get user's applications (non-admin) 
  getUserApplications: async () => {
    try {
      // Use the main endpoint - it automatically filters by user if not admin
      const response = await apiClient.get('/document-applications');
      return response.data;
    } catch (error) {
      console.error('Error getting user applications:', error);
      
      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('applications') || '[]');
    }
  }
};

// Helper function to extract files from formData
const extractFilesFromFormData = (formData) => {
  const files = [];
  
  // Check uploadedFiles object
  if (formData.uploadedFiles && typeof formData.uploadedFiles === 'object') {
    Object.entries(formData.uploadedFiles).forEach(([docName, fileData]) => {
      if (fileData) {
        files.push({
          name: docName,
          documentType: docName,
          url: typeof fileData === 'string' ? fileData : fileData.url || fileData.data,
          contentType: typeof fileData === 'object' ? fileData.contentType : 'application/pdf'
        });
      }
    });
  }
  
  // Check uploads array
  if (formData.uploads && Array.isArray(formData.uploads)) {
    files.push(...formData.uploads);
  }
  
  return files;
};

export default documentApplicationService;