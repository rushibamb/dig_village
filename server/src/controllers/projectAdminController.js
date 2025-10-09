const Project = require('../models/projectModel');

// @desc    Create a new project
// @route   POST /api/admin/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const projectData = req.body;

    // Validate required fields based on status
    const { status } = projectData;
    
    if (!status || !['Tender', 'Ongoing', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: Tender, Ongoing, Completed'
      });
    }

    // Create the project
    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
};

// @desc    Get all projects with optional status filtering
// @route   GET /api/admin/projects?status=Tender|Ongoing|Completed
// @access  Private/Admin
const getAllProjects = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build filter object
    const filter = {};
    if (status && ['Tender', 'Ongoing', 'Completed'].includes(status)) {
      filter.status = status;
    }

    // Get projects with filtering
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
};

// @desc    Get a single project by ID
// @route   GET /api/admin/projects/:id
// @access  Private/Admin
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
};

// @desc    Update a project
// @route   PUT /api/admin/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Validate status if provided
    const { status } = req.body;
    if (status && !['Tender', 'Ongoing', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: Tender, Ongoing, Completed'
      });
    }

    // Clean the update data to remove fields that shouldn't be updated for certain statuses
    const updateData = { ...req.body };
    
    // If updating to Ongoing or Completed, remove Tender-specific required fields if they're empty
    if (status === 'Ongoing' || status === 'Completed') {
      if (!updateData.description || (!updateData.description.en && !updateData.description.mr)) {
        delete updateData.description;
      }
      if (!updateData.tenderNoticeUrl) {
        delete updateData.tenderNoticeUrl;
      }
    }

    console.log('Updating project with data:', JSON.stringify(updateData, null, 2));

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Project update error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
};

// @desc    Delete a project
// @route   DELETE /api/admin/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/admin/projects/stats
// @access  Private/Admin
const getProjectStats = async (req, res) => {
  try {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalBudget: { $sum: '$allocatedBudget' },
          avgProgress: { $avg: '$progress' }
        }
      }
    ]);

    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    const ongoingProjects = await Project.countDocuments({ status: 'Ongoing' });
    const tenderProjects = await Project.countDocuments({ status: 'Tender' });

    res.status(200).json({
      success: true,
      data: {
        total: totalProjects,
        tender: tenderProjects,
        ongoing: ongoingProjects,
        completed: completedProjects,
        statusBreakdown: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project statistics',
      error: error.message
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectStats
};

