const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
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
      type: String
    },
    mr: {
      type: String
    }
  },
  icon: {
    type: String
  }
}, {
  timestamps: true
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;