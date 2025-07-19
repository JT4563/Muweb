const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Database configuration and connection management
 */
const dbConfig = {
  /**
   * Connect to MongoDB database
   * @returns {Promise} Connection promise
   */
  connect: async () => {
    try {
      const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      // Get connection string from environment variables or use default
      const dbHost = process.env.DB_HOST || 'localhost';
      const dbName = process.env.DB_NAME || 'muweb_db';
      const dbUser = process.env.DB_USER || 'muweb_user';
      const dbPassword = process.env.DB_PASSWORD || 'muweb_password';
      
      const connectionString = `mongodb://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;
      
      // Connect to the MongoDB
      return await mongoose.connect(connectionString, connectionOptions);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  },

  /**
   * Disconnect from MongoDB database
   * @returns {Promise} Disconnection promise
   */
  disconnect: async () => {
    return await mongoose.disconnect();
  }
};

module.exports = dbConfig;
