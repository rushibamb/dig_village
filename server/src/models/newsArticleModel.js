const mongoose = require('mongoose');

const newsArticleSchema = new mongoose.Schema({
  title: {
    en: {
      type: String,
      required: [true, 'English title is required']
    },
    mr: {
      type: String
    }
  },
  summary: {
    en: {
      type: String,
      required: [true, 'English summary is required']
    },
    mr: {
      type: String
    }
  },
  content: {
    en: {
      type: String,
      required: [true, 'English content is required']
    },
    mr: {
      type: String
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NewsCategory',
    required: [true, 'Category is required']
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  tags: [{
    type: String
  }],
  imageUrl: {
    type: String
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBreaking: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  readCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NewsArticle', newsArticleSchema);























