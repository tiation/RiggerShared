// Shared types and interfaces for the Rigger ecosystem

/**
 * User types and roles
 */
export const UserRoles = {
  ADMIN: 'admin',
  RIGGER: 'rigger',
  EMPLOYER: 'employer',
  AGENT: 'agent',
  SUPERVISOR: 'supervisor',
};

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING_VERIFICATION: 'pending_verification',
};

/**
 * Job types and categories
 */
export const JobCategories = {
  CONSTRUCTION: 'construction',
  MINING: 'mining',
  OIL_GAS: 'oil_gas',
  MARITIME: 'maritime',
  RENEWABLE_ENERGY: 'renewable_energy',
  TELECOMMUNICATIONS: 'telecommunications',
  ENTERTAINMENT: 'entertainment',
};

export const JobTypes = {
  FULL_TIME: 'full_time',
  CONTRACT: 'contract',
  CASUAL: 'casual',
  APPRENTICESHIP: 'apprenticeship',
  TEMPORARY: 'temporary',
};

export const JobStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  PAUSED: 'paused',
  CLOSED: 'closed',
  FILLED: 'filled',
  CANCELLED: 'cancelled',
};

/**
 * Application status
 */
export const ApplicationStatus = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  SHORTLISTED: 'shortlisted',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  INTERVIEW_COMPLETED: 'interview_completed',
  OFFERED: 'offered',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
};

/**
 * Payment and subscription types
 */
export const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const SubscriptionPlans = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
};

/**
 * Geographic and location types
 */
export const States = {
  NSW: 'nsw',
  VIC: 'vic',
  QLD: 'qld',
  WA: 'wa',
  SA: 'sa',
  TAS: 'tas',
  ACT: 'act',
  NT: 'nt',
};

export const Countries = {
  AUSTRALIA: 'australia',
  NEW_ZEALAND: 'new_zealand',
  UNITED_STATES: 'united_states',
  CANADA: 'canada',
  UNITED_KINGDOM: 'united_kingdom',
};

/**
 * Safety and compliance types
 */
export const CertificationTypes = {
  WHITE_CARD: 'white_card',
  WORKING_AT_HEIGHTS: 'working_at_heights',
  CONFINED_SPACES: 'confined_spaces',
  FIRST_AID: 'first_aid',
  RIGGING_LICENSE: 'rigging_license',
  CRANE_LICENSE: 'crane_license',
  FORKLIFT_LICENSE: 'forklift_license',
  ELECTRICAL_LICENSE: 'electrical_license',
  WELDING_CERTIFICATE: 'welding_certificate',
};

export const SafetyRatings = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  SATISFACTORY: 'satisfactory',
  NEEDS_IMPROVEMENT: 'needs_improvement',
  POOR: 'poor',
};

/**
 * Communication and notification types
 */
export const NotificationTypes = {
  JOB_ALERT: 'job_alert',
  APPLICATION_UPDATE: 'application_update',
  MESSAGE: 'message',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
  PAYMENT_UPDATE: 'payment_update',
  SAFETY_ALERT: 'safety_alert',
  COMPLIANCE_REMINDER: 'compliance_reminder',
};

export const MessageTypes = {
  TEXT: 'text',
  IMAGE: 'image',
  DOCUMENT: 'document',
  SYSTEM: 'system',
  AUTOMATED: 'automated',
};

/**
 * API Response types
 */
export const ApiResponseStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
};

export const HttpStatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Monitoring and logging types
 */
export const LogLevels = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
};

export const MetricTypes = {
  COUNTER: 'counter',
  GAUGE: 'gauge',
  HISTOGRAM: 'histogram',
  SUMMARY: 'summary',
};

/**
 * Feature flags and configurations
 */
export const FeatureFlags = {
  AI_MATCHING: 'ai_matching',
  VIDEO_INTERVIEWS: 'video_interviews',
  REAL_TIME_CHAT: 'real_time_chat',
  MOBILE_PUSH_NOTIFICATIONS: 'mobile_push_notifications',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  PAYMENT_PROCESSING: 'payment_processing',
  BACKGROUND_CHECKS: 'background_checks',
};

/**
 * Validation patterns and rules
 */
export const ValidationPatterns = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_AU: /^(\+61|0)[2-9]\d{8}$/,
  ABN: /^\d{11}$/,
  TFN: /^\d{8,9}$/,
  LICENSE_PLATE: /^[A-Z0-9]{2,6}$/,
  POSTCODE_AU: /^\d{4}$/,
};

/**
 * Error codes for consistent error handling
 */
export const ErrorCodes = {
  // Authentication & Authorization
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Business Logic
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // System
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
};

/**
 * Default configurations
 */
export const DefaultConfig = {
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  fileUpload: {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'],
  },
  security: {
    passwordMinLength: 8,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  monitoring: {
    metricsFlushInterval: 30000, // 30 seconds
    logLevel: 'info',
    enableTracing: true,
  },
};
