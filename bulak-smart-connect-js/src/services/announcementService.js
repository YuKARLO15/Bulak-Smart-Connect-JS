import axios from 'axios';

const API_BASE_URL = /*import.meta.env.VITE_REACT_APP_API_URL || Temporary Comment will setup later*/ 'http://localhost:3000';

export const announcementService = {
  // Get all announcements
  async getAllAnnouncements() {
    try {
      const response = await axios.get(`${API_BASE_URL}/announcements`);
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  },

  // Get recent announcements
  async getRecentAnnouncements(limit = 5) {
    try {
      const response = await axios.get(`${API_BASE_URL}/announcements/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent announcements:', error);
      throw error;
    }
  },

  // Get single announcement
  async getAnnouncementById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/announcements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching announcement:', error);
      throw error;
    }
  },

  // Create new announcement
  async createAnnouncement(announcementData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/announcements`, announcementData);
      return response.data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  // Update announcement
  async updateAnnouncement(id, announcementData) {
    try {
      const response = await axios.patch(`${API_BASE_URL}/announcements/${id}`, announcementData);
      return response.data;
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  },

  // Delete announcement
  async deleteAnnouncement(id) {
    try {
      await axios.delete(`${API_BASE_URL}/announcements/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  }
};