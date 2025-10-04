import api from './api';

// User-Side Functions

/**
 * Submit a new grievance
 * @param {Object} grievanceData - Grievance data including title, description, category, etc.
 * @returns {Promise} API response
 */
export const submitGrievance = async (grievanceData) => {
  try {
    const response = await api.post('/grievances', grievanceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get current user's grievances
 * @param {Object} params - Query parameters (page, limit, status, category)
 * @returns {Promise} API response
 */
export const getMyGrievances = async (params = {}) => {
  try {
    const response = await api.get('/grievances/my-grievances', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get public grievances (approved by admin)
 * @param {Object} params - Query parameters (page, limit, category, status, priority)
 * @returns {Promise} API response
 */
export const getPublicGrievances = async (params = {}) => {
  try {
    const response = await api.get('/grievances/public', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin-Side Worker Functions

/**
 * Add a new worker
 * @param {Object} workerData - Worker data including name, department, phone, email, status
 * @returns {Promise} API response
 */
export const addWorker = async (workerData) => {
  try {
    const response = await api.post('/admin/workers', workerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get all workers with filtering and search
 * @param {Object} params - Query parameters (search, department, status, page, limit)
 * @returns {Promise} API response
 */
export const getAllWorkers = async (params = {}) => {
  try {
    const response = await api.get('/admin/workers', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update worker information
 * @param {String} id - Worker ID
 * @param {Object} workerData - Updated worker data
 * @returns {Promise} API response
 */
export const updateWorker = async (id, workerData) => {
  try {
    const response = await api.put(`/admin/workers/${id}`, workerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a worker
 * @param {String} id - Worker ID
 * @returns {Promise} API response
 */
export const deleteWorker = async (id) => {
  try {
    const response = await api.delete(`/admin/workers/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Admin-Side Grievance Functions

/**
 * Get all grievances for admin with filtering and searching
 * @param {Object} params - Query parameters (search, adminStatus, progressStatus, category, priority, assignedWorker, page, limit)
 * @returns {Promise} API response
 */
export const adminGetAllGrievances = async (params = {}) => {
  try {
    const response = await api.get('/admin/grievances', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update grievance admin status (approve/reject)
 * @param {String} id - Grievance ID
 * @param {String} status - Admin status ('Unapproved', 'Approved', 'Rejected')
 * @returns {Promise} API response
 */
export const adminUpdateGrievanceAdminStatus = async (id, status) => {
  try {
    const response = await api.patch(`/admin/grievances/${id}/admin-status`, {
      adminStatus: status
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Assign worker to grievance
 * @param {String} id - Grievance ID
 * @param {String} workerId - Worker ID to assign
 * @returns {Promise} API response
 */
export const adminAssignWorkerToGrievance = async (id, workerId) => {
  try {
    const response = await api.patch(`/admin/grievances/${id}/assign-worker`, {
      workerId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update grievance progress status
 * @param {String} id - Grievance ID
 * @param {String} status - Progress status ('Pending', 'In-progress', 'Resolved')
 * @returns {Promise} API response
 */
export const adminUpdateGrievanceProgressStatus = async (id, status) => {
  try {
    const response = await api.patch(`/admin/grievances/${id}/progress-status`, {
      progressStatus: status
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Update grievance progress with resolution photos
 * @param {string} id - Grievance ID
 * @param {string} status - New progress status
 * @param {Array} photos - Array of resolution photo URLs
 * @returns {Promise} API response
 */
export const adminUpdateGrievanceProgress = async (id, status, photos) => {
  try {
    const response = await api.patch(`/admin/grievances/${id}/resolve`, {
      progressStatus: status,
      photos: photos
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User-side Functions
export const getGrievanceStats = async () => {
  try {
    const response = await api.get('/grievances/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
