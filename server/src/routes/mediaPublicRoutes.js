const express = require('express');
const router = express.Router();
const {
  getPublicMedia,
  getPublicCategories,
  incrementViews,
  incrementLikes,
  getMediaItemById
} = require('../controllers/mediaPublicController');

// @route   GET /api/media
// @desc    Get all public media items with optional filtering
// @access  Public
router.get('/', getPublicMedia);

// @route   GET /api/media/categories
// @desc    Get all public media categories
// @access  Public
router.get('/categories', getPublicCategories);

// @route   GET /api/media/:id
// @desc    Get a single media item by ID (public view)
// @access  Public
router.get('/:id', getMediaItemById);

// @route   PATCH /api/media/:id/view
// @desc    Increment views for a media item
// @access  Public
router.patch('/:id/view', incrementViews);

// @route   PATCH /api/media/:id/like
// @desc    Increment likes for a media item
// @access  Public
router.patch('/:id/like', incrementLikes);

module.exports = router;
