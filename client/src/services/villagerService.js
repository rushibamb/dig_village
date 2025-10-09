import api from './api';
import { uploadVillagerPhoto } from './cloudinaryService';

// User-side villager functions

/**
 * Submit a new villager request
 * @param {Object} villagerData - Villager data including fullName, mobileNumber, gender, dateOfBirth, aadharNumber, idProofPhoto, address
 * @returns {Promise} API response
 */
export const submitNewVillager = async (villagerData) => {
  try {
    const response = await api.post('/villagers/requests/new', villagerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Generate OTP for villager edit
 * @param {string} mobileNumber - Mobile number of the villager
 * @returns {Promise} API response
 */
export const generateEditOtp = async (mobileNumber) => {
  try {
    const response = await api.post('/villagers/requests/edit/generate-otp', {
      mobileNumber
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Verify OTP and get villager data for editing
 * @param {string} mobileNumber - Mobile number of the villager
 * @param {string} otp - 6-digit OTP
 * @returns {Promise} API response with villager data
 */
export const verifyEditOtp = async (mobileNumber, otp) => {
  try {
    const response = await api.post('/villagers/requests/edit/verify-otp', {
      mobileNumber,
      otp
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Submit villager edit request
 * @param {string} id - Villager ID
 * @param {Object} villagerData - Updated villager data
 * @returns {Promise} API response
 */
export const submitVillagerEdits = async (id, villagerData) => {
  try {
    const response = await api.put(`/villagers/requests/edit/${id}`, villagerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin-side villager functions

/**
 * Get all villagers with search and filter options (Admin only)
 * @param {Object} params - Query parameters including search, status, page, limit
 * @returns {Promise} API response with villagers data and pagination
 */
export const adminGetAllVillagers = async (params = {}) => {
  try {
    const response = await api.get('/admin/villagers', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Add a new villager directly (Admin only)
 * @param {Object} villagerData - Villager data including all required fields
 * @returns {Promise} API response
 */
export const adminAddNewVillager = async (villagerData) => {
  try {
    const response = await api.post('/admin/villagers', villagerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update villager status (Admin only)
 * @param {string} id - Villager ID
 * @param {string} status - New status ('Approved' or 'Rejected')
 * @returns {Promise} API response
 */
export const adminUpdateStatus = async (id, status) => {
  try {
    const response = await api.patch(`/admin/villagers/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update villager information (Admin only)
 * @param {string} id - Villager ID
 * @param {Object} villagerData - Updated villager data
 * @returns {Promise} API response
 */
export const adminUpdateVillager = async (id, villagerData) => {
  try {
    const response = await api.put(`/admin/villagers/${id}`, villagerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Export approved villagers to CSV (Admin only)
 * @returns {Promise} Blob data for file download
 */
export const adminExportCsv = async () => {
  try {
    const response = await api.get('/admin/villagers/export', {
      responseType: 'blob' // Important for file downloads
    });
    
    // Create blob URL for download
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    
    // Extract filename from response headers or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'villagers_export.csv';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return {
      success: true,
      message: 'CSV file downloaded successfully'
    };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Export all functions as a service object
const villagerService = {
  // User functions
  submitNewVillager,
  generateEditOtp,
  verifyEditOtp,
  submitVillagerEdits,
  
  // Admin functions
  adminGetAllVillagers,
  adminAddNewVillager,
  adminUpdateStatus,
  adminUpdateVillager,
  adminExportCsv
};

/**
 * Get villager statistics for dashboard
 * @returns {Promise} API response with villager statistics
 */
export const getVillagerStats = async () => {
  try {
    const response = await api.get('/villagers/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get logged-in user's villager profile
 * @returns {Promise} API response with user's villager profile
 */
export const getMyVillagerProfile = async () => {
  try {
    const response = await api.get('/villagers/my-profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Upload villager ID proof photo
 * @param {File} file - Image file
 * @returns {Promise} API response with image URL
 */
export const uploadVillagerImage = async (file) => {
  try {
    return await uploadVillagerPhoto(file);
  } catch (error) {
    throw error;
  }
};

export default villagerService;

