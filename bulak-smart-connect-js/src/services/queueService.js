import axios from 'axios';
import api from './api'; // Import your preconfigured axios instance

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
      console.log('Creating queue with data:', queueData); //For Debugging
      const response = await api.post('/queue', queueData);
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
}

  
};