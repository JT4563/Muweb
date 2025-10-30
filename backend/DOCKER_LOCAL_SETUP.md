# 🗄️ Local Redis & PostgreSQL Setup with Docker

Complete guide to running Redis and PostgreSQL locally using Docker for development.

---

## 🚀 Quick Start - Individual Services

### Run Redis Locally

```bash
# Simple Redis container
docker run -d \
  --name redis-local \
  -p 6379:6379 \
  redis:7-alpine

# Redis with persistent storage
docker run -d \
  --name redis-local \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7-alpine redis-server --appendonly yes

# Redis with password
docker run -d \
  --name redis-local \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7-alpine redis-server --requirepass "your-password" --appendonly yes
```

### Run PostgreSQL Locally

```bash
# Simple PostgreSQL container
docker run -d \
  --name postgres-local \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=codecrafter \
  postgres:15-alpine

# PostgreSQL with persistent storage
docker run -d \
  --name postgres-local \
  -p 5432:5432 \
  -e POSTGRES_USER=codecrafter \
  -e POSTGRES_PASSWORD=codecrafter123 \
  -e POSTGRES_DB=codecrafter \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:15-alpine

# PostgreSQL with custom config
docker run -d \
  --name postgres-local \
  -p 5432:5432 \
  -e POSTGRES_USER=codecrafter \
  -e POSTGRES_PASSWORD=codecrafter123 \
  -e POSTGRES_DB=codecrafter \
  -v postgres-data:/var/lib/postgresql/data \
  -v ./postgres.conf:/etc/postgresql/postgresql.conf \
  postgres:15-alpine -c config_file=/etc/postgresql/postgresql.conf
```

---

## 📋 Docker Compose Setup

Create `docker-compose.local.yml`:

```yaml
version: "3.8"

services:
  redis:
    image: redis:7-alpine
    container_name: redis-dev
    ports:
      - "6379:6379"
    command: redis-server --requirepass "devpass123" --appendonly yes
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  postgres:
    image: postgres:15-alpine
    container_name: postgres-dev
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: codecrafter
      POSTGRES_PASSWORD: codecrafter123
      POSTGRES_DB: codecrafter
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=en_US.UTF-8"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U codecrafter"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: pgadmin-dev
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    depends_on:
      - postgres

volumes:
  redis-data:
  postgres-data:
```

### Start services with compose

```bash
# Start Redis and PostgreSQL
docker-compose -f docker-compose.local.yml up -d

# View status
docker-compose -f docker-compose.local.yml ps

# Stop services
docker-compose -f docker-compose.local.yml down

# Stop and remove volumes
docker-compose -f docker-compose.local.yml down -v
```

---

## 🔌 Connection Strings

### Redis

```bash
# Redis CLI
redis-cli -h localhost -p 6379 -a "devpass123"

# In Node.js
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379,
  password: 'devpass123'
});

# In .env file
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=devpass123
```

### PostgreSQL

```bash
# PostgreSQL CLI
psql -h localhost -U codecrafter -d codecrafter
# Password: codecrafter123

# Connection string
postgresql://codecrafter:codecrafter123@localhost:5432/codecrafter

# In .env file
DATABASE_URL=postgresql://codecrafter:codecrafter123@localhost:5432/codecrafter
DB_HOST=localhost
DB_PORT=5432
DB_USER=codecrafter
DB_PASSWORD=codecrafter123
DB_NAME=codecrafter

# pgAdmin web UI
# URL: http://localhost:5050
# Email: admin@example.com
# Password: admin123
```

---

## 📊 Common Operations

### Redis Operations

```bash
# Connect to Redis
docker-compose -f docker-compose.local.yml exec redis redis-cli -a devpass123

# Inside Redis CLI
> PING                    # Test connection
> SET key value           # Set key-value
> GET key                 # Get value
> DEL key                 # Delete key
> FLUSHALL                # Clear all data
> KEYS *                  # List all keys
> INFO                    # Server info

# Check Redis from command line
docker-compose -f docker-compose.local.yml exec redis redis-cli -a devpass123 PING
```

### PostgreSQL Operations

```bash
# Connect to PostgreSQL
docker-compose -f docker-compose.local.yml exec postgres psql -U codecrafter -d codecrafter

# Inside psql
> \dt                     # List tables
> \du                     # List users
> SELECT * FROM table;    # Query table
> \q                      # Quit

# Create database
docker-compose -f docker-compose.local.yml exec postgres psql -U codecrafter -c "CREATE DATABASE new_db;"

# Backup database
docker-compose -f docker-compose.local.yml exec postgres pg_dump -U codecrafter codecrafter > backup.sql

# Restore database
docker-compose -f docker-compose.local.yml exec -T postgres psql -U codecrafter < backup.sql
```

---

## 🔧 Configuration Files

### Redis Configuration (`redis.conf`)

```properties
# Port
port 6379

# Password
requirepass devpass123

# Persistence
save 900 1
save 300 10
save 60 10000

# Memory management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Logging
loglevel notice
logfile ""

# Append Only File
appendonly yes
appendfsync everysec
```

### PostgreSQL Init Script (`init.sql`)

```sql
-- Create schemas
CREATE SCHEMA IF NOT EXISTS public;

-- Create tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_sessions_owner ON sessions(owner_id);
CREATE INDEX idx_logs_user ON logs(user_id);
CREATE INDEX idx_logs_created ON logs(created_at);

-- Create roles and permissions
CREATE ROLE app_user WITH LOGIN PASSWORD 'app_password';
GRANT CONNECT ON DATABASE codecrafter TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

---

## 🐛 Troubleshooting

### Redis won't connect

```bash
# Check if container is running
docker-compose -f docker-compose.local.yml ps

# Check logs
docker-compose -f docker-compose.local.yml logs redis

# Test connection
docker-compose -f docker-compose.local.yml exec redis redis-cli ping

# Restart Redis
docker-compose -f docker-compose.local.yml restart redis
```

### PostgreSQL won't connect

```bash
# Check if container is running
docker-compose -f docker-compose.local.yml ps

# Check logs
docker-compose -f docker-compose.local.yml logs postgres

# Test connection
docker-compose -f docker-compose.local.yml exec postgres pg_isready -U codecrafter

# Restart PostgreSQL
docker-compose -f docker-compose.local.yml restart postgres
```

### Port already in use

```bash
# Windows
netstat -ano | findstr :6379    # Redis
netstat -ano | findstr :5432    # PostgreSQL

# Mac/Linux
lsof -i :6379                   # Redis
lsof -i :5432                   # PostgreSQL

# Kill process
taskkill /PID <PID> /F          # Windows
kill -9 <PID>                   # Mac/Linux
```

### Data persistence issues

```bash
# Check volumes
docker volume ls

# Remove and recreate volumes
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d
```

---

## 💾 Backup & Restore

### Redis Backup

```bash
# Automatic backup (RDB file)
# Located at: /var/lib/docker/volumes/redis-data/_data/dump.rdb

# Manual backup
docker-compose -f docker-compose.local.yml exec redis redis-cli BGSAVE

# Copy backup to host
docker cp redis-dev:/data/dump.rdb ./redis-backup.rdb
```

### PostgreSQL Backup

```bash
# Full database backup
docker-compose -f docker-compose.local.yml exec postgres \
  pg_dump -U codecrafter codecrafter > backup.sql

# Backup with specific format
docker-compose -f docker-compose.local.yml exec postgres \
  pg_dump -U codecrafter -Fc codecrafter > backup.tar

# Restore from backup
docker-compose -f docker-compose.local.yml exec -T postgres \
  psql -U codecrafter < backup.sql
```

---

## 🔗 Integration with CodeCrafter

### Update `.env` for local development

```bash
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=devpass123

# PostgreSQL (if migrating from MongoDB)
DATABASE_URL=postgresql://codecrafter:codecrafter123@localhost:5432/codecrafter
DB_HOST=localhost
DB_PORT=5432
DB_USER=codecrafter
DB_PASSWORD=codecrafter123
DB_NAME=codecrafter
```

### Start all services

```bash
# Terminal 1: Start databases
docker-compose -f docker-compose.local.yml up -d

# Terminal 2: Start application
npm run dev
```

---

## 📚 Related Documentation

- **[Docker Quick Start](./DOCKER_QUICK_START.md)** - Full Docker guide
- **[MongoDB to PostgreSQL Migration](./MONGODB_TO_POSTGRES.md)** - Migration guide
- **[Main README](./README.md)** - Project overview
