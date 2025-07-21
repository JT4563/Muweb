const jwt = require('jsonwebtoken');
const Session = require('../models/session.model');
const User = require('../models/user.model');
const redisConfig = require('../config/redis.config');
const logger = require('../utils/logger');
const crdtUtils = require('./crdt.utils');

class SocketServer {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // socketId -> userInfo
    this.userSockets = new Map(); // userId -> Set of socketIds
    this.sessionRooms = new Map(); // sessionId -> Set of socketIds
  }

  /**
   * Initialize socket server
   * @param {Object} io - Socket.IO instance
   */
  init(io) {
    this.io = io;
    
    // Middleware for authentication
    io.use(this.authenticateSocket.bind(this));
    
    // Handle connections
    io.on('connection', this.handleConnection.bind(this));
    
    logger.info('Socket server initialized');
  }

  /**
   * Authenticate socket connection
   */
  async authenticateSocket(socket, next) {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      
      if (!token) {
        throw new Error('Authentication token required');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      socket.userId = user._id.toString();
      socket.user = {
        id: user._id.toString(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };
      
      next();
    } catch (error) {
      logger.error('Socket authentication failed:', error.message);
      next(new Error('Authentication failed'));
    }
  }

  /**
   * Handle new socket connection
   */
  async handleConnection(socket) {
    const userId = socket.userId;
    const user = socket.user;
    
    logger.info(`User connected: ${user.username}`, { 
      userId, 
      socketId: socket.id 
    });

    // Store user connection info
    this.connectedUsers.set(socket.id, {
      userId,
      user,
      connectedAt: new Date(),
      currentSession: null
    });

    // Add to user sockets map
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(socket.id);

    // Store in Redis for cross-server communication
    await redisConfig.setUserSocket(userId, socket.id, null);

    // Set up event handlers
    this.setupEventHandlers(socket);

    // Handle disconnection
    socket.on('disconnect', () => this.handleDisconnection(socket));
  }

  /**
   * Set up event handlers for socket
   */
  setupEventHandlers(socket) {
    // Session events
    socket.on('session:join', (data) => this.handleSessionJoin(socket, data));
    socket.on('session:leave', (data) => this.handleSessionLeave(socket, data));
    
    // Code collaboration events
    socket.on('code:change', (data) => this.handleCodeChange(socket, data));
    socket.on('code:cursor', (data) => this.handleCursorMove(socket, data));
    socket.on('code:selection', (data) => this.handleSelection(socket, data));
    
    // Execution events
    socket.on('execution:start', (data) => this.handleExecutionStart(socket, data));
    socket.on('execution:result', (data) => this.handleExecutionResult(socket, data));
    
    // Chat events
    socket.on('chat:message', (data) => this.handleChatMessage(socket, data));
    socket.on('chat:typing', (data) => this.handleTyping(socket, data));
    
    // Collaboration events
    socket.on('collaboration:request', (data) => this.handleCollaborationRequest(socket, data));
    socket.on('collaboration:response', (data) => this.handleCollaborationResponse(socket, data));
    
    // Heartbeat
    socket.on('ping', () => socket.emit('pong'));
    
    // Error handling
    socket.on('error', (error) => {
      logger.error('Socket error:', error, { 
        userId: socket.userId, 
        socketId: socket.id 
      });
    });
  }

  /**
   * Handle session join
   */
  async handleSessionJoin(socket, data) {
    try {
      const { sessionId } = data;
      const userId = socket.userId;

      // Validate session
      const session = await Session.findById(sessionId)
        .populate('owner', 'username firstName lastName')
        .populate('participants.user', 'username firstName lastName');

      if (!session) {
        socket.emit('session:error', { 
          message: 'Session not found',
          code: 'SESSION_NOT_FOUND'
        });
        return;
      }

      // Check permissions
      if (!session.hasPermission(userId, 'read')) {
        socket.emit('session:error', { 
          message: 'Access denied',
          code: 'ACCESS_DENIED'
        });
        return;
      }

      // Join socket room
      socket.join(`session:${sessionId}`);
      
      // Update connection info
      const userInfo = this.connectedUsers.get(socket.id);
      if (userInfo) {
        userInfo.currentSession = sessionId;
      }

      // Add to session room tracking
      if (!this.sessionRooms.has(sessionId)) {
        this.sessionRooms.set(sessionId, new Set());
      }
      this.sessionRooms.get(sessionId).add(socket.id);

      // Update participant status in session
      session.updateParticipantStatus(userId, true);
      await session.save();

      // Store session mapping in Redis
      await redisConfig.setUserSocket(userId, socket.id, sessionId);

      // Notify session of new participant
      socket.to(`session:${sessionId}`).emit('session:participant_joined', {
        user: socket.user,
        timestamp: new Date()
      });

      // Send session data to user
      socket.emit('session:joined', {
        session: {
          id: session._id,
          title: session.title,
          description: session.description,
          language: session.language,
          code: session.code,
          stdin: session.stdin,
          owner: session.owner,
          participants: session.participants,
          settings: session.settings,
          isPublic: session.isPublic
        },
        participants: this.getSessionParticipants(sessionId),
        timestamp: new Date()
      });

      logger.info(`User joined session: ${userId} -> ${sessionId}`);
      
    } catch (error) {
      logger.error('Error joining session:', error);
      socket.emit('session:error', { 
        message: 'Failed to join session',
        code: 'JOIN_FAILED'
      });
    }
  }

  /**
   * Handle session leave
   */
  async handleSessionLeave(socket, data) {
    try {
      const { sessionId } = data;
      const userId = socket.userId;

      // Leave socket room
      socket.leave(`session:${sessionId}`);

      // Update connection info
      const userInfo = this.connectedUsers.get(socket.id);
      if (userInfo) {
        userInfo.currentSession = null;
      }

      // Remove from session room tracking
      if (this.sessionRooms.has(sessionId)) {
        this.sessionRooms.get(sessionId).delete(socket.id);
        if (this.sessionRooms.get(sessionId).size === 0) {
          this.sessionRooms.delete(sessionId);
        }
      }

      // Update participant status in session
      const session = await Session.findById(sessionId);
      if (session) {
        session.updateParticipantStatus(userId, false);
        await session.save();
      }

      // Remove session mapping from Redis
      await redisConfig.setUserSocket(userId, socket.id, null);

      // Notify session of participant leaving
      socket.to(`session:${sessionId}`).emit('session:participant_left', {
        user: socket.user,
        timestamp: new Date()
      });

      socket.emit('session:left', { sessionId });

      logger.info(`User left session: ${userId} -> ${sessionId}`);
      
    } catch (error) {
      logger.error('Error leaving session:', error);
      socket.emit('session:error', { 
        message: 'Failed to leave session',
        code: 'LEAVE_FAILED'
      });
    }
  }

  /**
   * Handle code changes with CRDT
   */
  async handleCodeChange(socket, data) {
    try {
      const { sessionId, operation, changes } = data;
      const userId = socket.userId;

      // Validate session access
      const session = await Session.findById(sessionId);
      if (!session || !session.hasPermission(userId, 'write')) {
        socket.emit('code:error', { 
          message: 'Write access denied',
          code: 'WRITE_ACCESS_DENIED'
        });
        return;
      }

      // Apply CRDT operations
      const processedOperation = crdtUtils.processOperation(operation, {
        userId,
        timestamp: Date.now(),
        sessionId
      });

      // Update session code
      session.code = processedOperation.resultingCode;
      await session.save();

      // Broadcast changes to other participants
      socket.to(`session:${sessionId}`).emit('code:change', {
        operation: processedOperation,
        author: socket.user,
        timestamp: new Date()
      });

      // Auto-save snapshot every 10 minutes
      this.scheduleAutoSave(sessionId, userId);

      logger.debug(`Code change applied: ${sessionId}`, { 
        userId,
        operation: operation.type
      });
      
    } catch (error) {
      logger.error('Error handling code change:', error);
      socket.emit('code:error', { 
        message: 'Failed to apply code changes',
        code: 'CODE_CHANGE_FAILED'
      });
    }
  }

  /**
   * Handle cursor movement
   */
  handleCursorMove(socket, data) {
    try {
      const { sessionId, cursor } = data;
      const userInfo = this.connectedUsers.get(socket.id);

      if (userInfo?.currentSession !== sessionId) {
        return;
      }

      // Broadcast cursor position to other participants
      socket.to(`session:${sessionId}`).emit('code:cursor', {
        user: socket.user,
        cursor,
        timestamp: new Date()
      });
      
    } catch (error) {
      logger.error('Error handling cursor move:', error);
    }
  }

  /**
   * Handle text selection
   */
  handleSelection(socket, data) {
    try {
      const { sessionId, selection } = data;
      const userInfo = this.connectedUsers.get(socket.id);

      if (userInfo?.currentSession !== sessionId) {
        return;
      }

      // Broadcast selection to other participants
      socket.to(`session:${sessionId}`).emit('code:selection', {
        user: socket.user,
        selection,
        timestamp: new Date()
      });
      
    } catch (error) {
      logger.error('Error handling selection:', error);
    }
  }

  /**
   * Handle execution start
   */
  handleExecutionStart(socket, data) {
    try {
      const { sessionId } = data;

      // Broadcast execution start to all participants
      this.io.to(`session:${sessionId}`).emit('execution:started', {
        user: socket.user,
        timestamp: new Date()
      });
      
    } catch (error) {
      logger.error('Error handling execution start:', error);
    }
  }

  /**
   * Handle execution result
   */
  async handleExecutionResult(socket, data) {
    try {
      const { sessionId, output, error, executionTime } = data;
      const userId = socket.userId;

      // Update session with execution result
      const session = await Session.findById(sessionId);
      if (session) {
        session.addExecution({
          code: session.code,
          stdin: session.stdin,
          output,
          error,
          userId,
          language: session.language,
          executionTime
        });
        await session.save();
      }

      // Broadcast result to all participants
      this.io.to(`session:${sessionId}`).emit('execution:result', {
        output,
        error,
        executionTime,
        user: socket.user,
        timestamp: new Date()
      });

      logger.info(`Code executed in session: ${sessionId}`, {
        userId,
        executionTime,
        hasError: !!error
      });
      
    } catch (error) {
      logger.error('Error handling execution result:', error);
    }
  }

  /**
   * Handle chat message
   */
  handleChatMessage(socket, data) {
    try {
      const { sessionId, message } = data;
      const userInfo = this.connectedUsers.get(socket.id);

      if (userInfo?.currentSession !== sessionId) {
        return;
      }

      // Broadcast message to all participants
      this.io.to(`session:${sessionId}`).emit('chat:message', {
        id: Date.now().toString(),
        message,
        user: socket.user,
        timestamp: new Date()
      });

      logger.debug(`Chat message sent: ${sessionId}`, {
        userId: socket.userId,
        messageLength: message.length
      });
      
    } catch (error) {
      logger.error('Error handling chat message:', error);
    }
  }

  /**
   * Handle typing indicator
   */
  handleTyping(socket, data) {
    try {
      const { sessionId, isTyping } = data;
      const userInfo = this.connectedUsers.get(socket.id);

      if (userInfo?.currentSession !== sessionId) {
        return;
      }

      // Broadcast typing status to other participants
      socket.to(`session:${sessionId}`).emit('chat:typing', {
        user: socket.user,
        isTyping,
        timestamp: new Date()
      });
      
    } catch (error) {
      logger.error('Error handling typing:', error);
    }
  }

  /**
   * Handle disconnection
   */
  async handleDisconnection(socket) {
    try {
      const userId = socket.userId;
      const userInfo = this.connectedUsers.get(socket.id);

      logger.info(`User disconnected: ${socket.user?.username}`, { 
        userId, 
        socketId: socket.id 
      });

      // Remove from connected users
      this.connectedUsers.delete(socket.id);

      // Remove from user sockets map
      if (this.userSockets.has(userId)) {
        this.userSockets.get(userId).delete(socket.id);
        if (this.userSockets.get(userId).size === 0) {
          this.userSockets.delete(userId);
        }
      }

      // If user was in a session, update status
      if (userInfo?.currentSession) {
        const sessionId = userInfo.currentSession;
        
        // Remove from session room
        if (this.sessionRooms.has(sessionId)) {
          this.sessionRooms.get(sessionId).delete(socket.id);
        }

        // Update participant status
        const session = await Session.findById(sessionId);
        if (session) {
          session.updateParticipantStatus(userId, false);
          await session.save();
        }

        // Notify other participants
        socket.to(`session:${sessionId}`).emit('session:participant_left', {
          user: socket.user,
          timestamp: new Date()
        });
      }

      // Remove from Redis
      await redisConfig.removeUserSocket(userId, socket.id);
      
    } catch (error) {
      logger.error('Error handling disconnection:', error);
    }
  }

  /**
   * Get session participants info
   */
  getSessionParticipants(sessionId) {
    const socketIds = this.sessionRooms.get(sessionId) || new Set();
    const participants = [];

    for (const socketId of socketIds) {
      const userInfo = this.connectedUsers.get(socketId);
      if (userInfo) {
        participants.push({
          ...userInfo.user,
          socketId,
          connectedAt: userInfo.connectedAt
        });
      }
    }

    return participants;
  }

  /**
   * Schedule auto-save for session
   */
  scheduleAutoSave(sessionId, userId) {
    const key = `autosave:${sessionId}`;
    
    // Clear existing timeout
    if (this.autoSaveTimeouts && this.autoSaveTimeouts[key]) {
      clearTimeout(this.autoSaveTimeouts[key]);
    }

    if (!this.autoSaveTimeouts) {
      this.autoSaveTimeouts = {};
    }

    // Schedule new auto-save
    this.autoSaveTimeouts[key] = setTimeout(async () => {
      try {
        const session = await Session.findById(sessionId);
        if (session) {
          session.createSnapshot(userId, 'Auto-save snapshot');
          await session.save();
          
          // Notify participants
          this.io.to(`session:${sessionId}`).emit('session:auto_saved', {
            timestamp: new Date()
          });
        }
      } catch (error) {
        logger.error('Auto-save failed:', error);
      }
      
      delete this.autoSaveTimeouts[key];
    }, 10 * 60 * 1000); // 10 minutes
  }

  /**
   * Broadcast to all users
   */
  broadcast(event, data) {
    this.io.emit(event, data);
  }

  /**
   * Send to specific user (all their sockets)
   */
  sendToUser(userId, event, data) {
    const socketIds = this.userSockets.get(userId);
    if (socketIds) {
      for (const socketId of socketIds) {
        this.io.to(socketId).emit(event, data);
      }
    }
  }

  /**
   * Send to session
   */
  sendToSession(sessionId, event, data) {
    this.io.to(`session:${sessionId}`).emit(event, data);
  }

  /**
   * Get connection stats
   */
  getStats() {
    return {
      connectedUsers: this.connectedUsers.size,
      activeSessions: this.sessionRooms.size,
      totalSocketConnections: this.userSockets.size
    };
  }
}

module.exports = new SocketServer();
