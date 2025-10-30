const amqp = require("amqplib");
const logger = require("../utils/logger");
require("dotenv").config();

/**
 * RabbitMQ configuration and connection management
 */
const rabbitmqConfig = {
  connection: null,
  channel: null,

  /**
   * Connect to RabbitMQ and create a channel
   * @returns {Promise<Object>} Channel object
   */
  createChannel: async () => {
    try {
      // Get RabbitMQ URL from environment variables or use default
      const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://localhost";

      // Connect to RabbitMQ
      const connection = await amqp.connect(rabbitmqUrl);
      logger.info("Connected to RabbitMQ server");

      // Create a channel
      const channel = await connection.createChannel();
      logger.info("Created RabbitMQ channel");

      // Set up error handling
      connection.on("error", (err) => {
        logger.error("RabbitMQ connection error:", err);
      });

      return { connection, channel };
    } catch (error) {
      logger.error("Error connecting to RabbitMQ:", error);
      throw error;
    }
  },

  /**
   * Connect to RabbitMQ with retry logic
   * @returns {Promise<Object>} Connection and channel
   */
  connect: async () => {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const { connection, channel } = await rabbitmqConfig.createChannel();
        rabbitmqConfig.connection = connection;
        rabbitmqConfig.channel = channel;
        return { connection, channel };
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          logger.error(
            "Failed to connect to RabbitMQ after",
            maxRetries,
            "retries"
          );
          throw error;
        }
        const delay = Math.pow(2, retries) * 1000; // Exponential backoff
        logger.warn(
          `RabbitMQ connection failed (attempt ${retries}/${maxRetries}), retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  },

  /**
   * Disconnect from RabbitMQ
   * @returns {Promise<void>}
   */
  disconnect: async () => {
    try {
      if (rabbitmqConfig.channel) {
        await rabbitmqConfig.channel.close();
        logger.info("Closed RabbitMQ channel");
      }

      if (rabbitmqConfig.connection) {
        await rabbitmqConfig.connection.close();
        logger.info("Closed RabbitMQ connection");
      }
    } catch (error) {
      logger.error("Error closing RabbitMQ connection:", error);
      throw error;
    }
  },

  /**
   * Close RabbitMQ connection and channel (legacy method)
   * @param {Object} connection - RabbitMQ connection to close
   * @param {Object} channel - RabbitMQ channel to close
   * @returns {Promise<void>}
   */
  close: async ({ connection, channel }) => {
    try {
      if (channel) {
        await channel.close();
        logger.info("Closed RabbitMQ channel");
      }

      if (connection) {
        await connection.close();
        logger.info("Closed RabbitMQ connection");
      }
    } catch (error) {
      logger.error("Error closing RabbitMQ connection:", error);
      throw error;
    }
  },
};

module.exports = rabbitmqConfig;
