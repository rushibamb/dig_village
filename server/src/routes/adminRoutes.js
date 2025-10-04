const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  adminGetAllVillagers,
  adminAddVillager,
  adminUpdateVillagerStatus,
  adminEditVillager,
  exportVillagersToCsv
} = require('../controllers/villagerController');

// Import Worker Management controllers
const {
  addWorker,
  getAllWorkers,
  updateWorker,
  deleteWorker
} = require('../controllers/workerController');

// Import Admin Grievance Management controllers
const {
  adminGetAllGrievances,
  adminGetGrievanceById,
  adminUpdateAdminStatus,
  adminAssignWorker,
  adminUpdateProgressStatus,
  adminUpdateProgressAndPhotos
} = require('../controllers/adminGrievanceController');

// Import News Management controllers
const {
  createNewsArticle,
  getAllNewsArticles,
  getNewsArticleById,
  updateNewsArticle,
  deleteNewsArticle,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getNewsStats
} = require('../controllers/newsAdminController');

// Import Weather Admin controllers
const {
  createWeatherAlert,
  getAllWeatherAlerts,
  getWeatherAlertById,
  updateWeatherAlert,
  deleteWeatherAlert,
  getWeatherAlertStats
} = require('../controllers/weatherAdminController');

// Import Committee Admin controllers
const {
  createCommitteeMember,
  getAllCommitteeMembers,
  updateCommitteeMember,
  deleteCommitteeMember,
  exportMembersToCsv,
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
  getOfficeInfo,
  updateOfficeInfo
} = require('../controllers/committeeAdminController');


// @route   GET /api/admin/villagers
// @desc    Admin: Get all villagers with search and filter
// @access  Private/Admin
router.get('/villagers', protect, admin, adminGetAllVillagers);

// @route   POST /api/admin/villagers
// @desc    Admin: Add new villager directly
// @access  Private/Admin
router.post('/villagers', protect, admin, adminAddVillager);

// @route   PATCH /api/admin/villagers/:id/status
// @desc    Admin: Update villager status
// @access  Private/Admin
router.patch('/villagers/:id/status', protect, admin, adminUpdateVillagerStatus);

// @route   PUT /api/admin/villagers/:id
// @desc    Admin: Edit villager information
// @access  Private/Admin
router.put('/villagers/:id', protect, admin, adminEditVillager);

// @route   GET /api/admin/villagers/export
// @desc    Admin: Export approved villagers to CSV
// @access  Private/Admin
router.get('/villagers/export', protect, admin, exportVillagersToCsv);

// Worker Management Routes
// @route   POST /api/admin/workers
// @desc    Admin: Add new worker
// @access  Private/Admin
router.post('/workers', protect, admin, addWorker);

// @route   GET /api/admin/workers
// @desc    Admin: Get all workers with search and filter
// @access  Private/Admin
router.get('/workers', protect, admin, getAllWorkers);

// @route   PUT /api/admin/workers/:id
// @desc    Admin: Update worker information
// @access  Private/Admin
router.put('/workers/:id', protect, admin, updateWorker);

// @route   DELETE /api/admin/workers/:id
// @desc    Admin: Delete worker
// @access  Private/Admin
router.delete('/workers/:id', protect, admin, deleteWorker);

// Grievance Management Routes
// @route   GET /api/admin/grievances
// @desc    Admin: Get all grievances with filtering and searching
// @access  Private/Admin
router.get('/grievances', protect, admin, adminGetAllGrievances);

// @route   GET /api/admin/grievances/:id
// @desc    Admin: Get grievance by ID
// @access  Private/Admin
router.get('/grievances/:id', protect, admin, adminGetGrievanceById);

// @route   PATCH /api/admin/grievances/:id/admin-status
// @desc    Admin: Update grievance admin status (approve/reject)
// @access  Private/Admin
router.patch('/grievances/:id/admin-status', protect, admin, adminUpdateAdminStatus);

// @route   PATCH /api/admin/grievances/:id/assign-worker
// @desc    Admin: Assign worker to grievance
// @access  Private/Admin
router.patch('/grievances/:id/assign-worker', protect, admin, adminAssignWorker);

// @route   PATCH /api/admin/grievances/:id/progress-status
// @desc    Admin: Update grievance progress status
// @access  Private/Admin
router.patch('/grievances/:id/progress-status', protect, admin, adminUpdateProgressStatus);

// @route   PATCH /api/admin/grievances/:id/resolve
// @desc    Admin: Update grievance progress with resolution photos
// @access  Private/Admin
router.patch('/grievances/:id/resolve', protect, admin, adminUpdateProgressAndPhotos);

// =============================================
// NEWS ARTICLE MANAGEMENT
// =============================================

// @route   GET /api/admin/news
// @desc    Admin: Get all news articles with filtering and search
// @access  Private/Admin
router.get('/news', protect, admin, getAllNewsArticles);

// @route   POST /api/admin/news
// @desc    Admin: Create new news article
// @access  Private/Admin
router.post('/news', protect, admin, createNewsArticle);

// @route   GET /api/admin/news/stats
// @desc    Admin: Get news statistics for dashboard
// @access  Private/Admin
router.get('/news/stats', protect, admin, getNewsStats);

// @route   GET /api/admin/news/:id
// @desc    Admin: Get news article by ID
// @access  Private/Admin
router.get('/news/:id', protect, admin, getNewsArticleById);

// @route   PUT /api/admin/news/:id
// @desc    Admin: Update news article
// @access  Private/Admin
router.put('/news/:id', protect, admin, updateNewsArticle);

// @route   DELETE /api/admin/news/:id
// @desc    Admin: Delete news article
// @access  Private/Admin
router.delete('/news/:id', protect, admin, deleteNewsArticle);

// =============================================
// NEWS CATEGORY MANAGEMENT
// =============================================

// @route   GET /api/admin/news-categories
// @desc    Admin: Get all news categories
// @access  Private/Admin
router.get('/news-categories', protect, admin, getAllCategories);

// @route   POST /api/admin/news-categories
// @desc    Admin: Create new news category
// @access  Private/Admin
router.post('/news-categories', protect, admin, createCategory);

// @route   PUT /api/admin/news-categories/:id
// @desc    Admin: Update news category
// @access  Private/Admin
router.put('/news-categories/:id', protect, admin, updateCategory);

// @route   DELETE /api/admin/news-categories/:id
// @desc    Admin: Delete news category
// @access  Private/Admin
router.delete('/news-categories/:id', protect, admin, deleteCategory);

// =============================================
// EVENT MANAGEMENT
// =============================================

// @route   GET /api/admin/events
// @desc    Admin: Get all events with filtering
// @access  Private/Admin
router.get('/events', protect, admin, getAllEvents);

// @route   POST /api/admin/events
// @desc    Admin: Create new event
// @access  Private/Admin
router.post('/events', protect, admin, createEvent);

// @route   PUT /api/admin/events/:id
// @desc    Admin: Update event
// @access  Private/Admin
router.put('/events/:id', protect, admin, updateEvent);

// @route   DELETE /api/admin/events/:id
// @desc    Admin: Delete event
// @access  Private/Admin
router.delete('/events/:id', protect, admin, deleteEvent);

// =====================
// Weather Alert Management
// =====================

// @route   GET /api/admin/weather-alerts
// @desc    Admin: Get all weather alerts
// @access  Private/Admin
router.get('/weather-alerts', protect, admin, getAllWeatherAlerts);

// @route   GET /api/admin/weather-alerts/stats
// @desc    Admin: Get weather alert statistics
// @access  Private/Admin
router.get('/weather-alerts/stats', protect, admin, getWeatherAlertStats);

// @route   POST /api/admin/weather-alerts
// @desc    Admin: Create new weather alert
// @access  Private/Admin
router.post('/weather-alerts', protect, admin, createWeatherAlert);

// @route   GET /api/admin/weather-alerts/:id
// @desc    Admin: Get weather alert by ID
// @access  Private/Admin
router.get('/weather-alerts/:id', protect, admin, getWeatherAlertById);

// @route   PUT /api/admin/weather-alerts/:id
// @desc    Admin: Update weather alert
// @access  Private/Admin
router.put('/weather-alerts/:id', protect, admin, updateWeatherAlert);

// @route   DELETE /api/admin/weather-alerts/:id
// @desc    Admin: Delete weather alert
// @access  Private/Admin
router.delete('/weather-alerts/:id', protect, admin, deleteWeatherAlert);

// =============================================
// COMMITTEE MEMBER MANAGEMENT
// =============================================

// @route   GET /api/admin/committee-members
// @desc    Admin: Get all committee members with filtering and search
// @access  Private/Admin
router.get('/committee-members', protect, admin, getAllCommitteeMembers);

// @route   POST /api/admin/committee-members
// @desc    Admin: Create new committee member
// @access  Private/Admin
router.post('/committee-members', protect, admin, createCommitteeMember);

// @route   PUT /api/admin/committee-members/:id
// @desc    Admin: Update committee member
// @access  Private/Admin
router.put('/committee-members/:id', protect, admin, updateCommitteeMember);

// @route   DELETE /api/admin/committee-members/:id
// @desc    Admin: Delete committee member
// @access  Private/Admin
router.delete('/committee-members/:id', protect, admin, deleteCommitteeMember);

// @route   GET /api/admin/committee-members/export
// @desc    Admin: Export committee members to CSV
// @access  Private/Admin
router.get('/committee-members/export', protect, admin, exportMembersToCsv);

// =============================================
// DEPARTMENT MANAGEMENT
// =============================================

// @route   GET /api/admin/departments
// @desc    Admin: Get all departments with filtering and search
// @access  Private/Admin
router.get('/departments', protect, admin, getAllDepartments);

// @route   POST /api/admin/departments
// @desc    Admin: Create new department
// @access  Private/Admin
router.post('/departments', protect, admin, createDepartment);

// @route   PUT /api/admin/departments/:id
// @desc    Admin: Update department
// @access  Private/Admin
router.put('/departments/:id', protect, admin, updateDepartment);

// @route   DELETE /api/admin/departments/:id
// @desc    Admin: Delete department
// @access  Private/Admin
router.delete('/departments/:id', protect, admin, deleteDepartment);

// =============================================
// OFFICE INFORMATION MANAGEMENT
// =============================================

// @route   GET /api/admin/office-info
// @desc    Admin: Get office information
// @access  Private/Admin
router.get('/office-info', protect, admin, getOfficeInfo);

// @route   PUT /api/admin/office-info
// @desc    Admin: Create or update office information
// @access  Private/Admin
router.put('/office-info', protect, admin, updateOfficeInfo);

module.exports = router;

