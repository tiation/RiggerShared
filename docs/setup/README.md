# RiggerShared Setup Guide

🏗️ **ChaseWhiteRabbit NGO Enterprise Setup Guide**

## 📋 Prerequisites

### System Requirements
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **Docker**: >= 20.10.0
- **Git**: >= 2.30.0
- **Operating Systems**: macOS 11+, Ubuntu 20.04+, Windows 10+

### Development Environment
- **IDE**: VS Code, WebStorm, or IntelliJ IDEA
- **Terminal**: Warp (recommended) or iTerm2
- **Package Manager**: npm or yarn

## 🚀 Quick Setup

### 1. Repository Setup

```bash
# Clone the repository
git clone git@github.com:tiation-repos/RiggerShared.git
cd RiggerShared

# Install dependencies
npm install

# Verify installation
npm run test
```

### 2. Environment Configuration

Create environment files based on your deployment target:

```bash
# Copy development environment template
cp .env.development .env.local

# Edit configuration
nano .env.local
```

### 3. Docker Setup (Optional)

For containerized development:

```bash
# Build Docker container
npm run docker:build

# Run container
npm run docker:run
```

## 🔧 Detailed Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `development` |
| `PORT` | Application port | No | `3000` |
| `DB_HOST` | Database host | Yes | - |
| `DB_PORT` | Database port | Yes | `5432` |
| `REDIS_URL` | Redis connection | No | - |
| `API_BASE_URL` | Base API URL | Yes | - |
| `LOG_LEVEL` | Logging level | No | `info` |

### VPS Integration

**Hostinger VPS Configuration:**

```bash
# Development Server (docker.tiation.net)
ssh root@145.223.22.9

# Production Server (docker.sxc.codes) 
ssh root@145.223.22.7

# Staging Environment
ssh root@89.116.191.60
```

### Database Setup

#### PostgreSQL (via Supabase)
```bash
# Connect to Supabase instance
ssh root@93.127.167.157

# Configure database
npm run db:setup
```

#### Redis (Optional)
```bash
# Install Redis locally
brew install redis  # macOS
sudo apt install redis-server  # Ubuntu

# Start Redis
redis-server
```

## 🏗️ Build Configuration

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build:prod
```

### Staging Build
```bash
npm run build:staging
```

## 🔍 Testing Setup

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### Coverage Reports
```bash
npm run test:coverage
```

## 🚢 Deployment Setup

### Staging Deployment
```bash
npm run deploy:staging
```

### Production Deployment
```bash
npm run deploy:production
```

### CI/CD Pipeline

The project uses GitLab CI/CD with the following stages:
- **Build**: Compile and bundle
- **Test**: Unit and integration tests
- **Security**: Vulnerability scanning
- **Deploy**: Environment-specific deployment

## 🛠️ Development Tools

### Code Quality
```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run type-check
```

### Security
```bash
# Security audit
npm run security:audit

# Fix vulnerabilities
npm run security:fix
```

## 🔐 SSH Key Configuration

For Hostinger VPS access:

```bash
# Use the configured SSH key
ssh -i ~/.ssh/hostinger_key.pub root@<server-ip>
```

## 📧 Alert Configuration

Alerts are configured for:
- **Primary**: tiatheone@protonmail.com
- **Secondary**: garrett@sxc.codes
- **Backup**: garrett.dillman@gmail.com

## 🆘 Common Issues

### Permission Errors
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### Port Conflicts
```bash
# Kill process on port 3000
sudo lsof -ti:3000 | xargs kill -9
```

### Docker Issues
```bash
# Clean Docker cache
docker system prune -a
```

## 📚 Next Steps

1. Review [Architecture Overview](../architecture/README.md)
2. Check [Development Guide](../development/README.md)
3. Explore [API Documentation](../api/README.md)
4. Setup [Deployment Pipeline](../deployment/README.md)

---

**ChaseWhiteRabbit NGO** | Enterprise-Grade • Ethical • DevOps-Ready
