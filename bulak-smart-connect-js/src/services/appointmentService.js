import axios from 'axios';
import api from './api'; // Import your preconfigured axios instance

const API_URL = 'http://localhost:3000'; // Change to your backend URL

export const appointmentService = {
  // Get all appointments for the current user
  fetchUserAppointments: async () => {
    try {
      console.log(`Making request to: ${API_URL}/appointments/user`);
      const response = await api.get('/appointments/user');
      console.log('User appointments API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error getting user appointments:', error);
      throw error;
    }
  },

  // Get available appointment slots for a specific date
  fetchAvailableSlots: async (date) => {
    try {
      console.log(`Making request to: ${API_URL}/appointments/available-slots?date=${date}`);
      const response = await axios.get(`${API_URL}/appointments/available-slots?date=${date}`);
      console.log('Available slots API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error getting available slots:', error);
      throw error;
    }
  },
  
  // Create a new appointment
  createAppointment: async (appointmentData) => {
    try {
      console.log('Creating appointment with data:', appointmentData);
      
      // Debug token
      const token = localStorage.getItem('token');
      console.log('Token being used:', token ? 'Valid token present' : 'No token');
      
      const response = await api.post('/appointments', appointmentData);
      console.log('Appointment creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  // Get a specific appointment by ID
  getAppointmentById: async (appointmentId) => {
    try {
      console.log(`Making request to: ${API_URL}/appointments/${appointmentId}`);
      const response = await axios.get(`${API_URL}/appointments/${appointmentId}`);
      console.log(`Details for appointment ${appointmentId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for appointment ${appointmentId}:`, error);
      throw error;
    }
  },

  // Update an appointment status
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      console.log(`Updating appointment ${appointmentId} status to ${status}`);
      
      console.log(`Making request to: ${API_URL}/appointments/${appointmentId}/status`);
      
      const response = await api.patch(`/appointments/${appointmentId}/status`, { status });
      console.log('Update status response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment ${appointmentId} status:`, error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  // Cancel an appointment
  cancelAppointment: async (appointmentId) => {
    try {
      console.log(`Cancelling appointment ${appointmentId}`);
      const response = await api.patch(`/appointments/${appointmentId}/status`, { status: 'cancelled' });
      console.log('Cancel appointment response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling appointment ${appointmentId}:`, error);
      throw error;
    }
  },

  // For admin: get all appointments
  fetchAllAppointments: async (status = '') => {
    try {
      let url = `${API_URL}/appointments`;
      if (status) {
        url += `?status=${status}`;
      }
      console.log(`Making request to: ${url}`);
      const response = await api.get(url);
      console.log('All appointments API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error getting all appointments:', error);
      throw error;
    }
  },

  // For admin: get appointments for a specific date
  fetchAppointmentsByDate: async (date) => {
    try {
      console.log(`Making request to: ${API_URL}/appointments/date/${date}`);
      const response = await api.get(`/appointments/date/${date}`);
      console.log(`Appointments for date ${date}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointments for date ${date}:`, error);
      throw error;
    }
  }
};

export default appointmentService;