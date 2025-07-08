import axios from 'axios';
import config from '../config/env.js';
import logger from '../utils/logger.js';

export const queueNotificationService = {
  // Send queue position notification when user reaches position 3
  sendQueuePositionAlert: async (email, queueNumber, position, estimatedTime) => {
    try {
      logger.log(
        `🔔 [USER SIDE] Sending position alert to ${email} for queue ${queueNumber} at position ${position}`
      );
      const response = await axios.post(`${config.API_BASE_URL}/auth/send-queue-notification`, {
        email,
        queueNumber,
        position,
        estimatedTime,
        type: 'position_alert',
      });
      logger.log('✅ [USER SIDE] Queue position alert sent successfully', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [USER SIDE] Error sending queue position alert:', error);
      // Don't throw error to avoid breaking queue functionality
      return { success: false, error: error.message };
    }
  },

  // Send "now serving" notification
  sendNowServingAlert: async (email, queueNumber) => {
    try {
      logger.log(
        `🎯 [USER SIDE] Sending "now serving" alert to ${email} for queue ${queueNumber}`
      );
      const response = await axios.post(`${config.API_BASE_URL}/auth/send-queue-notification`, {
        email,
        queueNumber,
        status: 'now_serving',
        message: 'Please proceed to the counter - you are now being served!',
        type: 'status_update',
      });
      logger.log('✅ [USER SIDE] Now serving alert sent successfully', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [USER SIDE] Error sending now serving alert:', error);
      return { success: false, error: error.message };
    }
  },
};
