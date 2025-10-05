const mongoose = require('mongoose');

const mediaCategorySchema = new mongoose.Schema({
  name: {
    en: {
      type: String,
      required: true
    },
    mr: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

const MediaCategory = mongoose.model('MediaCategory', mediaCategorySchema);

module.exports = MediaCategory;
