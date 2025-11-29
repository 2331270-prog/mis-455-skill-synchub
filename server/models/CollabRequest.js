const mongoose = require('mongoose');

const collabRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    trim: true
  },
  skill: {
    type: String,
    required: [true, 'Please provide the skill you want to share'],
    trim: true,
    maxlength: [100, 'Skill cannot exceed 100 characters']
  },
  projectIdea: {
    type: String,
    required: [true, 'Please describe your project idea'],
    trim: true,
    maxlength: [500, 'Project idea cannot exceed 500 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide a detailed message'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in-progress'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  response: {
    message: {
      type: String,
      trim: true
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
collabRequestSchema.index({ status: 1, createdAt: -1 });
collabRequestSchema.index({ skill: 1 });

// Virtual for request age
collabRequestSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Static method to get pending requests
collabRequestSchema.statics.getPendingRequests = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: 1 });
};

// Static method to get requests by status
collabRequestSchema.statics.getRequestsByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Method to update status and response
collabRequestSchema.methods.updateStatus = function(status, message, userId) {
  this.status = status;
  if (message) {
    this.response = {
      message,
      respondedBy: userId,
      respondedAt: new Date()
    };
  }
  return this.save();
};

module.exports = mongoose.model('CollabRequest', collabRequestSchema);