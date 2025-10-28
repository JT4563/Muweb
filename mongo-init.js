// MongoDB initialization script
// This script runs when MongoDB container starts

db.getSiblingDB("admin").auth("admin", "changeme123!");

// Create the main database
db = db.getSiblingDB("codecrafter");

// Create collections
db.createCollection("users");
db.createCollection("sessions");
db.createCollection("logs");

// Create users collection indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });
db.users.createIndex({ lastLogin: 1 });

// Create sessions collection indexes
db.sessions.createIndex({ owner: 1, createdAt: -1 });
db.sessions.createIndex({ isPublic: 1, updatedAt: -1 });
db.sessions.createIndex({ createdAt: 1 });
db.sessions.createIndex({ "participants.user": 1 });
db.sessions.createIndex({ isActive: 1 });

// Create logs collection with TTL index (auto-delete after 30 days)
db.logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 });
db.logs.createIndex({ level: 1, timestamp: -1 });
db.logs.createIndex({ userId: 1, timestamp: -1 });
db.logs.createIndex({ sessionId: 1, timestamp: -1 });

// Create a test user (optional - for development)
db.users.insertOne({
  _id: ObjectId(),
  username: "testuser",
  email: "test@example.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQJJ6pE8/9CX7GqMvu", // hash of 'password'
  firstName: "Test",
  lastName: "User",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLogin: new Date(),
  preferences: {
    theme: "dark",
    editorSettings: {
      fontSize: 14,
      tabSize: 2,
    },
  },
  isActive: true,
});

// Create an admin user (optional - for development)
db.users.insertOne({
  _id: ObjectId(),
  username: "admin",
  email: "admin@example.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeQJJ6pE8/9CX7GqMvu", // hash of 'password'
  firstName: "Admin",
  lastName: "User",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLogin: new Date(),
  preferences: {
    theme: "dark",
    editorSettings: {
      fontSize: 14,
      tabSize: 2,
    },
  },
  isActive: true,
});

print("MongoDB initialization complete!");
print("Collections created: users, sessions, logs");
print("Indexes created for optimal query performance");
print("Test user created: testuser / test@example.com");
print("Admin user created: admin / admin@example.com");
