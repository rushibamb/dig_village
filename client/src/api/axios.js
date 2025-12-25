import axios from 'axios';

// Get API base URL from environment variable
// VITE_API_URL should be set to the base URL (e.g., https://dig-village.onrender.com)
// We'll append /api to all requests
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Normalize the API URL - remove trailing /api if present, we'll add it below
const normalizedBaseUrl = API_BASE_URL?.replace(/\/api\/?$/, '') || '';

// Determine final base URL
// In production, we MUST have a valid URL - fail fast if not set
const isProduction = import.meta.env.PROD;
const finalBaseUrl = normalizedBaseUrl 
  ? `${normalizedBaseUrl}/api`
  : isProduction 
    ? null // Fail in production if not set
    : '/api'; // Allow relative URLs in development

// Log API configuration (always log in production for debugging)
const apiConfig = {
  baseURL: finalBaseUrl || 'NOT SET - API CALLS WILL FAIL',
  envVar: API_BASE_URL || 'not set',
  mode: import.meta.env.MODE,
  isProduction
};

if (isProduction) {
  // Always log in production to help debug
  console.log('🔌 API Configuration (Production):', apiConfig);
  
  if (!API_BASE_URL) {
    console.error('❌ CRITICAL: VITE_API_URL is not set in Vercel environment variables!');
    console.error('❌ All API calls will fail. Please set VITE_API_URL in Vercel project settings.');
    console.error('❌ Go to: Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.error('❌ Add: VITE_API_URL = https://dig-village.onrender.com');
  }
} else {
  // Development logging
  console.log('🔌 API Configuration (Development):', apiConfig);
  if (!API_BASE_URL) {
    console.warn('⚠️ VITE_API_URL not set - using relative URL /api');
    console.warn('⚠️ This will only work if backend is on same origin or you set VITE_API_URL');
  }
}

// Fail fast in production if URL is not set
if (isProduction && !normalizedBaseUrl) {
  console.error('❌ Cannot create API client: VITE_API_URL is required in production');
}

// Create axios instance with configured base URL
const axiosInstance = axios.create({
  baseURL: finalBaseUrl || '/api', // Fallback to /api even in production to prevent immediate crash
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log API errors (always log connection errors in production)
    const isConnectionError = error.code === 'ECONNREFUSED' || 
                             error.message.includes('Network Error') ||
                             error.message.includes('Failed to fetch') ||
                             (error.config && error.config.url && error.config.url.includes('localhost:5000'));
    
    if (isConnectionError || import.meta.env.DEV) {
      if (isConnectionError) {
        console.error('❌ Backend connection failed!');
        console.error('Request URL:', error.config?.url || 'unknown');
        console.error('VITE_API_URL:', API_BASE_URL || 'NOT SET');
        console.error('Expected base URL:', finalBaseUrl || 'NOT SET');
        console.error('Error details:', error.message);
        
        if (import.meta.env.PROD && !API_BASE_URL) {
          console.error('❌ SOLUTION: Set VITE_API_URL in Vercel environment variables');
          console.error('❌ Go to: Vercel Dashboard → Project Settings → Environment Variables');
          console.error('❌ Add: VITE_API_URL = https://dig-village.onrender.com');
        }
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

export default axiosInstance;

