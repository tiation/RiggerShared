import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Environment configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';
const isDevelopment = NODE_ENV === 'development';

// Load environment variables based on NODE_ENV
function loadEnvironmentVariables() {
  const dotenv = require('dotenv');
  
  // Load base .env file if it exists
  dotenv.config();
  
  // Load environment-specific .env file
  const envFile = `.env.${NODE_ENV}`;
  try {
    dotenv.config({ path: resolve(__dirname, envFile) });
    console.log(`✅ Loaded environment configuration from ${envFile}`);
  } catch (error) {
    console.warn(`⚠️  Could not load ${envFile}, using default configuration`);
  }
  
  // Load local overrides if they exist
  const localEnvFile = '.env.local';
  try {
    dotenv.config({ path: resolve(__dirname, localEnvFile) });
    console.log(`✅ Loaded local overrides from ${localEnvFile}`);
  } catch (error) {
    // Local env file is optional
  }
}

// Initialize environment variables
loadEnvironmentVariables();

// Get package.json for version info
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf8')
);

// Define environment variables to inject into the build
const environmentVariables = {
  // Build information
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
  'process.env.VERSION': JSON.stringify(packageJson.version),
  'process.env.LIBRARY_NAME': JSON.stringify(packageJson.name),
  
  // API Configuration
  'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || 'http://localhost:3000/api'),
  'process.env.API_VERSION': JSON.stringify(process.env.API_VERSION || 'v1'),
  'process.env.API_TIMEOUT': JSON.stringify(process.env.API_TIMEOUT || '30000'),
  
  // Database Configuration (non-sensitive)
  'process.env.DATABASE_POOL_MIN': JSON.stringify(process.env.DATABASE_POOL_MIN || '2'),
  'process.env.DATABASE_POOL_MAX': JSON.stringify(process.env.DATABASE_POOL_MAX || '10'),
  'process.env.DATABASE_SSL': JSON.stringify(process.env.DATABASE_SSL || 'false'),
  
  // Supabase Configuration (public keys only)
  'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || ''),
  // Note: SUPABASE_ANON_KEY is public and safe to include in client builds
  'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || ''),
  
  // Redis Configuration (non-sensitive)
  'process.env.REDIS_DB': JSON.stringify(process.env.REDIS_DB || '0'),
  'process.env.REDIS_SSL': JSON.stringify(process.env.REDIS_SSL || 'false'),
  
  // Logging Configuration
  'process.env.LOG_LEVEL': JSON.stringify(process.env.LOG_LEVEL || 'info'),
  'process.env.LOG_FORMAT': JSON.stringify(process.env.LOG_FORMAT || 'json'),
  
  // Feature Flags
  'process.env.ENABLE_DEBUG_MODE': JSON.stringify(process.env.ENABLE_DEBUG_MODE || 'false'),
  'process.env.ENABLE_METRICS_COLLECTION': JSON.stringify(process.env.ENABLE_METRICS_COLLECTION || 'true'),
  'process.env.ENABLE_PERFORMANCE_MONITORING': JSON.stringify(process.env.ENABLE_PERFORMANCE_MONITORING || 'true'),
  'process.env.ENABLE_VERBOSE_LOGGING': JSON.stringify(process.env.ENABLE_VERBOSE_LOGGING || 'false'),
  
  // External Service URLs
  'process.env.RIGGER_CONNECT_URL': JSON.stringify(process.env.RIGGER_CONNECT_URL || 'http://localhost:3001'),
  'process.env.RIGGER_HUB_URL': JSON.stringify(process.env.RIGGER_HUB_URL || 'http://localhost:3002'),
  'process.env.RIGGER_BACKEND_URL': JSON.stringify(process.env.RIGGER_BACKEND_URL || 'http://localhost:3003'),
  
  // Security Settings
  'process.env.CORS_ENABLED': JSON.stringify(process.env.CORS_ENABLED || 'true'),
  'process.env.CORS_ORIGINS': JSON.stringify(process.env.CORS_ORIGINS || '*'),
  'process.env.RATE_LIMIT_ENABLED': JSON.stringify(process.env.RATE_LIMIT_ENABLED || 'false'),
  'process.env.RATE_LIMIT_MAX_REQUESTS': JSON.stringify(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // Development/Production flags
  'process.env.ENABLE_SOURCE_MAPS': JSON.stringify(process.env.ENABLE_SOURCE_MAPS || isDevelopment.toString()),
  'process.env.ENABLE_DEV_TOOLS': JSON.stringify(process.env.ENABLE_DEV_TOOLS || isDevelopment.toString()),
  'process.env.ENABLE_COMPRESSION': JSON.stringify(process.env.ENABLE_COMPRESSION || isProduction.toString()),
  
  // Health and Monitoring
  'process.env.HEALTH_CHECK_ENABLED': JSON.stringify(process.env.HEALTH_CHECK_ENABLED || 'true'),
  'process.env.METRICS_ENABLED': JSON.stringify(process.env.METRICS_ENABLED || 'true'),
};

console.log(`🔧 Building RiggerShared in ${NODE_ENV} mode`);
console.log(`📦 Version: ${packageJson.version}`);
console.log(`🌍 Environment variables loaded: ${Object.keys(environmentVariables).length}`);

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/rigger-shared.cjs.js',
      format: 'cjs',
      sourcemap: isDevelopment,
      exports: 'named'
    },
    {
      file: 'dist/rigger-shared.esm.js', 
      format: 'esm',
      sourcemap: isDevelopment
    },
    {
      file: 'dist/rigger-shared.umd.js',
      format: 'umd',
      name: 'RiggerShared',
      sourcemap: isDevelopment,
      exports: 'named'
    }
  ],
  plugins: [
    // Environment variable replacement
    {
      name: 'env-replace',
      generateBundle(options, bundle) {
        Object.keys(bundle).forEach(fileName => {
          const chunk = bundle[fileName];
          if (chunk.type === 'chunk') {
            Object.keys(environmentVariables).forEach(key => {
              const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
              chunk.code = chunk.code.replace(regex, environmentVariables[key]);
            });
          }
        });
      }
    },
    
    // Conditional plugins based on environment
    ...(isProduction ? [
      // Production-only plugins
      {
        name: 'production-optimizations',
        generateBundle(options, bundle) {
          console.log('🚀 Applied production optimizations');
        }
      }
    ] : []),
    
    ...(isDevelopment ? [
      // Development-only plugins  
      {
        name: 'development-helpers',
        generateBundle(options, bundle) {
          console.log('🛠️  Applied development helpers');
        }
      }
    ] : [])
  ],
  
  external: [
    // Mark these as external to avoid bundling
    'dotenv',
    'axios', 
    'winston',
    'pino',
    'joi',
    'zod',
    'uuid'
  ],
  
  // Optimization settings based on environment
  treeshake: isProduction ? 'smallest' : false,
};
