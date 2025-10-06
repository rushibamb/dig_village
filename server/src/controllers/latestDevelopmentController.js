const LatestDevelopment = require('../models/latestDevelopmentModel');

// ==================== ADMIN CONTROLLERS ====================

// Get all latest developments (admin)
const adminGetAllLatestDevelopments = async (req, res) => {
  try {
    const latestDevelopments = await LatestDevelopment.find({})
      .sort({ priority: -1, publishDate: -1, createdAt: -1 });

    res.json({
      success: true,
      message: 'Latest developments retrieved successfully',
      data: latestDevelopments
    });
  } catch (error) {
    console.error('Error fetching latest developments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest developments',
      error: error.message
    });
  }
};

// Create new latest development (admin)
const adminCreateLatestDevelopment = async (req, res) => {
  try {
    const { title, description, imageUrl, category, publishDate, isActive, isFeatured, priority } = req.body;

    // Validate required fields
    if (!title || !title.en || !title.mr) {
      return res.status(400).json({
        success: false,
        message: 'Title is required in both English and Marathi'
      });
    }

    if (!description || !description.en || !description.mr) {
      return res.status(400).json({
        success: false,
        message: 'Description is required in both English and Marathi'
      });
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    if (!category || !category.en || !category.mr) {
      return res.status(400).json({
        success: false,
        message: 'Category is required in both English and Marathi'
      });
    }

    const latestDevelopment = await LatestDevelopment.create({
      title,
      description,
      imageUrl,
      category,
      publishDate: publishDate || new Date(),
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      priority: priority || 0
    });

    res.status(201).json({
      success: true,
      message: 'Latest development created successfully',
      data: latestDevelopment
    });
  } catch (error) {
    console.error('Error creating latest development:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create latest development',
      error: error.message
    });
  }
};

// Get latest development by ID (admin)
const adminGetLatestDevelopmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const latestDevelopment = await LatestDevelopment.findById(id);

    if (!latestDevelopment) {
      return res.status(404).json({
        success: false,
        message: 'Latest development not found'
      });
    }

    res.json({
      success: true,
      message: 'Latest development retrieved successfully',
      data: latestDevelopment
    });
  } catch (error) {
    console.error('Error fetching latest development:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest development',
      error: error.message
    });
  }
};

// Update latest development (admin)
const adminUpdateLatestDevelopment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, category, publishDate, isActive, isFeatured, priority } = req.body;

    // Validate required fields
    if (!title || !title.en || !title.mr) {
      return res.status(400).json({
        success: false,
        message: 'Title is required in both English and Marathi'
      });
    }

    if (!description || !description.en || !description.mr) {
      return res.status(400).json({
        success: false,
        message: 'Description is required in both English and Marathi'
      });
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    if (!category || !category.en || !category.mr) {
      return res.status(400).json({
        success: false,
        message: 'Category is required in both English and Marathi'
      });
    }

    const latestDevelopment = await LatestDevelopment.findByIdAndUpdate(
      id,
      {
        title,
        description,
        imageUrl,
        category,
        publishDate,
        isActive,
        isFeatured,
        priority
      },
      { new: true, runValidators: true }
    );

    if (!latestDevelopment) {
      return res.status(404).json({
        success: false,
        message: 'Latest development not found'
      });
    }

    res.json({
      success: true,
      message: 'Latest development updated successfully',
      data: latestDevelopment
    });
  } catch (error) {
    console.error('Error updating latest development:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update latest development',
      error: error.message
    });
  }
};

// Delete latest development (admin)
const adminDeleteLatestDevelopment = async (req, res) => {
  try {
    const { id } = req.params;

    const latestDevelopment = await LatestDevelopment.findByIdAndDelete(id);

    if (!latestDevelopment) {
      return res.status(404).json({
        success: false,
        message: 'Latest development not found'
      });
    }

    res.json({
      success: true,
      message: 'Latest development deleted successfully',
      data: latestDevelopment
    });
  } catch (error) {
    console.error('Error deleting latest development:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete latest development',
      error: error.message
    });
  }
};

// Toggle latest development status (admin)
const adminToggleLatestDevelopmentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const latestDevelopment = await LatestDevelopment.findById(id);

    if (!latestDevelopment) {
      return res.status(404).json({
        success: false,
        message: 'Latest development not found'
      });
    }

    latestDevelopment.isActive = !latestDevelopment.isActive;
    await latestDevelopment.save();

    res.json({
      success: true,
      message: `Latest development ${latestDevelopment.isActive ? 'activated' : 'deactivated'} successfully`,
      data: latestDevelopment
    });
  } catch (error) {
    console.error('Error toggling latest development status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle latest development status',
      error: error.message
    });
  }
};

// Toggle featured status (admin)
const adminToggleFeaturedStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const latestDevelopment = await LatestDevelopment.findById(id);

    if (!latestDevelopment) {
      return res.status(404).json({
        success: false,
        message: 'Latest development not found'
      });
    }

    latestDevelopment.isFeatured = !latestDevelopment.isFeatured;
    await latestDevelopment.save();

    res.json({
      success: true,
      message: `Latest development ${latestDevelopment.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: latestDevelopment
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle featured status',
      error: error.message
    });
  }
};

// ==================== PUBLIC CONTROLLERS ====================

// Get all active latest developments (public)
const getPublicLatestDevelopments = async (req, res) => {
  try {
    const { limit = 10, featured } = req.query;
    
    let query = { isActive: true };
    
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const latestDevelopments = await LatestDevelopment.find(query)
      .sort({ priority: -1, publishDate: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      message: 'Latest developments retrieved successfully',
      data: latestDevelopments
    });
  } catch (error) {
    console.error('Error fetching public latest developments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest developments',
      error: error.message
    });
  }
};

module.exports = {
  // Admin functions
  adminGetAllLatestDevelopments,
  adminCreateLatestDevelopment,
  adminGetLatestDevelopmentById,
  adminUpdateLatestDevelopment,
  adminDeleteLatestDevelopment,
  adminToggleLatestDevelopmentStatus,
  adminToggleFeaturedStatus,
  
  // Public functions
  getPublicLatestDevelopments
};
