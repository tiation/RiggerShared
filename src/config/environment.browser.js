// =================================================
// RiggerShared - Browser-Compatible Environment Configuration
// =================================================
// Centralized configuration management for browser environments
// Provides type-safe access to environment variables with browser fallbacks

/**
 * Browser-compatible environment variable access
 * Falls back to window.__RIGGER_ENV__ or defaults if process.env is not available
 */
function getBrowserEnv() {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && window.__RIGGER_ENV__) {
    return window.__RIGGER_ENV__;
  }  
  // Check if process.env is available (Node.js or webpack/vite polyfill)
  if (typeof process !== 'undefined' && process.env) {
    return process.env;
  }  
  // Fallback for pure browser environments
  return {};
}

/**
 * Get environment variable with type conversion and default value
 * @param {string} key - Environment variable key
 * @param {any} defaultValue - Default value if not found
 * @param {'string'|'number'|'boolean'|'json'} type - Type to convert to
 * @returns {any} The environment variable value
 */
function getEnvVar(key, defaultValue, type = 'string') {
  const env = getBrowserEnv();
  const value = env[key];
  
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
  const env = getBrowserEnv();
  const missing = requiredVars.filter(key => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Environment Configuration Object (Browser-Compatible)
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
    },    
    get isBrowser() {
      return typeof window !== 'undefined';
    },    
    get isNode() {
      return typeof process !== 'undefined' && process.versions && process.versions.node;
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
  // Database Configuration (Browser-safe values only)
  database: {
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
  // Supabase Configuration (Public keys only - safe for browser)
  supabase: {
    URL: getEnvVar('SUPABASE_URL', ''),
    ANON_KEY: getEnvVar('SUPABASE_ANON_KEY', ''), // Anonymous key is public    
    get isConfigured() {
      return this.URL && this.ANON_KEY;
    }
  },  
  // Redis Configuration (Browser-safe settings only)
  redis: {
    DB: getEnvVar('REDIS_DB', 0, 'number'),
    SSL: getEnvVar('REDIS_SSL', false, 'boolean'),    
    get connectionConfig() {
      return {
        db: this.DB,
        tls: this.SSL ? {} : undefined
      };
    }
  },  
  // Logging Configuration (Browser-compatible)
  logging: {
    LEVEL: getEnvVar('LOG_LEVEL', 'info'),
    FORMAT: getEnvVar('LOG_FORMAT', 'json'),    
    get config() {
      return {
        level: this.LEVEL,
        format: this.FORMAT
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
  // External Services (Browser-accessible URLs only)
  services: {
    RIGGER_CONNECT_URL: getEnvVar('RIGGER_CONNECT_URL', 'http://localhost:3001'),
    RIGGER_HUB_URL: getEnvVar('RIGGER_HUB_URL', 'http://localhost:3002'),
    RIGGER_BACKEND_URL: getEnvVar('RIGGER_BACKEND_URL', 'http://localhost:3003')
  }
};

// Export the getEnvVar function for use in other modules
export { getEnvVar };

// Export validation function
export { validateRequiredVars };

// Export function to validate all environment variables
export function validateEnvironment() {
  const requiredVars = [];  
  // Add required variables based on feature flags
  if (config.features.METRICS_COLLECTION) {
    // No required vars for metrics in browser
  }  
  if (config.supabase.isConfigured) {
    requiredVars.push('SUPABASE_URL', 'SUPABASE_ANON_KEY');
  }  
  if (requiredVars.length > 0) {
    validateRequiredVars(requiredVars);
  }  
  console.log('✅ Environment validation passed');
  return true;
}

// Default export
export default config;

