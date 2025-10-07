const fs = require('fs');
const csv = require('csv-parser');
const TaxRecord = require('../models/taxRecordModel');

const uploadTaxRecordsCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const results = [];
    const filePath = req.file.path;

    // Read and parse the CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Create tax record object from CSV data
          const taxRecord = {
            houseNumber: data.houseNumber,
            ownerName: data.ownerName,
            taxType: data.taxType,
            amountDue: parseFloat(data.amountDue),
            dueDate: new Date(data.dueDate),
            status: data.status || 'Pending',
            villagerId: data.villagerId || null
          };
          results.push(taxRecord);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    // Insert all records into the database
    const insertedRecords = await TaxRecord.insertMany(results);

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: `Successfully imported ${insertedRecords.length} tax records`,
      count: insertedRecords.length
    });

  } catch (error) {
    console.error('Error uploading tax records:', error);
    
    // Clean up the uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error processing tax records upload',
      error: error.message
    });
  }
};

// Create a single tax record
const createTaxRecord = async (req, res) => {
  try {
    const { houseNumber, ownerName, taxType, amountDue, dueDate, status, villagerId } = req.body;

    // Validate required fields
    if (!houseNumber || !ownerName || !taxType || !amountDue || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: houseNumber, ownerName, taxType, amountDue, dueDate'
      });
    }

    const taxRecord = new TaxRecord({
      houseNumber,
      ownerName,
      taxType,
      amountDue: parseFloat(amountDue),
      dueDate: new Date(dueDate),
      status: status || 'Pending',
      villagerId: villagerId || null
    });

    const savedRecord = await taxRecord.save();

    res.status(201).json({
      success: true,
      message: 'Tax record created successfully',
      data: savedRecord
    });

  } catch (error) {
    console.error('Error creating tax record:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating tax record',
      error: error.message
    });
  }
};

// Get all tax records with filtering and search
const getAllTaxRecords = async (req, res) => {
  try {
    const { status, taxType, search, page = 1, limit = 10 } = req.query;
    
    // Build query object
    const query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by tax type
    if (taxType && taxType !== 'all') {
      query.taxType = taxType;
    }
    
    // Search by house number or owner name
    if (search) {
      query.$or = [
        { houseNumber: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const [records, total] = await Promise.all([
      TaxRecord.find(query)
        .populate('villagerId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      TaxRecord.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: records,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalRecords: total,
        recordsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching tax records:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tax records',
      error: error.message
    });
  }
};

// Update a tax record
const updateTaxRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { houseNumber, ownerName, taxType, amountDue, dueDate, status, villagerId } = req.body;

    // Validate required fields
    if (!houseNumber || !ownerName || !taxType || !amountDue || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: houseNumber, ownerName, taxType, amountDue, dueDate'
      });
    }

    const updatedRecord = await TaxRecord.findByIdAndUpdate(
      id,
      {
        houseNumber,
        ownerName,
        taxType,
        amountDue: parseFloat(amountDue),
        dueDate: new Date(dueDate),
        status: status || 'Pending',
        villagerId: villagerId || null
      },
      { new: true, runValidators: true }
    ).populate('villagerId', 'name email phone');

    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tax record updated successfully',
      data: updatedRecord
    });

  } catch (error) {
    console.error('Error updating tax record:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tax record',
      error: error.message
    });
  }
};

// Delete a tax record
const deleteTaxRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRecord = await TaxRecord.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tax record deleted successfully',
      data: deletedRecord
    });

  } catch (error) {
    console.error('Error deleting tax record:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tax record',
      error: error.message
    });
  }
};

// Mark tax record as paid (for offline payments)
const markAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentDetails } = req.body;

    const updateData = {
      status: 'Paid',
      'paymentDetails.paymentDate': new Date()
    };

    // Add payment details if provided
    if (paymentDetails) {
      if (paymentDetails.orderId) updateData['paymentDetails.orderId'] = paymentDetails.orderId;
      if (paymentDetails.paymentId) updateData['paymentDetails.paymentId'] = paymentDetails.paymentId;
      if (paymentDetails.receiptNumber) updateData['paymentDetails.receiptNumber'] = paymentDetails.receiptNumber;
    }

    const updatedRecord = await TaxRecord.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('villagerId', 'name email phone');

    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        message: 'Tax record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tax record marked as paid successfully',
      data: updatedRecord
    });

  } catch (error) {
    console.error('Error marking tax record as paid:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking tax record as paid',
      error: error.message
    });
  }
};

module.exports = {
  uploadTaxRecordsCsv,
  createTaxRecord,
  getAllTaxRecords,
  updateTaxRecord,
  deleteTaxRecord,
  markAsPaid
};
