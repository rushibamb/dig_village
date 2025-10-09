const CommitteeMember = require('../models/committeeMemberModel');
const Department = require('../models/departmentModel');
const OfficeInfo = require('../models/officeInfoModel');

// @desc    Get all active committee members (public)
// @route   GET /api/committee/members
// @access  Public
const getPublicCommitteeMembers = async (req, res) => {
  try {
    const committeeMembers = await CommitteeMember.find({ isActive: true })
      .select('-createdAt -updatedAt') // Exclude timestamps from public response
      .sort({ 'name.en': 1 }); // Sort by English name alphabetically
    
    res.status(200).json({
      success: true,
      count: committeeMembers.length,
      data: committeeMembers
    });
  } catch (error) {
    console.error('Error fetching public committee members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch committee members',
      error: error.message
    });
  }
};

// @desc    Get all active departments (public)
// @route   GET /api/committee/departments
// @access  Public
const getPublicDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .select('-createdAt -updatedAt') // Exclude timestamps from public response
      .sort({ 'name.en': 1 }); // Sort by English name alphabetically
    
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    console.error('Error fetching public departments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message
    });
  }
};

// @desc    Get office information (public)
// @route   GET /api/committee/office-info
// @access  Public
const getPublicOfficeInfo = async (req, res) => {
  try {
    const officeInfo = await OfficeInfo.findOne()
      .select('-createdAt -updatedAt'); // Exclude timestamps from public response
    
    if (!officeInfo) {
      return res.status(404).json({
        success: false,
        message: 'Office information not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: officeInfo
    });
  } catch (error) {
    console.error('Error fetching public office info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch office information',
      error: error.message
    });
  }
};

module.exports = {
  getPublicCommitteeMembers,
  getPublicDepartments,
  getPublicOfficeInfo
};












