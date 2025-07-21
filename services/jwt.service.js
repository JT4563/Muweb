const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

class JWTService {
  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || 'codecrafter_access_secret_key';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'codecrafter_refresh_secret_key';
    this.accessTokenExpiry = process.env.JWT_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  /**
   * Generate access and refresh tokens
   * @param {Object} payload - User payload to encode in token
   * @returns {Object} Object containing accessToken and refreshToken
   */
  generateTokens(payload) {
    try {
      const accessToken = jwt.sign(
        {
          id: payload.id,
          email: payload.email,
          username: payload.username,
          isPremium: payload.isPremium || false,
          role: payload.role || 'user'
        },
        this.accessTokenSecret,
        {
          expiresIn: this.accessTokenExpiry,
          issuer: 'codecrafter',
          audience: 'codecrafter-users'
        }
      );

      const refreshToken = jwt.sign(
        {
          id: payload.id,
          type: 'refresh'
        },
        this.refreshTokenSecret,
        {
          expiresIn: this.refreshTokenExpiry,
          issuer: 'codecrafter',
          audience: 'codecrafter-users'
        }
      );

      return {
        accessToken,
        refreshToken
      };
    } catch (error) {
      logger.error('Error generating tokens:', error);
      throw new Error('Token generation failed');
    }
  }

  /**
   * Verify access token
   * @param {string} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret, {
        issuer: 'codecrafter',
        audience: 'codecrafter-users'
      });
    } catch (error) {
      logger.error('Access token verification failed:', error.message);
      throw error;
    }
  }

  /**
   * Verify refresh token
   * @param {string} token - Refresh token to verify
   * @returns {Object} Decoded token payload
   */
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'codecrafter',
        audience: 'codecrafter-users'
      });

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      logger.error('Refresh token verification failed:', error.message);
      throw error;
    }
  }

  /**
   * Decode token without verification (for debugging)
   * @param {string} token - JWT token to decode
   * @returns {Object} Decoded token payload
   */
  decodeToken(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      logger.error('Token decoding failed:', error);
      return null;
    }
  }

  /**
   * Extract token from Authorization header
   * @param {string} authHeader - Authorization header value
   * @returns {string|null} Extracted token or null
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }

    return null;
  }

  /**
   * Check if token is expired
   * @param {string} token - JWT token to check
   * @returns {boolean} True if token is expired
   */
  isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.payload.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiration time
   * @param {string} token - JWT token
   * @returns {Date|null} Expiration date or null
   */
  getTokenExpiration(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.payload.exp) {
        return null;
      }

      return new Date(decoded.payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate a token for password reset
   * @param {string} userId - User ID
   * @returns {string} Reset token
   */
  generateResetToken(userId) {
    try {
      return jwt.sign(
        {
          id: userId,
          type: 'password_reset'
        },
        this.accessTokenSecret,
        {
          expiresIn: '1h',
          issuer: 'codecrafter',
          audience: 'codecrafter-users'
        }
      );
    } catch (error) {
      logger.error('Error generating reset token:', error);
      throw new Error('Reset token generation failed');
    }
  }

  /**
   * Verify password reset token
   * @param {string} token - Reset token to verify
   * @returns {Object} Decoded token payload
   */
  verifyResetToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'codecrafter',
        audience: 'codecrafter-users'
      });

      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      logger.error('Reset token verification failed:', error.message);
      throw error;
    }
  }
}

module.exports = new JWTService();
