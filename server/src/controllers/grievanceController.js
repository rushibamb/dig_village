const Grievance = require('../models/grievanceModel');
const Worker = require('../models/workerModel');

// @desc    Submit a new grievance
// @route   POST /api/grievances
// @access  Private
const submitGrievance = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      location,
      photos
    } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

    // Create new grievance
    const grievance = await Grievance.create({
      title,
      description,
      category,
      priority,
      location,
      photos: photos || [],
      submittedBy: req.user._id,
      adminStatus: 'Unapproved',
      progressStatus: 'Pending'
    });

    // Populate submitter information
    await grievance.populate('submittedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully',
      data: grievance
    });
  } catch (error) {
    console.error('Error submitting grievance:', error);
    
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

// @desc    Get grievances for the logged-in user
// @route   GET /api/grievances/my-grievances
// @access  Private
const getMyGrievances = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    
    // Build query object for user's grievances
    const query = { submittedBy: req.user._id };
    
    // Add status filter
    if (status) {
      query.progressStatus = status;
    }
    
    // Add category filter
    if (category) {
      query.category = category;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const grievances = await Grievance.find(query)
      .populate('submittedBy', 'name email')
      .populate('assignedWorker', 'name department phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Grievance.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: grievances,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching user grievances:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get public grievances (approved by admin)
// @route   GET /api/grievances/public
// @access  Public
const getPublicGrievances = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, priority } = req.query;
    
    // Build query object for approved grievances only
    const query = { adminStatus: 'Approved' };
    
    // Add category filter
    if (category) {
      query.category = category;
    }
    
    // Add progress status filter
    if (status) {
      query.progressStatus = status;
    }
    
    // Add priority filter
    if (priority) {
      query.priority = priority;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const grievances = await Grievance.find(query)
      .populate('submittedBy', 'name') // Only show name for public grievances
      .populate('assignedWorker', 'name department')
      .select('-description -photos') // Exclude sensitive information for public view
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Grievance.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: grievances,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching public grievances:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get grievance statistics
// @route   GET /api/grievances/stats
// @access  Public
const getGrievanceStats = async (req, res) => {
  try {
    const [total, resolved, inProgress, pending] = await Promise.all([
      Grievance.countDocuments(),
      Grievance.countDocuments({ progressStatus: 'Resolved' }),
      Grievance.countDocuments({ progressStatus: 'In-progress' }),
      Grievance.countDocuments({ progressStatus: 'Pending' })
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        resolved,
        inProgress,
        pending
      }
    });
  } catch (error) {
    console.error('Error fetching grievance stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  submitGrievance,
  getMyGrievances,
  getPublicGrievances,
  getGrievanceStats
};
