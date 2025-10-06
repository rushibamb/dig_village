const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: {
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

const Facility = mongoose.model('Facility', facilitySchema);

module.exports = Facility;