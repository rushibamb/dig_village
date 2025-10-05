import api from './api';

// Types for better TypeScript support
export interface MediaItem {
  _id: string;
  mediaType: 'Photo' | 'Video';
  title: {
    en: string;
    mr?: string;
  };
  description: {
    en?: string;
    mr?: string;
  };
  category: {
    _id: string;
    name: {
      en: string;
      mr: string;
    };
  };
  tags: string[];
  fileUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  isFeatured: boolean;
  views: number;
  likes: number;
  uploadedBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MediaCategory {
  _id: string;
  name: {
    en: string;
    mr: string;
  };
  mediaCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaParams {
  mediaType?: 'Photo' | 'Video';
  category?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  search?: string;
}

export interface CreateMediaItemData {
  mediaType: 'Photo' | 'Video';
  title: {
    en: string;
    mr?: string;
  };
  description?: {
    en?: string;
    mr?: string;
  };
  category: string;
  tags?: string[];
  fileUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  isFeatured?: boolean;
}

export interface CreateMediaCategoryData {
  name: {
    en: string;
    mr: string;
  };
}

// ==================== PUBLIC FUNCTIONS ====================

/**
 * Get all public media items with optional filtering
 */
export const getPublicMedia = async (params?: MediaParams) => {
  const response = await api.get('/media', { params });
  return response.data;
};

/**
 * Get all public media categories
 */
export const getPublicCategories = async () => {
  const response = await api.get('/media/categories');
  return response.data;
};

/**
 * Increment views for a media item
 */
export const incrementMediaViews = async (id: string) => {
  const response = await api.patch(`/media/${id}/view`);
  return response.data;
};

/**
 * Increment likes for a media item
 */
export const incrementMediaLikes = async (id: string) => {
  const response = await api.patch(`/media/${id}/like`);
  return response.data;
};

/**
 * Get a single media item by ID (public view)
 */
export const getMediaItemById = async (id: string) => {
  const response = await api.get(`/media/${id}`);
  return response.data;
};

// ==================== ADMIN FUNCTIONS ====================

/**
 * Get all media items for admin (with filtering and search)
 */
export const adminGetAllMediaItems = async (params?: MediaParams) => {
  const response = await api.get('/admin/media', { params });
  return response.data;
};

/**
 * Create a new media item (admin only)
 */
export const adminCreateMediaItem = async (data: CreateMediaItemData) => {
  const response = await api.post('/admin/media', data);
  return response.data;
};

/**
 * Update a media item (admin only)
 */
export const adminUpdateMediaItem = async (id: string, data: Partial<CreateMediaItemData>) => {
  const response = await api.put(`/admin/media/${id}`, data);
  return response.data;
};

/**
 * Delete a media item (admin only)
 */
export const adminDeleteMediaItem = async (id: string) => {
  const response = await api.delete(`/admin/media/${id}`);
  return response.data;
};

/**
 * Get all media categories for admin
 */
export const adminGetAllMediaCategories = async () => {
  const response = await api.get('/admin/media-categories');
  return response.data;
};

/**
 * Create a new media category (admin only)
 */
export const adminCreateMediaCategory = async (data: CreateMediaCategoryData) => {
  const response = await api.post('/admin/media-categories', data);
  return response.data;
};

/**
 * Update a media category (admin only)
 */
export const adminUpdateMediaCategory = async (id: string, data: CreateMediaCategoryData) => {
  const response = await api.put(`/admin/media-categories/${id}`, data);
  return response.data;
};

/**
 * Delete a media category (admin only)
 */
export const adminDeleteMediaCategory = async (id: string) => {
  const response = await api.delete(`/admin/media-categories/${id}`);
  return response.data;
};
