const express = require('express');
const router = express.Router();
const {
  getActiveWeatherAlerts,
  getCurrentWeatherAlert
} = require('../controllers/weatherPublicController');

// @route   GET /api/weather/current
// @desc    Get current active weather alert
// @access  Public
router.get('/current', getCurrentWeatherAlert);

// @route   GET /api/weather/alerts
// @desc    Get all active weather alerts
// @access  Public
router.get('/alerts', getActiveWeatherAlerts);

module.exports = router;



