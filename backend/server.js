const http = require("http");
const socketIo = require("socket.io");
const app = require("./app");
const dbConfig = require("./config/db.config");
const redisConfig = require("./config/redis.config");
const rabbitmqConfig = require("./config/rabbitmq.config");
const socketServer = require("./websocket/socket.server");
const logger = require("./utils/logger");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL]
    : [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
      ];

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Initialize socket server with authentication
socketServer.init(io);

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  try {
    // Close HTTP server
    server.close(() => {
      logger.info("HTTP server closed");
    });

    // Close database connections
    await dbConfig.disconnect();

    // Close Redis connection
    await redisConfig.disconnect();

    // Close RabbitMQ connection
    await rabbitmqConfig.disconnect();

    logger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
};

/**
 * Initialize all services and start server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await dbConfig.connect();
    logger.info("Connected to MongoDB");

    // Connect to Redis
    await redisConfig.connect();
    logger.info("Connected to Redis");

    // Connect to RabbitMQ (optional - app works without it)
    try {
      await rabbitmqConfig.connect();
      logger.info("Connected to RabbitMQ");
    } catch (error) {
      logger.warn(
        "RabbitMQ connection failed. Queue features will be unavailable."
      );
      logger.warn(
        "This is OK for development. In production, ensure RabbitMQ is running."
      );
    }

    // Start the server
    server.listen(PORT, () => {
      logger.info(`🚀 CodeCrafter server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(`WebSocket enabled: ${io ? "Yes" : "No"}`);
    });

    // Handle process signals for graceful shutdown
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("unhandledRejection");
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

// Start the server
startServer();
