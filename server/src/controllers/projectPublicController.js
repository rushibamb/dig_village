const Project = require('../models/projectModel');

// @desc    Get all public projects with optional status filtering
// @route   GET /api/projects?status=Tender|Ongoing|Completed
// @access  Public
const getPublicProjects = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build filter object
    const filter = {};
    if (status && ['Tender', 'Ongoing', 'Completed'].includes(status)) {
      filter.status = status;
    }

    // Get projects with filtering, sorted by creation date (newest first)
    const projects = await Project.find(filter)
      .select('-__v') // Exclude version field
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

// @desc    Get a single public project by ID
// @route   GET /api/projects/:id
// @access  Public
const getPublicProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .select('-__v'); // Exclude version field

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

// @desc    Get projects by department
// @route   GET /api/projects/department/:department
// @access  Public
const getProjectsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const { status } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Filter by department (case insensitive search in both English and Marathi)
    filter.$or = [
      { 'department.en': { $regex: department, $options: 'i' } },
      { 'department.mr': { $regex: department, $options: 'i' } }
    ];
    
    if (status && ['Tender', 'Ongoing', 'Completed'].includes(status)) {
      filter.status = status;
    }

    const projects = await Project.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects by department',
      error: error.message
    });
  }
};

// @desc    Search projects by title
// @route   GET /api/projects/search?q=searchTerm
// @access  Public
const searchProjects = async (req, res) => {
  try {
    const { q } = req.query;
    const { status } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Build filter object for text search
    const filter = {
      $or: [
        { 'title.en': { $regex: q, $options: 'i' } },
        { 'title.mr': { $regex: q, $options: 'i' } },
        { 'department.en': { $regex: q, $options: 'i' } },
        { 'department.mr': { $regex: q, $options: 'i' } }
      ]
    };
    
    if (status && ['Tender', 'Ongoing', 'Completed'].includes(status)) {
      filter.status = status;
    }

    const projects = await Project.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      query: q,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search projects',
      error: error.message
    });
  }
};

// @desc    Get recent projects (last 10)
// @route   GET /api/projects/recent
// @access  Public
const getRecentProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent projects',
      error: error.message
    });
  }
};

// @desc    Get project statistics for public view
// @route   GET /api/projects/stats
// @access  Public
const getPublicProjectStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    const ongoingProjects = await Project.countDocuments({ status: 'Ongoing' });
    const tenderProjects = await Project.countDocuments({ status: 'Tender' });

    // Calculate completion rate
    const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        total: totalProjects,
        tender: tenderProjects,
        ongoing: ongoingProjects,
        completed: completedProjects,
        completionRate: Math.round(completionRate * 100) / 100 // Round to 2 decimal places
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
  getPublicProjects,
  getPublicProjectById,
  getProjectsByDepartment,
  searchProjects,
  getRecentProjects,
  getPublicProjectStats
};

