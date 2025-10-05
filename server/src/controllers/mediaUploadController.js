const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  }
});

// Upload media file to Cloudinary
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Determine resource type based on file mimetype
    const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: resourceType,
        folder: 'village-portal/media',
        use_filename: true,
        unique_filename: true,
        overwrite: false
      };

      // For videos, also generate a thumbnail
      if (resourceType === 'video') {
        uploadOptions.eager = [
          { width: 400, height: 300, crop: 'fill', format: 'jpg' }
        ];
      }

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Return the upload result
    res.json({
      success: true,
      data: {
        fileUrl: result.secure_url,
        thumbnailUrl: result.eager ? result.eager[0].secure_url : result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format,
        width: result.width,
        height: result.height,
        duration: result.duration || null,
        size: result.bytes
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
};

// Delete media file from Cloudinary
const deleteMedia = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    res.json({
      success: true,
      message: 'File deleted successfully',
      data: result
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  uploadMedia,
  deleteMedia
};
