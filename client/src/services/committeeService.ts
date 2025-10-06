import api from './api';

// =============================================
// PUBLIC COMMITTEE FUNCTIONS
// =============================================

/**
 * Get all active committee members (public)
 * @returns Promise with committee members data
 */
export const getPublicCommitteeMembers = async () => {
  try {
    const response = await api.get('/committee/members');
    return response.data;
  } catch (error) {
    console.error('Error fetching public committee members:', error);
    throw error;
  }
};

/**
 * Get all active departments (public)
 * @returns Promise with departments data
 */
export const getPublicDepartments = async () => {
  try {
    const response = await api.get('/committee/departments');
    return response.data;
  } catch (error) {
    console.error('Error fetching public departments:', error);
    throw error;
  }
};

/**
 * Get office information (public)
 * @returns Promise with office info data
 */
export const getPublicOfficeInfo = async () => {
  try {
    const response = await api.get('/committee/office-info');
    return response.data;
  } catch (error) {
    console.error('Error fetching public office info:', error);
    throw error;
  }
};

// =============================================
// ADMIN COMMITTEE MEMBER FUNCTIONS
// =============================================

/**
 * Get all committee members with filtering and search (admin)
 * @param params - Query parameters for filtering (active, ward, search)
 * @returns Promise with committee members data
 */
export const adminGetAllCommitteeMembers = async (params?: {
  active?: boolean;
  ward?: string;
  search?: string;
}) => {
  try {
    const response = await api.get('/admin/committee-members', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin committee members:', error);
    throw error;
  }
};

/**
 * Create new committee member (admin)
 * @param data - Committee member data
 * @returns Promise with created committee member
 */
export const adminCreateCommitteeMember = async (data: any) => {
  try {
    const response = await api.post('/admin/committee-members', data);
    return response.data;
  } catch (error) {
    console.error('Error creating committee member:', error);
    throw error;
  }
};

/**
 * Update committee member (admin)
 * @param id - Committee member ID
 * @param data - Updated committee member data
 * @returns Promise with updated committee member
 */
export const adminUpdateCommitteeMember = async (id: string, data: any) => {
  try {
    const response = await api.put(`/admin/committee-members/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating committee member:', error);
    throw error;
  }
};

/**
 * Delete committee member (admin)
 * @param id - Committee member ID
 * @returns Promise with deletion confirmation
 */
export const adminDeleteCommitteeMember = async (id: string) => {
  try {
    const response = await api.delete(`/admin/committee-members/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting committee member:', error);
    throw error;
  }
};

/**
 * Export committee members to CSV (admin)
 * @returns Promise with CSV file download
 */
export const adminExportMembersCsv = async () => {
  try {
    const response = await api.get('/admin/committee-members/export', {
      responseType: 'blob', // Important for file downloads
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'committee-members.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'CSV exported successfully' };
  } catch (error) {
    console.error('Error exporting committee members CSV:', error);
    throw error;
  }
};

// =============================================
// ADMIN DEPARTMENT FUNCTIONS
// =============================================

/**
 * Get all departments with filtering and search (admin)
 * @param params - Query parameters for filtering (active, search)
 * @returns Promise with departments data
 */
export const adminGetAllDepartments = async (params?: {
  active?: boolean;
  search?: string;
}) => {
  try {
    const response = await api.get('/admin/departments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin departments:', error);
    throw error;
  }
};

/**
 * Create new department (admin)
 * @param data - Department data
 * @returns Promise with created department
 */
export const adminCreateDepartment = async (data: any) => {
  try {
    const response = await api.post('/admin/departments', data);
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

/**
 * Update department (admin)
 * @param id - Department ID
 * @param data - Updated department data
 * @returns Promise with updated department
 */
export const adminUpdateDepartment = async (id: string, data: any) => {
  try {
    const response = await api.put(`/admin/departments/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

/**
 * Delete department (admin)
 * @param id - Department ID
 * @returns Promise with deletion confirmation
 */
export const adminDeleteDepartment = async (id: string) => {
  try {
    const response = await api.delete(`/admin/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

// =============================================
// ADMIN OFFICE INFO FUNCTIONS
// =============================================

/**
 * Get office information (admin)
 * @returns Promise with office info data
 */
export const adminGetOfficeInfo = async () => {
  try {
    const response = await api.get('/admin/office-info');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin office info:', error);
    throw error;
  }
};

/**
 * Create or update office information (admin)
 * @param data - Office info data
 * @returns Promise with updated office info
 */
export const adminUpdateOfficeInfo = async (data: any) => {
  try {
    const response = await api.put('/admin/office-info', data);
    return response.data;
  } catch (error) {
    console.error('Error updating office info:', error);
    throw error;
  }
};







