const mongoose = require('mongoose');

const latestDevelopmentSchema = new mongoose.Schema({
  title: {
    en: {
      type: String,
      required: true
    },
    mr: {
      type: String,
      required: true
    }
  },
  description: {
    en: {
      type: String,
      required: true
    },
    mr: {
      type: String,
      required: true
    }
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    en: {
      type: String,
      required: true
    },
    mr: {
      type: String,
      required: true
    }
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
latestDevelopmentSchema.index({ isActive: 1, isFeatured: 1, priority: -1 });
latestDevelopmentSchema.index({ publishDate: -1 });

const LatestDevelopment = mongoose.model('LatestDevelopment', latestDevelopmentSchema);

module.exports = LatestDevelopment;
