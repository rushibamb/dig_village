const mongoose = require('mongoose');

const committeeMemberSchema = new mongoose.Schema({
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
  position: {
    en: {
      type: String,
      required: true
    },
    mr: {
      type: String,
      required: true
    }
  },
  ward: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  experience: {
    en: {
      type: String
    },
    mr: {
      type: String
    }
  },
  education: {
    en: {
      type: String
    },
    mr: {
      type: String
    }
  },
  achievements: [{
    en: {
      type: String
    },
    mr: {
      type: String
    }
  }],
  photoUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinDate: {
    type: Date
  },
  termEnd: {
    type: Date
  }
}, {
  timestamps: true
});

const CommitteeMember = mongoose.model('CommitteeMember', committeeMemberSchema);

module.exports = CommitteeMember;

























