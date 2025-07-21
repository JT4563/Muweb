# CodeCrafter Production Deployment Guide

## Quick Start

### 1. Build and Start Services
```bash
# Build all services
npm run docker:build

# Start main application services
docker-compose up -d

# Start monitoring stack (optional)
docker-compose -f docker-compose.monitoring.yml up -d
```

### 2. Initialize Services
```bash
# Start the worker process
npm run worker

# Or using Docker
docker-compose exec app npm run worker
```

### 3. Access Services
- **Main Application**: http://localhost:3000
- **Grafana Dashboard**: http://localhost:3001 (admin/admin123)
- **Prometheus**: http://localhost:9090
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

## Service Architecture

### How Service Links Work

The CodeCrafter platform uses a microservices architecture with the following service interactions:

#### 1. **API Gateway (Express App)**
- **Entry Point**: `app.js` - Main Express application
- **Port**: 3000
- **Links Generated**: 
  - Session URLs: `https://yourapp.com/session/:sessionId`
  - API Endpoints: `https://yourapp.com/api/sessions`, `/api/auth`, `/api/execute`
  - WebSocket Connection: `ws://yourapp.com/socket.io`

#### 2. **Real-time Collaboration (Socket.IO)**
- **Service**: `websocket/socket.server.js`
- **Connection**: Established via Socket.IO client
- **Link Format**: `ws://yourapp.com/socket.io/?sessionId=${sessionId}&token=${jwt}`
- **Features**: Live code editing, cursor tracking, chat

#### 3. **Code Execution Pipeline**
```
Client Request → Express API → RabbitMQ Queue → Worker → Docker → Results
```

**Flow:**
1. **Submit Code**: `POST /api/execute` with session ID and code
2. **Job Queue**: Request queued in RabbitMQ for processing
3. **Worker Processing**: Background worker picks up job
4. **Docker Execution**: Code runs in isolated container
5. **Result Delivery**: Results stored and sent back via WebSocket

#### 4. **Service Discovery & Links**

**Session Links Generation:**
```javascript
// Example: How session links are created
const sessionLink = `${process.env.BASE_URL}/session/${session._id}`;
const joinLink = `${sessionLink}?invite=${session.inviteCode}`;
```

**API Endpoint Structure:**
- `GET /api/sessions` - List user's sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get session details
- `POST /api/execute` - Execute code
- `GET /api/execute/status/:jobId` - Check execution status

### Environment Variables

```env
# Application
NODE_ENV=production
PORT=3000
BASE_URL=https://your-domain.com

# Database
MONGODB_URI=mongodb://mongo:27017/codecrafter
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672

# JWT
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Docker (for code execution)
DOCKER_HOST=unix:///var/run/docker.sock
```

## Deployment Options

### Option 1: Docker Compose (Recommended)
```bash
# Production deployment
docker-compose -f docker-compose.yml up -d

# With monitoring
docker-compose -f docker-compose.yml -f docker-compose.monitoring.yml up -d
```

### Option 2: Kubernetes
```bash
# Apply Kubernetes manifests (you'll need to create these)
kubectl apply -f k8s/
```

### Option 3: Manual Deployment
```bash
# Install dependencies
npm install --production

# Start services
npm start & npm run worker
```

## Scaling Configuration

### Horizontal Scaling
```yaml
# docker-compose.override.yml
version: '3.8'
services:
  app:
    deploy:
      replicas: 3
  
  worker:
    deploy:
      replicas: 5
```

### Load Balancing
```nginx
# nginx.conf
upstream codecrafter_app {
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://codecrafter_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring & Observability

### Grafana Dashboards
1. **Application Dashboard**: Request rates, response times, error rates
2. **System Dashboard**: CPU, memory, disk usage
3. **Docker Dashboard**: Container metrics
4. **Business Dashboard**: Active sessions, code executions

### Key Metrics
- **Request Rate**: `rate(http_requests_total[5m])`
- **Error Rate**: `rate(http_requests_total{status=~"5.."}[5m])`
- **Response Time**: `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))`
- **Active Sessions**: `websocket_connections_active`
- **Queue Depth**: `rabbitmq_queue_messages`

### Alerts
```yaml
# prometheus/rules/alerts.yml
groups:
  - name: codecrafter
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High error rate detected
```

## Security Considerations

### 1. Container Security
- ✅ Read-only root filesystem
- ✅ Memory limits (128MB per execution)
- ✅ CPU limits (0.5 CPU per execution)
- ✅ No network access for code execution
- ✅ Temporary filesystem for output

### 2. Authentication & Authorization
- ✅ JWT with refresh tokens
- ✅ Session-based access control
- ✅ Rate limiting on all endpoints
- ✅ Input validation and sanitization

### 3. Network Security
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ HTTPS enforcement (in production)
- ✅ WebSocket authentication

## Troubleshooting

### Common Issues

#### 1. Docker Connection Issues
```bash
# Check Docker daemon
docker info

# Check container logs
docker-compose logs app
docker-compose logs worker
```

#### 2. RabbitMQ Connection Problems
```bash
# Check RabbitMQ status
docker-compose exec rabbitmq rabbitmqctl status

# View queue stats
docker-compose exec rabbitmq rabbitmqctl list_queues
```

#### 3. Database Connection Issues
```bash
# Check MongoDB
docker-compose exec mongo mongo --eval "db.adminCommand('ismaster')"

# Check Redis
docker-compose exec redis redis-cli ping
```

### Health Checks
- **Application**: `GET /health`
- **Database**: `GET /health/db`
- **Queue**: `GET /health/queue`
- **Docker**: `GET /health/docker`

## Performance Tuning

### 1. Node.js Optimization
```javascript
// cluster.js - Multi-process setup
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  require('./server.js');
}
```

### 2. Database Optimization
```javascript
// Indexes for better performance
db.sessions.createIndex({ "owner": 1, "createdAt": -1 });
db.sessions.createIndex({ "participants.user": 1 });
db.logs.createIndex({ "sessionId": 1, "timestamp": -1 });
```

### 3. Redis Caching
```javascript
// Cache frequently accessed data
const sessionCache = new Map();
const CACHE_TTL = 300; // 5 minutes
```

## Backup & Recovery

### Database Backup
```bash
# MongoDB backup
docker-compose exec mongo mongodump --out /backup

# Redis backup
docker-compose exec redis redis-cli SAVE
```

### Restore Procedure
```bash
# MongoDB restore
docker-compose exec mongo mongorestore /backup

# Redis restore
docker-compose exec redis redis-cli FLUSHALL
docker-compose exec redis redis-cli --rdb /data/dump.rdb
```

This completes your CodeCrafter collaborative code execution platform! 🚀
