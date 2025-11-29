const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide project title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide project description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  objectives: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      maxlength: [500, 'Objective description cannot exceed 500 characters']
    }
  }],
  isEditable: {
    type: Boolean,
    default: true
  },
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Pre-save middleware to increment version
proposalSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.version += 1;
  }
  next();
});

// Static method to get current proposal
proposalSchema.statics.getCurrentProposal = function() {
  return this.findOne({ status: 'published' }).sort({ version: -1 });
};

// Virtual for full objectives
proposalSchema.virtual('fullObjectives').get(function() {
  return this.objectives.map(obj => ({
    title: obj.title,
    description: obj.description
  }));
});

module.exports = mongoose.model('Proposal', proposalSchema);