/**
 * RiggerShared - Unified Types and Interfaces
 * ChaseWhiteRabbit NGO Technology Initiative
 * 
 * Shared types and interfaces across the Rigger ecosystem
 * Ensuring consistency between all platforms and applications
 */

// ==========================================
// CORE ENTITY TYPES
// ==========================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  profilePicture?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isVerified: boolean;
}

export interface RiggerProfile extends User {
  userType: 'rigger';
  certifications: Certification[];
  skills: Skill[];
  experience: Experience[];
  availability: Availability;
  hourlyRate: number;
  location: Location;
  safetyRating: number;
  completedJobs: number;
}

export interface EmployerProfile extends User {
  userType: 'employer';
  companyName: string;
  companySize: CompanySize;
  industry: Industry;
  location: Location;
  verificationStatus: VerificationStatus;
  rating: number;
  totalJobsPosted: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: Location;
  hourlyRate: number;
  duration?: string;
  startDate: string;
  endDate?: string;
  status: JobStatus;
  employerId: string;
  assignedRiggerId?: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
  urgency: UrgencyLevel;
  certificationRequired: string[];
  safetyRequirements: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  riggerId: string;
  status: ApplicationStatus;
  proposedRate?: number;
  message?: string;
  submittedAt: string;
  reviewedAt?: string;
  employer?: EmployerProfile;
  rigger?: RiggerProfile;
  job?: Job;
}

// ==========================================
// SUPPORTING TYPES
// ==========================================

export type UserType = 'rigger' | 'employer' | 'admin';

export type JobStatus = 
  | 'draft' 
  | 'published' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'expired';

export type ApplicationStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'withdrawn';

export type VerificationStatus = 
  | 'pending' 
  | 'verified' 
  | 'rejected' 
  | 'expired';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type CompanySize = 
  | 'startup' 
  | 'small' 
  | 'medium' 
  | 'large' 
  | 'enterprise';

export type Industry = 
  | 'construction' 
  | 'oil_gas' 
  | 'mining' 
  | 'manufacturing' 
  | 'infrastructure' 
  | 'other';

// ==========================================
// DETAILED INTERFACES
// ==========================================

export interface Location {
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Certification {
  id: string;
  name: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  isVerified: boolean;
  documentUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsOfExperience: number;
  isVerified: boolean;
}

export interface Experience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements?: string[];
  isCurrentRole: boolean;
}

export interface Availability {
  isAvailable: boolean;
  availableFrom?: string;
  preferredHours: string[];
  preferredLocations: string[];
  maxTravelDistance: number; // in kilometers
  weekdaysOnly: boolean;
}

export type SkillCategory = 
  | 'rigging' 
  | 'crane_operation' 
  | 'safety' 
  | 'logistics' 
  | 'technical' 
  | 'leadership';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string; // Only in development
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ==========================================
// AUTHENTICATION TYPES
// ==========================================

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  userType: UserType;
  iat: number;
  exp: number;
}

// ==========================================
// ANALYTICS TYPES
// ==========================================

export interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  metadata: Record<string, any>;
  timestamp: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  availability: number;
  timestamp: string;
}

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

export type NotificationType = 
  | 'job_application' 
  | 'job_status_update' 
  | 'payment_received' 
  | 'certification_expiry' 
  | 'system_announcement' 
  | 'safety_alert';

// ==========================================
// PAYMENT TYPES
// ==========================================

export interface Payment {
  id: string;
  jobId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  processedAt?: string;
  createdAt: string;
}

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'refunded';

export type PaymentMethod = 
  | 'stripe' 
  | 'bank_transfer' 
  | 'paypal' 
  | 'other';

// ==========================================
// CONFIGURATION TYPES
// ==========================================

export interface AppConfig {
  apiBaseUrl: string;
  environment: Environment;
  version: string;
  features: FeatureFlags;
  integrations: Integrations;
  chaseWhiteRabbitNgo: NgoConfig;
}

export type Environment = 'development' | 'staging' | 'production';

export interface FeatureFlags {
  enableJobMatching: boolean;
  enablePayments: boolean;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  enableRealtimeUpdates: boolean;
}

export interface Integrations {
  supabase: {
    url: string;
    anonKey: string;
  };
  stripe: {
    publishableKey: string;
  };
  analytics: {
    trackingId?: string;
  };
}

export interface NgoConfig {
  name: string;
  website: string;
  mission: string;
  email: string;
  socialMedia: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

// ==========================================
// EXPORT ALL TYPES
// ==========================================

export * from './validation';
export * from './constants';
