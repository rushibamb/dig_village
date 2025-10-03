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


module.exports = router;

