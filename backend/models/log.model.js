const mongoose = require('mongoose');

/**
 * Log schema for activity and system logging
 */
const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['info', 'warn', 'error', 'debug'],
    default: 'info',
    index: true
  },
  message: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Add TTL index for automatic cleanup of old logs
// This will remove logs after 30 days (2592000 seconds)
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

// Create compound indexes for common queries
logSchema.index({ level: 1, timestamp: -1 });
logSchema.index({ userId: 1, timestamp: -1 });
logSchema.index({ sessionId: 1, timestamp: -1 });

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
