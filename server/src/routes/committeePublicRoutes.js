const express = require('express');
const router = express.Router();
const {
  getPublicCommitteeMembers,
  getPublicDepartments,
  getPublicOfficeInfo
} = require('../controllers/committeePublicController');

// @route   GET /api/committee/members
// @desc    Get all active committee members (public)
// @access  Public
router.get('/members', getPublicCommitteeMembers);

// @route   GET /api/committee/departments
// @desc    Get all active departments (public)
// @access  Public
router.get('/departments', getPublicDepartments);

// @route   GET /api/committee/office-info
// @desc    Get office information (public)
// @access  Public
router.get('/office-info', getPublicOfficeInfo);

module.exports = router;

























