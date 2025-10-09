const mongoose = require('mongoose');

// Bilingual schema for text fields
const bilingualSchema = new mongoose.Schema({
  en: { type: String, required: true },
  mr: { type: String, required: true }
}, { _id: false });

// Document schema for file attachments
const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

// Deliverable schema for completed projects
const deliverableSchema = new mongoose.Schema({
  item: { type: bilingualSchema, required: true },
  value: { type: String, required: true }
}, { _id: false });

// Timeline phase schema for ongoing projects
const timelinePhaseSchema = new mongoose.Schema({
  phase: { type: bilingualSchema, required: true },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false }
}, { _id: false });

// Main Project schema
const projectSchema = new mongoose.Schema({
  // Core fields
  title: {
    type: bilingualSchema,
    required: true
  },
  status: {
    type: String,
    enum: ['Tender', 'Ongoing', 'Completed'],
    default: 'Tender',
    required: true
  },

  // Tender Phase Fields
  department: {
    type: bilingualSchema,
    required: function() {
      return this.status === 'Tender' || this.status === 'Ongoing' || this.status === 'Completed';
    }
  },
  estimatedBudget: {
    type: Number,
    required: function() {
      return this.status === 'Tender' || this.status === 'Ongoing' || this.status === 'Completed';
    },
    min: 0
  },
  issueDate: {
    type: Date,
    required: function() {
      return this.status === 'Tender' || this.status === 'Ongoing' || this.status === 'Completed';
    }
  },
  lastDate: {
    type: Date,
    required: function() {
      return this.status === 'Tender' || this.status === 'Ongoing' || this.status === 'Completed';
    }
  },
  contactName: {
    type: bilingualSchema,
    required: function() {
      return this.status === 'Tender' || this.status === 'Ongoing' || this.status === 'Completed';
    }
  },
  contactPhone: {
    type: String,
    required: function() {
      return this.status === 'Tender' || this.status === 'Ongoing' || this.status === 'Completed';
    }
  },
  tenderDocuments: {
    type: [documentSchema],
    default: []
  },
  description: {
    type: bilingualSchema,
    required: function() {
      return this.status === 'Tender';
    },
    default: undefined
  },
  tenderNoticeUrl: {
    type: String,
    required: function() {
      return this.status === 'Tender';
    },
    default: undefined
  },

  // Ongoing Phase Fields
  contractor: {
    type: bilingualSchema,
    required: function() {
      return this.status === 'Ongoing' || this.status === 'Completed';
    }
  },
  allocatedBudget: {
    type: Number,
    required: function() {
      return this.status === 'Ongoing' || this.status === 'Completed';
    },
    min: 0
  },
  startDate: {
    type: Date,
    required: function() {
      return this.status === 'Ongoing' || this.status === 'Completed';
    }
  },
  expectedCompletionDate: {
    type: Date,
    required: function() {
      return this.status === 'Ongoing' || this.status === 'Completed';
    }
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    required: function() {
      return this.status === 'Ongoing' || this.status === 'Completed';
    }
  },
  currentPhase: {
    type: bilingualSchema,
    required: function() {
      return this.status === 'Ongoing' || this.status === 'Completed';
    }
  },
  sitePhotos: {
    type: [String],
    default: []
  },
  projectDocuments: {
    type: [documentSchema],
    default: []
  },
  timeline: {
    type: [timelinePhaseSchema],
    default: []
  },

  // Completed Phase Fields
  totalCost: {
    type: Number,
    required: function() {
      return this.status === 'Completed';
    },
    min: 0
  },
  completionDate: {
    type: Date,
    required: function() {
      return this.status === 'Completed';
    }
  },
  finalPhotos: {
    type: [String],
    default: []
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: function() {
      return this.status === 'Completed';
    }
  },
  summary: {
    type: bilingualSchema,
    required: function() {
      return this.status === 'Completed';
    }
  },
  deliverables: {
    type: [deliverableSchema],
    default: []
  },
  completionReportUrl: {
    type: String,
    required: function() {
      return this.status === 'Completed';
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for better query performance
projectSchema.index({ status: 1 });
projectSchema.index({ 'title.en': 'text', 'title.mr': 'text' });
projectSchema.index({ department: 1 });
projectSchema.index({ issueDate: 1 });
projectSchema.index({ completionDate: 1 });

// Virtual for project duration (in days)
projectSchema.virtual('duration').get(function() {
  if (this.status === 'Completed' && this.startDate && this.completionDate) {
    const diffTime = Math.abs(this.completionDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for budget variance
projectSchema.virtual('budgetVariance').get(function() {
  if (this.status === 'Completed' && this.allocatedBudget && this.totalCost) {
    return ((this.totalCost - this.allocatedBudget) / this.allocatedBudget) * 100;
  }
  return null;
});

// Ensure virtual fields are serialized
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

// Pre-save middleware to validate status transitions
projectSchema.pre('save', function(next) {
  // Add validation logic here if needed for status transitions
  // For example, ensuring a project can't go backwards in status
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;