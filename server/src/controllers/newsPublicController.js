const NewsArticle = require('../models/newsArticleModel');
const NewsCategory = require('../models/newsCategoryModel');
const Event = require('../models/eventModel');

// @desc    Public: Get all published news articles
// @route   GET /api/news
// @access  Public
const getAllPublishedNews = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const currentDate = new Date();

    // Build query object for published and active articles
    const query = {
      isPublished: true,
      publishDate: { $lte: currentDate }, // Published date is in the past
      $or: [
        { expiryDate: null }, // No expiry date
        { expiryDate: { $gt: currentDate } } // Expiry date is in the future
      ]
    };

    // Add category filter if provided
    if (category && category !== 'all') {
      query.category = category;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const articles = await NewsArticle.find(query)
      .populate('category', 'name icon')
      .populate('author', 'name')
      .sort({ publishDate: -1 }) // Sort by most recent publish date
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
    console.error('Error fetching published news:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Public: Get all news categories
// @route   GET /api/news/categories
// @access  Public
const getPublicCategories = async (req, res) => {
  try {
    const categories = await NewsCategory.find()
      .sort({ 'name.en': 1 }); // Sort alphabetically by English name

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

// @desc    Public: Get upcoming events
// @route   GET /api/news/events/upcoming
// @access  Public
const getUpcomingEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentDate = new Date();

    // Build query for active events on or after current date
    const query = {
      isActive: true,
      eventDate: { $gte: currentDate }
    };

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const events = await Event.find(query)
      .sort({ eventDate: 1 }) // Sort by upcoming date (earliest first)
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
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Public: Get breaking news
// @route   GET /api/news/breaking
// @access  Public
const getBreakingNews = async (req, res) => {
  try {
    const currentDate = new Date();

    // Find the most recent breaking news article
    const breakingArticle = await NewsArticle.findOne({
      isBreaking: true,
      isPublished: true,
      publishDate: { $lte: currentDate }, // Published date is in the past
      $or: [
        { expiryDate: null }, // No expiry date
        { expiryDate: { $gt: currentDate } } // Expiry date is in the future
      ]
    })
      .populate('category', 'name icon')
      .populate('author', 'name')
      .sort({ publishDate: -1 }); // Get the most recent one

    if (!breakingArticle) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No breaking news available'
      });
    }

    res.status(200).json({
      success: true,
      data: breakingArticle
    });
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Public: Get news article by ID and increment read count
// @route   GET /api/news/:id
// @access  Public
const getNewsArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = new Date();

    // Find the article and ensure it's published and active
    const article = await NewsArticle.findOne({
      _id: id,
      isPublished: true,
      publishDate: { $lte: currentDate }, // Published date is in the past
      $or: [
        { expiryDate: null }, // No expiry date
        { expiryDate: { $gt: currentDate } } // Expiry date is in the future
      ]
    })
      .populate('category', 'name icon')
      .populate('author', 'name');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'News article not found or not available'
      });
    }

    // Increment read count
    article.readCount += 1;
    await article.save();

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error fetching news article:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllPublishedNews,
  getPublicCategories,
  getUpcomingEvents,
  getBreakingNews,
  getNewsArticleById
};
