// tests/setup.js
const mongoose = require("mongoose");
require("dotenv").config();

// Test database connection
const connectTestDB = async () => {
  try {
    const mongoUrl =
      process.env.MONGO_TEST_URL ||
      "mongodb://localhost:27017/codecrafter_test";
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✓ Test database connected");
  } catch (error) {
    console.error("✗ Test database connection failed:", error);
    process.exit(1);
  }
};

// Clean up after tests
const disconnectTestDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("✓ Test database disconnected");
  } catch (error) {
    console.error("✗ Test database disconnect failed:", error);
  }
};

// Clean collections
const cleanCollections = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

module.exports = {
  connectTestDB,
  disconnectTestDB,
  cleanCollections,
};
