// models/Member.js
const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  company: { type: String, trim: true, default: '' },
  duration: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
}, { _id: false });

const memberSchema = new mongoose.Schema({
  // Optional external id coming from seed data or legacy system
  externalId: { type: mongoose.Schema.Types.Mixed, index: true, default: undefined },

  // Primary display fields
  name: {
    type: String,
    required: [true, 'Please provide member name'],
    trim: true,
    default: 'Unknown'
  },

  // Keep both photo and image for compatibility with different parts of the app
  photo: {
    type: String,
    trim: true,
    default: 'default-avatar.jpg'
  },
  image: {
    type: String,
    trim: true,
    default: function () { return this.photo || 'default-avatar.jpg'; }
  },

  // Role / position fields (frontend uses `role` in examples)
  role: { type: String, trim: true, default: '' },
  position: { type: String, trim: true, default: '' },

  // profile url (could be relative path or full URL)
  profileUrl: { type: String, trim: true, default: '' },

  // Bio and contact
  bio: {
    type: String,
    required: [true, 'Please provide a short bio'],
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    default: ''
  },
  email: { type: String, trim: true, default: '' },

  // Student / department info
  department: { type: String, trim: true, default: '' },
  studentId: { type: String, trim: true, default: '' },

  // Arrays: make sure they default to empty arrays to avoid runtime errors
  skills: {
    type: [String],
    default: []
  },
  languages: {
    type: [String],
    default: []
  },
  experience: {
    type: [experienceSchema],
    default: []
  },

  // Other optional fields
  hobbies: {
    type: [String],
    default: []
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure `image` always returns a value (fallback to photo)
memberSchema.pre('save', function (next) {
  if (!this.image && this.photo) this.image = this.photo;
  if (!this.photo && this.image) this.photo = this.image;
  next();
});

// Virtual for full profile URL (prefers profileUrl; falls back to FRONTEND_URL + members/:id)
memberSchema.virtual('fullProfileUrl').get(function () {
  if (this.profileUrl) {
    // If profileUrl looks like a path (starts with /) or full url, return it as-is or resolved
    if (this.profileUrl.startsWith('http://') || this.profileUrl.startsWith('https://') || this.profileUrl.startsWith('/')) {
      return this.profileUrl;
    }
    // otherwise assume it's a relative path within public
    return `/${this.profileUrl}`;
  }
  const frontend = process.env.FRONTEND_URL || '';
  return frontend ? `${frontend.replace(/\/$/, '')}/members/${this._id}` : `/members/${this._id}`;
});

// Static helper to get active members sorted newest first
memberSchema.statics.getActiveMembers = function () {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

// Optional: instance method to return a plain object suitable for frontend
memberSchema.methods.toFrontend = function () {
  const obj = this.toObject();
  // ensure arrays and image exist
  obj.skills = Array.isArray(obj.skills) ? obj.skills : [];
  obj.languages = Array.isArray(obj.languages) ? obj.languages : [];
  obj.experience = Array.isArray(obj.experience) ? obj.experience : [];
  obj.image = obj.image || obj.photo || '/assets/default-avatar.jpg';
  obj.profileUrl = obj.profileUrl || '';
  return obj;
};

module.exports = mongoose.model('Member', memberSchema);
