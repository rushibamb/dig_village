const mongoose = require('mongoose');

const newsCategorySchema = new mongoose.Schema({
  name: {
    en: {
      type: String,
      required: [true, 'English name is required']
    },
    mr: {
      type: String,
      required: [true, 'Marathi name is required']
    }
  },
  icon: {
    type: String,
    required: [true, 'Icon name is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NewsCategory', newsCategorySchema);



