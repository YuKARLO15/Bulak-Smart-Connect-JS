import axios from 'axios';
import api from './api';
import config from '../config/env.js';
import logger from '../utils/logger.js';

export const appointmentService = {
  // Create a new appointment
  createAppointment: async appointmentData => {
    try {
      logger.log('Creating appointment with data:', appointmentData);

      const response = await api.post('/appointments', appointmentData);
      logger.log('Appointment created successfully:', response.data);
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
      logger.log('Fetching user appointments from /appointments/mine');
      const response = await api.get('/appointments/mine');
      logger.log('User appointments fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw error;
    }
  },

  // Get all appointments (admin only)
  fetchAllAppointments: async () => {
    try {
      logger.log('📧 Fetching all appointments with user data for notifications...');
      // Always include user data for admin operations
      const response = await api.get('/appointments?includeUser=true');
      logger.log('📧 All appointments with user data fetched:', response.data);

      // Log email availability for debugging
      response.data.forEach(appointment => {
        const email = appointment.user?.email || appointment.email;
        logger.log(
          `📧 Appointment ${appointment.appointmentNumber || appointment.id}: Email = ${email || 'NOT FOUND'}`
        );
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      throw error;
    }
  },

  // Get appointment by ID (admin)
  getAppointmentById: async appointmentId => {
    try {
      logger.log(`📧 Fetching appointment ${appointmentId} with user data for notifications...`);
      // Always include user data for admin operations
      const response = await api.get(`/appointments/${appointmentId}?includeUser=true`);
      logger.log('📧 Appointment with user data fetched:', response.data);

      const email = response.data.user?.email || response.data.email;
      logger.log(`📧 Appointment ${appointmentId}: Email = ${email || 'NOT FOUND'}`);

      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${appointmentId}:`, error);
      throw error;
    }
  },

  // Get appointment by appointment number (GET /appointments/by-number/:number)
  getAppointmentByNumber: async appointmentNumber => {
    try {
      logger.log(`Fetching appointment by number: ${appointmentNumber}`);
      const response = await api.get(`/appointments/by-number/${appointmentNumber}`);
      logger.log('Appointment fetched by number:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment by number ${appointmentNumber}:`, error);
      throw error;
    }
  },

  // Get appointments by date (GET /appointments/by-date)
  fetchAppointmentsByDate: async date => {
    try {
      logger.log(`Fetching appointments for date: ${date}`);
      const response = await api.get('/appointments/by-date', {
        params: { date },
      });
      logger.log(`Appointments for date ${date}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointments for date ${date}:`, error);
      throw error;
    }
  },

  // Get appointment statistics (GET /appointments/stats)
  getAppointmentStats: async () => {
    try {
      logger.log('Fetching appointment statistics');
      const response = await api.get('/appointments/stats');
      logger.log('Appointment stats:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      throw error;
    }
  },

  // Get appointments in date range (GET /appointments/date-range)
  fetchAppointmentsByDateRange: async (startDate, endDate) => {
    try {
      logger.log(`Fetching appointments from ${startDate} to ${endDate}`);
      const response = await api.get('/appointments/date-range', {
        params: { startDate, endDate },
      });
      logger.log('Appointments in date range:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments by date range:', error);
      throw error;
    }
  },

  // Get available time slots (GET /appointments/available-slots)
  fetchAvailableSlots: async date => {
    try {
      logger.log(`Fetching available slots for date: ${date}`);
      const response = await api.get('/appointments/available-slots', {
        params: { date },
      });
      logger.log('Available slots:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  },

  // Update appointment (PATCH /appointments/:id)
  updateAppointment: async (appointmentId, updateData) => {
    try {
      logger.log(`Updating appointment ${appointmentId}:`, updateData);
      const response = await api.patch(`/appointments/${appointmentId}`, updateData);
      logger.log('Appointment updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment ${appointmentId}:`, error);
      throw error;
    }
  },

  // Update appointment status (PATCH /appointments/:id/status)
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      logger.log(`Updating appointment ${appointmentId} status to: ${status}`);
      const response = await api.patch(`/appointments/${appointmentId}/status`, { status });
      logger.log('Appointment status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment ${appointmentId} status:`, error);
      throw error;
    }
  },

  // Delete appointment (DELETE /appointments/:id)
  deleteAppointment: async appointmentId => {
    try {
      logger.log(`Deleting appointment: ${appointmentId}`);
      const response = await api.delete(`/appointments/${appointmentId}`);
      logger.log('Appointment deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting appointment ${appointmentId}:`, error);
      throw error;
    }
  },

  // Helper methods for convenience
  confirmAppointment: async appointmentId => {
    return appointmentService.updateAppointmentStatus(appointmentId, 'confirmed');
  },

  cancelAppointment: async appointmentId => {
    return appointmentService.updateAppointmentStatus(appointmentId, 'cancelled');
  },

  completeAppointment: async appointmentId => {
    return appointmentService.updateAppointmentStatus(appointmentId, 'completed');
  },
};

export default appointmentService;
