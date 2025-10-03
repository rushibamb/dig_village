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
  }
};

