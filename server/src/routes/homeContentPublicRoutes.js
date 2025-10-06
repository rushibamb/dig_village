const express = require('express');
const router = express.Router();
const { getPublicFacilities, getPublicAchievements } = require('../controllers/homeContentPublicController');
const { getPublicSiteSettings } = require('../controllers/siteSettingsPublicController');
const { getPublicLatestDevelopments } = require('../controllers/latestDevelopmentController');

// @route   GET /api/homepage/facilities
// @desc    Public: Get all facilities
// @access  Public
router.get('/facilities', getPublicFacilities);

// @route   GET /api/homepage/achievements
// @desc    Public: Get all achievements
// @access  Public
router.get('/achievements', getPublicAchievements);

// @route   GET /api/homepage/site-settings
// @desc    Public: Get site settings
// @access  Public
router.get('/site-settings', getPublicSiteSettings);

// @route   GET /api/homepage/latest-developments
// @desc    Public: Get all active latest developments
// @access  Public
router.get('/latest-developments', getPublicLatestDevelopments);

module.exports = router;
