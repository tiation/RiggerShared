// =================================================
// RiggerShared - Server-Only Utilities
// =================================================
// Node.js specific utilities that should not be included in browser bundles
// This module will be excluded from browser builds through conditional imports

import { createRequire } from 'module';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Server Environment utilities - Node.js specific
 */
export const ServerEnvUtils = {
  // Check if running in development (server-side)
  isDevelopment: () => process.env.NODE_ENV === 'development',

  // Check if running in production (server-side)
  isProduction: () => process.env.NODE_ENV === 'production',

  // Check if running in test environment (server-side)
  isTest: () => process.env.NODE_ENV === 'test',

  // Get environment variable with default (server-side)
  getEnv: (key, defaultValue = null) => {
    return process.env[key] || defaultValue;
  },

  // Get current working directory
  getCwd: () => process.cwd(),

  // Get node version
  getNodeVersion: () => process.version,

  // Get platform information
  getPlatform: () => ({
    arch: process.arch,
    platform: process.platform,
    nodeVersion: process.version,
    pid: process.pid,
    uptime: process.uptime()
  })
};

/**
 * File System utilities - Server only
 */
export const ServerFileUtils = {
  // Resolve absolute path (server-side)
  resolvePath: (...paths) => resolve(...paths),

  // Get directory name (server-side)  
  getDirname: (filepath) => dirname(filepath),

  // Convert file URL to path (server-side)
  fileURLToPath: (url) => fileURLToPath(url),

  // Create require function (server-side)
  createRequire: (filename) => createRequire(filename),

  // Get current file info
  getCurrentFileInfo: () => ({
    filename: __filename,
    dirname: __dirname
  })
};

/**
 * Load environment variables using dotenv (server-side only)
 */
export function loadEnvironmentVariables() {
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
    
    return true;
  } catch (error) {
    console.warn('Could not load environment variables:', error.message);
    return false;
  }
}

/**
 * Server-only configuration loader
 */
export function getServerConfig() {
  // Load environment variables
  loadEnvironmentVariables();

  return {
    // Database Configuration (including sensitive data)
    database: {
      URL: process.env.DATABASE_URL || '',
      USERNAME: process.env.DATABASE_USERNAME || '',
      PASSWORD: process.env.DATABASE_PASSWORD || '',
      POOL_MIN: parseInt(process.env.DATABASE_POOL_MIN || '2'),
      POOL_MAX: parseInt(process.env.DATABASE_POOL_MAX || '10'),
      SSL: process.env.DATABASE_SSL === 'true',
      SSL_REJECT_UNAUTHORIZED: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false'
    },

    // Supabase Configuration (including service role key)
    supabase: {
      URL: process.env.SUPABASE_URL || '',
      ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
      SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '' // Server-only
    },

    // Redis Configuration (including sensitive data)
    redis: {
      URL: process.env.REDIS_URL || 'redis://localhost:6379',
      PASSWORD: process.env.REDIS_PASSWORD || '',
      DB: parseInt(process.env.REDIS_DB || '0'),
      SSL: process.env.REDIS_SSL === 'true'
    },

    // Logging Configuration (server-specific)
    logging: {
      LEVEL: process.env.LOG_LEVEL || 'info',
      FORMAT: process.env.LOG_FORMAT || 'json',
      FILE: process.env.LOG_FILE || 'logs/rigger-shared.log',
      MAX_SIZE: process.env.LOG_MAX_SIZE || '100mb',
      MAX_FILES: parseInt(process.env.LOG_MAX_FILES || '10')
    },

    // Security Configuration (server-only)
    security: {
      JWT_SECRET: process.env.JWT_SECRET || '',
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
      BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),
      CORS_ORIGINS: process.env.CORS_ORIGINS || '*',
      RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
    }
  };
}

export default {
  ServerEnvUtils,
  ServerFileUtils,
  loadEnvironmentVariables,
  getServerConfig
};
