const express = require('express');
const router = express.Router();
const { searchTaxRecords } = require('../controllers/taxPublicController');

// @route   GET /api/taxes/search
// @desc    Public: Search tax records by house number or owner name
// @access  Public
router.get('/search', searchTaxRecords);

module.exports = router;
