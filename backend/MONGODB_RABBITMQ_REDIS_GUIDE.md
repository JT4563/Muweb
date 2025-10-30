# 📚 Complete Guide: MongoDB, RabbitMQ & Redis Configuration Files

## Table of Contents

1. [mongo-init.js - MongoDB Initialization](#1-mongo-initjs---mongodb-initialization)
2. [rabbitmq.conf - Message Queue](#2-rabbitmqconf---message-queue)
3. [redis.conf - Caching & Sessions](#3-redisconf---caching--sessions)
4. [How They Work Together](#4-how-they-work-together)

---

# 1️⃣ mongo-init.js - MongoDB Initialization

## What It Does

`mongo-init.js` is a **setup script** that runs automatically when MongoDB starts in Docker. It:

1. ✅ Authenticates with admin credentials
2. ✅ Creates the main database (`codecrafter`)
3. ✅ Creates 3 collections (tables)
4. ✅ Creates 13 indexes for fast queries
5. ✅ Inserts test users for development

```
Docker starts MongoDB
    ↓
Runs mongo-init.js
    ├─ Authenticate
    ├─ Create database
    ├─ Create collections
    ├─ Create indexes
    ├─ Insert test data
    ↓
MongoDB ready to use! ✅
```

## File Breakdown (Line by Line)

### Authentication (Line 1-4)

```javascript
// Line 1: Authenticate with admin user
db.getSiblingDB("admin").auth("admin", "changeme123!");

// Line 3: Switch to main database
db = db.getSiblingDB("codecrafter");
```

**What it does:**

- Connects to admin database
- Uses credentials: `admin` / `changeme123!`
- Switches to the `codecrafter` database for the app

**In Docker:**

```yaml
# docker-compose.yml
mongo:
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: changeme123!
```

### Create Collections (Line 6-8)

```javascript
db.createCollection("users");
db.createCollection("sessions");
db.createCollection("logs");
```

**What these are:**

- **users**: Stores user accounts and authentication data
- **sessions**: Stores collaborative coding sessions
- **logs**: Stores application activity logs

**Think of it like:**

```
Database (codecrafter)
├── users (table)
│   ├── _id, username, email, password, role, ...
│   └── Row 1: John Doe
│   └── Row 2: Jane Smith
├── sessions (table)
│   ├── _id, owner, title, code, participants, ...
│   └── Row 1: Python Project
├── logs (table)
│   ├── _id, timestamp, level, message, ...
│   └── Row 1: User logged in
```

### Create Indexes (Line 10-30)

**What are indexes?**
Indexes are like a book's index - they make queries MUCH faster.

```
Without Index:
┌─────────────┐
│ Document 1  │ Check? No
├─────────────┤
│ Document 2  │ Check? No
│ ...         │ (1M docs)
├─────────────┤
│ Document X  │ Found! (5000ms) ❌
└─────────────┘

With Index:
┌──────────────────┐
│ Email Index      │
├──────────────────┤
│ john@... → Doc X │ Found! (5ms) ✅
└──────────────────┘
```

#### USERS INDEXES (4 indexes)

```javascript
// INDEX 1: Email - unique (no duplicates allowed)
db.users.createIndex({ email: 1 }, { unique: true });
//        ↓
// Purpose: Login by email, prevent duplicate emails
// Query:   db.users.findOne({ email: "john@example.com" })
// Speed:   O(log n) ~ 5ms
// Unique:  ✅ Only one user per email

// INDEX 2: Username - unique
db.users.createIndex({ username: 1 }, { unique: true });
// Purpose: Find by username, prevent duplicate usernames
// Query:   db.users.findOne({ username: "john_doe" })

// INDEX 3: CreatedAt - for getting newest users
db.users.createIndex({ createdAt: 1 });
// Purpose: Sort users by creation date
// Query:   db.users.find().sort({ createdAt: -1 }).limit(10)

// INDEX 4: LastLogin - for finding inactive users
db.users.createIndex({ lastLogin: 1 });
// Purpose: Find users who haven't logged in recently
// Query:   db.users.find({ lastLogin: { $lt: thirtyDaysAgo } })
```

#### SESSIONS INDEXES (5 indexes)

```javascript
// INDEX 1: Compound index - owner + createdAt
db.sessions.createIndex({ owner: 1, createdAt: -1 });
//                         ↑         ↑
//                    ascending   descending
// Purpose: Find all my sessions, newest first
// Query:   db.sessions
//            .find({ owner: userId })
//            .sort({ createdAt: -1 })
// Speed:   Uses index for BOTH owner AND sort!

// INDEX 2: Compound index - isPublic + updatedAt
db.sessions.createIndex({ isPublic: 1, updatedAt: -1 });
// Purpose: Find public sessions, most recently updated first
// Query:   db.sessions
//            .find({ isPublic: true })
//            .sort({ updatedAt: -1 })

// INDEX 3: CreatedAt - sort all sessions by date
db.sessions.createIndex({ createdAt: 1 });

// INDEX 4: Nested field - participants array
db.sessions.createIndex({ "participants.user": 1 });
//                        ↑ Nested field inside array
// Purpose: Find sessions where user is participant
// Query:   db.sessions.find({ "participants.user": userId })

// INDEX 5: IsActive - filter only active sessions
db.sessions.createIndex({ isActive: 1 });
```

#### LOGS INDEXES (4 indexes, including TTL)

```javascript
// INDEX 1: TTL Index - Auto-delete after 30 days
db.logs.createIndex(
  { timestamp: 1 },
  { expireAfterSeconds: 2592000 } // 30 days
);
// Purpose: Automatic cleanup of old logs
// Effect:
//   Day 0:  Log created ✅
//   Day 29: Log exists ✅
//   Day 30: MongoDB automatically DELETES ⚠️
//   Storage savings: Automatic! 🎉

// INDEX 2: Compound - find error logs by time
db.logs.createIndex({ level: 1, timestamp: -1 });
// Purpose: Find error logs, newest first
// Query:   db.logs
//            .find({ level: "error" })
//            .sort({ timestamp: -1 })

// INDEX 3: Compound - user's activity log
db.logs.createIndex({ userId: 1, timestamp: -1 });
// Purpose: Get specific user's activity
// Query:   db.logs
//            .find({ userId: userId })
//            .sort({ timestamp: -1 })

// INDEX 4: Compound - session's activity log
db.logs.createIndex({ sessionId: 1, timestamp: -1 });
// Purpose: Get specific session's logs
// Query:   db.logs
//            .find({ sessionId: sessionId })
//            .sort({ timestamp: -1 })
```

### Insert Test Data (Line 32-75)

```javascript
db.users.insertOne({
  _id: ObjectId(), // Unique ID
  username: "testuser",
  email: "test@example.com",
  password: "$2a$10$...", // Bcrypt hash
  firstName: "Test",
  lastName: "User",
  role: "user", // Normal user
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

// Admin user (same structure)
db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  role: "admin", // Admin role
  // ... rest of fields
});
```

**Test Credentials:**

```
User 1:
  Username: testuser
  Email: test@example.com
  Password: password
  Role: user

User 2:
  Username: admin
  Email: admin@example.com
  Password: password
  Role: admin
```

### Final Output (Line 77-82)

```javascript
print("MongoDB initialization complete!");
print("Collections created: users, sessions, logs");
print("Indexes created for optimal query performance");
print("Test user created: testuser / test@example.com");
print("Admin user created: admin / admin@example.com");
```

## Index Performance Summary

```
┌─────────────────────────────────────────────────┐
│ USERS COLLECTION - 4 Indexes                   │
├─────────────────────────────────────────────────┤
│ ✅ email (unique)    → Email lookup only       │
│ ✅ username (unique) → Username lookup only    │
│ ✅ createdAt         → Sort by date            │
│ ✅ lastLogin         → Find inactive users     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ SESSIONS COLLECTION - 5 Indexes                │
├─────────────────────────────────────────────────┤
│ ✅ owner+createdAt   → My sessions, sorted     │
│ ✅ isPublic+updated  → Public sessions, sorted │
│ ✅ createdAt         → All sessions by date    │
│ ✅ participants.user → Sessions I joined       │
│ ✅ isActive          → Active sessions only    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LOGS COLLECTION - 4 Indexes (1 with TTL)      │
├─────────────────────────────────────────────────┤
│ ✅ timestamp (TTL)   → Auto-delete 30 days    │
│ ✅ level+timestamp   → Error logs, sorted     │
│ ✅ userId+timestamp  → User activity log      │
│ ✅ sessionId+time    → Session activity log   │
└─────────────────────────────────────────────────┘

TOTAL: 13 Indexes for optimal performance
```

---

# 2️⃣ rabbitmq.conf - Message Queue Configuration

## What It Does

`rabbitmq.conf` configures **RabbitMQ**, a **message queue** system that handles asynchronous jobs (tasks that run in the background).

```
┌─────────────────────────────────────┐
│ Application                         │
│ • Execute code                      │
│ • Send email                        │
│ • Process file                      │
│ • Long-running task                 │
└────────────┬────────────────────────┘
             │ Put job in queue
             ↓
┌─────────────────────────────────────┐
│ RabbitMQ Message Queue              │
│ (rabbitmq.conf configures this)     │
└────────────┬────────────────────────┘
             │ Job waits
             ↓
┌─────────────────────────────────────┐
│ Background Worker                   │
│ • Process job                       │
│ • Send result back                  │
│ • Mark complete                     │
└─────────────────────────────────────┘
```

## Why Use Message Queue?

**Without RabbitMQ:**

```
User: "Execute this code"
  ↓
Express App: Wait... (blocks user)
  ├─ Start Docker container
  ├─ Run code (30 seconds)
  ├─ Capture output
  ↓
User: Finally got response! (30 seconds later) ⏳
```

**With RabbitMQ:**

```
User: "Execute this code"
  ↓
Express App: "Job queued! Processing..."
  ↓
Return immediately! (0.1 seconds) ⚡
  ↓
Background Worker: Process in background
  ├─ Start Docker container
  ├─ Run code (30 seconds)
  ├─ Send result via WebSocket
  ↓
User: Gets result in real-time! (via WebSocket) 🚀
```

## rabbitmq.conf Breakdown

### Network Configuration (Line 3-4)

```properties
listeners.tcp.default = 5672
management.tcp.port = 15672
```

**What it means:**

- **Port 5672**: AMQP protocol (app communicates with queue)
- **Port 15672**: Management UI (visualize queues)

**How it connects:**

```
Your App
  ↓
AMQP Protocol (Port 5672)
  ↓
RabbitMQ Server
  ↓
Management UI (Port 15672)
  http://localhost:15672 (Username: guest / Password: guest)
```

### Memory Configuration (Line 6-8)

```properties
vm_memory_high_watermark.relative = 0.6
vm_memory_high_watermark_paging_ratio = 0.75
memory_monitor_interval = 2500
```

**What it does:**

- **vm_memory_high_watermark = 0.6**: Use max 60% of system RAM
- **paging_ratio = 0.75**: Swap to disk at 75% memory
- **monitor_interval = 2500**: Check every 2.5 seconds

**Example (8GB system):**

```
System RAM: 8GB
Max usage:  60% = 4.8GB
Swap:       At 75% = 3.6GB
Monitor:    Every 2.5 seconds
```

### Disk Space (Line 10-11)

```properties
disk_free_limit.absolute = 50MB
```

**What it means:**

- Stop accepting messages if disk free < 50MB
- Protects against disk full errors

### Queue Master Location (Line 13-14)

```properties
queue_master_locator = min-masters
```

**What it means:**

- Distribute queues across nodes with fewer masters
- Better load balancing

### Channel & Connection (Line 16-19)

```properties
channel_max = 2048
connection_max = infinity
```

**What it means:**

- Max 2048 channels per connection
- Unlimited connections
- Prevents resource exhaustion

### Heartbeat (Line 21-22)

```properties
heartbeat = 60
```

**What it does:**

- Every 60 seconds: Check if connection is alive
- Drop dead connections
- Free up resources

```
Timeline:
0s   ├─ Heartbeat check ✅ Connection alive
60s  ├─ Heartbeat check ✅ Connection alive
120s ├─ No response ❌ Connection dead
     └─ Close connection, free resources
```

### Management Plugin (Line 24-25)

```properties
management.load_definitions = /etc/rabbitmq/definitions.json
```

**What it does:**

- Load pre-defined queues, exchanges, bindings on startup
- Automatically recreate topology

### Logging (Line 27-30)

```properties
log.file.level = info
log.console = true
log.console.level = info
```

**What it logs:**

- **info level**: Normal operations
- **console = true**: Print to console
- Tracks jobs, connections, errors

### SSL/TLS (Line 32-37)

```properties
# ssl_options.certfile   = /etc/rabbitmq/server_certificate.pem
# ssl_options.keyfile    = /etc/rabbitmq/server_key.pem
# ssl_options.cacertfile = /etc/rabbitmq/ca_certificate.pem
```

**What it does:**

- Encrypted communication (AMQPS protocol)
- Uncomment in production for security

### Frame Max (Line 45-47)

```properties
frame_max = 131072
```

**What it does:**

- Max message size: 131KB
- Messages larger → split into frames

### Statistics (Line 49-50)

```properties
collect_statistics_interval = 5000
```

**What it does:**

- Collect metrics every 5 seconds
- Used by management UI

### Default Credentials (Line 55-60)

```properties
default_user = guest
default_pass = guest
default_permissions.configure = .*
default_permissions.read = .*
default_permissions.write = .*
```

**What it means:**

- Default user: `guest` / `guest`
- Can configure, read, write everything
- ⚠️ Change in production!

## RabbitMQ Job Flow

```
┌────────────────────────────────────────────┐
│ Express App - Code Execution Request       │
│ POST /api/execute                          │
│ { sessionId, code, language }              │
└────────────┬─────────────────────────────┘
             │
             ↓
┌────────────────────────────────────────────┐
│ Create Job                                 │
│ {                                          │
│   id: "job-123",                          │
│   code: "print('hello')",                 │
│   language: "python",                     │
│   sessionId: "sess-456"                   │
│ }                                          │
└────────────┬─────────────────────────────┘
             │
             ↓
┌────────────────────────────────────────────┐
│ RabbitMQ                                   │
│ Exchange: code_execution                   │
│ Queue: execution_queue                     │
│ Message: { job-123 }                       │
└────────────┬─────────────────────────────┘
             │
             ↓
┌────────────────────────────────────────────┐
│ Express Returns Immediately                │
│ Response: { jobId: "job-123", status: ... │
│ User gets response in <100ms ⚡           │
└────────────────────────────────────────────┘
             │
             ↓ (Meanwhile...)
┌────────────────────────────────────────────┐
│ Background Worker                          │
│ Poll RabbitMQ: "Any jobs?"                │
│ Receive: { job-123 }                       │
│ Start executing code...                    │
└────────────┬─────────────────────────────┘
             │
             ↓ (30 seconds later)
┌────────────────────────────────────────────┐
│ Job Complete                               │
│ Output: "hello"                            │
│ Send via WebSocket to user                 │
│ Mark job DONE in RabbitMQ                  │
└────────────────────────────────────────────┘
```

---

# 3️⃣ redis.conf - Caching & Session Storage

## What It Does

`redis.conf` configures **Redis**, an **in-memory cache** that:

- ⚡ Stores sessions (super fast)
- ⚡ Caches frequently accessed data
- ⚡ Stores JWT tokens
- ⚡ Manages WebSocket connections

```
User Login
  ↓
Generate JWT Token
  ↓
Redis: Store token (1 second access)
  ↓
Next request comes in
  ├─ Check Redis first ✅ (1ms)
  └─ Don't hit database ❌ (100ms+)
```

## redis.conf Breakdown

### Network Configuration

```properties
# Default port for Redis
port 6379
# Bind to all interfaces (Docker)
bind 0.0.0.0
```

**What it means:**

- Listen on port 6379 (standard Redis port)
- Accept connections from anywhere in network

### Persistence - RDB Snapshots

```properties
save 900 1
save 300 10
save 60 10000
```

**What it means:**

- **900 1**: Save if 1 change in 900 seconds (15 min)
- **300 10**: Save if 10 changes in 300 seconds (5 min)
- **60 10000**: Save if 10000 changes in 60 seconds (every min if busy)

**Effect:**

```
Timeline of Data:
0:00  └─ Save snapshot (backup)
0:15  └─ Another 1 change → Save again
5:00  └─ 10 changes detected → Save again
5:01  └─ 10000 changes → Save immediately

If server crashes:
  └─ Load last snapshot
  └─ No data loss (mostly)
```

### Persistence - AOF (Append Only File)

```properties
appendonly yes
appendfsync everysec
```

**What it does:**

- **yes**: Write every change to disk (backup)
- **everysec**: Sync to disk every 1 second

**Trade-off:**

```
RDB: Fast, small, loses data if crash
AOF: Slow, large, no data loss

Together: Best of both!
```

### Memory Configuration

```properties
maxmemory 256mb
maxmemory-policy allkeys-lru
```

**What it means:**

- **256mb**: Max 256MB of RAM usage
- **allkeys-lru**: When full, delete least recently used key

**Effect:**

```
Memory:  256MB
Used:    256MB (FULL)
New data arrives:
  └─ Delete least-used key
  └─ Store new key
  └─ Keep running (no crash)
```

**Example:**

```
Keys in Redis:
├─ session:user1 (last access: 1 minute ago)
├─ session:user2 (last access: 10 seconds ago) ← Most recent
├─ cache:data (last access: 1 hour ago) ← Least recent
└─ token:abc (last access: 5 minutes ago)

Memory full!
Action: Delete cache:data (least recently used)
Result: Free up space ✅
```

### TTL (Time To Live)

```properties
lazyfree-lazy-eviction yes
lazyfree-lazy-server-del yes
```

**What it does:**

- Delete expired keys lazily (when accessed)
- Don't waste CPU checking all keys constantly

### Replication

```properties
# Master/Replica setup (optional)
# replicaof <master-host> <master-port>
```

**What it does:**

- Backup Redis on another server
- Automatic failover if main fails

### Slow Log

```properties
slowlog-log-slower-than 10000
slowlog-max-len 128
```

**What it means:**

- Log queries slower than 10ms
- Keep last 128 slow queries
- Help identify performance issues

### TCP Settings

```properties
tcp-backlog 511
timeout 300
tcp-keepalive 300
```

**What it does:**

- **tcp-backlog 511**: Queue size for new connections
- **timeout 300**: Close idle connection after 300s
- **tcp-keepalive 300**: Heartbeat every 300s

## Redis Use Cases in Your App

### 1️⃣ Store JWT Refresh Tokens

```javascript
// When user logs in
redis.setRefreshToken(client, userId, token, 604800);
// Stores: token-123 → expires in 7 days

// When user logs out
redis.deleteRefreshToken(client, userId);
// Deletes: token-123 immediately
```

### 2️⃣ Cache Sessions

```javascript
// After creating session
redis.setSession(client, sessionId, sessionData, 86400);
// Stores: session-456 → expires in 24 hours

// User opens session again
redis.getSession(client, sessionId);
// Retrieve from Redis (1ms) instead of database (100ms)
```

### 3️⃣ Map Users to WebSocket Connections

```javascript
// User connects via WebSocket
redis.setUserSocket(client, userId, socketId);
// Stores: user-123 → socket-xyz

// Send message to user
socket = redis.getUserSocket(userId);
// Instantly find which socket connection
```

### 4️⃣ Rate Limiting (Session Tokens)

```javascript
// Check if user exceeded API limit
count = redis.get(`rate_limit:${userId}`)
if count > 100:
  reject("Too many requests")
else:
  redis.incr(`rate_limit:${userId}`)
  allow_request()
```

## Performance Comparison

```
┌──────────────────────────────────────────┐
│ Storing Refresh Token                    │
├──────────────────────────────────────────┤
│                                          │
│ In Database (MongoDB):                  │
│   └─ 100-200ms (disk I/O, network)      │
│                                          │
│ In Redis (Memory):                      │
│   └─ 1-5ms (in RAM, local network)      │
│                                          │
│ Speed improvement: 20-100x faster! ⚡   │
│                                          │
└──────────────────────────────────────────┘
```

---

# 4️⃣ How They Work Together

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────┐
│ USER LOGS IN                                            │
│ POST /api/auth/login                                    │
│ { email, password }                                     │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│ MONGODB - Verify Credentials                           │
│ db.users.findOne({ email })                            │
│ (Uses INDEX: { email: 1, unique })                     │
│                                                         │
│ ✅ Index makes query FAST (5ms)                        │
│ ✅ Without index would be 5000ms                       │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│ GENERATE TOKENS                                         │
│ • JWT Access Token (15 minutes)                         │
│ • JWT Refresh Token (7 days)                           │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│ REDIS - Store Refresh Token                            │
│ redis.setRefreshToken(userId, token, 604800)           │
│                                                         │
│ redis.conf settings:                                    │
│ • maxmemory: 256MB                                     │
│ • maxmemory-policy: allkeys-lru                        │
│ • save: Backup to disk                                 │
│                                                         │
│ ✅ Token stored in RAM (instant access)               │
│ ✅ Backed up to disk (persistent)                     │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│ RETURN TOKENS TO USER                                   │
│ Response: { accessToken, refreshToken }                │
│ Status: 200 OK                                          │
└────────────┬────────────────────────────────────────────┘
             │
             ↓ (User makes next request)
┌─────────────────────────────────────────────────────────┐
│ USER CREATES SESSION                                    │
│ POST /api/sessions/create                              │
│ { title, description }                                 │
│ Headers: { Authorization: "Bearer <access token>" }    │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│ MONGODB - Create Session                               │
│ db.sessions.insertOne({...})                           │
│                                                         │
│ mongo-init.js created these indexes:                   │
│ • { owner: 1, createdAt: -1 }                         │
│ • { isPublic: 1, updatedAt: -1 }                      │
│ • { createdAt: 1 }                                    │
│ • { "participants.user": 1 }                          │
│ • { isActive: 1 }                                     │
│                                                         │
│ ✅ Document inserted with optimal indexes             │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│ REDIS - Cache Session                                   │
│ redis.setSession(sessionId, data, 86400)               │
│ (Expires in 24 hours)                                   │
│                                                         │
│ Next access to this session:                           │
│ • Check Redis first (1ms) ✅                           │
│ • Hit database only if expired                         │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│ USER RUNS CODE                                          │
│ POST /api/execute                                       │
│ { sessionId, code, language }                          │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│ RABBITMQ - Queue Job                                    │
│ rabbitmq.conf settings:                                 │
│ • listeners.tcp.default = 5672                         │
│ • memory high watermark = 60%                          │
│ • heartbeat = 60s                                      │
│                                                         │
│ Queue: execution_queue                                  │
│ Job: { id, code, language, sessionId }                │
│                                                         │
│ Express returns immediately (100ms)                     │
│ User sees: "Processing..." ✅                          │
└────────────┬────────────────────────────────────────────┘
             │
             ↓ (Meanwhile, in background worker)
┌─────────────────────────────────────────────────────────┐
│ BACKGROUND WORKER                                       │
│ 1. Consume job from RabbitMQ                            │
│ 2. Start Docker container                              │
│ 3. Execute code (30 seconds)                           │
│ 4. Capture output                                       │
│ 5. Store in MONGODB logs collection                    │
│                                                         │
│ mongo-init.js created TTL index:                       │
│ • { timestamp: 1, expireAfterSeconds: 2592000 }       │
│                                                         │
│ Automatic cleanup in 30 days! 🗑️                      │
│ 6. Send result to user via WebSocket (Socket.IO)      │
└────────────┬────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────┐
│ USER SEES RESULT IN REAL-TIME                          │
│ Output: "Hello, World!"                                 │
│ Status: Execution Time: 1500ms                         │
│ Complete! ✅                                            │
└─────────────────────────────────────────────────────────┘
```

## Architecture Summary

```
┌────────────────────────────────────────────────────────┐
│                   YOUR APPLICATION                     │
└────────────────────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
    ↓               ↓               ↓

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  MONGODB     │ │  REDIS       │ │  RABBITMQ    │
│              │ │              │ │              │
│ • Users      │ │ • Sessions   │ │ • Job Queue  │
│ • Sessions   │ │ • Tokens     │ │ • Workers    │
│ • Logs       │ │ • Cache      │ │              │
│              │ │              │ │              │
│ Config:      │ │ Config:      │ │ Config:      │
│ mongo-init   │ │ redis.conf   │ │ rabbitmq.conf
│ (13 indexes) │ │ (memory/TTL) │ │ (heartbeat)  │
│ (TTL auto)   │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## Quick Reference

| File              | Purpose        | Key Config                              |
| ----------------- | -------------- | --------------------------------------- |
| **mongo-init.js** | Database setup | 13 indexes, TTL cleanup, test data      |
| **redis.conf**    | Caching layer  | 256MB memory, LRU eviction, persistence |
| **rabbitmq.conf** | Job queue      | Port 5672, 60s heartbeat, memory limits |
