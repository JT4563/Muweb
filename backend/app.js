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

// Root endpoint - Welcome page with API documentation
app.get("/", (req, res) => {
  // Only expose detailed docs in development or to authenticated users
  const isProduction = process.env.NODE_ENV === "production";
  const isAuthenticated = req.user ? true : false;

  const response = {
    message: "Welcome to CodeCrafter API 🚀",
    version: process.env.npm_package_version || "1.0.0",
    status: "Server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  };

  // Show endpoints documentation in development or to authenticated users (safer for production)
  if (!isProduction || isAuthenticated) {
    response.endpoints = {
      health: {
        path: "/health",
        method: "GET",
        description: "Check server health status",
      },
      metrics: {
        path: "/metrics",
        method: "GET",
        description: "Get server metrics (uptime, memory, CPU)",
      },
      auth: {
        signup: {
          path: "/api/auth/signup",
          method: "POST",
          description: "Create a new user account",
          body: {
            email: "string",
            password: "string",
            name: "string",
          },
        },
        login: {
          path: "/api/auth/login",
          method: "POST",
          description: "Login and get JWT tokens",
          body: {
            email: "string",
            password: "string",
          },
        },
        logout: {
          path: "/api/auth/logout",
          method: "POST",
          description: "Logout user",
          requiresAuth: true,
        },
        refresh: {
          path: "/api/auth/refresh",
          method: "POST",
          description: "Refresh JWT token",
          body: {
            refreshToken: "string",
          },
        },
      },
      sessions: {
        list: {
          path: "/api/sessions",
          method: "GET",
          description: "List all sessions",
          requiresAuth: true,
        },
        create: {
          path: "/api/sessions",
          method: "POST",
          description: "Create a new session",
          requiresAuth: true,
          body: {
            title: "string",
            description: "string",
          },
        },
        get: {
          path: "/api/sessions/:sessionId",
          method: "GET",
          description: "Get session details",
          requiresAuth: true,
        },
        join: {
          path: "/api/sessions/:sessionId/join",
          method: "POST",
          description: "Join a session",
          requiresAuth: true,
        },
      },
      execute: {
        run: {
          path: "/api/execute/run",
          method: "POST",
          description: "Execute code",
          requiresAuth: true,
          body: {
            language: "string (node, python, java, cpp, go, rust)",
            code: "string",
            input: "string (optional)",
          },
        },
        history: {
          path: "/api/execute/history",
          method: "GET",
          description: "Get execution history",
          requiresAuth: true,
        },
      },
    };
    response.features = {
      authentication: "JWT-based authentication with refresh tokens",
      websocket: "Real-time collaboration via Socket.IO",
      codeExecution: "Execute code in sandboxed containers",
      sessions: "Create and join collaborative coding sessions",
      monitoring: "Prometheus metrics and Grafana dashboards",
    };
    response.documentation = {
      swagger: "/api-docs (coming soon)",
      github: "https://github.com/tanmayjoddar/Muweb",
    };
  } else {
    // In production without auth, show minimal info
    response.info =
      "For API documentation, please authenticate or visit development environment";
    response.links = {
      health: "/health",
      docs: "See README.md for API documentation",
    };
  }

  res.status(200).json(response);
});

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
