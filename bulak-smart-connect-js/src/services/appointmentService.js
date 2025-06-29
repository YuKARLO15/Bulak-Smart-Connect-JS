import axios from 'axios';
import api from './api';
import config from '../config/env.js';

export const appointmentService = {
  // Create a new appointment 
  createAppointment: async (appointmentData) => {
    try {
      console.log('Creating appointment with data:', appointmentData);
      
      const response = await api.post('/appointments', appointmentData);
      console.log('Appointment created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get user's own appointments 
  fetchUserAppointments: async () => {
    try {
      console.log('Fetching user appointments from /appointments/mine');
      const response = await api.get('/appointments/mine');
      console.log('User appointments fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  },

  // Get all appointments (admin only)
  fetchAllAppointments: async () => {
    try {
      console.log('Fetching all appointments from /appointments');
      const response = await api.get('/appointments');
      console.log('All appointments fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      throw error;
    }
  },

  // Get appointment by ID 
  getAppointmentById: async (appointmentId) => {
    try {
      console.log(`Fetching appointment by ID: ${appointmentId}`);
      const response = await api.get(`/appointments/${appointmentId}`);
      console.log('Appointment fetched by ID:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${appointmentId}:`, error);
      throw error;
    }
  },

  // Get appointment by appointment number (GET /appointments/by-number/:number)
  getAppointmentByNumber: async (appointmentNumber) => {
    try {
      console.log(`Fetching appointment by number: ${appointmentNumber}`);
      const response = await api.get(`/appointments/by-number/${appointmentNumber}`);
      console.log('Appointment fetched by number:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment by number ${appointmentNumber}:`, error);
      throw error;
    }
  },

  // Get appointments by date (GET /appointments/by-date)
  fetchAppointmentsByDate: async (date) => {
    try {
      console.log(`Fetching appointments for date: ${date}`);
      const response = await api.get('/appointments/by-date', {
        params: { date }
      });
      console.log(`Appointments for date ${date}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointments for date ${date}:`, error);
      throw error;
    }
  },

  // Get appointment statistics (GET /appointments/stats)
  getAppointmentStats: async () => {
    try {
      console.log('Fetching appointment statistics');
      const response = await api.get('/appointments/stats');
      console.log('Appointment stats:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      throw error;
    }
  },

  // Get appointments in date range (GET /appointments/date-range)
  fetchAppointmentsByDateRange: async (startDate, endDate) => {
    try {
      console.log(`Fetching appointments from ${startDate} to ${endDate}`);
      const response = await api.get('/appointments/date-range', {
        params: { startDate, endDate }
      });
      console.log('Appointments in date range:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments by date range:', error);
      throw error;
    }
  },

  // Get available time slots (GET /appointments/available-slots)
  fetchAvailableSlots: async (date) => {
    try {
      console.log(`Fetching available slots for date: ${date}`);
      const response = await api.get('/appointments/available-slots', {
        params: { date }
      });
      console.log('Available slots:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  },

  // Update appointment (PATCH /appointments/:id)
  updateAppointment: async (appointmentId, updateData) => {
    try {
      console.log(`Updating appointment ${appointmentId}:`, updateData);
      const response = await api.patch(`/appointments/${appointmentId}`, updateData);
      console.log('Appointment updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment ${appointmentId}:`, error);
      throw error;
    }
  },

  // Update appointment status (PATCH /appointments/:id/status)
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      console.log(`Updating appointment ${appointmentId} status to: ${status}`);
      const response = await api.patch(`/appointments/${appointmentId}/status`, { status });
      console.log('Appointment status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment ${appointmentId} status:`, error);
      throw error;
    }
  },

  // Delete appointment (DELETE /appointments/:id)
  deleteAppointment: async (appointmentId) => {
    try {
      console.log(`Deleting appointment: ${appointmentId}`);
      const response = await api.delete(`/appointments/${appointmentId}`);
      console.log('Appointment deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting appointment ${appointmentId}:`, error);
      throw error;
    }
  },

  // Helper methods for convenience
  confirmAppointment: async (appointmentId) => {
    return appointmentService.updateAppointmentStatus(appointmentId, 'confirmed');
  },

  cancelAppointment: async (appointmentId) => {
    return appointmentService.updateAppointmentStatus(appointmentId, 'cancelled');
  },

  completeAppointment: async (appointmentId) => {
    return appointmentService.updateAppointmentStatus(appointmentId, 'completed');
  }
};

export default appointmentService;