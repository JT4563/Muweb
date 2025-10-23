/**
 * CRDT (Conflict-free Replicated Data Type) utilities for collaborative text editing
 * Using a simplified Operational Transformation approach
 */

class CRDTUtils {
  constructor() {
    this.operationHistory = new Map(); // sessionId -> operations[]
    this.stateVectors = new Map(); // sessionId -> { userId -> timestamp }
  }

  /**
   * Operation types for text editing
   */
  static get OPERATIONS() {
    return {
      INSERT: "insert",
      DELETE: "delete",
      RETAIN: "retain",
    };
  }

  /**
   * Process an incoming operation
   * @param {Object} operation - The operation to process
   * @param {Object} context - Context information (userId, timestamp, sessionId)
   * @returns {Object} Processed operation with resolved conflicts
   */
  processOperation(operation, context) {
    const { sessionId, userId, timestamp } = context;

    // Initialize session if not exists
    if (!this.operationHistory.has(sessionId)) {
      this.operationHistory.set(sessionId, []);
      this.stateVectors.set(sessionId, new Map());
    }

    // Create unique operation ID
    const operationId = `${userId}_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;

    // Transform operation against concurrent operations
    const transformedOperation = this.transformOperation(
      operation,
      sessionId,
      context
    );

    // Add operation to history
    const operationRecord = {
      id: operationId,
      ...transformedOperation,
      userId,
      timestamp,
      applied: true,
    };

    this.operationHistory.get(sessionId).push(operationRecord);

    // Update state vector
    this.stateVectors.get(sessionId).set(userId, timestamp);

    // Clean up old operations (keep last 1000)
    this.cleanupOperations(sessionId);

    return {
      ...transformedOperation,
      operationId,
      resultingCode: this.applyOperationToText(
        transformedOperation,
        operation.baseText || ""
      ),
    };
  }

  /**
   * Transform operation against concurrent operations
   * @param {Object} operation - Operation to transform
   * @param {string} sessionId - Session ID
   * @param {Object} context - Operation context
   * @returns {Object} Transformed operation
   */
  transformOperation(operation, sessionId, context) {
    const history = this.operationHistory.get(sessionId) || [];
    const stateVector = this.stateVectors.get(sessionId) || new Map();

    let transformedOp = { ...operation };

    // Find concurrent operations that need to be transformed against
    const concurrentOps = history.filter((op) => {
      return (
        op.timestamp > (context.lastKnownTimestamp || 0) &&
        op.userId !== context.userId &&
        op.applied
      );
    });

    // Apply transformations for each concurrent operation
    for (const concurrentOp of concurrentOps) {
      transformedOp = this.transformAgainstOperation(
        transformedOp,
        concurrentOp
      );
    }

    return transformedOp;
  }

  /**
   * Transform operation against another operation
   * @param {Object} op1 - Operation to transform
   * @param {Object} op2 - Operation to transform against
   * @returns {Object} Transformed operation
   */
  transformAgainstOperation(op1, op2) {
    // Simple operational transformation for basic operations
    if (
      op1.type === CRDTUtils.OPERATIONS.INSERT &&
      op2.type === CRDTUtils.OPERATIONS.INSERT
    ) {
      return this.transformInsertInsert(op1, op2);
    } else if (
      op1.type === CRDTUtils.OPERATIONS.INSERT &&
      op2.type === CRDTUtils.OPERATIONS.DELETE
    ) {
      return this.transformInsertDelete(op1, op2);
    } else if (
      op1.type === CRDTUtils.OPERATIONS.DELETE &&
      op2.type === CRDTUtils.OPERATIONS.INSERT
    ) {
      return this.transformDeleteInsert(op1, op2);
    } else if (
      op1.type === CRDTUtils.OPERATIONS.DELETE &&
      op2.type === CRDTUtils.OPERATIONS.DELETE
    ) {
      return this.transformDeleteDelete(op1, op2);
    }

    return op1;
  }

  /**
   * Transform INSERT against INSERT
   */
  transformInsertInsert(op1, op2) {
    if (op2.position <= op1.position) {
      return {
        ...op1,
        position: op1.position + op2.text.length,
      };
    }
    return op1;
  }

  /**
   * Transform INSERT against DELETE
   */
  transformInsertDelete(op1, op2) {
    if (op2.position <= op1.position) {
      return {
        ...op1,
        position: Math.max(op2.position, op1.position - op2.length),
      };
    }
    return op1;
  }

  /**
   * Transform DELETE against INSERT
   */
  transformDeleteInsert(op1, op2) {
    if (op2.position <= op1.position) {
      return {
        ...op1,
        position: op1.position + op2.text.length,
      };
    }
    return op1;
  }

  /**
   * Transform DELETE against DELETE
   */
  transformDeleteDelete(op1, op2) {
    if (op2.position < op1.position) {
      const overlap =
        Math.min(op1.position + op1.length, op2.position + op2.length) -
        Math.max(op1.position, op2.position);

      if (overlap > 0) {
        // There's an overlap, adjust the operation
        return {
          ...op1,
          position: Math.max(op1.position - op2.length, op2.position),
          length: Math.max(0, op1.length - overlap),
        };
      } else {
        // No overlap, just shift position
        return {
          ...op1,
          position: op1.position - op2.length,
        };
      }
    } else if (op2.position < op1.position + op1.length) {
      // Partial overlap
      const newLength =
        op1.length -
        Math.min(op2.length, op1.position + op1.length - op2.position);
      return {
        ...op1,
        length: Math.max(0, newLength),
      };
    }

    return op1;
  }

  /**
   * Apply operation to text
   * @param {Object} operation - Operation to apply
   * @param {string} text - Base text
   * @returns {string} Resulting text
   */
  applyOperationToText(operation, text) {
    switch (operation.type) {
      case CRDTUtils.OPERATIONS.INSERT:
        return (
          text.slice(0, operation.position) +
          operation.text +
          text.slice(operation.position)
        );

      case CRDTUtils.OPERATIONS.DELETE:
        return (
          text.slice(0, operation.position) +
          text.slice(operation.position + operation.length)
        );

      case CRDTUtils.OPERATIONS.RETAIN:
        return text; // No change for retain operations

      default:
        return text;
    }
  }

  /**
   * Create INSERT operation
   * @param {number} position - Position to insert at
   * @param {string} text - Text to insert
   * @returns {Object} INSERT operation
   */
  createInsertOperation(position, text) {
    return {
      type: CRDTUtils.OPERATIONS.INSERT,
      position,
      text,
    };
  }

  /**
   * Create DELETE operation
   * @param {number} position - Position to delete from
   * @param {number} length - Length of text to delete
   * @returns {Object} DELETE operation
   */
  createDeleteOperation(position, length) {
    return {
      type: CRDTUtils.OPERATIONS.DELETE,
      position,
      length,
    };
  }

  /**
   * Create RETAIN operation
   * @param {number} length - Length to retain
   * @returns {Object} RETAIN operation
   */
  createRetainOperation(length) {
    return {
      type: CRDTUtils.OPERATIONS.RETAIN,
      length,
    };
  }

  /**
   * Generate operations from text diff
   * @param {string} oldText - Old text
   * @param {string} newText - New text
   * @param {number} cursorPosition - Current cursor position
   * @returns {Array} Array of operations
   */
  generateOperationsFromDiff(oldText, newText, cursorPosition = 0) {
    const operations = [];

    // Simple diff algorithm - find common prefix and suffix
    let commonPrefixLength = 0;
    while (
      commonPrefixLength < Math.min(oldText.length, newText.length) &&
      oldText[commonPrefixLength] === newText[commonPrefixLength]
    ) {
      commonPrefixLength++;
    }

    let commonSuffixLength = 0;
    while (
      commonSuffixLength <
        Math.min(
          oldText.length - commonPrefixLength,
          newText.length - commonPrefixLength
        ) &&
      oldText[oldText.length - 1 - commonSuffixLength] ===
        newText[newText.length - 1 - commonSuffixLength]
    ) {
      commonSuffixLength++;
    }

    // Retain common prefix
    if (commonPrefixLength > 0) {
      operations.push(this.createRetainOperation(commonPrefixLength));
    }

    // Delete middle part if it exists
    const deleteLength =
      oldText.length - commonPrefixLength - commonSuffixLength;
    if (deleteLength > 0) {
      operations.push(
        this.createDeleteOperation(commonPrefixLength, deleteLength)
      );
    }

    // Insert new middle part if it exists
    const insertText = newText.slice(
      commonPrefixLength,
      newText.length - commonSuffixLength
    );
    if (insertText.length > 0) {
      operations.push(
        this.createInsertOperation(commonPrefixLength, insertText)
      );
    }

    // Retain common suffix
    if (commonSuffixLength > 0) {
      operations.push(this.createRetainOperation(commonSuffixLength));
    }

    return operations;
  }

  /**
   * Compose multiple operations into one
   * @param {Array} operations - Array of operations
   * @returns {Array} Composed operations
   */
  composeOperations(operations) {
    if (operations.length === 0) return [];
    if (operations.length === 1) return operations;

    const composed = [];
    let current = operations[0];

    for (let i = 1; i < operations.length; i++) {
      const next = operations[i];

      // Try to merge similar operations
      if (current.type === next.type) {
        if (
          current.type === CRDTUtils.OPERATIONS.INSERT &&
          current.position + current.text.length === next.position
        ) {
          // Merge adjacent inserts
          current = {
            ...current,
            text: current.text + next.text,
          };
          continue;
        } else if (
          current.type === CRDTUtils.OPERATIONS.DELETE &&
          current.position === next.position
        ) {
          // Merge adjacent deletes
          current = {
            ...current,
            length: current.length + next.length,
          };
          continue;
        } else if (current.type === CRDTUtils.OPERATIONS.RETAIN) {
          // Merge retains
          current = {
            ...current,
            length: current.length + next.length,
          };
          continue;
        }
      }

      // Can't merge, add current to composed and move to next
      composed.push(current);
      current = next;
    }

    // Add the last operation
    composed.push(current);

    return composed;
  }

  /**
   * Clean up old operations to prevent memory leaks
   * @param {string} sessionId - Session ID
   */
  cleanupOperations(sessionId) {
    const history = this.operationHistory.get(sessionId);
    if (history && history.length > 1000) {
      // Keep only the last 1000 operations
      this.operationHistory.set(sessionId, history.slice(-1000));
    }
  }

  /**
   * Get operation history for a session
   * @param {string} sessionId - Session ID
   * @param {number} fromTimestamp - Get operations from this timestamp
   * @returns {Array} Array of operations
   */
  getOperationHistory(sessionId, fromTimestamp = 0) {
    const history = this.operationHistory.get(sessionId) || [];
    return history.filter((op) => op.timestamp > fromTimestamp);
  }

  /**
   * Clear session data
   * @param {string} sessionId - Session ID
   */
  clearSession(sessionId) {
    this.operationHistory.delete(sessionId);
    this.stateVectors.delete(sessionId);
  }

  /**
   * Get current state vector for a session
   * @param {string} sessionId - Session ID
   * @returns {Map} State vector
   */
  getStateVector(sessionId) {
    return this.stateVectors.get(sessionId) || new Map();
  }

  /**
   * Validate operation
   * @param {Object} operation - Operation to validate
   * @returns {boolean} True if valid
   */
  isValidOperation(operation) {
    if (!operation || typeof operation !== "object") {
      return false;
    }

    if (!Object.values(CRDTUtils.OPERATIONS).includes(operation.type)) {
      return false;
    }

    switch (operation.type) {
      case CRDTUtils.OPERATIONS.INSERT:
        return (
          typeof operation.position === "number" &&
          typeof operation.text === "string" &&
          operation.position >= 0
        );

      case CRDTUtils.OPERATIONS.DELETE:
        return (
          typeof operation.position === "number" &&
          typeof operation.length === "number" &&
          operation.position >= 0 &&
          operation.length > 0
        );

      case CRDTUtils.OPERATIONS.RETAIN:
        return typeof operation.length === "number" && operation.length > 0;

      default:
        return false;
    }
  }
}

module.exports = new CRDTUtils();
