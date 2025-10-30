# 🐳 Docker Quick Start Guide

Complete guide to running CodeCrafter using Docker and Docker Compose.

---

## 🚀 Quick Commands

### Start Everything

```bash
# Start all services (App, MongoDB, Redis, RabbitMQ, Nginx, Prometheus, Grafana)
docker-compose up -d

# View logs in real-time
docker-compose logs -f app

# Stop all services
docker-compose down
```

### Start Specific Services

```bash
# Database services only
docker-compose up -d mongo redis rabbitmq

# Application server only
docker-compose up -d app

# Application with workers
docker-compose up -d app worker

# Nginx reverse proxy
docker-compose up -d nginx
```

---

## 📊 Service URLs & Ports

| Service                 | URL                    | Port  | Credentials                  |
| ----------------------- | ---------------------- | ----- | ---------------------------- |
| **App API**             | http://localhost:5000  | 5000  | -                            |
| **Nginx**               | http://localhost:80    | 80    | -                            |
| **RabbitMQ Management** | http://localhost:15672 | 15672 | codecrafter / codecrafter123 |
| **Prometheus**          | http://localhost:9090  | 9090  | -                            |
| **Grafana Dashboard**   | http://localhost:3001  | 3001  | admin / codecrafter123       |
| **MongoDB**             | localhost:27017        | 27017 | codecrafter / codecrafter123 |
| **Redis**               | localhost:6379         | 6379  | (password in .env)           |

---

## 🔧 Essential Docker Commands

### Container Management

```bash
# View running containers
docker-compose ps

# View container logs
docker-compose logs -f app              # App logs (follow)
docker-compose logs app --tail 50       # Last 50 lines
docker-compose logs mongo               # MongoDB logs
docker-compose logs redis               # Redis logs
docker-compose logs rabbitmq            # RabbitMQ logs

# Execute command in container
docker-compose exec app npm test
docker-compose exec app npm run migration
docker-compose exec mongo mongosh
docker-compose exec redis redis-cli

# Stop specific service
docker-compose stop app
docker-compose stop mongo

# Remove everything
docker-compose down                     # Stop and remove containers
docker-compose down -v                  # Also remove volumes
docker-compose down --rmi all           # Also remove images
```

### Image Management

```bash
# Build all images
docker-compose build

# Build without cache
docker-compose build --no-cache

# Build specific service
docker-compose build app

# View images
docker images | grep muweb

# Clean up unused images
docker image prune -a
```

### Network & Volume Management

```bash
# View networks
docker network ls

# View volumes
docker volume ls

# Clean up unused volumes
docker volume prune

# Inspect volume (check data)
docker volume inspect muweb_mongo_data
```

### Monitoring & Debugging

```bash
# View resource usage
docker stats

# View system info
docker-compose config              # Show docker-compose config

# Check service health
docker-compose ps                  # Shows health status

# View service dependencies
docker-compose up --dry-run
```

---

## 🛠️ Development Workflow

### First Time Setup

```bash
# Clone and setup
git clone https://github.com/tanmayjoddar/Muweb.git
cd Muweb

# Create environment file
cp .env.example .env
# Edit .env with your config

# Start services
docker-compose up -d

# Verify all services are running
docker-compose ps

# Check app logs
docker-compose logs -f app
```

### Daily Development

```bash
# Start services
docker-compose up -d

# Watch app logs
docker-compose logs -f app

# Run tests
docker-compose exec app npm test

# View database
docker-compose exec mongo mongosh

# Check Redis
docker-compose exec redis redis-cli

# Stop services when done
docker-compose down
```

### Making Code Changes

```bash
# If using hot reload (nodemon)
# Just make changes - app reloads automatically

# If changes to dependencies
docker-compose rebuild app
docker-compose up -d app

# If database schema changes
docker-compose exec app npm run migration
docker-compose restart app
```

---

## 📝 Environment Variables

### Critical for Docker

```bash
# Database - Use Docker service names
MONGODB_URI=mongodb://codecrafter:codecrafter123@mongo:27017/codecrafter
REDIS_HOST=redis              # Docker service name
REDIS_PORT=6379
REDIS_PASSWORD=your_password

# RabbitMQ - Use Docker service names
RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_HOST=rabbitmq
RABBITMQ_USERNAME=codecrafter
RABBITMQ_PASSWORD=codecrafter123

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key

# Execution
DOCKER_TIMEOUT=30              # seconds
DOCKER_MEMORY_LIMIT=128m
DOCKER_CPU_LIMIT=0.5
```

---

## 🐛 Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs mongo

# Rebuild images
docker-compose build --no-cache

# Start fresh
docker-compose down -v
docker-compose up -d
```

### Port already in use

```bash
# Find process on port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Kill process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Mac/Linux
```

### Database connection failed

```bash
# Check if MongoDB is running
docker-compose logs mongo

# Check network connectivity
docker-compose exec app ping mongo

# Verify credentials in .env
docker-compose exec mongo mongosh -u codecrafter -p codecrafter123
```

### Permission denied errors

```bash
# Linux: Fix Docker socket permissions
sudo usermod -aG docker $USER
newgrp docker
```

---

## 🔄 Working with Multiple Workers

### Scale workers

```bash
# Start 3 worker instances
docker-compose up -d --scale worker=3

# View worker processes
docker-compose ps | grep worker

# Stop specific worker
docker-compose stop worker_1
```

### Monitor workers

```bash
# View worker logs
docker-compose logs -f worker

# Check resource usage
docker stats
```

---

## 📦 Docker Image Details

### App Image

- **Base**: Node 20-Alpine
- **Size**: ~150MB
- **Exposed Port**: 5000
- **Health Check**: HTTP /health endpoint every 30s

### Worker Image

- **Base**: Node 20-Alpine
- **Size**: ~150MB
- **Purpose**: Process code execution jobs from RabbitMQ

### Database Images

- **MongoDB**: mongo:6.0 (~400MB)
- **Redis**: redis:7-alpine (~30MB)
- **RabbitMQ**: rabbitmq:3.12-management-alpine (~200MB)

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

```bash
# Build images
docker-compose build

# Run tests
docker-compose exec app npm test

# Check security
docker images --digests

# Verify all services
docker-compose ps

# Check logs for errors
docker-compose logs --tail 100
```

### Production Commands

```bash
# Start with restart policy
docker-compose up -d

# Monitor health
docker-compose ps

# View metrics
# Access Prometheus: http://localhost:9090
# Access Grafana: http://localhost:3001

# Backup database
docker-compose exec mongo mongodump --out /backup

# Scale workers for load
docker-compose up -d --scale worker=5
```

---

## 🔗 Related Documentation

- **[Local Redis & PostgreSQL Setup](./DOCKER_LOCAL_SETUP.md)** - Run databases locally
- **[MongoDB to PostgreSQL Migration](./MONGODB_TO_POSTGRES.md)** - Migrate your data
- **[Docker Compose Config](./docker-compose.yml)** - Full configuration
- **[Dockerfile](./Dockerfile)** - App image build details
