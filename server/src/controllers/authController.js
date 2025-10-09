const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Villager = require('../models/villagerModel');
const twilio = require('twilio');

// Check if Twilio credentials are available
const isTwilioConfigured = () => {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER &&
    process.env.TWILIO_ACCOUNT_SID !== 'paste_your_account_sid_here' &&
    process.env.TWILIO_AUTH_TOKEN !== 'paste_your_auth_token_here' &&
    process.env.TWILIO_PHONE_NUMBER !== 'paste_your_twilio_phone_number_here'
  );
};

// Initialize Twilio client only if credentials are available
let client = null;
if (isTwilioConfigured()) {
  try {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✅ Twilio client initialized successfully for auth');
  } catch (error) {
    console.error('❌ Failed to initialize Twilio client for auth:', error.message);
  }
} else {
  console.warn('⚠️ Twilio credentials not configured for auth. SMS functionality will be limited.');
}

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create admin user (for development/testing)
// @route   POST /api/auth/create-admin
// @access  Public (for development only)
const createAdminUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Forgot password - Send OTP via SMS
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    // Normalize mobile number
    let normalizedMobileNumber = mobileNumber.trim();
    if (normalizedMobileNumber.startsWith('+91')) {
      normalizedMobileNumber = normalizedMobileNumber.substring(3);
    } else if (normalizedMobileNumber.startsWith('91') && normalizedMobileNumber.length > 10) {
      normalizedMobileNumber = normalizedMobileNumber.substring(2);
    }

    // Find villager by mobile number (try multiple formats)
    let villager = await Villager.findOne({ mobileNumber });
    if (!villager) {
      villager = await Villager.findOne({ mobileNumber: normalizedMobileNumber });
    }
    if (!villager) {
      villager = await Villager.findOne({ mobileNumber: mobileNumber.replace(/^\+91|^91/, '') });
    }

    if (!villager) {
      return res.status(404).json({
        success: false,
        message: 'No villager found with this mobile number'
      });
    }

    // Find user account linked to this villager
    const user = await User.findById(villager.submittedBy);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user account found for this villager'
      });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiry time (10 minutes from now)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    
    // Save OTP and expiry time to the user document
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = otpExpiry;
    await user.save();

    // Format mobile number for E.164 (add +91 if not present)
    let formattedMobileNumber = mobileNumber.trim();
    if (!formattedMobileNumber.startsWith('+')) {
      if (formattedMobileNumber.startsWith('0')) {
        formattedMobileNumber = '+91' + formattedMobileNumber.substring(1);
      } else {
        formattedMobileNumber = '+91' + formattedMobileNumber;
      }
    }

    // Check if Twilio is configured
    if (!client || !isTwilioConfigured()) {
      console.log(`Password reset OTP for ${formattedMobileNumber}: ${otp} (Twilio not configured)`);
      
      res.status(200).json({
        success: true,
        message: 'Password reset OTP generated successfully (SMS service not configured)',
        otp: otp, // Always show OTP when Twilio is not configured
        isMock: true
      });
      return;
    }

    try {
      // Send SMS using Twilio
      const message = await client.messages.create({
        body: `Your password reset OTP is: ${otp}. This OTP is valid for 10 minutes. Do not share this OTP with anyone.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedMobileNumber
      });

      console.log(`Password reset SMS sent successfully to ${formattedMobileNumber}. Message SID: ${message.sid}`);
      console.log(`Password reset OTP for ${formattedMobileNumber}: ${otp}`);

      res.status(200).json({
        success: true,
        message: 'Password reset OTP sent successfully via SMS',
        // In development, send OTP in response for testing
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        isMock: false
      });

    } catch (smsError) {
      console.error('Twilio SMS error for password reset:', smsError);
      
      // If Twilio fails, still save the OTP for development/testing
      res.status(200).json({
        success: true,
        message: 'Password reset OTP generated successfully (SMS service unavailable)',
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        smsError: smsError.message,
        isMock: true
      });
    }

  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reset password - Verify OTP and update password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { mobileNumber, otp, newPassword } = req.body;

    if (!mobileNumber || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number, OTP, and new password are required'
      });
    }

    // Normalize mobile number
    let normalizedMobileNumber = mobileNumber.trim();
    if (normalizedMobileNumber.startsWith('+91')) {
      normalizedMobileNumber = normalizedMobileNumber.substring(3);
    } else if (normalizedMobileNumber.startsWith('91') && normalizedMobileNumber.length > 10) {
      normalizedMobileNumber = normalizedMobileNumber.substring(2);
    }

    // Find villager by mobile number (try multiple formats)
    let villager = await Villager.findOne({ mobileNumber });
    if (!villager) {
      villager = await Villager.findOne({ mobileNumber: normalizedMobileNumber });
    }
    if (!villager) {
      villager = await Villager.findOne({ mobileNumber: mobileNumber.replace(/^\+91|^91/, '') });
    }

    if (!villager) {
      return res.status(404).json({
        success: false,
        message: 'No villager found with this mobile number'
      });
    }

    // Find user account linked to this villager
    const user = await User.findById(villager.submittedBy);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user account found for this villager'
      });
    }

    // Check if OTP exists in database
    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'No password reset OTP found for this account'
      });
    }

    // Check if OTP has expired
    if (new Date() > user.resetPasswordOtpExpiry) {
      // Clear expired OTP from database
      user.resetPasswordOtp = null;
      user.resetPasswordOtpExpiry = null;
      await user.save();
      
      return res.status(400).json({
        success: false,
        message: 'Password reset OTP has expired'
      });
    }

    // Verify OTP matches
    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password reset OTP'
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and clear OTP fields
    user.password = hashedPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiry = null;
    await user.save();

    console.log(`Password reset successfully for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  createAdminUser,
  forgotPassword,
  resetPassword
};

