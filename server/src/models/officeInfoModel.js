const mongoose = require('mongoose');

const officeInfoSchema = new mongoose.Schema({
  address: {
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
  email: {
    type: String
  },
  emergencyContact: {
    type: String
  },
  publicMeetingInfo: {
    en: {
      type: String
    },
    mr: {
      type: String
    }
  },
  officeHours: [{
    day: {
      en: {
        type: String
      },
      mr: {
        type: String
      }
    },
    hours: {
      type: String
    },
    available: {
      type: Boolean
    }
  }]
}, {
  timestamps: true
});

const OfficeInfo = mongoose.model('OfficeInfo', officeInfoSchema);

module.exports = OfficeInfo;












