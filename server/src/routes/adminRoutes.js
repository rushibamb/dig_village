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

// Import Media Admin controllers
const {
  createMediaItem,
  getAllMediaItems,
  updateMediaItem,
  deleteMediaItem,
  createMediaCategory,
  getAllMediaCategories,
  updateMediaCategory,
  deleteMediaCategory
} = require('../controllers/mediaAdminController');

// Import Home Content Admin controllers
const {
  createFacility,
  getAllFacilities,
  getFacilityById,
  updateFacility,
  deleteFacility,
  createAchievement,
  getAllAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement
} = require('../controllers/homeContentAdminController');

// Import Site Settings Admin controllers
const {
  getSiteSettings,
  updateSiteSettings,
  uploadHomeImage
} = require('../controllers/siteSettingsAdminController');

// Import Latest Development Admin controllers
const {
  adminGetAllLatestDevelopments,
  adminCreateLatestDevelopment,
  adminGetLatestDevelopmentById,
  adminUpdateLatestDevelopment,
  adminDeleteLatestDevelopment,
  adminToggleLatestDevelopmentStatus,
  adminToggleFeaturedStatus
} = require('../controllers/latestDevelopmentController');

// Import Project Admin controllers
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats
} = require('../controllers/projectAdminController');

// Import Tax Admin controllers
const {
  uploadTaxRecordsCsv,
  createTaxRecord,
  getAllTaxRecords,
  updateTaxRecord,
  deleteTaxRecord,
  markTaxRecordAsPaid,
  getTaxStats
} = require('../controllers/taxAdminController');

// Import multer for file uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for images
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Multer configuration for CSV files
const csvStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'tax-records-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const csvUpload = multer({
  storage: csvStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for CSV files
  },
  fileFilter: (req, file, cb) => {
    // Check if file is CSV by extension and common MIME types
    const allowedMimeTypes = [
      'text/csv',
      'application/csv',
      'text/plain',
      'application/vnd.ms-excel',
      'application/octet-stream'
    ];
    
    const isCsvByExtension = path.extname(file.originalname).toLowerCase() === '.csv';
    const isCsvByMimeType = allowedMimeTypes.includes(file.mimetype);
    
    console.log('File validation:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      extension: path.extname(file.originalname).toLowerCase(),
      isCsvByExtension,
      isCsvByMimeType
    });
    
    if (isCsvByExtension || isCsvByMimeType) {
      cb(null, true);
    } else {
      cb(new Error(`Only CSV files are allowed! Received: ${file.mimetype} (${file.originalname})`));
    }
  }
});


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

// =============================================
// MEDIA ITEM MANAGEMENT
// =============================================

// @route   GET /api/admin/media
// @desc    Admin: Get all media items with filtering and search
// @access  Private/Admin
router.get('/media', protect, admin, getAllMediaItems);

// @route   POST /api/admin/media
// @desc    Admin: Create new media item
// @access  Private/Admin
router.post('/media', protect, admin, createMediaItem);

// @route   PUT /api/admin/media/:id
// @desc    Admin: Update media item
// @access  Private/Admin
router.put('/media/:id', protect, admin, updateMediaItem);

// @route   DELETE /api/admin/media/:id
// @desc    Admin: Delete media item
// @access  Private/Admin
router.delete('/media/:id', protect, admin, deleteMediaItem);

// =============================================
// MEDIA CATEGORY MANAGEMENT
// =============================================

// @route   GET /api/admin/media-categories
// @desc    Admin: Get all media categories
// @access  Private/Admin
router.get('/media-categories', protect, admin, getAllMediaCategories);

// @route   POST /api/admin/media-categories
// @desc    Admin: Create new media category
// @access  Private/Admin
router.post('/media-categories', protect, admin, createMediaCategory);

// @route   PUT /api/admin/media-categories/:id
// @desc    Admin: Update media category
// @access  Private/Admin
router.put('/media-categories/:id', protect, admin, updateMediaCategory);

// @route   DELETE /api/admin/media-categories/:id
// @desc    Admin: Delete media category
// @access  Private/Admin
router.delete('/media-categories/:id', protect, admin, deleteMediaCategory);

// ==================== HOME CONTENT ADMIN ROUTES ====================

// @route   POST /api/admin/facilities
// @desc    Admin: Create new facility
// @access  Private/Admin
router.post('/facilities', protect, admin, createFacility);

// @route   GET /api/admin/facilities
// @desc    Admin: Get all facilities
// @access  Private/Admin
router.get('/facilities', protect, admin, getAllFacilities);

// @route   GET /api/admin/facilities/:id
// @desc    Admin: Get facility by ID
// @access  Private/Admin
router.get('/facilities/:id', protect, admin, getFacilityById);

// @route   PUT /api/admin/facilities/:id
// @desc    Admin: Update facility
// @access  Private/Admin
router.put('/facilities/:id', protect, admin, updateFacility);

// @route   DELETE /api/admin/facilities/:id
// @desc    Admin: Delete facility
// @access  Private/Admin
router.delete('/facilities/:id', protect, admin, deleteFacility);

// @route   POST /api/admin/achievements
// @desc    Admin: Create new achievement
// @access  Private/Admin
router.post('/achievements', protect, admin, createAchievement);

// @route   GET /api/admin/achievements
// @desc    Admin: Get all achievements
// @access  Private/Admin
router.get('/achievements', protect, admin, getAllAchievements);

// @route   GET /api/admin/achievements/:id
// @desc    Admin: Get achievement by ID
// @access  Private/Admin
router.get('/achievements/:id', protect, admin, getAchievementById);

// @route   PUT /api/admin/achievements/:id
// @desc    Admin: Update achievement
// @access  Private/Admin
router.put('/achievements/:id', protect, admin, updateAchievement);

// @route   DELETE /api/admin/achievements/:id
// @desc    Admin: Delete achievement
// @access  Private/Admin
router.delete('/achievements/:id', protect, admin, deleteAchievement);

// ==================== SITE SETTINGS ROUTES ====================

// @route   GET /api/admin/site-settings
// @desc    Admin: Get site settings
// @access  Private/Admin
router.get('/site-settings', protect, admin, getSiteSettings);

// @route   PUT /api/admin/site-settings
// @desc    Admin: Update site settings
// @access  Private/Admin
router.put('/site-settings', protect, admin, updateSiteSettings);

// @route   POST /api/admin/site-settings/upload-image
// @desc    Admin: Upload image for home content
// @access  Private/Admin
router.post('/site-settings/upload-image', protect, admin, upload.single('image'), uploadHomeImage);

// ==================== LATEST DEVELOPMENTS ROUTES ====================

// @route   GET /api/admin/latest-developments
// @desc    Admin: Get all latest developments
// @access  Private/Admin
router.get('/latest-developments', protect, admin, adminGetAllLatestDevelopments);

// @route   POST /api/admin/latest-developments
// @desc    Admin: Create new latest development
// @access  Private/Admin
router.post('/latest-developments', protect, admin, adminCreateLatestDevelopment);

// @route   GET /api/admin/latest-developments/:id
// @desc    Admin: Get latest development by ID
// @access  Private/Admin
router.get('/latest-developments/:id', protect, admin, adminGetLatestDevelopmentById);

// @route   PUT /api/admin/latest-developments/:id
// @desc    Admin: Update latest development
// @access  Private/Admin
router.put('/latest-developments/:id', protect, admin, adminUpdateLatestDevelopment);

// @route   DELETE /api/admin/latest-developments/:id
// @desc    Admin: Delete latest development
// @access  Private/Admin
router.delete('/latest-developments/:id', protect, admin, adminDeleteLatestDevelopment);

// @route   PATCH /api/admin/latest-developments/:id/toggle-status
// @desc    Admin: Toggle latest development status
// @access  Private/Admin
router.patch('/latest-developments/:id/toggle-status', protect, admin, adminToggleLatestDevelopmentStatus);

// @route   PATCH /api/admin/latest-developments/:id/toggle-featured
// @desc    Admin: Toggle featured status
// @access  Private/Admin
router.patch('/latest-developments/:id/toggle-featured', protect, admin, adminToggleFeaturedStatus);

// ==================== PROJECT MANAGEMENT ROUTES ====================

// @route   GET /api/admin/projects
// @desc    Admin: Get all projects with optional status filtering
// @access  Private/Admin
router.get('/projects', protect, admin, getAllProjects);

// @route   GET /api/admin/projects/stats
// @desc    Admin: Get project statistics for dashboard
// @access  Private/Admin
router.get('/projects/stats', protect, admin, getProjectStats);

// @route   POST /api/admin/projects
// @desc    Admin: Create new project
// @access  Private/Admin
router.post('/projects', protect, admin, createProject);

// @route   GET /api/admin/projects/:id
// @desc    Admin: Get project by ID
// @access  Private/Admin
router.get('/projects/:id', protect, admin, getProjectById);

// @route   PUT /api/admin/projects/:id
// @desc    Admin: Update project
// @access  Private/Admin
router.put('/projects/:id', protect, admin, updateProject);

// @route   DELETE /api/admin/projects/:id
// @desc    Admin: Delete project
// @access  Private/Admin
router.delete('/projects/:id', protect, admin, deleteProject);

// ==================== TAX MANAGEMENT ROUTES ====================

// @route   POST /api/admin/taxes
// @desc    Admin: Create a new tax record
// @access  Private/Admin
router.post('/taxes', protect, admin, createTaxRecord);

// @route   GET /api/admin/taxes
// @desc    Admin: Get all tax records with filtering and search
// @access  Private/Admin
router.get('/taxes', protect, admin, getAllTaxRecords);

// @route   PUT /api/admin/taxes/:id
// @desc    Admin: Update a tax record
// @access  Private/Admin
router.put('/taxes/:id', protect, admin, updateTaxRecord);

// @route   DELETE /api/admin/taxes/:id
// @desc    Admin: Delete a tax record
// @access  Private/Admin
router.delete('/taxes/:id', protect, admin, deleteTaxRecord);

// @route   PATCH /api/admin/taxes/:id/mark-paid
// @desc    Admin: Mark tax record as paid (for offline payments)
// @access  Private/Admin
router.patch('/taxes/:id/mark-paid', protect, admin, markTaxRecordAsPaid);

// @route   GET /api/admin/taxes/upload/test
// @desc    Test endpoint to verify server is working
// @access  Private/Admin
router.get('/taxes/upload/test', protect, admin, (req, res) => {
  res.json({ success: true, message: 'Tax upload endpoint is working' });
});

// @route   POST /api/admin/taxes/upload
// @desc    Admin: Upload tax records via CSV file
// @access  Private/Admin
router.post('/taxes/upload', protect, admin, (req, res, next) => {
  console.log('=== Multer Middleware Debug ===');
  console.log('Request headers:', req.headers);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Request body keys:', Object.keys(req.body || {}));
  console.log('Request file before multer:', req.file);
  
  csvUpload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: 'File upload error: ' + err.message
      });
    }
    console.log('Multer success, file:', req.file);
    next();
  });
}, uploadTaxRecordsCsv);

module.exports = router;

