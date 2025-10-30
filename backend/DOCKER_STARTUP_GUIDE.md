# 🐳 Docker Startup Guide - CodeCrafter

Complete guide to starting the entire CodeCrafter application stack using Docker.

---

## Quick Start (5 Minutes)

### Prerequisites

- ✅ Docker installed ([Download](https://www.docker.com/products/docker-desktop))
- ✅ Docker Compose installed (included with Docker Desktop)
- ✅ 2GB RAM minimum available

### Start Everything (One Command!)

```bash
# Navigate to backend directory
cd backend

# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps
```

**✅ That's it! Everything is running.**

---

## Accessing Services

After running `docker-compose up -d`, access your services:

### 🌐 Application & APIs

| Service     | URL                           | Purpose             |
| ----------- | ----------------------------- | ------------------- |
| **App**     | http://localhost:8000         | Main API            |
| **Health**  | http://localhost:8000/health  | Server status       |
| **Metrics** | http://localhost:8000/metrics | Performance metrics |

**Test the API:**

```bash
# Welcome message with documentation
curl http://localhost:8000

# Health check
curl http://localhost:8000/health

# View metrics
curl http://localhost:8000/metrics
```

### 📊 Monitoring Services

| Service        | URL                    | Credentials                  |
| -------------- | ---------------------- | ---------------------------- |
| **RabbitMQ**   | http://localhost:15672 | codecrafter / codecrafter123 |
| **Prometheus** | http://localhost:9090  | (No auth)                    |
| **Grafana**    | http://localhost:3001  | admin / codecrafter123       |

### 🗄️ Database Access

```bash
# MongoDB shell
docker-compose exec mongo mongosh -u codecrafter -p codecrafter123

# Redis CLI
docker-compose exec redis redis-cli

# View all services
docker ps
```

---

## Docker Compose Commands

### Start/Stop Services

```bash
# Start all services (in background)
docker-compose up -d

# Start specific service
docker-compose up -d app

# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop app

# Restart services
docker-compose restart

# Remove everything
docker-compose down

# Remove everything + data volumes
docker-compose down -v

# View all running containers
docker-compose ps
```

### Viewing Logs

```bash
# Real-time app logs
docker-compose logs -f app

# Last 50 lines
docker-compose logs app --tail 50

# Last 100 lines of all services
docker-compose logs --tail 100

# View specific time range
docker-compose logs app --since 10m  # Last 10 minutes
```

### Run Commands in Containers

```bash
# Run tests
docker-compose exec app npm test

# Install packages
docker-compose exec app npm install package-name

# Run a shell in the app container
docker-compose exec app sh

# Run any command
docker-compose exec app npm run migrate
```

### Scale Workers

```bash
# Run 3 worker instances
docker-compose up -d --scale worker=3

# View all workers
docker-compose ps | grep worker

# Stop workers
docker-compose stop worker
```

---

## Service Details & Startup Order

### 1. **MongoDB** (Starts First)

- **Port:** 27017
- **Status:** Check with `docker-compose logs mongo | grep "STORAGE"`
- **Credentials:** codecrafter / codecrafter123
- **Volume:** `mongo_data:/data/db` (persists data)

### 2. **Redis** (Parallel)

- **Port:** 6379
- **Status:** Check with `docker-compose logs redis | grep "ready to accept"`
- **Configuration:** Uses `redis.conf`
- **Volume:** `redis_data:/data` (persists cache)

### 3. **RabbitMQ** (Parallel)

- **Ports:** 5672 (AMQP), 15672 (Management)
- **Status:** Check with `docker-compose logs rabbitmq | grep "started successfully"`
- **Credentials:** codecrafter / codecrafter123
- **Volume:** `rabbitmq_data:/var/lib/rabbitmq`

### 4. **Application** (After Databases)

- **Port:** 8000
- **Depends On:** mongo, redis, rabbitmq
- **Healthcheck:** `GET /health` (every 30s)
- **Status:** Ready when you see `🚀 CodeCrafter server running on port 8000`

### 5. **Nginx** (Reverse Proxy)

- **Ports:** 80, 443
- **Role:** Routes traffic to app
- **Configuration:** `nginx.conf`

### 6. **Prometheus** (Monitoring)

- **Port:** 9090
- **Configuration:** `prometheus.yml`
- **Scrapes:** Metrics from app every 15 seconds

### 7. **Grafana** (Dashboards)

- **Port:** 3001
- **Default Login:** admin / codecrafter123
- **Data Source:** Prometheus
- **Depends On:** prometheus

---

## Checking Service Health

### Quick Health Check

```bash
# Check all services
docker-compose ps

# Should see all containers with status "Up"
# Example output:
# CONTAINER ID   IMAGE                 COMMAND             STATUS
# abc123         backend-app          "docker-ent..."     Up (healthy)
# def456         mongo:6.0             "docker-ent..."     Up
# ghi789         redis:7-alpine        "docker-ent..."     Up
```

### Detailed Health Checks

```bash
# Test API
curl http://localhost:8000/health -s | json_pp

# Test MongoDB
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"

# Test Redis
docker-compose exec redis redis-cli ping

# Test RabbitMQ
curl http://localhost:15672/api/healthchecks/node -u codecrafter:codecrafter123
```

### View Service Details

```bash
# Show all running containers with full output
docker-compose ps -a

# Get detailed container info
docker inspect backend-app-1

# View environment variables
docker-compose config | grep -A 20 "app:"
```

---

## Troubleshooting

### Services Won't Start

**Problem:** `docker-compose up` shows errors

**Solutions:**

```bash
# 1. Check logs
docker-compose logs

# 2. Check specific service
docker-compose logs app

# 3. Rebuild without cache
docker-compose build --no-cache
docker-compose up -d

# 4. Clean everything and restart
docker-compose down -v
docker-compose up -d
```

### Port Already in Use

**Problem:** `Error: address already in use :::8000`

**Solutions (Windows):**

```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change the port in docker-compose.yml
# Change "8000:8000" to "8080:8000"
```

**Solutions (Mac/Linux):**

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Database Connection Failed

**Problem:** App shows "Failed to connect to MongoDB"

**Solutions:**

```bash
# 1. Check if MongoDB is running
docker-compose ps mongo

# 2. Check MongoDB logs
docker-compose logs mongo

# 3. Verify MongoDB is healthy
docker-compose exec mongo mongosh -u codecrafter -p codecrafter123 --eval "db.adminCommand('ping')"

# 4. Restart MongoDB
docker-compose restart mongo
```

### Memory Issues

**Problem:** Container crashes or OOM errors

**Solutions:**

```bash
# Check memory usage
docker stats

# Increase Docker memory in Docker Desktop settings:
# Preferences → Resources → Memory: 4GB or more

# Or use memory limits in docker-compose.yml:
# services:
#   app:
#     deploy:
#       resources:
#         limits:
#           memory: 512M
```

### Nginx Not Routing

**Problem:** Requests to `localhost:80` don't reach app

**Solutions:**

```bash
# Check nginx logs
docker-compose logs nginx

# Check nginx configuration
docker-compose exec nginx cat /etc/nginx/nginx.conf

# Restart nginx
docker-compose restart nginx
```

---

## Environment Configuration

### Default .env (Docker)

The app uses these settings by default in Docker:

```properties
# Database
MONGODB_URI=mongodb://codecrafter:codecrafter123@mongo:27017/codecrafter
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=default

# RabbitMQ
RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_HOST=rabbitmq
RABBITMQ_USERNAME=codecrafter
RABBITMQ_PASSWORD=codecrafter123

# Server
PORT=8000
NODE_ENV=production

# JWT Secrets (⚠️ Change these in production!)
JWT_SECRET=your-super-secret-key-min-32-characters-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-change-this

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Overriding Environment Variables

```bash
# Method 1: Update docker-compose.yml
# Change the environment section

# Method 2: Create .env file in backend directory
cp .env.example .env
# Edit .env with your values

# Method 3: Set at runtime
docker-compose up -d --env-file .env.production
```

---

## Performance Tuning

### Resource Limits

Edit `docker-compose.yml` to add limits:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 256M

  mongo:
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 1G
        reservations:
          cpus: "1"
          memory: 512M
```

### Scaling Workers

```bash
# Run 5 worker instances instead of 2
docker-compose up -d --scale worker=5

# Monitor worker scaling
watch -n 1 'docker-compose ps | grep worker'
```

---

## Backup & Restore

### Backup Data

```bash
# Backup MongoDB data
docker-compose exec mongo mongodump --out /data/backup --authenticationDatabase admin -u codecrafter -p codecrafter123

# Backup Redis data
docker-compose exec redis redis-cli BGSAVE

# Copy backup out of container
docker cp backend-mongo-1:/data/backup ./mongo-backup
```

### Restore Data

```bash
# Restore MongoDB
docker-compose exec mongo mongorestore /data/backup --authenticationDatabase admin -u codecrafter -p codecrafter123

# Restore Redis
docker cp ./redis-backup.rdb backend-redis-1:/data/
docker-compose restart redis
```

---

## Security Best Practices

### 🔐 Production Checklist

- ⚠️ **Change JWT secrets** in `.env` (min 32 characters)
- ⚠️ **Change RabbitMQ password** from default `codecrafter123`
- ⚠️ **Change MongoDB password** from default
- ✅ **Use HTTPS** (configure in nginx.conf)
- ✅ **Enable authentication** on all services
- ✅ **Set NODE_ENV=production**
- ✅ **Use strong JWT secrets** (32+ characters)
- ✅ **Keep Docker updated**
- ✅ **Use environment variables** for secrets (not hardcoded)
- ✅ **Regular backups** of database

### Viewing Secrets (Be Careful!)

```bash
# ⚠️ Only in development!
# View all environment variables
docker-compose config | grep -E "JWT_SECRET|PASSWORD"

# View from running container
docker-compose exec app env | grep SECRET
```

---

## Monitoring & Logs

### Real-Time Monitoring

```bash
# Watch all services
docker stats

# Or with update interval
watch -n 1 'docker stats --no-stream'
```

### Centralized Logging

```bash
# View logs with timestamps
docker-compose logs -t

# Follow logs from specific service
docker-compose logs -f app mongo redis

# Search logs
docker-compose logs | grep "error"
```

### Prometheus & Grafana

1. Open http://localhost:3001 (Grafana)
2. Login: admin / codecrafter123
3. Go to Dashboards → Add Data Source
4. Select Prometheus → URL: http://prometheus:9090
5. Create dashboards for monitoring

---

## Updating & Maintenance

### Update Docker Images

```bash
# Pull latest images
docker-compose pull

# Rebuild app with latest dependencies
docker-compose build --no-cache app
docker-compose up -d
```

### Clean Up Unused Resources

```bash
# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

---

## Advanced: Custom Docker Setup

### Using Different Port

```bash
# In docker-compose.yml, change:
# ports:
#   - "8080:8000"  # Use 8080 instead of 8000

docker-compose up -d
# Now access at http://localhost:8080
```

### Using External Database

```bash
# In docker-compose.yml, remove mongo service
# Set MONGODB_URI in environment:
# environment:
#   - MONGODB_URI=mongodb://user:pass@external-host:27017/db

docker-compose up -d app redis rabbitmq nginx
```

### Docker Network

```bash
# View networks
docker network ls

# Inspect network
docker network inspect backend_codecrafter-network

# Connect container to network
docker network connect backend_codecrafter-network container-name
```

---

## Cheat Sheet

```bash
# Start everything
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Stop services
docker-compose stop

# Remove everything
docker-compose down -v

# Run command in container
docker-compose exec app npm test

# Scale workers
docker-compose up -d --scale worker=5

# Rebuild image
docker-compose build --no-cache app

# Push to production
docker-compose push app
```

---

## Getting Help

```bash
# Show detailed logs
docker-compose logs app --tail 200

# Check docker-compose.yml syntax
docker-compose config

# Get docker-compose version
docker-compose --version

# View all services and ports
docker-compose ps -a

# Inspect service configuration
docker-compose config | grep -A 30 "app:"
```

---

## Next Steps

✅ **Services are running!**

1. **Test the API**: http://localhost:8000
2. **View RabbitMQ**: http://localhost:15672
3. **Setup monitoring**: Access Grafana at http://localhost:3001
4. **Create a session**: `POST /api/sessions`
5. **Execute code**: `POST /api/execute/run`

**Documentation:**

- [Docker Quick Start](./DOCKER_QUICK_START.md)
- [Local Setup Guide](./DOCKER_LOCAL_SETUP.md)
- [Main README](../README.md)

---

<div align="center">

**Happy Coding! 🚀**

[⬆ Back to Top](#-docker-startup-guide---codecrafter)

</div>
