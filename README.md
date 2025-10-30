#  CodeCrafter - Collaborative Code Execution Platform

> **Real-time collaborative code editing with secure sandboxed execution**
> Built with Node.js, MongoDB, WebSocket, Docker, and Redis

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://docker.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-orange.svg)](https://socket.io/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## What is CodeCrafter?

CodeCrafter is a **hardcore backend platform** that enables multiple users to write, execute, and collaborate on code in real-time. Think of it as **Google Docs for Code** with a built-in secure code executor.

---

## � Key Features

##  Key Features

###  Core Features

- ✅ **Real-time Collaboration** - Multiple users editing simultaneously with CRDT-based conflict resolution
- ✅ **Secure Code Execution** - Docker-based sandboxed environment
- ✅ **Multi-language Support** - JavaScript, Python, Java, C/C++, Go, Rust
- ✅ **JWT Authentication** - Secure user authentication and authorization
- ✅ **WebSocket Communication** - Real-time updates and collaboration
- ✅ **Session Management** - Create, join, and manage coding sessions

###  Technical Features

- ✅ **CRDT Implementation** - Conflict-free replicated data types for collaborative editing
- ✅ **Background Workers** - RabbitMQ-based job queue for code execution
- ✅ **Redis Caching** - Session storage and real-time data caching
- ✅ **Rate Limiting** - Protection against abuse and resource exhaustion
- ✅ **Comprehensive Logging** - Winston-based logging with multiple levels
- ✅ **Health Monitoring** - Built-in health checks and metrics
- ✅ **Auto-scaling** - Worker processes can be scaled based on demand

---


##  Quick Start (5 Minutes)

### Prerequisites

- 🐳 **Docker & Docker Compose** (recommended) OR
- Node.js 16+, MongoDB 4.4+, Redis 6+, RabbitMQ 3.8+

###  Option 1: Docker (Easiest - Recommended)

**1️⃣ Clone Repository**

```bash
git clone https://github.com/tanmayjoddar/Muweb.git
cd Muweb
```

**2️⃣ Start Everything (One Command!)**

```bash
docker-compose up -d
```

**3️⃣ Verify Services**

```bash
docker-compose ps
```

**4️⃣ Access Applications**

-  **App**: http://localhost:8000
-  **RabbitMQ**: http://localhost:15672 (codecrafter / codecrafter123)
-  **Prometheus**: http://localhost:9090
-  **Grafana**: http://localhost:3001 (admin / codecrafter123)

✅ **Done!** Your entire stack is running.

---

### Option 2: Local Development

**1️⃣ Clone Repository**

```bash
git clone https://github.com/tanmayjoddar/Muweb.git
cd Muweb
```

**2️⃣ Install Dependencies**

```bash
npm install
```

**3️⃣ Set Up Environment**

```bash
cp .env.example .env
```

**4️⃣ Start Application**

```bash
npm run dev
```

**
5️⃣ Start Worker (New Terminal)**

```bash
npm run worker
```

---

## 🐳 Docker Commands (Copy & Paste)

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose stop

# Restart specific service
docker-compose restart app

# Remove everything
docker-compose down

# Remove everything including data
docker-compose down -v
```

### View Logs & Status

```bash
# See all containers
docker-compose ps

# Real-time app logs
docker-compose logs -f app

# View last 50 lines
docker-compose logs app --tail 50

# All service logs
docker-compose logs
```

### Database Access

```bash
# MongoDB shell
docker-compose exec mongo mongosh -u codecrafter -p codecrafter123

# Redis CLI
docker-compose exec redis redis-cli -a "your-password"

# PostgreSQL (if migrated)
docker-compose exec postgres psql -U codecrafter -d codecrafter
```

### Run Commands in Containers

```bash
# Run tests
docker-compose exec app npm test

# Database migration
docker-compose exec app npm run migrate

# View metrics
docker stats
```

### Scale Workers

```bash
# Start 3 worker instances
docker-compose up -d --scale worker=3

# View all workers
docker-compose ps | grep worker
```

---

##  Service Ports & URLs

| Service        | URL                    | Port  | Credentials                  |
| -------------- | ---------------------- | ----- | ---------------------------- |
| **App**        | http://localhost:8000  | 8000  | -                            |
| **Nginx**      | http://localhost:80    | 80    | -                            |
| **RabbitMQ**   | http://localhost:15672 | 15672 | codecrafter / codecrafter123 |
| **Prometheus** | http://localhost:9090  | 9090  | -                            |
| **Grafana**    | http://localhost:3001  | 3001  | admin / codecrafter123       |
| **MongoDB**    | localhost              | 27017 | codecrafter / codecrafter123 |
| **Redis**      | localhost              | 6379  | (from .env)                  |

---

##  Environment Configuration

### Create `.env` File

```bash
cp .env.example .env
```

### Essential Variables

```properties
#  Database
MONGODB_URI=mongodb://codecrafter:codecrafter123@mongo:27017/codecrafter
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

#  RabbitMQ
RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_USERNAME=codecrafter
RABBITMQ_PASSWORD=codecrafter123

#  JWT
JWT_SECRET=your-super-secret-key-min-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

#  Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

#  Docker Limits
DOCKER_TIMEOUT=30
DOCKER_MEMORY_LIMIT=128m
DOCKER_CPU_LIMIT=0.5

#  Languages
SUPPORTED_LANGUAGES=javascript,python,java,cpp,c,go,rust
DEFAULT_LANGUAGE=javascript
```

---

##  Testing & Scripts

```bash
# Run all tests
npm test

# Run specific test
npm test -- auth.test.js

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# Run in Docker
docker-compose exec app npm test
```

### Available Scripts

```bash
npm run dev              # Start with hot reload
npm run worker           # Start code executor worker
npm start                # Production start
npm test                 # Run tests
npm run migrate          # Database migration
```

---

## 📁 Project Structure

```
Muweb/
├── 📂 api/              # API Routes
├── 📂 config/           # Configuration
├── 📂 controllers/      # Business Logic
├── 📂 models/           # Data Models
├── 📂 middleware/       # Middleware
├── 📂 services/         # Services
├── 📂 websocket/        # WebSocket
├── 📂 workers/          # Background Workers
├── 📂 tests/            # Test Suite
├── 🐳 docker-compose.yml  # Docker Setup
├── 📝 .env              # Environment
└── 📦 package.json      # Dependencies
```

---

## 🚨 Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs mongo

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Port Already in Use (Windows)

```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Port Already in Use (Mac/Linux)

```bash
lsof -i :5000
kill -9 <PID>
```

### Database Connection Failed

```bash
# Test connection
docker-compose exec mongo mongosh
docker-compose exec redis redis-cli ping

# Restart services
docker-compose restart
```

### Still Need Help?

```bash
# Check detailed logs
docker-compose logs app --tail 100

# View environment
docker-compose config | grep -A 20 "app:"

# Network check
docker network ls
docker network inspect muweb_codecrafter-network
```

---

## 📚 Detailed Documentation

- **[🐳 Docker Quick Start Guide](./DOCKER_QUICK_START.md)** - All Docker commands
- **[🗄️ Local Redis & PostgreSQL Setup](./DOCKER_LOCAL_SETUP.md)** - Local database setup
- **[🔄 MongoDB to PostgreSQL Migration](./MONGODB_TO_POSTGRES.md)** - Complete migration guide

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ Rate limiting (100 req/min)
- ✅ Input validation & sanitization
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Encrypted password hashing (bcrypt)
- ✅ Environment variable isolation
- ✅ Secure headers (Helmet.js)

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### Made with passion by the Tanmay Joddar

⭐ If you like this project, please give it a star!

[⬆ Back to Top](#-codecrafter---collaborative-code-execution-platform)

</div>
````
```

**3️⃣ Set Up Environment**

```bash
cp .env.example .env
```

**4️⃣ Start Application**

```bash
npm run dev
```

**5️⃣ Start Worker (New Terminal)**

```bash
npm run worker
```

---

## � Docker Commands (Copy & Paste)
