import { apiClient } from './api';

export const documentApplicationNotificationService = {
  /**
   * Send document application confirmation notification
   */
  async sendApplicationConfirmation(userEmail, applicationId, applicationDetails) {
    try {
      // Validate inputs first
      if (!userEmail) {
        console.log('⚠️ No email provided for application confirmation');
        return { success: false, error: 'No email provided' };
      }

      if (!applicationId) {
        console.log('⚠️ No application ID provided');
        return { success: false, error: 'No application ID provided' };
      }

      if (!applicationDetails) {
        console.log('⚠️ No application details provided');
        return { success: false, error: 'No application details provided' };
      }

      console.log('📧 Sending application confirmation notification...', {
        email: userEmail,
        applicationId,
        details: applicationDetails
      });

      const response = await apiClient.post('/auth/notifications/application-confirmation', {
        email: userEmail,
        applicationId: applicationId,
        applicationType: applicationDetails.type,
        applicationSubtype: applicationDetails.subtype,
        applicantName: applicationDetails.applicantName,
        submissionDate: applicationDetails.submissionDate,
        status: applicationDetails.status || 'Pending'
      });

      console.log('✅ Application confirmation notification sent successfully');
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
        console.log('⚠️ No email provided for status update');
        return { success: false, error: 'No email provided' };
      }

      if (!applicationId) {
        console.log('⚠️ No application ID provided');
        return { success: false, error: 'No application ID provided' };
      }

      if (!newStatus) {
        console.log('⚠️ No status provided');
        return { success: false, error: 'No status provided' };
      }

      console.log('📧 Sending status update notification...', {
        email: userEmail,
        applicationId,
        newStatus,
        details: applicationDetails
      });

      const response = await apiClient.post('/auth/notifications/application-status-update', {
        email: userEmail,
        applicationId: applicationId,
        newStatus: newStatus,
        applicationType: applicationDetails?.type || applicationDetails?.applicationType,
        applicationSubtype: applicationDetails?.subtype || applicationDetails?.applicationSubtype,
        applicantName: applicationDetails?.applicantName || `${applicationDetails?.firstName || ''} ${applicationDetails?.lastName || ''}`.trim(),
        previousStatus: applicationDetails?.status
      });

      console.log('✅ Status update notification sent successfully');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to send status update notification:', error);
      return { success: false, error: error.message || 'Failed to send status update notification' };
    }
  },

  /**
   * Send application rejection notification
   */
  async sendRejectionNotification(userEmail, applicationId, applicationDetails, reason) {
    try {
      if (!userEmail) {
        console.log('⚠️ No email provided for rejection notification');
        return { success: false, error: 'No email provided' };
      }

      if (!applicationId) {
        console.log('⚠️ No application ID provided');
        return { success: false, error: 'No application ID provided' };
      }

      console.log('📧 Sending rejection notification...', {
        email: userEmail,
        applicationId,
        reason,
        details: applicationDetails
      });

      const response = await apiClient.post('/auth/notifications/application-rejection', {
        email: userEmail,
        applicationId: applicationId,
        applicationType: applicationDetails?.type || applicationDetails?.applicationType,
        applicationSubtype: applicationDetails?.subtype || applicationDetails?.applicationSubtype,
        applicantName: applicationDetails?.applicantName || `${applicationDetails?.firstName || ''} ${applicationDetails?.lastName || ''}`.trim(),
        rejectionReason: reason
      });

      console.log('✅ Rejection notification sent successfully');
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
        console.log('⚠️ No email provided for approval notification');
        return { success: false, error: 'No email provided' };
      }

      if (!applicationId) {
        console.log('⚠️ No application ID provided');
        return { success: false, error: 'No application ID provided' };
      }

      console.log('📧 Sending approval notification...', {
        email: userEmail,
        applicationId,
        details: applicationDetails
      });

      const response = await apiClient.post('/auth/notifications/application-approval', {
        email: userEmail,
        applicationId: applicationId,
        applicationType: applicationDetails?.type || applicationDetails?.applicationType,
        applicationSubtype: applicationDetails?.subtype || applicationDetails?.applicationSubtype,
        applicantName: applicationDetails?.applicantName || `${applicationDetails?.firstName || ''} ${applicationDetails?.lastName || ''}`.trim()
      });

      console.log('✅ Approval notification sent successfully');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to send approval notification:', error);
      return { success: false, error: error.message || 'Failed to send approval notification' };
    }
  }
};