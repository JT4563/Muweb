const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwtService = require("../services/jwt.service");
const redisConfig = require("../config/redis.config");
const logger = require("../utils/logger");

const authController = {
  /**
   * Register a new user
   */
  register: async (req, res, next) => {
    try {
      const { email, password, username, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(409).json({
          error: "User already exists with this email or username",
          code: "USER_EXISTS",
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const user = new User({
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        profile: {
          joinedAt: new Date(),
          preferences: {
            theme: "dark",
            language: "javascript",
          },
        },
      });

      await user.save();

      // Generate tokens
      const { accessToken, refreshToken } = jwtService.generateTokens({
        id: user._id,
        email: user.email,
        username: user.username,
      });

      // Store refresh token in Redis
      await redisConfig.setRefreshToken(user._id.toString(), refreshToken);

      logger.info(`New user registered: ${email}`, { userId: user._id });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      logger.error("Registration error:", error);
      next(error);
    }
  },

  /**
   * Login user
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS",
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS",
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const { accessToken, refreshToken } = jwtService.generateTokens({
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      });

      // Store refresh token in Redis
      await redisConfig.setRefreshToken(user._id.toString(), refreshToken);

      logger.info(`User logged in: ${email}`, { userId: user._id });

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      logger.error("Login error:", error);
      next(error);
    }
  },

  /**
   * Logout user
   */
  logout: async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Remove refresh token from Redis
      await redisConfig.deleteRefreshToken(userId);

      logger.info(`User logged out: ${req.user.email}`, { userId });

      res.json({
        message: "Logout successful",
      });
    } catch (error) {
      logger.error("Logout error:", error);
      next(error);
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          error: "Refresh token required",
          code: "REFRESH_TOKEN_REQUIRED",
        });
      }

      // Verify refresh token
      const decoded = jwtService.verifyRefreshToken(refreshToken);

      // Check if refresh token exists in Redis
      const storedToken = await redisConfig.getRefreshToken(decoded.id);
      if (!storedToken || storedToken !== refreshToken) {
        return res.status(401).json({
          error: "Invalid refresh token",
          code: "INVALID_REFRESH_TOKEN",
        });
      }

      // Get user data
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          error: "User not found",
          code: "USER_NOT_FOUND",
        });
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } =
        jwtService.generateTokens({
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
        });

      // Update refresh token in Redis
      await redisConfig.setRefreshToken(user._id.toString(), newRefreshToken);

      res.json({
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      logger.error("Token refresh error:", error);
      next(error);
    }
  },

  /**
   * Get user profile
   */
  getProfile: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          code: "USER_NOT_FOUND",
        });
      }

      res.json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          preferences: user.preferences,
        },
      });
    } catch (error) {
      logger.error("Get profile error:", error);
      next(error);
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const updates = req.body;

      // Remove sensitive fields from updates
      delete updates.password;
      delete updates.email;
      delete updates._id;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          error: "User not found",
          code: "USER_NOT_FOUND",
        });
      }

      logger.info(`Profile updated: ${req.user.email}`, { userId });

      res.json({
        message: "Profile updated successfully",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          preferences: user.preferences,
        },
      });
    } catch (error) {
      logger.error("Update profile error:", error);
      next(error);
    }
  },

  /**
   * Change user password
   */
  changePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Get user with password
      const user = await User.findById(userId).select("+password");
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          code: "USER_NOT_FOUND",
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Current password is incorrect",
          code: "INVALID_CURRENT_PASSWORD",
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      user.password = hashedPassword;
      await user.save();

      // Invalidate all refresh tokens
      await redisConfig.deleteRefreshToken(userId);

      logger.info(`Password changed: ${req.user.email}`, { userId });

      res.json({
        message: "Password changed successfully",
      });
    } catch (error) {
      logger.error("Change password error:", error);
      next(error);
    }
  },
};

module.exports = authController;
