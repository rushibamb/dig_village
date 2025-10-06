const Facility = require('../models/facilityModel');
const Achievement = require('../models/achievementModel');

// ==================== PUBLIC FACILITY FUNCTIONS ====================

// Get all public facilities
const getPublicFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({})
      .select('name description icon createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Facilities retrieved successfully',
      data: facilities
    });
  } catch (error) {
    console.error('Error fetching public facilities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch facilities',
      error: error.message
    });
  }
};

// ==================== PUBLIC ACHIEVEMENT FUNCTIONS ====================

// Get all public achievements
const getPublicAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({})
      .select('title description icon createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Achievements retrieved successfully',
      data: achievements
    });
  } catch (error) {
    console.error('Error fetching public achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements',
      error: error.message
    });
  }
};

module.exports = {
  getPublicFacilities,
  getPublicAchievements
};
