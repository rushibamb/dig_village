const NewsArticle = require('../models/newsArticleModel');
const NewsCategory = require('../models/newsCategoryModel');
const Event = require('../models/eventModel');

// =============================================
// NEWS ARTICLE MANAGEMENT
// =============================================

// @desc    Admin: Create new news article
// @route   POST /api/admin/news
// @access  Private/Admin
const createNewsArticle = async (req, res) => {
  try {
    const {
      title,
      summary,
      content,
      category,
      priority,
      tags,
      imageUrl,
      publishDate,
      expiryDate,
      isPublished,
      isFeatured,
      isBreaking
    } = req.body;

    // Set author from authenticated user
    const author = req.user._id;

    const newsArticle = new NewsArticle({
      title,
      summary,
      content,
      category,
      priority,
      tags,
      imageUrl,
      publishDate,
      expiryDate,
      isPublished,
      isFeatured,
      isBreaking,
      author
    });

    const savedArticle = await newsArticle.save();
    
    // Populate category and author for response
    await savedArticle.populate('category', 'name icon');
    await savedArticle.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: savedArticle
    });
  } catch (error) {
    console.error('Error creating news article:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Get all news articles with filtering and search
// @route   GET /api/admin/news
// @access  Private/Admin
const getAllNewsArticles = async (req, res) => {
  try {
    const {
      search,
      category,
      priority,
      isPublished,
      isFeatured,
      isBreaking,
      page = 1,
      limit = 10
    } = req.query;

    // Build query object
    const query = {};

    // Add text search on title (both English and Marathi)
    if (search) {
      query.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.mr': { $regex: search, $options: 'i' } }
      ];
    }

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add priority filter
    if (priority) {
      query.priority = priority;
    }

    // Add status filters
    if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true';
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    if (isBreaking !== undefined) {
      query.isBreaking = isBreaking === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const articles = await NewsArticle.find(query)
      .populate('category', 'name icon')
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await NewsArticle.countDocuments(query);

    res.status(200).json({
      success: true,
      data: articles,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching news articles:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Get news article by ID
// @route   GET /api/admin/news/:id
// @access  Private/Admin
const getNewsArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await NewsArticle.findById(id)
      .populate('category', 'name icon')
      .populate('author', 'name email');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Update news article
// @route   PUT /api/admin/news/:id
// @access  Private/Admin
const updateNewsArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const article = await NewsArticle.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    // Update the article
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        article[key] = updateData[key];
      }
    });

    const updatedArticle = await article.save();
    
    // Populate category and author for response
    await updatedArticle.populate('category', 'name icon');
    await updatedArticle.populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: 'News article updated successfully',
      data: updatedArticle
    });
  } catch (error) {
    console.error('Error updating news article:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Delete news article
// @route   DELETE /api/admin/news/:id
// @access  Private/Admin
const deleteNewsArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await NewsArticle.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    await NewsArticle.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'News article deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting news article:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// =============================================
// NEWS CATEGORY MANAGEMENT
// =============================================

// @desc    Admin: Create new news category
// @route   POST /api/admin/news-categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;

    const category = new NewsCategory({
      name,
      icon
    });

    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      message: 'News category created successfully',
      data: savedCategory
    });
  } catch (error) {
    console.error('Error creating news category:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Get all news categories
// @route   GET /api/admin/news-categories
// @access  Private/Admin
const getAllCategories = async (req, res) => {
  try {
    const categories = await NewsCategory.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching news categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Update news category
// @route   PUT /api/admin/news-categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await NewsCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'News category not found'
      });
    }

    // Update the category
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        category[key] = updateData[key];
      }
    });

    const updatedCategory = await category.save();

    res.status(200).json({
      success: true,
      message: 'News category updated successfully',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating news category:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Delete news category
// @route   DELETE /api/admin/news-categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await NewsCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'News category not found'
      });
    }

    // Check if any news articles are using this category
    const articlesUsingCategory = await NewsArticle.countDocuments({ category: id });
    if (articlesUsingCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${articlesUsingCategory} news articles are using this category.`
      });
    }

    await NewsCategory.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'News category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting news category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// =============================================
// EVENT MANAGEMENT
// =============================================

// @desc    Admin: Create new event
// @route   POST /api/admin/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      eventDate,
      eventTime,
      isActive
    } = req.body;

    const event = new Event({
      title,
      description,
      location,
      eventDate,
      eventTime,
      isActive
    });

    const savedEvent = await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: savedEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Get all events
// @route   GET /api/admin/events
// @access  Private/Admin
const getAllEvents = async (req, res) => {
  try {
    const { isActive, page = 1, limit = 10 } = req.query;

    // Build query object
    const query = {};

    // Add status filter
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const events = await Event.find(query)
      .sort({ eventDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Update event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Update the event
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        event[key] = updateData[key];
      }
    });

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// =============================================
// STATISTICS
// =============================================

// @desc    Admin: Get news statistics for dashboard
// @route   GET /api/admin/news/stats
// @access  Private/Admin
const getNewsStats = async (req, res) => {
  try {
    // Get total counts
    const totalArticles = await NewsArticle.countDocuments();
    const publishedArticles = await NewsArticle.countDocuments({ isPublished: true });
    const draftArticles = await NewsArticle.countDocuments({ isPublished: false });
    const featuredArticles = await NewsArticle.countDocuments({ isFeatured: true });
    const breakingArticles = await NewsArticle.countDocuments({ isBreaking: true });
    const totalCategories = await NewsCategory.countDocuments();
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ isActive: true });

    // Get articles by priority
    const highPriorityArticles = await NewsArticle.countDocuments({ priority: 'high' });
    const mediumPriorityArticles = await NewsArticle.countDocuments({ priority: 'medium' });
    const lowPriorityArticles = await NewsArticle.countDocuments({ priority: 'low' });

    // Get recent articles (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentArticles = await NewsArticle.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get articles by category
    const articlesByCategory = await NewsArticle.aggregate([
      {
        $lookup: {
          from: 'newscategories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: '$categoryInfo'
      },
      {
        $group: {
          _id: '$categoryInfo.name.en',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        articles: {
          total: totalArticles,
          published: publishedArticles,
          draft: draftArticles,
          featured: featuredArticles,
          breaking: breakingArticles,
          recent: recentArticles,
          byPriority: {
            high: highPriorityArticles,
            medium: mediumPriorityArticles,
            low: lowPriorityArticles
          },
          byCategory: articlesByCategory
        },
        categories: {
          total: totalCategories
        },
        events: {
          total: totalEvents,
          active: activeEvents
        }
      }
    });
  } catch (error) {
    console.error('Error fetching news statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  // News Article Management
  createNewsArticle,
  getAllNewsArticles,
  getNewsArticleById,
  updateNewsArticle,
  deleteNewsArticle,
  
  // News Category Management
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  
  // Event Management
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  
  // Statistics
  getNewsStats
};







