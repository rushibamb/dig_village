const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  verifyPayment,
  downloadReceipt
} = require('../controllers/paymentController');

// @route   POST /api/payment/orders
// @desc    Create Razorpay order for tax payment
// @access  Private
router.post('/orders', protect, createOrder);

// @route   POST /api/payment/verify
// @desc    Verify payment and update tax record
// @access  Private
router.post('/verify', protect, verifyPayment);

// @route   GET /api/payment/receipt/:taxRecordId
// @desc    Download tax payment receipt as PDF
// @access  Private
router.get('/receipt/:taxRecordId', protect, downloadReceipt);

module.exports = router;
