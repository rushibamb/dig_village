const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
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
  head: {
    en: {
      type: String
    },
    mr: {
      type: String
    }
  },
  phone: {
    type: String
  },
  services: [{
    en: {
      type: String
    },
    mr: {
      type: String
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
















