import api from './api';

// Type definitions for better TypeScript support
interface BilingualContent {
  en: string;
  mr?: string;
}

interface NewsCategory {
  _id: string;
  name: BilingualContent;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

interface NewsArticle {
  _id: string;
  title: BilingualContent;
  summary: BilingualContent;
  content: BilingualContent;
  category: NewsCategory;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  imageUrl?: string;
  publishDate: string;
  expiryDate?: string;
  isPublished: boolean;
  isFeatured: boolean;
  isBreaking: boolean;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  readCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  _id: string;
  title: BilingualContent;
  description: BilingualContent;
  location: BilingualContent;
  eventDate: string;
  eventTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  current: number;
  pages: number;
  total: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: PaginationInfo;
}

interface NewsStats {
  articles: {
    total: number;
    published: number;
    draft: number;
    featured: number;
    breaking: number;
    recent: number;
    byPriority: {
      high: number;
      medium: number;
      low: number;
    };
    byCategory: Array<{
      _id: string;
      count: number;
    }>;
  };
  categories: {
    total: number;
  };
  events: {
    total: number;
    active: number;
  };
}

// =============================================
// PUBLIC NEWS FUNCTIONS
// =============================================

/**
 * Get all published news articles
 * @param {Object} params - Query parameters (category, page, limit)
 * @returns {Promise<ApiResponse<NewsArticle[]>>} API response with articles and pagination
 */
export const getPublicNews = async (params: {
  category?: string;
  page?: number;
  limit?: number;
} = {}): Promise<ApiResponse<NewsArticle[]>> => {
  try {
    const response = await api.get('/news', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get all news categories
 * @returns {Promise<ApiResponse<NewsCategory[]>>} API response with categories
 */
export const getPublicCategories = async (): Promise<ApiResponse<NewsCategory[]>> => {
  try {
    const response = await api.get('/news/categories');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get upcoming events
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise<ApiResponse<Event[]>>} API response with events and pagination
 */
export const getUpcomingEvents = async (params: {
  page?: number;
  limit?: number;
} = {}): Promise<ApiResponse<Event[]>> => {
  try {
    const response = await api.get('/news/events/upcoming', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get breaking news (most recent breaking article)
 * @returns {Promise<ApiResponse<NewsArticle | null>>} API response with breaking article
 */
export const getBreakingNews = async (): Promise<ApiResponse<NewsArticle | null>> => {
  try {
    const response = await api.get('/news/breaking');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get news article by ID and increment read count
 * @param {string} id - Article ID
 * @returns {Promise<ApiResponse<NewsArticle>>} API response with article data
 */
export const getNewsArticleById = async (id: string): Promise<ApiResponse<NewsArticle>> => {
  try {
    const response = await api.get(`/news/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// =============================================
// ADMIN NEWS FUNCTIONS
// =============================================

/**
 * Admin: Get all news articles with filtering and search
 * @param {Object} params - Query parameters (search, category, priority, isPublished, isFeatured, isBreaking, page, limit)
 * @returns {Promise<ApiResponse<NewsArticle[]>>} API response with articles and pagination
 */
export const adminGetAllNewsArticles = async (params: {
  search?: string;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  isPublished?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
  page?: number;
  limit?: number;
} = {}): Promise<ApiResponse<NewsArticle[]>> => {
  try {
    const response = await api.get('/admin/news', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Create new news article
 * @param {Object} data - Article data
 * @returns {Promise<ApiResponse<NewsArticle>>} API response with created article
 */
export const adminCreateNewsArticle = async (data: {
  title: BilingualContent;
  summary: BilingualContent;
  content: BilingualContent;
  category: string;
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  imageUrl?: string;
  publishDate?: string;
  expiryDate?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  isBreaking?: boolean;
}): Promise<ApiResponse<NewsArticle>> => {
  try {
    const response = await api.post('/admin/news', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Update news article
 * @param {string} id - Article ID
 * @param {Object} data - Updated article data
 * @returns {Promise<ApiResponse<NewsArticle>>} API response with updated article
 */
export const adminUpdateNewsArticle = async (
  id: string,
  data: Partial<{
    title: BilingualContent;
    summary: BilingualContent;
    content: BilingualContent;
    category: string;
    priority: 'high' | 'medium' | 'low';
    tags: string[];
    imageUrl: string;
    publishDate: string;
    expiryDate: string;
    isPublished: boolean;
    isFeatured: boolean;
    isBreaking: boolean;
  }>
): Promise<ApiResponse<NewsArticle>> => {
  try {
    const response = await api.put(`/admin/news/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Delete news article
 * @param {string} id - Article ID
 * @returns {Promise<ApiResponse<null>>} API response
 */
export const adminDeleteNewsArticle = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/admin/news/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Get all news categories
 * @returns {Promise<ApiResponse<NewsCategory[]>>} API response with categories
 */
export const adminGetAllCategories = async (): Promise<ApiResponse<NewsCategory[]>> => {
  try {
    const response = await api.get('/admin/news-categories');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Create new news category
 * @param {Object} data - Category data
 * @returns {Promise<ApiResponse<NewsCategory>>} API response with created category
 */
export const adminCreateCategory = async (data: {
  name: BilingualContent;
  icon: string;
}): Promise<ApiResponse<NewsCategory>> => {
  try {
    const response = await api.post('/admin/news-categories', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Update news category
 * @param {string} id - Category ID
 * @param {Object} data - Updated category data
 * @returns {Promise<ApiResponse<NewsCategory>>} API response with updated category
 */
export const adminUpdateCategory = async (
  id: string,
  data: Partial<{
    name: BilingualContent;
    icon: string;
  }>
): Promise<ApiResponse<NewsCategory>> => {
  try {
    const response = await api.put(`/admin/news-categories/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Delete news category
 * @param {string} id - Category ID
 * @returns {Promise<ApiResponse<null>>} API response
 */
export const adminDeleteCategory = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/admin/news-categories/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Get all events
 * @param {Object} params - Query parameters (isActive, page, limit)
 * @returns {Promise<ApiResponse<Event[]>>} API response with events and pagination
 */
export const adminGetAllEvents = async (params: {
  isActive?: boolean;
  page?: number;
  limit?: number;
} = {}): Promise<ApiResponse<Event[]>> => {
  try {
    const response = await api.get('/admin/events', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Create new event
 * @param {Object} data - Event data
 * @returns {Promise<ApiResponse<Event>>} API response with created event
 */
export const adminCreateEvent = async (data: {
  title: BilingualContent;
  description: BilingualContent;
  location: BilingualContent;
  eventDate: string;
  eventTime: string;
  isActive?: boolean;
}): Promise<ApiResponse<Event>> => {
  try {
    const response = await api.post('/admin/events', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Update event
 * @param {string} id - Event ID
 * @param {Object} data - Updated event data
 * @returns {Promise<ApiResponse<Event>>} API response with updated event
 */
export const adminUpdateEvent = async (
  id: string,
  data: Partial<{
    title: BilingualContent;
    description: BilingualContent;
    location: BilingualContent;
    eventDate: string;
    eventTime: string;
    isActive: boolean;
  }>
): Promise<ApiResponse<Event>> => {
  try {
    const response = await api.put(`/admin/events/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Delete event
 * @param {string} id - Event ID
 * @returns {Promise<ApiResponse<null>>} API response
 */
export const adminDeleteEvent = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/admin/events/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Get news statistics for dashboard
 * @returns {Promise<ApiResponse<NewsStats>>} API response with comprehensive statistics
 */
export const adminGetNewsStats = async (): Promise<ApiResponse<NewsStats>> => {
  try {
    const response = await api.get('/admin/news/stats');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// =====================
// Weather Alert Services
// =====================

/**
 * Weather Alert interface
 */
export interface WeatherAlert {
  _id: string;
  title: BilingualContent;
  message: BilingualContent;
  alertType: 'warning' | 'info' | 'severe' | 'advisory';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate: string;
  isActive: boolean;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Weather Alert Statistics interface
 */
export interface WeatherAlertStats {
  total: number;
  active: number;
  inactive: number;
  critical: number;
}

/**
 * Public: Get current weather alert
 * @returns {Promise<ApiResponse<WeatherAlert | null>>} API response
 */
export const getCurrentWeatherAlert = async (): Promise<ApiResponse<WeatherAlert | null>> => {
  try {
    const response = await api.get('/weather/current');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Public: Get all active weather alerts
 * @returns {Promise<ApiResponse<WeatherAlert[]>>} API response
 */
export const getActiveWeatherAlerts = async (): Promise<ApiResponse<WeatherAlert[]>> => {
  try {
    const response = await api.get('/weather/alerts');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Get all weather alerts
 * @param {Object} params - Query parameters
 * @returns {Promise<ApiResponse<WeatherAlert[]>>} API response
 */
export const adminGetAllWeatherAlerts = async (params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
  alertType?: string;
}): Promise<ApiResponse<WeatherAlert[]>> => {
  try {
    const response = await api.get('/admin/weather-alerts', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Create weather alert
 * @param {Object} data - Weather alert data
 * @returns {Promise<ApiResponse<WeatherAlert>>} API response
 */
export const adminCreateWeatherAlert = async (data: Partial<WeatherAlert>): Promise<ApiResponse<WeatherAlert>> => {
  try {
    const response = await api.post('/admin/weather-alerts', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Update weather alert
 * @param {string} id - Weather alert ID
 * @param {Object} data - Updated weather alert data
 * @returns {Promise<ApiResponse<WeatherAlert>>} API response
 */
export const adminUpdateWeatherAlert = async (id: string, data: Partial<WeatherAlert>): Promise<ApiResponse<WeatherAlert>> => {
  try {
    const response = await api.put(`/admin/weather-alerts/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Delete weather alert
 * @param {string} id - Weather alert ID
 * @returns {Promise<ApiResponse<null>>} API response
 */
export const adminDeleteWeatherAlert = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/admin/weather-alerts/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Get weather alert statistics
 * @returns {Promise<ApiResponse<WeatherAlertStats>>} API response
 */
export const adminGetWeatherAlertStats = async (): Promise<ApiResponse<WeatherAlertStats>> => {
  try {
    const response = await api.get('/admin/weather-alerts/stats');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Export types for use in components
export type {
  BilingualContent,
  NewsCategory,
  NewsArticle,
  Event,
  WeatherAlert,
  WeatherAlertStats,
  PaginationInfo,
  ApiResponse,
  NewsStats
};
