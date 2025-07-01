import axios from 'axios';
import config from '../config/config';

export const otpService = {
  // Send OTP to email
  sendOTP: async (email, purpose = 'verification') => {
    try {
      console.log(`🔄 Sending OTP to ${email} for ${purpose}`);
      const response = await axios.post(`${config.API_BASE_URL}/auth/send-otp`, {
        email,
        purpose
      });
      console.log('✅ OTP sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending OTP:', error);
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  // Verify OTP
  verifyOTP: async (email, otp, purpose = 'verification') => {
    try {
      console.log(`🔄 Verifying OTP for ${email}`);
      const response = await axios.post(`${config.API_BASE_URL}/auth/verify-otp`, {
        email,
        otp,
        purpose
      });
      console.log('✅ OTP verified successfully');
      return response.data;
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      throw new Error(error.response?.data?.message || 'Invalid OTP');
    }
  },

  // Send password reset OTP
  forgotPassword: async (email) => {
    try {
      console.log(`🔄 Sending password reset code to ${email}`);
      const response = await axios.post(`${config.API_BASE_URL}/auth/forgot-password`, {
        email
      });
      console.log('✅ Password reset code sent');
      return response.data;
    } catch (error) {
      console.error('❌ Error sending reset code:', error);
      throw new Error(error.response?.data?.message || 'Failed to send reset code');
    }
  },

  // Reset password with OTP
  resetPassword: async (email, otp, newPassword) => {
    try {
      console.log(`🔄 Resetting password for ${email}`);
      const response = await axios.post(`${config.API_BASE_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword
      });
      console.log('✅ Password reset successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Password reset failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  }
};