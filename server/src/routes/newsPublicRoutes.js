const express = require('express');
const router = express.Router();
const {
  getAllPublishedNews,
  getPublicCategories,
  getUpcomingEvents,
  getBreakingNews,
  getNewsArticleById
} = require('../controllers/newsPublicController');

// @route   GET /api/news
// @desc    Public: Get all published news articles
// @access  Public
router.get('/', getAllPublishedNews);

// @route   GET /api/news/categories
// @desc    Public: Get all news categories
// @access  Public
router.get('/categories', getPublicCategories);

// @route   GET /api/news/events/upcoming
// @desc    Public: Get upcoming events
// @access  Public
router.get('/events/upcoming', getUpcomingEvents);

// @route   GET /api/news/breaking
// @desc    Public: Get breaking news
// @access  Public
router.get('/breaking', getBreakingNews);

// @route   GET /api/news/:id
// @desc    Public: Get news article by ID and increment read count
// @access  Public
router.get('/:id', getNewsArticleById);

module.exports = router;

