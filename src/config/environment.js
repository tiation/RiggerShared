// =================================================
// RiggerShared - Environment Configuration Module
// =================================================
// Centralized configuration management for environment variables
// Provides type-safe access to environment variables with defaults

import { createRequire } from 'module';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables if not already loaded
function loadEnvironmentVariables() {
  try {
    const dotenv = require('dotenv');
    
    // Load base .env file
    dotenv.config();
    
    // Load environment-specific file
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const envFile = `.env.${NODE_ENV}`;
    dotenv.config({ path: resolve(__dirname, '../../', envFile) });
    
    // Load local overrides
    dotenv.config({ path: resolve(__dirname, '../../', '.env.local') });
  } catch (error) {
    console.warn('Could not load environment variables:', error.message);
  }
}

// Initialize environment variables
loadEnvironmentVariables();

/**
 * Get environment variable with type conversion and default value
 * @param {string} key - Environment variable key
 * @param {any} defaultValue - Default value if not found
 * @param {'string'|'number'|'boolean'|'json'} type - Type to convert to
 * @returns {any} The environment variable value
 */
function getEnvVar(key, defaultValue, type = 'string') {
  const value = process.env[key];
  
  if (value === undefined || value === '') {
    return defaultValue;
  }
  
  switch (type) {
    case 'number':
      const num = Number(value);
      return isNaN(num) ? defaultValue : num;
      
    case 'boolean':
      return value.toLowerCase() === 'true';
      
    case 'json':
      try {
        return JSON.parse(value);
      } catch {
        return defaultValue;
      }
      
    default:
      return value;
  }
}

/**
 * Validate required environment variables
 * @param {string[]} requiredVars - Array of required variable names
 * @throws {Error} If any required variables are missing
 */
function validateRequiredVars(requiredVars) {
  const missing = requiredVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Environment Configuration Object
export const config = {
  // Environment Information
  environment: {
    NODE_ENV: getEnvVar('NODE_ENV', 'development'),
    BUILD_TIME: getEnvVar('BUILD_TIME', new Date().toISOString()),
    VERSION: getEnvVar('VERSION', '1.0.0'),
    LIBRARY_NAME: getEnvVar('LIBRARY_NAME', '@rigger/shared'),
    
    get isDevelopment() {
      return this.NODE_ENV === 'development';
    },
    
    get isProduction() {
      return this.NODE_ENV === 'production';
    },
    
    get isStaging() {
      return this.NODE_ENV === 'staging';
    },
    
    get isTest() {
      return this.NODE_ENV === 'test';
    }
  },
  
  // API Configuration
  api: {
    BASE_URL: getEnvVar('API_BASE_URL', 'http://localhost:3000/api'),
    VERSION: getEnvVar('API_VERSION', 'v1'),
    TIMEOUT: getEnvVar('API_TIMEOUT', 30000, 'number'),
    
    get fullUrl() {
      return `${this.BASE_URL}/${this.VERSION}`;
    }
  },
  
  // Database Configuration
  database: {
    URL: getEnvVar('DATABASE_URL', ''),
    POOL_MIN: getEnvVar('DATABASE_POOL_MIN', 2, 'number'),
    POOL_MAX: getEnvVar('DATABASE_POOL_MAX', 10, 'number'),
    SSL: getEnvVar('DATABASE_SSL', false, 'boolean'),
    SSL_REJECT_UNAUTHORIZED: getEnvVar('DATABASE_SSL_REJECT_UNAUTHORIZED', true, 'boolean'),
    
    get poolConfig() {
      return {
        min: this.POOL_MIN,
        max: this.POOL_MAX,
        ssl: this.SSL ? { rejectUnauthorized: this.SSL_REJECT_UNAUTHORIZED } : false
      };
    }
  },
  
  // Supabase Configuration  
  supabase: {
    URL: getEnvVar('SUPABASE_URL', ''),
    ANON_KEY: getEnvVar('SUPABASE_ANON_KEY', ''),
    SERVICE_ROLE_KEY: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', ''),
    
    get isConfigured() {
      return this.URL && this.ANON_KEY;
    }
  },
  
  // Redis Configuration
  redis: {
    URL: getEnvVar('REDIS_URL', 'redis://localhost:6379'),
    PASSWORD: getEnvVar('REDIS_PASSWORD', ''),
    DB: getEnvVar('REDIS_DB', 0, 'number'),
    SSL: getEnvVar('REDIS_SSL', false, 'boolean'),
    
    get connectionConfig() {
      return {
        url: this.URL,
        password: this.PASSWORD || undefined,
        db: this.DB,
        tls: this.SSL ? {} : undefined
      };
    }
  },
  
  // Logging Configuration
  logging: {
    LEVEL: getEnvVar('LOG_LEVEL', 'info'),
    FORMAT: getEnvVar('LOG_FORMAT', 'json'),
    FILE: getEnvVar('LOG_FILE', 'logs/rigger-shared.log'),
    MAX_SIZE: getEnvVar('LOG_MAX_SIZE', '100mb'),
    MAX_FILES: getEnvVar('LOG_MAX_FILES', 10, 'number'),
    
    get config() {
      return {
        level: this.LEVEL,
        format: this.FORMAT,
        filename: this.FILE,
        maxsize: this.MAX_SIZE,
        maxFiles: this.MAX_FILES
      };
    }
  },
  
  // Feature Flags
  features: {
    DEBUG_MODE: getEnvVar('ENABLE_DEBUG_MODE', false, 'boolean'),
    METRICS_COLLECTION: getEnvVar('ENABLE_METRICS_COLLECTION', true, 'boolean'),
    PERFORMANCE_MONITORING: getEnvVar('ENABLE_PERFORMANCE_MONITORING', true, 'boolean'),
    VERBOSE_LOGGING: getEnvVar('ENABLE_VERBOSE_LOGGING', false, 'boolean'),
    SOURCE_MAPS: getEnvVar('ENABLE_SOURCE_MAPS', false, 'boolean'),
    DEV_TOOLS: getEnvVar('ENABLE_DEV_TOOLS', false, 'boolean'),
    COMPRESSION: getEnvVar('ENABLE_COMPRESSION', true, 'boolean'),
    CACHING: getEnvVar('ENABLE_CACHING', true, 'boolean'),
    HOT_RELOAD: getEnvVar('ENABLE_HOT_RELOAD', false, 'boolean')
  },
  
  // External Services
  services: {
    RIGGER_CONNECT_URL: getEnvVar('RIGGER_CONNECT_URL', 'http://localhost:3001'),
    RIGGER_HUB_URL: getEnvVar('RIGGER_HUB_URL', 'http://localhost:3002'),
    RIGGER_BACKEND_URL: getEnvVar('RIGGER_BACKEND_URL', 'http://localhost:3003')
  },
  
  // Security Configuration
  security: {
    CORS_ENABLED: getEnvVar('CORS_ENABLED', true, 'boolean'),
    CORS_ORIGINS: getEnvVar('CORS_ORIGINS', '*').split(',').map(origin => origin.trim()),
    RATE_LIMIT_ENABLED: getEnvVar('RATE_LIMIT_ENABLED', false, 'boolean'),
    RATE_LIMIT_MAX_REQUESTS: getEnvVar('RATE_LIMIT_MAX_REQUESTS', 100, 'number'),
    RATE_LIMIT_WINDOW_MS: getEnvVar('RATE_LIMIT_WINDOW_MS', 900000, 'number'),
    HELMET_ENABLED: getEnvVar('HELMET_ENABLED', true, 'boolean'),
    SSL_ENABLED: getEnvVar('SSL_ENABLED', false, 'boolean'),
    FORCE_HTTPS: getEnvVar('FORCE_HTTPS', false, 'boolean'),
    HSTS_MAX_AGE: getEnvVar('HSTS_MAX_AGE', 31536000, 'number'),
    
    get corsConfig() {
      return {
        enabled: this.CORS_ENABLED,
        origin: this.CORS_ORIGINS.includes('*') ? true : this.CORS_ORIGINS
      };
    },
    
    get rateLimitConfig() {
      return {
        enabled: this.RATE_LIMIT_ENABLED,
        max: this.RATE_LIMIT_MAX_REQUESTS,
        windowMs: this.RATE_LIMIT_WINDOW_MS
      };
    }
  },
  
  // Performance Settings
  performance: {
    MAX_REQUEST_SIZE: getEnvVar('MAX_REQUEST_SIZE', '10mb'),
    REQUEST_TIMEOUT: getEnvVar('REQUEST_TIMEOUT', 30000, 'number'),
    KEEP_ALIVE_TIMEOUT: getEnvVar('KEEP_ALIVE_TIMEOUT', 5000, 'number')
  },
  
  // Health and Monitoring
  monitoring: {
    HEALTH_CHECK_ENABLED: getEnvVar('HEALTH_CHECK_ENABLED', true, 'boolean'),
    HEALTH_CHECK_ENDPOINT: getEnvVar('HEALTH_CHECK_ENDPOINT', '/health'),
    METRICS_ENABLED: getEnvVar('METRICS_ENABLED', true, 'boolean'),
    METRICS_ENDPOINT: getEnvVar('METRICS_ENDPOINT', '/metrics'),
    ERROR_REPORTING_ENABLED: getEnvVar('ERROR_REPORTING_ENABLED', true, 'boolean'),
    SENTRY_ENABLED: getEnvVar('SENTRY_ENABLED', false, 'boolean'),
    SENTRY_DSN: getEnvVar('SENTRY_DSN', '')
  },
  
  // Testing Configuration
  testing: {
    DATABASE_URL: getEnvVar('TEST_DATABASE_URL', ''),
    MOCK_EXTERNAL_SERVICES: getEnvVar('MOCK_EXTERNAL_SERVICES', false, 'boolean')
  }
};

// Export utility functions
export { getEnvVar, validateRequiredVars };

// Export environment validation function
export function validateEnvironment() {
  const errors = [];
  
  // Validate based on environment
  if (config.environment.isProduction) {
    // Production-specific validations
    if (!config.database.URL) {
      errors.push('DATABASE_URL is required in production');
    }
    
    if (!config.supabase.URL || !config.supabase.ANON_KEY) {
      errors.push('Supabase configuration is required in production');
    }
    
    if (!config.security.SSL_ENABLED) {
      console.warn('⚠️  SSL is not enabled in production environment');
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\\n${errors.join('\\n')}`);
  }
  
  console.log(`✅ Environment validation passed for ${config.environment.NODE_ENV} environment`);
}

// Export default configuration
export default config;
