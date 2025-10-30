# 🎯 Muweb - Collaborative Code Execution Platform# 🚀 CodeCrafter - Collaborative Code Execution Platform



A full-stack collaborative code execution platform with real-time collaboration, session management, and sandboxed code execution.> **Real-time collaborative code editing with secure sandboxed execution**

> Built with Node.js, MongoDB, WebSocket, Docker, and Redis

---

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

## 📁 Project Structure[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://docker.com/)

[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-orange.svg)](https://socket.io/)

```[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Muweb/

├── backend/                    # Backend application (Node.js + Express)---

│   ├── api/                   # API route definitions

│   ├── config/                # Configuration files (DB, Redis, RabbitMQ)## ✨ What is CodeCrafter?

│   ├── controllers/           # Business logic controllers

│   ├── middleware/            # Express middlewareCodeCrafter is a **hardcore backend platform** that enables multiple users to write, execute, and collaborate on code in real-time. Think of it as **Google Docs for Code** with a built-in secure code executor.

│   ├── models/                # Database models (MongoDB)

│   ├── services/              # Utility services (JWT, Docker, Queue)---

│   ├── utils/                 # Helper utilities

│   ├── websocket/             # Socket.IO setup (real-time)## � Key Features

│   ├── workers/               # Background job workers

│   ├── monitoring/            # Prometheus & Grafana config## 🎯 Key Features

│   ├── tests/                 # Jest test suites

│   ├── package.json           # Dependencies### 🔥 Core Features

│   ├── server.js              # Server entry point

│   ├── docker-compose.yml     # Full stack orchestration- ✅ **Real-time Collaboration** - Multiple users editing simultaneously with CRDT-based conflict resolution

│   ├── Dockerfile             # App container- ✅ **Secure Code Execution** - Docker-based sandboxed environment

│   ├── README.md              # Backend documentation- ✅ **Multi-language Support** - JavaScript, Python, Java, C/C++, Go, Rust

│   └── [docs]/                # Comprehensive guides- ✅ **JWT Authentication** - Secure user authentication and authorization

│- ✅ **WebSocket Communication** - Real-time updates and collaboration

└── frontend/                  # Frontend application (To be added)- ✅ **Session Management** - Create, join, and manage coding sessions

    └── [React/Vue/etc]

```### 🛠️ Technical Features



---- ✅ **CRDT Implementation** - Conflict-free replicated data types for collaborative editing

- ✅ **Background Workers** - RabbitMQ-based job queue for code execution

## 🚀 Quick Start- ✅ **Redis Caching** - Session storage and real-time data caching

- ✅ **Rate Limiting** - Protection against abuse and resource exhaustion

### Backend Setup- ✅ **Comprehensive Logging** - Winston-based logging with multiple levels

- ✅ **Health Monitoring** - Built-in health checks and metrics

```bash- ✅ **Auto-scaling** - Worker processes can be scaled based on demand

# 1. Navigate to backend

cd backend---



# 2. Install dependencies## 🚀 Quick Start (5 Minutes)

npm install

## 🚀 Quick Start (5 Minutes)

# 3. Start with Docker Compose (all services)

docker-compose up -d### Prerequisites



# 4. Verify services- 🐳 **Docker & Docker Compose** (recommended) OR

docker-compose ps- Node.js 16+, MongoDB 4.4+, Redis 6+, RabbitMQ 3.8+



# 5. Access the application### ⭐ Option 1: Docker (Easiest - Recommended)

# API: http://localhost:8000

# RabbitMQ UI: http://localhost:15672**1️⃣ Clone Repository**

# Prometheus: http://localhost:9090

# Grafana: http://localhost:3001```bash

```git clone https://github.com/tanmayjoddar/Muweb.git

cd Muweb

### Environment Setup```



Create `backend/.env` file with your credentials:**2️⃣ Start Everything (One Command!)**



```env```bash

# Serverdocker-compose up -d

PORT=8000```

NODE_ENV=development

**3️⃣ Verify Services**

# Database

MONGODB_URI=mongodb://codecrafter:codecrafter123@mongo:27017/muweb?authSource=admin```bash

# OR individual parameters:docker-compose ps

DB_HOST=mongo```

DB_PORT=27017

DB_NAME=muweb**4️⃣ Access Applications**

DB_USER=codecrafter

DB_PASSWORD=codecrafter123- 🌐 **App**: http://localhost:8000

- 📊 **RabbitMQ**: http://localhost:15672 (codecrafter / codecrafter123)

# Redis- 📈 **Prometheus**: http://localhost:9090

REDIS_HOST=redis- 📊 **Grafana**: http://localhost:3001 (admin / codecrafter123)

REDIS_PORT=6379

REDIS_PASSWORD=your_redis_password✅ **Done!** Your entire stack is running.

REDIS_DB=0

---

# RabbitMQ

RABBITMQ_HOST=rabbitmq### Option 2: Local Development

RABBITMQ_PORT=5672

RABBITMQ_USERNAME=guest**1️⃣ Clone Repository**

RABBITMQ_PASSWORD=guest

RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672```bash

git clone https://github.com/tanmayjoddar/Muweb.git

# JWTcd Muweb

JWT_SECRET=your_jwt_secret_key_here```

JWT_REFRESH_SECRET=your_refresh_secret_key_here

JWT_EXPIRY=900**2️⃣ Install Dependencies**

JWT_REFRESH_EXPIRY=604800

```bash

# Frontendnpm install

FRONTEND_URL=http://localhost:3000```

```

**3️⃣ Set Up Environment**

---

```bash

## 📚 Available Documentationcp .env.example .env

```

### Backend Documentation (in `backend/` directory)

**4️⃣ Start Application**

| Document | Purpose |

|----------|---------|```bash

| `README.md` | Complete backend guide with API details |npm run dev

| `DOCKER_QUICK_START.md` | Docker commands and quick reference |```

| `DOCKER_LOCAL_SETUP.md` | Local Redis & PostgreSQL setup |

| `MONGODB_TO_POSTGRES.md` | Database migration guide |**5️⃣ Start Worker (New Terminal)**

| `PRODUCTION_READY.md` | Production deployment checklist |

```bash

---npm run worker

```

## 🔧 Development Commands

---

```bash

# Navigate to backend## 🐳 Docker Commands (Copy & Paste)

cd backend

### Start/Stop Services

# Install dependencies

npm install```bash

# Start all services

# Run development serverdocker-compose up -d

npm start

# Stop all services

# Run testsdocker-compose stop

npm test

# Restart specific service

# Run tests in watch modedocker-compose restart app

npm test -- --watch

# Remove everything

# Lint codedocker-compose down

npm run lint

# Remove everything including data

# Build for production (if applicable)docker-compose down -v

npm run build```



# Docker commands### View Logs & Status

docker-compose up -d              # Start all services

docker-compose down               # Stop all services```bash

docker-compose logs -f app        # View app logs# See all containers

docker-compose exec app npm test  # Run tests in containerdocker-compose ps

```

# Real-time app logs

---docker-compose logs -f app



## 🐳 Docker Services# View last 50 lines

docker-compose logs app --tail 50

When you run `docker-compose up -d`, the following services start:

# All service logs

| Service | Port | Credentials | URL |docker-compose logs

|---------|------|-------------|-----|```

| **App** | 8000 | - | http://localhost:8000 |

| **MongoDB** | 27017 | codecrafter / codecrafter123 | - |### Database Access

| **Redis** | 6379 | (password in .env) | - |

| **RabbitMQ** | 5672 | guest / guest | - |```bash

| **RabbitMQ UI** | 15672 | guest / guest | http://localhost:15672 |# MongoDB shell

| **Nginx** | 80/443 | - | http://localhost |docker-compose exec mongo mongosh -u codecrafter -p codecrafter123

| **Prometheus** | 9090 | - | http://localhost:9090 |

| **Grafana** | 3001 | admin / admin | http://localhost:3001 |# Redis CLI

docker-compose exec redis redis-cli -a "your-password"

---

# PostgreSQL (if migrated)

## 🛠️ Tech Stackdocker-compose exec postgres psql -U codecrafter -d codecrafter

```

### Backend

- **Runtime**: Node.js 20 (Alpine)### Run Commands in Containers

- **Framework**: Express.js

- **Database**: MongoDB 6.0```bash

- **Cache**: Redis 7# Run tests

- **Message Queue**: RabbitMQ 3.12docker-compose exec app npm test

- **Real-time**: Socket.IO

- **Testing**: Jest# Database migration

- **Reverse Proxy**: Nginxdocker-compose exec app npm run migrate

- **Monitoring**: Prometheus + Grafana

- **Logging**: Winston# View metrics

docker stats

### Features```

- ✅ Real-time collaboration with WebSockets

- ✅ JWT-based authentication with refresh tokens### Scale Workers

- ✅ Session management with auto-cleanup

- ✅ Sandboxed code execution via Docker```bash

- ✅ Background job processing with RabbitMQ# Start 3 worker instances

- ✅ Rate limiting and CORS protectiondocker-compose up -d --scale worker=3

- ✅ Prometheus metrics collection

- ✅ Grafana dashboards for monitoring# View all workers

- ✅ Comprehensive test coverage with Jestdocker-compose ps | grep worker

- ✅ Production-ready with graceful shutdown```



------



## 📦 API Endpoints## 📊 Service Ports & URLs



### Authentication| Service        | URL                    | Port  | Credentials                  |

```| -------------- | ---------------------- | ----- | ---------------------------- |

POST   /api/auth/register       - Register new user| **App**        | http://localhost:8000  | 8000  | -                            |

POST   /api/auth/login          - Login user| **Nginx**      | http://localhost:80    | 80    | -                            |

POST   /api/auth/refresh        - Refresh JWT token| **RabbitMQ**   | http://localhost:15672 | 15672 | codecrafter / codecrafter123 |

POST   /api/auth/logout         - Logout user| **Prometheus** | http://localhost:9090  | 9090  | -                            |

```| **Grafana**    | http://localhost:3001  | 3001  | admin / codecrafter123       |

| **MongoDB**    | localhost              | 27017 | codecrafter / codecrafter123 |

### Sessions| **Redis**      | localhost              | 6379  | (from .env)                  |

```

GET    /api/sessions            - Get all sessions---

POST   /api/sessions            - Create new session

GET    /api/sessions/:id        - Get session details## ⚙️ Environment Configuration

PUT    /api/sessions/:id        - Update session

DELETE /api/sessions/:id        - Delete session### Create `.env` File

```

```bash

### Code Executioncp .env.example .env

``````

POST   /api/execute             - Execute code

GET    /api/execution/:id       - Get execution status### Essential Variables

GET    /api/execution/stats     - Get execution statistics

``````properties

# 🗄️ Database

For full API documentation, refer to `backend/README.md`MONGODB_URI=mongodb://codecrafter:codecrafter123@mongo:27017/codecrafter

REDIS_HOST=redis

---REDIS_PORT=6379

REDIS_PASSWORD=your_redis_password

## 🔐 Security Features

# 🐰 RabbitMQ

- **JWT Authentication**: 15-minute expiry with 7-day refresh tokensRABBITMQ_URL=amqp://rabbitmq:5672

- **Password Hashing**: Bcrypt with 12 roundsRABBITMQ_USERNAME=codecrafter

- **Rate Limiting**: 100 req/min general, 10 req/min for executionRABBITMQ_PASSWORD=codecrafter123

- **CORS Protection**: Configurable allowed origins

- **MongoDB Auth**: User credentials for authentication# 🔐 JWT

- **Credentials Security**: `.env` file excluded from version controlJWT_SECRET=your-super-secret-key-min-32-characters

JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

---

# 🖥️ Server

## 📊 Monitoring & LogsPORT=5000

NODE_ENV=development

### View LogsFRONTEND_URL=http://localhost:3000

```bash

# Application logs# 🐳 Docker Limits

docker-compose logs -f appDOCKER_TIMEOUT=30

DOCKER_MEMORY_LIMIT=128m

# MongoDB logsDOCKER_CPU_LIMIT=0.5

docker-compose logs -f mongo

# 🌐 Languages

# RabbitMQ logsSUPPORTED_LANGUAGES=javascript,python,java,cpp,c,go,rust

docker-compose logs mongo logsDEFAULT_LANGUAGE=javascript

``````



### Prometheus Metrics---

Access at: http://localhost:9090

## 🧪 Testing & Scripts

### Grafana Dashboards

Access at: http://localhost:3001```bash

- Default credentials: `admin` / `admin`# Run all tests

npm test

---

# Run specific test

## ⚠️ Troubleshootingnpm test -- auth.test.js



### Port Already in Use# Watch mode

If port 8000 is in use, modify `backend/docker-compose.yml`:npm run test:watch

```yaml

services:# With coverage

  app:npm run test:coverage

    ports:

      - "8001:8000"  # Change 8001 to your desired port# Run in Docker

```docker-compose exec app npm test

```

### MongoDB Connection Issues

```bash### Available Scripts

# Check MongoDB container

docker-compose exec mongo mongosh -u codecrafter -p codecrafter123```bash

npm run dev              # Start with hot reload

# View MongoDB logsnpm run worker           # Start code executor worker

docker-compose logs mongonpm start                # Production start

```npm test                 # Run tests

npm run migrate          # Database migration

### Redis Connection Failed```

```bash

# Test Redis connection---

docker-compose exec redis redis-cli ping

# Should respond: PONG## 📁 Project Structure

```

```

### RabbitMQ Not RespondingMuweb/

```bash├── 📂 api/              # API Routes

# Check RabbitMQ status├── 📂 config/           # Configuration

docker-compose exec rabbitmq rabbitmq-diagnostics -q ping├── 📂 controllers/      # Business Logic

├── 📂 models/           # Data Models

# View RabbitMQ logs├── 📂 middleware/       # Middleware

docker-compose logs rabbitmq├── 📂 services/         # Services

```├── 📂 websocket/        # WebSocket

├── 📂 workers/          # Background Workers

---├── 📂 tests/            # Test Suite

├── 🐳 docker-compose.yml  # Docker Setup

## 📝 Frontend Setup├── 📝 .env              # Environment

└── 📦 package.json      # Dependencies

To add the frontend:```



1. Create `frontend/` directory:---

   ```bash

   mkdir frontend## 🚨 Troubleshooting

   cd frontend

   ```### Services Won't Start



2. Initialize your frontend project (React, Vue, etc.)```bash

# Check logs

3. Update `.gitignore` if needed for frontend-specific filesdocker-compose logs mongo



---# Rebuild

docker-compose build --no-cache

## 🤝 Contributingdocker-compose up -d

```

1. Create a feature branch: `git checkout -b feature/your-feature`

2. Make your changes### Port Already in Use (Windows)

3. Commit: `git commit -m "Add your message"`

4. Push: `git push origin feature/your-feature````bash

5. Create a Pull Requestnetstat -ano | findstr :5000

taskkill /PID <PID> /F

---```



## 📄 License### Port Already in Use (Mac/Linux)



This project is licensed under the MIT License.```bash

lsof -i :5000

---kill -9 <PID>

```

## 📞 Support

### Database Connection Failed

For issues or questions, please refer to:

- Backend Docs: `backend/README.md````bash

- Technical Guide: `backend/technical\ guide/TECHNICAL_GUIDE.md`# Test connection

- Docker Guide: `backend/DOCKER_QUICK_START.md`docker-compose exec mongo mongosh

docker-compose exec redis redis-cli ping

---

# Restart services

**Last Updated**: October 30, 2025  docker-compose restart

**Project Status**: ✅ Production Ready```


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
