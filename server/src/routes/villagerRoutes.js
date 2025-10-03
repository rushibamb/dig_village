const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  submitNewVillagerRequest,
  generateOtpForEdit,
  verifyOtpAndGetVillager,
  submitVillagerEditRequest,
  getVillagerStats
} = require('../controllers/villagerController');

// @route   POST /api/villagers/requests/new
// @desc    Submit new villager request
// @access  Private
router.post('/requests/new', protect, submitNewVillagerRequest);

// @route   POST /api/villagers/requests/edit/generate-otp
// @desc    Generate OTP for villager edit
// @access  Public
router.post('/requests/edit/generate-otp', generateOtpForEdit);

// @route   POST /api/villagers/requests/edit/verify-otp
// @desc    Verify OTP and get villager info for editing
// @access  Public
router.post('/requests/edit/verify-otp', verifyOtpAndGetVillager);

// @route   PUT /api/villagers/requests/edit/:id
// @desc    Submit villager edit request
// @access  Private
router.put('/requests/edit/:id', protect, submitVillagerEditRequest);

// @route   GET /api/villagers/stats
// @desc    Get villager statistics for dashboard
// @access  Public
router.get('/stats', getVillagerStats);

module.exports = router;

