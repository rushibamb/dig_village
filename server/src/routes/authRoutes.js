const express = require('express');
const { registerUser, loginUser, getMe, createAdminUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// @route   POST /api/auth/create-admin
// @desc    Create admin user (for development/testing)
// @access  Public (for development only)
router.post('/create-admin', createAdminUser);

module.exports = router;

