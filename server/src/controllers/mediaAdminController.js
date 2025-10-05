const MediaItem = require('../models/mediaItemModel');
const MediaCategory = require('../models/mediaCategoryModel');

// ==================== MEDIA ITEMS CRUD ====================

// @desc    Create a new media item
// @route   POST /api/admin/media
// @access  Private/Admin
const createMediaItem = async (req, res) => {
  try {
    const {
      mediaType,
      title,
      description,
      category,
      tags,
      fileUrl,
      thumbnailUrl,
      duration,
      isFeatured
    } = req.body;

    // Validate required fields
    if (!mediaType || !title?.en || !category || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: mediaType, title.en, category, fileUrl'
      });
    }

    // Check if category exists
    const categoryExists = await MediaCategory.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID'
      });
    }

    const mediaItem = await MediaItem.create({
      mediaType,
      title,
      description,
      category,
      tags: tags || [],
      fileUrl,
      thumbnailUrl,
      duration,
      isFeatured: isFeatured || false,
      uploadedBy: req.user.id
    });

    // Populate category and uploadedBy fields
    await mediaItem.populate('category', 'name');
    await mediaItem.populate('uploadedBy', 'name email');

    res.status(201).json({
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

// @desc    Get all media items with filtering and search
// @route   GET /api/admin/media
// @access  Private/Admin
const getAllMediaItems = async (req, res) => {
  try {
    const { category, mediaType, search, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (mediaType) {
      filter.mediaType = mediaType;
    }
    
    if (search) {
      filter.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.mr': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.mr': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const mediaItems = await MediaItem.find(filter)
      .populate('category', 'name')
      .populate('uploadedBy', 'name email')
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

// @desc    Update a media item
// @route   PUT /api/admin/media/:id
// @access  Private/Admin
const updateMediaItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If category is being updated, validate it exists
    if (updateData.category) {
      const categoryExists = await MediaCategory.findById(updateData.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID'
        });
      }
    }

    const mediaItem = await MediaItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name').populate('uploadedBy', 'name email');

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

// @desc    Delete a media item
// @route   DELETE /api/admin/media/:id
// @access  Private/Admin
const deleteMediaItem = async (req, res) => {
  try {
    const { id } = req.params;

    const mediaItem = await MediaItem.findByIdAndDelete(id);

    if (!mediaItem) {
      return res.status(404).json({
        success: false,
        message: 'Media item not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Media item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ==================== MEDIA CATEGORIES CRUD ====================

// @desc    Create a new media category
// @route   POST /api/admin/media-categories
// @access  Private/Admin
const createMediaCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate required fields
    if (!name?.en || !name?.mr) {
      return res.status(400).json({
        success: false,
        message: 'Both English and Marathi names are required'
      });
    }

    // Check if category with same name already exists
    const existingCategory = await MediaCategory.findOne({
      $or: [
        { 'name.en': name.en },
        { 'name.mr': name.mr }
      ]
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await MediaCategory.create({ name });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all media categories
// @route   GET /api/admin/media-categories
// @access  Private/Admin
const getAllMediaCategories = async (req, res) => {
  try {
    const categories = await MediaCategory.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update a media category
// @route   PUT /api/admin/media-categories/:id
// @access  Private/Admin
const updateMediaCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate required fields
    if (!name?.en || !name?.mr) {
      return res.status(400).json({
        success: false,
        message: 'Both English and Marathi names are required'
      });
    }

    // Check if another category with same name already exists
    const existingCategory = await MediaCategory.findOne({
      _id: { $ne: id },
      $or: [
        { 'name.en': name.en },
        { 'name.mr': name.mr }
      ]
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await MediaCategory.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete a media category
// @route   DELETE /api/admin/media-categories/:id
// @access  Private/Admin
const deleteMediaCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category is being used by any media items
    const mediaItemsCount = await MediaItem.countDocuments({ category: id });
    if (mediaItemsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is being used by ${mediaItemsCount} media item(s)`
      });
    }

    const category = await MediaCategory.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
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
  // Media Items
  createMediaItem,
  getAllMediaItems,
  updateMediaItem,
  deleteMediaItem,
  // Media Categories
  createMediaCategory,
  getAllMediaCategories,
  updateMediaCategory,
  deleteMediaCategory
};
