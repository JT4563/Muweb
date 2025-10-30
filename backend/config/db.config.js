const mongoose = require("mongoose");
require("dotenv").config();

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

      // Get connection string from environment variables
      let connectionString = process.env.MONGODB_URI;

      // If no MONGODB_URI, construct from individual parts
      if (!connectionString) {
        const dbHost = process.env.DB_HOST || "localhost";
        const dbPort = process.env.DB_PORT || "27017";
        const dbName = process.env.DB_NAME || "codecrafter";
        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASSWORD;

        // Build connection string with or without authentication
        if (dbUser && dbPassword) {
          connectionString = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
        } else {
          connectionString = `mongodb://${dbHost}:${dbPort}/${dbName}`;
        }
      }

      console.log(
        `Connecting to MongoDB at: ${connectionString.replace(/:[^:]*@/, ":***@")}`
      );

      // Connect to the MongoDB
      return await mongoose.connect(connectionString, connectionOptions);
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  },

  /**
   * Disconnect from MongoDB database
   * @returns {Promise} Disconnection promise
   */
  disconnect: async () => {
    return await mongoose.disconnect();
  },
};

module.exports = dbConfig;
