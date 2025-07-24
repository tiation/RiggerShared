/**
 * RiggerShared - Centralized API Services
 * ChaseWhiteRabbit NGO Technology Initiative
 * 
 * Standardized API services for consistent communication across all platforms
 * Provides unified interfaces for job matching, payments, authentication, and more
 */

import { ApiResponse, PaginatedResponse, User, Job, JobApplication } from '../types/index.js';

// ==========================================
// BASE API CLIENT
// ==========================================

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  retryAttempts?: number;
  headers?: Record<string, string>;
}

export class BaseApiClient {
  private config: ApiConfig;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiConfig) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      ...config
    };
    
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Client': 'RiggerShared/1.0.0',
      ...config.headers
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = { ...this.defaultHeaders, ...options.headers };
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.message || 'Request failed'}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        timestamp: new Date().toISOString(),
        requestId: data.requestId
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { endpoint, options }
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// ==========================================
// AUTHENTICATION API
// ==========================================

export interface AuthService {
  login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>>;
  register(userData: Partial<User>): Promise<ApiResponse<{ user: User; token: string }>>;
  logout(): Promise<ApiResponse<void>>;
  refreshToken(): Promise<ApiResponse<{ token: string }>>;
  verifyToken(token: string): Promise<ApiResponse<{ user: User }>>;
}

export class StandardAuthService extends BaseApiClient implements AuthService {
  async login(email: string, password: string) {
    return this.post<{ user: User; token: string }>('/auth/login', { email, password });
  }

  async register(userData: Partial<User>) {
    return this.post<{ user: User; token: string }>('/auth/register', userData);
  }

  async logout() {
    return this.post<void>('/auth/logout');
  }

  async refreshToken() {
    return this.post<{ token: string }>('/auth/refresh');
  }

  async verifyToken(token: string) {
    return this.get<{ user: User }>('/auth/verify', { token });
  }
}

// ==========================================
// JOB MATCHING API
// ==========================================

export interface JobMatchingService {
  searchJobs(criteria: JobSearchCriteria): Promise<ApiResponse<PaginatedResponse<Job>>>;
  getJobRecommendations(userId: string): Promise<ApiResponse<Job[]>>;
  applyToJob(jobId: string, applicationData: Partial<JobApplication>): Promise<ApiResponse<JobApplication>>;
  getJobApplications(userId: string): Promise<ApiResponse<JobApplication[]>>;
  updateApplication(applicationId: string, data: Partial<JobApplication>): Promise<ApiResponse<JobApplication>>;
}

export interface JobSearchCriteria {
  location?: string;
  skills?: string[];
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  urgency?: string;
  page?: number;
  limit?: number;
}

export class StandardJobMatchingService extends BaseApiClient implements JobMatchingService {
  async searchJobs(criteria: JobSearchCriteria) {
    return this.get<PaginatedResponse<Job>>('/jobs/search', criteria);
  }

  async getJobRecommendations(userId: string) {
    return this.get<Job[]>(`/jobs/recommendations/${userId}`);
  }

  async applyToJob(jobId: string, applicationData: Partial<JobApplication>) {
    return this.post<JobApplication>(`/jobs/${jobId}/apply`, applicationData);
  }

  async getJobApplications(userId: string) {
    return this.get<JobApplication[]>(`/applications/user/${userId}`);
  }

  async updateApplication(applicationId: string, data: Partial<JobApplication>) {
    return this.put<JobApplication>(`/applications/${applicationId}`, data);
  }
}

// ==========================================
// AI SERVICES API
// ==========================================

export interface AIService {
  analyzeJobMatch(riggerProfile: any, job: Job): Promise<ApiResponse<{ score: number; reasons: string[] }>>;
  generateJobDescription(prompt: string): Promise<ApiResponse<{ description: string }>>;
  validateCertifications(certificates: any[]): Promise<ApiResponse<{ validationResults: any[] }>>;
  predictJobCompletion(jobId: string): Promise<ApiResponse<{ estimatedDays: number; confidence: number }>>;
}

export class StandardAIService extends BaseApiClient implements AIService {
  async analyzeJobMatch(riggerProfile: any, job: Job) {
    return this.post<{ score: number; reasons: string[] }>('/ai/match-analysis', {
      riggerProfile,
      job
    });
  }

  async generateJobDescription(prompt: string) {
    return this.post<{ description: string }>('/ai/generate-description', { prompt });
  }

  async validateCertifications(certificates: any[]) {
    return this.post<{ validationResults: any[] }>('/ai/validate-certifications', {
      certificates
    });
  }

  async predictJobCompletion(jobId: string) {
    return this.get<{ estimatedDays: number; confidence: number }>(`/ai/predict-completion/${jobId}`);
  }
}

// ==========================================
// COMPLIANCE API
// ==========================================

export interface ComplianceService {
  checkSafetyCompliance(jobId: string): Promise<ApiResponse<{ compliant: boolean; issues: string[] }>>;
  validateWorkerCertifications(workerId: string): Promise<ApiResponse<{ valid: boolean; expiringCerts: any[] }>>;
  generateComplianceReport(jobId: string): Promise<ApiResponse<{ reportUrl: string }>>;
  updateSafetyProtocols(protocols: any[]): Promise<ApiResponse<void>>;
}

export class StandardComplianceService extends BaseApiClient implements ComplianceService {
  async checkSafetyCompliance(jobId: string) {
    return this.get<{ compliant: boolean; issues: string[] }>(`/compliance/safety/${jobId}`);
  }

  async validateWorkerCertifications(workerId: string) {
    return this.get<{ valid: boolean; expiringCerts: any[] }>(`/compliance/certifications/${workerId}`);
  }

  async generateComplianceReport(jobId: string) {
    return this.post<{ reportUrl: string }>(`/compliance/report/${jobId}`);
  }

  async updateSafetyProtocols(protocols: any[]) {
    return this.put<void>('/compliance/protocols', { protocols });
  }
}

// ==========================================
// API FACTORY
// ==========================================

export class RiggerApiFactory {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  createAuthService(): AuthService {
    return new StandardAuthService(this.config);
  }

  createJobMatchingService(): JobMatchingService {
    return new StandardJobMatchingService(this.config);
  }

  createAIService(): AIService {
    return new StandardAIService(this.config);
  }

  createComplianceService(): ComplianceService {
    return new StandardComplianceService(this.config);
  }

  // Convenience method to create all services
  createAllServices() {
    return {
      auth: this.createAuthService(),
      jobMatching: this.createJobMatchingService(),
      ai: this.createAIService(),
      compliance: this.createComplianceService()
    };
  }
}

// ==========================================
// EXPORTS
// ==========================================

export * from './versioning';
export * from './middleware';

