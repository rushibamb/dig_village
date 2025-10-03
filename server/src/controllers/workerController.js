const Worker = require('../models/workerModel');

// @desc    Admin: Add new worker
// @route   POST /api/admin/workers
// @access  Private/Admin
const addWorker = async (req, res) => {
  try {
    const { name, department, phone, email, status } = req.body;

    // Validate required fields
    if (!name || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name and department are required'
      });
    }

    // Create new worker
    const worker = await Worker.create({
      name,
      department,
      phone,
      email,
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Worker added successfully',
      data: worker
    });
  } catch (error) {
    console.error('Error adding worker:', error);
    
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

// @desc    Admin: Get all workers
// @route   GET /api/admin/workers
// @access  Private/Admin
const getAllWorkers = async (req, res) => {
  try {
    const { search, department, status, page = 1, limit = 10 } = req.query;
    
    // Build query object
    const query = {};
    
    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add department filter
    if (department) {
      query.department = department;
    }
    
    // Add status filter
    if (status) {
      query.status = status;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const workers = await Worker.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Worker.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: workers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Update worker
// @route   PUT /api/admin/workers/:id
// @access  Private/Admin
const updateWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department, phone, email, status } = req.body;

    // Find the worker
    const worker = await Worker.findById(id);
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    // Update worker fields
    const updateData = {};
    if (name) updateData.name = name;
    if (department) updateData.department = department;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (status) updateData.status = status;

    const updatedWorker = await Worker.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Worker updated successfully',
      data: updatedWorker
    });
  } catch (error) {
    console.error('Error updating worker:', error);
    
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

// @desc    Admin: Delete worker
// @route   DELETE /api/admin/workers/:id
// @access  Private/Admin
const deleteWorker = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the worker
    const worker = await Worker.findById(id);
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    // TODO: In production, check if worker is assigned to any grievances
    // and prevent deletion if assigned
    // const assignedGrievances = await Grievance.findOne({ assignedWorker: id });
    // if (assignedGrievances) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Cannot delete worker who is assigned to grievances'
    //   });
    // }

    await Worker.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Worker deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting worker:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  addWorker,
  getAllWorkers,
  updateWorker,
  deleteWorker
};
