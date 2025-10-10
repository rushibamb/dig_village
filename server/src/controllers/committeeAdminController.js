const CommitteeMember = require('../models/committeeMemberModel');
const Department = require('../models/departmentModel');
const OfficeInfo = require('../models/officeInfoModel');
const { Parser } = require('json2csv');

// =============================================
// COMMITTEE MEMBER MANAGEMENT
// =============================================

// @desc    Create new committee member
// @route   POST /api/admin/committee-members
// @access  Private/Admin
const createCommitteeMember = async (req, res) => {
  try {
    const committeeMember = new CommitteeMember(req.body);
    await committeeMember.save();
    
    res.status(201).json({
      success: true,
      message: 'Committee member created successfully',
      data: committeeMember
    });
  } catch (error) {
    console.error('Error creating committee member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create committee member',
      error: error.message
    });
  }
};

// @desc    Get all committee members
// @route   GET /api/admin/committee-members
// @access  Private/Admin
const getAllCommitteeMembers = async (req, res) => {
  try {
    const { active, ward, search } = req.query;
    
    // Build filter object
    let filter = {};
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    if (ward) {
      filter.ward = ward;
    }
    
    if (search) {
      filter.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.mr': { $regex: search, $options: 'i' } },
        { 'position.en': { $regex: search, $options: 'i' } },
        { 'position.mr': { $regex: search, $options: 'i' } }
      ];
    }
    
    const committeeMembers = await CommitteeMember.find(filter)
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: committeeMembers.length,
      data: committeeMembers
    });
  } catch (error) {
    console.error('Error fetching committee members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch committee members',
      error: error.message
    });
  }
};

// @desc    Update committee member
// @route   PUT /api/admin/committee-members/:id
// @access  Private/Admin
const updateCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const committeeMember = await CommitteeMember.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!committeeMember) {
      return res.status(404).json({
        success: false,
        message: 'Committee member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Committee member updated successfully',
      data: committeeMember
    });
  } catch (error) {
    console.error('Error updating committee member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update committee member',
      error: error.message
    });
  }
};

// @desc    Delete committee member
// @route   DELETE /api/admin/committee-members/:id
// @access  Private/Admin
const deleteCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const committeeMember = await CommitteeMember.findByIdAndDelete(id);
    
    if (!committeeMember) {
      return res.status(404).json({
        success: false,
        message: 'Committee member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Committee member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting committee member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete committee member',
      error: error.message
    });
  }
};

// @desc    Export committee members to CSV
// @route   GET /api/admin/committee-members/export
// @access  Private/Admin
const exportMembersToCsv = async (req, res) => {
  try {
    const committeeMembers = await CommitteeMember.find({ isActive: true })
      .sort({ 'name.en': 1 });
    
    if (committeeMembers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active committee members found to export'
      });
    }
    
    // Transform data for CSV export
    const csvData = committeeMembers.map(member => ({
      'Name (English)': member.name.en,
      'Name (Marathi)': member.name.mr,
      'Position (English)': member.position.en,
      'Position (Marathi)': member.position.mr,
      'Ward': member.ward || '',
      'Phone': member.phone || '',
      'Email': member.email || '',
      'Experience (English)': member.experience?.en || '',
      'Experience (Marathi)': member.experience?.mr || '',
      'Education (English)': member.education?.en || '',
      'Education (Marathi)': member.education?.mr || '',
      'Join Date': member.joinDate ? member.joinDate.toLocaleDateString() : '',
      'Term End': member.termEnd ? member.termEnd.toLocaleDateString() : '',
      'Created At': member.createdAt.toLocaleDateString()
    }));
    
    const parser = new Parser();
    const csv = parser.parse(csvData);
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="committee-members.csv"');
    
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting committee members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export committee members',
      error: error.message
    });
  }
};

// =============================================
// DEPARTMENT MANAGEMENT
// =============================================

// @desc    Create new department
// @route   POST /api/admin/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    
    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create department',
      error: error.message
    });
  }
};

// @desc    Get all departments
// @route   GET /api/admin/departments
// @access  Private/Admin
const getAllDepartments = async (req, res) => {
  try {
    const { active, search } = req.query;
    
    // Build filter object
    let filter = {};
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    if (search) {
      filter.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.mr': { $regex: search, $options: 'i' } },
        { 'head.en': { $regex: search, $options: 'i' } },
        { 'head.mr': { $regex: search, $options: 'i' } }
      ];
    }
    
    const departments = await Department.find(filter)
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message
    });
  }
};

// @desc    Update department
// @route   PUT /api/admin/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department
    });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update department',
      error: error.message
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/admin/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete department',
      error: error.message
    });
  }
};

// =============================================
// OFFICE INFORMATION MANAGEMENT
// =============================================

// @desc    Get office information
// @route   GET /api/admin/office-info
// @access  Private/Admin
const getOfficeInfo = async (req, res) => {
  try {
    const officeInfo = await OfficeInfo.findOne();
    
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
    console.error('Error fetching office info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch office information',
      error: error.message
    });
  }
};

// @desc    Create or update office information
// @route   PUT /api/admin/office-info
// @access  Private/Admin
const updateOfficeInfo = async (req, res) => {
  try {
    const officeInfo = await OfficeInfo.findOneAndUpdate(
      {}, // Empty filter to match any document
      req.body,
      { upsert: true, new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Office information updated successfully',
      data: officeInfo
    });
  } catch (error) {
    console.error('Error updating office info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update office information',
      error: error.message
    });
  }
};

module.exports = {
  // Committee Member functions
  createCommitteeMember,
  getAllCommitteeMembers,
  updateCommitteeMember,
  deleteCommitteeMember,
  exportMembersToCsv,
  
  // Department functions
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
  
  // Office Info functions
  getOfficeInfo,
  updateOfficeInfo
};
















