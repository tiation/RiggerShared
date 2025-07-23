import { v4 as uuidv4 } from 'uuid';
import { ValidationPatterns } from '../types/index.js';

/**
 * String utilities
 */
export const StringUtils = {
  // Generate a random string of specified length
  generateRandomString: (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Convert string to slug (URL-friendly)
  toSlug: (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  },

  // Capitalize first letter of each word
  toTitleCase: (str) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Truncate string with ellipsis
  truncate: (str, maxLength = 100, suffix = '...') => {
    if (str.length <= maxLength) return str;
    return str.substr(0, maxLength - suffix.length) + suffix;
  },

  // Mask sensitive information (like email, phone)
  maskEmail: (email) => {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.slice(-1);
    return `${maskedLocal}@${domain}`;
  },

  maskPhone: (phone) => {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1****$3');
  },
};

/**
 * Date utilities
 */
export const DateUtils = {
  // Format date to Australian format (DD/MM/YYYY)
  formatAustralianDate: (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  },

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime: (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  },

  // Check if date is business day (Mon-Fri)
  isBusinessDay: (date) => {
    const day = new Date(date).getDay();
    return day >= 1 && day <= 5;
  },

  // Add business days to a date
  addBusinessDays: (date, days) => {
    const result = new Date(date);
    let addedDays = 0;
    
    while (addedDays < days) {
      result.setDate(result.getDate() + 1);
      if (DateUtils.isBusinessDay(result)) {
        addedDays++;
      }
    }
    
    return result;
  },
};

/**
 * Validation utilities
 */
export const ValidationUtils = {
  // Validate email format
  isValidEmail: (email) => {
    return ValidationPatterns.EMAIL.test(email);
  },

  // Validate Australian phone number
  isValidAustralianPhone: (phone) => {
    return ValidationPatterns.PHONE_AU.test(phone);
  },

  // Validate Australian postcode
  isValidPostcode: (postcode) => {
    return ValidationPatterns.POSTCODE_AU.test(postcode);
  },

  // Validate ABN (Australian Business Number)
  isValidABN: (abn) => {
    if (!ValidationPatterns.ABN.test(abn)) return false;
    
    // ABN checksum validation
    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    let sum = 0;
    
    for (let i = 0; i < 11; i++) {
      sum += (parseInt(abn[i]) * weights[i]);
    }
    
    return sum % 89 === 0;
  },

  // Validate password strength
  validatePasswordStrength: (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    const score = [
      password.length >= minLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSpecialChar
    ].filter(Boolean).length;
    
    return {
      isValid: score >= 3,
      score,
      requirements: {
        minLength: password.length >= minLength,
        hasUppercase,
        hasLowercase,
        hasNumbers,
        hasSpecialChar
      }
    };
  },
};

/**
 * Array utilities
 */
export const ArrayUtils = {
  // Remove duplicates from array
  unique: (arr) => [...new Set(arr)],

  // Group array by property
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Chunk array into smaller arrays
  chunk: (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  // Shuffle array randomly
  shuffle: (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
};

/**
 * Object utilities
 */
export const ObjectUtils = {
  // Deep clone object
  deepClone: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => ObjectUtils.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = ObjectUtils.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  },

  // Remove null/undefined values from object
  removeEmpty: (obj) => {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined && value !== '') {
        cleaned[key] = typeof value === 'object' && !Array.isArray(value) 
          ? ObjectUtils.removeEmpty(value) 
          : value;
      }
    }
    return cleaned;
  },

  // Get nested property safely
  get: (obj, path, defaultValue = undefined) => {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined || !(key in result)) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result;
  },

  // Set nested property
  set: (obj, path, value) => {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return obj;
  },
};

/**
 * Number utilities
 */
export const NumberUtils = {
  // Format number as currency (AUD)
  formatCurrency: (amount, currency = 'AUD') => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Format number with thousands separator
  formatNumber: (num) => {
    return new Intl.NumberFormat('en-AU').format(num);
  },

  // Generate random number in range
  randomInRange: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Round to specified decimal places
  roundTo: (num, decimals = 2) => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },
};

/**
 * File utilities
 */
export const FileUtils = {
  // Get file extension
  getExtension: (filename) => {
    return filename.split('.').pop().toLowerCase();
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Check if file type is image
  isImage: (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    return imageExtensions.includes(FileUtils.getExtension(filename));
  },

  // Check if file type is document
  isDocument: (filename) => {
    const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
    return docExtensions.includes(FileUtils.getExtension(filename));
  },
};

/**
 * URL utilities
 */
export const UrlUtils = {
  // Build URL with query parameters
  buildUrl: (baseUrl, params = {}) => {
    const url = new URL(baseUrl);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  },

  // Extract domain from URL
  getDomain: (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  },

  // Check if URL is valid
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * ID and UUID utilities
 */
export const IdUtils = {
  // Generate UUID v4
  generateUUID: () => uuidv4(),

  // Generate short ID (8 characters)
  generateShortId: () => {
    return Math.random().toString(36).substr(2, 8);
  },

  // Generate numeric ID
  generateNumericId: (length = 6) => {
    return Math.random().toString().substr(2, length);
  },
};

/**
 * Environment utilities
 */
export const EnvUtils = {
  // Check if running in development
  isDevelopment: () => process.env.NODE_ENV === 'development',

  // Check if running in production
  isProduction: () => process.env.NODE_ENV === 'production',

  // Check if running in test environment
  isTest: () => process.env.NODE_ENV === 'test',

  // Get environment variable with default
  getEnv: (key, defaultValue = null) => {
    return process.env[key] || defaultValue;
  },
};

/**
 * Error utilities
 */
export const ErrorUtils = {
  // Create standardized error object
  createError: (code, message, details = {}) => {
    const error = new Error(message);
    error.code = code;
    error.details = details;
    error.timestamp = new Date().toISOString();
    return error;
  },

  // Check if error is operational (expected) vs programming error
  isOperationalError: (error) => {
    return error.isOperational === true;
  },

  // Serialize error for logging
  serializeError: (error) => {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details,
      timestamp: error.timestamp || new Date().toISOString(),
    };
  },
};

/**
 * Retry utilities
 */
export const RetryUtils = {
  // Retry async operation with exponential backoff
  withRetry: async (operation, maxAttempts = 3, baseDelay = 1000) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxAttempts) {
          throw error;
        }
        
        // Exponential backoff: baseDelay * 2^(attempt-1)
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  },
};

// Export all utilities as default
export default {
  StringUtils,
  DateUtils,
  ValidationUtils,
  ArrayUtils,
  ObjectUtils,
  NumberUtils,
  FileUtils,
  UrlUtils,
  IdUtils,
  EnvUtils,
  ErrorUtils,
  RetryUtils,
};
