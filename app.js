const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const ratelimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted-cdn.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
        connectSrc: ["'self'", "ws:", "wss:"],
      },
    },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    noSniff: true,
  })
);

// Rate limiting
const limiter = ratelimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Code execution specific rate limiting
const executeLimiter = ratelimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 code executions per minute
  message: {
    error: "Too many code execution requests, please try again later.",
  },
  skip: (req) => {
    // Skip rate limiting for authenticated users with premium accounts
    return req.user && req.user.isPremium;
  },
});

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Import routes
const authRoutes = require("./api/auth.routes");
const sessionRoutes = require("./api/sessions.routes");
const executeRoutes = require("./api/execute.routes");

// Import middleware
const authMiddleware = require("./middleware/auth.middleware");
const errorHandler = require("./middleware/error.middleware");

// Import required services
const queueService = require("./services/queue.service");
const dockerService = require("./services/docker.service");

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "CodeCrafter API",
    version: process.env.npm_package_version || "1.0.0",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", authMiddleware, sessionRoutes);
app.use("/api/execute", authMiddleware, executeLimiter, executeRoutes);

// Metrics endpoint for observability
app.get("/metrics", (req, res) => {
  // Basic metrics - can be enhanced with Prometheus later
  const metrics = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  };
  res.json(metrics);
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
