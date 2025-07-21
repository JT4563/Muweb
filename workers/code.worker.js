const amqp = require('amqplib');
const dockerService = require('../services/docker.service');
const logger = require('../utils/logger');
const { Session } = require('../models/session.model');
const { Log } = require('../models/log.model');

class CodeWorker {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
    this.retryCount = 0;
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 seconds
    this.queues = {
      CODE_EXECUTION: 'code_execution',
      CODE_EXECUTION_DLQ: 'code_execution_dlq'
    };
  }

  /**
   * Initialize the worker and start consuming messages
   */
  async initialize() {
    try {
      await this.connect();
      await this.setupQueues();
      await this.startConsuming();
      
      // Initialize Docker service
      await dockerService.initialize();
      
      logger.info('Code worker initialized and ready to process jobs');
    } catch (error) {
      logger.error('Failed to initialize code worker:', error);
      throw error;
    }
  }

  /**
   * Connect to RabbitMQ
   */
  async connect() {
    try {
      const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      
      this.isConnected = true;
      this.retryCount = 0;
      
      // Handle connection events
      this.connection.on('error', (error) => {
        logger.error('RabbitMQ connection error:', error);
        this.isConnected = false;
        this.reconnect();
      });

      this.connection.on('close', () => {
        logger.warn('RabbitMQ connection closed');
        this.isConnected = false;
        this.reconnect();
      });

      logger.info('Connected to RabbitMQ');
    } catch (error) {
      logger.error('Failed to connect to RabbitMQ:', error);
      this.isConnected = false;
      this.reconnect();
      throw error;
    }
  }

  /**
   * Reconnect to RabbitMQ with exponential backoff
   */
  async reconnect() {
    if (this.retryCount >= this.maxRetries) {
      logger.error('Max retry attempts reached. Giving up on RabbitMQ connection.');
      return;
    }

    this.retryCount++;
    const delay = this.retryDelay * Math.pow(2, this.retryCount - 1);
    
    logger.info(`Attempting to reconnect to RabbitMQ (attempt ${this.retryCount}/${this.maxRetries}) in ${delay}ms`);
    
    setTimeout(async () => {
      try {
        await this.connect();
        await this.setupQueues();
        await this.startConsuming();
      } catch (error) {
        logger.error('Reconnection failed:', error);
      }
    }, delay);
  }

  /**
   * Setup RabbitMQ queues and exchanges
   */
  async setupQueues() {
    try {
      // Declare dead letter queue first
      await this.channel.assertQueue(this.queues.CODE_EXECUTION_DLQ, {
        durable: true,
        arguments: {}
      });

      // Declare main queue with dead letter configuration
      await this.channel.assertQueue(this.queues.CODE_EXECUTION, {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': this.queues.CODE_EXECUTION_DLQ,
          'x-message-ttl': 300000, // 5 minutes TTL
          'x-max-retries': 3
        }
      });

      // Set prefetch count to process one message at a time
      await this.channel.prefetch(1);
      
      logger.info('RabbitMQ queues setup completed');
    } catch (error) {
      logger.error('Failed to setup queues:', error);
      throw error;
    }
  }

  /**
   * Start consuming messages from the queue
   */
  async startConsuming() {
    try {
      await this.channel.consume(this.queues.CODE_EXECUTION, async (message) => {
        if (message) {
          await this.processMessage(message);
        }
      });

      logger.info('Started consuming messages from code execution queue');
    } catch (error) {
      logger.error('Failed to start consuming messages:', error);
      throw error;
    }
  }

  /**
   * Process incoming execution request
   */
  async processMessage(message) {
    const startTime = Date.now();
    let jobData = null;
    
    try {
      // Parse message
      jobData = JSON.parse(message.content.toString());
      const { 
        jobId, 
        sessionId, 
        userId, 
        language, 
        code, 
        stdin, 
        timeout,
        requestId 
      } = jobData;

      logger.info('Processing code execution job', { 
        jobId, 
        sessionId, 
        userId, 
        language,
        codeLength: code?.length 
      });

      // Validate required fields
      if (!jobId || !sessionId || !userId || !language || !code) {
        throw new Error('Missing required fields in job data');
      }

      // Check if session exists and user has access
      const session = await Session.findById(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const hasAccess = session.owner.toString() === userId || 
                       session.participants.some(p => p.user.toString() === userId);
      
      if (!hasAccess) {
        throw new Error(`User ${userId} does not have access to session ${sessionId}`);
      }

      // Execute code using Docker service
      const executionResult = await dockerService.executeCode({
        language,
        code,
        stdin,
        timeout
      });

      const processingTime = Date.now() - startTime;

      // Create execution log
      const logEntry = new Log({
        sessionId,
        userId,
        action: 'code_execution',
        details: {
          language,
          executionId: executionResult.executionId,
          success: !executionResult.error,
          executionTime: executionResult.executionTime,
          processingTime,
          codeLength: code.length,
          outputLength: executionResult.output?.length || 0,
          errorLength: executionResult.error?.length || 0
        },
        metadata: {
          jobId,
          requestId,
          worker: 'code-worker',
          version: '1.0.0'
        }
      });

      await logEntry.save();

      // Update session with execution result
      await Session.findByIdAndUpdate(sessionId, {
        $push: {
          executionHistory: {
            timestamp: new Date(),
            language,
            code,
            output: executionResult.output,
            error: executionResult.error,
            executionTime: executionResult.executionTime,
            executedBy: userId
          }
        },
        lastExecuted: new Date()
      });

      // Publish result back (if needed for real-time updates)
      await this.publishExecutionResult({
        jobId,
        sessionId,
        userId,
        requestId,
        result: executionResult,
        processingTime
      });

      // Acknowledge message
      this.channel.ack(message);

      logger.info('Code execution job completed successfully', { 
        jobId, 
        processingTime,
        executionTime: executionResult.executionTime,
        success: !executionResult.error 
      });

    } catch (error) {
      logger.error('Failed to process code execution job', { 
        jobId: jobData?.jobId,
        error: error.message,
        processingTime: Date.now() - startTime 
      });

      // Create error log if we have enough data
      if (jobData?.sessionId && jobData?.userId) {
        try {
          const errorLog = new Log({
            sessionId: jobData.sessionId,
            userId: jobData.userId,
            action: 'code_execution_error',
            details: {
              error: error.message,
              processingTime: Date.now() - startTime,
              jobData
            },
            metadata: {
              jobId: jobData.jobId,
              requestId: jobData.requestId,
              worker: 'code-worker',
              version: '1.0.0'
            }
          });
          await errorLog.save();
        } catch (logError) {
          logger.error('Failed to create error log:', logError);
        }
      }

      // Determine if message should be retried
      const retryCount = (message.properties.headers['x-retry-count'] || 0) + 1;
      const maxRetries = 3;

      if (retryCount <= maxRetries) {
        // Republish with retry count
        await this.republishWithRetry(message, retryCount, error.message);
        this.channel.ack(message);
      } else {
        // Send to dead letter queue
        logger.error('Max retries exceeded, sending to DLQ', { 
          jobId: jobData?.jobId,
          retryCount 
        });
        this.channel.nack(message, false, false);
      }
    }
  }

  /**
   * Republish message with retry count
   */
  async republishWithRetry(originalMessage, retryCount, errorMessage) {
    try {
      const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 30000); // Max 30 seconds
      
      setTimeout(async () => {
        const jobData = JSON.parse(originalMessage.content.toString());
        
        await this.channel.publish('', this.queues.CODE_EXECUTION, 
          Buffer.from(JSON.stringify(jobData)), {
            persistent: true,
            headers: {
              'x-retry-count': retryCount,
              'x-original-error': errorMessage,
              'x-retry-timestamp': new Date().toISOString()
            }
          }
        );

        logger.info('Republished message for retry', { 
          jobId: jobData.jobId,
          retryCount,
          delay 
        });
      }, delay);

    } catch (error) {
      logger.error('Failed to republish message for retry:', error);
    }
  }

  /**
   * Publish execution result for real-time updates
   */
  async publishExecutionResult(data) {
    try {
      // This could be used to send results back to WebSocket clients
      // For now, we'll just log it
      logger.debug('Execution result ready for real-time update', {
        jobId: data.jobId,
        sessionId: data.sessionId,
        success: !data.result.error
      });

      // TODO: Implement WebSocket notification mechanism
      // This could publish to a Redis channel that the WebSocket server subscribes to
      
    } catch (error) {
      logger.error('Failed to publish execution result:', error);
    }
  }

  /**
   * Get worker statistics
   */
  async getStats() {
    try {
      if (!this.isConnected) {
        return { status: 'disconnected' };
      }

      const queueInfo = await this.channel.checkQueue(this.queues.CODE_EXECUTION);
      const dlqInfo = await this.channel.checkQueue(this.queues.CODE_EXECUTION_DLQ);

      return {
        status: 'connected',
        queues: {
          main: {
            name: this.queues.CODE_EXECUTION,
            messageCount: queueInfo.messageCount,
            consumerCount: queueInfo.consumerCount
          },
          deadLetter: {
            name: this.queues.CODE_EXECUTION_DLQ,
            messageCount: dlqInfo.messageCount,
            consumerCount: dlqInfo.consumerCount
          }
        },
        connection: {
          retryCount: this.retryCount,
          maxRetries: this.maxRetries
        }
      };
    } catch (error) {
      logger.error('Failed to get worker stats:', error);
      return { 
        status: 'error', 
        error: error.message 
      };
    }
  }

  /**
   * Health check for the worker
   */
  async healthCheck() {
    try {
      const dockerHealth = await dockerService.healthCheck();
      const workerStats = await this.getStats();

      return {
        status: this.isConnected && dockerHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
        worker: {
          connected: this.isConnected,
          ...workerStats
        },
        docker: dockerHealth,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    try {
      logger.info('Shutting down code worker...');

      if (this.channel) {
        await this.channel.close();
      }

      if (this.connection) {
        await this.connection.close();
      }

      // Kill any running execution containers
      await dockerService.killAllExecutionContainers();

      this.isConnected = false;
      logger.info('Code worker shutdown completed');
    } catch (error) {
      logger.error('Error during worker shutdown:', error);
      throw error;
    }
  }
}

// Handle process signals for graceful shutdown
const worker = new CodeWorker();

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM signal');
  await worker.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT signal');
  await worker.shutdown();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  logger.error('Uncaught exception in worker:', error);
  await worker.shutdown();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  logger.error('Unhandled rejection in worker:', reason);
  await worker.shutdown();
  process.exit(1);
});

module.exports = worker;

// Start worker if this file is run directly
if (require.main === module) {
  worker.initialize().catch(error => {
    logger.error('Failed to start code worker:', error);
    process.exit(1);
  });
}
