const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
  description: {
    en: {
      type: String,
      required: [true, 'English description is required']
    },
    mr: {
      type: String,
      required: [true, 'Marathi description is required']
    }
  },
  location: {
    en: {
      type: String,
      required: [true, 'English location is required']
    },
    mr: {
      type: String,
      required: [true, 'Marathi location is required']
    }
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  eventTime: {
    type: String,
    required: [true, 'Event time is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
















