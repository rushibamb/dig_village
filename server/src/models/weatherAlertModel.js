const mongoose = require('mongoose');

const weatherAlertSchema = new mongoose.Schema({
  title: {
    en: {
      type: String,
      required: [true, 'English title is required']
    },
    mr: {
      type: String,
      required: [true, 'Marathi title is required']
    }
  },
  message: {
    en: {
      type: String,
      required: [true, 'English message is required']
    },
    mr: {
      type: String,
      required: [true, 'Marathi message is required']
    }
  },
  alertType: {
    type: String,
    enum: ['warning', 'info', 'severe', 'advisory'],
    default: 'warning'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: 'AlertTriangle'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WeatherAlert', weatherAlertSchema);























