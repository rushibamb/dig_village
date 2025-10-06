import api from './api';

// Type definitions for better TypeScript support
interface BilingualContent {
  en: string;
  mr: string;
}

interface Document {
  name: string;
  url: string;
}

interface TimelinePhase {
  phase: BilingualContent;
  date: string;
  completed: boolean;
}

interface Deliverable {
  item: BilingualContent;
  value: string;
}

interface Project {
  _id: string;
  title: BilingualContent;
  status: 'Tender' | 'Ongoing' | 'Completed';
  
  // Tender Phase Fields
  department: BilingualContent;
  estimatedBudget: number;
  issueDate: string;
  lastDate: string;
  contactName: BilingualContent;
  contactPhone: string;
  tenderDocuments: Document[];
  
  // Ongoing Phase Fields
  contractor?: BilingualContent;
  allocatedBudget?: number;
  startDate?: string;
  expectedCompletionDate?: string;
  progress?: number;
  currentPhase?: BilingualContent;
  sitePhotos: string[];
  projectDocuments: Document[];
  timeline: TimelinePhase[];
  
  // Completed Phase Fields
  totalCost?: number;
  completionDate?: string;
  finalPhotos: string[];
  rating?: number;
  summary?: BilingualContent;
  deliverables: Deliverable[];
  completionReportUrl?: string;
  
  // Virtual fields
  duration?: number;
  budgetVariance?: number;
  
  createdAt: string;
  updatedAt: string;
}

interface ProjectStats {
  total: number;
  tender: number;
  ongoing: number;
  completed: number;
  statusBreakdown: Array<{
    _id: string;
    count: number;
    totalBudget: number;
    avgProgress: number;
  }>;
}

interface PublicProjectStats {
  total: number;
  tender: number;
  ongoing: number;
  completed: number;
  completionRate: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

interface ProjectParams {
  status?: 'Tender' | 'Ongoing' | 'Completed';
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
}

interface CreateProjectData {
  title: BilingualContent;
  status: 'Tender' | 'Ongoing' | 'Completed';
  department: BilingualContent;
  estimatedBudget: number;
  issueDate: string;
  lastDate: string;
  contactName: BilingualContent;
  contactPhone: string;
  tenderDocuments?: Document[];
  contractor?: BilingualContent;
  allocatedBudget?: number;
  startDate?: string;
  expectedCompletionDate?: string;
  progress?: number;
  currentPhase?: BilingualContent;
  sitePhotos?: string[];
  projectDocuments?: Document[];
  timeline?: TimelinePhase[];
  totalCost?: number;
  completionDate?: string;
  finalPhotos?: string[];
  rating?: number;
  summary?: BilingualContent;
  deliverables?: Deliverable[];
  completionReportUrl?: string;
}

// =============================================
// PUBLIC PROJECT FUNCTIONS
// =============================================

/**
 * Get all public projects with optional filtering
 * @param {ProjectParams} params - Query parameters (status, page, limit, search, department)
 * @returns {Promise<ApiResponse<Project[]>>} API response with projects
 */
export const getPublicProjects = async (params: ProjectParams = {}): Promise<ApiResponse<Project[]>> => {
  try {
    const response = await api.get('/projects', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get a single public project by ID
 * @param {string} id - Project ID
 * @returns {Promise<ApiResponse<Project>>} API response with project data
 */
export const getPublicProjectById = async (id: string): Promise<ApiResponse<Project>> => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Search projects by title or department
 * @param {string} query - Search query
 * @param {Object} params - Additional parameters (status)
 * @returns {Promise<ApiResponse<Project[]>>} API response with search results
 */
export const searchProjects = async (query: string, params: { status?: string } = {}): Promise<ApiResponse<Project[]>> => {
  try {
    const response = await api.get('/projects/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get projects by department
 * @param {string} department - Department name
 * @param {Object} params - Additional parameters (status)
 * @returns {Promise<ApiResponse<Project[]>>} API response with projects
 */
export const getProjectsByDepartment = async (department: string, params: { status?: string } = {}): Promise<ApiResponse<Project[]>> => {
  try {
    const response = await api.get(`/projects/department/${department}`, { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get recent projects (last 10)
 * @returns {Promise<ApiResponse<Project[]>>} API response with recent projects
 */
export const getRecentProjects = async (): Promise<ApiResponse<Project[]>> => {
  try {
    const response = await api.get('/projects/recent');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get public project statistics
 * @returns {Promise<ApiResponse<PublicProjectStats>>} API response with statistics
 */
export const getPublicProjectStats = async (): Promise<ApiResponse<PublicProjectStats>> => {
  try {
    const response = await api.get('/projects/stats');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// =============================================
// ADMIN PROJECT FUNCTIONS
// =============================================

/**
 * Admin: Get all projects with filtering and search
 * @param {ProjectParams} params - Query parameters (status, page, limit, search, department)
 * @returns {Promise<ApiResponse<Project[]>>} API response with projects
 */
export const adminGetAllProjects = async (params: ProjectParams = {}): Promise<ApiResponse<Project[]>> => {
  try {
    const response = await api.get('/admin/projects', { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Create new project
 * @param {CreateProjectData} data - Project data
 * @returns {Promise<ApiResponse<Project>>} API response with created project
 */
export const adminCreateProject = async (data: CreateProjectData): Promise<ApiResponse<Project>> => {
  try {
    const response = await api.post('/admin/projects', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Get project by ID
 * @param {string} id - Project ID
 * @returns {Promise<ApiResponse<Project>>} API response with project data
 */
export const adminGetProjectById = async (id: string): Promise<ApiResponse<Project>> => {
  try {
    const response = await api.get(`/admin/projects/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Update project
 * @param {string} id - Project ID
 * @param {Partial<CreateProjectData>} data - Updated project data
 * @returns {Promise<ApiResponse<Project>>} API response with updated project
 */
export const adminUpdateProject = async (id: string, data: Partial<CreateProjectData>): Promise<ApiResponse<Project>> => {
  try {
    const response = await api.put(`/admin/projects/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Delete project
 * @param {string} id - Project ID
 * @returns {Promise<ApiResponse<null>>} API response
 */
export const adminDeleteProject = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/admin/projects/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/**
 * Admin: Get project statistics for dashboard
 * @returns {Promise<ApiResponse<ProjectStats>>} API response with comprehensive statistics
 */
export const adminGetProjectStats = async (): Promise<ApiResponse<ProjectStats>> => {
  try {
    const response = await api.get('/admin/projects/stats');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Export types for use in components
export type {
  BilingualContent,
  Document,
  TimelinePhase,
  Deliverable,
  Project,
  ProjectStats,
  PublicProjectStats,
  ApiResponse,
  ProjectParams,
  CreateProjectData
};

