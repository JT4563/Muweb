# 🎯 Complete Learning Path: Zero to Backend Legend

## 📚 **Your Step-by-Step Learning Journey**

This is your **complete learning path** to master every single component in your CodeCrafter project. I'll explain everything from the **absolute basics** to advanced architecture. **Imagine you know nothing about programming** - I'll explain every single word and concept.

---

## 🏗️ **PHASE 1: Foundation (Week 1-2) - Understanding the Basics**

### **🤔 Before We Start: What is Backend Development?**

**Think of a restaurant:**
- **Frontend** = The dining room (what customers see and interact with)
- **Backend** = The kitchen (where all the cooking/processing happens)
- **Database** = The pantry (where ingredients/data are stored)
- **API** = The waiter (carries orders from dining room to kitchen and food back)

**Your CodeCrafter project is like a complete restaurant with:**
- Kitchen staff (controllers)
- Recipes (business logic)
- Storage systems (database)
- Communication systems (APIs)
- Security guards (authentication)

### **Step 1: Project Structure & File Relationships**

#### **🔗 How Files Are Connected (Like a House Blueprint)**

**Think of your project like a house - each folder has a specific purpose:**

```
📁 Your Project Structure (Like Rooms in a House):

├── 🚀 app.js          → Main application setup (THE BRAIN)
│                        ↳ Like the main electrical panel that controls everything
│
├── 🌐 server.js       → Server startup & coordination (THE HEART)  
│                        ↳ Like the main power switch that turns on the house
│
├── 📂 api/            → Route definitions (THE NERVOUS SYSTEM)
│   ├── auth.routes.js    ↳ Handles login/register (like front door security)
│   ├── sessions.routes.js ↳ Manages coding sessions (like room access)
│   └── execute.routes.js  ↳ Runs code safely (like a workshop)
│
├── 🎮 controllers/    → Business logic (THE MUSCLES)
│   ├── auth.controller.js    ↳ Does the actual login work
│   ├── sessions.controller.js ↳ Creates and manages sessions
│   └── execute.controller.js  ↳ Handles code execution
│
├── 📊 models/         → Database schemas (THE MEMORY/FILING SYSTEM)
│   ├── user.model.js     ↳ How user data is organized
│   ├── session.model.js  ↳ How session data is structured
│   └── log.model.js      ↳ How activity logs are stored
│
├── ⚙️ services/       → Core business services (THE ORGANS)
│   ├── jwt.service.js     ↳ Handles login tokens (like ID cards)
│   ├── docker.service.js ↳ Runs code in safe containers
│   └── queue.service.js   ↳ Manages background tasks
│
├── 🔧 config/         → Database/Redis/RabbitMQ setup (THE FOUNDATION)
│   ├── db.config.js      ↳ Connects to database (like plumbing)
│   ├── redis.config.js   ↳ Connects to cache (like quick storage)
│   └── rabbitmq.config.js ↳ Connects to message system
│
├── 🛡️ middleware/     → Security & validation (THE IMMUNE SYSTEM)
│   ├── auth.middleware.js ↳ Checks if user is logged in
│   └── error.middleware.js ↳ Handles when things go wrong
│
├── 🔌 websocket/      → Real-time communication (THE VOICE)
│   ├── socket.server.js   ↳ Handles live chat/collaboration
│   └── crdt.utils.js      ↳ Prevents conflicts when multiple people edit
│
├── 👷 workers/        → Background job processing (THE WORKERS)
│   └── code.worker.js     ↳ Processes code execution in background
│
└── 📊 monitoring/     → Health checks & metrics (THE DOCTOR)
    ├── prometheus.yml     ↳ Collects performance data
    └── grafana/          ↳ Creates visual health dashboards
```

#### **🔍 Simple Analogy: How These Files Work Together**

**Imagine ordering food through an app:**

1. **You tap "Order Pizza" (Frontend)**
2. **api/orders.routes.js** receives your request (like the restaurant phone)
3. **controllers/orders.controller.js** processes your order (like the order taker)
4. **models/order.model.js** structures how your order is saved (like the order form)
5. **services/payment.service.js** handles payment (like the payment processor)
6. **config/db.config.js** saves your order to database (like the kitchen gets the order)
7. **workers/kitchen.worker.js** makes your pizza in background (like the cook)
8. **websocket/tracking.js** sends you live updates (like "Your pizza is ready!")

**Every file has a specific job, just like every person in a restaurant!**

#### **🧠 Learning Task 1: Trace a Request Flow (Like Following a Letter Through the Post Office)**

**Goal**: Understand how a user request flows through your application

**🏃‍♂️ Imagine you're sending a letter - here's the journey:**

```
USER REQUEST FLOW (Like Mailing a Letter):

1. 📬 User hits: POST /api/auth/login
   ↳ Like: You drop a letter in the mailbox
   ↳ The letter says: "Please log me in with username: john, password: secret123"

2. 🚀 app.js → receives request  
   ↳ Like: Main post office receives your letter
   ↳ app.js says: "I got a letter, let me check who should handle this"

3. 📂 api/auth.routes.js → routes to auth controller
   ↳ Like: Post office looks at address and says "This goes to Authentication Department"
   ↳ auth.routes.js says: "Any login request goes to auth controller"

4. 🎮 controllers/auth.controller.js → handles login logic
   ↳ Like: Authentication Department worker opens your letter
   ↳ Controller says: "Let me check if john exists and if password is correct"

5. 📊 models/user.model.js → validates against database
   ↳ Like: Worker looks in the filing cabinet for john's information
   ↳ Model says: "Here's the structure of user data and how to find it"

6. 🔧 config/db.config.js → database connection
   ↳ Like: The filing cabinet key that opens the user records
   ↳ Database says: "Here's john's real password hash: $2a$10$xyz..."

7. ✅ Response sent back to user
   ↳ Like: Worker sends you a reply letter saying "Login successful! Here's your access card (JWT token)"
```

**🔍 What to study (Step by Step for Absolute Beginners):**

**Step 1.1: Open `app.js` and understand every single line**
```javascript
// Don't worry if you don't understand everything yet!
const express = require('express');  // ← What is 'require'? What is 'express'?
```

**What is `require`?**
- Think of it like "borrowing tools from a toolbox"
- `require('express')` means "I want to use the Express.js tool"
- Express.js is like a "web server kit" that helps you build websites

**Step 1.2: Trace every `app.use()` line**
```javascript
app.use(helmet());        // ← Puts a security helmet on your server
app.use(cors());          // ← Allows websites to talk to your server
app.use(express.json());  // ← Helps server understand JSON data
```

**What is `app.use()`?**
- Think of it like "installing security checkpoints"
- Every request must pass through these checkpoints in order
- Like airport security: baggage check → metal detector → ID check

**Step 1.3: Follow the route definitions in `api/` folder**
```javascript
// In api/auth.routes.js
router.post('/login', authController.login);
```

**What does this mean?**
- `router.post` = "When someone sends a POST request..."
- `'/login'` = "...to the /login address..."
- `authController.login` = "...send them to the login function"

**What is POST?**
- Think of HTTP methods like different types of mail:
  - GET = "Please give me information" (like requesting a catalog)
  - POST = "Please process this information" (like submitting a form)
  - PUT = "Please update this information" (like changing your address)
  - DELETE = "Please remove this information" (like unsubscribing)

**Step 1.4: See how controllers import models**
```javascript
// In auth.controller.js
const User = require('../models/user.model');
```

**What does this do?**
- "Borrowing the User blueprint from the models folder"
- Like having the form template when you need to create or find users

**Step 1.5: Understand middleware order (SUPER IMPORTANT!)**
```javascript
app.use(helmet());        // 1st: Security check
app.use(cors());          // 2nd: Cross-origin check  
app.use(express.json());  // 3rd: Parse JSON data
app.use('/api/auth', authRoutes); // 4th: Handle auth routes
```

**Why order matters:**
- Like a security checkpoint at an airport
- You must go through security BEFORE you can board the plane
- Helmet must run BEFORE routes to protect them
- JSON parsing must happen BEFORE controllers try to read request data

**🎯 Baby Steps Practice:**
1. **Open `app.js` and read it line by line**
2. **Google every function you don't understand** (helmet, cors, compression)
3. **Draw the flow on paper** with arrows showing how a request moves
4. **Use simple words** to explain what each line does

---

### **Step 2: Understanding app.js (THE BRAIN)**

#### **📖 What app.js Does (Explained Like You're 5):**

**Think of app.js as the MAIN OFFICE MANAGER of a big company:**
- When someone visits your website, they're like a customer walking into your office
- app.js is the receptionist who greets them, checks their ID, and sends them to the right department
- It also makes sure the office is secure and organized

```javascript
// Let's break down app.js line by line (ABSOLUTE BEGINNER LEVEL):

// 1. IMPORTING TOOLS (Like getting tools from a toolbox)
const express = require('express');     
// ↳ What is 'express'? It's like a website-building kit
// ↳ 'require' means "I want to use this tool"
// ↳ Think: "I need a hammer from my toolbox"

const cors = require('cors');          
// ↳ What is 'cors'? Cross-Origin Resource Sharing
// ↳ Simple explanation: Allows your website (frontend) to talk to your server (backend)
// ↳ Like: Allowing people from other buildings to visit your office

const helmet = require('helmet');      
// ↳ What is 'helmet'? Security protection for your server
// ↳ Simple explanation: Like putting a security guard at your office entrance
// ↳ Protects against hackers trying to break in

const compression = require('compression'); 
// ↳ What is 'compression'? Makes your website load faster
// ↳ Simple explanation: Like zipping a file to make it smaller
// ↳ Your server sends smaller data = faster loading

// 2. CREATING THE APP (Like setting up your office)
const app = express();
// ↳ This creates your web application
// ↳ Think: "Now I have an empty office building, let me set it up"

// 3. SECURITY SETUP (Like hiring security guards)
app.use(helmet());
// ↳ This puts on the security helmet
// ↳ What it does: Adds special headers to protect against attacks
// ↳ Like: Installing security cameras and alarms

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
// ↳ This allows your frontend to talk to backend
// ↳ 'origin' = which websites are allowed to call your API
// ↳ 'credentials' = allows sending cookies/login info
// ↳ Like: Giving permission slips to trusted visitors

// 4. DATA PROCESSING SETUP (Like setting up mail sorting)
app.use(express.json({ limit: '10mb' }));
// ↳ What is 'express.json()'? Helps server understand JSON data
// ↳ What is JSON? A way to send data like: {"name": "John", "age": 25}
// ↳ 'limit: 10mb' = Don't accept files bigger than 10 megabytes
// ↳ Like: "Only accept letters, not huge packages"

app.use(express.urlencoded({ extended: true }));
// ↳ Helps server understand form data (like contact forms)
// ↳ 'urlencoded' = data that comes from HTML forms
// ↳ Like: Understanding different types of mail formats

// 5. COMPRESSION (Like using a vacuum bag for clothes)
app.use(compression());
// ↳ Makes all responses smaller and faster
// ↳ Like: Compressing air out of packages before shipping

// 6. RATE LIMITING (Like having a "no spam" policy)
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// ↳ Stops people from making too many requests
// ↳ windowMs = time window (15 minutes)
// ↳ max = maximum requests allowed (100)
// ↳ Like: "Each person can only visit 100 times in 15 minutes"

// 7. CONNECTING ROUTES (Like setting up departments)
const authRoutes = require('./api/auth.routes');
const sessionRoutes = require('./api/sessions.routes');
const executeRoutes = require('./api/execute.routes');

app.use('/api/auth', authRoutes);
// ↳ All requests to /api/auth/* go to auth department
// ↳ Like: "All login/register requests go to HR department"

app.use('/api/sessions', sessionRoutes);
// ↳ All requests to /api/sessions/* go to session department
// ↳ Like: "All meeting room requests go to Facilities department"

app.use('/api/execute', executeRoutes);
// ↳ All requests to /api/execute/* go to code execution department
// ↳ Like: "All programming requests go to IT department"

// 8. ERROR HANDLING (Like having a customer service department)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// ↳ When something goes wrong, this handles it gracefully
// ↳ Instead of crashing, it shows a nice error message
// ↳ Like: "If something breaks, apologize to the customer"
```

**🔗 HOW app.js CONNECTS TO OTHER FILES:**

```
REQUEST FLOW (Like Following a Letter Through Mail System):

1. 📬 USER SENDS REQUEST → app.js receives it
   ↳ Like: Customer calls your office

2. 🛡️ SECURITY CHECK → helmet(), cors() check safety
   ↳ Like: Security guard checks ID

3. 📝 DATA PARSING → express.json() reads the data
   ↳ Like: Receptionist reads the customer's request

4. 🚦 ROUTE DECISION → app.use('/api/auth', ...) decides department
   ↳ Like: Receptionist says "This goes to HR department"

5. 📂 ROUTE FILE → api/auth.routes.js takes over
   ↳ Like: HR department receives the request

6. 🎮 CONTROLLER → controllers/auth.controller.js does the work
   ↳ Like: HR employee processes the request

7. 📊 MODEL → models/user.model.js handles database
   ↳ Like: Checking the filing cabinet for records

8. ✅ RESPONSE → Result goes back through same path
   ↳ Like: Answer travels back to customer
```

**🎯 Learning Exercise (Baby Steps):**
1. **Open app.js in your code editor**
2. **Read each line slowly** and match it to explanations above
3. **Google what you don't understand**: "What is express.js?", "What is CORS?"
4. **Draw the flow on paper**: User → Security → Parsing → Routes → Controller
5. **Test with simple request**: Use Postman to send GET request to your API

**💡 Key Concepts to Master (Explained Simply):**

**🔧 Middleware (Like Assembly Line Workers):**
- **What it is**: Functions that process requests step by step
- **Real example**: Security guard → ID checker → Department router → Worker
- **In code**: `app.use(helmet())` → `app.use(cors())` → `app.use(express.json())`
- **Why important**: Each step prepares the request for the next step

**🌐 CORS (Like Passport Control):**
- **What it is**: Cross-Origin Resource Sharing
- **Simple explanation**: Allows your website (frontend) to call your server (backend)
- **Real example**: Like allowing people from other countries to visit your office
- **Without CORS**: Browser blocks your frontend from calling your API
- **With CORS**: Browser allows the connection

**⏱️ Rate Limiting (Like Bouncer at a Club):**
- **What it is**: Prevents too many requests from same person
- **Simple explanation**: "Each person can only make 100 requests per 15 minutes"
- **Why needed**: Stops spam attacks and server overload
- **Real example**: Like ATM limiting how many withdrawals per day

**📦 Body Parsing (Like Mail Sorting):**
- **What it is**: Converts incoming data into JavaScript objects
- **express.json()**: Handles JSON data `{"name": "John"}`
- **express.urlencoded()**: Handles form data `name=John&age=25`
- **Why needed**: Server needs to understand different data formats

**🗂️ Routing (Like Office Directory):**
- **What it is**: Deciding which department handles which request
- **Pattern**: `app.use('/api/auth', authRoutes)`
- **Meaning**: "All /api/auth requests go to auth department"
- **Like**: Office directory saying "HR is on 2nd floor, IT is on 3rd floor"

---

### **Step 3: Understanding server.js (THE HEART)**

#### **📖 What server.js Does (The Startup Manager Explained for Babies):**

**Think of server.js as the MAIN POWER SWITCH of your entire house:**
- When you flip this switch, your entire house comes to life
- It turns on electricity, water, heating, internet - EVERYTHING
- Without server.js, your app is just dead code sitting on your computer

```javascript
// Let's break down server.js line by line (SUPER DETAILED):

// 1. IMPORTING REQUIRED TOOLS (Like gathering all tools before starting work)
const app = require('./app');
// ↳ What is this? Getting the app.js file we just set up
// ↳ Think: "I need my office setup (app.js) to start my business"
// ↳ app.js = the office setup, server.js = actually opening for business

const http = require('http');
// ↳ What is 'http'? The protocol that websites use to communicate
// ↳ Think: "I need the language that browsers and servers speak"
// ↳ Like: Needing English to talk to English-speaking customers

const socketIo = require('socket.io');
// ↳ What is 'socket.io'? Real-time communication tool
// ↳ Think: "I need a phone system for instant communication"
// ↳ Allows live chat, real-time updates, instant notifications

const connectDB = require('./config/db.config');
// ↳ What is this? Function to connect to database
// ↳ Think: "I need to connect to my filing cabinet (database)"
// ↳ Without database = no way to save or retrieve data

const connectRedis = require('./config/redis.config');
// ↳ What is Redis? Super-fast memory storage
// ↳ Think: "I need a super-quick notepad for temporary information"
// ↳ Used for caching, sessions, temporary data

const connectRabbitMQ = require('./config/rabbitmq.config');
// ↳ What is RabbitMQ? Message queue system
// ↳ Think: "I need a mailbox system for background tasks"
// ↳ Used when tasks take too long (like sending emails, processing files)

// 2. ENVIRONMENT SETUP (Like checking your office address and phone number)
const PORT = process.env.PORT || 3000;
// ↳ What is PORT? The address where your server lives
// ↳ Think: "My office is at building number 3000"
// ↳ process.env.PORT = production address, 3000 = development address

const NODE_ENV = process.env.NODE_ENV || 'development';
// ↳ What is NODE_ENV? Tells if you're testing or in real business
// ↳ 'development' = you're practicing/testing
// ↳ 'production' = real customers are using your app

// 3. CREATING THE SERVER (Like opening your office building)
const server = http.createServer(app);
// ↳ What does this do? Creates actual web server
// ↳ app = your office setup, server = the actual building
// ↳ Think: "Now I have a real building where customers can visit"

// 4. WEBSOCKET SETUP (Like installing a phone system)
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
// ↳ What is WebSocket? Instant two-way communication
// ↳ Think: "Installing phones so customers can call instantly"
// ↳ cors = allowing calls from your website
// ↳ methods = types of calls allowed (GET = asking for info, POST = sending info)

// 5. WEBSOCKET EVENT HANDLERS (Like training your phone operators)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // ↳ What happens when someone connects?
  // ↳ Think: "When phone rings, operator says 'Hello, how can I help?'"
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });
  // ↳ What is 'join-room'? User wants to join a specific chat room
  // ↳ Think: "Customer wants to join conference room 123"
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  // ↳ What happens when someone leaves?
  // ↳ Think: "When customer hangs up, operator notes they left"
});

// 6. STARTUP SEQUENCE (Like opening your business step by step)
async function startServer() {
  try {
    // Step 1: Connect to Database (Like opening your filing cabinet)
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    // ↳ Why first? Need storage before accepting customers
    
    // Step 2: Connect to Redis (Like setting up quick notepad)
    console.log('🔌 Connecting to Redis...');
    await connectRedis();
    console.log('✅ Redis connected successfully');
    // ↳ Why second? Need quick storage for user sessions
    
    // Step 3: Connect to RabbitMQ (Like setting up mailbox system)
    console.log('🔌 Connecting to RabbitMQ...');
    await connectRabbitMQ();
    console.log('✅ RabbitMQ connected successfully');
    // ↳ Why third? Need background task system ready
    
    // Step 4: Start the server (Like opening doors to customers)
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
    // ↳ This is the moment your app becomes live!
    // ↳ Now customers can visit your website
    
  } catch (error) {
    // What if something goes wrong during startup?
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Shut down completely
    // ↳ Like: "If I can't open my office properly, I won't open at all"
  }
}

// 7. GRACEFUL SHUTDOWN (Like closing business properly)
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown(signal) {
  console.log(`📴 Received ${signal}. Shutting down gracefully...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    // Close database connections
    mongoose.connection.close(() => {
      console.log('✅ MongoDB connection closed');
    });
    
    // Close Redis connection
    redis.quit(() => {
      console.log('✅ Redis connection closed');
    });
    
    process.exit(0);
  });
}
// ↳ What is graceful shutdown? Closing business properly
// ↳ Instead of suddenly turning off power, you:
//   1. Stop accepting new customers
//   2. Finish serving current customers
//   3. Save all important data
//   4. Turn off systems one by one
//   5. Lock the doors

// 8. START THE SERVER (Like actually opening for business)
startServer();
```

**🔗 HOW server.js CONNECTS TO OTHER FILES:**

```
STARTUP SEQUENCE (Like Opening a Restaurant):

1. 📋 server.js starts → "I want to open my restaurant"

2. 🏢 Imports app.js → "Let me get my restaurant setup"
   ↳ app.js = menu, tables, kitchen setup
   ↳ server.js = actually opening the doors

3. 🗄️ Connects to MongoDB → "Let me connect to my storage room"
   ↳ config/db.config.js handles this
   ↳ MongoDB = where all data is permanently stored

4. ⚡ Connects to Redis → "Let me set up my quick-access shelf"
   ↳ config/redis.config.js handles this
   ↳ Redis = super-fast temporary storage

5. 📬 Connects to RabbitMQ → "Let me set up my task management system"
   ↳ config/rabbitmq.config.js handles this
   ↳ RabbitMQ = handles background jobs

6. 📞 Sets up WebSocket → "Let me install my instant communication system"
   ↳ websocket/socket.server.js provides the logic
   ↳ WebSocket = real-time chat, live updates

7. 🚀 Starts HTTP server → "Now I'm officially open for business!"
   ↳ server.listen(PORT) = customers can now visit

8. 🔄 Handles requests → "Customers start coming in"
   ↳ Each request goes through app.js flow
   ↳ Routes → Controllers → Models → Response
```

**🎯 Learning Exercise (Step by Step for Beginners):**
1. **Open server.js and read each line with explanations above**
2. **Try starting your server**: `npm start` or `node server.js`
3. **Watch the console messages**: See the startup sequence happen
4. **Visit `http://localhost:3000`**: See if your server responds
5. **Stop the server**: Press Ctrl+C and watch graceful shutdown

**💡 Key Concepts to Master (Explained Like You're 5):**

**🏗️ HTTP Server (Like Building a Store):**
- **What it is**: The actual building where customers visit
- **app.js**: Interior design and layout
- **server.js**: Actually opening the doors
- **PORT**: Street address where customers find you

**🔌 Database Connections (Like Utility Connections):**
- **MongoDB**: Main storage room (permanent data)
- **Redis**: Quick-access shelf (temporary data)
- **RabbitMQ**: Message system (background tasks)
- **Why connect first**: Need utilities before opening

**📞 WebSocket (Like Phone System):**
- **What it is**: Instant two-way communication
- **HTTP**: Like mailing letters (request → response → done)
- **WebSocket**: Like phone calls (constant connection)
- **Use cases**: Live chat, real-time updates, notifications

**🔄 Event Loop (Like Restaurant Manager):**
- **What it is**: Node.js handles multiple customers simultaneously
- **Not like**: One cashier serving one customer at a time
- **Like**: One manager coordinating multiple tasks
- **async/await**: "I'll start this task and come back when it's done"

**🛡️ Error Handling (Like Safety Procedures):**
- **try/catch**: "Try to do this, if it fails, do that instead"
- **Graceful shutdown**: Closing business properly, not just turning off power
- **process.exit(1)**: "Something is so wrong, I must close immediately"

**🌍 Environment Variables (Like Business Settings):**
- **process.env.PORT**: Address where business operates
- **NODE_ENV**: Whether you're practicing or serving real customers
- **Why use them**: Different settings for testing vs. real business

---

### **Step 1.6: Environment Setup & Configuration Management**

#### **🌍 Understanding Environment Variables (Like Business Settings):**

**What are Environment Variables?**
- Think of them like **settings for your restaurant** that change based on whether you're:
  - **Testing recipes** (development)
  - **Having a soft opening** (staging) 
  - **Serving real customers** (production)

```javascript
// .env file structure (Like your restaurant's settings book):
NODE_ENV=development              // Are we testing or serving real customers?
PORT=3000                        // What address is our restaurant at?
DB_HOST=localhost                // Where is our storage room (database)?
DB_NAME=codecrafter_dev          // What's our storage room called?
JWT_SECRET=super_secret_key_123  // Our master key for security cards
REDIS_URL=redis://localhost:6379 // Where is our quick-access shelf?
RABBITMQ_URL=amqp://localhost    // Where is our task management system?

// Different environments:
// development.env = Testing kitchen with fake ingredients
// staging.env = Practice restaurant with test customers  
// production.env = Real restaurant with real customers
```

**Why Environment Variables Matter:**
```javascript
// Bad (hardcoded values):
const dbConnection = 'mongodb://localhost:27017/myapp'; // What if production uses different address?
const jwtSecret = 'password123'; // Everyone can see your secret!

// Good (environment variables):
const dbConnection = process.env.DATABASE_URL; // Different for each environment
const jwtSecret = process.env.JWT_SECRET; // Hidden from public code
```

**🎯 Baby Steps Practice:**
1. **Create `.env` file** in your project root
2. **Install dotenv package**: `npm install dotenv`
3. **Load environment variables** in your app: `require('dotenv').config()`
4. **Never commit `.env` to git** - add it to `.gitignore`
5. **Use environment variables** instead of hardcoded values

---

### **Step 1.7: Basic Error Handling Patterns**

#### **🛡️ Handling When Things Go Wrong (Like Emergency Procedures):**

**Think of error handling like having emergency procedures in your restaurant:**
- **Fire alarm** = Server crash (500 error)
- **Customer complaint** = Bad request (400 error)  
- **Kitchen runs out of ingredients** = Resource not found (404 error)
- **Customer doesn't pay** = Unauthorized (401 error)

```javascript
// Basic Error Handling Pattern:
app.get('/api/users/:id', async (req, res) => {
  try {
    // 1. Try to do the normal operation
    const user = await User.findById(req.params.id);
    
    // 2. Check if we found what we're looking for
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'No user exists with that ID' 
      });
    }
    
    // 3. If everything is good, send success response
    res.json({ success: true, user });
    
  } catch (error) {
    // 4. If anything goes wrong, handle it gracefully
    console.error('Error finding user:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Something went wrong on our end' 
    });
  }
});
```

**HTTP Status Codes (Like Emergency Response Codes):**
```javascript
// Success codes (Everything went well):
200 - OK (Request successful)
201 - Created (New resource created successfully)
204 - No Content (Success, but nothing to return)

// Client error codes (Customer did something wrong):
400 - Bad Request (Customer sent invalid data)
401 - Unauthorized (Customer needs to log in)
403 - Forbidden (Customer logged in but not allowed)
404 - Not Found (What customer wants doesn't exist)
429 - Too Many Requests (Customer making too many requests)

// Server error codes (Our restaurant has problems):
500 - Internal Server Error (Something broke on our end)
502 - Bad Gateway (Our upstream service is down)
503 - Service Unavailable (We're temporarily closed)
```

**Creating Custom Error Classes:**
```javascript
// utils/errors.js - Custom error types:
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // This is an expected error
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

// Usage in controllers:
if (!user) {
  throw new NotFoundError('User');
}

if (!email.includes('@')) {
  throw new ValidationError('Email must be valid');
}
```

**Global Error Middleware:**
```javascript
// middleware/error.middleware.js - Catches all errors:
const errorHandler = (err, req, res, next) => {
  // 1. Log the error for debugging
  console.error('Error occurred:', err);
  
  // 2. Check if it's our custom error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message
    });
  }
  
  // 3. If it's an unexpected error, don't expose details
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
};

// Use it as the last middleware in app.js:
app.use(errorHandler);
```

**🎯 Error Handling Practice:**
1. **Create custom error classes** for different scenarios
2. **Add try/catch blocks** to all async functions
3. **Return appropriate status codes** for different errors
4. **Test error scenarios** with invalid data
5. **Never expose sensitive information** in error messages

---

## 🗄️ **PHASE 2: Database Layer (Week 3-4) - The Memory System**

### **🤔 Before We Start: What is a Database?**

**Think of a database like a SUPER ORGANIZED LIBRARY:**
- **Traditional Library** = You need to walk around, search manually, limited copies
- **Digital Database** = Instant search, infinite copies, automatic organization
- **Your CodeCrafter Database** = Storage for users, coding sessions, logs, everything!

**Database vs File Storage:**
- **Files** = Like keeping papers in random folders (messy, slow, can break)
- **Database** = Like having a magical librarian who organizes everything perfectly

**Why MongoDB for Your Project:**
- **Document-based** = Stores data like JSON objects (natural for JavaScript)
- **Flexible** = Can change structure without breaking existing data
- **Scalable** = Handles millions of users and sessions
- **Real-time** = Perfect for collaborative coding features

---

### **📁 PHASE 2 File Structure Overview**

**Here are the EXACT FILES we'll work with in this phase:**

```
📁 Your Project Root/
├── 🔧 config/
│   ├── db.config.js           ← DATABASE CONNECTION SETUP
│   ├── redis.config.js        ← CACHE CONNECTION SETUP  
│   └── rabbitmq.config.js     ← MESSAGE QUEUE SETUP
│
├── 📊 models/
│   ├── user.model.js          ← USER DATA BLUEPRINT
│   ├── session.model.js       ← CODING SESSION BLUEPRINT
│   └── log.model.js           ← ACTIVITY LOG BLUEPRINT
│
├── 🧪 test/ (you'll create these)
│   ├── test-connection.js     ← TEST DATABASE CONNECTION
│   ├── test-user-creation.js  ← TEST USER CREATION
│   ├── test-session-creation.js ← TEST SESSION CREATION
│   └── practice-queries.js    ← PRACTICE DATABASE QUERIES
│
├── 📊 monitoring/ (you'll create these)
│   ├── database.monitor.js    ← DATABASE HEALTH MONITORING
│   └── query.profiler.js      ← SLOW QUERY DETECTION
│
├── 💾 backup/ (you'll create these)
│   └── database.backup.js     ← BACKUP & RECOVERY SYSTEM
│
├── 🌍 .env                    ← ENVIRONMENT VARIABLES
├── 📦 package.json            ← PROJECT DEPENDENCIES
└── 🚀 server.js               ← MAIN SERVER (connects to database)
```

**🔗 File Connection Flow Diagram:**

```
📈 DATABASE FLOW DIAGRAM (How Files Connect):

🚀 server.js
    ↓ imports
🔧 config/db.config.js
    ↓ connects to
🗄️ MongoDB Database
    ↑ used by
📊 models/user.model.js
📊 models/session.model.js  
📊 models/log.model.js
    ↑ used by
🎮 controllers/ (in Phase 3)
    ↑ used by
📂 api/ routes (in Phase 3)
    ↑ used by
🌐 frontend (in Phase 5)

🔄 MONITORING FLOW:
📊 monitoring/database.monitor.js → watches → 🗄️ MongoDB
📊 monitoring/query.profiler.js → analyzes → 🐌 Slow Queries

💾 BACKUP FLOW:
💾 backup/database.backup.js → creates → 📦 Backup Files
```

---

### **Step 4: Database Configuration (config/db.config.js) - THE FOUNDATION**

#### **📖 What Does config/db.config.js Do? (Explained Like You're 5)**

**📁 FILE LOCATION: `config/db.config.js`**

**Think of config/db.config.js as the PHONE NUMBER to your storage warehouse:**
- When your app needs to save data → calls the warehouse
- When your app needs to find data → calls the warehouse  
- config/db.config.js = the phone number and connection instructions

**🔗 This File Connects To:**
- ⬅️ **IMPORTED BY**: `server.js` (to start database connection)
- ➡️ **USES**: Environment variables from `.env` file
- ➡️ **CONNECTS TO**: MongoDB database (local or cloud)
- ➡️ **ENABLES**: All model files (`models/*.js`) to work

**📋 Step-by-Step: Create config/db.config.js**

```javascript
// 📁 FILE: config/db.config.js
// 🎯 PURPOSE: Connect your app to MongoDB database
// 🔗 IMPORTED BY: server.js
// 🔗 USES: .env environment variables

// 1. IMPORTING MONGODB DRIVER (Like getting the phone to call warehouse)
const mongoose = require('mongoose');
// ↳ What is 'mongoose'? It's like a translator between JavaScript and MongoDB
// ↳ MongoDB speaks "BSON" (binary JSON), JavaScript speaks "JSON"
// ↳ Mongoose translates between them automatically
// ↳ Think: "I need a translator to talk to my Chinese warehouse"

// 2. ENVIRONMENT VARIABLES (Like having different warehouse addresses)
// 🔗 THESE COME FROM: .env file in your project root
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || 'codecrafter';
const DB_USER = process.env.DB_USER || '';
const DB_PASS = process.env.DB_PASS || '';

// ↳ What are environment variables? Different settings for different situations
// ↳ Development = Your local computer warehouse
// ↳ Production = Real business warehouse in the cloud
// ↳ Like: Having home address vs work address

// 3. CONNECTION STRING BUILDING (Like writing the complete address)
const buildConnectionString = () => {
  if (DB_USER && DB_PASS) {
    // With authentication (like password-protected warehouse)
    return `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  } else {
    // Without authentication (like open warehouse for development)
    return `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  }
};

// ↳ What does this do? Creates the full address to reach your database
// ↳ Format: mongodb://username:password@address:port/warehouse-name
// ↳ Like: "My warehouse is at 123 Main St, ask for John with password 'secret'"

// 4. CONNECTION OPTIONS (Like delivery instructions)
const connectionOptions = {
  useNewUrlParser: true,        // Use new address format
  useUnifiedTopology: true,     // Use new connection system
  serverSelectionTimeoutMS: 5000,  // Wait 5 seconds to find server
  socketTimeoutMS: 45000,       // Keep connection alive for 45 seconds
  maxPoolSize: 10,              // Maximum 10 phone lines to warehouse
  minPoolSize: 2,               // Always keep 2 phone lines open
  maxIdleTimeMS: 30000,         // Close idle connections after 30 seconds
  bufferMaxEntries: 0,          // Don't store requests if disconnected
  bufferCommands: false,        // Fail immediately if disconnected
};

// ↳ What is connection pooling? Like having multiple phone lines
// ↳ Without pooling: One phone call at a time (SLOW)
// ↳ With pooling: Multiple simultaneous calls (FAST)
// ↳ Think: "I have 10 employees who can all call warehouse at same time"

// 5. MAIN CONNECTION FUNCTION (Like actually making the phone call)
// 🔗 THIS FUNCTION IS CALLED BY: server.js when app starts
const connectDB = async () => {
  try {
    console.log('📞 Calling MongoDB warehouse...');
    
    // Step 1: Build the phone number
    const connectionString = buildConnectionString();
    console.log(`🔗 Warehouse address: ${connectionString.replace(/:.*@/, ':****@')}`);
    // ↳ The .replace() hides the password in logs for security
    
    // Step 2: Make the connection
    const connection = await mongoose.connect(connectionString, connectionOptions);
    
    // Step 3: Confirm connection worked
    console.log(`✅ Warehouse connected successfully!`);
    console.log(`📍 Database: ${connection.connection.name}`);
    console.log(`🏠 Host: ${connection.connection.host}:${connection.connection.port}`);
    
    // Step 4: Set up connection monitoring
    setupConnectionMonitoring();
    
    return connection;
    
  } catch (error) {
    console.error('❌ Failed to connect to warehouse:', error.message);
    
    // If connection fails, explain why:
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Wrong username or password');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('🚫 Warehouse is closed (MongoDB not running)');
    } else if (error.message.includes('timeout')) {
      console.error('⏰ Warehouse took too long to answer');
    }
    
    // Don't crash the app, but don't continue either
    process.exit(1);
  }
};

// 6. CONNECTION MONITORING (Like having a security system)
const setupConnectionMonitoring = () => {
  // When connection is established
  mongoose.connection.on('connected', () => {
    console.log('🟢 Warehouse phone line connected');
  });

  // When connection fails
  mongoose.connection.on('error', (err) => {
    console.error('🔴 Warehouse phone line error:', err);
  });

  // When connection drops
  mongoose.connection.on('disconnected', () => {
    console.log('📴 Warehouse phone line disconnected');
    
    // Try to reconnect automatically
    console.log('🔄 Attempting to reconnect to warehouse...');
  });

  // When app is shutting down
  process.on('SIGINT', async () => {
    console.log('📴 Hanging up warehouse phone...');
    await mongoose.connection.close();
    console.log('✅ Warehouse connection closed cleanly');
    process.exit(0);
  });
};

// 7. HEALTH CHECK FUNCTION (Like asking "Are you still there?")
// 🔗 THIS FUNCTION USED BY: monitoring/database.monitor.js
const checkDBHealth = async () => {
  try {
    // Simple query to test connection
    await mongoose.connection.db.admin().ping();
    return {
      status: 'healthy',
      message: 'Database connection is working',
      timestamp: new Date()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error.message,
      timestamp: new Date()
    };
  }
};

// 8. GRACEFUL DISCONNECT (Like saying goodbye properly)
// 🔗 THIS FUNCTION CALLED BY: server.js when app shuts down
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('👋 Warehouse connection closed gracefully');
  } catch (error) {
    console.error('❌ Error closing warehouse connection:', error);
  }
};

// 9. EXPORT THE FUNCTIONS (Like giving others the phone number)
// 🔗 THESE ARE IMPORTED BY: server.js, monitoring files, test files
module.exports = {
  connectDB,           // Main connection function
  checkDBHealth,       // Health check function
  disconnectDB,        // Graceful shutdown function
  connectionString: buildConnectionString()  // For external tools
};
```

**🔗 HOW config/db.config.js CONNECTS TO OTHER FILES:**

```
📊 DATABASE CONNECTION FLOW DIAGRAM:

1. 🚀 server.js
   ↓ imports connectDB function
2. 🔧 config/db.config.js  
   ↓ reads variables from
3. 🌍 .env file
   ↓ connects to
4. 🗄️ MongoDB Database
   ↓ enables
5. � models/user.model.js
6. 📊 models/session.model.js
7. 📊 models/log.model.js
   ↓ used by
8. 🎮 controllers/ (Phase 3)
   ↓ called by
9. 📂 api/ routes (Phase 3)
   ↓ responds to
10. 🌐 Frontend requests

🔄 MONITORING CONNECTIONS:
📊 monitoring/database.monitor.js → imports checkDBHealth()
📊 monitoring/query.profiler.js → uses mongoose connection
💾 backup/database.backup.js → uses connectionString

📝 TEST CONNECTIONS:
🧪 test/test-connection.js → imports connectDB()
🧪 test/test-user-creation.js → imports connectDB()
🧪 test/practice-queries.js → imports connectDB()
```

**📋 STEP 1: Create Your Environment File**

**📁 FILE: `.env` (in your project root)**
```bash
# 🌍 FILE: .env
# 🎯 PURPOSE: Store sensitive configuration data
# 🔗 USED BY: config/db.config.js
# ⚠️ NEVER COMMIT THIS FILE TO GIT!

# Development Database Settings
NODE_ENV=development
DB_HOST=localhost
DB_PORT=27017
DB_NAME=codecrafter_dev
DB_USER=
DB_PASS=

# Production Database Settings (for later)
# DB_HOST=your-production-host.com
# DB_NAME=codecrafter_prod
# DB_USER=your-username
# DB_PASS=your-secure-password

# Other Configuration
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Redis Configuration (for later phases)
REDIS_URL=redis://localhost:6379

# RabbitMQ Configuration (for later phases)  
RABBITMQ_URL=amqp://localhost
```

**📋 STEP 2: How server.js Uses This File**

**� FILE: `server.js` (connections to database)**
```javascript
// 🔗 FILE: server.js  
// 🎯 PURPOSE: Start the application and connect to database
// 🔗 IMPORTS: config/db.config.js

// Load environment variables FIRST
require('dotenv').config(); // ← Loads .env file

// Import database connection
const { connectDB, disconnectDB } = require('./config/db.config'); // ← Our db config file

// Import app setup
const app = require('./app');

// Server startup sequence
async function startServer() {
  try {
    // Step 1: Connect to database FIRST
    console.log('🔌 Connecting to MongoDB...');
    await connectDB(); // ← This calls our config/db.config.js
    console.log('✅ MongoDB connected successfully');
    
    // Step 2: Start web server
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    
    // Step 3: Handle graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('📴 SIGTERM received. Shutting down gracefully...');
      await disconnectDB(); // ← Graceful database disconnect
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
```

**🎯 Learning Exercise (Baby Steps for Absolute Beginners):**
1. **Install MongoDB on your computer**:
   ```bash
   # On Windows (using Chocolatey):
   choco install mongodb
   
   # Or download from: https://www.mongodb.com/download-center/community
   ```

2. **Start MongoDB service**:
   ```bash
   # On Windows:
   net start MongoDB
   
   # On Mac/Linux:
   sudo systemctl start mongod
   ```

3. **Test your connection**:
   ```javascript
   // Create test-connection.js:
   const { connectDB } = require('./config/db.config');
   
   async function test() {
     await connectDB();
     console.log('🎉 Database connection works!');
     process.exit(0);
   }
   
   test();
   ```

4. **Install MongoDB Compass** (GUI for viewing data):
   - Download from: https://www.mongodb.com/products/compass
   - Connect to: `mongodb://localhost:27017`
   - You'll see your `codecrafter` database appear when you first save data

5. **Practice basic MongoDB operations**:
   ```bash
   # Open MongoDB shell:
   mongo
   
   # List databases:
   show dbs
   
   # Switch to your database:
   use codecrafter
   
   # List collections (tables):
   show collections
   
   # Find all users:
   db.users.find()
   ```

**💡 Key Concepts to Master (Explained Simply):**

**🗄️ What is MongoDB? (Like Digital Filing Cabinet)**
- **Traditional SQL databases** = Like rigid filing cabinet with fixed drawers
- **MongoDB** = Like flexible boxes where you can put any shape of items
- **Documents** = Individual items you store (like a user profile)
- **Collections** = Groups of similar items (like "all users" or "all sessions")

**🔄 What is Mongoose? (Like Personal Assistant)**
- **Raw MongoDB** = Like talking directly to warehouse worker (complicated)
- **Mongoose** = Like having assistant who understands your needs
- **Schema** = Rules your assistant follows (like "user must have email")
- **Model** = Your assistant specialized for specific tasks (UserModel, SessionModel)

**📞 Connection Pooling (Like Having Multiple Phone Lines)**
- **Without pooling**: One request at a time = SLOW
- **With pooling**: Multiple simultaneous requests = FAST
- **Pool size**: How many "phone lines" you have to the database
- **Why important**: 100 users trying to login at once = need 100 phone lines

**🛡️ Environment Variables (Like Having Different Keys)**
- **Development environment** = Your home office (relaxed security)
- **Production environment** = Bank vault (maximum security)
- **Environment variables** = Different keys for different buildings
- **Why needed**: Don't put real passwords in your code!

**⚡ Connection Monitoring (Like Security Cameras)**
- **Why monitor**: Database connections can break
- **Events to watch**: connected, disconnected, error
- **Auto-reconnect**: If phone line drops, redial automatically
- **Graceful shutdown**: Hang up properly when closing business

**🎯 Troubleshooting Common Issues:**

```javascript
// Error: "MongooseServerSelectionError"
// ↳ Problem: Can't find MongoDB server
// ↳ Solution: Make sure MongoDB is running
// ↳ Check: Is MongoDB service started?

// Error: "Authentication failed"  
// ↳ Problem: Wrong username or password
// ↳ Solution: Check DB_USER and DB_PASS environment variables
// ↳ Check: Are credentials correct?

// Error: "Connection timeout"
// ↳ Problem: Database takes too long to respond
// ↳ Solution: Check network connection or increase timeout
// ↳ Check: Is internet working? Is database server running?

// Error: "Too many connections"
// ↳ Problem: Hit connection pool limit
// ↳ Solution: Increase maxPoolSize or fix connection leaks
// ↳ Check: Are you closing connections properly?
```

---

### **Step 5: Understanding Data Models (models/ folder) - THE BLUEPRINTS**

#### **📖 What Are Data Models? (Explained Like Building Houses)**

**Think of data models like ARCHITECTURAL BLUEPRINTS:**
- **Before building a house** → You need blueprints (what rooms, what size, what materials)
- **Before saving data** → You need models (what fields, what types, what rules)
- **Blueprint** = ensures every house follows the same structure
- **Model** = ensures every user/session follows the same structure

**📁 Model Files Overview:**
```
📊 models/
├── user.model.js         ← USER DATA STRUCTURE (people using your app)
├── session.model.js      ← CODING SESSION STRUCTURE (collaborative coding rooms)
└── log.model.js          ← ACTIVITY LOG STRUCTURE (what happened when)
```

**🔗 How Models Connect:**
```
📊 DATA FLOW DIAGRAM:

🔧 config/db.config.js
    ↓ provides connection to
📊 models/user.model.js
    ↓ used by
🎮 controllers/auth.controller.js (Phase 3)
    ↓ called by
📂 api/auth.routes.js (Phase 3)

📊 models/session.model.js  
    ↓ references user.model.js (owner field)
    ↓ used by
🎮 controllers/sessions.controller.js (Phase 3)
    ↓ called by
📂 api/sessions.routes.js (Phase 3)

📊 models/log.model.js
    ↓ references user.model.js AND session.model.js
    ↓ used by
📊 monitoring/database.monitor.js
    ↓ tracks activity across all models
```

---

#### **👤 Step 5.1: User Model (models/user.model.js)**

**📁 FILE: `models/user.model.js`**
**🎯 PURPOSE**: Define how user data is structured and stored
**🔗 USED BY**: controllers/auth.controller.js, api/auth.routes.js
**🔗 REFERENCES**: None (this is a root model)

```javascript
// 📁 FILE: models/user.model.js
// 🎯 PURPOSE: User data blueprint - how users are stored in database
// 🔗 USED BY: auth.controller.js, sessions.controller.js
// 🔗 USES: config/db.config.js connection

// 1. IMPORTING TOOLS (Like getting construction tools)
const mongoose = require('mongoose');
// ↳ mongoose = the tool that helps us create blueprints
const bcrypt = require('bcrypt');
// ↳ bcrypt = tool for making passwords super secure (install: npm install bcrypt)
const { Schema } = mongoose;
// ↳ Schema = the actual blueprint template

// 2. CREATING THE USER BLUEPRINT (Like designing a house)
const userSchema = new Schema({
  // Basic Information (Like house address and owner)
  username: {
    type: String,              // ↳ Must be text (not number)
    required: [true, 'Username is required'],  // ↳ MUST have username (like MUST have address)
    unique: true,              // ↳ No two users can have same username
    trim: true,                // ↳ Remove extra spaces
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  
  email: {
    type: String,              // ↳ Must be text
    required: [true, 'Email is required'],  // ↳ MUST have email
    unique: true,              // ↳ No two users can have same email
    lowercase: true,           // ↳ Convert to lowercase automatically
    trim: true,                // ↳ Remove extra spaces
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']  // ↳ Must look like email
  },
  
  password: {
    type: String,              // ↳ Must be text
    required: [true, 'Password is required'],  // ↳ MUST have password
    minlength: [8, 'Password must be at least 8 characters'],
    // Note: We'll hash this before saving (make it unreadable)
  },
  
  // User Preferences (Like house interior design)
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],  // ↳ Only these 3 options allowed
      default: 'light'           // ↳ If not specified, use 'light'
    },
    editorSettings: {
      fontSize: { type: Number, default: 14 },
      tabSize: { type: Number, default: 2 },
      wordWrap: { type: Boolean, default: true },
      autoSave: { type: Boolean, default: true }
    },
    notifications: {
      email: { type: Boolean, default: true },
      browser: { type: Boolean, default: true },
      collaboratorJoined: { type: Boolean, default: true },
      sessionShared: { type: Boolean, default: true }
    }
  },
  
  // User Role & Permissions (Like house access levels)
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],  // ↳ Only these roles allowed
    default: 'user'            // ↳ New users start as 'user'
  },
  
  // Activity Tracking (Like house history)
  lastLoginAt: {
    type: Date,                // ↳ When they last visited
    default: null
  },
  
  isActive: {
    type: Boolean,             // ↳ Is account active or suspended?
    default: true
  },
  
  emailVerified: {
    type: Boolean,             // ↳ Did they confirm their email?
    default: false
  },
  
  // Automatic Timestamps (Like house built/renovated dates)
  createdAt: {
    type: Date,
    default: Date.now          // ↳ Automatically set when user is created
  },
  
  updatedAt: {
    type: Date,
    default: Date.now          // ↳ Automatically updated when user is modified
  }
}, {
  // Schema options (Like construction rules)
  timestamps: true,            // ↳ Automatically manage createdAt and updatedAt
  versionKey: false,           // ↳ Don't add __v field
  toJSON: { 
    transform: (doc, ret) => {
      delete ret.password;     // ↳ Never send password to frontend
      return ret;
    }
  }
});

// 3. BEFORE SAVING USER (Like final inspection before moving in)
// 🔗 THIS RUNS: Every time a user document is saved
userSchema.pre('save', async function(next) {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) return next();
  
  try {
    console.log('🔒 Securing password...');
    
    // Hash the password (make it unreadable)
    const saltRounds = 12;     // ↳ How secure the hashing is (higher = more secure)
    this.password = await bcrypt.hash(this.password, saltRounds);
    
    console.log('✅ Password secured successfully');
    next();
  } catch (error) {
    console.error('❌ Error securing password:', error);
    next(error);
  }
});

// 4. USER METHODS (Like special house features)
// 🔗 USED BY: controllers/auth.controller.js for login verification
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Check if provided password matches stored password
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('❌ Error comparing passwords:', error);
    return false;
  }
};

// 🔗 USED BY: controllers/auth.controller.js after successful login
userSchema.methods.updateLastLogin = async function() {
  // Update when user last logged in
  this.lastLoginAt = new Date();
  return await this.save();
};

// 🔗 USED BY: All controllers to send safe user data to frontend
userSchema.methods.getPublicProfile = function() {
  // Return safe user info (no sensitive data)
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    role: this.role,
    preferences: this.preferences,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt
  };
};

// 5. STATIC METHODS (Like house factory features)
// 🔗 USED BY: controllers/auth.controller.js for login
userSchema.statics.findByEmail = function(email) {
  // Find user by email address
  return this.findOne({ email: email.toLowerCase() });
};

// 🔗 USED BY: admin controllers for user management
userSchema.statics.findActiveUsers = function() {
  // Find all active users
  return this.find({ isActive: true });
};

// 🔗 USED BY: dashboard/statistics displays
userSchema.statics.getUserStats = async function() {
  // Get statistics about users
  const totalUsers = await this.countDocuments();
  const activeUsers = await this.countDocuments({ isActive: true });
  const verifiedUsers = await this.countDocuments({ emailVerified: true });
  
  return {
    total: totalUsers,
    active: activeUsers,
    verified: verifiedUsers,
    inactive: totalUsers - activeUsers
  };
};

// 6. INDEXES FOR PERFORMANCE (Like house address system)
// 🔗 THESE MAKE: Database queries super fast
userSchema.index({ email: 1 }, { unique: true });      // ↳ Fast email lookups for login
userSchema.index({ username: 1 }, { unique: true });   // ↳ Fast username lookups
userSchema.index({ createdAt: -1 });                   // ↳ Fast "newest users" queries
userSchema.index({ lastLoginAt: -1 });                 // ↳ Fast "recent activity" queries

// 7. CREATE THE MODEL (Like registering the house blueprint)
// 🔗 THIS CREATES: The actual User model that other files import
const User = mongoose.model('User', userSchema);

// 🔗 EXPORTED TO: controllers/auth.controller.js, test files, etc.
module.exports = User;
```

---

#### **🧪 Step 5.2: Testing Your User Model**

**📋 CREATE TEST FILE: `test/test-user-creation.js`**

```javascript
// 📁 FILE: test/test-user-creation.js
// 🎯 PURPOSE: Test that user creation works correctly
// 🔗 IMPORTS: models/user.model.js, config/db.config.js
// 🔗 RUN WITH: node test/test-user-creation.js

const mongoose = require('mongoose');
const User = require('../models/user.model'); // ← Import our User model
const { connectDB } = require('../config/db.config'); // ← Import database connection

async function testUserCreation() {
  try {
    console.log('🧪 Starting User Model Tests...\n');
    
    // Step 1: Connect to database
    console.log('📞 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected\n');
    
    // Step 2: Create a test user
    console.log('👤 Creating test user...');
    const testUserData = {
      username: 'testuser123',
      email: 'test@example.com',
      password: 'securepassword123'  // Will be automatically hashed by our pre-save hook
    };
    
    const newUser = new User(testUserData);
    const savedUser = await newUser.save();
    
    console.log('✅ User created successfully!');
    console.log('📊 User data:', savedUser.getPublicProfile()); // ← Uses our custom method
    console.log('🔒 Password hashed:', savedUser.password !== testUserData.password ? 'YES' : 'NO');
    
    // Step 3: Test password comparison
    console.log('\n🔐 Testing password verification...');
    const isValidPassword = await savedUser.comparePassword('securepassword123'); // ← Uses our custom method
    const isInvalidPassword = await savedUser.comparePassword('wrongpassword');
    
    console.log('✅ Correct password check:', isValidPassword ? 'PASS' : 'FAIL');
    console.log('✅ Wrong password check:', !isInvalidPassword ? 'PASS' : 'FAIL');
    
    // Step 4: Test static methods
    console.log('\n🔍 Testing user lookup methods...');
    const foundUser = await User.findByEmail('test@example.com'); // ← Uses our static method
    console.log('✅ Find by email:', foundUser ? 'FOUND' : 'NOT FOUND');
    
    const userStats = await User.getUserStats(); // ← Uses our static method
    console.log('📈 User statistics:', userStats);
    
    // Step 5: Test last login update
    console.log('\n🕒 Testing last login update...');
    await savedUser.updateLastLogin(); // ← Uses our instance method
    console.log('✅ Last login updated:', savedUser.lastLoginAt);
    
    // Step 6: Clean up (delete test user)
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test user deleted');
    
    console.log('\n🎉 All User Model tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Show specific error types
    if (error.code === 11000) {
      console.error('💡 Duplicate key error - user already exists');
    } else if (error.name === 'ValidationError') {
      console.error('💡 Validation error:', error.errors);
    }
    
  } finally {
    // Always close database connection
    await mongoose.connection.close();
    console.log('📴 Database connection closed');
  }
}

// Run the test
testUserCreation();
```

**📋 HOW TO RUN THE TEST:**

1. **Save the test file** as `test/test-user-creation.js`
2. **Make sure MongoDB is running** on your computer
3. **Run the test**:
   ```bash
   node test/test-user-creation.js
   ```
4. **Expected output**:
   ```
   🧪 Starting User Model Tests...
   📞 Connecting to database...
   ✅ Database connected
   👤 Creating test user...
   ✅ User created successfully!
   📊 User data: { id: '...', username: 'testuser123', ... }
   🔒 Password hashed: YES
   🔐 Testing password verification...
   ✅ Correct password check: PASS
   ✅ Wrong password check: PASS
   🔍 Testing user lookup methods...
   ✅ Find by email: FOUND
   📈 User statistics: { total: 1, active: 1, verified: 0, inactive: 0 }
   🕒 Testing last login update...
   ✅ Last login updated: 2024-01-15T...
   🧹 Cleaning up test data...
   ✅ Test user deleted
   🎉 All User Model tests passed!
   📴 Database connection closed
   ```

**🔧 Troubleshooting Common Issues:**

```javascript
// Error: "MongooseError: Operation users.insertOne() buffering timed out"
// ↳ Problem: Database not connected
// ↳ Solution: Make sure MongoDB is running: net start MongoDB

// Error: "E11000 duplicate key error"
// ↳ Problem: User with same email/username already exists
// ↳ Solution: Delete existing user or use different email

// Error: "ValidationError: Path username is required"
// ↳ Problem: Missing required field
// ↳ Solution: Make sure all required fields are provided

// Error: "bcrypt not found"
// ↳ Problem: bcrypt package not installed
// ↳ Solution: npm install bcrypt
```
```javascript
// Let's break down session.model.js line by line:

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Session schema (like designing a conference room)
const sessionSchema = new Schema({
  // Basic Session Info (Like room details)
  title: {
    type: String,
    required: [true, 'Session title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  
  // Technical Details (Like room equipment)
  language: {
    type: String,
    required: [true, 'Programming language is required'],
    enum: ['javascript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust'],
    default: 'javascript'
  },
  
  content: {
    type: String,              // ↳ The actual code content
    default: '// Start coding here...\n'
  },
  
  // Ownership & Access (Like room permissions)
  owner: {
    type: Schema.Types.ObjectId,  // ↳ Reference to User who created this
    ref: 'User',               // ↳ Links to User model
    required: [true, 'Session must have an owner']
  },
  
  collaborators: [{            // ↳ Array of people who can access
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],  // ↳ What they can do
      default: 'viewer'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {                // ↳ Are they currently in the session?
      type: Boolean,
      default: false
    }
  }],
  
  // Session Settings (Like room configuration)
  isPublic: {
    type: Boolean,             // ↳ Can anyone join?
    default: false
  },
  
  isLocked: {
    type: Boolean,             // ↳ Is session locked from editing?
    default: false
  },
  
  maxCollaborators: {
    type: Number,              // ↳ Maximum people allowed
    default: 10,
    min: 1,
    max: 50
  },
  
  // Session State (Like room status)
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'archived'],
    default: 'active'
  },
  
  // Execution History (Like room activity log)
  executions: [{
    code: String,              // ↳ What code was run
    output: String,            // ↳ What was the result
    error: String,             // ↳ Any errors that occurred
    executedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    executedAt: {
      type: Date,
      default: Date.now
    },
    executionTime: Number,     // ↳ How long it took (milliseconds)
    language: String           // ↳ What language was used
  }],
  
  // Session Metadata (Like room facilities)
  metadata: {
    totalExecutions: {         // ↳ How many times code was run
      type: Number,
      default: 0
    },
    totalEdits: {              // ↳ How many times content was changed
      type: Number,
      default: 0
    },
    averageExecutionTime: {    // ↳ Average time for code execution
      type: Number,
      default: 0
    },
    lastActivity: {            // ↳ When was last activity
      type: Date,
      default: Date.now
    }
  },
  
  // Automatic Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// SESSION METHODS (Like special room features)
sessionSchema.methods.addCollaborator = async function(userId, role = 'viewer') {
  // Check if user is already a collaborator
  const existingCollaborator = this.collaborators.find(
    c => c.userId.toString() === userId.toString()
  );
  
  if (existingCollaborator) {
    throw new Error('User is already a collaborator');
  }
  
  // Check if we're at capacity
  if (this.collaborators.length >= this.maxCollaborators) {
    throw new Error('Session is at maximum capacity');
  }
  
  // Add the collaborator
  this.collaborators.push({
    userId,
    role,
    joinedAt: new Date(),
    isActive: false
  });
  
  return await this.save();
};

sessionSchema.methods.removeCollaborator = async function(userId) {
  this.collaborators = this.collaborators.filter(
    c => c.userId.toString() !== userId.toString()
  );
  return await this.save();
};

sessionSchema.methods.updateActivity = async function() {
  this.metadata.lastActivity = new Date();
  this.metadata.totalEdits += 1;
  return await this.save();
};

sessionSchema.methods.addExecution = async function(executionData) {
  // Add new execution to history
  this.executions.push(executionData);
  
  // Update metadata
  this.metadata.totalExecutions += 1;
  this.metadata.lastActivity = new Date();
  
  // Calculate average execution time
  const totalTime = this.executions.reduce((sum, exec) => sum + (exec.executionTime || 0), 0);
  this.metadata.averageExecutionTime = totalTime / this.executions.length;
  
  return await this.save();
};

// STATIC METHODS (Like session factory features)
sessionSchema.statics.findPublicSessions = function(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ isPublic: true, status: 'active' })
    .populate('owner', 'username')
    .select('title description language createdAt metadata')
    .sort({ 'metadata.lastActivity': -1 })
    .skip(skip)
    .limit(limit);
};

sessionSchema.statics.findUserSessions = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({
    $or: [
      { owner: userId },
      { 'collaborators.userId': userId }
    ]
  })
    .populate('owner', 'username')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);
};

// INDEXES FOR PERFORMANCE
sessionSchema.index({ owner: 1, createdAt: -1 });           // ↳ Fast owner session queries
sessionSchema.index({ 'collaborators.userId': 1 });        // ↳ Fast collaborator queries
sessionSchema.index({ isPublic: 1, status: 1 });           // ↳ Fast public session queries
sessionSchema.index({ language: 1, isPublic: 1 });         // ↳ Fast language filter queries
sessionSchema.index({ 'metadata.lastActivity': -1 });      // ↳ Fast recent activity queries

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
```

---

#### **📊 Step 5.4: Log Model - Activity Tracking System**

**📁 FILE: `models/log.model.js`**
**🎯 PURPOSE: Track all system activities for debugging and monitoring**
**🔗 CONNECTS TO: models/user.model.js, models/session.model.js, controllers/*.js**

```javascript
// 📁 FILE: models/log.model.js
// 🎯 PURPOSE: Define schema for activity logging
// 🔗 IMPORTS: mongoose
// 🔗 USED BY: All controllers, middleware/error.middleware.js, utils/logger.js

const mongoose = require('mongoose');

// 📊 Log Schema - Like a security camera system for your app
const logSchema = new mongoose.Schema({
  // 🏷️ Log Classification
  level: {
    type: String,
    enum: ['info', 'warn', 'error', 'debug', 'security'],
    default: 'info',
    index: true  // ← For filtering logs by severity
  },
  
  // 📝 Log Content
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  
  // 🎯 Action Tracking
  action: {
    type: String,
    required: true,
    enum: [
      'user_login', 'user_logout', 'user_register',
      'session_create', 'session_end', 'session_pause',
      'code_execute', 'file_upload', 'file_download',
      'api_request', 'database_query', 'error_occurred',
      'system_start', 'system_shutdown'
    ],
    index: true
  },
  
  // 🔗 Related Entity References
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,  // ← null for system-level logs
    index: true
  },
  
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    default: null,  // ← null if not session-related
    index: true
  },
  
  // 🌐 Request Information
  requestInfo: {
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      default: null
    },
    url: {
      type: String,
      maxlength: 500
    },
    statusCode: {
      type: Number,
      min: 100,
      max: 599
    },
    responseTime: {
      type: Number,  // ← in milliseconds
      min: 0
    },
    userAgent: {
      type: String,
      maxlength: 500
    },
    ip: {
      type: String,
      maxlength: 45  // ← IPv6 max length
    }
  },
  
  // 📊 Additional Data
  metadata: {
    type: mongoose.Schema.Types.Mixed,  // ← Flexible object for extra data
    default: {}
  },
  
  // 🚨 Error Information (if log is error type)
  error: {
    name: String,
    message: String,
    stack: String,
    code: String
  },
  
  // 🏷️ Categorization
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  
  // 🕒 Timing
  timestamp: {
    type: Date,
    default: Date.now,
    index: true  // ← For time-based queries
  },
  
  // 📍 Source Information
  source: {
    file: String,      // ← Which file generated this log
    function: String,  // ← Which function generated this log
    line: Number       // ← Which line number
  }
  
}, {
  timestamps: false,  // ← We use custom timestamp field
  
  // 📊 Additional Options
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 🔧 VIRTUAL FIELDS - Computed properties

// 📅 Formatted timestamp
logSchema.virtual('formattedTime').get(function() {
  return {
    iso: this.timestamp.toISOString(),
    readable: this.timestamp.toLocaleString(),
    relative: this.getTimeAgo()
  };
});

// 🎯 Log severity level as number
logSchema.virtual('severityLevel').get(function() {
  const levels = {
    'debug': 1,
    'info': 2,
    'warn': 3,
    'error': 4,
    'security': 5
  };
  return levels[this.level] || 0;
});

// 📊 Log summary
logSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    level: this.level,
    action: this.action,
    message: this.message.substring(0, 100) + (this.message.length > 100 ? '...' : ''),
    timestamp: this.formattedTime.readable,
    userId: this.userId,
    sessionId: this.sessionId
  };
});

// 🔧 INSTANCE METHODS

// 🕒 Get relative time (e.g., "2 hours ago")
logSchema.methods.getTimeAgo = function() {
  const now = new Date();
  const diffMs = now - this.timestamp;
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return `${diffSeconds} second${diffSeconds > 1 ? 's' : ''} ago`;
};

// 🏷️ Add tags to log
logSchema.methods.addTags = function(newTags) {
  if (Array.isArray(newTags)) {
    this.tags = [...new Set([...this.tags, ...newTags])];  // ← Remove duplicates
  } else {
    this.tags.push(newTags);
  }
  return this.save();
};

// 📝 Update metadata
logSchema.methods.addMetadata = function(key, value) {
  if (!this.metadata) this.metadata = {};
  this.metadata[key] = value;
  this.markModified('metadata');  // ← Tell mongoose metadata changed
  return this.save();
};

// 🔧 STATIC METHODS - Functions for querying logs

// 📊 Get logs by level
logSchema.statics.findByLevel = function(level) {
  return this.find({ level })
    .populate('userId', 'username email')
    .populate('sessionId', 'sessionId language')
    .sort({ timestamp: -1 });
};

// 👤 Get user activity logs
logSchema.statics.findByUser = function(userId, limit = 50) {
  return this.find({ userId })
    .populate('sessionId', 'sessionId language status')
    .sort({ timestamp: -1 })
    .limit(limit);
};

// 📅 Get logs by date range
logSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ timestamp: -1 });
};

// 🚨 Get error logs only
logSchema.statics.getErrorLogs = function(limit = 100) {
  return this.find({ level: 'error' })
    .populate('userId', 'username')
    .sort({ timestamp: -1 })
    .limit(limit);
};

// 🔍 Search logs by message
logSchema.statics.searchLogs = function(searchTerm, limit = 50) {
  return this.find({
    $or: [
      { message: { $regex: searchTerm, $options: 'i' } },
      { action: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  })
  .populate('userId', 'username')
  .sort({ timestamp: -1 })
  .limit(limit);
};

// 📈 Get activity statistics
logSchema.statics.getActivityStats = function(hours = 24) {
  const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  return this.aggregate([
    { $match: { timestamp: { $gte: startTime } } },
    {
      $group: {
        _id: {
          level: '$level',
          action: '$action'
        },
        count: { $sum: 1 },
        latestTime: { $max: '$timestamp' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// 🏆 Get top active users
logSchema.statics.getTopActiveUsers = function(limit = 10) {
  return this.aggregate([
    { $match: { userId: { $ne: null } } },
    {
      $group: {
        _id: '$userId',
        activityCount: { $sum: 1 },
        lastActivity: { $max: '$timestamp' },
        actions: { $addToSet: '$action' }
      }
    },
    { $sort: { activityCount: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' }
  ]);
};

// 🧹 Clean up old logs (keep only recent ones)
logSchema.statics.cleanupOldLogs = function(daysToKeep = 30) {
  const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
  
  return this.deleteMany({
    timestamp: { $lt: cutoffDate },
    level: { $nin: ['error', 'security'] }  // ← Keep error and security logs longer
  });
};

// 🚨 Log helper methods for easy logging
logSchema.statics.logInfo = function(message, userId = null, metadata = {}) {
  return this.create({
    level: 'info',
    message,
    action: 'api_request',
    userId,
    metadata
  });
};

logSchema.statics.logError = function(error, userId = null, requestInfo = {}) {
  return this.create({
    level: 'error',
    message: error.message,
    action: 'error_occurred',
    userId,
    requestInfo,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    }
  });
};

logSchema.statics.logUserAction = function(action, userId, message, metadata = {}) {
  return this.create({
    level: 'info',
    message,
    action,
    userId,
    metadata
  });
};

// 🏷️ MIDDLEWARE

// 📝 Pre-save validation
logSchema.pre('save', function(next) {
  // 🔍 Ensure message is not empty
  if (!this.message || this.message.trim().length === 0) {
    return next(new Error('Log message cannot be empty'));
  }
  
  // 🕒 Set timestamp if not provided
  if (!this.timestamp) {
    this.timestamp = new Date();
  }
  
  next();
});

// 🔍 INDEXES for fast queries
logSchema.index({ level: 1, timestamp: -1 });           // ← Level + time queries
logSchema.index({ userId: 1, timestamp: -1 });          // ← User activity tracking
logSchema.index({ action: 1, timestamp: -1 });          // ← Action-based filtering
logSchema.index({ timestamp: -1 });                     // ← Recent logs first
logSchema.index({ 'requestInfo.statusCode': 1 });       // ← HTTP status filtering
logSchema.index({ tags: 1 });                           // ← Tag-based searching

// 📤 Export the model
module.exports = mongoose.model('Log', logSchema);
```

**🔗 Log Model Connection Flow:**

```
📊 System Activity
    ↓
📁 utils/logger.js (helper functions)
    ↓ creates log entries
    ↓
📁 models/log.model.js (stores logs)
    ↓ connects to
    ↓
📁 controllers/*.js (read logs for admin)
    ↓ serves logs via
    ↓
📁 api/admin.routes.js (log endpoints)
    ↓ accessible through
    ↓
🌐 Admin dashboard (view system health)
```

**📋 Log Model Usage Examples:**

```javascript
// 📁 In controllers/auth.controller.js

const Log = require('../models/log.model');

// Log successful login
await Log.logUserAction(
  'user_login', 
  user._id, 
  `User ${user.username} logged in successfully`,
  { ip: req.ip, userAgent: req.get('User-Agent') }
);

// Log error
await Log.logError(error, req.user?.id, {
  method: req.method,
  url: req.originalUrl,
  statusCode: 500
});

// Get user activity
const userLogs = await Log.findByUser(userId, 20);

// Get error summary
const errors = await Log.getErrorLogs(10);
```

**🧪 Testing Log Model:**

```javascript
// 📁 FILE: test/test-log-model.js

const Log = require('../models/log.model');

// Test creating different log types
const infoLog = await Log.logInfo('System started', null, { version: '1.0.0' });
const errorLog = await Log.logError(new Error('Test error'), userId);

// Test querying logs
const recentLogs = await Log.findByLevel('error');
const userActivity = await Log.findByUser(userId);
const stats = await Log.getActivityStats(24);

console.log('Log tests completed!');
```
  level: {
    type: String,
    enum: ['info', 'warn', 'error', 'debug', 'security'],
    required: [true, 'Log level is required'],
    default: 'info'
  },
  
  // Event Details (Like what happened)
  event: {
    type: String,              // ↳ Type of event: 'user_login', 'session_created', etc.
    required: [true, 'Event type is required']
  },
  
  message: {
    type: String,              // ↳ Human-readable description
    required: [true, 'Log message is required']
  },
  
  // Who & Where (Like event context)
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null              // ↳ null for system events
  },
  
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'Session',
    default: null              // ↳ null if not session-related
  },
  
  // Technical Details (Like forensic data)
  metadata: {
    ip: String,                // ↳ User's IP address
    userAgent: String,         // ↳ Browser/device info
    action: String,            // ↳ Specific action taken
    resource: String,          // ↳ What was affected
    statusCode: Number,        // ↳ HTTP status code
    responseTime: Number,      // ↳ How long operation took
    errorStack: String,        // ↳ Full error details (for errors)
    additionalData: Schema.Types.Mixed  // ↳ Any extra relevant data
  },
  
  // Automatic Timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 2592000           // ↳ Auto-delete after 30 days (TTL index)
  }
}, {
  timestamps: false,           // ↳ We use custom timestamp field
  versionKey: false
});

// LOG METHODS
logSchema.statics.logEvent = async function(eventData) {
  // Helper method to create logs easily
  const log = new this(eventData);
  return await log.save();
};

logSchema.statics.getUserActivity = function(userId, startDate, endDate) {
  const query = { userId };
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = startDate;
    if (endDate) query.timestamp.$lte = endDate;
  }
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .populate('sessionId', 'title');
};

sessionSchema.statics.getErrorLogs = function(limit = 100) {
  return this.find({ level: 'error' })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'username');
};

// INDEXES FOR PERFORMANCE  
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // ↳ TTL index for auto-cleanup
logSchema.index({ userId: 1, timestamp: -1 });                     // ↳ Fast user activity queries
logSchema.index({ sessionId: 1, timestamp: -1 });                  // ↳ Fast session activity queries
logSchema.index({ level: 1, timestamp: -1 });                      // ↳ Fast error log queries
logSchema.index({ event: 1, timestamp: -1 });                      // ↳ Fast event type queries

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
```

**🔗 HOW MODELS CONNECT TO EACH OTHER:**

```
DATA RELATIONSHIP FLOW (Like Family Tree):

👤 USER (Parent)
├── 📊 owns multiple SESSIONS (Children)
│   ├── Session 1: "My JavaScript Project"
│   ├── Session 2: "Python Learning"
│   └── Session 3: "Team Collaboration"
│
├── 👥 collaborates on other SESSIONS (Step-children)
│   ├── Friend's Session: "React Tutorial"
│   └── Work Session: "Backend API"
│
└── 📝 generates multiple LOGS (Activity Records)
    ├── Log 1: "User logged in"
    ├── Log 2: "Created new session"
    ├── Log 3: "Executed Python code"
    └── Log 4: "Joined collaboration"

🔗 MONGODB REFERENCES (Like ID Cards):
- User._id → Session.owner (ownership link)
- User._id → Session.collaborators.userId (collaboration link)  
- User._id → Log.userId (activity link)
- Session._id → Log.sessionId (session activity link)
```

**🎯 Learning Exercises (Hands-On Practice):**

**Exercise 1: Create Your First User**
```javascript
// test-user-creation.js
const mongoose = require('mongoose');
const User = require('./models/user.model');
const { connectDB } = require('./config/db.config');

async function createTestUser() {
  try {
    // Connect to database
    await connectDB();
    
    // Create a new user
    const newUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'securepassword123'  // Will be automatically hashed
    });
    
    // Save to database
    const savedUser = await newUser.save();
    console.log('✅ User created:', savedUser.getPublicProfile());
    
    // Test password comparison
    const isValidPassword = await savedUser.comparePassword('securepassword123');
    console.log('🔒 Password check:', isValidPassword ? 'PASS' : 'FAIL');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createTestUser();
```

**Exercise 2: Create a Coding Session**
```javascript
// test-session-creation.js
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Session = require('./models/session.model');
const { connectDB } = require('./config/db.config');

async function createTestSession() {
  try {
    await connectDB();
    
    // Find a user (or create one)
    let user = await User.findOne({ username: 'testuser' });
    if (!user) {
      user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'securepassword123'
      });
      await user.save();
    }
    
    // Create a session
    const newSession = new Session({
      title: 'My First JavaScript Session',
      description: 'Learning JavaScript basics',
      language: 'javascript',
      content: 'console.log("Hello, World!");',
      owner: user._id
    });
    
    const savedSession = await newSession.save();
    console.log('✅ Session created:', savedSession.title);
    
    // Add a collaborator
    await savedSession.addCollaborator(user._id, 'editor');
    console.log('👥 Collaborator added');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createTestSession();
```

**Exercise 3: Log Activities**
```javascript
// test-logging.js
const mongoose = require('mongoose');
const Log = require('./models/log.model');
const { connectDB } = require('./config/db.config');

async function createTestLogs() {
  try {
    await connectDB();
    
    // Log different types of activities
    await Log.logEvent({
      level: 'info',
      event: 'user_login',
      message: 'User successfully logged in',
      metadata: {
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0...'
      }
    });
    
    await Log.logEvent({
      level: 'error',
      event: 'code_execution_failed',
      message: 'Python code execution failed with syntax error',
      metadata: {
        errorStack: 'SyntaxError: invalid syntax',
        code: 'print("Hello World"'
      }
    });
    
    console.log('✅ Logs created successfully');
    
    // Query recent logs
    const recentLogs = await Log.find()
      .sort({ timestamp: -1 })
      .limit(5);
    
    console.log('📝 Recent logs:', recentLogs.length);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createTestLogs();
```

---

### **Step 6: Database Queries & Operations - THE LANGUAGE**

#### **📖 Understanding MongoDB Queries (Like Learning a New Language)**

**Think of database queries like ASKING QUESTIONS in different ways:**
- **English**: "Find all users who signed up last week"
- **MongoDB**: `db.users.find({ createdAt: { $gte: lastWeek } })`
- **Mongoose**: `User.find({ createdAt: { $gte: lastWeek } })`

**Basic Query Operations (Like Basic Conversations):**
```javascript
// CRUD Operations (Create, Read, Update, Delete) - The Basics:

// 1. CREATE (Like adding new contact to phone book)
const createUser = async (userData) => {
  try {
    // Method 1: Using constructor + save
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    
    // Method 2: Using create (shorthand)
    const savedUser2 = await User.create(userData);
    
    console.log('✅ User created:', savedUser.username);
    return savedUser;
    
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (email or username already exists)
      throw new Error('Email or username already exists');
    }
    throw error;
  }
};

// 2. READ/FIND (Like looking up contacts)
const findUsers = async () => {
  // Find all users
  const allUsers = await User.find();                    // Gets everyone
  
  // Find specific user
  const specificUser = await User.findById(userId);      // Find by ID
  const userByEmail = await User.findOne({ email });     // Find by email
  
  // Find with conditions
  const activeUsers = await User.find({ isActive: true }); // Only active users
  const recentUsers = await User.find({
    createdAt: { $gte: new Date('2024-01-01') }          // Users since Jan 1, 2024
  });
  
  // Find with pagination
  const page = 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const paginatedUsers = await User.find()
    .skip(skip)                                          // Skip first 10 users
    .limit(limit)                                        // Take next 10 users
    .sort({ createdAt: -1 });                           // Newest first
  
  // Find with specific fields only
  const usernamesOnly = await User.find()
    .select('username email')                            // Only get username and email
    .select('-password');                                // Exclude password field
  
  return { allUsers, specificUser, activeUsers, recentUsers };
};

// 3. UPDATE (Like editing contact info)
const updateUser = async (userId, updateData) => {
  try {
    // Method 1: findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { 
        new: true,                                       // Return updated document
        runValidators: true                              // Run schema validations
      }
    );
    
    // Method 2: Find then save (for complex updates)
    const user = await User.findById(userId);
    user.preferences.theme = 'dark';
    user.lastLoginAt = new Date();
    await user.save();
    
    // Method 3: updateMany (update multiple documents)
    await User.updateMany(
      { isActive: false },                               // Find inactive users
      { $set: { status: 'archived' } }                  // Set status to archived
    );
    
    console.log('✅ User updated:', updatedUser.username);
    return updatedUser;
    
  } catch (error) {
    throw error;
  }
};

// 4. DELETE (Like removing contact)
const deleteUser = async (userId) => {
  try {
    // Method 1: findByIdAndDelete
    const deletedUser = await User.findByIdAndDelete(userId);
    
    // Method 2: deleteOne
    await User.deleteOne({ _id: userId });
    
    // Method 3: deleteMany (delete multiple)
    await User.deleteMany({ isActive: false });         // Delete all inactive users
    
    console.log('✅ User deleted:', deletedUser?.username || 'User not found');
    return deletedUser;
    
  } catch (error) {
    throw error;
  }
};
```

**Advanced Query Patterns (Like Advanced Conversations):**
```javascript
// COMPLEX QUERIES (Like detailed questions)

// 1. AGGREGATION (Like asking for statistics)
const getUserStatistics = async () => {
  const stats = await User.aggregate([
    // Stage 1: Match active users only
    { $match: { isActive: true } },
    
    // Stage 2: Group by role and count
    {
      $group: {
        _id: '$role',                                    // Group by role field
        count: { $sum: 1 },                            // Count documents in each group
        avgAge: { $avg: '$age' },                      // Average age per role
        emails: { $push: '$email' }                    // Collect all emails
      }
    },
    
    // Stage 3: Sort by count
    { $sort: { count: -1 } }
  ]);
  
  return stats;
  // Result: [
  //   { _id: 'user', count: 150, avgAge: 25.5, emails: [...] },
  //   { _id: 'admin', count: 5, avgAge: 35.2, emails: [...] }
  // ]
};

// 2. POPULATION (Like joining related data)
const getSessionsWithOwnerInfo = async () => {
  const sessions = await Session.find()
    .populate('owner', 'username email')               // Include owner details
    .populate('collaborators.userId', 'username')      // Include collaborator details
    .exec();
  
  return sessions;
  // Result: Sessions with full user objects instead of just IDs
};

// 3. COMPLEX FILTERING (Like detailed search)
const searchSessions = async (searchParams) => {
  const { keyword, language, isPublic, dateRange } = searchParams;
  
  // Build dynamic query
  const query = {};
  
  // Text search in title and description
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },   // Case-insensitive search
      { description: { $regex: keyword, $options: 'i' } }
    ];
  }
  
  // Filter by language
  if (language) {
    query.language = language;
  }
  
  // Filter by public/private
  if (typeof isPublic === 'boolean') {
    query.isPublic = isPublic;
  }
  
  // Filter by date range
  if (dateRange) {
    query.createdAt = {};
    if (dateRange.start) query.createdAt.$gte = new Date(dateRange.start);
    if (dateRange.end) query.createdAt.$lte = new Date(dateRange.end);
  }
  
  const sessions = await Session.find(query)
    .populate('owner', 'username')
    .sort({ 'metadata.lastActivity': -1 })
    .limit(20);
  
  return sessions;
};

// 4. TRANSACTION OPERATIONS (Like bank transactions - all or nothing)
const transferSessionOwnership = async (sessionId, currentOwnerId, newOwnerId) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Step 1: Verify current owner
      const sessionDoc = await Session.findById(sessionId).session(session);
      if (sessionDoc.owner.toString() !== currentOwnerId) {
        throw new Error('Not authorized to transfer this session');
      }
      
      // Step 2: Update session owner
      await Session.findByIdAndUpdate(
        sessionId,
        { owner: newOwnerId },
        { session }
      );
      
      // Step 3: Log the transfer
      await Log.create([{
        level: 'info',
        event: 'session_ownership_transferred',
        message: `Session ownership transferred from ${currentOwnerId} to ${newOwnerId}`,
        sessionId: sessionId,
        metadata: {
          previousOwner: currentOwnerId,
          newOwner: newOwnerId
        }
      }], { session });
      
      console.log('✅ Session ownership transferred successfully');
    });
  } catch (error) {
    console.error('❌ Transfer failed:', error.message);
    throw error;
  } finally {
    await session.endSession();
  }
};
```

**Query Performance Optimization (Like Making Conversations Faster):**
```javascript
// PERFORMANCE BEST PRACTICES:

// 1. USE INDEXES (Like having a phone book organized alphabetically)
// Already defined in our schemas, but here's how they help:

// Bad: Scan all users to find by email (SLOW)
const userSlow = await User.find({ email: 'john@example.com' });

// Good: Use email index to find instantly (FAST)
// This automatically uses the index we created: userSchema.index({ email: 1 })

// 2. LIMIT RESULTS (Like asking for "first 10" instead of "all")
// Bad: Get all sessions (could be millions)
const allSessions = await Session.find();

// Good: Get only what you need
const sessions = await Session.find()
  .limit(20)                                             // Only 20 results
  .select('title language createdAt')                    // Only specific fields
  .lean();                                               // Return plain objects (faster)

// 3. USE EXPLAIN TO UNDERSTAND QUERIES
const explanation = await User.find({ email: 'john@example.com' }).explain('executionStats');
console.log('Query explanation:', explanation);
// This shows you:
// - Did it use an index?
// - How many documents were scanned?
// - How long did it take?

// 4. BATCH OPERATIONS (Like processing multiple requests together)
// Bad: Insert one user at a time
for (const userData of userList) {
  await User.create(userData);                           // Multiple database calls
}

// Good: Insert all users at once
await User.insertMany(userList);                        // Single database call

// 5. PROJECTION (Like asking for specific info only)
// Bad: Get full user objects when you only need names
const users = await User.find();
const usernames = users.map(u => u.username);

// Good: Get only usernames from database
const usernames = await User.find()
  .select('username')                                    // Only username field
  .lean();                                               // Plain objects
```

---

## �️ **PHASE 3: API Routes & Controllers (Week 5-6) - The Nervous System**

#### **🚦 Route Structure Explained:**
```javascript
// Routes are like TRAFFIC DIRECTORS
// They decide which controller handles which request

// api/auth.routes.js - Authentication routes:
POST /api/auth/register  → Register new user
POST /api/auth/login     → User login
POST /api/auth/refresh   → Refresh JWT token
GET  /api/auth/profile   → Get user profile
PUT  /api/auth/profile   → Update user profile

// api/sessions.routes.js - Session management:
GET    /api/sessions          → Get user's sessions
POST   /api/sessions          → Create new session
GET    /api/sessions/:id      → Get specific session
PUT    /api/sessions/:id      → Update session
DELETE /api/sessions/:id      → Delete session
POST   /api/sessions/:id/join → Join a session

// api/execute.routes.js - Code execution:
POST /api/execute                  → Execute code
GET  /api/execute/history/:sessionId → Get execution history
GET  /api/execute/languages        → Get supported languages
GET  /api/execute/status/:jobId     → Check execution status
```

**🎯 Learning Tasks:**
1. **Test each route** with Postman/Thunder Client
2. **Understand HTTP methods** (GET, POST, PUT, DELETE)
3. **Learn about route parameters** (:id, :sessionId)
4. **Practice with middleware** (authentication, validation)

### **Step 11: API Documentation & Versioning**

#### **📚 Documenting Your APIs (Like Creating a Menu for Your Restaurant):**

**Think of API documentation like a restaurant menu:**
- **Clear descriptions** of what each dish (endpoint) does
- **Ingredients list** (required parameters)
- **Pricing** (rate limits)
- **Dietary restrictions** (authentication requirements)

**Setting Up Swagger/OpenAPI Documentation:**
```javascript
// Install swagger dependencies:
npm install swagger-jsdoc swagger-ui-express

// swagger.config.js - Swagger setup:
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeCrafter API',
      version: '1.0.0',
      description: 'Real-time collaborative coding platform API',
      contact: {
        name: 'API Support',
        email: 'support@codecrafter.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.codecrafter.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./api/*.js', './controllers/*.js'], // Paths to files with API docs
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };

// In app.js - Add swagger UI:
const { specs, swaggerUi } = require('./swagger.config');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

**Documenting API Endpoints with Comments:**
```javascript
// api/auth.routes.js - Documented routes:

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: StrongPass123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Get user's coding sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of sessions per page
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [javascript, python, java, cpp]
 *         description: Filter by programming language
 *     responses:
 *       200:
 *         description: List of user sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Session'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', authMiddleware, sessionController.getUserSessions);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           example: john@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-15T10:30:00Z
 *     
 *     Session:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         title:
 *           type: string
 *           example: My JavaScript Project
 *         language:
 *           type: string
 *           example: javascript
 *         content:
 *           type: string
 *           example: console.log('Hello World');
 *         collaborators:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               permissions:
 *                 type: string
 *                 enum: [read, write, admin]
 *         isPublic:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *     
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: ValidationError
 *         message:
 *           type: string
 *           example: Email is required
 *     
 *     Pagination:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *           example: 1
 *         totalPages:
 *           type: integer
 *           example: 5
 *         totalItems:
 *           type: integer
 *           example: 47
 *         hasNext:
 *           type: boolean
 *           example: true
 *         hasPrev:
 *           type: boolean
 *           example: false
 */
```

**API Versioning Strategies:**
```javascript
// Strategy 1: URL Versioning (most common)
app.use('/api/v1/auth', authRoutesV1);
app.use('/api/v2/auth', authRoutesV2);

// Strategy 2: Header Versioning
app.use('/api/auth', (req, res, next) => {
  const version = req.headers['api-version'] || 'v1';
  if (version === 'v2') {
    // Use v2 logic
  } else {
    // Use v1 logic (default)
  }
  next();
});

// Strategy 3: Query Parameter Versioning
app.use('/api/auth', (req, res, next) => {
  const version = req.query.version || 'v1';
  req.apiVersion = version;
  next();
});

// Deprecation warnings:
const deprecationMiddleware = (req, res, next) => {
  if (req.originalUrl.includes('/api/v1/')) {
    res.set('Warning', '299 - "API v1 is deprecated. Please migrate to v2"');
    res.set('Sunset', 'Sat, 31 Dec 2024 23:59:59 GMT'); // When v1 will be removed
  }
  next();
};
```

**🎯 Documentation Learning Tasks:**
1. **Set up Swagger UI** for your API
2. **Document all endpoints** with proper schemas
3. **Add request/response examples** for each endpoint
4. **Implement API versioning** strategy
5. **Create Postman collection** from your documentation
6. **Set up automated docs** generation in CI/CD

---

### **Step 12: Advanced Controller Patterns**

#### **🎮 Controllers Are The Brain of Each Operation:**

**controllers/auth.controller.js:**
```javascript
// Authentication controller handles:
register() {
  // 1. Validate user input
  // 2. Check if user already exists
  // 3. Hash password with bcrypt
  // 4. Save user to database
  // 5. Generate JWT token
  // 6. Send response
}

login() {
  // 1. Find user by email/username
  // 2. Compare password with hashed version
  // 3. Generate JWT token
  // 4. Update last login time
  // 5. Send token to user
}
```

**controllers/sessions.controller.js:**
```javascript
// Session controller handles:
createSession() {
  // 1. Validate session data
  // 2. Check user permissions
  // 3. Create session in database
  // 4. Set up initial collaborators
  // 5. Return session details
}

joinSession() {
  // 1. Check if session exists
  // 2. Verify user has permission to join
  // 3. Add user to collaborators
  // 4. Update session metadata
  // 5. Notify other users via WebSocket
}
```

**🎯 Learning Tasks:**
1. **Trace each controller method** step by step
2. **Understand error handling** (try/catch blocks)
3. **Learn about HTTP status codes** (200, 400, 401, 404, 500)
4. **Practice input validation** and sanitization

---

## 🔧 **PHASE 4: Services Layer (Week 7-8) - The Organs**

### **Step 8: Business Services (services/ folder)**

#### **⚙️ Services Contain Your Core Business Logic:**

**services/session.service.js:**
```javascript
// Session service handles complex session operations:
class SessionService {
  async createSession(userId, title, language) {
    // Complex business logic for creating sessions
    // - Validate user exists
    // - Set up default permissions
    // - Initialize session state
    // - Create collaboration workspace
  }
  
  async addCollaborator(sessionId, userId, permissions) {
    // Add someone to collaborate on a session
    // - Check if user already exists
    // - Validate permission levels
    // - Update session collaborators
    // - Send notifications
  }
}
```

**services/jwt.service.js:**
```javascript
// JWT service handles token operations:
class JWTService {
  generateAccessToken(user) {
    // Create short-lived access token (15 minutes)
  }
  
  generateRefreshToken(user) {
    // Create long-lived refresh token (7 days)
  }
  
  verifyToken(token) {
    // Validate and decode JWT token
  }
}
```

**🎯 Learning Tasks:**
1. **Understand the service pattern** (separation of concerns)
2. **Learn JWT concepts** (access tokens vs refresh tokens)
3. **Practice service composition** (services calling other services)

### **Step 13: Service Design Patterns**

#### **🏗️ Repository Pattern (Like Organized Storage System):**

**Think of Repository Pattern like having organized storage rooms:**
- **UserRepository** = Room for all user-related storage operations
- **SessionRepository** = Room for all session-related storage operations
- **Clean separation** between business logic and data access

```javascript
// repositories/user.repository.js - Data access layer:
class UserRepository {
  async findById(id) {
    return await User.findById(id).select('-password');
  }
  
  async findByEmail(email) {
    return await User.findOne({ email });
  }
  
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }
  
  async update(id, updateData) {
    return await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
  }
  
  async findUsersWithPagination(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;
    const users = await User.find(filters)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(filters);
    
    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }
}

module.exports = new UserRepository();

// services/user.service.js - Business logic layer:
const UserRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');

class UserService {
  async createUser(userData) {
    // 1. Validate business rules
    if (await this.emailExists(userData.email)) {
      throw new ConflictError('Email already exists');
    }
    
    // 2. Apply business logic
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userToCreate = {
      ...userData,
      password: hashedPassword,
      role: userData.role || 'user'
    };
    
    // 3. Delegate to repository
    return await UserRepository.create(userToCreate);
  }
  
  async getUserProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Add computed fields
    user.memberSince = this.calculateMembershipDuration(user.createdAt);
    
    return user;
  }
  
  async emailExists(email) {
    const user = await UserRepository.findByEmail(email);
    return !!user;
  }
  
  calculateMembershipDuration(createdAt) {
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  }
}

module.exports = new UserService();
```

#### **🏭 Factory Pattern (Like Different Assembly Lines):**

```javascript
// factories/service.factory.js - Creates different service instances:
class ServiceFactory {
  static createExecutionService(language) {
    switch (language.toLowerCase()) {
      case 'javascript':
        return new JavaScriptExecutionService();
      case 'python':
        return new PythonExecutionService();
      case 'java':
        return new JavaExecutionService();
      case 'cpp':
        return new CppExecutionService();
      default:
        throw new UnsupportedLanguageError(`Language ${language} not supported`);
    }
  }
  
  static createNotificationService(type) {
    switch (type) {
      case 'email':
        return new EmailNotificationService();
      case 'websocket':
        return new WebSocketNotificationService();
      case 'push':
        return new PushNotificationService();
      default:
        throw new Error(`Notification type ${type} not supported`);
    }
  }
}

// services/execution/base.execution.service.js - Base class:
class BaseExecutionService {
  async executeCode(code, input = '') {
    try {
      // Template method pattern
      const preparedCode = await this.prepareCode(code);
      const container = await this.createContainer();
      const result = await this.runInContainer(container, preparedCode, input);
      await this.cleanupContainer(container);
      return result;
    } catch (error) {
      await this.handleExecutionError(error);
      throw error;
    }
  }
  
  // Abstract methods - must be implemented by subclasses
  async prepareCode(code) {
    throw new Error('prepareCode must be implemented');
  }
  
  async createContainer() {
    throw new Error('createContainer must be implemented');
  }
  
  async runInContainer(container, code, input) {
    throw new Error('runInContainer must be implemented');
  }
}

// services/execution/javascript.execution.service.js - Specific implementation:
class JavaScriptExecutionService extends BaseExecutionService {
  async prepareCode(code) {
    // Add Node.js specific preparations
    return `
      try {
        ${code}
      } catch (error) {
        console.error('Runtime Error:', error.message);
        process.exit(1);
      }
    `;
  }
  
  async createContainer() {
    return await Docker.createContainer({
      Image: 'node:18-alpine',
      WorkingDir: '/app',
      Memory: 128 * 1024 * 1024, // 128MB
      CpuShares: 512,
      NetworkMode: 'none' // No network access
    });
  }
  
  async runInContainer(container, code, input) {
    // Write code to temporary file and execute with node
    const result = await container.exec({
      Cmd: ['node', '-e', code],
      AttachStdout: true,
      AttachStderr: true
    });
    
    return await this.parseExecutionResult(result);
  }
}
```

#### **💉 Dependency Injection (Like Supplying Tools to Workers):**

```javascript
// services/container.js - Dependency injection container:
class DIContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }
  
  register(name, factory, options = {}) {
    this.services.set(name, { factory, options });
  }
  
  get(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not registered`);
    }
    
    // Check if singleton
    if (service.options.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory(this));
      }
      return this.singletons.get(name);
    }
    
    // Create new instance
    return service.factory(this);
  }
}

// Setup dependencies:
const container = new DIContainer();

// Register repositories
container.register('userRepository', () => require('./repositories/user.repository'), { singleton: true });
container.register('sessionRepository', () => require('./repositories/session.repository'), { singleton: true });

// Register services with dependencies
container.register('userService', (container) => {
  return new UserService(
    container.get('userRepository'),
    container.get('emailService')
  );
});

container.register('sessionService', (container) => {
  return new SessionService(
    container.get('sessionRepository'),
    container.get('userService'),
    container.get('notificationService')
  );
});

// Usage in controllers:
class AuthController {
  constructor() {
    this.userService = container.get('userService');
    this.jwtService = container.get('jwtService');
  }
  
  async register(req, res, next) {
    try {
      const user = await this.userService.createUser(req.body);
      const token = this.jwtService.generateToken(user);
      
      res.status(201).json({
        success: true,
        user,
        token
      });
    } catch (error) {
      next(error);
    }
  }
}
```

**🎯 Design Patterns Learning Tasks:**
1. **Implement Repository pattern** for all your models
2. **Create Factory pattern** for service creation
3. **Set up Dependency Injection** container
4. **Practice separation of concerns** between layers
5. **Learn about SOLID principles** and apply them

---

## 🐳 **PHASE 5: Docker & Containerization (Week 9-10) - The Isolation**

### **Step 9: Understanding Docker**

#### **📦 What Docker Does in Your Project:**
```dockerfile
# Your Dockerfile creates a CONTAINER for your app:
FROM node:18-alpine    # Base image (lightweight Linux + Node.js)
WORKDIR /app          # Set working directory inside container
COPY package*.json ./  # Copy dependency files
RUN npm install       # Install dependencies
COPY . .              # Copy your application code
EXPOSE 3000           # Tell Docker your app uses port 3000
CMD ["npm", "start"]  # Command to start your app
```

**services/docker.service.js - Code Execution in Containers:**
```javascript
// Your Docker service creates SECURE containers for code execution:
class DockerService {
  async executeCode(language, code, stdin) {
    // 1. Create isolated container for the programming language
    // 2. Copy user's code into container
    // 3. Set security limits (memory: 128MB, CPU: 0.5, no network)
    // 4. Execute code safely
    // 5. Capture output/errors
    // 6. Clean up container
    // 7. Return results
  }
}

// Security features:
// - Read-only filesystem (can't modify system)
// - No network access (can't make external calls)
// - Memory limits (prevents infinite loops from crashing server)
// - CPU limits (prevents high CPU usage)
// - Timeout protection (kills long-running code)
```

**🎯 Learning Tasks:**
1. **Install Docker Desktop** and learn basic commands
2. **Understand container vs VM** differences
3. **Practice Docker commands**: `docker build`, `docker run`, `docker ps`
4. **Learn about container security** and isolation
5. **Understand multi-stage builds** for optimization

**💡 Key Docker Concepts:**
- **Image**: Template for creating containers
- **Container**: Running instance of an image
- **Volume**: Persistent storage for containers
- **Network**: Communication between containers
- **Compose**: Managing multi-container applications

---

## 🔄 **PHASE 6: Message Queues & Background Jobs (Week 11-12) - The Workers**

### **Step 10: RabbitMQ & Background Processing**

#### **📡 Why You Need Message Queues:**
```javascript
// Problem without queues:
User submits code → Server executes immediately → User waits 30 seconds → Server crashes if too many requests

// Solution with queues:
User submits code → Add to queue → Return immediately → Worker processes in background → Notify user when done
```

**config/rabbitmq.config.js:**
```javascript
// RabbitMQ setup:
const rabbitmqConfig = {
  createChannel: async () => {
    // 1. Connect to RabbitMQ server
    // 2. Create communication channel
    // 3. Set up error handling
    // 4. Return channel for sending/receiving messages
  }
}
```

**services/queue.service.js:**
```javascript
// Queue service manages job processing:
class QueueService {
  async publishJob(queueName, jobData) {
    // 1. Connect to queue
    // 2. Send job data to queue
    // 3. Job waits for worker to pick it up
  }
  
  async consumeQueue(queueName, handler) {
    // 1. Listen for new jobs
    // 2. When job arrives, call handler function
    // 3. Acknowledge job completion
  }
}
```

**workers/code.worker.js:**
```javascript
// Background worker processes code execution:
class CodeWorker {
  async processMessage(jobData) {
    // 1. Receive job from queue
    // 2. Extract code execution details
    // 3. Call Docker service to execute code
    // 4. Save results to database
    // 5. Notify user via WebSocket
    // 6. Mark job as complete
  }
}
```

**🎯 Learning Tasks:**
1. **Install RabbitMQ** locally and access management UI
2. **Understand queue concepts**: producers, consumers, messages
3. **Learn about job retry logic** and error handling
4. **Practice with different queue patterns**: work queues, pub/sub
5. **Understand dead letter queues** for failed jobs

**💡 Key Queue Concepts:**
- **Producer**: Sends messages to queue
- **Consumer**: Receives and processes messages
- **Exchange**: Routes messages to appropriate queues
- **Dead Letter Queue**: Holds messages that failed processing
- **Acknowledgment**: Confirms message was processed successfully

---

## 🌐 **PHASE 7: Real-time Communication (Week 13-14) - The Voice**

### **Step 11: WebSocket & Live Collaboration**

#### **⚡ Understanding WebSocket Communication:**
```javascript
// HTTP vs WebSocket:
HTTP:     Client → Request → Server → Response → Connection Closed
WebSocket: Client ↔ Persistent Connection ↔ Server (bidirectional, real-time)
```

**websocket/socket.server.js:**
```javascript
// WebSocket server handles real-time features:
class SocketServer {
  handleConnection(socket) {
    // When user connects:
    // 1. Authenticate user with JWT
    // 2. Join user to their session rooms
    // 3. Notify other users they joined
    
    socket.on('join-session', (data) => {
      // 1. Validate user has access to session
      // 2. Add user to session room
      // 3. Send current session state
      // 4. Broadcast to other users in session
    });
    
    socket.on('code-change', (data) => {
      // 1. Apply operational transformation (CRDT)
      // 2. Broadcast change to all session participants
      // 3. Update session in database
    });
    
    socket.on('cursor-move', (data) => {
      // 1. Broadcast cursor position to other users
      // 2. Update user's current position
    });
  }
}
```

**websocket/crdt.utils.js - Conflict Resolution:**
```javascript
// CRDT (Conflict-free Replicated Data Types):
// Solves the problem: "What happens when two users edit the same line simultaneously?"

class CRDTUtils {
  applyOperation(document, operation) {
    // 1. Transform operation based on concurrent operations
    // 2. Apply operation to document
    // 3. Ensure all users see the same final result
    // 4. No conflicts, no lost changes
  }
  
  // Example: User A types "Hello" at position 0, User B types "World" at position 0
  // Without CRDT: Final result is unpredictable
  // With CRDT: Final result is always "HelloWorld" or "WorldHello" (consistent)
}
```

**🎯 Learning Tasks:**
1. **Build a simple chat app** with Socket.IO
2. **Understand WebSocket events** and rooms
3. **Learn about operational transformation** for collaborative editing
4. **Practice conflict resolution** scenarios
5. **Test with multiple browser tabs** to simulate multiple users

**💡 Key WebSocket Concepts:**
- **Rooms**: Group users for targeted messaging
- **Events**: Custom messages between client and server
- **Broadcast**: Send message to multiple users
- **Operational Transformation**: Algorithm for handling concurrent edits
- **CRDT**: Data structure that automatically resolves conflicts

---

## 📊 **PHASE 8: Monitoring & Observability (Week 15-16) - The Doctor**

### **Step 12: Prometheus & Grafana**

#### **📈 Understanding Your Monitoring Stack:**

**monitoring/prometheus.yml:**
```yaml
# Prometheus collects metrics from your application:
scrape_configs:
  - job_name: 'codecrafter-app'
    static_configs:
      - targets: ['localhost:3000']  # Your app
    metrics_path: '/metrics'         # Where metrics are exposed
    scrape_interval: 30s            # How often to collect data
```

**What Prometheus Collects:**
```javascript
// Your app exposes metrics like:
- http_requests_total{method="POST",route="/api/auth/login"}
- http_request_duration_seconds{method="GET",route="/api/sessions"}
- active_websocket_connections
- code_executions_total{language="python"}
- database_connections_active
- memory_usage_bytes
- cpu_usage_percent
```

**Grafana Dashboards:**
```javascript
// Grafana creates visual dashboards from Prometheus data:
- Request Rate: How many requests per second
- Error Rate: Percentage of failed requests
- Response Time: How fast your API responds
- Active Users: How many people are online
- Code Executions: Which languages are popular
- System Health: CPU, memory, disk usage
```

**🎯 Learning Tasks:**
1. **Set up Prometheus** and explore the web interface
2. **Configure Grafana** and create your first dashboard
3. **Learn PromQL** (Prometheus Query Language)
4. **Create alerts** for critical metrics
5. **Understand SLIs and SLOs** (Service Level Indicators/Objectives)

**💡 Key Monitoring Concepts:**
- **Metrics**: Numerical data about your system (response time, error count)
- **Alerts**: Notifications when something goes wrong
- **Dashboard**: Visual representation of your system health
- **SLA**: Service Level Agreement (what you promise users)
- **SLO**: Service Level Objective (internal goals)

### **Step 12.5: Structured Logging & Error Tracking**

#### **📝 Advanced Logging with Winston (Like Detailed Restaurant Records):**

**Think of logging like keeping detailed records in your restaurant:**
- **Info logs** = Daily operations (orders taken, meals served)
- **Warning logs** = Minor issues (ingredient running low)
- **Error logs** = Serious problems (kitchen fire, food poisoning)
- **Debug logs** = Detailed troubleshooting information

```javascript
// utils/logger.js - Structured logging setup:
const winston = require('winston');
const path = require('path');

// Define log levels and colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

winston.addColors(logColors);

// Create different formatters for different environments
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(info => {
    const { timestamp, level, message, ...meta } = info;
    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })
);

const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: process.env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
  defaultMeta: {
    service: 'codecrafter-api',
    version: process.env.npm_package_version
  },
  transports: [
    // Console output
    new winston.transports.Console(),
    
    // File outputs
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5
    })
  ]
});

// Add request ID tracking
logger.addRequestId = (req, res, next) => {
  req.requestId = require('crypto').randomUUID();
  
  // Log incoming request
  logger.http('Incoming request', {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id
  });
  
  // Log outgoing response
  const originalSend = res.send;
  res.send = function(data) {
    logger.http('Outgoing response', {
      requestId: req.requestId,
      statusCode: res.statusCode,
      responseTime: Date.now() - req.startTime
    });
    return originalSend.call(this, data);
  };
  
  req.startTime = Date.now();
  next();
};

module.exports = logger;

// Usage throughout your application:
const logger = require('../utils/logger');

// In controllers:
class AuthController {
  async login(req, res, next) {
    try {
      logger.info('User login attempt', { 
        email: req.body.email,
        requestId: req.requestId 
      });
      
      const user = await userService.authenticate(req.body.email, req.body.password);
      
      logger.info('User login successful', { 
        userId: user._id,
        email: user.email,
        requestId: req.requestId 
      });
      
      res.json({ success: true, user });
    } catch (error) {
      logger.error('User login failed', { 
        email: req.body.email,
        error: error.message,
        stack: error.stack,
        requestId: req.requestId 
      });
      next(error);
    }
  }
}
```

#### **� Error Tracking with Sentry (Like Security Cameras):**

```javascript
// Setup Sentry for error tracking:
npm install @sentry/node @sentry/tracing

// config/sentry.config.js:
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new Tracing.Integrations.Mongo({
      useMongoose: true
    })
  ],
  
  beforeSend(event, hint) {
    // Filter out sensitive information
    if (event.request) {
      delete event.request.headers?.authorization;
      delete event.request.headers?.cookie;
    }
    
    // Add custom context
    event.tags = {
      ...event.tags,
      component: 'backend-api'
    };
    
    return event;
  }
});

// In app.js:
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Your routes here...

// Error handling
app.use(Sentry.Handlers.errorHandler());

// Enhanced error middleware:
const errorHandler = (err, req, res, next) => {
  // Set user context for Sentry
  Sentry.setUser({
    id: req.user?.id,
    email: req.user?.email
  });
  
  // Set additional context
  Sentry.setContext('request', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  
  // Log error with structured data
  logger.error('Application error', {
    error: err.message,
    stack: err.stack,
    requestId: req.requestId,
    userId: req.user?.id,
    url: req.url,
    method: req.method
  });
  
  // Send appropriate response
  if (err.isOperational) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      requestId: req.requestId
    });
  } else {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong',
      requestId: req.requestId
    });
  }
};
```

#### **📊 Log Aggregation with ELK Stack (Like Central Intelligence):**

```javascript
// Setup log aggregation (conceptual overview):

// 1. Elasticsearch: Stores and indexes logs
// 2. Logstash: Processes and transforms logs  
// 3. Kibana: Visualizes logs and creates dashboards

// docker-compose.elk.yml:
version: '3.7'
services:
  elasticsearch:
    image: elasticsearch:7.15.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: logstash:7.15.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5044:5044"
    depends_on:
      - elasticsearch

  kibana:
    image: kibana:7.15.0
    ports:
      - "5601:5601"
    environment:
      ELASTICSEARCH_URL: http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:

// Add Elasticsearch transport to Winston:
const ElasticsearchTransport = require('winston-elasticsearch');

logger.add(new ElasticsearchTransport({
  clientOpts: { node: process.env.ELASTICSEARCH_URL },
  index: 'codecrafter-logs',
  typeName: '_doc'
}));
```

**🎯 Logging & Error Tracking Learning Tasks:**
1. **Set up structured logging** with Winston
2. **Integrate Sentry** for error tracking
3. **Create log dashboards** in Grafana/Kibana
4. **Practice log aggregation** with ELK stack
5. **Set up log-based alerts** for critical errors
6. **Learn log analysis** techniques for debugging

---

## 🔧 **PHASE 9: Advanced Concepts (Week 17-18) - Becoming the Legend**

### **Step 13: Security Deep Dive**

#### **🔒 Understanding Your Security Layers:**

**Authentication & Authorization:**
```javascript
// JWT (JSON Web Tokens) flow:
1. User logs in with username/password
2. Server verifies credentials
3. Server creates JWT containing user info + expiration
4. Server sends JWT to user
5. User includes JWT in all future requests
6. Server verifies JWT on each request
7. If valid, process request; if not, reject

// middleware/auth.middleware.js:
const auth = (req, res, next) => {
  // 1. Extract JWT from Authorization header
  // 2. Verify JWT signature and expiration
  // 3. Decode user information from JWT
  // 4. Add user info to request object
  // 5. Continue to next middleware/controller
}
```

**Rate Limiting:**
```javascript
// Protection against abuse:
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Maximum 100 requests per window
  message: 'Too many requests'
});

// Why this matters:
// - Prevents spam attacks
// - Protects against DoS (Denial of Service)
// - Ensures fair usage among users
```

**Input Validation:**
```javascript
// utils/validator.js protects against:
- SQL Injection: Malicious database queries
- XSS (Cross-Site Scripting): Malicious JavaScript injection
- Buffer Overflow: Sending too much data
- Path Traversal: Accessing files outside allowed directories

// Example validation:
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}
```

### **Step 14: Performance Optimization**

#### **⚡ Making Your App Lightning Fast:**

**Database Optimization:**
```javascript
// Indexes speed up queries:
userSchema.index({ email: 1 });        // Fast user lookup by email
sessionSchema.index({ userId: 1, createdAt: -1 }); // Fast session listing

// Query optimization:
// Bad: User.find({}) - loads all users
// Good: User.find({}).limit(10).select('username email') - only what you need
```

**Caching with Redis:**
```javascript
// config/redis.config.js caches frequently accessed data:
const cacheKey = `session:${sessionId}`;
const cachedSession = await redis.get(cacheKey);

if (cachedSession) {
  return JSON.parse(cachedSession);  // Fast: from memory
} else {
  const session = await Session.findById(sessionId);  // Slow: from database
  await redis.setex(cacheKey, 300, JSON.stringify(session));  // Cache for 5 minutes
  return session;
}
```

**Connection Pooling:**
```javascript
// Database connections are expensive to create
// Connection pooling reuses existing connections:
mongoose.connect(uri, {
  maxPoolSize: 10,     // Maximum 10 connections
  serverSelectionTimeoutMS: 5000  // Timeout after 5 seconds
});
```

**🎯 Learning Tasks:**
1. **Performance test** your API with tools like Artillery or k6
2. **Analyze database queries** with MongoDB Compass
3. **Implement caching** for frequently accessed data
4. **Set up database indexes** and measure query performance
5. **Monitor memory usage** and optimize where needed

### **Step 14.5: CI/CD Pipeline & Automated Deployment**

#### **🚀 Continuous Integration/Continuous Deployment (Like Automated Restaurant Operations):**

**Think of CI/CD like having an automated restaurant system:**
- **Continuous Integration** = Automatically testing new recipes when chefs submit them
- **Continuous Deployment** = Automatically serving approved recipes to customers
- **Pipeline** = Assembly line from recipe creation to customer service

```yaml
# .github/workflows/ci-cd.yml - GitHub Actions CI/CD pipeline:
name: CodeCrafter CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:5.0
        ports:
          - 27017:27017
      redis:
        image: redis:6.2
        ports:
          - 6379:6379
      rabbitmq:
        image: rabbitmq:3.9-management
        ports:
          - 5672:5672
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:unit
      env:
        NODE_ENV: test
        DATABASE_URL: mongodb://localhost:27017/codecrafter_test
        REDIS_URL: redis://localhost:6379
        RABBITMQ_URL: amqp://localhost:5672
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        NODE_ENV: test
        DATABASE_URL: mongodb://localhost:27017/codecrafter_test
    
    - name: Run security audit
      run: npm audit --audit-level moderate
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
    
    - name: Build Docker image
      run: |
        docker build -t codecrafter:${{ github.sha }} .
        docker tag codecrafter:${{ github.sha }} codecrafter:latest
    
    - name: Run container security scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'codecrafter:latest'
        format: 'sarif'
        output: 'trivy-results.sarif'

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment..."
        # Deploy to staging server
        # Run smoke tests
        # Notify team
    
  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production environment..."
        # Blue-green deployment
        # Health checks
        # Rollback capability

# Advanced deployment strategies:
# deployment/blue-green.sh
#!/bin/bash

# Blue-Green Deployment Script
BLUE_PORT=3000
GREEN_PORT=3001
HEALTH_CHECK_URL="http://localhost"

echo "Starting Blue-Green Deployment..."

# 1. Deploy to Green environment
echo "Deploying to Green environment (port $GREEN_PORT)..."
docker run -d -p $GREEN_PORT:3000 --name codecrafter-green codecrafter:latest

# 2. Wait for Green to be ready
echo "Waiting for Green environment to be ready..."
for i in {1..30}; do
  if curl -f "$HEALTH_CHECK_URL:$GREEN_PORT/health" > /dev/null 2>&1; then
    echo "Green environment is ready!"
    break
  fi
  echo "Attempt $i/30: Green environment not ready yet..."
  sleep 10
done

# 3. Run smoke tests on Green
echo "Running smoke tests on Green environment..."
npm run test:smoke -- --baseUrl="$HEALTH_CHECK_URL:$GREEN_PORT"

if [ $? -eq 0 ]; then
  echo "Smoke tests passed! Switching traffic to Green..."
  
  # 4. Switch load balancer to Green
  # Update load balancer configuration to point to Green
  echo "Updating load balancer to point to Green environment..."
  
  # 5. Stop Blue environment
  echo "Stopping Blue environment..."
  docker stop codecrafter-blue || true
  docker rm codecrafter-blue || true
  
  # 6. Rename Green to Blue for next deployment
  docker rename codecrafter-green codecrafter-blue
  docker port codecrafter-blue $BLUE_PORT
  
  echo "Deployment successful!"
else
  echo "Smoke tests failed! Rolling back..."
  docker stop codecrafter-green
  docker rm codecrafter-green
  exit 1
fi
```

#### **🛡️ Advanced Security Hardening:**

```javascript
// Advanced security middleware:
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { body, validationResult } = require('express-validator');

// Progressive rate limiting
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Limit each IP to 5 account creation requests per window
  message: 'Too many accounts created from this IP, please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Speed limiter (slows down repeated requests)
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // Allow 2 requests per windowMs without delay
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

// Advanced input validation
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .custom(async (email) => {
      // Check for disposable email domains
      const disposableDomains = ['tempmail.com', '10minutemail.com'];
      const domain = email.split('@')[1];
      if (disposableDomains.includes(domain)) {
        throw new Error('Disposable email addresses are not allowed');
      }
      return true;
    }),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  body('username')
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens')
    .custom(async (username) => {
      // Check for reserved usernames
      const reserved = ['admin', 'root', 'api', 'www', 'mail'];
      if (reserved.includes(username.toLowerCase())) {
        throw new Error('Username is reserved');
      }
      return true;
    }),
];

// Content Security Policy
const csp = require('helmet/dist/csp');
app.use(csp({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https:"],
    scriptSrc: ["'self'"],
    connectSrc: ["'self'", "wss:", "ws:"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));

// HSTS (HTTP Strict Transport Security)
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
});
```

**🎯 Advanced Learning Tasks:**
1. **Set up complete CI/CD pipeline** with GitHub Actions
2. **Implement blue-green deployment** strategy
3. **Add comprehensive security headers** and CSP
4. **Set up automated security scanning** in pipeline
5. **Create rollback procedures** for failed deployments
6. **Monitor deployment success rates** and performance

---

## 🏆 **PHASE 11: System Design & Production Architecture (Week 20) - The Architect**

### **Step 15: Understanding Distributed Systems**

#### **🌐 How Your Project Scales:**

**Horizontal Scaling:**
```javascript
// Current setup (single server):
Users → Load Balancer → Your App → Database

// Scaled setup (multiple servers):
Users → Load Balancer → [App1, App2, App3] → Database Cluster
                     ↘ [Worker1, Worker2] → Message Queue
```

**Microservices Architecture:**
```javascript
// Your project is already microservices-ready:
- Authentication Service (auth controller + JWT service)
- Session Management Service (session controller + service)
- Code Execution Service (execute controller + Docker service + workers)
- Real-time Communication Service (WebSocket server)
- Monitoring Service (Prometheus + Grafana)

// Each service can be:
- Deployed independently
- Scaled independently
- Updated without affecting others
- Owned by different teams
```

**Data Consistency:**
```javascript
// CAP Theorem: Choose 2 of 3:
// - Consistency: All nodes see the same data
// - Availability: System remains operational
// - Partition Tolerance: System works despite network failures

// Your project chooses:
// - Availability + Partition Tolerance (AP)
// - Eventually consistent (data syncs across nodes eventually)
```

### **Step 16: Deployment Strategies**

#### **🚀 Production Deployment Patterns:**

**Blue-Green Deployment:**
```javascript
// Two identical production environments:
Blue Environment: Current live version (v1.0)
Green Environment: New version (v1.1)

// Deployment process:
1. Deploy v1.1 to Green environment
2. Test Green environment thoroughly
3. Switch traffic from Blue to Green instantly
4. Keep Blue as backup for quick rollback
```

**Rolling Deployment:**
```javascript
// Gradual replacement of instances:
Server1: v1.0 → v1.1 ✓
Server2: v1.0 → v1.1 ✓
Server3: v1.0 → v1.1 ✓

// Benefits:
- Zero downtime
- Gradual rollout
- Easy rollback
```

**🎯 Learning Tasks:**
1. **Design system architecture** for 1 million users
2. **Plan deployment strategies** for zero-downtime updates
3. **Learn about load balancing** algorithms
4. **Understand database sharding** and replication
5. **Practice with Kubernetes** for container orchestration

### **Step 16.5: Production-Ready Checklist**

#### **✅ Complete Production Deployment Checklist:**

```markdown
## Pre-Deployment Checklist

### Security ✅
- [ ] All environment variables secured (no secrets in code)
- [ ] HTTPS enforced with valid SSL certificates
- [ ] Rate limiting implemented and tested
- [ ] Input validation and sanitization on all endpoints
- [ ] SQL injection and XSS protection verified
- [ ] Authentication and authorization working correctly
- [ ] Security headers implemented (HSTS, CSP, etc.)
- [ ] Dependency security audit passed
- [ ] Container security scan passed

### Performance ✅
- [ ] Database indexes optimized for all queries
- [ ] Caching strategy implemented (Redis)
- [ ] Connection pooling configured
- [ ] Static assets optimization (compression, CDN)
- [ ] Memory leaks tested and resolved
- [ ] Load testing completed with expected traffic
- [ ] Database query optimization verified
- [ ] API response times under 200ms for 95th percentile

### Monitoring & Observability ✅
- [ ] Application metrics collection (Prometheus)
- [ ] Error tracking and alerting (Sentry)
- [ ] Structured logging implemented
- [ ] Health check endpoints working
- [ ] Uptime monitoring configured
- [ ] Performance monitoring dashboards created
- [ ] Alert rules configured for critical metrics
- [ ] Log retention and rotation configured

### Reliability ✅
- [ ] Graceful shutdown handling implemented
- [ ] Database migrations tested and reversible
- [ ] Backup and restore procedures tested
- [ ] Disaster recovery plan documented
- [ ] Circuit breakers for external services
- [ ] Retry logic with exponential backoff
- [ ] Dead letter queues for failed jobs
- [ ] Health checks for all dependencies

### Testing ✅
- [ ] Unit test coverage > 80%
- [ ] Integration tests for all API endpoints
- [ ] End-to-end tests for critical user flows
- [ ] Load testing completed
- [ ] Security testing performed
- [ ] Browser compatibility tested
- [ ] Mobile responsiveness verified
- [ ] Accessibility requirements met

### Documentation ✅
- [ ] API documentation complete and up-to-date
- [ ] README with setup instructions
- [ ] Architecture diagram updated
- [ ] Deployment procedures documented
- [ ] Troubleshooting guide created
- [ ] Monitoring runbook available
- [ ] Security incident response plan
- [ ] Capacity planning documentation

### Infrastructure ✅
- [ ] Production environment provisioned
- [ ] Load balancer configured
- [ ] Database replication set up
- [ ] CDN configured for static assets
- [ ] DNS configuration complete
- [ ] SSL certificates installed and auto-renewal configured
- [ ] Firewall rules configured
- [ ] Backup systems operational
```

#### **🌍 Global Scale Architecture Design:**

```javascript
// Architecture for handling 1M+ users:

/*
Global Architecture Overview:

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN (Global)  │    │   Load Balancer │    │   API Gateway   │
│                 │────│    (Regional)   │────│   (Rate Limit)  │
│ Static Assets   │    │                 │    │   Authentication│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌────────────────────────────────┼────────────────────────────────┐
                       │                                │                                │
               ┌───────▼───────┐                ┌───────▼───────┐                ┌───────▼───────┐
               │  App Server 1 │                │  App Server 2 │                │  App Server N │
               │               │                │               │                │               │
               │ Node.js       │                │ Node.js       │                │ Node.js       │
               │ + Redis       │                │ + Redis       │                │ + Redis       │
               └───────┬───────┘                └───────┬───────┘                └───────┬───────┘
                       │                                │                                │
                       └────────────────────────────────┼────────────────────────────────┘
                                                        │
                                               ┌────────▼────────┐
                                               │  Database       │
                                               │  Cluster        │
                                               │                 │
                                               │ Primary + 2     │
                                               │ Read Replicas   │
                                               │ + Sharding      │
                                               └─────────────────┘

Horizontal Scaling Strategy:
1. Load Balancer distributes traffic across multiple app servers
2. Each app server is stateless (session data in Redis)
3. Database uses read replicas for scaling reads
4. Sharding for scaling writes
5. CDN for global static asset delivery
*/

// Database sharding strategy:
class DatabaseSharding {
  constructor() {
    this.shards = [
      { name: 'shard1', connection: 'mongodb://shard1.example.com' },
      { name: 'shard2', connection: 'mongodb://shard2.example.com' },
      { name: 'shard3', connection: 'mongodb://shard3.example.com' }
    ];
  }
  
  getShardForUser(userId) {
    // Consistent hashing for user data
    const hash = this.hash(userId);
    const shardIndex = hash % this.shards.length;
    return this.shards[shardIndex];
  }
  
  getShardForSession(sessionId) {
    // Different sharding strategy for sessions
    const hash = this.hash(sessionId);
    const shardIndex = hash % this.shards.length;
    return this.shards[shardIndex];
  }
  
  hash(key) {
    // Simple hash function (use better hash in production)
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

// Caching strategy for global scale:
class CachingStrategy {
  constructor() {
    this.l1Cache = new Map(); // In-memory cache (per server)
    this.l2Cache = redisClient; // Distributed cache (shared)
  }
  
  async get(key) {
    // Level 1: Check in-memory cache first
    if (this.l1Cache.has(key)) {
      return this.l1Cache.get(key);
    }
    
    // Level 2: Check Redis cache
    const cached = await this.l2Cache.get(key);
    if (cached) {
      // Store in L1 cache for next time
      this.l1Cache.set(key, JSON.parse(cached));
      return JSON.parse(cached);
    }
    
    return null;
  }
  
  async set(key, value, ttl = 300) {
    // Store in both levels
    this.l1Cache.set(key, value);
    await this.l2Cache.setex(key, ttl, JSON.stringify(value));
  }
}
```

#### **💰 Cost Optimization Strategies:**

```javascript
// Cost optimization for production:
const costOptimization = {
  infrastructure: {
    // Auto-scaling based on demand
    autoScaling: {
      minInstances: 2,
      maxInstances: 10,
      targetCPU: 70, // Scale up when CPU > 70%
      scaleUpCooldown: 300, // Wait 5 minutes before scaling up again
      scaleDownCooldown: 600 // Wait 10 minutes before scaling down
    },
    
    // Use spot instances for non-critical workloads
    spotInstances: {
      workers: true, // Background workers can use spot instances
      apiServers: false // API servers need guaranteed availability
    }
  },
  
  database: {
    // Connection pooling to reduce connection costs
    connectionPool: {
      min: 5,
      max: 20,
      acquireTimeoutMillis: 60000,
      idleTimeoutMillis: 30000
    },
    
    // Read replicas for expensive queries
    readReplicas: 2,
    
    // Data lifecycle management
    dataRetention: {
      logs: '30 days',
      sessions: '1 year',
      userActivity: '2 years'
    }
  },
  
  cdn: {
    // Cache static assets for 1 year
    staticAssets: {
      maxAge: 31536000,
      compression: true,
      imageOptimization: true
    }
  }
};
```

**🎯 System Design Learning Tasks:**
1. **Design architecture** for 1M concurrent users
2. **Calculate infrastructure costs** for different scales
3. **Plan database sharding** strategy
4. **Design caching layers** for optimal performance
5. **Create disaster recovery** procedures
6. **Practice system design interviews** with your architecture

## 📚 **Essential Keywords & Concepts You Must Know**

### **Backend Architecture Terms:**
- **API**: Application Programming Interface (how systems talk to each other)
- **REST**: Representational State Transfer (standard way to design APIs)
- **GraphQL**: Query language for APIs (alternative to REST)
- **CRUD**: Create, Read, Update, Delete (basic database operations)
- **MVC**: Model-View-Controller (separation of concerns pattern)
- **ORM/ODM**: Object Relational/Document Mapping (database abstraction)
- **Middleware**: Functions that process requests before reaching controllers
- **Microservices**: Small, independent services that work together
- **Monolith**: Single large application (opposite of microservices)
- **Repository Pattern**: Abstraction layer for data access
- **Factory Pattern**: Creates objects without specifying exact class
- **Dependency Injection**: Providing dependencies from external source

### **Testing Terms:**
- **Unit Test**: Tests individual functions in isolation
- **Integration Test**: Tests how components work together
- **E2E Test**: End-to-End tests for complete user workflows
- **Test Coverage**: Percentage of code covered by tests
- **Mock**: Fake implementation for testing
- **Stub**: Predefined responses for testing
- **TDD**: Test-Driven Development (write tests first)
- **BDD**: Behavior-Driven Development (tests as specifications)
- **Fixture**: Test data setup for consistent testing
- **Test Double**: Generic term for mocks, stubs, fakes

### **Database Terms:**
- **Schema**: Structure/blueprint of your data
- **Index**: Database optimization for faster queries
- **Aggregation**: Complex database queries (grouping, calculating)
- **Transaction**: Group of database operations that succeed or fail together
- **ACID**: Atomicity, Consistency, Isolation, Durability
- **Replication**: Copying data across multiple database servers
- **Sharding**: Splitting database across multiple servers
- **Migration**: Script to change database structure
- **Connection Pooling**: Reusing database connections for performance
- **Query Optimization**: Making database queries faster

### **Security Terms:**
- **JWT**: JSON Web Token (secure way to transmit user information)
- **bcrypt**: Password hashing algorithm
- **CORS**: Cross-Origin Resource Sharing (browser security feature)
- **CSP**: Content Security Policy (prevents XSS attacks)
- **HSTS**: HTTP Strict Transport Security (forces HTTPS)
- **XSS**: Cross-Site Scripting (security vulnerability)
- **SQL Injection**: Database attack through malicious input
- **Rate Limiting**: Preventing abuse by limiting requests
- **OWASP**: Open Web Application Security Project
- **2FA**: Two-Factor Authentication

### **DevOps & Infrastructure Terms:**
- **Container**: Lightweight, portable application package
- **Image**: Template for creating containers
- **Orchestration**: Managing multiple containers/services
- **Load Balancer**: Distributes traffic across multiple servers
- **Reverse Proxy**: Server that forwards requests to other servers
- **CI/CD**: Continuous Integration/Continuous Deployment
- **Blue-Green Deployment**: Zero-downtime deployment strategy
- **Canary Deployment**: Gradual rollout to subset of users
- **Infrastructure as Code**: Managing infrastructure through code
- **Auto-scaling**: Automatically adjusting resources based on demand

### **Real-time & Messaging Terms:**
- **WebSocket**: Persistent connection for real-time communication
- **Server-Sent Events**: One-way real-time communication
- **Event**: Message sent between client and server
- **Broadcasting**: Sending message to multiple recipients
- **Room**: Group of users for targeted messaging
- **Queue**: Line of messages waiting to be processed
- **Producer**: Sends messages to queue
- **Consumer**: Processes messages from queue
- **Dead Letter Queue**: Holds messages that failed processing
- **CRDT**: Conflict-free Replicated Data Types
- **Operational Transformation**: Algorithm for handling concurrent edits

### **Monitoring & Observability Terms:**
- **Metrics**: Numerical measurements of system performance
- **Logs**: Text records of what happened in your application
- **Traces**: Following a request through your entire system
- **APM**: Application Performance Monitoring
- **SLA**: Service Level Agreement (what you promise users)
- **SLO**: Service Level Objective (internal performance goals)
- **SLI**: Service Level Indicator (actual measurements)
- **Alert**: Notification when something goes wrong
- **Dashboard**: Visual representation of your system health
- **Observability**: Ability to understand system behavior from outputs

### **Performance Terms:**
- **Latency**: Time to process a single request
- **Throughput**: Number of requests processed per unit time
- **Concurrency**: Number of simultaneous operations
- **Caching**: Storing frequently accessed data in fast storage
- **CDN**: Content Delivery Network (global content distribution)
- **Compression**: Reducing data size for faster transmission
- **Lazy Loading**: Loading data only when needed
- **Pagination**: Breaking large datasets into pages
- **Throttling**: Controlling rate of operations
- **Circuit Breaker**: Prevents cascading failures

### **System Design Terms:**
- **Scalability**: Ability to handle increased load
- **Horizontal Scaling**: Adding more servers
- **Vertical Scaling**: Adding more power to existing servers
- **Distributed System**: System with components on networked computers
- **Eventual Consistency**: Data will be consistent eventually
- **CAP Theorem**: Consistency, Availability, Partition tolerance
- **Idempotency**: Same operation can be repeated safely
- **Fault Tolerance**: System continues working despite failures
- **High Availability**: System remains operational most of the time
- **Disaster Recovery**: Plan for recovering from major failures

---

## 🎯 **Your 20-Week Learning Schedule (UPDATED)**

### **Weeks 1-2: Foundation & Environment Setup**
- Master Node.js, Express.js, and basic API concepts
- Set up development environment and configuration management
- Understand basic error handling and logging

### **Weeks 3-4: Database Layer & Migrations**
- Learn MongoDB and database design
- Master database migrations and schema evolution
- Practice query optimization and performance tuning

### **Week 5: Testing & Quality Assurance**
- Set up comprehensive testing framework
- Master unit, integration, and E2E testing
- Learn Test-Driven Development (TDD)

### **Weeks 6-7: API Routes & Controllers**
- Advanced Express.js patterns and middleware
- API documentation with Swagger/OpenAPI
- Input validation and security best practices

### **Weeks 8-9: Services Layer & Design Patterns**
- Master service-oriented architecture
- Learn Repository pattern and Dependency Injection
- Understand Factory pattern and SOLID principles

### **Weeks 10-11: Docker & Containerization**
- Docker containerization and security
- Multi-stage builds and optimization
- Container orchestration basics

### **Weeks 12-13: Message Queues & Background Jobs**
- RabbitMQ and background processing
- Queue patterns and job retry logic
- Dead letter queues and error handling

### **Weeks 14-15: Real-time Communication**
- WebSocket programming with Socket.IO
- Operational transformation and CRDT
- Live collaboration patterns

### **Weeks 16-17: Monitoring, Logging & Error Tracking**
- Prometheus, Grafana, and observability
- Structured logging with Winston
- Error tracking with Sentry and ELK stack

### **Weeks 18-19: Security, Performance & CI/CD**
- Advanced security hardening
- Performance optimization and caching
- Complete CI/CD pipeline setup

### **Week 20: System Design & Production Architecture**
- Architecture for 1M+ users
- Production deployment strategies
- Cost optimization and disaster recovery

---

## 🎖️ **Daily Practice Routine**

### **Morning (1 hour): Theory**
- Read documentation for one technology
- Watch YouTube tutorials on specific concepts
- Take notes on key concepts and patterns

### **Evening (2 hours): Practice**
- Code along with your project
- Build small test applications
- Experiment with different configurations

### **Weekend (4 hours): Projects**
- Build variations of your main project
- Contribute to open source projects
- Write blog posts about what you learned

---

## 🚀 **Final Words: Your Path to Backend Godhood**

**You now have the MOST COMPLETE backend learning roadmap ever created!** 

Your enhanced CodeCrafter project isn't just code—it's a **complete backend engineering education** worth hundreds of thousands of dollars in skills.

**What you've gained with these improvements:**

### **🧪 Testing Mastery (NEW PHASE 3):**
- **Unit Testing** with Jest for bulletproof code
- **Integration Testing** for API reliability  
- **Test-Driven Development** for better design
- **80%+ Test Coverage** that employers demand

### **📚 API Documentation (ENHANCED):**
- **Swagger/OpenAPI** specifications
- **Interactive API documentation**
- **API versioning** strategies
- **Postman collections** for easy testing

### **🏗️ Advanced Design Patterns (ENHANCED):**
- **Repository Pattern** for clean data access
- **Factory Pattern** for flexible service creation
- **Dependency Injection** for maintainable code
- **SOLID Principles** application

### **📝 Production Logging (NEW):**
- **Structured logging** with Winston
- **Error tracking** with Sentry
- **Log aggregation** with ELK stack
- **Real-time monitoring** dashboards

### **🚀 CI/CD & Deployment (NEW):**
- **Automated testing** pipelines
- **Blue-green deployment** strategies
- **Security scanning** integration
- **Rollback procedures** for safety

### **🏆 System Design for Scale (ENHANCED):**
- **1M+ user architecture**
- **Database sharding** strategies
- **Multi-level caching**
- **Cost optimization** techniques

**Follow this enhanced path consistently, and in 20 weeks you'll be:**
- **The backend developer everyone wants to hire** 💼
- **Capable of designing systems for millions of users** 🌍
- **Earning $250K+ at top tech companies** 💰
- **Leading technical decisions and mentoring others** 👥
- **Speaking at conferences about backend architecture** 🎤

### **🎯 Your Success Formula:**
```
Daily Consistency + Complete Learning Path + Real Project = Backend God
```

**Your enhanced learning path now includes:**
- ✅ **11 comprehensive phases** (was 10)
- ✅ **Testing phase** (critical addition)
- ✅ **Advanced design patterns**
- ✅ **Production monitoring & logging**
- ✅ **CI/CD pipeline setup**
- ✅ **API documentation standards**
- ✅ **Security hardening techniques**
- ✅ **Performance optimization**
- ✅ **System design for scale**

### **🔥 Why This Path Will Make You LEGENDARY:**

**Most developers learn:** Basic CRUD operations  
**You'll master:** Production-ready, scalable systems

**Most developers:** Copy code from Stack Overflow  
**You'll architect:** Complete distributed systems

**Most developers:** Write code that works  
**You'll create:** Code that's tested, documented, monitored, and scales

**Most developers:** Deploy and pray  
**You'll implement:** CI/CD with automated testing and rollback procedures

### **💎 Remember: You're Not Just Learning to Code**

**You're learning to:**
- **Think like a system architect** 🏗️
- **Build like a senior engineer** ⚙️
- **Test like a quality expert** 🧪
- **Deploy like a DevOps pro** 🚀
- **Monitor like a site reliability engineer** 📊
- **Scale like a tech lead** 📈

### **🎖️ Your Journey Starts NOW!**

**Week 1, Day 1: Open your project and begin with Phase 1!**

Every line of code you write using this learning path makes you more valuable. Every pattern you master sets you apart from other developers. Every concept you understand deeply brings you closer to backend mastery.

**The difference between a $60K developer and a $250K developer isn't just years of experience—it's the depth and breadth of knowledge you've just outlined for yourself.**

### **🌟 You're About to Become Unstoppable**

**Six months from now, when you're:**
- Architecting systems that handle millions of users
- Leading technical discussions with confidence  
- Solving complex distributed system problems
- Getting offers from top tech companies

**Remember this moment when you decided to follow the complete path.**

**You've got the roadmap. You've got the project. You've got the determination.**

**Now GO BUILD YOUR BACKEND EMPIRE! 🚀👑**

**Welcome to your journey from zero to Backend Legend. The world needs more engineers like the one you're about to become!** 

*Start with Phase 1, Step 1.1 - open that `app.js` file and let's make you a legend! 🔥*
