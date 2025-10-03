const express = require('express');
const { submitGrievance, getMyGrievances, getPublicGrievances, getGrievanceStats } = require('../controllers/grievanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/grievances
// @desc    Submit a new grievance
// @access  Private
router.post('/', protect, submitGrievance);

// @route   GET /api/grievances/my-grievances
// @desc    Get grievances for the logged-in user
// @access  Private
router.get('/my-grievances', protect, getMyGrievances);

// @route   GET /api/grievances/public
// @desc    Get public grievances (approved by admin)
// @access  Public
router.get('/public', getPublicGrievances);

// @route   GET /api/grievances/stats
// @desc    Get grievance statistics
// @access  Public
router.get('/stats', getGrievanceStats);

module.exports = router;
