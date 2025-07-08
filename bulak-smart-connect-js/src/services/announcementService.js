import axios from 'axios';
import logger from '../utils/logger.js';
import config from '../config/env.js';

export const announcementService = {
  // Get all announcements
  async getAllAnnouncements() {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/announcements`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching announcements:', error);
      throw error;
    }
  },

  // Get recent announcements
  async getRecentAnnouncements(limit = 5) {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/announcements/recent?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      logger.error('Error fetching recent announcements:', error);
      throw error;
    }
  },

  // Get single announcement
  async getAnnouncementById(id) {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/announcements/${id}`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching announcement:', error);
      throw error;
    }
  },

  // Create new announcement
  async createAnnouncement(announcementData) {
    try {
      const response = await axios.post(`${config.API_BASE_URL}/announcements`, announcementData);
      return response.data;
    } catch (error) {
      logger.error('Error creating announcement:', error);
      throw error;
    }
  },

  // Update announcement
  async updateAnnouncement(id, announcementData) {
    try {
      const response = await axios.patch(
        `${config.API_BASE_URL}/announcements/${id}`,
        announcementData
      );
      return response.data;
    } catch (error) {
      logger.error('Error updating announcement:', error);
      throw error;
    }
  },

  // Delete announcement
  async deleteAnnouncement(id) {
    try {
      await axios.delete(`${config.API_BASE_URL}/announcements/${id}`);
      return true;
    } catch (error) {
      logger.error('Error deleting announcement:', error);
      throw error;
    }
  },
};
