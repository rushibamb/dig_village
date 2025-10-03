const Grievance = require('../models/grievanceModel');
const Worker = require('../models/workerModel');

// @desc    Admin: Get all grievances with filtering and searching
// @route   GET /api/admin/grievances
// @access  Private/Admin
const adminGetAllGrievances = async (req, res) => {
  try {
    const { 
      search, 
      adminStatus, 
      progressStatus, 
      category, 
      priority, 
      assignedWorker,
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build query object
    const query = {};
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add status filters
    if (adminStatus) {
      query.adminStatus = adminStatus;
    }
    
    if (progressStatus) {
      query.progressStatus = progressStatus;
    }
    
    // Add category filter
    if (category) {
      query.category = category;
    }
    
    // Add priority filter
    if (priority) {
      query.priority = priority;
    }
    
    // Add assigned worker filter
    if (assignedWorker) {
      if (assignedWorker === 'unassigned') {
        query.assignedWorker = { $exists: false };
      } else {
        query.assignedWorker = assignedWorker;
      }
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
    console.error('Error fetching grievances:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Get grievance by ID
// @route   GET /api/admin/grievances/:id
// @access  Private/Admin
const adminGetGrievanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const grievance = await Grievance.findById(id)
      .populate('submittedBy', 'name email phone address')
      .populate('assignedWorker', 'name department phone email');

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    res.status(200).json({
      success: true,
      data: grievance
    });
  } catch (error) {
    console.error('Error fetching grievance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Update grievance admin status
// @route   PATCH /api/admin/grievances/:id/admin-status
// @access  Private/Admin
const adminUpdateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminStatus } = req.body;

    // Validate adminStatus value
    if (!adminStatus || !['Unapproved', 'Approved', 'Rejected'].includes(adminStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Admin status must be Unapproved, Approved, or Rejected'
      });
    }

    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    // Update admin status
    grievance.adminStatus = adminStatus;
    await grievance.save();

    // Populate the updated grievance
    await grievance.populate('submittedBy', 'name email');
    await grievance.populate('assignedWorker', 'name department phone email');

    res.status(200).json({
      success: true,
      message: `Grievance admin status updated to ${adminStatus}`,
      data: grievance
    });
  } catch (error) {
    console.error('Error updating admin status:', error);
    
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

// @desc    Admin: Assign worker to grievance
// @route   PATCH /api/admin/grievances/:id/assign-worker
// @access  Private/Admin
const adminAssignWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { workerId } = req.body;

    // Validate workerId
    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: 'Worker ID is required'
      });
    }

    // Check if grievance exists
    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    // Check if worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    // Check if worker is active
    if (worker.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign inactive worker to grievance'
      });
    }

    // Assign worker to grievance
    grievance.assignedWorker = workerId;
    
    // If grievance was previously unapproved and worker is being assigned, 
    // optionally auto-approve it (admin can override this behavior if needed)
    if (grievance.adminStatus === 'Unapproved') {
      grievance.adminStatus = 'Approved';
      grievance.progressStatus = 'In-progress';
    }
    
    await grievance.save();

    // Populate the updated grievance
    await grievance.populate('submittedBy', 'name email');
    await grievance.populate('assignedWorker', 'name department phone email');

    res.status(200).json({
      success: true,
      message: 'Worker assigned to grievance successfully',
      data: grievance
    });
  } catch (error) {
    console.error('Error assigning worker:', error);
    
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

// @desc    Admin: Update grievance progress status
// @route   PATCH /api/admin/grievances/:id/progress-status
// @access  Private/Admin
const adminUpdateProgressStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { progressStatus } = req.body;

    // Validate progressStatus value
    if (!progressStatus || !['Pending', 'In-progress', 'Resolved'].includes(progressStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Progress status must be Pending, In-progress, or Resolved'
      });
    }

    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    // Update progress status
    grievance.progressStatus = progressStatus;
    await grievance.save();

    // Populate the updated grievance
    await grievance.populate('submittedBy', 'name email');
    await grievance.populate('assignedWorker', 'name department phone email');

    res.status(200).json({
      success: true,
      message: `Grievance progress status updated to ${progressStatus}`,
      data: grievance
    });
  } catch (error) {
    console.error('Error updating progress status:', error);
    
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

// @desc    Admin: Update progress status with resolution photos
// @route   PATCH /api/admin/grievances/:id/resolve
// @access  Private/Admin
const adminUpdateProgressAndPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const { progressStatus, photos } = req.body;

    // Check if grievance exists
    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    // Update progress status
    if (progressStatus) {
      grievance.progressStatus = progressStatus;
    }

    // Add resolution photos
    if (photos && Array.isArray(photos)) {
      grievance.resolutionPhotos = [
        ...grievance.resolutionPhotos,
        ...photos
      ];
    }

    await grievance.save();

    // Populate fields for response
    await grievance.populate('submittedBy', 'name email');
    await grievance.populate('assignedWorker', 'name department phone email');

    res.status(200).json({
      success: true,
      message: 'Grievance updated successfully with resolution photos',
      data: grievance
    });
  } catch (error) {
    console.error('Error updating grievance with resolution photos:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  adminGetAllGrievances,
  adminGetGrievanceById,
  adminUpdateAdminStatus,
  adminAssignWorker,
  adminUpdateProgressStatus,
  adminUpdateProgressAndPhotos
};
