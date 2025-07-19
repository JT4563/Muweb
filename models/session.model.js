const mongoose = require('mongoose');

/**
 * Session schema for user coding sessions
 */
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    trim: true,
    default: 'javascript'
  },
  content: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  collaborators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permissions: {
      type: String,
      enum: ['read', 'write', 'admin'],
      default: 'read'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update updatedAt timestamp
sessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for common queries
sessionSchema.index({ userId: 1, createdAt: -1 });
sessionSchema.index({ isPublic: 1, updatedAt: -1 });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
