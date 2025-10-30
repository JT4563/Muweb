# 🎨 Visual Guide: MongoDB, RabbitMQ & Redis

## Quick Comparison

```
┌──────────────────────────────────────────────────────────────┐
│                  THREE STORAGE SYSTEMS                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  MONGODB          REDIS             RABBITMQ               │
│  (Database)       (Cache)           (Queue)                │
│                                                              │
│  • Long-term      • Fast access     • Task scheduling     │
│  • Permanent      • Session storage • Async processing    │
│  • Querying       • Token cache     • Job distribution    │
│                                                              │
│  Speed: ~100ms    Speed: ~1ms       Speed: ~5ms           │
│  Size: GBs        Size: MBs         Size: MBs             │
│  Lives: Disk      Lives: RAM        Lives: RAM/Disk       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🗄️ MongoDB Structure

### Collections & Indexes

```
DATABASE: codecrafter
│
├─ COLLECTION: users
│  │
│  ├─ Document 1
│  │  ├─ _id: ObjectId(...)
│  │  ├─ username: "john_doe" ← INDEX: unique
│  │  ├─ email: "john@example.com" ← INDEX: unique
│  │  ├─ password: "$2a$10..." (hashed)
│  │  ├─ role: "user"
│  │  ├─ createdAt: 2025-10-28 ← INDEX: ascending
│  │  └─ lastLogin: 2025-10-28 ← INDEX: ascending
│  │
│  ├─ Document 2: { jane_doe }
│  └─ Document N: { ... }
│
├─ COLLECTION: sessions
│  │
│  ├─ Document 1
│  │  ├─ _id: ObjectId(...)
│  │  ├─ owner: "john_doe" ← INDEX: owner+createdAt
│  │  ├─ title: "Python Project"
│  │  ├─ code: "print('hello')"
│  │  ├─ isPublic: true ← INDEX: isPublic+updatedAt
│  │  ├─ createdAt: 2025-10-28 ← INDEX: part of compound
│  │  ├─ updatedAt: 2025-10-28
│  │  ├─ isActive: true ← INDEX: isActive
│  │  ├─ participants: [
│  │  │  ├─ { user: "john_doe" } ← INDEX: participants.user
│  │  │  └─ { user: "jane_smith" }
│  │  └─ ]
│  │
│  ├─ Document 2: { Ruby Project }
│  └─ Document N: { ... }
│
└─ COLLECTION: logs
   │
   ├─ Document 1
   │  ├─ _id: ObjectId(...)
   │  ├─ timestamp: 2025-10-28 ← INDEX: TTL (auto-delete 30 days)
   │  ├─ level: "info" ← INDEX: level+timestamp
   │  ├─ message: "User logged in"
   │  ├─ userId: "john_doe" ← INDEX: userId+timestamp
   │  └─ sessionId: "sess-456" ← INDEX: sessionId+timestamp
   │
   ├─ Document 2: { error log }
   ├─ Document 3: { warn log }
   └─ Document N: { ... }
```

### Index Performance

```
BEFORE INDEXES:
┌─────────────────────────────────┐
│ Find user by email              │
│                                 │
│ db.users.findOne({              │
│   email: "john@example.com"    │
│ })                              │
│                                 │
│ Process:                        │
│ ├─ Document 1: Check? No        │
│ ├─ Document 2: Check? No        │
│ ├─ Document 3: Check? No        │
│ │ ... (1,000,000 documents)    │
│ ├─ Document X: Found! ✅        │
│ │                              │
│ └─ Time: 5000ms ❌             │
└─────────────────────────────────┘

AFTER UNIQUE INDEX:
┌─────────────────────────────────┐
│ Email Index (B-tree)            │
│                                 │
│ Root:                           │
│ ├─ "a...@" → Range A-J         │
│ ├─ "j...@" → Range J-S         │
│ └─ "s...@" → Range S-Z         │
│    └─ "john@example.com"       │
│       └─ Pointer: Document X    │
│                                 │
│ Lookup:                         │
│ "john@..." → Found! ✅          │
│                                 │
│ Time: 5ms ⚡ (1000x faster!)    │
│ Unique: ✅ No duplicates       │
└─────────────────────────────────┘
```

### TTL Index Auto-Cleanup

```
Logs Collection with TTL Index (30 days)

Day 1:   Log created
         db.logs.insertOne({ timestamp: "2025-10-28" })
         ├─ Stored in collection ✅
         ├─ Indexed by timestamp
         └─ TTL: 30 days

Day 15:  Log exists
         ├─ Query log: db.logs.findOne({...}) ✅
         └─ Still 15 days to live

Day 29:  Log still exists
         ├─ Query log: db.logs.findOne({...}) ✅
         └─ 1 day left!

Day 30:  Automatic deletion
         ├─ MongoDB background task checks TTL
         ├─ Finds: timestamp > 30 days old
         ├─ Action: DELETE document ⚠️
         └─ Storage freed! 🗑️

Day 31:  Log gone
         ├─ Query log: db.logs.findOne({...}) ❌
         └─ No longer exists

Benefit: No manual cleanup! Automatic storage management ✨
```

---

## 📬 RabbitMQ Job Queue Flow

### Message Flow Diagram

```
Step 1: Submit Job
┌─────────────────────────────┐
│ User: Execute Code          │
│ POST /api/execute           │
│ { code: "print('hi')" }    │
└────────────┬────────────────┘
             │

Step 2: Create Job & Queue It
             │
             ├─ Generate Job ID
             ├─ Wrap in message
             └─ Send to RabbitMQ

Step 3: RabbitMQ Receives
┌─────────────────────────────────────────┐
│ RabbitMQ (rabbitmq.conf)                │
│                                         │
│ Exchange: code_execution               │
│ ├─ Routes messages to queues           │
│ │                                       │
│ Queue: execution_queue                 │
│ ├─ Job-123: { execute code }          │
│ ├─ Job-124: { execute test }          │
│ ├─ Job-125: { execute debug }         │
│ └─ Waiting for workers...             │
└─────────────────────────────────────────┘
             │

Step 4: Express Returns Immediately
             │
             ├─ Response: "Job queued: job-123"
             └─ Time: <100ms ✅

Step 5: User Gets Response
┌─────────────────────────────┐
│ Browser                     │
│ { jobId: "job-123",        │
│   status: "processing" }   │
└─────────────────────────────┘

Step 6: Background Worker Processes
                              (Parallel)
                              │
┌─────────────────────────────────────────┐
│ Worker Process                          │
│                                         │
│ 1. Poll: "Any jobs?"                   │
│    └─ RabbitMQ: "Yes! job-123"        │
│                                         │
│ 2. Receive: job-123 message            │
│    └─ Mark as "processing"             │
│                                         │
│ 3. Execute Code                        │
│    ├─ Start Docker container           │
│    ├─ Run code: print('hi')           │
│    ├─ Capture output: "hi"            │
│    └─ Time: 1500ms                    │
│                                         │
│ 4. Store Result                        │
│    └─ MongoDB: db.logs.insertOne(...)│
│                                         │
│ 5. Notify User                         │
│    └─ WebSocket: "Code executed!"     │
│    └─ Output: "hi"                    │
│                                         │
│ 6. Mark Complete                       │
│    └─ RabbitMQ: "job-123" ✅ done     │
└─────────────────────────────────────────┘

Step 7: User Sees Result
┌─────────────────────────────┐
│ Browser (Real-time update)  │
│ Output: "hi"                │
│ Status: Complete ✅         │
│ Time: 1500ms (processing)   │
└─────────────────────────────┘
```

### Queue Configuration Effects

```
rabbitmq.conf Settings & Their Impact:

heartbeat = 60
├─ Every 60 seconds: Check if connection alive
├─ Purpose: Detect dead connections
├─ Effect:
│  0s   ├─ Heartbeat ✅ Alive
│  60s  ├─ Heartbeat ✅ Alive
│  120s ├─ No response ❌ Dead
│  └─ Close & free resources

memory high_watermark = 0.6 (60%)
├─ Max RAM usage: 60% of system
├─ On 8GB system: Max 4.8GB
├─ When full: Start paging to disk
├─ Effect: Never crashes from memory

disk_free_limit = 50MB
├─ Min free disk space
├─ If < 50MB: Stop accepting messages
├─ Effect: Prevent "disk full" errors

frame_max = 131072
├─ Max message size: 131KB
├─ Larger messages: Split into frames
├─ Effect: Can handle various message sizes
```

---

## ⚡ Redis Caching Layers

### Memory Management

```
Redis Memory Structure (max: 256MB)

┌─────────────────────────────────────────┐
│ REDIS MEMORY (256MB)                    │
├─────────────────────────────────────────┤
│                                         │
│ Key-Value Storage:                      │
│ ├─ session:user1                       │
│ │  └─ { data: {...}, expires: +24h }  │
│ │                                       │
│ ├─ token:abc123                        │
│ │  └─ { token: "...", expires: +7d }  │
│ │                                       │
│ ├─ cache:products                      │
│ │  └─ { data: [...], expires: +1h }   │
│ │                                       │
│ ├─ socket:user1                        │
│ │  └─ { socketId: "xyz", ... }        │
│ │                                       │
│ └─ rate_limit:user1                    │
│    └─ { count: 45, expires: +15m }    │
│                                         │
│ Used: 200MB / 256MB (78%)              │
│ Free: 56MB                             │
└─────────────────────────────────────────┘

NEW DATA ARRIVES:
Memory full! (78% > threshold)
├─ LRU Policy kicks in
├─ Find least recently used key
│  └─ cache:products (last access: 1 hour ago)
├─ DELETE cache:products 🗑️
├─ Free space: 56MB + 10MB = 66MB
└─ Store new data ✅

LRU (Least Recently Used) Timeline:
Last Access Times:
├─ rate_limit:user1  → 1 second ago (Most recent)
├─ socket:user1      → 5 minutes ago
├─ token:abc123      → 2 hours ago
├─ session:user1     → 10 minutes ago
└─ cache:products    → 1 hour ago (Least recent) ← DELETE
```

### Persistence Strategy

```
Redis Data Protection (redis.conf):

Strategy 1: RDB Snapshots
┌─────────────────────────┐
│ save 900 1              │ Save if 1 change in 900s
│ save 300 10             │ Save if 10 changes in 300s
│ save 60 10000           │ Save if 10000 changes in 60s
└─────────────────────────┘

Timeline:
0:00  ├─ Session created: 1 change
      └─ Trigger? 900s not passed, wait

5:00  ├─ 9 more sessions: 10 changes total
      └─ 300s passed AND 10 changes → SAVE ✅
      └─ Snapshot: dump.rdb (on disk)

5:01  ├─ 10,000 user logins: 10,000 changes
      └─ Instantly → SAVE ✅ (too much data)
      └─ Update: dump.rdb

Server Crash at 5:30
├─ Read dump.rdb (last snapshot at 5:01)
├─ Restore data from 5:01
└─ Lost: 30 seconds of data (5:01-5:30)

Strategy 2: AOF (Append Only File)
┌─────────────────────────────────┐
│ appendonly yes                  │ Enable AOF
│ appendfsync everysec            │ Sync every 1 second
└─────────────────────────────────┘

Timeline:
0:00  ├─ Operation: SET session:1 {...}
      └─ Write to appendonly.aof ✅

1:00  ├─ 1 second passed
      └─ Sync to disk ✅

2:00  ├─ 1 second passed
      └─ Sync to disk ✅

Server Crash at 5:30
├─ Read appendonly.aof (write log)
├─ Replay all operations (0:00 - 5:30)
└─ Lost: 0 seconds (most current data!) ✅

Best Practice: Use BOTH
├─ RDB: Fast recovery (snapshot)
└─ AOF: No data loss (operation log)
```

### Token Storage Flow

```
User Login Process with Redis:

1. User submits credentials
┌─────────────────────────────┐
│ Browser                     │
│ POST /api/auth/login       │
│ { email, password }        │
└────────────┬────────────────┘

2. Server validates
             ↓
┌─────────────────────────────────────────┐
│ Express App                             │
│                                         │
│ 1. Query MongoDB                       │
│    db.users.findOne({ email })         │
│    └─ Find: user document ✅           │
│                                         │
│ 2. Compare password                    │
│    bcryptjs.compare(input, hash)       │
│    └─ Match: ✅ Password correct       │
└────────────┬────────────────────────────┘

3. Generate tokens
             ↓
┌─────────────────────────────────────────┐
│ JWT Service                             │
│                                         │
│ Access Token:                          │
│ ├─ Data: { userId, role }             │
│ ├─ Expiry: 15 minutes                 │
│ └─ Secret: JWT_SECRET                 │
│                                         │
│ Refresh Token:                         │
│ ├─ Data: { userId }                  │
│ ├─ Expiry: 7 days                    │
│ └─ Secret: JWT_REFRESH_SECRET        │
└────────────┬────────────────────────────┘

4. Store in Redis
             ↓
┌─────────────────────────────────────────┐
│ Redis (redis.conf settings apply)       │
│                                         │
│ KEY: refresh_token:user-123            │
│ VALUE: "eyJhbGc..." (JWT)             │
│ EXPIRY: 604800 seconds (7 days)       │
│                                         │
│ In Redis Memory:                       │
│ ├─ Stored in RAM (instant access)    │
│ ├─ Backed up to disk (RDB/AOF)       │
│ └─ TTL: Expires in 7 days            │
└────────────┬────────────────────────────┘

5. Return to user
             ↓
┌─────────────────────────────┐
│ Browser Response            │
│ {                           │
│   accessToken: "eyJ...",   │
│   refreshToken: "eyJ...",  │
│   expiresIn: 900           │
│ }                           │
└────────────┬────────────────┘

6. Next request (within 15 min)
             ↓
┌─────────────────────────────────────────┐
│ Request with Access Token               │
│ GET /api/sessions                      │
│ Headers: Authorization: Bearer eyJ...  │
└────────────┬────────────────────────────┘

7. Verify token
             ↓
┌─────────────────────────────────────────┐
│ Auth Middleware                         │
│                                         │
│ 1. Extract token from header           │
│ 2. Verify signature with JWT_SECRET    │
│ 3. Check expiry (15 min)              │
│ ✅ Valid → Continue to route           │
│ ❌ Expired → Refresh using Redis token │
└────────────┬────────────────────────────┘

8. Token refresh (after 15 min)
             ↓
┌─────────────────────────────────────────┐
│ POST /api/auth/refresh                  │
│ Body: { refreshToken }                  │
└────────────┬────────────────────────────┘

9. Validate & store new token
             ↓
┌─────────────────────────────────────────┐
│ In Redis:                               │
│                                         │
│ DELETE: refresh_token:user-123          │
│ │ (Invalidate old token)               │
│ ↓                                       │
│ SET: refresh_token:user-123             │
│ │ (Store new token)                    │
│ │ Expiry: +7 days                      │
│ ↓                                       │
│ ✅ New access token issued (15 min)    │
└─────────────────────────────────────────┘
```

---

## 🔗 Integration Summary

```
┌──────────────────────────────────────────────────────┐
│           APPLICATION FLOW                          │
│                                                      │
│ User Action → Express → Decision → Storage          │
└──────────────────────────────────────────────────────┘

FAST DATA (< 1 second)
├─ Sessions: Store in REDIS (1ms)
├─ Tokens: Store in REDIS (1ms)
├─ WebSocket connections: Store in REDIS (1ms)
└─ Rate limits: Track in REDIS (1ms)

PERMANENT DATA (Forever or long-term)
├─ Users: Store in MONGODB (100ms + indexed)
├─ Sessions (full): Store in MONGODB (100ms)
├─ Code history: Store in MONGODB (100ms)
└─ Logs: Store in MONGODB with TTL (100ms, auto-delete 30d)

BACKGROUND JOBS (Async)
├─ Code execution: Queue in RABBITMQ (5ms)
├─ File processing: Queue in RABBITMQ (5ms)
├─ Email sending: Queue in RABBITMQ (5ms)
└─ Workers: Poll RABBITMQ & execute

┌──────────────────────────────────────────────────────┐
│ Result: FAST + RELIABLE + SCALABLE ⚡               │
└──────────────────────────────────────────────────────┘
```

---

## 📊 Configuration File Comparison

| Setting         | MongoDB (mongo-init.js) | Redis (redis.conf) | RabbitMQ (rabbitmq.conf) |
| --------------- | ----------------------- | ------------------ | ------------------------ |
| **Auth**        | User: admin             | None (optional)    | User: guest              |
| **Port**        | 27017                   | 6379               | 5672 (AMQP)              |
| **Memory**      | N/A                     | 256MB max          | 60% of system            |
| **Persistence** | N/A                     | RDB + AOF          | N/A (in-memory)          |
| **Indexing**    | 13 indexes              | N/A                | N/A                      |
| **TTL**         | Yes (logs 30d)          | Yes (configurable) | N/A                      |
| **Replication** | Supported               | Supported          | Supported                |
| **Heartbeat**   | N/A                     | 300s               | 60s                      |

---

## 🎯 Quick Decision Tree

```
Do you need...

Long-term storage?
├─ YES → Use MONGODB
│        (Users, Sessions, Code history)
│
├─ YES, but temporary?
│  ├─ YES → Use REDIS with TTL
│  │        (Sessions cache 24h)
│  │
│  └─ YES, and confidential?
│     └─ Use REDIS
│        (Refresh tokens 7d)

Background processing?
├─ YES → Use RABBITMQ
│        (Code execution, emails)
│
└─ Must happen instantly?
   └─ Use REDIS
      (Rate limits, socket mapping)
```
