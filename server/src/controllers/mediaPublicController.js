const MediaItem = require('../models/mediaItemModel');
const MediaCategory = require('../models/mediaCategoryModel');

// @desc    Get all public media items with filtering
// @route   GET /api/media
// @access  Public
const getPublicMedia = async (req, res) => {
  try {
    const { mediaType, category, page = 1, limit = 12, featured } = req.query;

    // Build filter object
    const filter = {};
    
    if (mediaType) {
      filter.mediaType = mediaType;
    }
    
    if (category) {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    const skip = (page - 1) * limit;

    const mediaItems = await MediaItem.find(filter)
      .populate('category', 'name')
      .populate('uploadedBy', 'name')
      .select('-uploadedBy.email') // Don't expose email in public API
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MediaItem.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: mediaItems,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all public media categories
// @route   GET /api/media/categories
// @access  Public
const getPublicCategories = async (req, res) => {
  try {
    const categories = await MediaCategory.find()
      .sort({ 'name.en': 1 });

    // Add media count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const mediaCount = await MediaItem.countDocuments({ category: category._id });
        return {
          ...category.toObject(),
          mediaCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Increment views for a media item
// @route   PATCH /api/media/:id/view
// @access  Public
const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;

    const mediaItem = await MediaItem.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('category', 'name').populate('uploadedBy', 'name');

    if (!mediaItem) {
      return res.status(404).json({
        success: false,
        message: 'Media item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: mediaItem._id,
        views: mediaItem.views
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Increment likes for a media item
// @route   PATCH /api/media/:id/like
// @access  Public
const incrementLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const mediaItem = await MediaItem.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    ).populate('category', 'name').populate('uploadedBy', 'name');

    if (!mediaItem) {
      return res.status(404).json({
        success: false,
        message: 'Media item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: mediaItem._id,
        likes: mediaItem.likes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get a single media item by ID (public view)
// @route   GET /api/media/:id
// @access  Public
const getMediaItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const mediaItem = await MediaItem.findById(id)
      .populate('category', 'name')
      .populate('uploadedBy', 'name')
      .select('-uploadedBy.email'); // Don't expose email in public API

    if (!mediaItem) {
      return res.status(404).json({
        success: false,
        message: 'Media item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: mediaItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getPublicMedia,
  getPublicCategories,
  incrementViews,
  incrementLikes,
  getMediaItemById
};
