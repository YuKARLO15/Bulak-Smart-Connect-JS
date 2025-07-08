import axios from 'axios';
import api from './api'; // Import your preconfigured axios instance
import config from '../config/env.js';
import logger from '../utils/logger.js';

export const queueService = {
  // Get all walk-in queues (both pending and serving)
  fetchWalkInQueues: async () => {
    try {
      logger.log(`Making request to: ${config.API_BASE_URL}/queues/walk-in`);
      const response = await axios.get(`${config.API_BASE_URL}/queues/walk-in`);
      logger.log('Walk-in queues API response:', response.data);
      return response.data;
    } catch (error) {
      logger.error('API error getting walk-in queues:', error);
      throw error;
    }
  },

  fetchCurrentQueues: async () => {
    try {
      logger.log(`Making request to: ${config.API_BASE_URL}/queue/serving`);
      const response = await axios.get(`${config.API_BASE_URL}/queue/serving`);
      logger.log('Current queues API response:', response.data);
      return response.data;
    } catch (error) {
      logger.error('API error getting current queues:', error);
      throw error;
    }
  },

  fetchPendingQueues: async () => {
    const response = await axios.get(`${config.API_BASE_URL}/queue/pending`);
    return response.data;
  },

  getQueuePosition: async queueId => {
    try {
      logger.log(`Making request to: ${config.API_BASE_URL}/queue/${queueId}/position`);
      const response = await axios.get(`${config.API_BASE_URL}/queue/${queueId}/position`);
      logger.log('Position API response:', response.data);
      return response.data;
    } catch (error) {
      logger.error('API error getting position:', error);
      throw error;
    }
  },

  createQueue: async queueData => {
    try {
      logger.log('Creating queue with data:', queueData);

      // Debug token
      const token = localStorage.getItem('token');
      logger.log('Token being used:', token ? 'Valid token present' : 'No token');

      const response = await api.post('/queue', queueData);
      logger.log('Queue creation response:', response.data);
      return response.data;
    } catch (error) {
      logger.error('Error creating queue:', error);
      throw error;
    }
  },

  checkQueueExists: async queueId => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/queue/${queueId}/exists`);
      return response.data.exists;
    } catch (error) {
      logger.error('Error checking if queue exists:', error);
      return false;
    }
  },

  fetchQueueDetails: async queueId => {
    try {
      logger.log(`Making request to: ${config.API_BASE_URL}/queue/${queueId}/details`);
      const response = await axios.get(`${config.API_BASE_URL}/queue/${queueId}/details`);
      logger.log(`Details for queue ${queueId}:`, response.data);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching details for queue ${queueId}:`, error);
      throw error;
    }
  },

  // Fetch details for all pending queues
  fetchPendingQueuesWithDetails: async () => {
    try {
      logger.log(`Making request to: ${config.API_BASE_URL}/queue/pending/details`);
      const response = await axios.get(`${config.API_BASE_URL}/queue/pending/details`);
      logger.log('Pending queues with details:', response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching pending queues with details:', error);
      throw error;
    }
  },

  // Fetch details for all current (serving) queues
  fetchCurrentQueuesWithDetails: async () => {
    try {
      logger.log(`Making request to: ${config.API_BASE_URL}/queue/serving/details`);
      const response = await axios.get(`${config.API_BASE_URL}/queue/serving/details`);
      logger.log('Current queues with details:', response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching current queues with details:', error);
      throw error;
    }
  },

  // Bulk fetch details for multiple queue IDs
  fetchDetailsForMultipleQueues: async queueIds => {
    try {
      logger.log(`Making request to: ${config.API_BASE_URL}/queue/bulk-details`);
      const response = await axios.post(`${config.API_BASE_URL}/queue/bulk-details`, { queueIds });
      logger.log('Bulk queue details:', response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching bulk queue details:', error);
      throw error;
    }
  },
  // Update queue status
  updateQueueStatus: async (queueId, status) => {
    try {
      logger.log(`Updating queue ${queueId} status to ${status}`);

      // Map frontend status values to backend expected values
      let backendStatus;
      switch (status) {
        case 'in-progress':
          backendStatus = 'serving';
          break;
        case 'completed':
          backendStatus = 'completed';
          break;
        case 'pending':
          backendStatus = 'pending';
          break;
        default:
          backendStatus = status;
      }

      logger.log(`Mapped status: ${status} -> ${backendStatus}`);
      logger.log(`Making request to: ${config.API_BASE_URL}/queue/${queueId}/status`);

      const response = await axios.patch(`${config.API_BASE_URL}/queue/${queueId}/status`, {
        status: backendStatus,
      });
      logger.log('Update status response:', response.data);
      return response.data;
    } catch (error) {
      logger.error(`Error updating queue ${queueId} status:`, error);
      logger.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  // New method to fetch user queues from backend
  fetchUserQueues: async userId => {
    try {
      logger.log(`Making request to: ${config.API_BASE_URL}/queues/user/${userId}`);
      const response = await axios.get(`${config.API_BASE_URL}/queues/user/${userId}`);
      logger.log('User queues API response:', response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching user queues:', error);
      throw error;
    }
  },

  // Add method to get queue details including status
  getQueueDetails: async queueId => {
    try {
      logger.log(`Making request to: ${config.API_BASE_URL}/queues/${queueId}`);
      const response = await axios.get(`${config.API_BASE_URL}/queues/${queueId}`);
      logger.log('Queue details API response:', response.data);
      return response.data;
    } catch (error) {
      logger.error('Error fetching queue details:', error);
      throw error;
    }
  },

  // Create manual queue for walk-in guests
  createManualQueue: async (guestData = {}) => {
    try {
      logger.log('Service: Creating manual queue with data:', guestData);

      const payload = {
        firstName: guestData.firstName || 'Walk-in',
        lastName: guestData.lastName || 'Guest',
        middleInitial: guestData.middleInitial || '',
        reasonOfVisit: guestData.reasonOfVisit || 'General Inquiry',
        address: guestData.address || 'N/A',
        phoneNumber: guestData.phoneNumber || 'N/A',
        appointmentType: guestData.reasonOfVisit || 'General Inquiry',
      };

      logger.log('Service: Sending payload:', payload);

      const response = await axios.post(`${config.API_BASE_URL}/queue/manual`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      logger.log('Service: Manual queue created:', response.data);
      return response.data;
    } catch (error) {
      logger.error('Service: Error creating manual queue:', error);
      logger.error('Service: Error response:', error.response?.data);
      throw error;
    }
  },

  // Listen for daily reset notifications
  onDailyReset: callback => {
    if (window.socket) {
      window.socket.on('dailyQueueReset', data => {
        logger.log('📅 Daily queue reset notification:', data);
        callback(data);
      });
    }
  },

  // Manual admin reset
  triggerManualReset: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${config.API_BASE_URL}/queue/admin/daily-reset`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Error triggering manual reset:', error);

      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Admin privileges required.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error during reset. The reset may have completed successfully.');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to perform daily reset');
      }
    }
  },

  // Get today's pending count
  getTodayPendingCount: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/queue/admin/pending-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      logger.error('Error getting pending count:', error);
      throw error;
    }
  },
};
