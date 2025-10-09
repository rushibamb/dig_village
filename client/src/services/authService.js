import api from './api';

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (userData) => {
    try {
      const response = await api.post('/auth/login', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user profile
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create admin user (for development/testing)
  createAdmin: async (userData) => {
    try {
      const response = await api.post('/auth/create-admin', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Forgot password - Send OTP
  forgotPassword: async (mobileNumber) => {
    try {
      const response = await api.post('/auth/forgot-password', { mobileNumber });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset password with OTP
  resetPassword: async ({ mobileNumber, otp, newPassword }) => {
    try {
      const response = await api.post('/auth/reset-password', {
        mobileNumber,
        otp,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

