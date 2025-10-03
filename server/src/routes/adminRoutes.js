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

module.exports = router;

