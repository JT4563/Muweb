const { createClient } = require("redis");
const logger = require("../utils/logger");
require("dotenv").config();

/**
 * Redis configuration and connection management
 */
const redisConfig = {
  /**
   * Create and connect to a Redis client
   * @returns {Promise<Object>} Redis client instance
   */
  createClient: async () => {
    try {
      const redisHost = process.env.REDIS_HOST || "localhost";
      const redisPort = process.env.REDIS_PORT || 6379;

      const client = createClient({
        url: `redis://${redisHost}:${redisPort}`,
      });

      // Set up error handling
      client.on("error", (err) => {
        logger.error("Redis client error:", err);
      });

      // Connect to Redis
      await client.connect();
      logger.info("Connected to Redis server");

      return client;
    } catch (error) {
      logger.error("Error connecting to Redis:", error);
      throw error;
    }
  },

  /**
   * Disconnect from Redis server
   * @param {Object} client - Redis client to disconnect
   * @returns {Promise<void>}
   */
  disconnect: async (client) => {
    if (client && client.isOpen) {
      await client.quit();
      logger.info("Disconnected from Redis server");
    }
  },

  /**
   * Store refresh token in Redis with expiration
   * @param {Object} client - Redis client
   * @param {string} userId - User ID
   * @param {string} token - Refresh token
   * @param {number} expirySeconds - Expiration time in seconds (default: 7 days)
   * @returns {Promise<string>} Redis response
   */
  setRefreshToken: async (client, userId, token, expirySeconds = 604800) => {
    try {
      const key = `refresh_token:${userId}`;
      const response = await client.setEx(key, expirySeconds, token);
      logger.debug(`Stored refresh token for user ${userId}`);
      return response;
    } catch (error) {
      logger.error(`Error storing refresh token for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Retrieve refresh token from Redis
   * @param {Object} client - Redis client
   * @param {string} userId - User ID
   * @returns {Promise<string|null>} Refresh token or null if not found
   */
  getRefreshToken: async (client, userId) => {
    try {
      const key = `refresh_token:${userId}`;
      const token = await client.get(key);
      return token;
    } catch (error) {
      logger.error(`Error retrieving refresh token for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Delete refresh token from Redis
   * @param {Object} client - Redis client
   * @param {string} userId - User ID
   * @returns {Promise<number>} Number of keys deleted
   */
  deleteRefreshToken: async (client, userId) => {
    try {
      const key = `refresh_token:${userId}`;
      const response = await client.del(key);
      logger.debug(`Deleted refresh token for user ${userId}`);
      return response;
    } catch (error) {
      logger.error(`Error deleting refresh token for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Store session data in Redis cache
   * @param {Object} client - Redis client
   * @param {string} sessionId - Session ID
   * @param {Object} sessionData - Session data to cache
   * @param {number} expirySeconds - Expiration time in seconds (default: 24 hours)
   * @returns {Promise<string>} Redis response
   */
  setSession: async (client, sessionId, sessionData, expirySeconds = 86400) => {
    try {
      const key = `session:${sessionId}`;
      const response = await client.setEx(
        key,
        expirySeconds,
        JSON.stringify(sessionData)
      );
      logger.debug(`Cached session ${sessionId}`);
      return response;
    } catch (error) {
      logger.error(`Error caching session ${sessionId}:`, error);
      throw error;
    }
  },

  /**
   * Retrieve session data from Redis cache
   * @param {Object} client - Redis client
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object|null>} Parsed session data or null if not found
   */
  getSession: async (client, sessionId) => {
    try {
      const key = `session:${sessionId}`;
      const data = await client.get(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      logger.error(`Error retrieving session ${sessionId}:`, error);
      throw error;
    }
  },

  /**
   * Delete session from Redis cache
   * @param {Object} client - Redis client
   * @param {string} sessionId - Session ID
   * @returns {Promise<number>} Number of keys deleted
   */
  deleteSession: async (client, sessionId) => {
    try {
      const key = `session:${sessionId}`;
      const response = await client.del(key);
      logger.debug(`Deleted cached session ${sessionId}`);
      return response;
    } catch (error) {
      logger.error(`Error deleting session ${sessionId}:`, error);
      throw error;
    }
  },

  /**
   * Map user to WebSocket socket ID for message routing
   * @param {Object} client - Redis client
   * @param {string} userId - User ID
   * @param {string} socketId - WebSocket socket ID
   * @param {string} sessionId - Active session ID
   * @returns {Promise<number>} Response code
   */
  setUserSocket: async (client, userId, socketId, sessionId) => {
    try {
      const key = `user_socket:${userId}`;
      const value = JSON.stringify({
        socketId,
        sessionId,
        connectedAt: new Date().toISOString(),
      });
      // Store with 24 hour expiry (user might be inactive)
      const response = await client.setEx(key, 86400, value);
      logger.debug(`Mapped user ${userId} to socket ${socketId}`);
      return response;
    } catch (error) {
      logger.error(`Error mapping user ${userId} to socket:`, error);
      throw error;
    }
  },

  /**
   * Remove user to WebSocket mapping
   * @param {Object} client - Redis client
   * @param {string} userId - User ID
   * @returns {Promise<number>} Number of keys deleted
   */
  removeUserSocket: async (client, userId) => {
    try {
      const key = `user_socket:${userId}`;
      const response = await client.del(key);
      logger.debug(`Removed socket mapping for user ${userId}`);
      return response;
    } catch (error) {
      logger.error(`Error removing socket mapping for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Get Redis client instance (utility for direct access)
   * @param {Object} client - Redis client
   * @returns {Object} Redis client
   */
  getClient: (client) => {
    return client;
  },

  /**
   * Initialize Redis connection with retry logic
   * @returns {Promise<Object>} Initialized Redis client
   */
  connect: async () => {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const client = await redisConfig.createClient();
        return client;
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          logger.error(
            "Failed to connect to Redis after",
            maxRetries,
            "retries"
          );
          throw error;
        }
        const delay = Math.pow(2, retries) * 1000; // Exponential backoff
        logger.warn(
          `Redis connection failed (attempt ${retries}/${maxRetries}), retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  },
};

module.exports = redisConfig;
