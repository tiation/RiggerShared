// Shared constants for Rigger ecosystem

/**
 * API Base URLs
 */
export const API_BASE_URLS = {
  DEVELOPMENT: 'http://localhost:3000/api',
  STAGING: 'https://staging.riggerconnect.tiation.net/api',
  PRODUCTION: 'https://riggerconnect.tiation.net/api',
};

/**
 * API Timeout Settings in milliseconds
 */
export const API_TIMEOUTS = {
  CONNECT_TIMEOUT: 5000, // Connection attempts timeout
  READ_TIMEOUT: 10000, // Read response timeout
}

/**
 * Default HTTP Headers for API requests
 */
export const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br'
};

/**
 * Namespaces for logging and metrics
 */
export const LOGGING_NAMESPACE = 'com.tiation.rigger';
export const METRICS_NAMESPACE = 'com.tiation.metrics';

/**
 * Events for application monitoring
 */
export const MONITORING_EVENTS = {
  USER_LOGIN_ATTEMPT: 'user.login.attempt',
  USER_LOGIN_SUCCESS: 'user.login.success',
  USER_LOGIN_FAILURE: 'user.login.failure',
  PAGE_VIEW: 'page.view',
  API_CALL: 'api.call',
  API_CALL_SUCCESS: 'api.call.success',
  API_CALL_FAILURE: 'api.call.failure',
}

/**
 * Regex patterns for validation
 */
export const VALIDATION_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
  POSTCODE: /^\d{4}$/, // Australian postcode
  PHONE_NUMBER: /^\(|0(\d{2,4})\)\d{7}$/,
};

export const APP_FEATURES = {
  ENABLED_FEATURES: ['dark_mode', 'multi_language', 'voice_commands', 'offline_mode'],
};
