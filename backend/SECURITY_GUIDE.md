# 🔐 Security Guide - CodeCrafter

Complete security guide for deploying and maintaining CodeCrafter safely in production.

---

## Executive Summary

CodeCrafter implements **multiple layers of security** to protect user data and prevent unauthorized access:

- ✅ JWT-based authentication with refresh tokens
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Rate limiting (100 req/min general, 10 req/min code execution)
- ✅ CORS protection with configurable origins
- ✅ Helmet.js security headers
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Encrypted environment variables
- ✅ Graceful error handling (no sensitive data leaks)

---

## API Security

### 1. Root Endpoint (GET /)

**Development Mode:**

```json
{
  "message": "Welcome to CodeCrafter API 🚀",
  "version": "1.0.0",
  "status": "Server is running",
  "environment": "development",
  "endpoints": {
    /* Full API documentation */
  }
}
```

**Production Mode (Without Authentication):**

```json
{
  "message": "Welcome to CodeCrafter API 🚀",
  "version": "1.0.0",
  "status": "Server is running",
  "environment": "production",
  "info": "For API documentation, please authenticate or visit development environment",
  "links": {
    "health": "/health",
    "docs": "See README.md for API documentation"
  }
}
```

**Why:** Hides detailed API structure in production to prevent reconnaissance attacks.

### 2. Authentication Endpoints

**Signup (POST /api/auth/signup)**

```json
{
  "email": "user@example.com",
  "password": "min-8-chars-strong-password",
  "name": "User Name"
}
```

**Security Measures:**

- ✅ Password minimum 8 characters
- ✅ Email validation (RFC 5322)
- ✅ Bcrypt hashing with 12 rounds
- ✅ Duplicate email prevention
- ✅ Rate limiting: 10 signup attempts / 15 minutes / IP

**Login (POST /api/auth/login)**

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "tokens": {
    "accessToken": "jwt-token-15m-expiry",
    "refreshToken": "jwt-token-7d-expiry"
  }
}
```

**Security Measures:**

- ✅ JWT access token (15 minutes expiry)
- ✅ Refresh token (7 days expiry)
- ✅ Tokens stored in secure HTTP-only cookies (recommended)
- ✅ Rate limiting: 5 failed attempts / 15 minutes / IP

**Token Refresh (POST /api/auth/refresh)**

```json
{
  "refreshToken": "refresh-token-here"
}
```

**Response:**

```json
{
  "success": true,
  "accessToken": "new-jwt-token"
}
```

**Security Measures:**

- ✅ Only valid refresh tokens accepted
- ✅ Token rotation to prevent replay attacks
- ✅ Refresh token invalidation on logout

---

## JWT Token Security

### Token Structure

```
Header.Payload.Signature
```

**Header:**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**

```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "iat": 1630703200,
  "exp": 1630704060
}
```

### Token Secrets

⚠️ **CRITICAL:** Change JWT secrets in production!

```env
# Minimum 32 characters, random string
JWT_SECRET=your-super-secret-key-min-32-characters-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-change-this-in-production
```

**Generate Strong Secrets:**

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -SetSeed (Get-Random) -Maximum 10000000000000000).ToString() + (Get-Date).Ticks)) | Select-Object -First 43
```

---

## Rate Limiting

### General Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Status:** 429 Too Many Requests
- **Reset:** After 15-minute window

### Code Execution Rate Limiting

- **Limit:** 10 executions per minute per IP
- **Exception:** Premium users (bypass if `req.user.isPremium === true`)
- **Purpose:** Prevent DoS attacks via code execution

**Example Error:**

```json
{
  "error": "Too many code execution requests, please try again later."
}
```

---

## CORS (Cross-Origin Resource Sharing)

### Configuration

**Development:**

```javascript
{
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}
```

**Production:**

```javascript
{
  origin: process.env.FRONTEND_URL, // e.g., https://example.com
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}
```

### Why CORS Matters

- Prevents malicious websites from accessing your API
- Only allows requests from specified origins
- Use environment variables for frontend URLs

---

## Security Headers (Helmet.js)

### Implemented Headers

| Header                            | Purpose                  |
| --------------------------------- | ------------------------ |
| `X-Frame-Options: DENY`           | Prevent clickjacking     |
| `X-Content-Type-Options: nosniff` | Prevent MIME-sniffing    |
| `X-XSS-Protection: 1; mode=block` | Block XSS attacks        |
| `Strict-Transport-Security`       | Force HTTPS              |
| `Content-Security-Policy`         | Control resource loading |

### CSP Configuration

```
default-src 'self';
script-src 'self' https://trusted-cdn.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: https://images.unsplash.com;
connect-src 'self' ws: wss:;
```

---

## Password Security

### Requirements

- ✅ Minimum 8 characters
- ⚠️ Recommended: 12+ characters with mixed case, numbers, symbols
- ✅ Hashed with Bcrypt (12 rounds)
- ✅ Never stored in plain text
- ✅ Never transmitted over HTTP

### Bcrypt Hashing

```javascript
const bcrypt = require("bcrypt");

// Hashing
const hashedPassword = await bcrypt.hash(password, 12);

// Verification
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

**Why Bcrypt?**

- Slow by design (protects against brute force)
- Built-in salt generation
- Adaptive work factor (increase iterations as CPU gets faster)

---

## Environment Variables

### .env File (Never Commit!)

```bash
# Database
MONGODB_URI=mongodb://codecrafter:codecrafter123@mongo:27017/codecrafter

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=strong-redis-password

# RabbitMQ
RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_USERNAME=codecrafter
RABBITMQ_PASSWORD=strong-rabbitmq-password

# JWT Secrets (Generate with openssl rand -base64 32)
JWT_SECRET=your-32-char-random-string-here
JWT_REFRESH_SECRET=your-32-char-random-string-here

# Server
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Logging
LOG_LEVEL=info
```

### .env.example (Safe to Commit)

```bash
MONGODB_URI=mongodb://username:password@host:27017/database
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_password
RABBITMQ_URL=amqp://rabbitmq:5672
RABBITMQ_USERNAME=username
RABBITMQ_PASSWORD=password
JWT_SECRET=min-32-characters-random-string
JWT_REFRESH_SECRET=min-32-characters-random-string
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
```

---

## Database Security

### MongoDB

**Authentication:**

```bash
# Always require authentication
mongod --auth

# Create admin user
use admin
db.createUser({ user: "admin", pwd: "password", roles: ["root"] })

# Create application user
db.createUser({ user: "codecrafter", pwd: "strong-password", roles: ["dbOwner"] })
```

**Connection String:**

```
mongodb://codecrafter:password@host:27017/codecrafter?authSource=admin&ssl=true
```

**Best Practices:**

- ✅ Use separate users for each application
- ✅ Use strong passwords (20+ characters)
- ✅ Enable authentication (`--auth` flag)
- ✅ Use SSL/TLS for connections
- ✅ Regular backups to encrypted storage
- ✅ Monitor access logs

### Redis

**Disable Dangerous Commands:**

```conf
# redis.conf
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG "CONFIG_abc123"
```

**Require Password:**

```conf
# redis.conf
requirepass your-strong-redis-password
```

**Connection String:**

```
redis://:password@host:6379/0
```

---

## RabbitMQ Security

### User Management

```bash
# Add user
docker-compose exec rabbitmq rabbitmqctl add_user codecrafter password

# Set permissions
docker-compose exec rabbitmq rabbitmqctl set_permissions -p / codecrafter ".*" ".*" ".*"

# List users
docker-compose exec rabbitmq rabbitmqctl list_users
```

**Best Practices:**

- ✅ Create application-specific users
- ✅ Use strong passwords
- ✅ Set minimal permissions
- ✅ Disable guest user in production
- ✅ Use SSL for connections (amqps://)

---

## Input Validation

### Implemented Validations

```javascript
// Email validation (RFC 5322)
const email = req.body.email;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) throw new Error("Invalid email");

// Password validation
if (password.length < 8) throw new Error("Password too short");

// Code length validation
if (code.length > 10000) throw new Error("Code too long");

// Language validation
const allowedLanguages = ["javascript", "python", "java", "cpp", "go", "rust"];
if (!allowedLanguages.includes(language)) throw new Error("Invalid language");
```

### SQL/NoSQL Injection Prevention

```javascript
// ❌ Vulnerable
db.users.find({ email: userInput }); // Can be exploited

// ✅ Secure
db.users.find({ email: sanitizeInput(userInput) });
db.users.find({ email: { $eq: userInput } }); // Explicit comparison

// Use Mongoose with strict schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
```

---

## Error Handling

### Secure Error Messages

**❌ Vulnerable:**

```json
{
  "error": "Unexpected error: SELECT * FROM users WHERE id = '123'; DROP TABLE users; --"
}
```

**✅ Secure:**

```json
{
  "error": "An error occurred processing your request",
  "errorCode": "INTERNAL_SERVER_ERROR"
}
```

### Implementation

```javascript
// Only expose details in development
if (process.env.NODE_ENV === "development") {
  res.json({ error: error.message, stack: error.stack });
} else {
  res.json({ error: "Internal server error", errorCode: "ERROR_CODE" });
}
```

---

## Logging & Monitoring

### Security Events to Log

```javascript
logger.info(`User signup: ${email}`); // Success
logger.warn(`Failed login attempt: ${email} from ${ip}`); // Security event
logger.error(`SQL injection attempt detected: ${userInput}`); // Attack
logger.error(`Unauthorized access to ${resource} by ${userId}`); // Auth failure
```

### Monitoring Checklist

- ✅ Failed authentication attempts (> 5 in 5 min = alert)
- ✅ Unusual API usage patterns
- ✅ Database access anomalies
- ✅ Code execution resource limits exceeded
- ✅ Rate limit breaches
- ✅ Unauthorized route access

---

## Production Deployment Checklist

### Before Going Live

- [ ] Change all default passwords
  - [ ] MongoDB: `codecrafter123` → strong password
  - [ ] RabbitMQ: `codecrafter123` → strong password
  - [ ] Redis: set strong password

- [ ] Generate JWT secrets
  - [ ] `JWT_SECRET` (32+ chars)
  - [ ] `JWT_REFRESH_SECRET` (32+ chars)

- [ ] Set NODE_ENV
  - [ ] `NODE_ENV=production`

- [ ] Configure CORS
  - [ ] Set `FRONTEND_URL` to your domain

- [ ] Enable HTTPS
  - [ ] Generate SSL certificates
  - [ ] Configure Nginx SSL
  - [ ] Force HTTP → HTTPS redirect

- [ ] Database hardening
  - [ ] Enable MongoDB authentication
  - [ ] Enable Redis password
  - [ ] Configure firewall rules
  - [ ] Regular backups

- [ ] Monitoring
  - [ ] Setup logging (Winston)
  - [ ] Setup metrics (Prometheus)
  - [ ] Setup dashboards (Grafana)
  - [ ] Setup alerts

- [ ] Rate limiting
  - [ ] Test rate limiting
  - [ ] Adjust limits based on usage
  - [ ] Monitor for attacks

- [ ] Security testing
  - [ ] Run OWASP ZAP scan
  - [ ] Penetration testing
  - [ ] Code security audit

---

## Incident Response

### If Security Breach Occurs

1. **Immediate (5 mins):**
   - [ ] Stop the service
   - [ ] Isolate affected systems
   - [ ] Preserve logs

2. **Short-term (30 mins):**
   - [ ] Identify what was compromised
   - [ ] Notify users
   - [ ] Rotate all credentials

3. **Medium-term (1-2 hours):**
   - [ ] Patch vulnerability
   - [ ] Deploy fix
   - [ ] Restore from backup
   - [ ] Monitor for re-exploitation

4. **Long-term (1-7 days):**
   - [ ] Forensic analysis
   - [ ] Root cause analysis
   - [ ] Update security policies
   - [ ] Security training

---

## Security Tools

### OWASP ZAP Scanning

```bash
# Install OWASP ZAP
# Run security scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:8000 \
  -r report.html
```

### Dependency Vulnerability Scanning

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force major version fixes
npm audit fix --force
```

### Secret Scanning

```bash
# Check if secrets are in git history
git log -p | grep -i password

# Use git-secrets hook
git secrets --scan
```

---

## Compliance & Standards

### OWASP Top 10

CodeCrafter addresses:

- ✅ A01: Broken Access Control (JWT + Rate Limiting)
- ✅ A02: Cryptographic Failures (Bcrypt + HTTPS)
- ✅ A03: Injection (Input Validation)
- ✅ A04: Insecure Design (Security headers)
- ✅ A05: Security Misconfiguration (Environment vars)
- ✅ A06: Vulnerable & Outdated Components (Npm audit)
- ✅ A07: Identification & Authentication (JWT)
- ✅ A08: Data Integrity Failures (CSRF)
- ✅ A09: Logging & Monitoring (Winston)
- ✅ A10: SSRF (Input validation)

### Standards Compliance

- ✅ GDPR: Data privacy controls
- ✅ PCI DSS: Payment security (if applicable)
- ✅ SOC 2: Security controls
- ✅ ISO 27001: Information security

---

## Security Contact

**Report Security Issues:**

- Email: security@example.com
- Do NOT open public GitHub issues for security bugs
- Allow 48 hours for response

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)
- [Redis Security](https://redis.io/topics/security)

---

<div align="center">

**Security is Everyone's Responsibility 🔐**

[⬆ Back to Top](#-security-guide---codecrafter)

</div>
