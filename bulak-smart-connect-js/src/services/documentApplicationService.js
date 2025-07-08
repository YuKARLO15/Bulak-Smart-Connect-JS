import axios from 'axios';
import config from '../config/env.js';
import logger from '../utils/logger.js';

// Create an axios instance with common configurations
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true, // Include cookies in requests if needed
  timeout: config.API_TIMEOUT, // Use config timeout
  headers: {
    Accept: 'application/json',
  },
});
const saveApplicationWithUserInfo = async (applicationData, userAccountInfo) => {
  const applicationWithContact = {
    ...applicationData,
    userEmail: userAccountInfo.email,
    userPhone: userAccountInfo.phoneNumber,
    username: userAccountInfo.username,
    submissionDate: new Date().toISOString(),
  };

  // Save the enhanced application data
  return await documentApplicationService.saveApplication(applicationWithContact);
};
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
      logger.error('Error creating application:', error);
      throw error;
    }
  },

  // Get all applications with user data (admin only) - ENHANCED FOR NOTIFICATIONS
  getAllApplications: async () => {
    try {
      logger.log('📧 Fetching all applications with user data for notifications...');

      // First, try to get data from backend with user relationships
      try {
        // Always include user data for admin operations
        const response = await apiClient.get('/document-applications?includeUser=true');

        // Verify the response is an array
        if (Array.isArray(response.data)) {
          logger.log(`📧 Fetched ${response.data.length} applications with user data from API`);

          // Log email availability for debugging
          response.data.forEach(application => {
            const email = application.user?.email || application.email;
            logger.log(`📧 Application ${application.id}: Email = ${email || 'NOT FOUND'}`);
          });

          return response.data;
        } else {
          console.warn('API response is not an array:', response.data);
          throw new Error('Invalid API response format');
        }
      } catch (apiError) {
        console.warn('Enhanced API call failed:', apiError.message);

        // Fallback to regular API call
        try {
          const response = await apiClient.get('/document-applications');
          if (Array.isArray(response.data)) {
            logger.log(`Fetched ${response.data.length} applications from regular API`);
            return response.data;
          }
        } catch (regularApiError) {
          console.warn('Regular API call also failed:', regularApiError.message);
        }

        // Final fallback to localStorage
        logger.log('Falling back to localStorage...');
        const localApps = JSON.parse(localStorage.getItem('applications') || '[]');

        if (Array.isArray(localApps) && localApps.length > 0) {
          logger.log(`Found ${localApps.length} applications in localStorage`);
          return localApps;
        } else {
          console.warn('No applications found in localStorage');
          return [];
        }
      }
    } catch (error) {
      logger.error('Error in getAllApplications:', error);
      return [];
    }
  },

  // Get a specific application by ID
  getApplication: async applicationId => {
    try {
      logger.log(`📧 Fetching application ${applicationId} with user data for notifications...`);
      // Always include user data for admin operations
      const response = await apiClient.get(
        `/document-applications/${applicationId}?includeUser=true`
      );
      logger.log('📧 Application with user data fetched:', response.data);

      const email = response.data.user?.email || response.data.email;
      logger.log(`📧 Application ${applicationId}: Email = ${email || 'NOT FOUND'}`);

      return response.data;
    } catch (error) {
      logger.error(`Error getting application ${applicationId}:`, error);

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
      logger.error(`Error updating application ${applicationId}:`, error);

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
      logger.error(`Error updating application status ${applicationId}:`, error);

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
      logger.error(`Error deleting application ${applicationId}:`, error);
      throw error;
    }
  },

  // Upload a file for an application
  uploadFile: async (applicationId, file, documentType) => {
    try {
      logger.log(`Frontend Service: Uploading file for application ${applicationId}...`);
      logger.log('File details:', { name: file.name, size: file.size, type: file.type });
      logger.log('Document type:', documentType);

      // Enhanced sanitization for document labels/types
      const sanitizeDocumentType = docType => {
        return docType
          .replace(/\//g, '-') // Replace forward slashes with hyphens
          .replace(/\\/g, '-') // Replace backslashes with hyphens
          .replace(/[<>:"|?*]/g, '') // Remove other problematic characters
          .replace(/\s+/g, '_') // Replace spaces with underscores
          .trim();
      };

      // Sanitize filename to remove emojis and special characters
      const sanitizedFileName = file.name
        .replace(/[^\w\s.-]/g, '') // Remove special characters except word chars, spaces, dots, hyphens
        .replace(/\//g, '-') // Replace forward slashes with hyphens
        .replace(/\\/g, '-') // Replace backslashes with hyphens
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

      // Sanitize and validate document type
      if (documentType && documentType !== 'undefined') {
        const sanitizedDocType = sanitizeDocumentType(documentType);
        formData.append('documentCategory', sanitizedDocType);
        logger.log('Original document type:', documentType);
        logger.log('Sanitized document type:', sanitizedDocType);
      } else {
        throw new Error('Document type/category is required');
      }

      logger.log('Uploading file with category:', documentType);
      logger.log('Original filename:', file.name);
      logger.log('Sanitized filename:', sanitizedFileName);

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
      logger.error(`Error uploading file for application ${applicationId}:`, error);

      // Provide more specific error messages
      if (error.response?.status === 500) {
        throw new Error('Server error during file upload. Please try again.');
      } else if (error.response?.status === 413) {
        throw new Error('File too large. Please upload a smaller file.');
      }

      throw error;
    }
  },

  // Get application files (latest per category)
  getApplicationFiles: async applicationId => {
    try {
      logger.log(`Frontend Service: Fetching latest files for application ${applicationId}...`);
      const response = await apiClient.get(`/document-applications/${applicationId}/files`);
      logger.log('Frontend Service: Latest files response:', response.data);
      return response.data;
    } catch (error) {
      logger.error(
        `Frontend Service: Error getting files for application ${applicationId}:`,
        error
      );

      if (error.response?.status === 404) {
        logger.log('Frontend Service: Application or files not found, returning empty array');
        return [];
      }

      throw error;
    }
  },

  // Get all application files (for admin)
  getAllApplicationFiles: async applicationId => {
    try {
      logger.log(`Frontend Service: Fetching ALL files for application ${applicationId}...`);
      const response = await apiClient.get(`/document-applications/${applicationId}/files/all`);
      logger.log('Frontend Service: All files response:', response.data);
      return response.data;
    } catch (error) {
      logger.error(
        `Frontend Service: Error getting all files for application ${applicationId}:`,
        error
      );

      if (error.response?.status === 404) {
        logger.log('Frontend Service: Application or files not found, returning empty object');
        return { latestByCategory: {}, allFiles: [] };
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
      logger.error('Error getting user applications:', error);

      // Fallback to localStorage
      return JSON.parse(localStorage.getItem('applications') || '[]');
    }
  },
};

// Helper function to extract files from formData
const extractFilesFromFormData = formData => {
  const files = [];

  // Check uploadedFiles object
  if (formData.uploadedFiles && typeof formData.uploadedFiles === 'object') {
    Object.entries(formData.uploadedFiles).forEach(([docName, fileData]) => {
      if (fileData) {
        files.push({
          name: docName,
          documentType: docName,
          url: typeof fileData === 'string' ? fileData : fileData.url || fileData.data,
          contentType: typeof fileData === 'object' ? fileData.contentType : 'application/pdf',
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
