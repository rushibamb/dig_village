const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password']
  },
  role: {
    type: String,
    default: 'villager'
  },
  resetPasswordOtp: {
    type: String,
    required: false
  },
  resetPasswordOtpExpiry: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

