const mongoose = require("mongoose");

/**
 * Session schema for user coding sessions
 */
const sessionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    trim: true,
    default: "javascript",
  },
  content: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        enum: ["viewer", "editor", "admin"],
        default: "viewer",
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      isOnline: {
        type: Boolean,
        default: false,
      },
    },
  ],
  snapshots: [
    {
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      title: String,
      content: String,
      message: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  execution: {
    lastExecutedAt: Date,
    count: {
      type: Number,
      default: 0,
    },
    history: [
      {
        executedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        language: String,
        output: String,
        error: String,
        exitCode: Number,
        executedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  stats: {
    lastActivity: Date,
    totalExecutions: {
      type: Number,
      default: 0,
    },
    activeParticipants: {
      type: Number,
      default: 0,
    },
  },
  forkFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    default: null,
  },
  forksCount: {
    type: Number,
    default: 0,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to update updatedAt timestamp
sessionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Check if a user has permission for an action
 * @param {string|ObjectId} userId - User ID to check
 * @param {string} action - Action to verify: 'read', 'write', 'admin'
 * @returns {boolean} True if user has permission
 */
sessionSchema.methods.hasPermission = function (userId, action = "read") {
  // Owner has all permissions
  if (this.owner.toString() === userId.toString()) {
    return true;
  }

  // Check participant permissions
  const participant = this.participants.find(
    (p) => p.user.toString() === userId.toString()
  );

  if (!participant) {
    return false;
  }

  // Permission hierarchy: viewer < editor < admin
  const permissions = { viewer: 1, editor: 2, admin: 3 };
  const requiredLevel = permissions[action] || 0;
  const userLevel = permissions[participant.role] || 0;

  return userLevel >= requiredLevel;
};

/**
 * Add a participant to the session
 * @param {string|ObjectId} userId - User ID to add
 * @param {string} role - Role: 'viewer', 'editor', 'admin'
 * @returns {Promise<void>}
 */
sessionSchema.methods.addParticipant = async function (
  userId,
  role = "viewer"
) {
  // Check if user is already a participant
  const existingIndex = this.participants.findIndex(
    (p) => p.user.toString() === userId.toString()
  );

  if (existingIndex >= 0) {
    // Update existing participant role
    this.participants[existingIndex].role = role;
    this.participants[existingIndex].isOnline = true;
    this.participants[existingIndex].joinedAt = new Date();
  } else {
    // Add new participant
    this.participants.push({
      user: userId,
      role,
      joinedAt: new Date(),
      isOnline: true,
    });
  }

  // Update stats
  this.stats.activeParticipants = this.participants.filter(
    (p) => p.isOnline
  ).length;
  this.stats.lastActivity = new Date();

  await this.save();
};

/**
 * Remove a participant from the session
 * @param {string|ObjectId} userId - User ID to remove
 * @returns {Promise<void>}
 */
sessionSchema.methods.removeParticipant = async function (userId) {
  this.participants = this.participants.filter(
    (p) => p.user.toString() !== userId.toString()
  );

  this.stats.activeParticipants = this.participants.filter(
    (p) => p.isOnline
  ).length;
  this.stats.lastActivity = new Date();

  await this.save();
};

/**
 * Update participant online status
 * @param {string|ObjectId} userId - User ID
 * @param {boolean} isOnline - Online status
 * @returns {Promise<void>}
 */
sessionSchema.methods.updateParticipantStatus = async function (
  userId,
  isOnline
) {
  const participant = this.participants.find(
    (p) => p.user.toString() === userId.toString()
  );

  if (participant) {
    participant.isOnline = isOnline;
    this.stats.activeParticipants = this.participants.filter(
      (p) => p.isOnline
    ).length;
    this.stats.lastActivity = new Date();
    await this.save();
  }
};

/**
 * Create a snapshot of the current session state
 * @param {string|ObjectId} userId - User creating the snapshot
 * @param {string} message - Snapshot message/description
 * @returns {Promise<Object>} Snapshot object
 */
sessionSchema.methods.createSnapshot = async function (userId, message = "") {
  const snapshot = {
    createdBy: userId,
    title: `Snapshot - ${new Date().toLocaleString()}`,
    content: this.content,
    message,
    createdAt: new Date(),
  };

  this.snapshots.push(snapshot);
  this.stats.lastActivity = new Date();
  await this.save();

  return snapshot;
};

/**
 * Fork this session to create a new one
 * @param {string|ObjectId} userId - User forking the session
 * @param {string} title - Title for forked session
 * @param {string} description - Description for forked session
 * @returns {Promise<Object>} Newly created forked session
 */
sessionSchema.methods.fork = async function (userId, title, description = "") {
  const Session = this.constructor;

  const forkedSession = new Session({
    owner: userId,
    title,
    description,
    language: this.language,
    content: this.content,
    isPublic: this.isPublic,
    forkFrom: this._id,
    metadata: { ...this.metadata },
  });

  await forkedSession.save();

  // Increment fork count on original
  this.forksCount += 1;
  this.stats.lastActivity = new Date();
  await this.save();

  return forkedSession;
};

/**
 * Add an execution record to the session
 * @param {Object} executionData - Execution data
 * @returns {Promise<void>}
 */
sessionSchema.methods.addExecution = async function (executionData) {
  this.execution.history.push({
    executedBy: executionData.userId,
    language: executionData.language,
    output: executionData.output,
    error: executionData.error,
    exitCode: executionData.exitCode,
    executedAt: new Date(),
  });

  this.execution.lastExecutedAt = new Date();
  this.execution.count += 1;
  this.stats.totalExecutions = this.execution.count;
  this.stats.lastActivity = new Date();

  await this.save();
};

// Add indexes for common queries
sessionSchema.index({ userId: 1, createdAt: -1 });
sessionSchema.index({ isPublic: 1, updatedAt: -1 });

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
