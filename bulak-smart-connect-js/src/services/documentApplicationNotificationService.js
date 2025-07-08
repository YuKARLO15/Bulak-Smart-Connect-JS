import axios from 'axios';
import config from '../config/env.js';
import logger from '../utils/logger.js';

// Create an axios instance with common configurations
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true,
  timeout: config.API_TIMEOUT,
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

export const documentApplicationNotificationService = {
  /**
   * Send document application confirmation notification
   */
  async sendApplicationConfirmation(userEmail, applicationId, applicationDetails) {
    try {
      // Validate inputs first
      if (!userEmail) {
        logger.log('⚠️ No email provided for application confirmation');
        return { success: false, error: 'No email provided' };
      }

      if (!applicationId) {
        logger.log('⚠️ No application ID provided');
        return { success: false, error: 'No application ID provided' };
      }

      if (!applicationDetails) {
        logger.log('⚠️ No application details provided');
        return { success: false, error: 'No application details provided' };
      }

      logger.log('📧 Sending application confirmation notification...', {
        email: userEmail,
        applicationId,
        details: applicationDetails,
      });

      const response = await apiClient.post('/auth/notifications/application-confirmation', {
        email: userEmail,
        applicationId: applicationId,
        applicationType: applicationDetails.type,
        applicationSubtype: applicationDetails.subtype,
        applicantName: applicationDetails.applicantName,
        submissionDate: applicationDetails.submissionDate,
        status: applicationDetails.status || 'Pending',
      });

      logger.log('✅ Application confirmation notification sent successfully');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to send application confirmation:', error);
      return { success: false, error: error.message || 'Failed to send application confirmation' };
    }
  },

  /**
   * Send application status update notification
   */
  async sendStatusUpdateNotification(userEmail, applicationId, newStatus, applicationDetails) {
    try {
      if (!userEmail) {
        logger.log('⚠️ No email provided for status update');
        return { success: false, error: 'No email provided' };
      }

      if (!applicationId) {
        logger.log('⚠️ No application ID provided');
        return { success: false, error: 'No application ID provided' };
      }

      if (!newStatus) {
        logger.log('⚠️ No status provided');
        return { success: false, error: 'No status provided' };
      }

      logger.log('📧 Sending status update notification...', {
        email: userEmail,
        applicationId,
        newStatus,
        details: applicationDetails,
      });

      const response = await apiClient.post('/auth/notifications/application-status-update', {
        email: userEmail,
        applicationId: applicationId,
        newStatus: newStatus,
        applicationType: applicationDetails?.type || applicationDetails?.applicationType,
        applicationSubtype: applicationDetails?.subtype || applicationDetails?.applicationSubtype,
        applicantName:
          applicationDetails?.applicantName ||
          `${applicationDetails?.firstName || ''} ${applicationDetails?.lastName || ''}`.trim(),
        previousStatus: applicationDetails?.status,
      });

      logger.log('✅ Status update notification sent successfully');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to send status update notification:', error);
      return {
        success: false,
        error: error.message || 'Failed to send status update notification',
      };
    }
  },

  /**
   * Send application rejection notification
   */
  async sendRejectionNotification(userEmail, applicationId, applicationDetails, reason) {
    try {
      if (!userEmail) {
        logger.log('⚠️ No email provided for rejection notification');
        return { success: false, error: 'No email provided' };
      }

      if (!applicationId) {
        logger.log('⚠️ No application ID provided');
        return { success: false, error: 'No application ID provided' };
      }

      logger.log('📧 Sending rejection notification...', {
        email: userEmail,
        applicationId,
        reason,
        details: applicationDetails,
      });

      const response = await apiClient.post('/auth/notifications/application-rejection', {
        email: userEmail,
        applicationId: applicationId,
        applicationType: applicationDetails?.type || applicationDetails?.applicationType,
        applicationSubtype: applicationDetails?.subtype || applicationDetails?.applicationSubtype,
        applicantName:
          applicationDetails?.applicantName ||
          `${applicationDetails?.firstName || ''} ${applicationDetails?.lastName || ''}`.trim(),
        rejectionReason: reason,
      });

      logger.log('✅ Rejection notification sent successfully');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to send rejection notification:', error);
      return { success: false, error: error.message || 'Failed to send rejection notification' };
    }
  },

  /**
   * Send application approval notification
   */
  async sendApprovalNotification(userEmail, applicationId, applicationDetails) {
    try {
      if (!userEmail) {
        logger.log('⚠️ No email provided for approval notification');
        return { success: false, error: 'No email provided' };
      }

      if (!applicationId) {
        logger.log('⚠️ No application ID provided');
        return { success: false, error: 'No application ID provided' };
      }

      logger.log('📧 Sending approval notification...', {
        email: userEmail,
        applicationId,
        details: applicationDetails,
      });

      const response = await apiClient.post('/auth/notifications/application-approval', {
        email: userEmail,
        applicationId: applicationId,
        applicationType: applicationDetails?.type || applicationDetails?.applicationType,
        applicationSubtype: applicationDetails?.subtype || applicationDetails?.applicationSubtype,
        applicantName:
          applicationDetails?.applicantName ||
          `${applicationDetails?.firstName || ''} ${applicationDetails?.lastName || ''}`.trim(),
      });

      logger.log('✅ Approval notification sent successfully');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to send approval notification:', error);
      return { success: false, error: error.message || 'Failed to send approval notification' };
    }
  },
};
