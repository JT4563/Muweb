# 📚 Technical Guide: Jest, Nginx, and MongoDB Indexes

## Table of Contents
1. [Jest Configuration](#jest-configuration)
2. [Nginx Reverse Proxy](#nginx-reverse-proxy)
3. [MongoDB Indexes](#mongodb-indexes)

---

## 1️⃣ Jest Configuration

### What is Jest?

**Jest** is a testing framework for JavaScript/Node.js that helps you write and run tests to verify your code works correctly.

```
Your Code → Jest → Run Tests → Pass/Fail Report
```

### jest.config.js File Breakdown

#### 📝 Complete File:
```javascript
module.exports = {
  // 1. Test Environment
  testEnvironment: "node",           // Run tests in Node.js (not browser)
  
  // 2. Where to Look for Tests
  roots: ["<rootDir>/tests"],        // Search in 'tests' folder
  testMatch: [                       // Find files matching these patterns
    "**/__tests__/**/*.js",          // Files in __tests__ folder
    "**/?(*.)+(spec|test).js"        // Files ending with .test.js or .spec.js
  ],
  
  // 3. Code Coverage - Which Files to Check
  collectCoverageFrom: [
    "controllers/**/*.js",           // Check all controller files
    "services/**/*.js",              // Check all service files
    "models/**/*.js",                // Check all model files
    "middleware/**/*.js",            // Check middleware
    "utils/**/*.js",                 // Check utilities
    "api/**/*.js",                   // Check API routes
    "websocket/**/*.js",             // Check WebSocket code
    "workers/**/*.js",               // Check worker code
    "!**/node_modules/**",           // Exclude node_modules
    "!**/tests/**",                  // Exclude test files themselves
  ],
  
  // 4. Coverage Thresholds - Minimum Coverage Required
  coverageThreshold: {
    global: {
      branches: 70,        // 70% of if/else paths tested
      functions: 75,       // 75% of functions tested
      lines: 75,           // 75% of code lines tested
      statements: 75,      // 75% of statements tested
    },
  },
  
  // 5. Setup
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],  // Run setup before tests
  
  // 6. Timing & Output
  testTimeout: 10000,      // 10 seconds per test
  verbose: true,           // Show detailed output
  bail: false,             // Don't stop on first failure
  detectOpenHandles: true, // Show resources not closed
};
```

### How It Works - Step by Step

#### 🔄 Test Execution Flow:

```
1. Jest Starts
   ↓
2. Runs tests/setup.js
   ├─ Connects to test database
   ├─ Clears collections
   ├─ Sets up environment
   ↓
3. Finds all .test.js files
   ├─ tests/unit/auth.test.js
   ├─ tests/unit/session.test.js
   ├─ tests/unit/jwt.test.js
   ↓
4. Runs Each Test
   ├─ Setup test environment
   ├─ Run test code
   ├─ Check assertions (expect statements)
   ├─ Clean up
   ↓
5. Collects Coverage Data
   ├─ Which functions were called?
   ├─ Which code lines ran?
   ├─ What's the percentage?
   ↓
6. Reports Results
   ├─ Pass/Fail for each test
   ├─ Coverage report
   ├─ Performance metrics
```

### Example Test Structure

```javascript
// tests/unit/auth.test.js

describe("Authentication Tests", () => {
  // Group of related tests
  
  beforeEach(async () => {
    // Setup before each test
    await db.collection('users').deleteMany({});
  });
  
  test("User registration should hash password", async () => {
    // Arrange: Set up test data
    const user = new User({ 
      username: "john", 
      password: "plaintext123" 
    });
    
    // Act: Do something
    await user.save();
    
    // Assert: Check if it worked
    expect(user.password).not.toBe("plaintext123"); // Hashed
    expect(user.password).toMatch(/^\$2a\$/); // Bcrypt format
  });
  
  test("Duplicate email should fail", async () => {
    // Create first user
    const user1 = new User({
      email: "test@example.com",
      username: "user1"
    });
    await user1.save();
    
    // Try to create second with same email
    const user2 = new User({
      email: "test@example.com",
      username: "user2"
    });
    
    // Should throw error
    await expect(user2.save()).rejects.toThrow();
  });
});
```

### Coverage Report Example

```
Coverage Report (75% threshold)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File                        Lines      Functions   Branches
controllers/auth.controller   92%  ✅   89%  ✅    85%  ✅
services/jwt.service         100%  ✅  100%  ✅   100%  ✅
models/session.model          78%  ✅   82%  ✅    71%  ❌ (Below 75%)
middleware/auth.middleware    88%  ✅   85%  ✅    90%  ✅

Overall: 89% ✅ PASSING
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test -- auth.test.js

# Watch mode (re-run on file changes)
npm test -- --watch

# Update snapshots (if using snapshot testing)
npm test -- -u
```

---

## 2️⃣ Nginx Reverse Proxy

### What is Nginx?

**Nginx** (pronounced "engine-x") is a web server that acts as a **reverse proxy** - it sits between your clients (browsers) and your actual server (Node.js app).

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Client (Browser)                                       │
│  ↓ (Request)                                            │
│  Nginx Reverse Proxy 🔀 (Port 80)                       │
│  ├─ Route to right backend                              │
│  ├─ Rate limiting                                       │
│  ├─ Security headers                                    │
│  ├─ Compression                                         │
│  └─ Load balancing                                      │
│  ↓ (Forward)                                            │
│  Node.js Express App (Port 5000)                        │
│  ↓ (Response)                                           │
│  Nginx (Return)                                         │
│  ↓                                                      │
│  Client Browser                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### nginx.conf - Key Sections Explained

#### 1️⃣ **Basic Setup**
```nginx
user nginx;                          # Run as 'nginx' user
worker_processes auto;               # Use all CPU cores
error_log /var/log/nginx/error.log; # Error logging
```

#### 2️⃣ **Performance Settings**
```nginx
sendfile on;          # Efficient file sending
tcp_nopush on;        # Send headers in one packet
tcp_nodelay on;       # Don't wait for full packets
keepalive_timeout 65; # Connection timeout

# Gzip compression - reduce file size by 70%
gzip on;
gzip_comp_level 6;    # Compression level (1-9)
gzip_types text/plain text/css application/json;
```

**Effect:**
```
Without Gzip:  Response = 150 KB
With Gzip:     Response = 45 KB  (70% smaller) ⚡
```

#### 3️⃣ **Rate Limiting - Prevent Abuse**
```nginx
# Allow max 100 requests per minute per IP
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;

# Allow max 10 requests per minute for code execution
limit_req_zone $binary_remote_addr zone=execute_limit:10m rate=10r/m;

location /api/execute {
  limit_req zone=execute_limit burst=2 nodelay;
  # ...
}
```

**Example:**
```
User 1: Requests → 1, 2, 3, 4, 5 ✅ (within limit)
        Request 6 ❌ (blocked, too many requests)
        Waits 60 seconds...
        Request 7 ✅ (allowed again)
```

#### 4️⃣ **Upstream Load Balancing**
```nginx
upstream backend {
    least_conn;           # Send to server with least connections
    server app:5000 max_fails=3 fail_timeout=30s;
    keepalive 32;         # Keep 32 idle connections
}
```

**How It Works:**
```
Multiple Requests
  ↓
Nginx checks load on each backend server
  ↓
Routes to server with fewest connections
  ↓
Automatic failover if server is down
```

#### 5️⃣ **Security Headers**
```nginx
add_header X-Frame-Options "SAMEORIGIN";
# Prevents clickjacking attacks

add_header X-Content-Type-Options "nosniff";
# Prevents MIME-type sniffing

add_header X-XSS-Protection "1; mode=block";
# Enables browser XSS protection

add_header Content-Security-Policy "default-src 'self'";
# Controls what resources can load
```

#### 6️⃣ **Proxy Locations**

**Regular API Routes:**
```nginx
location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    proxy_pass http://backend;           # Forward to Node.js
    proxy_set_header Host $host;         # Keep original host
    proxy_set_header X-Real-IP $remote_addr;  # Pass client IP
    proxy_connect_timeout 60s;           # 60s to connect
}
```

**Code Execution (Strict Limits):**
```nginx
location /api/execute {
    limit_req zone=execute_limit burst=2 nodelay;  # Very strict!
    proxy_read_timeout 120s;  # Longer timeout for heavy computation
}
```

**WebSocket (Real-time):**
```nginx
location /socket.io {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_read_timeout 86400;  # 24 hours - keep connection alive
}
```

**Health Check:**
```nginx
location /health {
    access_log off;           # Don't log health checks
    proxy_pass http://backend;
}
```

**Metrics (Restricted):**
```nginx
location /metrics {
    allow 172.16.0.0/12;     # Only Docker internal
    allow 127.0.0.1;          # And localhost
    deny all;                 # Deny everyone else
    proxy_pass http://backend;
}
```

### Why Use Nginx?

| Feature | Benefit |
|---------|---------|
| **Rate Limiting** | Prevent DDoS attacks, abuse |
| **Compression** | 70% smaller responses = faster |
| **Load Balancing** | Distribute traffic across servers |
| **Security Headers** | Protect against attacks |
| **Caching** | Reduce backend load |
| **SSL/TLS** | HTTPS encryption |
| **WebSocket Support** | Real-time communication |
| **Logging** | Track all requests |

### Performance Impact

```
Without Nginx:
  100 requests → Node.js (uses 100 connections)
  Response time: 500ms
  CPU usage: 80%

With Nginx:
  100 requests → Nginx (optimized, compressed)
                → Node.js (10-20 connections)
  Response time: 150ms (70% faster)
  CPU usage: 20% (75% less)
```

---

## 3️⃣ MongoDB Indexes

### What are Indexes?

**Indexes** are like a book's index - they help MongoDB find data MUCH faster without scanning every record.

```
Without Index:
  Find all users with email "john@example.com"
  ↓
  Scan ALL 1,000,000 records ❌
  ↓
  Found! (after 1000ms)

With Index:
  Find all users with email "john@example.com"
  ↓
  Look in email index ✅
  ↓
  Found! (after 1ms) - 1000x faster!
```

### Index Types in Your Project

#### 1️⃣ **Unique Index** (Prevents Duplicates)

```javascript
// Users collection - email must be unique
db.users.createIndex({ email: 1 }, { unique: true });
//                      ↑ field   ↑ 1=ascending order

// If you try to create two users with same email:
// User 1: email: "john@example.com" ✅ Allowed
// User 2: email: "john@example.com" ❌ Error! Duplicate key
```

#### 2️⃣ **Single Field Index** (Fast Lookup)

```javascript
// Sessions - quickly find by owner
db.sessions.createIndex({ owner: 1 });

// Before: Scan 10,000 sessions to find yours → 500ms
// After: Index lookup → 5ms (100x faster)
```

#### 3️⃣ **Compound Index** (Multiple Fields)

```javascript
// Find sessions by owner AND sort by date
db.sessions.createIndex({ owner: 1, createdAt: -1 });
//                         ↑ ascending  ↑ descending

// Query: Find all sessions I own, newest first
db.sessions
  .find({ owner: ObjectId("...") })
  .sort({ createdAt: -1 })  // Instant! Index does both
```

#### 4️⃣ **TTL Index** (Auto-Delete Old Data)

```javascript
// Logs expire after 30 days
db.logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 });
//                                       ↑ 30 days in seconds

// Effect:
Day 1:  Log created ✅
Day 29: Log exists ✅
Day 30: MongoDB automatically deletes ⚠️
```

### All Indexes in Your Project

```javascript
// ========== USERS COLLECTION ==========
db.users.createIndex({ email: 1 }, { unique: true });
// Purpose: Login by email, prevent duplicates
// Speed: O(log n) - Very fast

db.users.createIndex({ username: 1 }, { unique: true });
// Purpose: Find user by username, prevent duplicates
// Speed: O(log n)

db.users.createIndex({ createdAt: 1 });
// Purpose: Get newest users first
// Speed: O(log n)

db.users.createIndex({ lastLogin: 1 });
// Purpose: Find inactive users (admin task)
// Speed: O(log n)

// ========== SESSIONS COLLECTION ==========
db.sessions.createIndex({ owner: 1, createdAt: -1 });
// Purpose: Find my sessions, newest first
// Query: db.sessions.find({owner: "..."}).sort({createdAt: -1})
// Speed: O(log n) - instant

db.sessions.createIndex({ isPublic: 1, updatedAt: -1 });
// Purpose: Find public sessions, recently updated
// Query: db.sessions.find({isPublic: true}).sort({updatedAt: -1})
// Speed: O(log n)

db.sessions.createIndex({ createdAt: 1 });
// Purpose: Find sessions by creation date
// Speed: O(log n)

db.sessions.createIndex({ "participants.user": 1 });
// Purpose: Find sessions where user is participant
// Query: db.sessions.find({"participants.user": "..."})
// Speed: O(log n)

db.sessions.createIndex({ isActive: 1 });
// Purpose: Find active sessions only
// Speed: O(log n)

// ========== LOGS COLLECTION ==========
db.logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 });
// Purpose: Auto-delete logs after 30 days + find by date
// Effect: Storage auto-cleanup + O(log n) search

db.logs.createIndex({ level: 1, timestamp: -1 });
// Purpose: Find error logs, newest first
// Query: db.logs.find({level: "error"}).sort({timestamp: -1})
// Speed: O(log n)

db.logs.createIndex({ userId: 1, timestamp: -1 });
// Purpose: Get user's activity logs
// Query: db.logs.find({userId: "..."}).sort({timestamp: -1})
// Speed: O(log n)

db.logs.createIndex({ sessionId: 1, timestamp: -1 });
// Purpose: Get session's logs
// Query: db.logs.find({sessionId: "..."}).sort({timestamp: -1})
// Speed: O(log n)
```

### Index Performance Comparison

```
Query: Find user with email "john@example.com"

WITHOUT INDEX:
┌─────────────┐
│ Document 1  │ ❌ Not a match
├─────────────┤
│ Document 2  │ ❌ Not a match
├─────────────┤
│ Document 3  │ ❌ Not a match
│ ... (100,000 more)
├─────────────┤
│ Document X  │ ✅ Match! (found)
└─────────────┘
Time: 5000ms ❌ TOO SLOW

WITH INDEX:
┌─ Email Index ─┐
│ a@email.com   │ → Document 5
│ b@email.com   │ → Document 12
│ j@email.com   │ → Document X ✅
│ z@email.com   │ → Document 98
└───────────────┘
Time: 5ms ✅ INSTANT
```

### Index Storage Cost

```
Benefits:
  ✅ 1000x faster queries
  ✅ Auto-cleanup (TTL index)
  ✅ Data consistency (unique index)
  ✅ Better sort performance

Cost:
  ⚠️ Uses extra storage (~10% per index)
  ⚠️ Slows down writes (must update index)
  ⚠️ Needs maintenance

Rule: Index frequently-queried fields only
```

### Checking Indexes

```bash
# In MongoDB:

# List all indexes on users collection
db.users.getIndexes();
// Returns:
// [
//   { key: { _id: 1 } },              // Default
//   { key: { email: 1 }, unique: true },
//   { key: { username: 1 }, unique: true },
//   { key: { createdAt: 1 } }
// ]

# Check index stats
db.users.aggregate([{ $indexStats: {} }])
```

### Best Practices

```javascript
✅ DO:
- Index frequently searched fields
- Use compound indexes for common queries
- Use TTL indexes for temporary data
- Use unique indexes for constraints

❌ DON'T:
- Create too many indexes (slows writes)
- Index rarely-used fields
- Create duplicate indexes
- Forget to monitor index usage
```

---

## 📊 How They Work Together

```
┌────────────────────────────────────────────────────┐
│                 Client Browser                     │
│                 (User Request)                     │
└─────────────────────┬────────────────────────────┘
                      │
                      ↓
    ┌─────────────────────────────────────┐
    │      Nginx Reverse Proxy            │
    ├─────────────────────────────────────┤
    │ • Rate Limiting (max 100 req/min)   │
    │ • Gzip Compression                  │
    │ • Security Headers                  │
    │ • Load Balancing                    │
    └─────────────────┬────────────────────┘
                      │
                      ↓
    ┌─────────────────────────────────────┐
    │    Node.js Express Application      │
    │  (controllers, services, routes)    │
    └─────────────────┬────────────────────┘
                      │
                      ↓
    ┌─────────────────────────────────────┐
    │   MongoDB Database                  │
    ├─────────────────────────────────────┤
    │ • Email Index: O(log n) lookup      │
    │ • Sessions Index: O(log n) lookup   │
    │ • TTL Index: Auto-cleanup           │
    │ • Compound Indexes: Fast sorting    │
    └─────────────────────────────────────┘

                      ↓

    ┌─────────────────────────────────────┐
    │         Jest Tests (CI/CD)          │
    ├─────────────────────────────────────┤
    │ • 25 Auth Tests                     │
    │ • 30 Session Tests                  │
    │ • 20 JWT Tests                      │
    │ • 75%+ Coverage Required            │
    │ • Runs before deployment            │
    └─────────────────────────────────────┘
```

---

## 🎓 Quick Reference

| Component | Purpose | Speed | Cost |
|-----------|---------|-------|------|
| **Jest** | Run tests, verify code | n/a | CPU/Time |
| **Nginx** | Route, compress, protect | 70% faster | 256MB RAM |
| **MongoDB Indexes** | Fast queries | 1000x faster | Storage |

---

## 🚀 Key Takeaways

### Jest
- ✅ Automated testing framework
- ✅ 75+ tests in your project
- ✅ Run before deployment
- ✅ Ensures code quality

### Nginx
- ✅ Reverse proxy (between client and app)
- ✅ Rate limiting (security)
- ✅ Compression (speed)
- ✅ Load balancing (scalability)

### MongoDB Indexes
- ✅ Make queries 1000x faster
- ✅ Prevent duplicate data
- ✅ Auto-cleanup old data
- ✅ Support complex sorting

