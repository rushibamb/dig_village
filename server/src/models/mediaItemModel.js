const mongoose = require('mongoose');

const mediaItemSchema = new mongoose.Schema({
  mediaType: {
    type: String,
    required: true,
    enum: ['Photo', 'Video']
  },
  title: {
    en: {
      type: String,
      required: true
    },
    mr: {
      type: String
    }
  },
  description: {
    en: {
      type: String
    },
    mr: {
      type: String
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MediaCategory',
    required: true
  },
  tags: [{
    type: String
  }],
  fileUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: String
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const MediaItem = mongoose.model('MediaItem', mediaItemSchema);

module.exports = MediaItem;
