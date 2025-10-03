const Villager = require('../models/villagerModel');
const { Parser } = require('json2csv');

// In-memory storage for OTP (for development)
// In production, use Redis or database for OTP storage
const otpStorage = new Map();

// @desc    Submit new villager request
// @route   POST /api/villagers/requests/new
// @access  Private
const submitNewVillagerRequest = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      gender,
      dateOfBirth,
      aadharNumber,
      idProofPhoto,
      address
    } = req.body;

    // Allow same mobile number for multiple villagers (family members, etc.)

    // Normalize mobile number format for consistent storage
    let normalizedMobileNumber = mobileNumber.trim();
    if (normalizedMobileNumber.startsWith('+91')) {
      normalizedMobileNumber = normalizedMobileNumber.substring(3);
    } else if (normalizedMobileNumber.startsWith('91') && normalizedMobileNumber.length > 10) {
      normalizedMobileNumber = normalizedMobileNumber.substring(2);
    }

    // Check if villager already exists with this Aadhar number
    const existingAadhar = await Villager.findOne({ aadharNumber });
    if (existingAadhar) {
      return res.status(400).json({
        success: false,
        message: 'Villager with this Aadhar number already exists'
      });
    }

    // Create new villager request with normalized mobile number
    const villager = await Villager.create({
      fullName,
      mobileNumber: normalizedMobileNumber,
      gender,
      dateOfBirth,
      aadharNumber,
      idProofPhoto,
      address,
      status: 'Pending',
      requestType: 'New Registration',
      submittedBy: req.user ? req.user._id : null
    });

    res.status(201).json({
      success: true,
      message: 'Villager request submitted successfully',
      data: villager
    });
  } catch (error) {
    console.error('Error submitting villager request:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Generate OTP for villager edit
// @route   POST /api/villagers/requests/edit/generate-otp
// @access  Public
const generateOtpForEdit = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    // Normalize mobile number - remove +91 prefix if present and trim whitespace
    let normalizedMobileNumber = mobileNumber.trim();
    if (normalizedMobileNumber.startsWith('+91')) {
      normalizedMobileNumber = normalizedMobileNumber.substring(3);
    } else if (normalizedMobileNumber.startsWith('91') && normalizedMobileNumber.length > 10) {
      normalizedMobileNumber = normalizedMobileNumber.substring(2);
    }

    // Check if villager exists with this mobile number (try both original and normalized)
    let villager = await Villager.findOne({ mobileNumber });
    if (!villager) {
      villager = await Villager.findOne({ mobileNumber: normalizedMobileNumber });
    }
    if (!villager) {
      // Try without +91 prefix
      villager = await Villager.findOne({ mobileNumber: mobileNumber.replace(/^\+91|^91/, '') });
    }
    if (!villager) {
      return res.status(404).json({
        success: false,
        message: 'No villager found with this mobile number'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration (5 minutes) - store under multiple formats for flexibility
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
    const otpData = {
      otp,
      expiresAt: expirationTime,
      villagerId: villager._id
    };
    
    // Store OTP under multiple mobile number formats for flexible lookup
    otpStorage.set(mobileNumber, otpData);
    otpStorage.set(normalizedMobileNumber, otpData);
    if (mobileNumber.replace(/^\+91|^91/, '') !== normalizedMobileNumber && mobileNumber.replace(/^\+91|^91/, '') !== mobileNumber) {
      otpStorage.set(mobileNumber.replace(/^\+91|^91/, ''), otpData);
    }

    // TODO: In production, integrate with SMS service
    // For now, log the OTP (remove in production)
    console.log(`OTP for ${mobileNumber}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP generated successfully',
      // In production, don't send OTP in response
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Verify OTP and get villager info for editing
// @route   POST /api/villagers/requests/edit/verify-otp
// @access  Public
const verifyOtpAndGetVillager = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and OTP are required'
      });
    }

    // Normalize mobile number for OTP lookup
    let normalizedMobileNumber = mobileNumber.trim();
    if (normalizedMobileNumber.startsWith('+91')) {
      normalizedMobileNumber = normalizedMobileNumber.substring(3);
    } else if (normalizedMobileNumber.startsWith('91') && normalizedMobileNumber.length > 10) {
      normalizedMobileNumber = normalizedMobileNumber.substring(2);
    }

    // Get stored OTP data - try both original and normalized formats
    let storedOtpData = otpStorage.get(mobileNumber);
    if (!storedOtpData) {
      storedOtpData = otpStorage.get(normalizedMobileNumber);
    }
    if (!storedOtpData) {
      storedOtpData = otpStorage.get(mobileNumber.replace(/^\+91|^91/, ''));
    }
    
    if (!storedOtpData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check if OTP has expired
    if (Date.now() > storedOtpData.expiresAt) {
      otpStorage.delete(mobileNumber);
      otpStorage.delete(normalizedMobileNumber);
      otpStorage.delete(mobileNumber.replace(/^\+91|^91/, ''));
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Get villager data
    const villager = await Villager.findById(storedOtpData.villagerId);
    if (!villager) {
      return res.status(404).json({
        success: false,
        message: 'Villager not found'
      });
    }

    // Clear OTP after successful verification
    otpStorage.delete(mobileNumber);
    otpStorage.delete(normalizedMobileNumber);
    otpStorage.delete(mobileNumber.replace(/^\+91|^91/, ''));

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: villager
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Submit villager edit request
// @route   PUT /api/villagers/requests/edit/:id
// @access  Private
const submitVillagerEditRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      mobileNumber,
      gender,
      dateOfBirth,
      aadharNumber,
      idProofPhoto,
      address
    } = req.body;

    // Find the villager
    const villager = await Villager.findById(id);
    if (!villager) {
      return res.status(404).json({
        success: false,
        message: 'Villager not found'
      });
    }

    // Allow mobile number changes - family members can share mobile numbers

    // Normalize mobile number format for consistent storage
    if (mobileNumber) {
      let normalizedMobileNumber = mobileNumber.trim();
      if (normalizedMobileNumber.startsWith('+91')) {
        normalizedMobileNumber = normalizedMobileNumber.substring(3);
      } else if (normalizedMobileNumber.startsWith('91') && normalizedMobileNumber.length > 10) {
        normalizedMobileNumber = normalizedMobileNumber.substring(2);
      }
      mobileNumber = normalizedMobileNumber;
    }

    // Check if Aadhar number is being changed and if it already exists
    if (aadharNumber && aadharNumber !== villager.aadharNumber) {
      const existingAadhar = await Villager.findOne({ 
        aadharNumber, 
        _id: { $ne: id } 
      });
      if (existingAadhar) {
        return res.status(400).json({
          success: false,
          message: 'Aadhar number already exists'
        });
      }
    }

    // Update villager fields
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (aadharNumber) updateData.aadharNumber = aadharNumber;
    if (idProofPhoto) updateData.idProofPhoto = idProofPhoto;
    if (address) updateData.address = address;

    // Set status to Pending and requestType to Edit Request
    updateData.status = 'Pending';
    updateData.requestType = 'Edit Request';
    updateData.submittedBy = req.user ? req.user._id : villager.submittedBy;
    updateData.submittedAt = new Date();

    const updatedVillager = await Villager.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Villager edit request submitted successfully',
      data: updatedVillager
    });
  } catch (error) {
    console.error('Error submitting villager edit request:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Get all villagers with search and filter
// @route   GET /api/admin/villagers
// @access  Private/Admin
const adminGetAllVillagers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    // Build query object
    const query = {};
    
    // Add search functionality
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
        { aadharNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add status filter
    if (status) {
      query.status = status;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const villagers = await Villager.find(query)
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Villager.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: villagers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching villagers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Add new villager directly
// @route   POST /api/admin/villagers
// @access  Private/Admin
const adminAddVillager = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      gender,
      dateOfBirth,
      aadharNumber,
      idProofPhoto,
      address
    } = req.body;

    // Check if villager already exists with this Aadhar number (mobile number can be shared)
    const existingVillager = await Villager.findOne({ aadharNumber });
    
    if (existingVillager) {
      return res.status(400).json({
        success: false,
        message: 'Villager with this Aadhar number already exists'
      });
    }

    // Normalize mobile number format for consistent storage
    let normalizedMobileNumber = mobileNumber.trim();
    if (normalizedMobileNumber.startsWith('+91')) {
      normalizedMobileNumber = normalizedMobileNumber.substring(3);
    } else if (normalizedMobileNumber.startsWith('91') && normalizedMobileNumber.length > 10) {
      normalizedMobileNumber = normalizedMobileNumber.substring(2);
    }

    // Create new villager with admin privileges
    const villager = await Villager.create({
      fullName,
      mobileNumber: normalizedMobileNumber,
      gender,
      dateOfBirth,
      aadharNumber,
      idProofPhoto,
      address,
      status: 'Approved',
      requestType: 'Admin Added',
      submittedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Villager added successfully by admin',
      data: villager
    });
  } catch (error) {
    console.error('Error adding villager:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Update villager status
// @route   PATCH /api/admin/villagers/:id/status
// @access  Private/Admin
const adminUpdateVillagerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "Approved" or "Rejected"'
      });
    }

    const villager = await Villager.findById(id);
    if (!villager) {
      return res.status(404).json({
        success: false,
        message: 'Villager not found'
      });
    }

    villager.status = status;
    await villager.save();

    res.status(200).json({
      success: true,
      message: `Villager status updated to ${status}`,
      data: villager
    });
  } catch (error) {
    console.error('Error updating villager status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Edit villager information
// @route   PUT /api/admin/villagers/:id
// @access  Private/Admin
const adminEditVillager = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      mobileNumber,
      gender,
      dateOfBirth,
      aadharNumber,
      idProofPhoto,
      address,
      status
    } = req.body;

    const villager = await Villager.findById(id);
    if (!villager) {
      return res.status(404).json({
        success: false,
        message: 'Villager not found'
      });
    }

    // Check for duplicate mobile number
    if (mobileNumber && mobileNumber !== villager.mobileNumber) {
      const existingVillager = await Villager.findOne({
        mobileNumber,
        _id: { $ne: id }
      });
      if (existingVillager) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number already exists'
        });
      }
    }

    // Check for duplicate Aadhar number
    if (aadharNumber && aadharNumber !== villager.aadharNumber) {
      const existingAadhar = await Villager.findOne({
        aadharNumber,
        _id: { $ne: id }
      });
      if (existingAadhar) {
        return res.status(400).json({
          success: false,
          message: 'Aadhar number already exists'
        });
      }
    }

    // Update villager fields
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (aadharNumber) updateData.aadharNumber = aadharNumber;
    if (idProofPhoto) updateData.idProofPhoto = idProofPhoto;
    if (address) updateData.address = address;
    if (status) updateData.status = status;

    const updatedVillager = await Villager.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Villager updated successfully',
      data: updatedVillager
    });
  } catch (error) {
    console.error('Error updating villager:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin: Export approved villagers to CSV
// @route   GET /api/admin/villagers/export
// @access  Private/Admin
const exportVillagersToCsv = async (req, res) => {
  try {
    // Get all approved villagers
    const villagers = await Villager.find({ status: 'Approved' })
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });

    if (villagers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No approved villagers found to export'
      });
    }

    // Prepare data for CSV
    const csvData = villagers.map(villager => ({
      'Full Name': villager.fullName,
      'Mobile Number': villager.mobileNumber,
      'Gender': villager.gender,
      'Date of Birth': villager.dateOfBirth.toISOString().split('T')[0],
      'Aadhar Number': villager.aadharNumber,
      'Address': villager.address,
      'Status': villager.status,
      'Request Type': villager.requestType,
      'Submitted By': villager.submittedBy ? villager.submittedBy.name : 'Admin',
      'Submitted At': villager.submittedAt.toISOString().split('T')[0],
      'Created At': villager.createdAt.toISOString().split('T')[0]
    }));

    // Define CSV fields
    const fields = [
      'Full Name',
      'Mobile Number',
      'Gender',
      'Date of Birth',
      'Aadhar Number',
      'Address',
      'Status',
      'Request Type',
      'Submitted By',
      'Submitted At',
      'Created At'
    ];

    // Create CSV parser
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    // Set response headers for file download
    const filename = `approved_villagers_${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting villagers to CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get villager statistics for dashboard
// @route   GET /api/villagers/stats
// @access  Public
const getVillagerStats = async (req, res) => {
  try {
    // Get total count of all villagers
    const total = await Villager.countDocuments();
    
    // Get count by gender
    const genderStats = await Villager.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format the gender statistics
    const stats = {
      total,
      male: 0,
      female: 0,
      other: 0
    };
    
    genderStats.forEach(stat => {
      if (stat._id === 'Male') {
        stats.male = stat.count;
      } else if (stat._id === 'Female') {
        stats.female = stat.count;
      } else if (stat._id === 'Other') {
        stats.other = stat.count;
      }
    });
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching villager stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  submitNewVillagerRequest,
  generateOtpForEdit,
  verifyOtpAndGetVillager,
  submitVillagerEditRequest,
  getVillagerStats,
  adminGetAllVillagers,
  adminAddVillager,
  adminUpdateVillagerStatus,
  adminEditVillager,
  exportVillagersToCsv
};
