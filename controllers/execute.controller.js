const { v4: uuidv4 } = require("uuid");
const amqp = require("amqplib");
const dockerService = require("../services/docker.service");
const queueService = require("../services/queue.service");
const Session = require("../models/session.model");
const Log = require("../models/log.model");
const logger = require("../utils/logger");

class ExecuteController {
  constructor() {
    this.pendingJobs = new Map(); // Track pending execution jobs
    this.jobTimeouts = new Map(); // Track job timeouts
  }

  /**
   * Execute code in a session
   */
  async executeCode(req, res) {
    try {
      const { sessionId, language, code, stdin, timeout } = req.body;
      const userId = req.user.id;

      // Validate session access
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      // Check if user has access to session
      const hasAccess =
        session.owner.toString() === userId ||
        session.participants.some((p) => p.user.toString() === userId);

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: "Access denied to this session",
        });
      }

      // Validate language support
      const supportedLanguages = dockerService.getSupportedLanguages();
      if (!supportedLanguages.includes(language)) {
        return res.status(400).json({
          success: false,
          message: `Unsupported language: ${language}`,
          supportedLanguages,
        });
      }

      // Generate job ID
      const jobId = uuidv4();
      const requestId = req.headers["x-request-id"] || uuidv4();

      // Create job data
      const jobData = {
        jobId,
        sessionId,
        userId,
        language,
        code,
        stdin: stdin || "",
        timeout: timeout || 30000,
        requestId,
        timestamp: new Date().toISOString(),
      };

      // Check if we should execute synchronously (for small, quick jobs)
      const shouldExecuteSync = this.shouldExecuteSync(language, code, timeout);

      if (shouldExecuteSync) {
        // Execute immediately using Docker service
        try {
          const result = await dockerService.executeCode({
            language,
            code,
            stdin: stdin || "",
            timeout: timeout || 30000,
          });

          // Log execution
          await this.logExecution(sessionId, userId, {
            jobId,
            language,
            executionId: result.executionId,
            success: !result.error,
            executionTime: result.executionTime,
            sync: true,
          });

          // Update session
          await this.updateSessionHistory(sessionId, userId, {
            language,
            code,
            output: result.output,
            error: result.error,
            executionTime: result.executionTime,
          });

          return res.json({
            success: true,
            jobId,
            result,
            executionMode: "synchronous",
          });
        } catch (error) {
          logger.error("Synchronous execution failed:", error);
          return res.status(500).json({
            success: false,
            message: "Execution failed",
            error: error.message,
          });
        }
      }

      // Queue job for asynchronous execution
      try {
        await queueService.publishJob("code_execution", jobData);

        // Track pending job
        this.pendingJobs.set(jobId, {
          sessionId,
          userId,
          language,
          timestamp: Date.now(),
          requestId,
        });

        // Set timeout for job
        const jobTimeout = setTimeout(
          () => {
            this.pendingJobs.delete(jobId);
            this.jobTimeouts.delete(jobId);
          },
          (timeout || 30000) + 10000
        ); // Add 10s buffer

        this.jobTimeouts.set(jobId, jobTimeout);

        logger.info("Code execution job queued", {
          jobId,
          sessionId,
          userId,
          language,
        });

        res.json({
          success: true,
          jobId,
          message: "Code execution job queued",
          executionMode: "asynchronous",
          estimatedTime: timeout || 30000,
        });
      } catch (error) {
        logger.error("Failed to queue execution job:", error);
        res.status(500).json({
          success: false,
          message: "Failed to queue execution job",
          error: error.message,
        });
      }
    } catch (error) {
      logger.error("Execute code error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  /**
   * Get execution history for a session
   */
  async getExecutionHistory(req, res) {
    try {
      const { sessionId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const userId = req.user.id;

      // Validate session access
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      const hasAccess =
        session.owner.toString() === userId ||
        session.participants.some((p) => p.user.toString() === userId);

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: "Access denied to this session",
        });
      }

      // Get execution logs
      const logs = await Log.find({
        sessionId,
        action: { $in: ["code_execution", "code_execution_error"] },
      })
        .sort({ timestamp: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate("userId", "username email");

      // Get session execution history
      const sessionHistory = session.executionHistory.slice(-limit).reverse();

      res.json({
        success: true,
        data: {
          logs: logs.map((log) => ({
            id: log._id,
            timestamp: log.timestamp,
            user: log.userId,
            action: log.action,
            details: log.details,
            metadata: log.metadata,
          })),
          history: sessionHistory,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: logs.length,
          },
        },
      });
    } catch (error) {
      logger.error("Get execution history error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get execution history",
        error: error.message,
      });
    }
  }

  /**
   * Get supported programming languages
   */
  async getSupportedLanguages(req, res) {
    try {
      const languages = dockerService.getSupportedLanguages();
      const languageConfigs = {};

      for (const lang of languages) {
        languageConfigs[lang] = dockerService.getLanguageConfig(lang);
      }

      res.json({
        success: true,
        data: {
          languages,
          configs: languageConfigs,
          count: languages.length,
        },
      });
    } catch (error) {
      logger.error("Get supported languages error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get supported languages",
        error: error.message,
      });
    }
  }

  /**
   * Get execution job status
   */
  async getExecutionStatus(req, res) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      // Check if job is pending
      const pendingJob = this.pendingJobs.get(jobId);
      if (pendingJob) {
        // Verify user access
        if (pendingJob.userId !== userId) {
          return res.status(403).json({
            success: false,
            message: "Access denied to this job",
          });
        }

        return res.json({
          success: true,
          data: {
            jobId,
            status: "pending",
            ...pendingJob,
            queueTime: Date.now() - pendingJob.timestamp,
          },
        });
      }

      // Check in logs for completed jobs
      const log = await Log.findOne({
        "metadata.jobId": jobId,
        userId,
        action: { $in: ["code_execution", "code_execution_error"] },
      }).sort({ timestamp: -1 });

      if (log) {
        return res.json({
          success: true,
          data: {
            jobId,
            status: log.action === "code_execution" ? "completed" : "failed",
            timestamp: log.timestamp,
            details: log.details,
            metadata: log.metadata,
          },
        });
      }

      // Job not found
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
    } catch (error) {
      logger.error("Get execution status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get execution status",
        error: error.message,
      });
    }
  }

  /**
   * Kill running executions for a session
   */
  async killExecution(req, res) {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;

      // Validate session access
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      const hasAccess =
        session.owner.toString() === userId ||
        session.participants.some((p) => p.user.toString() === userId);

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: "Access denied to this session",
        });
      }

      // Kill all execution containers (this is a broad approach)
      const killedCount = await dockerService.killAllExecutionContainers();

      // Clear pending jobs for this session
      let clearedJobs = 0;
      for (const [jobId, jobData] of this.pendingJobs.entries()) {
        if (jobData.sessionId === sessionId) {
          this.pendingJobs.delete(jobId);

          const timeout = this.jobTimeouts.get(jobId);
          if (timeout) {
            clearTimeout(timeout);
            this.jobTimeouts.delete(jobId);
          }

          clearedJobs++;
        }
      }

      logger.info("Killed executions for session", {
        sessionId,
        userId,
        killedContainers: killedCount,
        clearedJobs,
      });

      res.json({
        success: true,
        message: "Executions killed successfully",
        data: {
          killedContainers: killedCount,
          clearedJobs,
        },
      });
    } catch (error) {
      logger.error("Kill execution error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to kill executions",
        error: error.message,
      });
    }
  }

  /**
   * Get execution system statistics
   */
  async getExecutionStats(req, res) {
    try {
      const userId = req.user.id;

      // Basic auth check - in production, you'd want admin role check
      // For now, any authenticated user can view stats

      const dockerStats = await dockerService.getStats();
      const queueStats = await queueService.getStats();

      // Get execution counts from logs
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const executionCounts = await Log.aggregate([
        {
          $match: {
            action: "code_execution",
            timestamp: { $gte: today },
          },
        },
        {
          $group: {
            _id: "$details.language",
            count: { $sum: 1 },
            avgExecutionTime: { $avg: "$details.executionTime" },
          },
        },
      ]);

      res.json({
        success: true,
        data: {
          docker: dockerStats,
          queue: queueStats,
          executions: {
            today: executionCounts,
            pending: this.pendingJobs.size,
          },
          system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      logger.error("Get execution stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get execution statistics",
        error: error.message,
      });
    }
  }

  /**
   * Helper: Determine if execution should be synchronous
   */
  shouldExecuteSync(language, code, timeout) {
    // Execute sync for small, quick scripts
    const quickLanguages = ["javascript", "python"];
    const maxCodeLength = 1000; // 1KB
    const maxTimeout = 10000; // 10 seconds

    return (
      quickLanguages.includes(language) &&
      code.length <= maxCodeLength &&
      (timeout || 30000) <= maxTimeout
    );
  }

  /**
   * Helper: Log execution details
   */
  async logExecution(sessionId, userId, details) {
    try {
      const log = new Log({
        sessionId,
        userId,
        action: "code_execution",
        details,
        metadata: {
          version: "1.0.0",
          source: "execute-controller",
        },
      });

      await log.save();
    } catch (error) {
      logger.error("Failed to log execution:", error);
    }
  }

  /**
   * Helper: Update session execution history
   */
  async updateSessionHistory(sessionId, userId, executionData) {
    try {
      await Session.findByIdAndUpdate(sessionId, {
        $push: {
          executionHistory: {
            timestamp: new Date(),
            ...executionData,
            executedBy: userId,
          },
        },
        lastExecuted: new Date(),
      });
    } catch (error) {
      logger.error("Failed to update session history:", error);
    }
  }

  /**
   * Cleanup method for graceful shutdown
   */
  cleanup() {
    // Clear all timeouts
    for (const timeout of this.jobTimeouts.values()) {
      clearTimeout(timeout);
    }

    this.pendingJobs.clear();
    this.jobTimeouts.clear();
  }
}

module.exports = new ExecuteController();
