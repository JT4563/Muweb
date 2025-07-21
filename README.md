# 🚀 CodeCrafter - Collaborative Code Execution Platform

> A hardcore backend project featuring real-time collaborative code editing and secure execution engine

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://docker.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-orange.svg)](https://socket.io/)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Features

### 🔥 Core Features
- **Real-time Collaboration**: Multiple users can edit code simultaneously with CRDT-based conflict resolution
- **Secure Code Execution**: Docker-based sandboxed execution environment
- **Multi-language Support**: JavaScript, Python, Java, C/C++, Go, Rust
- **JWT Authentication**: Secure user authentication and authorization
- **WebSocket Communication**: Real-time updates and collaboration
- **Session Management**: Create, join, and manage coding sessions

### 🛠️ Technical Features
- **CRDT Implementation**: Conflict-free replicated data types for collaborative editing
- **Background Workers**: RabbitMQ-based job queue for code execution
- **Redis Caching**: Session storage and real-time data caching
- **Rate Limiting**: Protection against abuse and resource exhaustion
- **Comprehensive Logging**: Winston-based logging with multiple levels
- **Health Monitoring**: Built-in health checks and metrics
- **Auto-scaling**: Worker processes can be scaled based on demand

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Docker & Docker Compose
- MongoDB 4.4+
- Redis 6+
- RabbitMQ 3.8+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/TJ456/codecrafter.git
cd codecrafter
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start with Docker Compose**
```bash
npm run docker:up
```

5. **Or run in development mode**
```bash
# Start all services
npm run dev

# In separate terminals:
npm run worker  # Start code execution worker
```

## 🔧 Environment Configuration

Create a `.env` file from `.env.example` and configure your settings.

## 📊 Project Status

✅ **PHASE 1: COMPLETED** - Project Bootstrapping & REST API Foundation
- [x] Express server setup with security middleware
- [x] JWT authentication system with refresh tokens
- [x] User model with advanced profile features
- [x] Session management with collaborative features
- [x] Input validation and error handling
- [x] MongoDB integration with proper schemas
- [x] Redis configuration for caching and sessions

✅ **PHASE 2: COMPLETED** - WebSocket & Real-Time Collaboration  
- [x] Socket.IO server with authentication
- [x] Real-time code collaboration with CRDT
- [x] Session joining/leaving functionality
- [x] Cursor tracking and live updates
- [x] Chat system for team communication
- [x] Participant management

🚧 **PHASE 3: IN PROGRESS** - Workers, Queues, Scaling, Observability
- [x] Comprehensive logging with Winston
- [x] Docker Compose setup for full stack
- [x] Rate limiting and security features
- [x] Health checks and monitoring endpoints
- [ ] RabbitMQ worker implementation
- [ ] Docker code execution service
- [ ] Metrics and observability setup

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB, Redis
- **Message Queue**: RabbitMQ
- **Authentication**: JWT with refresh tokens
- **Real-time**: WebSocket with CRDT
- **Logging**: Winston with multiple transports
- **Security**: Helmet, CORS, Rate limiting
- **Deployment**: Docker, Docker Compose
- **Monitoring**: Prometheus, Grafana

## 📁 Project Structure

```
codecrafter/
├── api/                 # REST API routes
├── config/             # Database and service configurations
├── controllers/        # Business logic controllers
├── middleware/         # Express middleware
├── models/            # Database models
├── services/          # Business services
├── utils/             # Utility functions
├── websocket/         # WebSocket server and CRDT
├── workers/           # Background job workers
├── logs/              # Application logs
├── docker-compose.yml # Multi-service deployment
├── Dockerfile         # Container configuration
└── README.md         # This file
```

## 🚀 Getting Started

### Quick Start with Docker
```bash
# Clone and enter directory
git clone <repo> && cd codecrafter

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app
```

### Development Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start in development mode
npm run dev
```

## 📖 API Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get user profile

### Sessions
- `POST /api/sessions` - Create coding session
- `GET /api/sessions` - Get user sessions
- `GET /api/sessions/:id` - Get session details
- `POST /api/sessions/:id/join` - Join session

### Code Execution
- `POST /api/execute` - Execute code in sandbox

## 🔌 WebSocket Events

### Session Events
- `session:join` - Join a coding session
- `session:leave` - Leave a session
- `session:participant_joined` - New participant notification

### Collaboration Events
- `code:change` - Real-time code changes
- `code:cursor` - Cursor position updates
- `chat:message` - Team chat messages

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Rate Limiting** for API protection
- **Input Validation** for all endpoints
- **CORS Configuration** for cross-origin requests
- **Helmet.js** for security headers
- **Docker Sandboxing** for code execution

## 📊 Monitoring & Health

- **Health Check**: `GET /health`
- **Metrics**: `GET /metrics`
- **Comprehensive Logging** with Winston
- **Connection Monitoring** for all services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ for collaborative coding**