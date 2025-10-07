const TaxRecord = require('../models/taxRecordModel');

// Search tax records by house number or owner name
const searchTaxRecords = async (req, res) => {
  try {
    const { q } = req.query;

    // Validate search query
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Build search query - only return records with status 'Pending' or 'Overdue'
    const query = {
      $and: [
        {
          status: { $in: ['Pending', 'Overdue'] }
        },
        {
          $or: [
            { houseNumber: { $regex: q.trim(), $options: 'i' } },
            { ownerName: { $regex: q.trim(), $options: 'i' } }
          ]
        }
      ]
    };

    // Execute search query
    const records = await TaxRecord.find(query)
      .select('houseNumber ownerName taxType amountDue dueDate status')
      .sort({ dueDate: 1 }) // Sort by due date ascending (earliest first)
      .limit(50); // Limit results to prevent abuse

    res.status(200).json({
      success: true,
      message: `Found ${records.length} matching tax records`,
      data: records,
      count: records.length
    });

  } catch (error) {
    console.error('Error searching tax records:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching tax records',
      error: error.message
    });
  }
};

module.exports = {
  searchTaxRecords
};
