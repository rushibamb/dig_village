import axios from 'axios';

// Get API base URL from environment variable
// VITE_API_URL should be set to the full API URL (e.g., https://dig-village.onrender.com/api)
// or just the base URL (e.g., https://dig-village.onrender.com) - we'll append /api if needed
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error('❌ VITE_API_URL is not set in environment variables!');
  console.error('Please set VITE_API_URL in your .env file');
  if (import.meta.env.DEV) {
    console.warn('⚠️ Running in development mode without API URL - API calls will fail');
  }
}

// Normalize the API URL - remove trailing /api if present, we'll add it below
const normalizedBaseUrl = API_BASE_URL?.replace(/\/api\/?$/, '') || '';

// Log API configuration for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('🔌 API Configuration:', {
    baseURL: normalizedBaseUrl ? `${normalizedBaseUrl}/api` : 'NOT SET',
    envVar: API_BASE_URL || 'not set',
    mode: import.meta.env.MODE
  });
}

const api = axios.create({
  baseURL: normalizedBaseUrl ? `${normalizedBaseUrl}/api` : '/api',
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
        console.error('❌ Backend connection failed. Check VITE_API_URL:', normalizedBaseUrl || 'NOT SET');
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

