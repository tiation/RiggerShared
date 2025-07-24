/**
 * @file Notification Types and Schemas
 * @author ChaseWhiteRabbit NGO
 * @description Type definitions and validation schemas for notifications
 */

export * from './NotificationTypes.js';

/**
 * RiggerHub Notification Types - For Workers
 */
export const RiggerHubNotifications = {
  // Job-related notifications
  NEW_JOB_MATCH: 'riggerhub:new_job_match',
  JOB_STATUS_CHANGE: 'riggerhub:job_status_change',
  JOB_INVITATION: 'riggerhub:job_invitation',
  JOB_REMINDER: 'riggerhub:job_reminder',
  
  // Compliance notifications
  CERT_EXPIRY_WARNING: 'riggerhub:cert_expiry_warning',
  COMPLIANCE_UPDATE_REQUIRED: 'riggerhub:compliance_update_required',
  SAFETY_ALERT: 'riggerhub:safety_alert',
  TRAINING_REMINDER: 'riggerhub:training_reminder',
  
  // System notifications
  PROFILE_UPDATE_REQUEST: 'riggerhub:profile_update_request',
  PAYMENT_NOTIFICATION: 'riggerhub:payment_notification',
  SYSTEM_MAINTENANCE: 'riggerhub:system_maintenance'
};

/**
 * RiggerConnect Notification Types - For Employers
 */
export const RiggerConnectNotifications = {
  // Applicant-related notifications
  NEW_APPLICATION: 'riggerconnect:new_application',
  APPLICANT_STATUS_UPDATE: 'riggerconnect:applicant_status_update',
  APPLICANT_MESSAGE: 'riggerconnect:applicant_message',
  INTERVIEW_SCHEDULED: 'riggerconnect:interview_scheduled',
  
  // Job posting notifications
  JOB_POSTED_SUCCESS: 'riggerconnect:job_posted_success',
  JOB_VIEWS_UPDATE: 'riggerconnect:job_views_update',
  JOB_EXPIRY_WARNING: 'riggerconnect:job_expiry_warning',
  
  // System notifications
  PAYMENT_DUE: 'riggerconnect:payment_due',
  SUBSCRIPTION_EXPIRY: 'riggerconnect:subscription_expiry',
  COMPLIANCE_ALERT: 'riggerconnect:compliance_alert'
};

/**
 * Notification priority levels
 */
export const NotificationPriority = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
  CRITICAL: 'critical'
};

/**
 * Notification delivery methods
 */
export const DeliveryMethod = {
  REALTIME: 'realtime',
  PUSH: 'push',
  EMAIL: 'email',
  SMS: 'sms',
  IN_APP: 'in_app'
};

/**
 * User types in the Rigger ecosystem
 */
export const UserType = {
  WORKER: 'worker',
  EMPLOYER: 'employer',
  ADMIN: 'admin',
  SYSTEM: 'system'
};

/**
 * Notification channel names
 */
export const ChannelNames = {
  // RiggerHub channels (Workers)
  WORKER_JOBS: 'worker:jobs',
  WORKER_COMPLIANCE: 'worker:compliance',
  WORKER_MESSAGES: 'worker:messages',
  WORKER_PROFILE: 'worker:profile',
  
  // RiggerConnect channels (Employers)
  EMPLOYER_APPLICATIONS: 'employer:applications',
  EMPLOYER_JOBS: 'employer:jobs',
  EMPLOYER_MESSAGES: 'employer:messages',
  EMPLOYER_BILLING: 'employer:billing',
  
  // System channels
  SYSTEM_ALERTS: 'system:alerts',
  SYSTEM_MAINTENANCE: 'system:maintenance'
};

/**
 * Base notification schema
 */
export const BaseNotificationSchema = {
  id: 'string',
  type: 'string',
  title: 'string',
  message: 'string',
  priority: 'string',
  userId: 'string',
  userType: 'string',
  channel: 'string',
  data: 'object',
  deliveryMethods: 'array',
  timestamp: 'number',
  expiresAt: 'number?',
  read: 'boolean',
  acknowledged: 'boolean'
};

/**
 * Job alert notification schema
 */
export const JobAlertSchema = {
  ...BaseNotificationSchema,
  data: {
    jobId: 'string',
    jobTitle: 'string',
    companyName: 'string',
    location: 'string',
    salaryRange: 'string?',
    urgency: 'string',
    requirements: 'array',
    matchScore: 'number?'
  }
};

/**
 * Compliance reminder schema
 */
export const ComplianceReminderSchema = {
  ...BaseNotificationSchema,
  data: {
    complianceType: 'string',
    expiryDate: 'string',
    daysUntilExpiry: 'number',
    renewalUrl: 'string?',
    requirements: 'array',
    severity: 'string'
  }
};

/**
 * Applicant status update schema
 */
export const ApplicantStatusUpdateSchema = {
  ...BaseNotificationSchema,
  data: {
    applicationId: 'string',
    jobId: 'string',
    jobTitle: 'string',
    applicantName: 'string',
    previousStatus: 'string',
    newStatus: 'string',
    statusMessage: 'string?',
    nextSteps: 'array?'
  }
};

/**
 * Message notification schema
 */
export const MessageSchema = {
  ...BaseNotificationSchema,
  data: {
    messageId: 'string',
    senderId: 'string',
    senderName: 'string',
    senderType: 'string',
    conversationId: 'string?',
    messagePreview: 'string',
    attachments: 'array?',
    isUrgent: 'boolean'
  }
};

/**
 * Notification validation schemas
 */
export const NotificationSchemas = {
  [RiggerHubNotifications.NEW_JOB_MATCH]: JobAlertSchema,
  [RiggerHubNotifications.CERT_EXPIRY_WARNING]: ComplianceReminderSchema,
  [RiggerConnectNotifications.APPLICANT_STATUS_UPDATE]: ApplicantStatusUpdateSchema,
  [RiggerConnectNotifications.APPLICANT_MESSAGE]: MessageSchema,
  // Add more mappings as needed
};

/**
 * Privacy settings schema
 */
export const PrivacySettingsSchema = {
  userId: 'string',
  allowRealtime: 'boolean',
  allowPush: 'boolean',
  allowEmail: 'boolean',
  allowSMS: 'boolean',
  quietHours: {
    enabled: 'boolean',
    start: 'string',
    end: 'string',
    timezone: 'string'
  },
  channelPreferences: 'object',
  dataProcessingConsent: 'boolean',
  lastUpdated: 'number'
};

/**
 * Rate limiting configuration
 */
export const RateLimitConfig = {
  [NotificationPriority.LOW]: { maxPerHour: 10, maxPerDay: 50 },
  [NotificationPriority.NORMAL]: { maxPerHour: 20, maxPerDay: 100 },
  [NotificationPriority.HIGH]: { maxPerHour: 50, maxPerDay: 200 },
  [NotificationPriority.URGENT]: { maxPerHour: 100, maxPerDay: 500 },
  [NotificationPriority.CRITICAL]: { maxPerHour: -1, maxPerDay: -1 } // No limits
};

export default {
  NotificationTypes,
  RiggerHubNotifications,
  RiggerConnectNotifications,
  NotificationPriority,
  DeliveryMethod,
  UserType,
  ChannelNames,
  NotificationSchemas,
  PrivacySettingsSchema,
  RateLimitConfig
};
