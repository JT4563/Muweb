const Session = require('../models/session.model');
const User = require('../models/user.model');
const logger = require('../utils/logger');
const redisConfig = require('../config/redis.config');

const sessionController = {
  /**
   * Create a new coding session
   */
  createSession: async (req, res, next) => {
    try {
      const { title, description, language, isPublic, settings } = req.body;
      const userId = req.user.id;

      // Create new session
      const session = new Session({
        title,
        description,
        owner: userId,
        language,
        isPublic: isPublic || false,
        participants: [{
          user: userId,
          role: 'owner',
          joinedAt: new Date(),
          isOnline: false
        }],
        settings: {
          maxParticipants: settings?.maxParticipants || 10,
          allowPublicJoin: settings?.allowPublicJoin || false,
          requireApproval: settings?.requireApproval || false,
          autoSave: settings?.autoSave !== false,
          executionTimeout: settings?.executionTimeout || 30
        }
      });

      await session.save();

      logger.info(`Session created: ${title}`, { 
        sessionId: session._id, 
        userId, 
        language 
      });

      res.status(201).json({
        message: 'Session created successfully',
        session: {
          id: session._id,
          title: session.title,
          description: session.description,
          language: session.language,
          owner: session.owner,
          isPublic: session.isPublic,
          participants: session.participants,
          settings: session.settings,
          createdAt: session.createdAt
        }
      });
    } catch (error) {
      logger.error('Error creating session:', error);
      next(error);
    }
  },

  /**
   * Get user's sessions (owned and participated)
   */
  getUserSessions: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, filter = 'all' } = req.query;

      let query = {};
      
      switch (filter) {
        case 'owned':
          query = { owner: userId, isActive: true };
          break;
        case 'participated':
          query = { 
            'participants.user': userId, 
            owner: { $ne: userId },
            isActive: true 
          };
          break;
        case 'public':
          query = { isPublic: true, isActive: true };
          break;
        default:
          query = {
            $or: [
              { owner: userId },
              { 'participants.user': userId }
            ],
            isActive: true
          };
      }

      const sessions = await Session.find(query)
        .populate('owner', 'username firstName lastName')
        .populate('participants.user', 'username firstName lastName')
        .sort({ 'stats.lastActivity': -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const totalSessions = await Session.countDocuments(query);

      res.json({
        sessions: sessions.map(session => ({
          id: session._id,
          title: session.title,
          description: session.description,
          language: session.language,
          owner: session.owner,
          isPublic: session.isPublic,
          participantsCount: session.participants.length,
          activeParticipantsCount: session.activeParticipantsCount,
          lastActivity: session.stats.lastActivity,
          createdAt: session.createdAt
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalSessions / limit),
          totalSessions,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      logger.error('Error getting user sessions:', error);
      next(error);
    }
  },

  /**
   * Get public sessions
   */
  getPublicSessions: async (req, res, next) => {
    try {
      const { page = 1, limit = 20, language, search } = req.query;

      const query = { isPublic: true, isActive: true };

      if (language) {
        query.language = language;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      const sessions = await Session.find(query)
        .populate('owner', 'username firstName lastName')
        .sort({ 'stats.lastActivity': -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const totalSessions = await Session.countDocuments(query);

      res.json({
        sessions: sessions.map(session => ({
          id: session._id,
          title: session.title,
          description: session.description,
          language: session.language,
          owner: session.owner,
          participantsCount: session.participants.length,
          activeParticipantsCount: session.activeParticipantsCount,
          tags: session.tags,
          lastActivity: session.stats.lastActivity,
          createdAt: session.createdAt
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalSessions / limit),
          totalSessions,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      logger.error('Error getting public sessions:', error);
      next(error);
    }
  },

  /**
   * Search sessions
   */
  searchSessions: async (req, res, next) => {
    try {
      const { q, language, page = 1, limit = 20 } = req.query;
      const userId = req.user.id;

      if (!q) {
        return res.status(400).json({
          error: 'Search query is required',
          code: 'QUERY_REQUIRED'
        });
      }

      const query = {
        $and: [
          {
            $or: [
              { owner: userId },
              { 'participants.user': userId },
              { isPublic: true }
            ]
          },
          {
            $or: [
              { title: { $regex: q, $options: 'i' } },
              { description: { $regex: q, $options: 'i' } },
              { tags: { $in: [new RegExp(q, 'i')] } }
            ]
          }
        ],
        isActive: true
      };

      if (language) {
        query.$and.push({ language });
      }

      const sessions = await Session.find(query)
        .populate('owner', 'username firstName lastName')
        .sort({ 'stats.lastActivity': -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const totalSessions = await Session.countDocuments(query);

      res.json({
        sessions: sessions.map(session => ({
          id: session._id,
          title: session.title,
          description: session.description,
          language: session.language,
          owner: session.owner,
          isPublic: session.isPublic,
          participantsCount: session.participants.length,
          lastActivity: session.stats.lastActivity,
          createdAt: session.createdAt
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalSessions / limit),
          totalSessions,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      logger.error('Error searching sessions:', error);
      next(error);
    }
  },

  /**
   * Get session details
   */
  getSession: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;

      const session = await Session.findById(sessionId)
        .populate('owner', 'username firstName lastName')
        .populate('participants.user', 'username firstName lastName')
        .populate('snapshots.createdBy', 'username firstName lastName');

      if (!session) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
      }

      // Check permissions
      if (!session.hasPermission(userId, 'read')) {
        return res.status(403).json({
          error: 'Access denied',
          code: 'ACCESS_DENIED'
        });
      }

      res.json({
        session: {
          id: session._id,
          title: session.title,
          description: session.description,
          language: session.language,
          code: session.code,
          stdin: session.stdin,
          owner: session.owner,
          isPublic: session.isPublic,
          participants: session.participants,
          settings: session.settings,
          execution: session.execution,
          stats: session.stats,
          tags: session.tags,
          forkFrom: session.forkFrom,
          forksCount: session.forksCount,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt
        }
      });
    } catch (error) {
      logger.error('Error getting session:', error);
      next(error);
    }
  },

  /**
   * Update session
   */
  updateSession: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;
      const updates = req.body;

      const session = await Session.findById(sessionId);
      
      if (!session) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
      }

      // Check permissions (only owner can update session settings)
      if (!session.hasPermission(userId, 'admin')) {
        return res.status(403).json({
          error: 'Only session owner can update settings',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      // Filter allowed updates
      const allowedUpdates = ['title', 'description', 'isPublic', 'settings', 'tags'];
      const filteredUpdates = {};
      
      allowedUpdates.forEach(field => {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      });

      // Update session
      Object.assign(session, filteredUpdates);
      await session.save();

      logger.info(`Session updated: ${sessionId}`, { userId, updates: Object.keys(filteredUpdates) });

      res.json({
        message: 'Session updated successfully',
        session: {
          id: session._id,
          title: session.title,
          description: session.description,
          isPublic: session.isPublic,
          settings: session.settings,
          tags: session.tags,
          updatedAt: session.updatedAt
        }
      });
    } catch (error) {
      logger.error('Error updating session:', error);
      next(error);
    }
  },

  /**
   * Delete session
   */
  deleteSession: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;

      const session = await Session.findById(sessionId);
      
      if (!session) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
      }

      // Check permissions (only owner can delete)
      if (session.owner.toString() !== userId) {
        return res.status(403).json({
          error: 'Only session owner can delete session',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      // Soft delete
      session.isActive = false;
      await session.save();

      // Clear Redis cache
      await redisConfig.deleteSession(sessionId);

      logger.info(`Session deleted: ${sessionId}`, { userId });

      res.json({
        message: 'Session deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting session:', error);
      next(error);
    }
  },

  /**
   * Join a session
   */
  joinSession: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;

      const session = await Session.findById(sessionId)
        .populate('owner', 'username firstName lastName');

      if (!session) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
      }

      // Check if session is active
      if (!session.isActive) {
        return res.status(410).json({
          error: 'Session is no longer active',
          code: 'SESSION_INACTIVE'
        });
      }

      // Check permissions
      if (!session.hasPermission(userId, 'read')) {
        return res.status(403).json({
          error: 'Access denied. Session is private.',
          code: 'ACCESS_DENIED'
        });
      }

      // Try to add participant
      try {
        const added = session.addParticipant(userId, 'viewer');
        
        if (!added) {
          return res.status(409).json({
            error: 'You are already a participant in this session',
            code: 'ALREADY_PARTICIPANT'
          });
        }

        await session.save();

        logger.info(`User joined session: ${userId} -> ${sessionId}`);

        res.json({
          message: 'Successfully joined session',
          session: {
            id: session._id,
            title: session.title,
            description: session.description,
            language: session.language,
            owner: session.owner,
            participantsCount: session.participants.length
          }
        });
      } catch (error) {
        if (error.message.includes('maximum participants')) {
          return res.status(409).json({
            error: error.message,
            code: 'SESSION_FULL'
          });
        }
        throw error;
      }
    } catch (error) {
      logger.error('Error joining session:', error);
      next(error);
    }
  },

  /**
   * Leave a session
   */
  leaveSession: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;

      const session = await Session.findById(sessionId);
      
      if (!session) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
      }

      // Check if user is owner
      if (session.owner.toString() === userId) {
        return res.status(400).json({
          error: 'Session owner cannot leave session. Delete session instead.',
          code: 'OWNER_CANNOT_LEAVE'
        });
      }

      // Remove participant
      const removed = session.removeParticipant(userId);
      
      if (!removed) {
        return res.status(404).json({
          error: 'You are not a participant in this session',
          code: 'NOT_PARTICIPANT'
        });
      }

      await session.save();

      logger.info(`User left session: ${userId} -> ${sessionId}`);

      res.json({
        message: 'Successfully left session'
      });
    } catch (error) {
      logger.error('Error leaving session:', error);
      next(error);
    }
  },

  /**
   * Fork a session
   */
  forkSession: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { title, description } = req.body;
      const userId = req.user.id;

      if (!title) {
        return res.status(400).json({
          error: 'Title is required for forked session',
          code: 'TITLE_REQUIRED'
        });
      }

      const originalSession = await Session.findById(sessionId);
      
      if (!originalSession) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
      }

      // Check read permissions
      if (!originalSession.hasPermission(userId, 'read')) {
        return res.status(403).json({
          error: 'Access denied',
          code: 'ACCESS_DENIED'
        });
      }

      // Create forked session
      const forkedSession = originalSession.fork(userId, title, description);
      await forkedSession.save();

      // Update original session fork count
      await originalSession.save();

      logger.info(`Session forked: ${sessionId} -> ${forkedSession._id}`, { userId });

      res.status(201).json({
        message: 'Session forked successfully',
        session: {
          id: forkedSession._id,
          title: forkedSession.title,
          description: forkedSession.description,
          language: forkedSession.language,
          code: forkedSession.code,
          forkFrom: forkedSession.forkFrom,
          createdAt: forkedSession.createdAt
        }
      });
    } catch (error) {
      logger.error('Error forking session:', error);
      next(error);
    }
  },

  /**
   * Get session snapshots
   */
  getSnapshots: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;

      const session = await Session.findById(sessionId)
        .populate('snapshots.createdBy', 'username firstName lastName');

      if (!session) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
      }

      // Check permissions
      if (!session.hasPermission(userId, 'read')) {
        return res.status(403).json({
          error: 'Access denied',
          code: 'ACCESS_DENIED'
        });
      }

      // Paginate snapshots
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const snapshots = session.snapshots
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(startIndex, endIndex);

      res.json({
        snapshots: snapshots.map(snapshot => ({
          version: snapshot.version,
          message: snapshot.message,
          createdBy: snapshot.createdBy,
          createdAt: snapshot.createdAt,
          changes: snapshot.changes
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(session.snapshots.length / limit),
          totalSnapshots: session.snapshots.length,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      logger.error('Error getting snapshots:', error);
      next(error);
    }
  },

  /**
   * Create session snapshot
   */
  createSnapshot: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { message } = req.body;
      const userId = req.user.id;

      const session = await Session.findById(sessionId);
      
      if (!session) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
      }

      // Check permissions
      if (!session.hasPermission(userId, 'write')) {
        return res.status(403).json({
          error: 'Write access required to create snapshots',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      // Create snapshot
      const version = session.createSnapshot(userId, message);
      await session.save();

      logger.info(`Snapshot created: ${sessionId} v${version}`, { userId });

      res.status(201).json({
        message: 'Snapshot created successfully',
        version,
        createdAt: new Date()
      });
    } catch (error) {
      logger.error('Error creating snapshot:', error);
      next(error);
    }
  },

  /**
   * Get execution history
   */
  getExecutionHistory: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;
      const { page = 1, limit = 50 } = req.query;

      const session = await Session.findById(sessionId)
        .populate('execution.history.executedBy', 'username firstName lastName');

      if (!session) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
      }

      // Check permissions
      if (!session.hasPermission(userId, 'read')) {
        return res.status(403).json({
          error: 'Access denied',
          code: 'ACCESS_DENIED'
        });
      }

      // Paginate execution history
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const history = session.execution.history
        .sort((a, b) => b.executedAt - a.executedAt)
        .slice(startIndex, endIndex);

      res.json({
        executions: history.map(exec => ({
          output: exec.output,
          error: exec.error,
          executedAt: exec.executedAt,
          executedBy: exec.executedBy,
          language: exec.language,
          executionTime: exec.executionTime
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(session.execution.history.length / limit),
          totalExecutions: session.execution.history.length,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      logger.error('Error getting execution history:', error);
      next(error);
    }
  },

  /**
   * Update participant role
   */
  updateParticipantRole: async (req, res, next) => {
    try {
      const { sessionId, userId: targetUserId } = req.params;
      const { role } = req.body;
      const userId = req.user.id;

      if (!['viewer', 'editor'].includes(role)) {
        return res.status(400).json({
          error: 'Invalid role. Must be viewer or editor.',
          code: 'INVALID_ROLE'
        });
      }

      const session = await Session.findById(sessionId);
      
      if (!session) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
      }

      // Check permissions (only owner can change roles)
      if (!session.hasPermission(userId, 'admin')) {
        return res.status(403).json({
          error: 'Only session owner can change participant roles',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      // Find participant
      const participant = session.participants.find(
        p => p.user.toString() === targetUserId
      );

      if (!participant) {
        return res.status(404).json({
          error: 'Participant not found',
          code: 'PARTICIPANT_NOT_FOUND'
        });
      }

      // Cannot change owner role
      if (participant.role === 'owner') {
        return res.status(400).json({
          error: 'Cannot change owner role',
          code: 'CANNOT_CHANGE_OWNER'
        });
      }

      // Update role
      participant.role = role;
      await session.save();

      logger.info(`Participant role updated: ${targetUserId} -> ${role}`, { sessionId, userId });

      res.json({
        message: 'Participant role updated successfully',
        participant: {
          userId: participant.user,
          role: participant.role
        }
      });
    } catch (error) {
      logger.error('Error updating participant role:', error);
      next(error);
    }
  },

  /**
   * Remove participant from session
   */
  removeParticipant: async (req, res, next) => {
    try {
      const { sessionId, userId: targetUserId } = req.params;
      const userId = req.user.id;

      const session = await Session.findById(sessionId);
      
      if (!session) {
        return res.status(404).json({
          error: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
      }

      // Check permissions (only owner can remove participants)
      if (!session.hasPermission(userId, 'admin')) {
        return res.status(403).json({
          error: 'Only session owner can remove participants',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      // Cannot remove owner
      if (session.owner.toString() === targetUserId) {
        return res.status(400).json({
          error: 'Cannot remove session owner',
          code: 'CANNOT_REMOVE_OWNER'
        });
      }

      // Remove participant
      const removed = session.removeParticipant(targetUserId);
      
      if (!removed) {
        return res.status(404).json({
          error: 'Participant not found',
          code: 'PARTICIPANT_NOT_FOUND'
        });
      }

      await session.save();

      logger.info(`Participant removed: ${targetUserId}`, { sessionId, userId });

      res.json({
        message: 'Participant removed successfully'
      });
    } catch (error) {
      logger.error('Error removing participant:', error);
      next(error);
    }
  }
};

module.exports = sessionController;
