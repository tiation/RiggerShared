// RiggerShared - Shared Libraries and Utilities
// Enterprise-grade shared components for the Rigger ecosystem

// Export environment configuration
export { default as config, validateEnvironment, getEnvVar } from './config/environment.js';

// Export all types and constants
export * from './types/index.js';
export * from './constants/index.js';

// Export all utilities
export * from './utils/index.js';

// Legacy utilities (keeping for backwards compatibility)
export { default as Logger } from './utils/Logger.js';

// Database Managers  
// export { default as DatabaseManager } from './database-managers/DatabaseManager.js';

// AI Services
// export { default as FairnessMonitor } from './ai-services/FairnessMonitor.swift';

// Create a namespace object for easier importing
import * as Types from './types/index.js';
import * as Constants from './constants/index.js';
import Utils from './utils/index.js';

// Default export combining all modules
export default {
  Types,
  Constants,
  Utils,
};

// Version and library information
export const VERSION = '1.0.0';
export const LIBRARY_NAME = '@rigger/shared';

export const LibraryInfo = {
  name: LIBRARY_NAME,
  version: VERSION,
  description: 'Shared libraries and utilities for the Rigger ecosystem',
  author: 'Tiation Technologies',
  homepage: 'https://riggerconnect.tiation.net',
};
