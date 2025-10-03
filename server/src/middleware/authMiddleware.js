const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// @desc    Protect routes
// @access  Private
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Not authorized, user not found'
          });
        }

        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, token failed'
        });
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Admin only access
// @access  Private/Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as an admin'
    });
  }
};

module.exports = { protect, admin };

