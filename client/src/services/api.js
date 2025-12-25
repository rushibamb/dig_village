// Re-export the axios instance from the centralized location
// This maintains backward compatibility with existing imports
// All new code should import directly from '@/api/axios' or '../api/axios'
import axiosInstance from '../api/axios';

export default axiosInstance;

