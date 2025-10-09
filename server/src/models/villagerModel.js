const mongoose = require('mongoose');

const villagerSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please add a full name'],
      trim: true
    },
    mobileNumber: {
      type: String,
      required: [true, 'Please add a mobile number'],
      trim: true
    },
    gender: {
      type: String,
      required: [true, 'Please select gender'],
      enum: ['Male', 'Female', 'Other']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Please add date of birth']
    },
    aadharNumber: {
      type: String,
      required: [true, 'Please add Aadhar number'],
      unique: true,
      trim: true
    },
    idProofPhoto: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Please add address'],
      trim: true
    },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Approved', 'Rejected']
    },
    requestType: {
      type: String,
      default: 'New Registration',
      enum: ['New Registration', 'Edit Request', 'Admin Added']
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    otp: {
      type: String,
      required: false
    },
    otpExpiry: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

// Index for better query performance
villagerSchema.index({ mobileNumber: 1 });
villagerSchema.index({ aadharNumber: 1 });
villagerSchema.index({ status: 1 });
villagerSchema.index({ submittedBy: 1 });

module.exports = mongoose.model('Villager', villagerSchema);

