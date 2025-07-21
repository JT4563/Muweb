const validator = {
  /**
   * Sanitize input to prevent XSS attacks
   */
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    return input
      .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
      .trim();
  },

  /**
   * Validate user registration data
   */
  validateRegistration: (req, res, next) => {
    // Sanitize inputs
    const { email, password, username, firstName, lastName } = req.body;
    req.body.email = validator.sanitizeInput(email);
    req.body.username = validator.sanitizeInput(username);
    req.body.firstName = validator.sanitizeInput(firstName);
    req.body.lastName = validator.sanitizeInput(lastName);
    
    const errors = [];

    // Email validation - More robust regex to prevent bypass
    if (!email) {
      errors.push('Email is required');
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.push('Please provide a valid email address');
    } else if (email.length > 254) {
      errors.push('Email address is too long');
    }

    // Username validation
    if (!username) {
      errors.push('Username is required');
    } else if (username.length < 3 || username.length > 30) {
      errors.push('Username must be between 3 and 30 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    // Password validation - Enhanced security
    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    } else if (/^(.)\1+$/.test(password)) {
      errors.push('Password cannot be all the same character');
    } else if (/(?:password|12345|qwerty|admin|login|pass)/i.test(password)) {
      errors.push('Password contains common words that are not allowed');
    }

    // First name validation
    if (!firstName) {
      errors.push('First name is required');
    } else if (firstName.length > 50) {
      errors.push('First name must be less than 50 characters');
    }

    // Last name validation
    if (!lastName) {
      errors.push('Last name is required');
    } else if (lastName.length > 50) {
      errors.push('Last name must be less than 50 characters');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }

    next();
  },

  /**
   * Validate user login data
   */
  validateLogin: (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) {
      errors.push('Email is required');
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.push('Please provide a valid email address');
    } else if (email.length > 254) {
      errors.push('Email address is too long');
    }

    if (!password) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }

    next();
  },

  /**
   * Validate profile update data
   */
  validateProfileUpdate: (req, res, next) => {
    const { firstName, lastName, username, profile } = req.body;
    const errors = [];

    // First name validation
    if (firstName !== undefined) {
      if (typeof firstName !== 'string' || firstName.trim().length === 0) {
        errors.push('First name must be a non-empty string');
      } else if (firstName.length > 50) {
        errors.push('First name must be less than 50 characters');
      }
    }

    // Last name validation
    if (lastName !== undefined) {
      if (typeof lastName !== 'string' || lastName.trim().length === 0) {
        errors.push('Last name must be a non-empty string');
      } else if (lastName.length > 50) {
        errors.push('Last name must be less than 50 characters');
      }
    }

    // Username validation
    if (username !== undefined) {
      if (typeof username !== 'string' || username.trim().length === 0) {
        errors.push('Username must be a non-empty string');
      } else if (username.length < 3 || username.length > 30) {
        errors.push('Username must be between 3 and 30 characters');
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
      }
    }

    // Profile validation
    if (profile !== undefined) {
      if (typeof profile !== 'object' || profile === null) {
        errors.push('Profile must be an object');
      } else {
        // Bio validation
        if (profile.bio !== undefined && profile.bio.length > 500) {
          errors.push('Bio must be less than 500 characters');
        }

        // Website validation
        if (profile.website !== undefined && profile.website) {
          const urlPattern = /^https?:\/\/.+/;
          if (!urlPattern.test(profile.website)) {
            errors.push('Website must be a valid URL starting with http:// or https://');
          }
        }

        // GitHub username validation
        if (profile.githubUsername !== undefined && profile.githubUsername) {
          if (!/^[a-zA-Z0-9-]+$/.test(profile.githubUsername)) {
            errors.push('GitHub username can only contain letters, numbers, and hyphens');
          }
        }

        // Preferences validation
        if (profile.preferences !== undefined) {
          const { theme, language, fontSize, tabSize } = profile.preferences;

          if (theme !== undefined && !['light', 'dark', 'auto'].includes(theme)) {
            errors.push('Theme must be one of: light, dark, auto');
          }

          if (language !== undefined && !['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust'].includes(language)) {
            errors.push('Language must be one of: javascript, python, java, cpp, c, go, rust');
          }

          if (fontSize !== undefined && (fontSize < 10 || fontSize > 24)) {
            errors.push('Font size must be between 10 and 24');
          }

          if (tabSize !== undefined && (tabSize < 1 || tabSize > 8)) {
            errors.push('Tab size must be between 1 and 8');
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }

    next();
  },

  /**
   * Validate password change data
   */
  validatePasswordChange: (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const errors = [];

    if (!currentPassword) {
      errors.push('Current password is required');
    }

    if (!newPassword) {
      errors.push('New password is required');
    } else if (newPassword.length < 8) {
      errors.push('New password must be at least 8 characters long');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      errors.push('New password must contain at least one uppercase letter, one lowercase letter, and one number');
    }

    if (!confirmPassword) {
      errors.push('Password confirmation is required');
    } else if (newPassword !== confirmPassword) {
      errors.push('New password and confirmation do not match');
    }

    if (currentPassword === newPassword) {
      errors.push('New password must be different from current password');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }

    next();
  },

  /**
   * Validate session creation data
   */
  validateSessionCreation: (req, res, next) => {
    const { title, description, language, isPublic } = req.body;
    const errors = [];

    if (!title) {
      errors.push('Session title is required');
    } else if (title.length > 100) {
      errors.push('Session title must be less than 100 characters');
    }

    if (description && description.length > 500) {
      errors.push('Session description must be less than 500 characters');
    }

    if (!language) {
      errors.push('Programming language is required');
    } else if (!['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust'].includes(language)) {
      errors.push('Language must be one of: javascript, python, java, cpp, c, go, rust');
    }

    if (isPublic !== undefined && typeof isPublic !== 'boolean') {
      errors.push('isPublic must be a boolean value');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }

    next();
  },

  /**
   * Validate code execution data
   */
  validateCodeExecution: (req, res, next) => {
    const { language, code, stdin } = req.body;
    const errors = [];

    if (!language) {
      errors.push('Programming language is required');
    } else if (!['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust'].includes(language)) {
      errors.push('Language must be one of: javascript, python, java, cpp, c, go, rust');
    }

    if (!code) {
      errors.push('Code is required');
    } else if (code.length > 50000) { // 50KB limit
      errors.push('Code must be less than 50KB');
    }

    if (stdin && stdin.length > 10000) { // 10KB limit
      errors.push('Standard input must be less than 10KB');
    }

    // Basic security checks
    const dangerousPatterns = [
      /import\s+os/i,
      /import\s+subprocess/i,
      /exec\s*\(/i,
      /eval\s*\(/i,
      /system\s*\(/i,
      /shell_exec/i,
      /file_get_contents/i,
      /file_put_contents/i,
      /require\s*\(\s*['"]/i,
      /include\s*\(\s*['"]/i
    ];

    const hasDangerousPattern = dangerousPatterns.some(pattern => pattern.test(code));
    if (hasDangerousPattern) {
      errors.push('Code contains potentially dangerous operations');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }

    next();
  },

  /**
   * Validate session join data
   */
  validateSessionJoin: (req, res, next) => {
    const { sessionId } = req.params;
    const errors = [];

    if (!sessionId) {
      errors.push('Session ID is required');
    } else if (!/^[0-9a-fA-F]{24}$/.test(sessionId)) {
      errors.push('Invalid session ID format');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
        code: 'VALIDATION_ERROR'
      });
    }

    next();
  },

  /**
   * Validate code execution request
   */
  executeValidation: (req, res, next) => {
    const { sessionId, language, code, stdin, timeout } = req.body;
    const errors = [];

    // Session ID validation
    if (!sessionId) {
      errors.push('Session ID is required');
    } else if (!validator.isValidObjectId(sessionId)) {
      errors.push('Invalid session ID format');
    }

    // Language validation
    if (!language) {
      errors.push('Programming language is required');
    } else if (typeof language !== 'string') {
      errors.push('Language must be a string');
    } else if (!/^[a-zA-Z0-9_+-]+$/.test(language)) {
      errors.push('Invalid language format');
    }

    // Code validation
    if (!code) {
      errors.push('Code is required');
    } else if (typeof code !== 'string') {
      errors.push('Code must be a string');
    } else if (code.length > 50000) { // 50KB limit
      errors.push('Code size exceeds maximum limit (50KB)');
    }

    // Optional stdin validation
    if (stdin !== undefined) {
      if (typeof stdin !== 'string') {
        errors.push('Standard input must be a string');
      } else if (stdin.length > 10000) { // 10KB limit
        errors.push('Standard input size exceeds maximum limit (10KB)');
      }
    }

    // Optional timeout validation
    if (timeout !== undefined) {
      if (!Number.isInteger(timeout) || timeout < 1000 || timeout > 300000) {
        errors.push('Timeout must be an integer between 1000ms and 300000ms (5 minutes)');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  },

  /**
   * Validate ObjectId format
   */
  isValidObjectId: (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  },

  /**
   * Validate email format
   */
  isValidEmail: (email) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  },

  /**
   * Validate URL format
   */
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};

module.exports = validator;
