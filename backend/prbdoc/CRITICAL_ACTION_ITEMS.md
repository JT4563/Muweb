# 🔧 Immediate Action Items - CodeCrafter Project

## CRITICAL FIXES (Do These First - 1-2 Days)

### 1. ❌ CRITICAL: Fix Redis Configuration

**File:** `config/redis.config.js`
**Status:** Currently incomplete - only has `createClient()` and `disconnect()`

**Missing Methods to Add:**

```javascript
// In redisConfig object, add:
const client = null; // Store client instance

setRefreshToken: async (userId, token, expiry = 604800) => {
  // Store token in Redis with TTL
},

getRefreshToken: async (userId) => {
  // Retrieve stored token
},

deleteRefreshToken: async (userId) => {
  // Remove token
},

setSession: async (sessionId, sessionData) => {
  // Cache session
},

getSession: async (sessionId) => {
  // Get cached session
},

deleteSession: async (sessionId) => {
  // Remove cached session
},

setUserSocket: async (userId, socketId, sessionId) => {
  // Map user to socket
},

removeUserSocket: async (userId, socketId) => {
  // Remove mapping
},

connect: async () => {
  // Proper initialization
},

disconnect: async () => {
  // Proper cleanup
}
```

**Impact:** ❌ Auth and WebSocket won't work without this

---

### 2. ❌ CRITICAL: Implement Session Model Methods

**File:** `models/session.model.js`
**Status:** Schema exists but methods missing

**Required Implementation:**

```javascript
// Add to sessionSchema:

// Schema updates needed:
- Change schema.userId to schema.owner (with ref: 'User')
- Add participants array with proper structure
- Add snapshots array for version control
- Add execution history object
- Add stats object for tracking
- Add forkFrom and forksCount fields

// Instance methods:
sessionSchema.methods.hasPermission = function(userId, action) {
  // Check if user has permission (read/write/admin)
}

sessionSchema.methods.addParticipant = function(userId, role = 'viewer') {
  // Add participant with capacity check
}

sessionSchema.methods.removeParticipant = function(userId) {
  // Remove participant
}

sessionSchema.methods.updateParticipantStatus = function(userId, isOnline) {
  // Update online/offline status
}

sessionSchema.methods.createSnapshot = function(userId, message) {
  // Create version snapshot
}

sessionSchema.methods.fork = function(userId, title, description) {
  // Create forked session
}

sessionSchema.methods.addExecution = function(executionData) {
  // Add execution record
}
```

**Impact:** ❌ Session management endpoints will fail

---

### 3. ❌ CRITICAL: Fix execute.routes.js

**File:** `api/execute.routes.js`
**Issues:**

- Line 3: `const auth = require('../middleware/auth');` ❌ Wrong import
- Uses `executeValidation` which doesn't exist in validator

**Fix:**

```javascript
// Change line 3:
const authMiddleware = require("../middleware/auth.middleware");

// Remove line 4 (incorrect import reference)

// Fix all middleware references:
router.post("/", authMiddleware, executeController.executeCode);
// Instead of:
router.post("/", auth, executeValidation, executeController.executeCode);

// Also note: Route order issue - /languages should come before /:sessionId
// Move `/languages` route BEFORE other specific routes
```

**Impact:** ❌ Code execution API won't work

---

### 4. ❌ CRITICAL: Create Dockerfile

**File:** `Dockerfile`
**Status:** Empty placeholder

**Content to add:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => { if (r.statusCode !== 200) throw new Error(r.statusCode) })" || exit 1

# Start application
CMD ["node", "server.js"]
```

**Impact:** ❌ Cannot build or deploy without this

---

### 5. ❌ CRITICAL: Create Dockerfile.worker

**File:** `Dockerfile.worker`
**Status:** Doesn't exist

**Content:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN mkdir -p logs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('amqplib').connect(process.env.RABBITMQ_URL || 'amqp://localhost').then(() => process.exit(0)).catch(() => process.exit(1))" || exit 1

CMD ["node", "workers/code.worker.js"]
```

**Impact:** ❌ Worker service won't build

---

### 6. ❌ CRITICAL: Create Configuration Files

#### a. `.env` - Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=27017
DB_NAME=muweb_db
DB_USER=muweb_user
DB_PASSWORD=muweb_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

#### b. `nginx.conf` - Nginx Reverse Proxy

```nginx
events {
  worker_connections 1024;
}

http {
  upstream app {
    server app:5000;
  }

  server {
    listen 80;
    server_name _;

    location / {
      proxy_pass http://app;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
}
```

#### c. `redis.conf` - Redis Configuration

```ini
# Basic settings
port 6379
bind 0.0.0.0
databases 16

# Memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# AOF
appendonly yes
appendfilename "appendonly.aof"

# Slow log
slowlog-log-slower-than 10000
slowlog-max-len 128
```

#### d. `rabbitmq.conf` - RabbitMQ Configuration

```ini
# Network
listeners.ssl.default = 5672

# Memory
vm_memory_high_watermark.relative = 0.6

# Disk
disk_free_limit.absolute = 50MB
```

#### e. `mongo-init.js` - MongoDB Initialization

```javascript
db.createUser({
  user: "codecrafter",
  pwd: "codecrafter123",
  roles: [
    {
      role: "readWrite",
      db: "codecrafter",
    },
  ],
});

db.createCollection("users");
db.createCollection("sessions");
db.createCollection("logs");

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.sessions.createIndex({ userId: 1, createdAt: -1 });
db.sessions.createIndex({ isPublic: 1, updatedAt: -1 });
```

**Impact:** ❌ Services won't start without these

---

### 7. ⚠️ HIGH: Fix auth.controller.js

**File:** `controllers/auth.controller.js`

**Issues in register():**

```javascript
// Line with profile field doesn't exist - remove or fix:
// profile: { joinedAt: new Date(), preferences: {...} }
// User model doesn't have profile field

// Fix Redis calls:
await redisConfig.setRefreshToken(user._id.toString(), refreshToken);
// This method doesn't exist yet
```

**Issues in login():**

```javascript
// Line 45-46: Wrong field references
// user.profile.lastLogin should be user.lastLogin
// user.isPremium should be added to User model or removed
```

**Fix:**

- Add `isPremium` field to User model OR remove from code
- Change `user.profile.lastLogin` to `user.lastLogin`
- Wait until Redis methods are implemented to test

**Impact:** 🔴 Login will fail without these fixes

---

### 8. ⚠️ HIGH: Fix sessions.controller.js

**File:** `controllers/sessions.controller.js`

**Issues:**

```javascript
// Lines reference methods that don't exist:
session.hasPermission(userId, "read"); // ❌ Not implemented
session.addParticipant(userId, "viewer"); // ❌ Not implemented
session.removeParticipant(userId); // ❌ Not implemented
session.updateParticipantStatus(userId, false); // ❌ Not implemented

// Schema fields that don't exist:
session.participants[0].role; // ❌ Wrong structure
session.activeParticipantsCount; // ❌ Not in schema
session.stats.lastActivity; // ❌ stats not defined
session.execution.history; // ❌ Wrong structure
```

**Fix:** Wait until Session model methods are implemented, then run tests

**Impact:** 🔴 Session management won't work

---

### 9. ⚠️ HIGH: Fix execute.controller.js

**File:** `controllers/execute.controller.js`

**Issues:**

```javascript
// Line 7-8: Wrong destructuring syntax
const { Session } = require('../models/session.model');  // ❌ Should be:
const Session = require('../models/session.model');

const { Log } = require('../models/log.model');          // ❌ Should be:
const Log = require('../models/log.model');

// Line references that won't work:
const result = await dockerService.executeCode({...});
// dockerService.executeCode needs proper error handling

await queueService.publishJob('code_execution', jobData);
// This API might not match Queue service implementation
```

**Fix:**

```javascript
const Session = require("../models/session.model");
const Log = require("../models/log.model");

// Verify queueService API matches docker execution flow
```

**Impact:** 🔴 Code execution endpoints will crash

---

## VERIFICATION CHECKLIST

After implementing critical fixes, verify:

```bash
# 1. Test database connection
npm run test:db

# 2. Test Redis connection
npm run test:redis

# 3. Test RabbitMQ connection
npm run test:rabbitmq

# 4. Test Docker connectivity
npm run test:docker

# 5. Lint code
npm run lint

# 6. Start application
npm run dev

# 7. Test health endpoint
curl http://localhost:5000/health

# 8. Test authentication endpoints
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Password123","firstName":"Test","lastName":"User"}'

# 9. Test session creation (requires auth token)
# 10. Test WebSocket connection
# 11. Test code execution
```

---

## TIMELINE ESTIMATE

| Task                | Estimated Time  | Blocker |
| ------------------- | --------------- | ------- |
| Fix Redis config    | 2-3 hours       | YES     |
| Fix Session model   | 3-4 hours       | YES     |
| Fix route imports   | 30 mins         | YES     |
| Create Dockerfiles  | 1 hour          | YES     |
| Create config files | 2 hours         | YES     |
| Fix controllers     | 2 hours         | YES     |
| Testing & debugging | 4-6 hours       | -       |
| **TOTAL**           | **14-20 hours** | -       |

**Recommendation:** Start with Redis config and Session model in parallel, as other components depend on these.

---

Generated: October 22, 2025
