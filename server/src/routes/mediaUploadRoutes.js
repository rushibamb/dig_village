const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { upload, uploadMedia, deleteMedia } = require('../controllers/mediaUploadController');

// Upload media file (admin only)
router.post('/upload', protect, admin, upload.single('file'), uploadMedia);

// Upload villager image (authenticated users only)
router.post('/villager-image', protect, upload.single('file'), uploadMedia);

// Delete media file (admin only)
router.delete('/delete/:publicId', protect, admin, deleteMedia);

module.exports = router;
