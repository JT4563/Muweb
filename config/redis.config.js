const { createClient } = require('redis');
const logger = require('../utils/logger');
require('dotenv').config();

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
      const redisHost = process.env.REDIS_HOST || 'localhost';
      const redisPort = process.env.REDIS_PORT || 6379;
      
      const client = createClient({
        url: `redis://${redisHost}:${redisPort}`
      });

      // Set up error handling
      client.on('error', (err) => {
        logger.error('Redis client error:', err);
      });

      // Connect to Redis
      await client.connect();
      logger.info('Connected to Redis server');
      
      return client;
    } catch (error) {
      logger.error('Error connecting to Redis:', error);
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
      logger.info('Disconnected from Redis server');
    }
  }
};

module.exports = redisConfig;
