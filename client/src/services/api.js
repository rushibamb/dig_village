import axios from 'axios';

// Get API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Log API configuration for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('🔌 API Configuration:', {
    baseURL: `${API_BASE_URL}/api`,
    envVar: import.meta.env.VITE_API_BASE_URL || 'not set (using default)'
  });
}

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log API errors in development
    if (import.meta.env.DEV) {
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        console.error('❌ Backend connection failed. Is the server running on', API_BASE_URL, '?');
        console.error('Error details:', error.message);
      } else if (error.response) {
        console.error('❌ API Error:', error.response.status, error.response.statusText);
        console.error('URL:', error.config?.url);
      } else {
        console.error('❌ Request Error:', error.message);
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

