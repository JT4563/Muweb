# 🎯 Visual Summary: Jest, Nginx & MongoDB Indexes

## ⚡ Quick Overview (30 seconds)

### 🧪 Jest = Testing Framework
```
Your Code  →  Jest  →  Run Tests  →  PASS/FAIL
                          ✅ 75 tests
                          ✅ 75% coverage required
                          ✅ Finds bugs before deployment
```

### 🔀 Nginx = Request Router
```
Browser  →  Nginx (Port 80)  →  Node.js (Port 5000)  →  Database
            • Rate limits
            • Compresses
            • Protects
            • Balances load
```

### 📇 MongoDB Indexes = Lookup Tables
```
Find user by email
Without Index: Search all 1M users → 5000ms ❌
With Index:   Direct lookup → 5ms ✅
```

---

## 🧪 Jest Configuration Explained

### What Gets Tested?

```
Jest Coverage Map:

d:\Muweb\
├── controllers/     ←  🧪 Test Here (Authentication, Sessions, Execution)
├── services/        ←  🧪 Test Here (JWT, Queue, Docker)
├── models/          ←  🧪 Test Here (User, Session, Log schemas)
├── middleware/      ←  🧪 Test Here (Auth, Error handling)
├── utils/           ←  🧪 Test Here (Validation, Logging)
├── api/             ←  🧪 Test Here (Routes)
├── websocket/       ←  🧪 Test Here (Socket.io, CRDT)
├── workers/         ←  🧪 Test Here (Background jobs)
└── tests/           ← 🧪 Tests Located Here
    ├── unit/
    │   ├── auth.test.js      (25 tests)
    │   ├── session.test.js   (30 tests)
    │   └── jwt.test.js       (20 tests)
    └── integration/
        └── (to be added)
```

### Test Execution Timeline

```
Timeline of Running: npm test

0ms    ├─ Jest Starts
       │
5ms    ├─ Run tests/setup.js
       │  ├─ Connect to test database
       │  ├─ Clear collections
       │  └─ Setup environment
       │
10ms   ├─ Discover test files
       │  ├─ Find auth.test.js
       │  ├─ Find session.test.js
       │  └─ Find jwt.test.js
       │
15ms   ├─ Run Auth Tests (25 tests)
       │  ├─ ✅ Register new user
       │  ├─ ✅ Login with credentials
       │  ├─ ❌ Duplicate email fails (intentional)
       │  └─ ... 22 more tests
       │
150ms  ├─ Run Session Tests (30 tests)
       │  ├─ ✅ Create session
       │  ├─ ✅ Add participant
       │  └─ ... 28 more tests
       │
250ms  ├─ Run JWT Tests (20 tests)
       │  ├─ ✅ Generate token
       │  ├─ ✅ Verify signature
       │  └─ ... 18 more tests
       │
280ms  ├─ Collect Coverage Data
       │  └─ Which lines of code ran?
       │
300ms  └─ Report Results
          ├─ 75 Tests Passed ✅
          ├─ Coverage: 89% ✅
          └─ Done!
```

### Code Coverage Threshold

```
Requirement: Minimum 75% coverage for ALL files

Example Result:
┌─────────────────────────────────────────┐
│ File                    Coverage Status │
├─────────────────────────────────────────┤
│ controllers/auth        92%     ✅      │
│ services/jwt            100%    ✅      │
│ models/session          78%     ✅      │
│ middleware/auth         88%     ✅      │
│ utils/validator         81%     ✅      │
├─────────────────────────────────────────┤
│ OVERALL RESULT: PASSING                 │
│ Coverage: 89% (above 75% threshold)     │
└─────────────────────────────────────────┘
```

---

## 🔀 Nginx Reverse Proxy Explained

### Architecture Diagram

```
                     PUBLIC INTERNET
                            ↓
                    ┌──────────────────┐
                    │  Client Browser  │
                    │  example.com     │
                    └────────┬─────────┘
                             │ HTTP Request (Port 80)
                             ↓
    ┌────────────────────────────────────────────────────┐
    │                  NGINX SERVER                       │
    │          (Reverse Proxy - Port 80)                 │
    │                                                     │
    │  📥 Receives Request from Client                   │
    │  🔍 Analyzes /api/ prefix                          │
    │  ⚡ Applies rate limit (100 req/min)               │
    │  🗜️  Prepares to compress response                │
    │  🔒 Adds security headers                          │
    │  📤 Forwards to Express Backend                    │
    │                                                     │
    └────────────────┬─────────────────────────────────┘
                     │ Forward to Backend
                     │ (Port 5000)
                     ↓
    ┌────────────────────────────────────────────────────┐
    │            NODEJS EXPRESS SERVER                   │
    │           (Your App - Port 5000)                   │
    │                                                     │
    │  🎯 Process Request                               │
    │  ├─ Verify JWT token                              │
    │  ├─ Access database                               │
    │  ├─ Execute business logic                        │
    │  └─ Generate response                             │
    │                                                     │
    └────────────────┬─────────────────────────────────┘
                     │ Response Data
                     ↓
    ┌────────────────────────────────────────────────────┐
    │                  NGINX SERVER                       │
    │                                                     │
    │  📥 Receives Response from Express                │
    │  🗜️  Compresses with Gzip (70% smaller)          │
    │  🔒 Adds X-Frame-Options header                    │
    │  🔒 Adds X-Content-Type-Options header            │
    │  🔒 Adds CSP header                               │
    │  📤 Sends to Client                               │
    │                                                     │
    └────────────────┬─────────────────────────────────┘
                     │ Compressed Response
                     ↓
                    ┌──────────────────┐
                    │  Client Browser  │
                    │  Decompresses    │
                    │  Renders Page    │
                    └──────────────────┘
```

### Rate Limiting Example

```
Scenario: User making too many requests

User A starts requesting /api/execute (code execution)
Limit: Max 10 requests per minute

Timeline:
0:00  Request 1  ✅ Allowed (1/10)
0:05  Request 2  ✅ Allowed (2/10)
0:10  Request 3  ✅ Allowed (3/10)
0:15  Request 4  ✅ Allowed (4/10)
0:20  Request 5  ✅ Allowed (5/10)
0:25  Request 6  ✅ Allowed (6/10)
0:30  Request 7  ✅ Allowed (7/10)
0:35  Request 8  ✅ Allowed (8/10)
0:40  Request 9  ✅ Allowed (9/10)
0:45  Request 10 ✅ Allowed (10/10 - AT LIMIT)
0:50  Request 11 ❌ BLOCKED! "Too many requests"
1:00  Request 12 ✅ Allowed (counter resets, 1/10)

Benefits:
✅ Prevents DDoS attacks
✅ Prevents abuse
✅ Fair resource sharing
✅ Protects your server
```

### Nginx Location Routing

```
Different URLs → Different Treatment

URL Pattern              Rate Limit       Timeout
─────────────────────────────────────────────────
/api/                   100 req/min      60 seconds
│
├─ /api/auth           100 req/min      60 seconds
├─ /api/sessions       100 req/min      60 seconds
└─ /api/execute        10 req/min ⚠️     120 seconds (longer)

/socket.io             NO LIMIT          86400 sec (24 hours!)
│
└─ Real-time connection (always open)

/health                NO LIMIT (logged OFF)
│
└─ Used by load balancers

/metrics               RESTRICTED
│
└─ Only Docker internal network
```

### Gzip Compression Effect

```
Original Response (JSON):
{
  "users": [
    { "id": 1, "email": "john@example.com", "name": "John Doe", ... },
    { "id": 2, "email": "jane@example.com", "name": "Jane Smith", ... },
    ... (1000 more users)
  ]
}

Size: 150 KB

After Gzip Compression:
[Binary compressed data that's unreadable]
Size: 45 KB (30% of original!)

Benefits:
✅ Download faster: 3000ms → 900ms (70% improvement)
✅ Uses less bandwidth
✅ Better for mobile users
✅ Transparent to user (browser auto-decompresses)

Browsers automatically:
1. Request with Accept-Encoding: gzip
2. Nginx compresses response
3. Browser decompresses transparently
User sees: Same content, faster ⚡
```

---

## 📇 MongoDB Indexes Explained

### Index = Book Index Analogy

```
Finding "John" without index (no book index):
┌──────────────────────────────────────┐
│ Page 1:  Alice, Bob, Charlie         │ ❌ Not here
├──────────────────────────────────────┤
│ Page 2:  Diana, Eve, Frank           │ ❌ Not here
├──────────────────────────────────────┤
│ Page 3:  Grace, Henry, Iris          │ ❌ Not here
├──────────────────────────────────────┤
│ ...     (100 more pages)              │
├──────────────────────────────────────┤
│ Page 50: John, Kate, Leo             │ ✅ Found!
└──────────────────────────────────────┘
Time: 1 hour ❌ TOO SLOW

Finding "John" WITH index (book index):
┌──────────────────┐
│    BOOK INDEX    │
├──────────────────┤
│ Alice      → p.2 │
│ Charlie    → p.5 │
│ Frank      → p.8 │
│ Grace      → p.12│
│ John       → p.50│ ← Direct link!
│ Kate       → p.51│
│ Leo        → p.52│
└──────────────────┘
Time: 5 seconds ✅ INSTANT
```

### Unique Indexes (Prevent Duplicates)

```
Email field is marked UNIQUE:

Insert User 1: email = "john@example.com" ✅ OK
MongoDB stores in index:
  {
    "john@example.com": ObjectId("user1")
  }

Insert User 2: email = "john@example.com" ❌ ERROR!
MongoDB checks index:
  "john@example.com" already exists!
  Reject insert with duplicate key error

Result: No duplicate emails possible ✅
```

### Compound Indexes (Multiple Fields)

```
Index: { owner: 1, createdAt: -1 }

Organized like a spreadsheet:

┌──────────────────┬────────────────────┐
│ owner            │ createdAt          │
├──────────────────┼────────────────────┤
│ user1 (ascending)│ 2025-10-28 (desc.) │
│ user1            │ 2025-10-27         │
│ user1            │ 2025-10-26         │
│ user2            │ 2025-10-28         │
│ user2            │ 2025-10-20         │
│ user3            │ 2025-10-15         │
└──────────────────┴────────────────────┘

Query: Find all of user1's sessions, newest first
Speed: Direct index lookup → instant! ⚡
Without index: Sort all 100,000 sessions → 5000ms
```

### TTL Indexes (Auto-Cleanup)

```
Logs Collection - Auto-delete after 30 days:

db.logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 });
                      ↑ field              ↑ 30 days in seconds

Timeline:

Day 0:   Log created
         { timestamp: "2025-10-28T10:00:00Z", message: "..." }
         ✅ Exists in database

Day 15:  Log still exists ✅

Day 29:  Log still exists ✅

Day 30:  MongoDB checks TTL index
         Realizes: timestamp is more than 30 days old
         Action: ❌ DELETE automatically

Day 31:  Log gone! 🗑️
         No manual cleanup needed

Benefits:
✅ Automatic storage cleanup
✅ Saves disk space
✅ Removes sensitive old data
✅ No code needed
```

### All Your Indexes Visualized

```
USERS COLLECTION
┌────────────────────────────────────────┐
│ Index 1: email (UNIQUE)                │
│ ├─ john@example.com  → User 1         │
│ ├─ jane@example.com  → User 2         │
│ └─ (prevents duplicates) ✅            │
│                                        │
│ Index 2: username (UNIQUE)             │
│ ├─ john123    → User 1                │
│ ├─ jane456    → User 2                │
│ └─ (prevents duplicates) ✅            │
│                                        │
│ Index 3: createdAt (ascending)         │
│ ├─ 2025-01-15 → User 5                │
│ ├─ 2025-02-20 → User 3                │
│ ├─ 2025-10-28 → User 1                │
│ └─ (fastest "newest users" query) ✅  │
│                                        │
│ Index 4: lastLogin (ascending)         │
│ ├─ 2025-01-01 → User 5 (inactive)    │
│ ├─ 2025-10-28 → User 1 (active)      │
│ └─ (find inactive users) ✅            │
└────────────────────────────────────────┘

SESSIONS COLLECTION
┌────────────────────────────────────────┐
│ Index 1: owner + createdAt             │
│ ├─ user1 → [2025-10-28, 2025-10-25]  │
│ ├─ user2 → [2025-10-28, 2025-10-20]  │
│ └─ (my sessions, newest first) ✅     │
│                                        │
│ Index 2: isPublic + updatedAt          │
│ ├─ true → [2025-10-28, 2025-10-27]   │
│ ├─ false → [2025-10-27, 2025-10-26]  │
│ └─ (public sessions, recent first) ✅ │
│                                        │
│ Index 3: createdAt (ascending)         │
│ └─ (all sessions sorted by date) ✅   │
│                                        │
│ Index 4: participants.user            │
│ ├─ user1 → [session1, session2]       │
│ ├─ user2 → [session1, session3]       │
│ └─ (find sessions I joined) ✅        │
│                                        │
│ Index 5: isActive (ascending)          │
│ ├─ true → [many active sessions]      │
│ └─ false → [archived sessions]        │
└────────────────────────────────────────┘

LOGS COLLECTION
┌────────────────────────────────────────┐
│ Index 1: timestamp (TTL)               │
│ ├─ 2025-01-01 → ❌ AUTO-DELETED       │
│ ├─ 2025-09-01 → ❌ AUTO-DELETED       │
│ ├─ 2025-10-15 → ✅ Exists             │
│ └─ (auto-cleanup after 30 days) ✅    │
│                                        │
│ Index 2: level + timestamp             │
│ ├─ "error" → [recent errors]          │
│ ├─ "warn"  → [recent warnings]        │
│ └─ (find errors, newest first) ✅     │
│                                        │
│ Index 3: userId + timestamp            │
│ ├─ user1 → [their logs]               │
│ └─ (user's activity logs) ✅          │
│                                        │
│ Index 4: sessionId + timestamp         │
│ ├─ session1 → [session logs]          │
│ └─ (session's activity log) ✅        │
└────────────────────────────────────────┘
```

### Performance Before & After Indexes

```
Query: Find user's last 10 sessions, sorted by date

BEFORE INDEXES:
├─ Read entire sessions collection: 100,000 documents
├─ Filter by owner: "user1"
│  └─ 5,000 documents match
├─ Sort by createdAt
│  └─ In memory sort
├─ Limit to 10
└─ Total time: 5000ms ❌ TOO SLOW

AFTER INDEXES:
├─ Use compound index { owner, createdAt }
├─ Direct lookup: owner = "user1"
│  └─ Instant (B-tree traversal)
├─ Already sorted (index is sorted!)
├─ Return first 10
└─ Total time: 5ms ✅ 1000x FASTER!
```

---

## 📊 Complete System Flow

```
┌──────────────────────────────────────────────────────────┐
│ 1. CLIENT SENDS REQUEST                                  │
│    Browser → http://example.com/api/sessions             │
└──────────────┬───────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────┐
│ 2. NGINX PROCESSES REQUEST                               │
│    ├─ Check rate limit: 100 req/min ✅                   │
│    ├─ Add security headers                               │
│    ├─ Forward to Express backend                         │
│    └─ Prepare for compression                            │
└──────────────┬───────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────┐
│ 3. EXPRESS PROCESSES REQUEST                             │
│    ├─ Auth middleware: Verify JWT ✅                     │
│    ├─ Routes: /api/sessions → sessions.controller        │
│    ├─ Controller: Call session.service.getUserSessions() │
│    └─ Service: Query database                            │
└──────────────┬───────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────┐
│ 4. MONGODB QUERY (WITH INDEX)                            │
│    Query: db.sessions.find({owner: userId})             │
│    Index: { owner: 1, createdAt: -1 }                    │
│    ├─ Use index to find owner's sessions                │
│    ├─ Already sorted by date! (from index)              │
│    ├─ Return 10 most recent                             │
│    └─ Time: 5ms ✅ (1000x faster with index)            │
└──────────────┬───────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────┐
│ 5. EXPRESS SENDS RESPONSE                                │
│    [ { session1 }, { session2 }, ... ]                   │
│    JSON size: 150 KB                                     │
└──────────────┬───────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────┐
│ 6. NGINX COMPRESSES RESPONSE                             │
│    ├─ Apply Gzip compression                             │
│    ├─ Size: 150 KB → 45 KB (70% smaller)                │
│    ├─ Add Content-Encoding: gzip header                  │
│    └─ Send to client                                     │
└──────────────┬───────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────┐
│ 7. BROWSER RECEIVES RESPONSE                             │
│    ├─ Decompress gzip automatically                      │
│    ├─ Parse JSON: 150 KB                                │
│    ├─ Render sessions list                              │
│    └─ Display to user                                    │
└──────────────────────────────────────────────────────────┘

TOTAL TIME: 150ms ⚡ (would be 5000ms+ without optimization)
```

---

## 🧪 Testing the Components

### Run Tests
```bash
npm test                          # Run all tests
npm test -- --coverage            # With coverage report
npm test -- auth.test.js          # Specific test file
npm test -- --watch               # Auto-rerun on changes
```

### Check Nginx
```bash
# Inside nginx container:
docker-compose exec nginx nginx -t         # Test config
docker-compose logs nginx                  # View logs
curl -i http://localhost/api/sessions      # Test routing
```

### Check MongoDB Indexes
```bash
# Inside MongoDB container:
mongo
> use codecrafter
> db.sessions.getIndexes()                 # List all indexes
> db.sessions.explain().find({owner: "..."}) # See query plan
```

---

## 📈 Summary Table

| Component | What It Does | Speed Impact | How Created |
|-----------|------------|--------------|------------|
| **Jest** | Tests code automatically | - | `npm test` |
| **Nginx** | Routes & protects requests | 70% faster | nginx.conf |
| **Indexes** | Makes queries faster | 1000x faster | mongo-init.js |

