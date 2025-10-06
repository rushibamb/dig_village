import api from './api';

// ==================== PUBLIC API FUNCTIONS ====================

// Get public site settings
export const getPublicSiteSettings = async () => {
  try {
    const response = await api.get('/homepage/site-settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching public site settings:', error);
    throw error;
  }
};

// Get all public facilities
export const getPublicFacilities = async () => {
  try {
    const response = await api.get('/homepage/facilities');
    return response.data;
  } catch (error) {
    console.error('Error fetching public facilities:', error);
    throw error;
  }
};

// Get all public achievements
export const getPublicAchievements = async () => {
  try {
    const response = await api.get('/homepage/achievements');
    return response.data;
  } catch (error) {
    console.error('Error fetching public achievements:', error);
    throw error;
  }
};

// Get all public latest developments
export const getPublicLatestDevelopments = async (params?: { limit?: number }) => {
  try {
    const response = await api.get('/homepage/latest-developments', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching public latest developments:', error);
    throw error;
  }
};

// ==================== ADMIN API FUNCTIONS ====================

// ==================== FACILITY ADMIN FUNCTIONS ====================

// Get all facilities (admin)
export const adminGetAllFacilities = async () => {
  try {
    const response = await api.get('/admin/facilities');
    return response.data;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};

// Create new facility (admin)
export const adminCreateFacility = async (facilityData: {
  name: { en: string; mr: string };
  description?: { en?: string; mr?: string };
  icon?: string;
}) => {
  try {
    const response = await api.post('/admin/facilities', facilityData);
    return response.data;
  } catch (error) {
    console.error('Error creating facility:', error);
    throw error;
  }
};

// Get facility by ID (admin)
export const adminGetFacilityById = async (id: string) => {
  try {
    const response = await api.get(`/admin/facilities/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching facility:', error);
    throw error;
  }
};

// Update facility (admin)
export const adminUpdateFacility = async (id: string, facilityData: {
  name: { en: string; mr: string };
  description?: { en?: string; mr?: string };
  icon?: string;
}) => {
  try {
    const response = await api.put(`/admin/facilities/${id}`, facilityData);
    return response.data;
  } catch (error) {
    console.error('Error updating facility:', error);
    throw error;
  }
};

// Delete facility (admin)
export const adminDeleteFacility = async (id: string) => {
  try {
    const response = await api.delete(`/admin/facilities/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting facility:', error);
    throw error;
  }
};

// ==================== ACHIEVEMENT ADMIN FUNCTIONS ====================

// Get all achievements (admin)
export const adminGetAllAchievements = async () => {
  try {
    const response = await api.get('/admin/achievements');
    return response.data;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }
};

// Create new achievement (admin)
export const adminCreateAchievement = async (achievementData: {
  title: { en: string; mr: string };
  description?: { en?: string; mr?: string };
  icon?: string;
}) => {
  try {
    const response = await api.post('/admin/achievements', achievementData);
    return response.data;
  } catch (error) {
    console.error('Error creating achievement:', error);
    throw error;
  }
};

// Get achievement by ID (admin)
export const adminGetAchievementById = async (id: string) => {
  try {
    const response = await api.get(`/admin/achievements/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching achievement:', error);
    throw error;
  }
};

// Update achievement (admin)
export const adminUpdateAchievement = async (id: string, achievementData: {
  title: { en: string; mr: string };
  description?: { en?: string; mr?: string };
  icon?: string;
}) => {
  try {
    const response = await api.put(`/admin/achievements/${id}`, achievementData);
    return response.data;
  } catch (error) {
    console.error('Error updating achievement:', error);
    throw error;
  }
};

// Delete achievement (admin)
export const adminDeleteAchievement = async (id: string) => {
  try {
    const response = await api.delete(`/admin/achievements/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting achievement:', error);
    throw error;
  }
};

// ==================== TYPESCRIPT TYPES ====================

export interface Facility {
  _id: string;
  name: {
    en: string;
    mr: string;
  };
  description?: {
    en?: string;
    mr?: string;
  };
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  _id: string;
  title: {
    en: string;
    mr: string;
  };
  description?: {
    en?: string;
    mr?: string;
  };
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  _id: string;
  heroTitle?: {
    en?: string;
    mr?: string;
  };
  heroSubtitle?: {
    en?: string;
    mr?: string;
  };
  heroImageUrl?: string;
  villageStats?: {
    population?: string;
    households?: string;
    area?: string;
    literacyRate?: string;
  };
  aboutText?: {
    en?: string;
    mr?: string;
  };
  aboutImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
