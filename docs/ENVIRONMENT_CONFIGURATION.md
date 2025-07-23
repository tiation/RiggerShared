# Environment Configuration Guide

## Overview

RiggerShared uses a comprehensive environment configuration system that supports multiple deployment environments (development, staging, production) with proper security practices and configuration management.

## File Structure

```
├── .env.development      # Development environment variables
├── .env.production       # Production environment variables (template)
├── .env.local           # Local overrides (not committed to git)
├── rollup.config.js     # Build configuration with env support
└── src/config/
    └── environment.js   # Environment configuration module
```

## Environment Files

### .env.development
Contains development-specific configuration with:
- Local service URLs (localhost)
- Debug mode enabled
- Less restrictive security settings
- Verbose logging
- Development database connections

### .env.production
Contains production-ready configuration template with:
- Production service URLs
- Strict security settings
- Optimized performance settings
- Error reporting enabled
- SSL/TLS enabled

### .env.local (Create Manually)
Used for local development overrides. This file should:
- **NEVER** be committed to version control
- Contain personal/local development settings
- Override any development settings as needed

## Environment Variables Reference

### Core Environment
| Variable | Description | Development Default | Production Default |
|----------|-------------|--------------------|--------------------|
| `NODE_ENV` | Application environment | `development` | `production` |
| `VERSION` | Application version | From package.json | From package.json |
| `BUILD_TIME` | Build timestamp | Auto-generated | Auto-generated |

### API Configuration
| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `API_BASE_URL` | Base API URL | `http://localhost:3000/api` | `https://api.riggerconnect.tiation.net/api` |
| `API_VERSION` | API version | `v1` | `v1` |
| `API_TIMEOUT` | Request timeout (ms) | `30000` | `10000` |

### Database Configuration
| Variable | Description | Required | Security |
|----------|-------------|----------|----------|
| `DATABASE_URL` | Full database connection string | Production | **SENSITIVE** |
| `DATABASE_POOL_MIN` | Minimum pool connections | No | Safe |
| `DATABASE_POOL_MAX` | Maximum pool connections | No | Safe |
| `DATABASE_SSL` | Enable SSL for database | No | Safe |

### Supabase Configuration
| Variable | Description | Required | Security |
|----------|-------------|----------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes | Safe (public) |
| `SUPABASE_ANON_KEY` | Anonymous/public key | Yes | Safe (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Production | **SENSITIVE** |

### Redis Configuration
| Variable | Description | Required | Security |
|----------|-------------|----------|----------|
| `REDIS_URL` | Redis connection URL | No | **SENSITIVE** |
| `REDIS_PASSWORD` | Redis password | No | **SENSITIVE** |
| `REDIS_DB` | Redis database number | No | Safe |
| `REDIS_SSL` | Enable Redis SSL | No | Safe |

### Security Settings
| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `CORS_ENABLED` | Enable CORS | `true` | `true` |
| `CORS_ORIGINS` | Allowed origins | `*` | Specific domains |
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `false` | `true` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `1000` | `100` |
| `SSL_ENABLED` | Force SSL/HTTPS | `false` | `true` |

### Feature Flags
| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `ENABLE_DEBUG_MODE` | Debug mode | `true` | `false` |
| `ENABLE_METRICS_COLLECTION` | Collect metrics | `true` | `true` |
| `ENABLE_PERFORMANCE_MONITORING` | Performance monitoring | `true` | `true` |
| `ENABLE_VERBOSE_LOGGING` | Verbose logs | `true` | `false` |
| `ENABLE_SOURCE_MAPS` | Generate source maps | `true` | `false` |

### Logging Configuration
| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `LOG_LEVEL` | Logging level | `debug` | `info` |
| `LOG_FORMAT` | Log format | `pretty` | `json` |
| `LOG_FILE` | Log file path | `logs/rigger-shared-dev.log` | `logs/rigger-shared-prod.log` |

## Usage in Code

### Basic Usage
```javascript
import config from './src/config/environment.js';

// Access configuration
console.log('Environment:', config.environment.NODE_ENV);
console.log('API URL:', config.api.fullUrl);
console.log('Debug Mode:', config.features.DEBUG_MODE);

// Use configuration objects
const dbConfig = config.database.poolConfig;
const corsConfig = config.security.corsConfig;
```

### Environment Validation
```javascript
import { validateEnvironment } from './src/config/environment.js';

try {
  validateEnvironment();
  console.log('Environment is valid');
} catch (error) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}
```

### Custom Environment Variables
```javascript
import { getEnvVar } from './src/config/environment.js';

// Get string value with default
const customValue = getEnvVar('CUSTOM_SETTING', 'default-value');

// Get number value
const port = getEnvVar('PORT', 3000, 'number');

// Get boolean value
const enabled = getEnvVar('FEATURE_ENABLED', false, 'boolean');

// Get JSON value
const config = getEnvVar('COMPLEX_CONFIG', {}, 'json');
```

## Setup Instructions

### Local Development Setup

1. **Copy development template:**
   ```bash
   cp .env.development .env.local
   ```

2. **Edit .env.local with your local settings:**
   ```bash
   # Add your local database URL
   DATABASE_URL=postgresql://localhost:5432/my_local_db
   
   # Add any API keys for development
   EXTERNAL_API_KEY=your-dev-api-key-here
   ```

3. **Never commit .env.local:**
   ```bash
   # Already in .gitignore
   echo ".env.local" >> .gitignore
   ```

### Production Deployment

1. **Set sensitive environment variables via your deployment platform:**
   ```bash
   # Via environment variables (recommended)
   export DATABASE_URL="postgresql://user:pass@host:port/db"
   export JWT_SECRET_KEY="your-production-secret"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-key"
   ```

2. **For Docker deployments:**
   ```dockerfile
   # In Dockerfile
   ENV NODE_ENV=production
   
   # In docker-compose.yml or runtime
   environment:
     - DATABASE_URL=${DATABASE_URL}
     - JWT_SECRET_KEY=${JWT_SECRET_KEY}
   ```

3. **For Kubernetes deployments:**
   ```yaml
   # Use ConfigMaps for non-sensitive data
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: rigger-shared-config
   data:
     NODE_ENV: "production"
     API_BASE_URL: "https://api.riggerconnect.tiation.net/api"
   
   ---
   # Use Secrets for sensitive data
   apiVersion: v1
   kind: Secret
   metadata:
     name: rigger-shared-secrets
   type: Opaque
   data:
     DATABASE_URL: <base64-encoded-value>
     JWT_SECRET_KEY: <base64-encoded-value>
   ```

### CI/CD Pipeline Configuration

1. **GitHub Actions:**
   ```yaml
   env:
     NODE_ENV: production
     DATABASE_URL: ${{ secrets.DATABASE_URL }}
     JWT_SECRET_KEY: ${{ secrets.JWT_SECRET_KEY }}
   ```

2. **GitLab CI:**
   ```yaml
   variables:
     NODE_ENV: "production"
   
   deploy:
     script:
       - export DATABASE_URL=$DATABASE_URL_SECRET
       - npm run build:prod
   ```

## Security Best Practices

### ✅ DO
- Use environment variables for all configuration
- Set sensitive values via deployment platform
- Use different values for each environment
- Validate required variables on startup
- Use `.env.local` for local development overrides
- Rotate secrets regularly

### ❌ DON'T
- Commit sensitive values to version control
- Use production credentials in development
- Hardcode configuration values in source code
- Share `.env.local` files between developers
- Use weak or default secret values

## Troubleshooting

### Environment Variables Not Loading
```bash
# Check if environment file exists
ls -la .env*

# Verify NODE_ENV is set correctly
echo $NODE_ENV

# Check if variables are loaded
node -e "console.log(process.env.NODE_ENV)"
```

### Build Issues
```bash
# Clear any cached environment
rm -rf node_modules/.cache

# Rebuild with environment logging
NODE_ENV=development npm run build:dev

# Check rollup configuration
npx rollup --config rollup.config.js --environment NODE_ENV:development
```

### Production Deployment Issues
```bash
# Validate environment in production
node -e "
  import('./src/config/environment.js').then(({ validateEnvironment }) => {
    try {
      validateEnvironment();
      console.log('✅ Production environment is valid');
    } catch (error) {
      console.error('❌ Environment validation failed:', error.message);
      process.exit(1);
    }
  });
"
```

## Environment File Templates

### .env.local Template
```bash
# =================================================
# Local Development Overrides
# =================================================
# Copy this template and customize for your local setup

# Local Database (if different from development default)
# DATABASE_URL=postgresql://localhost:5432/my_local_rigger_db

# Local API Keys (development keys only!)
# EXTERNAL_API_KEY=your-dev-api-key-here
# JWT_SECRET_KEY=your-local-jwt-secret

# Local Service URLs (if running services on different ports)
# RIGGER_CONNECT_URL=http://localhost:3001
# RIGGER_HUB_URL=http://localhost:3002

# Personal Development Preferences
# LOG_LEVEL=debug
# ENABLE_VERBOSE_LOGGING=true
```

### Production Secrets Checklist
Before deploying to production, ensure these sensitive variables are set:

- [ ] `DATABASE_URL` - Production database connection
- [ ] `JWT_SECRET_KEY` - Strong, unique JWT secret
- [ ] `REDIS_PASSWORD` - Redis authentication password
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service key
- [ ] `SENTRY_DSN` - Error reporting configuration
- [ ] Any third-party API keys

## Support

For questions about environment configuration:
1. Check this documentation first
2. Review the configuration module: `src/config/environment.js`
3. Check the build configuration: `rollup.config.js`
4. Contact the development team via the established channels

---

**Note:** This configuration system is designed to be enterprise-grade with proper security practices. Always follow the principle of least privilege when setting up environment variables.
