const express = require("express");
const router = express.Router();
const executeController = require("../controllers/execute.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validator = require("../utils/validator");

/**
 * @route POST /api/execute
 * @desc Execute code in a session
 * @access Private
 */
router.post(
  "/",
  authMiddleware,
  validator.executeValidation,
  executeController.executeCode
);

/**
 * @route GET /api/execute/history/:sessionId
 * @desc Get execution history for a session
 * @access Private
 */
router.get(
  "/history/:sessionId",
  authMiddleware,
  executeController.getExecutionHistory
);

/**
 * @route GET /api/execute/languages
 * @desc Get supported programming languages
 * @access Public
 */
router.get("/languages", executeController.getSupportedLanguages);

/**
 * @route GET /api/execute/status/:jobId
 * @desc Get execution job status
 * @access Private
 */
router.get(
  "/status/:jobId",
  authMiddleware,
  executeController.getExecutionStatus
);

/**
 * @route DELETE /api/execute/kill/:sessionId
 * @desc Kill running executions for a session
 * @access Private
 */
router.delete(
  "/kill/:sessionId",
  authMiddleware,
  executeController.killExecution
);

/**
 * @route GET /api/execute/stats
 * @desc Get execution system statistics
 * @access Private (Admin only)
 */
router.get("/stats", authMiddleware, executeController.getExecutionStats);

module.exports = router;
