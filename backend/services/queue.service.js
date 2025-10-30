const amqp = require('amqplib');
const logger = require('../utils/logger');

class QueueService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000;
    
    // Queue configurations
    this.queues = {
      CODE_EXECUTION: {
        name: 'code_execution',
        options: {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': '',
            'x-dead-letter-routing-key': 'code_execution_dlq',
            'x-message-ttl': 300000, // 5 minutes
            'x-max-retries': 3
          }
        }
      },
      CODE_EXECUTION_DLQ: {
        name: 'code_execution_dlq',
        options: {
          durable: true
        }
      },
      NOTIFICATIONS: {
        name: 'notifications',
        options: {
          durable: true,
          arguments: {
            'x-message-ttl': 600000 // 10 minutes
          }
        }
      }
    };
  }

  /**
   * Initialize the queue service
   */
  async initialize() {
    try {
      await this.connect();
      await this.setupQueues();
      logger.info('Queue service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize queue service:', error);
      throw error;
    }
  }

  /**
   * Connect to RabbitMQ
   */
  async connect() {
    try {
      const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
      
      this.connection = await amqp.connect(rabbitmqUrl, {
        heartbeat: 60,
        reconnect: true,
        reconnectTimeoutInSeconds: 30
      });
      
      this.channel = await this.connection.createChannel();
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Handle connection events
      this.connection.on('error', (error) => {
        logger.error('RabbitMQ connection error:', error);
        this.isConnected = false;
        this.handleConnectionError();
      });

      this.connection.on('close', () => {
        logger.warn('RabbitMQ connection closed');
        this.isConnected = false;
        this.handleConnectionError();
      });

      // Handle channel events
      this.channel.on('error', (error) => {
        logger.error('RabbitMQ channel error:', error);
      });

      this.channel.on('close', () => {
        logger.warn('RabbitMQ channel closed');
      });

      logger.info('Connected to RabbitMQ successfully');
      
    } catch (error) {
      logger.error('Failed to connect to RabbitMQ:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Handle connection errors and attempt reconnection
   */
  async handleConnectionError() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      logger.error('Max reconnection attempts reached for RabbitMQ');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    logger.info(`Attempting to reconnect to RabbitMQ (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
    
    setTimeout(async () => {
      try {
        await this.connect();
        await this.setupQueues();
        logger.info('Successfully reconnected to RabbitMQ');
      } catch (error) {
        logger.error('Reconnection attempt failed:', error);
      }
    }, delay);
  }

  /**
   * Setup all required queues
   */
  async setupQueues() {
    try {
      // Assert all queues
      for (const queueConfig of Object.values(this.queues)) {
        await this.channel.assertQueue(queueConfig.name, queueConfig.options);
        logger.debug(`Queue '${queueConfig.name}' asserted successfully`);
      }

      logger.info('All queues setup completed');
    } catch (error) {
      logger.error('Failed to setup queues:', error);
      throw error;
    }
  }

  /**
   * Publish a job to a queue
   * @param {string} queueName - Name of the queue
   * @param {Object} jobData - Job data to publish
   * @param {Object} options - Publishing options
   */
  async publishJob(queueName, jobData, options = {}) {
    try {
      if (!this.isConnected) {
        throw new Error('Queue service is not connected');
      }

      const queueConfig = this.getQueueConfig(queueName);
      if (!queueConfig) {
        throw new Error(`Unknown queue: ${queueName}`);
      }

      const message = Buffer.from(JSON.stringify(jobData));
      const publishOptions = {
        persistent: true,
        timestamp: Date.now(),
        messageId: jobData.jobId || require('uuid').v4(),
        ...options
      };

      const published = this.channel.publish('', queueConfig.name, message, publishOptions);
      
      if (!published) {
        throw new Error('Failed to publish message to queue');
      }

      logger.info(`Job published to queue '${queueConfig.name}'`, {
        jobId: jobData.jobId,
        queueName: queueConfig.name,
        messageSize: message.length
      });

      return true;

    } catch (error) {
      logger.error(`Failed to publish job to queue '${queueName}':`, error);
      throw error;
    }
  }

  /**
   * Consume messages from a queue
   * @param {string} queueName - Name of the queue
   * @param {Function} handler - Message handler function
   * @param {Object} options - Consumption options
   */
  async consumeQueue(queueName, handler, options = {}) {
    try {
      if (!this.isConnected) {
        throw new Error('Queue service is not connected');
      }

      const queueConfig = this.getQueueConfig(queueName);
      if (!queueConfig) {
        throw new Error(`Unknown queue: ${queueName}`);
      }

      const consumeOptions = {
        noAck: false,
        ...options
      };

      await this.channel.prefetch(1); // Process one message at a time

      await this.channel.consume(queueConfig.name, async (message) => {
        if (!message) return;

        try {
          const jobData = JSON.parse(message.content.toString());
          await handler(jobData, message);
          
          // Acknowledge message if handler succeeds
          this.channel.ack(message);
          
        } catch (error) {
          logger.error(`Error processing message from queue '${queueName}':`, error);
          
          // Reject message and don't requeue if it's a permanent failure
          this.channel.nack(message, false, false);
        }
      }, consumeOptions);

      logger.info(`Started consuming from queue '${queueConfig.name}'`);

    } catch (error) {
      logger.error(`Failed to consume from queue '${queueName}':`, error);
      throw error;
    }
  }

  /**
   * Get queue statistics
   * @param {string} queueName - Name of the queue
   */
  async getQueueStats(queueName) {
    try {
      if (!this.isConnected) {
        throw new Error('Queue service is not connected');
      }

      const queueConfig = this.getQueueConfig(queueName);
      if (!queueConfig) {
        throw new Error(`Unknown queue: ${queueName}`);
      }

      const queueInfo = await this.channel.checkQueue(queueConfig.name);
      
      return {
        name: queueConfig.name,
        messageCount: queueInfo.messageCount,
        consumerCount: queueInfo.consumerCount
      };

    } catch (error) {
      logger.error(`Failed to get stats for queue '${queueName}':`, error);
      throw error;
    }
  }

  /**
   * Get all queue statistics
   */
  async getStats() {
    try {
      if (!this.isConnected) {
        return {
          connected: false,
          error: 'Queue service is not connected'
        };
      }

      const stats = {};
      
      for (const [key, queueConfig] of Object.entries(this.queues)) {
        try {
          stats[key] = await this.getQueueStats(queueConfig.name);
        } catch (error) {
          stats[key] = {
            name: queueConfig.name,
            error: error.message
          };
        }
      }

      return {
        connected: this.isConnected,
        reconnectAttempts: this.reconnectAttempts,
        queues: stats
      };

    } catch (error) {
      logger.error('Failed to get queue service stats:', error);
      return {
        connected: false,
        error: error.message
      };
    }
  }

  /**
   * Purge a queue (remove all messages)
   * @param {string} queueName - Name of the queue to purge
   */
  async purgeQueue(queueName) {
    try {
      if (!this.isConnected) {
        throw new Error('Queue service is not connected');
      }

      const queueConfig = this.getQueueConfig(queueName);
      if (!queueConfig) {
        throw new Error(`Unknown queue: ${queueName}`);
      }

      const result = await this.channel.purgeQueue(queueConfig.name);
      
      logger.info(`Purged queue '${queueConfig.name}', removed ${result.messageCount} messages`);
      
      return result.messageCount;

    } catch (error) {
      logger.error(`Failed to purge queue '${queueName}':`, error);
      throw error;
    }
  }

  /**
   * Health check for the queue service
   */
  async healthCheck() {
    try {
      if (!this.isConnected) {
        return {
          status: 'unhealthy',
          connected: false,
          error: 'Not connected to RabbitMQ'
        };
      }

      // Try to get stats for main queue as a health check
      await this.getQueueStats('code_execution');

      return {
        status: 'healthy',
        connected: true,
        reconnectAttempts: this.reconnectAttempts
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        connected: false,
        error: error.message
      };
    }
  }

  /**
   * Get queue configuration by name
   * @param {string} queueName - Name of the queue
   */
  getQueueConfig(queueName) {
    // Direct lookup
    for (const queueConfig of Object.values(this.queues)) {
      if (queueConfig.name === queueName) {
        return queueConfig;
      }
    }
    
    // Lookup by key
    const queueKey = queueName.toUpperCase().replace('-', '_');
    return this.queues[queueKey] || null;
  }

  /**
   * Close connection gracefully
   */
  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }

      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }

      this.isConnected = false;
      logger.info('Queue service connection closed');

    } catch (error) {
      logger.error('Error closing queue service connection:', error);
      throw error;
    }
  }

  /**
   * Send notification message
   * @param {Object} notification - Notification data
   */
  async sendNotification(notification) {
    try {
      await this.publishJob('notifications', {
        ...notification,
        timestamp: new Date().toISOString(),
        id: require('uuid').v4()
      });

      logger.info('Notification sent', { 
        type: notification.type,
        recipient: notification.userId 
      });

    } catch (error) {
      logger.error('Failed to send notification:', error);
      throw error;
    }
  }
}

module.exports = new QueueService();
