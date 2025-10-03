const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide grievance title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide grievance description'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide grievance category'],
    trim: true
  },
  priority: {
    type: String,
    default: 'Normal',
    enum: ['Low', 'Normal', 'High', 'Urgent']
  },
  location: {
    type: String,
    trim: true
  },
  photos: [{
    type: String,
    trim: true
  }],
  resolutionPhotos: {
    type: [String],
    default: []
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide submitter information']
  },
  assignedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker'
  },
  adminStatus: {
    type: String,
    enum: ['Unapproved', 'Approved', 'Rejected'],
    default: 'Unapproved'
  },
  progressStatus: {
    type: String,
    enum: ['Pending', 'In-progress', 'Resolved'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Index for better query performance
grievanceSchema.index({ submittedBy: 1 });
grievanceSchema.index({ assignedWorker: 1 });
grievanceSchema.index({ adminStatus: 1 });
grievanceSchema.index({ progressStatus: 1 });
grievanceSchema.index({ category: 1 });

module.exports = mongoose.model('Grievance', grievanceSchema);
