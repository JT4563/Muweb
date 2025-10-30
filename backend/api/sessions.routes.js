const express = require('express');
const sessionController = require('../controllers/sessions.controller');
const validator = require('../utils/validator');

const router = express.Router();

/**
 * @route   POST /api/sessions
 * @desc    Create a new coding session
 * @access  Private
 */
router.post('/',
  validator.validateSessionCreation,
  sessionController.createSession
);

/**
 * @route   GET /api/sessions
 * @desc    Get user's sessions (owned and participated)
 * @access  Private
 */
router.get('/',
  sessionController.getUserSessions
);

/**
 * @route   GET /api/sessions/public
 * @desc    Get public sessions
 * @access  Private
 */
router.get('/public',
  sessionController.getPublicSessions
);

/**
 * @route   GET /api/sessions/search
 * @desc    Search sessions
 * @access  Private
 */
router.get('/search',
  sessionController.searchSessions
);

/**
 * @route   GET /api/sessions/:sessionId
 * @desc    Get session details
 * @access  Private
 */
router.get('/:sessionId',
  validator.validateSessionJoin,
  sessionController.getSession
);

/**
 * @route   PUT /api/sessions/:sessionId
 * @desc    Update session
 * @access  Private
 */
router.put('/:sessionId',
  validator.validateSessionJoin,
  sessionController.updateSession
);

/**
 * @route   DELETE /api/sessions/:sessionId
 * @desc    Delete session
 * @access  Private
 */
router.delete('/:sessionId',
  validator.validateSessionJoin,
  sessionController.deleteSession
);

/**
 * @route   POST /api/sessions/:sessionId/join
 * @desc    Join a session
 * @access  Private
 */
router.post('/:sessionId/join',
  validator.validateSessionJoin,
  sessionController.joinSession
);

/**
 * @route   POST /api/sessions/:sessionId/leave
 * @desc    Leave a session
 * @access  Private
 */
router.post('/:sessionId/leave',
  validator.validateSessionJoin,
  sessionController.leaveSession
);

/**
 * @route   POST /api/sessions/:sessionId/fork
 * @desc    Fork a session
 * @access  Private
 */
router.post('/:sessionId/fork',
  validator.validateSessionJoin,
  sessionController.forkSession
);

/**
 * @route   GET /api/sessions/:sessionId/snapshots
 * @desc    Get session snapshots
 * @access  Private
 */
router.get('/:sessionId/snapshots',
  validator.validateSessionJoin,
  sessionController.getSnapshots
);

/**
 * @route   POST /api/sessions/:sessionId/snapshots
 * @desc    Create session snapshot
 * @access  Private
 */
router.post('/:sessionId/snapshots',
  validator.validateSessionJoin,
  sessionController.createSnapshot
);

/**
 * @route   GET /api/sessions/:sessionId/execution-history
 * @desc    Get session execution history
 * @access  Private
 */
router.get('/:sessionId/execution-history',
  validator.validateSessionJoin,
  sessionController.getExecutionHistory
);

/**
 * @route   PUT /api/sessions/:sessionId/participants/:userId
 * @desc    Update participant role
 * @access  Private
 */
router.put('/:sessionId/participants/:userId',
  sessionController.updateParticipantRole
);

/**
 * @route   DELETE /api/sessions/:sessionId/participants/:userId
 * @desc    Remove participant from session
 * @access  Private
 */
router.delete('/:sessionId/participants/:userId',
  sessionController.removeParticipant
);

module.exports = router;
