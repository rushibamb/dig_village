const Facility = require('../models/facilityModel');
const Achievement = require('../models/achievementModel');

// ==================== FACILITY CRUD OPERATIONS ====================

// Create a new facility
const createFacility = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // Validate required fields
    if (!name || !name.en || !name.mr) {
      return res.status(400).json({
        success: false,
        message: 'Facility name is required in both English and Marathi'
      });
    }

    const facility = await Facility.create({
      name,
      description: description || {},
      icon: icon || ''
    });

    res.status(201).json({
      success: true,
      message: 'Facility created successfully',
      data: facility
    });
  } catch (error) {
    console.error('Error creating facility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create facility',
      error: error.message
    });
  }
};

// Get all facilities
const getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Facilities retrieved successfully',
      data: facilities
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch facilities',
      error: error.message
    });
  }
};

// Get a single facility by ID
const getFacilityById = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await Facility.findById(id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    res.json({
      success: true,
      message: 'Facility retrieved successfully',
      data: facility
    });
  } catch (error) {
    console.error('Error fetching facility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch facility',
      error: error.message
    });
  }
};

// Update a facility
const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon } = req.body;

    // Validate required fields
    if (!name || !name.en || !name.mr) {
      return res.status(400).json({
        success: false,
        message: 'Facility name is required in both English and Marathi'
      });
    }

    const facility = await Facility.findByIdAndUpdate(
      id,
      {
        name,
        description: description || {},
        icon: icon || ''
      },
      { new: true, runValidators: true }
    );

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    res.json({
      success: true,
      message: 'Facility updated successfully',
      data: facility
    });
  } catch (error) {
    console.error('Error updating facility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update facility',
      error: error.message
    });
  }
};

// Delete a facility
const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await Facility.findByIdAndDelete(id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    res.json({
      success: true,
      message: 'Facility deleted successfully',
      data: facility
    });
  } catch (error) {
    console.error('Error deleting facility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete facility',
      error: error.message
    });
  }
};

// ==================== ACHIEVEMENT CRUD OPERATIONS ====================

// Create a new achievement
const createAchievement = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    // Validate required fields
    if (!title || !title.en || !title.mr) {
      return res.status(400).json({
        success: false,
        message: 'Achievement title is required in both English and Marathi'
      });
    }

    const achievement = await Achievement.create({
      title,
      description: description || {},
      icon: icon || ''
    });

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: achievement
    });
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create achievement',
      error: error.message
    });
  }
};

// Get all achievements
const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Achievements retrieved successfully',
      data: achievements
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements',
      error: error.message
    });
  }
};

// Get a single achievement by ID
const getAchievementById = async (req, res) => {
  try {
    const { id } = req.params;

    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      message: 'Achievement retrieved successfully',
      data: achievement
    });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement',
      error: error.message
    });
  }
};

// Update an achievement
const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon } = req.body;

    // Validate required fields
    if (!title || !title.en || !title.mr) {
      return res.status(400).json({
        success: false,
        message: 'Achievement title is required in both English and Marathi'
      });
    }

    const achievement = await Achievement.findByIdAndUpdate(
      id,
      {
        title,
        description: description || {},
        icon: icon || ''
      },
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update achievement',
      error: error.message
    });
  }
};

// Delete an achievement
const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    const achievement = await Achievement.findByIdAndDelete(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      message: 'Achievement deleted successfully',
      data: achievement
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete achievement',
      error: error.message
    });
  }
};

module.exports = {
  // Facility CRUD
  createFacility,
  getAllFacilities,
  getFacilityById,
  updateFacility,
  deleteFacility,
  
  // Achievement CRUD
  createAchievement,
  getAllAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement
};
