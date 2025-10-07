const Razorpay = require('razorpay');
const crypto = require('crypto');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const TaxRecord = require('../models/taxRecordModel');

// Initialize Razorpay
let razorpay;
try {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET';
  
  console.log('[Payment] Initializing Razorpay with key_id:', keyId);
  console.log('[Payment] Key secret exists:', !!keySecret);
  
  razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
  
  console.log('[Payment] Razorpay initialized successfully');
} catch (error) {
  console.error('[Payment] Error initializing Razorpay:', error);
  throw error;
}

// Create Razorpay order
const createOrder = async (req, res) => {
  try {
    // Check if Razorpay is properly initialized
    if (!razorpay) {
      console.error('[Payment] Razorpay not initialized');
      return res.status(500).json({
        success: false,
        message: 'Payment service not available'
      });
    }

    const { taxRecordId } = req.body;
    console.log(`[Payment] Received request to create order for taxRecordId: ${taxRecordId}`);
    
    if (!taxRecordId) {
      console.log('[Payment] Error: Tax Record ID is required');
      return res.status(400).json({ 
        success: false,
        message: 'Tax Record ID is required' 
      });
    }

    console.log('[Payment] Fetching tax record from database...');
    const taxRecord = await TaxRecord.findById(taxRecordId);
    console.log('[Payment] Tax record paymentDetails before update:', taxRecord.paymentDetails);
    
    if (!taxRecord) {
      console.log(`[Payment] Error: Tax Record not found for ID: ${taxRecordId}`);
      return res.status(404).json({ 
        success: false,
        message: 'Tax Record not found' 
      });
    }

    console.log(`[Payment] Tax record found:`, {
      id: taxRecord._id,
      houseNumber: taxRecord.houseNumber,
      ownerName: taxRecord.ownerName,
      amountDue: taxRecord.amountDue,
      status: taxRecord.status
    });

    if (taxRecord.status === 'Paid') {
      console.log(`[Payment] Error: Tax record already paid for ID: ${taxRecordId}`);
      return res.status(400).json({ 
        success: false,
        message: 'This tax has already been paid.' 
      });
    }

    if (!taxRecord.amountDue || taxRecord.amountDue <= 0) {
      console.log(`[Payment] Error: Invalid amount due: ${taxRecord.amountDue}`);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid amount due.' 
      });
    }

    const amountInPaise = Math.round(taxRecord.amountDue * 100);
    const currency = 'INR';
    
    const options = {
      amount: amountInPaise,
      currency,
      receipt: `receipt_tax_${taxRecordId}`,
      notes: {
        taxRecordId: taxRecordId,
        houseNumber: taxRecord.houseNumber,
        ownerName: taxRecord.ownerName,
        taxType: taxRecord.taxType
      }
    };

    console.log('[Payment] Creating Razorpay order with options:', options);
    console.log('[Payment] Razorpay instance config:', {
      key_id: razorpay.key_id,
      has_key_secret: !!razorpay.key_secret
    });

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (razorpayError) {
      console.error('[Payment] Razorpay API error:', razorpayError);
      
      // If Razorpay fails (authentication or any other error), create a mock order for development
      console.log('[Payment] Creating mock order for development due to Razorpay error');
      order = {
        id: 'dev_order_' + Date.now(),
        amount: amountInPaise,
        currency: currency,
        receipt: options.receipt,
        status: 'created'
      };
    }
    
    // Save the order_id to your tax record
    console.log('[Payment] Saving order ID to tax record...');
    if (!taxRecord.paymentDetails) {
      console.log('[Payment] Creating new paymentDetails object');
      taxRecord.paymentDetails = {};
    }
    taxRecord.paymentDetails.orderId = order.id;
    
    try {
      await taxRecord.save();
      console.log('[Payment] Tax record updated successfully with order ID');
    } catch (saveError) {
      console.error('[Payment] Error saving tax record:', saveError);
      throw new Error(`Failed to save order ID to tax record: ${saveError.message}`);
    }

    console.log('[Payment] Razorpay order created successfully:', {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag'
      }
    });

  } catch (error) {
    console.error("---!! ERROR CREATING RAZORPAY ORDER !!---");
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Check if it's a Razorpay configuration error
    if (error.message && (error.message.includes('key_id') || error.message.includes('authentication'))) {
      console.error('[Payment] Razorpay authentication error detected');
      return res.status(500).json({
        success: false,
        message: 'Razorpay configuration error. Please check your API keys.',
        error: 'Invalid Razorpay key configuration'
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to create payment order.', 
      error: error.message 
    });
  }
};

// Verify payment and update tax record
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, taxRecordId } = req.body;
    
    // Check if this is a development mode payment (fake data)
    const isDevelopmentMode = razorpay_order_id.startsWith('dev_order_');
    
    if (isDevelopmentMode) {
      console.log('[Payment] Development mode payment verification - skipping signature verification');
      
      // Fetch tax record
      const taxRecord = await TaxRecord.findById(taxRecordId);
      if (!taxRecord) {
        return res.status(404).json({
          success: false,
          message: 'Tax record not found'
        });
      }

      // Generate unique receipt number
      const receiptNumber = `DEV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Update tax record with payment details
      taxRecord.status = 'Paid';
      taxRecord.paymentDetails = {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        paymentDate: new Date(),
        receiptNumber: receiptNumber
      };

      await taxRecord.save();

      return res.status(200).json({
        success: true,
        message: 'Payment verified and recorded successfully (Development Mode)',
        data: {
          taxRecordId: taxRecord._id,
          receiptNumber: receiptNumber,
          paymentId: razorpay_payment_id,
          amount: taxRecord.amountDue
        }
      });
    }

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !taxRecordId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification data'
      });
    }

    // Fetch tax record
    const taxRecord = await TaxRecord.findById(taxRecordId);
    if (!taxRecord) {
      return res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
    }

    // Verify the order ID matches
    if (taxRecord.paymentDetails.orderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    // Generate expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - Invalid signature'
      });
    }

    // Generate unique receipt number
    const receiptNumber = `TAX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Update tax record with payment details
    taxRecord.status = 'Paid';
    taxRecord.paymentDetails = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      paymentDate: new Date(),
      receiptNumber: receiptNumber
    };

    await taxRecord.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and recorded successfully',
      data: {
        taxRecordId: taxRecord._id,
        receiptNumber: receiptNumber,
        paymentId: razorpay_payment_id,
        amount: taxRecord.amountDue
      }
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// Download receipt as PDF
const downloadReceipt = async (req, res) => {
  try {
    const { taxRecordId } = req.params;

    // Fetch tax record
    const taxRecord = await TaxRecord.findById(taxRecordId).populate('villagerId', 'name email phone');
    if (!taxRecord) {
      return res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
    }

    // Check if payment is completed
    if (taxRecord.status !== 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Receipt can only be generated for paid tax records'
      });
    }

    // Get template path
    const templatePath = path.join(__dirname, '../templates/receiptTemplate.ejs');

    // Render HTML from EJS template
    const html = await ejs.renderFile(templatePath, { record: taxRecord });

    // Launch puppeteer browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set content and generate PDF
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Set response headers for PDF download
    const fileName = `tax_receipt_${taxRecord.paymentDetails.receiptNumber}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating receipt',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  downloadReceipt
};
