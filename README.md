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

