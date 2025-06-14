import axios from 'axios';
import api from './api'; // Import your preconfigured axios instance

const API_URL = 'http://localhost:3000'; // Change to your backend URL

export const queueService = {
  // Get all walk-in queues (both pending and serving)
  fetchWalkInQueues: async () => {
    try {
      console.log(`Making request to: ${API_URL}/queues/walk-in`);
      const response = await axios.get(`${API_URL}/queues/walk-in`);
      console.log('Walk-in queues API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error getting walk-in queues:', error);
      throw error;
    }
  },

  fetchCurrentQueues: async () => {
    try {
      console.log(`Making request to: ${API_URL}/queue/serving`);
      const response = await axios.get(`${API_URL}/queue/serving`);
      console.log('Current queues API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error getting current queues:', error);
      throw error;
    }
  },
  
  fetchPendingQueues: async () => {
    const response = await axios.get(`${API_URL}/queue/pending`);
    return response.data;
  },
  
  getQueuePosition: async (queueId) => {
    try {
      console.log(`Making request to: ${API_URL}/queue/${queueId}/position`);
      const response = await axios.get(`${API_URL}/queue/${queueId}/position`);
      console.log('Position API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error getting position:', error);
      throw error;
    }
  },
  
  createQueue: async (queueData) => {
    try {
      console.log('Creating queue with data:', queueData);
      
      // Debug token
      const token = localStorage.getItem('token');
      console.log('Token being used:', token ? 'Valid token present' : 'No token');
      
      const response = await api.post('/queue', queueData);
      console.log('Queue creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating queue:', error);
      throw error;
    }
  },

  checkQueueExists: async (queueId) => {
    try {
      const response = await axios.get(`${API_URL}/queue/${queueId}/exists`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking if queue exists:', error);
      return false;
    }
  },

  fetchQueueDetails: async (queueId) => {
    try {
      console.log(`Making request to: ${API_URL}/queue/${queueId}/details`);
      const response = await axios.get(`${API_URL}/queue/${queueId}/details`);
      console.log(`Details for queue ${queueId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for queue ${queueId}:`, error);
      throw error;
    }
  },

  // Fetch details for all pending queues
  fetchPendingQueuesWithDetails: async () => {
    try {
      console.log(`Making request to: ${API_URL}/queue/pending/details`);
      const response = await axios.get(`${API_URL}/queue/pending/details`);
      console.log('Pending queues with details:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending queues with details:', error);
      throw error;
    }
  },

  // Fetch details for all current (serving) queues
  fetchCurrentQueuesWithDetails: async () => {
    try {
      console.log(`Making request to: ${API_URL}/queue/serving/details`);
      const response = await axios.get(`${API_URL}/queue/serving/details`);
      console.log('Current queues with details:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching current queues with details:', error);
      throw error;
    }
  },

  // Bulk fetch details for multiple queue IDs
  fetchDetailsForMultipleQueues: async (queueIds) => {
    try {
      console.log(`Making request to: ${API_URL}/queue/bulk-details`);
      const response = await axios.post(`${API_URL}/queue/bulk-details`, { queueIds });
      console.log('Bulk queue details:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching bulk queue details:', error);
      throw error;
    }
  },
  // Update queue status
  updateQueueStatus: async (queueId, status) => {
    try {
      console.log(`Updating queue ${queueId} status to ${status}`);
      
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
      
      console.log(`Mapped status: ${status} -> ${backendStatus}`);
      console.log(`Making request to: ${API_URL}/queue/${queueId}/status`);
      
      const response = await axios.patch(`${API_URL}/queue/${queueId}/status`, { status: backendStatus });
      console.log('Update status response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating queue ${queueId} status:`, error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  // New method to fetch user queues from backend
  fetchUserQueues: async (userId) => {
    try {
      console.log(`Making request to: ${API_URL}/queues/user/${userId}`);
      const response = await axios.get(`${API_URL}/queues/user/${userId}`);
      console.log('User queues API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user queues:', error);
      throw error;
    }
  },
};