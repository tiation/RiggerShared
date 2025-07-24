/**
 * RiggerShared - API Middleware System
 * ChaseWhiteRabbit NGO Technology Initiative
 * 
 * Standardized middleware for request/response processing across all platforms
 * Handles authentication, logging, rate limiting, and error handling
 */

import { ApiResponse, ApiError } from '../types/index.js';
import { VersionMiddleware } from './versioning.js';

// ==========================================
// MIDDLEWARE INTERFACES
// ==========================================

export interface MiddlewareContext {
  request: any;
  response?: any;
  user?: any;
  metadata: Record<string, any>;
  startTime: number;
}

export interface Middleware {
  name: string;
  priority: number;
  execute(context: MiddlewareContext, next: () => Promise<void>): Promise<void>;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (request: any) => string;
}

export interface CacheConfig {
  ttl: number;
  keyGenerator?: (request: any) => string;
  shouldCache?: (response: any) => boolean;
}

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

export class AuthenticationMiddleware implements Middleware {
  name = 'authentication';
  priority = 100;

  private exemptPaths: string[] = [
    '/auth/login',
    '/auth/register',
    '/health',
    '/version'
  ];

  constructor(exemptPaths?: string[]) {
    if (exemptPaths) {
      this.exemptPaths = [...this.exemptPaths, ...exemptPaths];
    }
  }

  async execute(context: MiddlewareContext, next: () => Promise<void>): Promise<void> {
    const { request } = context;
    const path = this.extractPath(request);

    // Skip authentication for exempt paths
    if (this.exemptPaths.some(exemptPath => path.startsWith(exemptPath))) {
      await next();
      return;
    }

    const token = this.extractToken(request);
    if (!token) {
      throw new ApiError('AUTHENTICATION_REQUIRED', 'Authentication token is required');
    }

    try {
      const user = await this.verifyToken(token);
      context.user = user;
      await next();
    } catch (error) {
      throw new ApiError('INVALID_TOKEN', 'Invalid or expired authentication token');
    }
  }

  private extractPath(request: any): string {
    return request.url || request.path || '';
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers?.authorization || request.headers?.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  private async verifyToken(token: string): Promise<any> {
    // This would integrate with your actual token verification service
    // For now, return a mock user
    return {
      id: 'user-123',
      email: 'user@example.com',
      role: 'rigger'
    };
  }
}

// ==========================================
// LOGGING MIDDLEWARE
// ==========================================

export class LoggingMiddleware implements Middleware {
  name = 'logging';
  priority = 10;

  async execute(context: MiddlewareContext, next: () => Promise<void>): Promise<void> {
    const { request } = context;
    const startTime = Date.now();
    
    // Log request
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`, {
      headers: this.sanitizeHeaders(request.headers),
      body: this.sanitizeBody(request.body),
      userAgent: request.headers?.['user-agent'],
      ip: request.ip
    });

    try {
      await next();
      
      // Log successful response
      const duration = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] Response completed in ${duration}ms`);
    } catch (error) {
      // Log error
      const duration = Date.now() - startTime;
      console.error(`[${new Date().toISOString()}] Request failed after ${duration}ms:`, error);
      throw error;
    }
  }

  private sanitizeHeaders(headers: Record<string, any> = {}): Record<string, any> {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
    const sanitized = { ...body };
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
}

// ==========================================
// RATE LIMITING MIDDLEWARE
// ==========================================

export class RateLimitMiddleware implements Middleware {
  name = 'rateLimit';
  priority = 90;

  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (req) => req.ip || 'anonymous',
      ...config
    };
  }

  async execute(context: MiddlewareContext, next: () => Promise<void>): Promise<void> {
    const { request } = context;
    const key = this.config.keyGenerator!(request);
    const now = Date.now();
    
    // Clean up expired entries
    this.cleanup(now);
    
    // Get or create rate limit entry
    let entry = this.requests.get(key);
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs
      };
      this.requests.set(key, entry);
    }
    
    // Check rate limit
    if (entry.count >= this.config.maxRequests) {
      const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);
      throw new ApiError('RATE_LIMIT_EXCEEDED', `Rate limit exceeded. Try again in ${resetInSeconds} seconds`);
    }
    
    // Increment counter and proceed
    entry.count++;
    
    try {
      await next();
      
      // Optionally skip counting successful requests
      if (this.config.skipSuccessfulRequests) {
        entry.count--;
      }
    } catch (error) {
      // Optionally skip counting failed requests
      if (this.config.skipFailedRequests) {
        entry.count--;
      }
      throw error;
    }
  }

  private cleanup(now: number): void {
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// ==========================================
// CACHING MIDDLEWARE
// ==========================================

export class CachingMiddleware implements Middleware {
  name = 'caching';
  priority = 80;

  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = {
      keyGenerator: (req) => `${req.method}:${req.url}`,
      shouldCache: (res) => res && !res.error,
      ...config
    };
  }

  async execute(context: MiddlewareContext, next: () => Promise<void>): Promise<void> {
    const { request } = context;
    const cacheKey = this.config.keyGenerator!(request);
    const now = Date.now();

    // Clean up expired entries
    this.cleanup(now);

    // Check cache for GET requests
    if (request.method === 'GET') {
      const cached = this.cache.get(cacheKey);
      if (cached && now < cached.expiry) {
        context.response = { ...cached.data, cached: true };
        return;
      }
    }

    await next();

    // Cache successful responses for GET requests
    if (request.method === 'GET' && context.response && this.config.shouldCache!(context.response)) {
      this.cache.set(cacheKey, {
        data: context.response,
        expiry: now + this.config.ttl
      });
    }
  }

  private cleanup(now: number): void {
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// ==========================================
// ERROR HANDLING MIDDLEWARE
// ==========================================

export class ErrorHandlingMiddleware implements Middleware {
  name = 'errorHandling';
  priority = 1; // Lowest priority, executes last

  async execute(context: MiddlewareContext, next: () => Promise<void>): Promise<void> {
    try {
      await next();
    } catch (error) {
      context.response = this.formatError(error);
    }
  }

  private formatError(error: any): ApiResponse<never> {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        },
        timestamp: new Date().toISOString()
      };
    }

    // Handle standard errors
    if (error instanceof Error) {
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message
        },
        timestamp: new Date().toISOString()
      };
    }

    // Handle unknown errors
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred'
      },
      timestamp: new Date().toISOString()
    };
  }
}

// ==========================================
// VALIDATION MIDDLEWARE
// ==========================================

export class ValidationMiddleware implements Middleware {
  name = 'validation';
  priority = 95;

  private validators: Map<string, (data: any) => { valid: boolean; errors: string[] }> = new Map();

  addValidator(path: string, validator: (data: any) => { valid: boolean; errors: string[] }): void {
    this.validators.set(path, validator);
  }

  async execute(context: MiddlewareContext, next: () => Promise<void>): Promise<void> {
    const { request } = context;
    const path = this.extractPath(request);
    const validator = this.validators.get(path);

    if (validator && request.body) {
      const validation = validator(request.body);
      if (!validation.valid) {
        throw new ApiError('VALIDATION_ERROR', 'Request validation failed', {
          errors: validation.errors
        });
      }
    }

    await next();
  }

  private extractPath(request: any): string {
    return request.url || request.path || '';
  }
}

// ==========================================
// MIDDLEWARE PIPELINE
// ==========================================

export class MiddlewarePipeline {
  private middlewares: Middleware[] = [];

  add(middleware: Middleware): void {
    this.middlewares.push(middleware);
    this.middlewares.sort((a, b) => b.priority - a.priority);
  }

  remove(name: string): void {
    this.middlewares = this.middlewares.filter(m => m.name !== name);
  }

  async execute(context: MiddlewareContext): Promise<void> {
    let index = 0;

    const next = async (): Promise<void> => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        await middleware.execute(context, next);
      }
    };

    await next();
  }

  getMiddlewares(): string[] {
    return this.middlewares.map(m => m.name);
  }
}

// ==========================================
// API ERROR CLASS
// ==========================================

export class ApiError extends Error {
  public code: string;
  public details?: Record<string, any>;

  constructor(code: string, message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

// ==========================================
// FACTORY FOR STANDARD PIPELINE
// ==========================================

export function createStandardPipeline(options: {
  rateLimitConfig?: RateLimitConfig;
  cacheConfig?: CacheConfig;
  authExemptPaths?: string[];
}): MiddlewarePipeline {
  const pipeline = new MiddlewarePipeline();

  // Add standard middlewares
  pipeline.add(new LoggingMiddleware());
  pipeline.add(new ErrorHandlingMiddleware());
  pipeline.add(new ValidationMiddleware());
  
  if (options.authExemptPaths) {
    pipeline.add(new AuthenticationMiddleware(options.authExemptPaths));
  } else {
    pipeline.add(new AuthenticationMiddleware());
  }

  if (options.rateLimitConfig) {
    pipeline.add(new RateLimitMiddleware(options.rateLimitConfig));
  }

  if (options.cacheConfig) {
    pipeline.add(new CachingMiddleware(options.cacheConfig));
  }

  return pipeline;
}

// ==========================================
// EXPORTS
// ==========================================

export * from './versioning.js';
