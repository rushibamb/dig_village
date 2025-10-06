import api from './api';

// ==================== SITE SETTINGS FUNCTIONS ====================

// Get site settings
export const getSiteSettings = async () => {
  try {
    const response = await api.get('/admin/site-settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    throw error;
  }
};

// Update site settings
export const updateSiteSettings = async (settingsData: {
  heroTitle?: { en?: string; mr?: string };
  heroSubtitle?: { en?: string; mr?: string };
  heroImageUrl?: string;
  villageStats?: {
    population?: string;
    households?: string;
    area?: string;
    literacyRate?: string;
  };
  aboutText?: { en?: string; mr?: string };
  aboutImageUrl?: string;
  latestDevelopments?: {
    title?: { en?: string; mr?: string };
    subtitle?: { en?: string; mr?: string };
  };
  footer?: {
    copyright?: { en?: string; mr?: string };
    description?: { en?: string; mr?: string };
    contactInfo?: {
      address?: { en?: string; mr?: string };
      phone?: string;
      email?: string;
    };
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
    };
  };
}) => {
  try {
    const response = await api.put('/admin/site-settings', settingsData);
    return response.data;
  } catch (error) {
    console.error('Error updating site settings:', error);
    throw error;
  }
};

// Upload image for home content
export const uploadHomeImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/admin/site-settings/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// ==================== TYPESCRIPT TYPES ====================

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
  latestDevelopments?: {
    title?: {
      en?: string;
      mr?: string;
    };
    subtitle?: {
      en?: string;
      mr?: string;
    };
  };
  footer?: {
    copyright?: {
      en?: string;
      mr?: string;
    };
    description?: {
      en?: string;
      mr?: string;
    };
    contactInfo?: {
      address?: {
        en?: string;
        mr?: string;
      };
      phone?: string;
      email?: string;
    };
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}
