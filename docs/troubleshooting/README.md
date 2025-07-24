# Troubleshooting Guide

🔧 **ChaseWhiteRabbit NGO Enterprise Troubleshooting**

## 📋 Overview

This guide provides comprehensive troubleshooting steps for common issues encountered in RiggerShared development, deployment, and production environments.

## 🚨 Quick Diagnostic Commands

### System Health Check

```bash
# Check application status
curl -f http://localhost:3000/health

# Check Docker containers
docker ps | grep riggershared

# Check system resources
df -h && free -h && top -bn1 | head -20

# Check logs
docker logs riggershared --tail 50
```

### Network Connectivity

```bash
# Test API connectivity
curl -v https://api.rigger.com/health

# Check DNS resolution
nslookup api.rigger.com

# Test database connection
nc -zv supabase.sxc.codes 5432

# Check Redis connection (if applicable)
redis-cli ping
```

## 🏗️ Development Environment Issues

### npm/Node.js Issues

#### Problem: `npm install` fails with permission errors

**Symptoms:**
```bash
npm ERR! Error: EACCES: permission denied, access '/usr/local/lib/node_modules'
```

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm for Node.js management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
nvm use node
```

#### Problem: Node.js version mismatch

**Symptoms:**
```bash
Error: This project requires Node.js >=18.0.0
```

**Solution:**
```bash
# Check current version
node --version

# Update Node.js using nvm
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version && npm --version
```

#### Problem: Package dependencies conflicts

**Symptoms:**
```bash
npm ERR! peer dep missing: react@>=16.8.0
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Or use npm audit to fix vulnerabilities
npm audit fix
```

### Environment Configuration Issues

#### Problem: Environment variables not loading

**Symptoms:**
```javascript
Error: API_BASE_URL is not defined
```

**Solution:**
```bash
# Check if .env file exists
ls -la .env*

# Verify environment variables are loaded
node -e "console.log(process.env.NODE_ENV)"

# Create .env file from template
cp .env.development .env.local

# Check .env file format (no spaces around =)
# ✅ Correct
API_BASE_URL=https://api.rigger.com

# ❌ Incorrect
API_BASE_URL = https://api.rigger.com
```

#### Problem: Port already in use

**Symptoms:**
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
sudo kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 npm run dev

# Find and kill specific process
ps aux | grep node
kill -9 <process-id>
```

## 🐳 Docker Issues

### Container Problems

#### Problem: Docker container won't start

**Symptoms:**
```bash
docker: Error response from daemon: container failed to start
```

**Diagnostics:**
```bash
# Check container status
docker ps -a

# View container logs
docker logs <container-name>

# Inspect container configuration
docker inspect <container-name>

# Check Docker daemon
sudo systemctl status docker
```

**Solutions:**
```bash
# Restart Docker daemon
sudo systemctl restart docker

# Remove and recreate container
docker rm -f riggershared
docker run --name riggershared -p 3000:3000 riggershared

# Build with no cache
docker build --no-cache -t riggershared .

# Check Dockerfile syntax
docker build -t riggershared . --progress=plain
```

#### Problem: Out of disk space

**Symptoms:**
```bash
docker: no space left on device
```

**Solution:**
```bash
# Check disk usage
df -h
docker system df

# Clean up Docker resources
docker system prune -a

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove stopped containers
docker container prune
```

### Docker Compose Issues

#### Problem: Service dependencies not starting in order

**Symptoms:**
```bash
database connection failed: connection refused
```

**Solution:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
  
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 🌐 API and Network Issues

### API Connection Problems

#### Problem: API requests timing out

**Symptoms:**
```javascript
Error: timeout of 30000ms exceeded
```

**Diagnostics:**
```bash
# Test API endpoint
curl -w "%{time_total}\n" -o /dev/null -s https://api.rigger.com/health

# Check network latency
ping api.rigger.com

# Test with verbose output
curl -v https://api.rigger.com/users/123
```

**Solutions:**
```javascript
// Increase timeout in API client
const apiClient = new ApiClient({
  baseURL: 'https://api.rigger.com',
  timeout: 60000, // Increase to 60 seconds
  retries: 3
});

// Implement retry logic
const retryRequest = async (url, options, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};
```

#### Problem: CORS errors in browser

**Symptoms:**
```
Access to fetch at 'https://api.rigger.com' has been blocked by CORS policy
```

**Solutions:**
```javascript
// Backend: Configure CORS middleware
import cors from 'cors';

app.use(cors({
  origin: ['http://localhost:3000', 'https://rigger.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Frontend: Use proxy in development
// package.json
{
  "proxy": "http://localhost:8000"
}

// Or configure webpack proxy
// webpack.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
};
```

### Authentication Issues

#### Problem: JWT token expired or invalid

**Symptoms:**
```javascript
Error: 401 Unauthorized - Invalid token
```

**Diagnostics:**
```javascript
// Check token expiry
const token = localStorage.getItem('auth_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token expires:', new Date(payload.exp * 1000));
```

**Solutions:**
```javascript
// Implement token refresh
class AuthManager {
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await fetch('/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      
      const { accessToken } = await response.json();
      localStorage.setItem('auth_token', accessToken);
      return accessToken;
    } catch (error) {
      // Redirect to login
      window.location.href = '/login';
    }
  }
  
  async makeAuthenticatedRequest(url, options = {}) {
    let token = localStorage.getItem('auth_token');
    
    // Check if token is close to expiry
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 - Date.now() < 5 * 60 * 1000) { // 5 minutes
      token = await this.refreshToken();
    }
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
```

## 💾 Database Issues

### Connection Problems

#### Problem: Database connection refused

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Diagnostics:**
```bash
# Check if database is running
ps aux | grep postgres

# Test connection
nc -zv localhost 5432
telnet localhost 5432

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

**Solutions:**
```bash
# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check PostgreSQL configuration
sudo nano /etc/postgresql/*/main/postgresql.conf
# Ensure: listen_addresses = '*'

sudo nano /etc/postgresql/*/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

# Restart PostgreSQL
sudo systemctl restart postgresql

# Test connection with psql
psql -h localhost -U postgres -d riggershared
```

### Migration Issues

#### Problem: Database migrations failing

**Symptoms:**
```
Error: relation "users" already exists
```

**Solutions:**
```bash
# Check migration status
npm run db:status

# Rollback migrations
npm run db:rollback

# Reset database
npm run db:reset

# Run migrations step by step
npm run db:migrate:up --step=1

# Force migration (use with caution)
npm run db:migrate:force --name=create_users_table
```

### Performance Issues

#### Problem: Slow database queries

**Diagnostics:**
```sql
-- Check running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';

-- Check table sizes
SELECT schemaname,tablename,attname,n_distinct,correlation FROM pg_stats;

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';
```

**Solutions:**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_applications_status ON applications(status);

-- Update table statistics
ANALYZE users;

-- Vacuum tables
VACUUM ANALYZE users;
```

## 🚀 Production Deployment Issues

### Server Connection Problems

#### Problem: Cannot SSH to production server

**Symptoms:**
```bash
ssh: connect to host 145.223.22.7 port 22: Connection refused
```

**Diagnostics:**
```bash
# Test connectivity
ping 145.223.22.7
telnet 145.223.22.7 22

# Check SSH key
ssh-keygen -l -f ~/.ssh/hostinger_key.pub

# Verify SSH agent
ssh-add -l
```

**Solutions:**
```bash
# Add SSH key to agent
ssh-add ~/.ssh/hostinger_key

# Use correct SSH key
ssh -i ~/.ssh/hostinger_key.pub root@145.223.22.7

# Check SSH configuration
cat ~/.ssh/config

# Test with verbose output
ssh -v -i ~/.ssh/hostinger_key.pub root@145.223.22.7
```

### Deployment Failures

#### Problem: Deployment script fails

**Symptoms:**
```bash
Error: deployment failed at step 3
```

**Diagnostics:**
```bash
# Check deployment logs
tail -f /var/log/deploy.log

# Verify system resources
df -h && free -h

# Check application status
systemctl status riggershared
```

**Solutions:**
```bash
# Manual deployment steps
git pull origin main
npm install --production
npm run build:prod
pm2 restart riggershared

# Check for conflicting processes
sudo lsof -i :3000
sudo kill -9 <pid>

# Verify environment variables
printenv | grep -E "(NODE_ENV|API_|DB_)"

# Check file permissions
ls -la /opt/riggershared
sudo chown -R app:app /opt/riggershared
```

### SSL Certificate Issues

#### Problem: SSL certificate expired

**Symptoms:**
```
NET::ERR_CERT_DATE_INVALID
```

**Solutions:**
```bash
# Check certificate expiry
openssl x509 -in /etc/ssl/certs/riggershared.crt -text -noout | grep "Not After"

# Renew Let's Encrypt certificate
sudo certbot renew --nginx

# Force renewal
sudo certbot renew --force-renewal

# Restart nginx
sudo systemctl restart nginx

# Test SSL configuration
curl -I https://rigger.com
```

## 📊 Performance Troubleshooting

### Memory Issues

#### Problem: Application running out of memory

**Symptoms:**
```bash
JavaScript heap out of memory
```

**Diagnostics:**
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head -10

# Monitor Node.js memory
node --inspect app.js
# Then open chrome://inspect in browser
```

**Solutions:**
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 app.js

# Or set in package.json
{
  "scripts": {
    "start": "node --max-old-space-size=4096 app.js"
  }
}

# Use PM2 with memory monitoring
pm2 start app.js --name riggershared --max-memory-restart 1G
```

### CPU Issues

#### Problem: High CPU usage

**Diagnostics:**
```bash
# Check CPU usage
top -p $(pgrep -f "node.*riggershared")

# Profile application
node --prof app.js
# Then process the profile
node --prof-process isolate-*.log > processed.txt
```

**Solutions:**
```javascript
// Implement CPU-intensive tasks in worker threads
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.postMessage({ data: largeDataSet });
  worker.on('message', (result) => {
    console.log('Result:', result);
  });
} else {
  parentPort.on('message', ({ data }) => {
    const result = processLargeDataSet(data);
    parentPort.postMessage(result);
  });
}

// Use clustering for CPU-bound operations
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  require('./app.js');
}
```

## 🔍 Monitoring and Logging

### Log Analysis

#### Finding Errors in Logs

```bash
# Search for errors in application logs
grep -i "error" /var/log/riggershared.log | tail -20

# Search for specific patterns
grep -E "(timeout|connection.*failed|500)" /var/log/riggershared.log

# Monitor logs in real-time
tail -f /var/log/riggershared.log | grep --color=always -E "(ERROR|WARN|FATAL)"

# Analyze log patterns
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr
```

### Health Monitoring

#### Setting Up Health Checks

```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    api: await checkExternalAPI(),
    disk: await checkDiskSpace(),
    memory: await checkMemoryUsage()
  };
  
  const isHealthy = Object.values(checks).every(check => check.status === 'ok');
  
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks
  });
});

async function checkDatabase() {
  try {
    await db.raw('SELECT 1');
    return { status: 'ok', message: 'Database connection successful' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
```

## 📞 Getting Help

### When to Escalate

Escalate issues when:
- Security vulnerabilities are detected
- Data corruption is suspected
- System is completely down
- Performance degradation affects users

### Contact Information

- **Critical Issues**: tiatheone@protonmail.com
- **Technical Support**: garrett@sxc.codes
- **Backup Contact**: garrett.dillman@gmail.com

### Information to Include

When reporting issues, include:
- **Environment**: Development/Staging/Production
- **Error Messages**: Complete error logs
- **Steps to Reproduce**: Detailed reproduction steps
- **System Information**: OS, Node.js version, Docker version
- **Recent Changes**: Any recent deployments or configuration changes

---

**ChaseWhiteRabbit NGO** | Enterprise-Grade • Ethical • DevOps-Ready
