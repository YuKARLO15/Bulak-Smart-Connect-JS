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
      console.log('📧 Sending appointment confirmation notification...', {
        email: userEmail,
        appointmentNumber,
        details: appointmentDetails
      });

      const response = await axios.post(`${this.baseURL}/auth/notifications/appointment-confirmation`, {
        email: userEmail,
        appointmentNumber,
        type: 'confirmation',
        appointmentDetails: {
          type: appointmentDetails.reasonOfVisit || appointmentDetails.type || 'Civil Registry Service',
          date: appointmentDetails.appointmentDate || appointmentDetails.date,
          time: appointmentDetails.appointmentTime || appointmentDetails.time,
          firstName: appointmentDetails.firstName,
          lastName: appointmentDetails.lastName,
          phoneNumber: appointmentDetails.phoneNumber
        }
      });

      console.log('✅ Appointment confirmation notification sent:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to send appointment confirmation:', error);
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
      console.log('📧 Sending appointment status update notification...', {
        email: userEmail,
        appointmentNumber,
        newStatus,
        details: appointmentDetails
      });

      const response = await axios.post(`${this.baseURL}/auth/notifications/appointment-status-update`, {
        email: userEmail,
        appointmentNumber,
        type: 'status_update',
        status: newStatus,
        appointmentDetails: {
          type: appointmentDetails.reasonOfVisit || appointmentDetails.type || 'Civil Registry Service',
          date: appointmentDetails.appointmentDate || appointmentDetails.date,
          time: appointmentDetails.appointmentTime || appointmentDetails.time,
          firstName: appointmentDetails.firstName,
          lastName: appointmentDetails.lastName,
          phoneNumber: appointmentDetails.phoneNumber
        }
      });

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
      console.log('📧 Sending appointment cancellation notification...', {
        email: userEmail,
        appointmentNumber,
        reason,
        details: appointmentDetails
      });

      const response = await axios.post(`${this.baseURL}/auth/notifications/appointment-cancellation`, {
        email: userEmail,
        appointmentNumber,
        type: 'cancellation',
        reason: reason || 'Cancelled by administrator',
        appointmentDetails: {
          type: appointmentDetails.reasonOfVisit || appointmentDetails.type || 'Civil Registry Service',
          date: appointmentDetails.appointmentDate || appointmentDetails.date,
          time: appointmentDetails.appointmentTime || appointmentDetails.time,
          firstName: appointmentDetails.firstName,
          lastName: appointmentDetails.lastName,
          phoneNumber: appointmentDetails.phoneNumber
        }
      });

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

  /**
   * Send appointment reminder notification
   */
  async sendAppointmentReminder(userEmail, appointmentNumber, appointmentDetails) {
    try {
      console.log('📧 Sending appointment reminder notification...', {
        email: userEmail,
        appointmentNumber,
        details: appointmentDetails
      });

      const response = await axios.post(`${this.baseURL}/auth/notifications/appointment-reminder`, {
        email: userEmail,
        appointmentNumber,
        type: 'reminder',
        appointmentDetails: {
          type: appointmentDetails.reasonOfVisit || appointmentDetails.type || 'Civil Registry Service',
          date: appointmentDetails.appointmentDate || appointmentDetails.date,
          time: appointmentDetails.appointmentTime || appointmentDetails.time,
          firstName: appointmentDetails.firstName,
          lastName: appointmentDetails.lastName,
          phoneNumber: appointmentDetails.phoneNumber
        }
      });

      console.log('✅ Appointment reminder notification sent:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to send appointment reminder:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }
}

export const appointmentNotificationService = new AppointmentNotificationService();