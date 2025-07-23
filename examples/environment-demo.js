#!/usr/bin/env node

/**
 * RiggerShared Environment Configuration Demo
 * 
 * This script demonstrates how to use the environment configuration
 * system in different environments.
 */

import { config, validateEnvironment, getEnvVar } from '../src/config/environment.js';

console.log('🔧 RiggerShared Environment Configuration Demo');
console.log('================================================\n');

// Display current environment
console.log('📍 Current Environment Information:');
console.log(`   Environment: ${config.environment.NODE_ENV}`);
console.log(`   Version: ${config.environment.VERSION}`);
console.log(`   Build Time: ${config.environment.BUILD_TIME}`);
console.log(`   Is Development: ${config.environment.isDevelopment}`);
console.log(`   Is Production: ${config.environment.isProduction}\n`);

// Display API configuration
console.log('🌐 API Configuration:');
console.log(`   API Base URL: ${config.api.BASE_URL}`);
console.log(`   API Version: ${config.api.VERSION}`);
console.log(`   Full API URL: ${config.api.fullUrl}`);
console.log(`   Timeout: ${config.api.TIMEOUT}ms\n`);

// Display database configuration
console.log('🗄️  Database Configuration:');
console.log(`   Pool Min: ${config.database.POOL_MIN}`);
console.log(`   Pool Max: ${config.database.POOL_MAX}`);
console.log(`   SSL Enabled: ${config.database.SSL}`);
console.log(`   Pool Config:`, JSON.stringify(config.database.poolConfig, null, 2));
console.log('');

// Display Supabase configuration
console.log('☁️  Supabase Configuration:');
console.log(`   URL: ${config.supabase.URL}`);
console.log(`   Has Anon Key: ${config.supabase.ANON_KEY ? '✅ Yes' : '❌ No'}`);
console.log(`   Is Configured: ${config.supabase.isConfigured ? '✅ Yes' : '❌ No'}\n`);

// Display feature flags
console.log('🎛️  Feature Flags:');
console.log(`   Debug Mode: ${config.features.DEBUG_MODE ? '✅ Enabled' : '❌ Disabled'}`);
console.log(`   Metrics Collection: ${config.features.METRICS_COLLECTION ? '✅ Enabled' : '❌ Disabled'}`);
console.log(`   Performance Monitoring: ${config.features.PERFORMANCE_MONITORING ? '✅ Enabled' : '❌ Disabled'}`);
console.log(`   Verbose Logging: ${config.features.VERBOSE_LOGGING ? '✅ Enabled' : '❌ Disabled'}`);
console.log(`   Source Maps: ${config.features.SOURCE_MAPS ? '✅ Enabled' : '❌ Disabled'}\n`);

// Display security configuration
console.log('🔒 Security Configuration:');
console.log(`   CORS Enabled: ${config.security.CORS_ENABLED ? '✅ Yes' : '❌ No'}`);
console.log(`   CORS Origins: ${config.security.CORS_ORIGINS.join(', ')}`);
console.log(`   Rate Limiting: ${config.security.RATE_LIMIT_ENABLED ? '✅ Enabled' : '❌ Disabled'}`);
if (config.security.RATE_LIMIT_ENABLED) {
  console.log(`   Rate Limit: ${config.security.RATE_LIMIT_MAX_REQUESTS} requests per ${config.security.RATE_LIMIT_WINDOW_MS / 1000}s`);
}
console.log('');

// Display external services
console.log('🔗 External Services:');
console.log(`   RiggerConnect: ${config.services.RIGGER_CONNECT_URL}`);
console.log(`   RiggerHub: ${config.services.RIGGER_HUB_URL}`);
console.log(`   RiggerBackend: ${config.services.RIGGER_BACKEND_URL}\n`);

// Display logging configuration
console.log('📝 Logging Configuration:');
console.log(`   Level: ${config.logging.LEVEL}`);
console.log(`   Format: ${config.logging.FORMAT}`);
console.log(`   File: ${config.logging.FILE}\n`);

// Display monitoring configuration
console.log('📊 Monitoring Configuration:');
console.log(`   Health Check: ${config.monitoring.HEALTH_CHECK_ENABLED ? '✅ Enabled' : '❌ Disabled'}`);
console.log(`   Metrics: ${config.monitoring.METRICS_ENABLED ? '✅ Enabled' : '❌ Disabled'}`);
console.log(`   Error Reporting: ${config.monitoring.ERROR_REPORTING_ENABLED ? '✅ Enabled' : '❌ Disabled'}\n`);

// Demonstrate custom environment variable usage
console.log('🔧 Custom Environment Variable Example:');
const customPort = getEnvVar('PORT', 3000, 'number');
const customHost = getEnvVar('HOST', 'localhost');
const customFeature = getEnvVar('CUSTOM_FEATURE_ENABLED', false, 'boolean');

console.log(`   Custom Port: ${customPort}`);
console.log(`   Custom Host: ${customHost}`);
console.log(`   Custom Feature: ${customFeature ? '✅ Enabled' : '❌ Disabled'}\n`);

// Validate environment
console.log('✅ Environment Validation:');
try {
  validateEnvironment();
  console.log('   ✅ Environment validation passed!\n');
} catch (error) {
  console.log('   ❌ Environment validation failed:');
  console.log(`   ${error.message}\n`);
}

// Environment-specific recommendations
console.log('💡 Environment-Specific Recommendations:');
if (config.environment.isDevelopment) {
  console.log('   🛠️  Development Environment Detected:');
  console.log('   • Debug mode is enabled for detailed logging');
  console.log('   • Source maps are enabled for easier debugging');
  console.log('   • Hot reload is available for faster development');
  console.log('   • Less restrictive security settings for local testing');
} else if (config.environment.isProduction) {
  console.log('   🚀 Production Environment Detected:');
  console.log('   • Debug mode is disabled for performance');
  console.log('   • SSL/HTTPS should be enabled');
  console.log('   • Rate limiting is enabled for security');
  console.log('   • Error reporting should be configured');
  console.log('   • Make sure sensitive environment variables are set externally');
} else {
  console.log('   ⚠️  Unknown environment detected');
  console.log('   • Please set NODE_ENV to either "development" or "production"');
}
console.log('');

console.log('📚 For more information, see:');
console.log('   • docs/ENVIRONMENT_CONFIGURATION.md');
console.log('   • .env.development (development template)');
console.log('   • .env.production (production template)');
console.log('   • src/config/environment.js (configuration module)');
console.log('');

console.log('✨ Demo completed successfully!');
