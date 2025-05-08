import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Change to your backend URL

export const queueService = {
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
      console.log('Creating queue with data:', queueData); // For debugging
      const response = await axios.post(`${API_URL}/queue`, queueData);
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
};