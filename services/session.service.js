const Session = require('../models/session.model');
const User = require('../models/user.model');
const logger = require('../utils/logger');

/**
 * Session service for managing user sessions
 */
class SessionService {
  /**
   * Create a new session
   * @param {string} userId - The user ID
   * @param {string} title - The session title
   * @param {Object} metadata - Additional session metadata
   * @returns {Promise<Object>} The created session
   */
  async createSession(userId, title, language = 'javascript', metadata = {}) {
    try {
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const session = new Session({
        userId,
        title,
        language,
        metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastAccessedAt: new Date()
      });

      await session.save();
      logger.info(`Created session ${session._id} for user ${userId}`);
      
      return session;
    } catch (error) {
      logger.error('Error creating session:', error);
      throw error;
    }
  }

  /**
   * Get a session by ID
   * @param {string} sessionId - The session ID
   * @returns {Promise<Object>} The session
   */
  async getSession(sessionId) {
    try {
      const session = await Session.findById(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }
      
      // Update last accessed time
      session.lastAccessedAt = new Date();
      await session.save();
      
      return session;
    } catch (error) {
      logger.error(`Error retrieving session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Get all sessions for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} The user's sessions
   */
  async getUserSessions(userId) {
    try {
      return await Session.find({ userId }).sort({ updatedAt: -1 });
    } catch (error) {
      logger.error(`Error retrieving sessions for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update a session
   * @param {string} sessionId - The session ID
   * @param {Object} updates - The updates to apply
   * @returns {Promise<Object>} The updated session
   */
  async updateSession(sessionId, updates) {
    try {
      const session = await Session.findByIdAndUpdate(
        sessionId,
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      
      if (!session) {
        throw new Error('Session not found');
      }
      
      logger.info(`Updated session ${sessionId}`);
      return session;
    } catch (error) {
      logger.error(`Error updating session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Add or update content in a session
   * @param {string} sessionId - The session ID
   * @param {string} content - The content to save
   * @returns {Promise<Object>} The updated session
   */
  async updateSessionContent(sessionId, content) {
    return this.updateSession(sessionId, { content });
  }

  /**
   * Add a collaborator to a session
   * @param {string} sessionId - The session ID
   * @param {string} userId - The user ID to add as collaborator
   * @param {string} permissions - The permission level to grant
   * @returns {Promise<Object>} The updated session
   */
  async addCollaborator(sessionId, userId, permissions = 'read') {
    try {
      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const session = await Session.findById(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // Check if user is already a collaborator
      const existingCollaborator = session.collaborators.find(
        collab => collab.userId.toString() === userId
      );

      if (existingCollaborator) {
        // Update permissions if already a collaborator
        existingCollaborator.permissions = permissions;
      } else {
        // Add new collaborator
        session.collaborators.push({
          userId,
          permissions,
          joinedAt: new Date()
        });
      }

      session.updatedAt = new Date();
      await session.save();
      
      logger.info(`Added collaborator ${userId} to session ${sessionId}`);
      return session;
    } catch (error) {
      logger.error(`Error adding collaborator to session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a collaborator from a session
   * @param {string} sessionId - The session ID
   * @param {string} userId - The user ID to remove
   * @returns {Promise<Object>} The updated session
   */
  async removeCollaborator(sessionId, userId) {
    try {
      const session = await Session.findById(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      session.collaborators = session.collaborators.filter(
        collab => collab.userId.toString() !== userId
      );

      session.updatedAt = new Date();
      await session.save();
      
      logger.info(`Removed collaborator ${userId} from session ${sessionId}`);
      return session;
    } catch (error) {
      logger.error(`Error removing collaborator from session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a session
   * @param {string} sessionId - The session ID
   * @returns {Promise<boolean>} Success indicator
   */
  async deleteSession(sessionId) {
    try {
      const result = await Session.findByIdAndDelete(sessionId);
      if (!result) {
        throw new Error('Session not found');
      }
      
      logger.info(`Deleted session ${sessionId}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting session ${sessionId}:`, error);
      throw error;
    }
  }
}

module.exports = new SessionService();
