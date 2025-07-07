import axios from 'axios';
import config from '../config/env.js';

export const authLockoutService = {
  async checkAccountLockout(identifier) {
    try {
      console.log(`🔍 Checking account lockout for: ${identifier}`);
      const response = await axios.post(`${config.API_BASE_URL}/auth/check-lockout`, {
        identifier
      });
      console.log('✅ Lockout check result:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error checking account lockout:', error);
      return { isLocked: false, attempts: 0 };
    }
  },

  async recordFailedAttempt(identifier) {
    try {
      console.log(`📝 Recording failed attempt for: ${identifier}`);
      const response = await axios.post(`${config.API_BASE_URL}/auth/record-failed-attempt`, {
        identifier
      });
      console.log('✅ Failed attempt recorded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error recording failed attempt:', error);
      return { attempts: 0, isLocked: false };
    }
  },

  async clearAccountLockout(identifier) {
    try {
      console.log(`🧹 Clearing account lockout for: ${identifier}`);
      await axios.post(`${config.API_BASE_URL}/auth/clear-lockout`, {
        identifier
      });
      console.log('✅ Account lockout cleared');
    } catch (error) {
      console.error('❌ Error clearing account lockout:', error);
    }
  }
};