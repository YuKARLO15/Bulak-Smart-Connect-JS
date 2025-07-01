import axios from 'axios';
import config from '../config/env.js';

export const queueNotificationService = {
  // Send queue position notification when user reaches position 3
  sendQueuePositionAlert: async (email, queueNumber, position, estimatedTime) => {
    try {
      console.log(`🔔 Sending position alert to ${email} for queue ${queueNumber} at position ${position}`);
      const response = await axios.post(`${config.API_BASE_URL}/auth/send-queue-notification`, {
        email,
        queueNumber,
        position,
        estimatedTime,
        type: 'position_alert'
      });
      console.log('✅ Queue position alert sent successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error sending queue position alert:', error);
      // Don't throw error to avoid breaking queue functionality
      return { success: false, error: error.message };
    }
  },

  // Send "now serving" notification
  sendNowServingAlert: async (email, queueNumber) => {
    try {
      console.log(`🎯 Sending "now serving" alert to ${email} for queue ${queueNumber}`);
      const response = await axios.post(`${config.API_BASE_URL}/auth/send-queue-notification`, {
        email,
        queueNumber,
        status: 'now_serving',
        message: 'Please proceed to the counter - you are now being served!',
        type: 'status_update'
      });
      console.log('✅ Now serving alert sent successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error sending now serving alert:', error);
      return { success: false, error: error.message };
    }
  }
};