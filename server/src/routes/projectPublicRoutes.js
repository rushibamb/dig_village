const express = require('express');
const router = express.Router();
const {
  getPublicProjects,
  getPublicProjectById,
  getProjectsByDepartment,
  searchProjects,
  getRecentProjects,
  getPublicProjectStats
} = require('../controllers/projectPublicController');

// @route   GET /api/projects
// @desc    Get all public projects with optional status filtering
// @access  Public
router.get('/', getPublicProjects);

// @route   GET /api/projects/stats
// @desc    Get public project statistics
// @access  Public
router.get('/stats', getPublicProjectStats);

// @route   GET /api/projects/recent
// @desc    Get recent projects (last 10)
// @access  Public
router.get('/recent', getRecentProjects);

// @route   GET /api/projects/search
// @desc    Search projects by title or department
// @access  Public
router.get('/search', searchProjects);

// @route   GET /api/projects/department/:department
// @desc    Get projects by department
// @access  Public
router.get('/department/:department', getProjectsByDepartment);

// @route   GET /api/projects/:id
// @desc    Get a single public project by ID
// @access  Public
router.get('/:id', getPublicProjectById);

module.exports = router;

