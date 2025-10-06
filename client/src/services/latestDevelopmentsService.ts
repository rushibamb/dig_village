import api from './api';

// ==================== TYPESCRIPT TYPES ====================

export interface LatestDevelopment {
  _id: string;
  title: {
    en: string;
    mr: string;
  };
  description: {
    en: string;
    mr: string;
  };
  imageUrl: string;
  category: {
    en: string;
    mr: string;
  };
  publishDate: string;
  isActive: boolean;
  isFeatured: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ==================== ADMIN API FUNCTIONS ====================

// Get all latest developments (admin)
export const adminGetAllLatestDevelopments = async (): Promise<ApiResponse<LatestDevelopment[]>> => {
  try {
    const response = await api.get('/admin/latest-developments');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest developments:', error);
    throw error;
  }
};

// Create new latest development (admin)
export const adminCreateLatestDevelopment = async (data: {
  title: { en: string; mr: string };
  description: { en: string; mr: string };
  imageUrl: string;
  category: { en: string; mr: string };
  publishDate?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  priority?: number;
}): Promise<ApiResponse<LatestDevelopment>> => {
  try {
    const response = await api.post('/admin/latest-developments', data);
    return response.data;
  } catch (error) {
    console.error('Error creating latest development:', error);
    throw error;
  }
};

// Get latest development by ID (admin)
export const adminGetLatestDevelopmentById = async (id: string): Promise<ApiResponse<LatestDevelopment>> => {
  try {
    const response = await api.get(`/admin/latest-developments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest development:', error);
    throw error;
  }
};

// Update latest development (admin)
export const adminUpdateLatestDevelopment = async (
  id: string,
  data: {
    title: { en: string; mr: string };
    description: { en: string; mr: string };
    imageUrl: string;
    category: { en: string; mr: string };
    publishDate?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    priority?: number;
  }
): Promise<ApiResponse<LatestDevelopment>> => {
  try {
    const response = await api.put(`/admin/latest-developments/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating latest development:', error);
    throw error;
  }
};

// Delete latest development (admin)
export const adminDeleteLatestDevelopment = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/admin/latest-developments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting latest development:', error);
    throw error;
  }
};

// Toggle latest development status (admin)
export const adminToggleLatestDevelopmentStatus = async (id: string): Promise<ApiResponse<LatestDevelopment>> => {
  try {
    const response = await api.patch(`/admin/latest-developments/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error('Error toggling latest development status:', error);
    throw error;
  }
};

// Toggle featured status (admin)
export const adminToggleFeaturedStatus = async (id: string): Promise<ApiResponse<LatestDevelopment>> => {
  try {
    const response = await api.patch(`/admin/latest-developments/${id}/toggle-featured`);
    return response.data;
  } catch (error) {
    console.error('Error toggling featured status:', error);
    throw error;
  }
};

// ==================== PUBLIC API FUNCTIONS ====================

// Get all active latest developments (public)
export const getPublicLatestDevelopments = async (params?: {
  limit?: number;
  featured?: boolean;
}): Promise<ApiResponse<LatestDevelopment[]>> => {
  try {
    const response = await api.get('/latest-developments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching public latest developments:', error);
    throw error;
  }
};
