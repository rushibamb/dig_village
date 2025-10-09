const fs = require('fs');
const csv = require('csv-parser');
const TaxRecord = require('../models/taxRecordModel');

const uploadTaxRecordsCsv = async (req, res) => {
  console.log("--- CSV Upload Process Started ---");
  try {
    console.log("Multer file data received:", req.file); // Check what multer provides
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    
    if (!req.file) {
      console.error("ERROR: No file was received by the server. Check the field name in the frontend FormData.");
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded. Make sure the file field name is correct." 
      });
    }

    console.log("File details:");
    console.log("- Path:", req.file.path);
    console.log("- Original name:", req.file.originalname);
    console.log("- Mimetype:", req.file.mimetype);
    console.log("- Size:", req.file.size);

    const results = [];
    
    // Check if file exists
    if (!fs.existsSync(req.file.path)) {
      console.error("ERROR: File does not exist at path:", req.file.path);
      return res.status(400).json({
        success: false,
        message: "Uploaded file not found on server"
      });
    }

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        console.log("Parsed CSV row:", data);
        results.push(data);
      })
      .on('end', async () => {
        try {
          console.log(`CSV parsing finished. Found ${results.length} records.`);
          // Optional: Log the first record to check data structure
          if (results.length > 0) {
            console.log("First record sample:", results[0]);
          }
          
          await TaxRecord.insertMany(results);
          console.log("Successfully inserted records into the database.");
          
          // Clean up the temporary file
          fs.unlinkSync(req.file.path);
          console.log("Temporary file cleaned up.");
          
          res.status(201).json({
            success: true,
            message: `Successfully uploaded and inserted ${results.length} tax records.`,
            count: results.length
          });
        } catch (dbError) {
          console.error("---!! DATABASE ERROR during CSV insert !!---", dbError);
          res.status(500).json({ 
            success: false,
            message: "Error saving records to the database.", 
            error: dbError.message 
          });
        }
      })
      .on('error', (csvError) => {
        console.error("---!! CSV PARSING ERROR !!---", csvError);
        res.status(400).json({
          success: false,
          message: "Error parsing CSV file",
          error: csvError.message
        });
      });
  } catch (error) {
    console.error("---!! CRITICAL ERROR during CSV upload process !!---", error);
    res.status(500).json({ 
      success: false,
      message: "An unexpected error occurred during file upload.", 
      error: error.message 
    });
  }
};

// @desc    Get all tax records with filtering and pagination
// @route   GET /api/admin/taxes
// @access  Private/Admin
const getAllTaxRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, taxType, search } = req.query;
    
    // Build filter object
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (taxType && taxType !== 'all') {
      filter.taxType = taxType;
    }
    if (search) {
      filter.$or = [
        { ownerName: { $regex: search, $options: 'i' } },
        { houseNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get tax records with filtering and pagination
    const taxRecords = await TaxRecord.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await TaxRecord.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: taxRecords.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: taxRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tax records',
      error: error.message
    });
  }
};

// @desc    Create a new tax record
// @route   POST /api/admin/taxes
// @access  Private/Admin
const createTaxRecord = async (req, res) => {
  try {
    const taxRecord = await TaxRecord.create(req.body);

    res.status(201).json({
      success: true,
      data: taxRecord,
      message: 'Tax record created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create tax record',
      error: error.message
    });
  }
};

// @desc    Get a single tax record by ID
// @route   GET /api/admin/taxes/:id
// @access  Private/Admin
const getTaxRecordById = async (req, res) => {
  try {
    const taxRecord = await TaxRecord.findById(req.params.id);

    if (!taxRecord) {
      return res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: taxRecord
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid tax record ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tax record',
      error: error.message
    });
  }
};

// @desc    Update a tax record
// @route   PUT /api/admin/taxes/:id
// @access  Private/Admin
const updateTaxRecord = async (req, res) => {
  try {
    const taxRecord = await TaxRecord.findById(req.params.id);

    if (!taxRecord) {
      return res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
    }

    const updatedTaxRecord = await TaxRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedTaxRecord,
      message: 'Tax record updated successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid tax record ID'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Failed to update tax record',
      error: error.message
    });
  }
};

// @desc    Delete a tax record
// @route   DELETE /api/admin/taxes/:id
// @access  Private/Admin
const deleteTaxRecord = async (req, res) => {
  try {
    const taxRecord = await TaxRecord.findById(req.params.id);

    if (!taxRecord) {
      return res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
    }

    await TaxRecord.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Tax record deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid tax record ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete tax record',
      error: error.message
    });
  }
};

// @desc    Mark tax record as paid
// @route   PUT /api/admin/taxes/:id/mark-paid
// @access  Private/Admin
const markTaxRecordAsPaid = async (req, res) => {
  try {
    const taxRecord = await TaxRecord.findById(req.params.id);

    if (!taxRecord) {
      return res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
    }

    taxRecord.status = 'Paid';
    taxRecord.paymentDate = new Date();
    await taxRecord.save();

    res.status(200).json({
      success: true,
      data: taxRecord,
      message: 'Tax record marked as paid successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid tax record ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to mark tax record as paid',
      error: error.message
    });
  }
};

// @desc    Get tax statistics
// @route   GET /api/admin/taxes/stats
// @access  Private/Admin
const getTaxStats = async (req, res) => {
  try {
    const totalRecords = await TaxRecord.countDocuments();
    const paidRecords = await TaxRecord.countDocuments({ status: 'Paid' });
    const pendingRecords = await TaxRecord.countDocuments({ status: 'Pending' });
    const overdueRecords = await TaxRecord.countDocuments({ 
      status: 'Pending', 
      dueDate: { $lt: new Date() } 
    });

    // Calculate total amounts
    const totalAmount = await TaxRecord.aggregate([
      { $group: { _id: null, total: { $sum: '$amountDue' } } }
    ]);

    const paidAmount = await TaxRecord.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amountDue' } } }
    ]);

    const pendingAmount = await TaxRecord.aggregate([
      { $match: { status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amountDue' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRecords,
        paidRecords,
        pendingRecords,
        overdueRecords,
        totalAmount: totalAmount[0]?.total || 0,
        paidAmount: paidAmount[0]?.total || 0,
        pendingAmount: pendingAmount[0]?.total || 0,
        collectionRate: totalRecords > 0 ? ((paidRecords / totalRecords) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tax statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllTaxRecords,
  createTaxRecord,
  getTaxRecordById,
  updateTaxRecord,
  deleteTaxRecord,
  markTaxRecordAsPaid,
  getTaxStats,
  uploadTaxRecordsCsv
};