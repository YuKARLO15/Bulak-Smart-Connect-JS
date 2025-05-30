import api from './api';

export const documentApplicationService = {
  // Create new application
  async createApplication(applicationData) {
    try {
      const response = await api.post('/document-applications', applicationData);
      return response.data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  // Get user's applications
  async getUserApplications() {
    try {
      const response = await api.get('/document-applications');
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  // Get specific application
  async getApplication(id) {
    try {
      const response = await api.get(`/document-applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  // Update application
  async updateApplication(id, updateData) {
    try {
      const response = await api.patch(`/document-applications/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  },

  // Upload file
  async uploadFile(applicationId, file, documentCategory) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentCategory', documentCategory);

      const response = await api.post(
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
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Get file download URL
  async getFileDownloadUrl(fileId) {
    try {
      const response = await api.get(`/document-applications/files/${fileId}/download`);
      return response.data.url;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },

  // Delete application
  async deleteApplication(id) {
    try {
      await api.delete(`/document-applications/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  },

  // Admin methods
  async getAllApplications() {
    try {
      const response = await api.get('/document-applications/admin/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all applications:', error);
      throw error;
    }
  },

  async updateApplicationStatus(id, status, statusMessage) {
    try {
      const response = await api.patch(`/document-applications/${id}/status`, {
        status,
        statusMessage,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  async getApplicationStats() {
    try {
      const response = await api.get('/document-applications/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching application stats:', error);
      throw error;
    }
  },
};