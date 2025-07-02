import axios from 'axios';
import config from '../config/env.js';

class AppointmentNotificationService {
  constructor() {
    this.baseURL = config.API_BASE_URL;
  }

  /**
   * Send appointment confirmation notification
   */
  async sendAppointmentConfirmation(userEmail, appointmentNumber, appointmentDetails) {
    try {
      // Validate inputs first
      if (!userEmail) {
        console.log('⚠️ No email provided for appointment confirmation');
        return { success: false, error: 'No email provided' };
      }

      if (!appointmentNumber) {
        console.log('⚠️ No appointment number provided');
        return { success: false, error: 'No appointment number provided' };
      }

      if (!appointmentDetails) {
        console.log('⚠️ No appointment details provided');
        return { success: false, error: 'No appointment details provided' };
      }

      console.log('📧 Sending appointment confirmation notification...', {
        email: userEmail,
        appointmentNumber,
        details: appointmentDetails
      });

      const payload = {
        email: userEmail,
        appointmentNumber,
        type: 'confirmation',
        appointmentDetails: {
          type: appointmentDetails.type || appointmentDetails.reasonOfVisit || 'Civil Registry Service',
          date: appointmentDetails.date || appointmentDetails.appointmentDate,
          time: appointmentDetails.time || appointmentDetails.appointmentTime,
          firstName: appointmentDetails.firstName || 'N/A',
          lastName: appointmentDetails.lastName || 'N/A',
          phoneNumber: appointmentDetails.phoneNumber || ''
        }
      };

      console.log('📧 Sending payload:', payload);

      const response = await axios.post(`${this.baseURL}/auth/notifications/appointment-confirmation`, payload);

      console.log('✅ Appointment confirmation notification sent:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to send appointment confirmation:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  /**
   * Send appointment status update notification
   */
  async sendStatusUpdateNotification(userEmail, appointmentNumber, newStatus, appointmentDetails) {
    try {
      if (!userEmail) {
        console.log('⚠️ No email provided for status update');
        return { success: false, error: 'No email provided' };
      }

      console.log('📧 Sending appointment status update notification...', {
        email: userEmail,
        appointmentNumber,
        newStatus,
        details: appointmentDetails
      });

      const payload = {
        email: userEmail,
        appointmentNumber,
        type: 'status_update',
        status: newStatus,
        appointmentDetails: {
          type: appointmentDetails.reasonOfVisit || appointmentDetails.type || 'Civil Registry Service',
          date: appointmentDetails.appointmentDate || appointmentDetails.date,
          time: appointmentDetails.appointmentTime || appointmentDetails.time,
          firstName: appointmentDetails.firstName || 'N/A',
          lastName: appointmentDetails.lastName || 'N/A',
          phoneNumber: appointmentDetails.phoneNumber || ''
        }
      };

      const response = await axios.post(`${this.baseURL}/auth/notifications/appointment-status-update`, payload);

      console.log('✅ Appointment status update notification sent:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to send appointment status update:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  /**
   * Send appointment cancellation notification
   */
  async sendCancellationNotification(userEmail, appointmentNumber, appointmentDetails, reason = '') {
    try {
      if (!userEmail) {
        console.log('⚠️ No email provided for cancellation notification');
        return { success: false, error: 'No email provided' };
      }

      console.log('📧 Sending appointment cancellation notification...', {
        email: userEmail,
        appointmentNumber,
        reason,
        details: appointmentDetails
      });

      const payload = {
        email: userEmail,
        appointmentNumber,
        type: 'cancellation',
        reason: reason || 'Cancelled by administrator',
        appointmentDetails: {
          type: appointmentDetails.reasonOfVisit || appointmentDetails.type || 'Civil Registry Service',
          date: appointmentDetails.appointmentDate || appointmentDetails.date,
          time: appointmentDetails.appointmentTime || appointmentDetails.time,
          firstName: appointmentDetails.firstName || 'N/A',
          lastName: appointmentDetails.lastName || 'N/A',
          phoneNumber: appointmentDetails.phoneNumber || ''
        }
      };

      const response = await axios.post(`${this.baseURL}/auth/notifications/appointment-cancellation`, payload);

      console.log('✅ Appointment cancellation notification sent:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to send appointment cancellation:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }
}

export const appointmentNotificationService = new AppointmentNotificationService();