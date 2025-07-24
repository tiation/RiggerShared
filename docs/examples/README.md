# RiggerShared Usage Examples

🚀 **ChaseWhiteRabbit NGO Development Examples**

## 📋 Overview

This guide provides comprehensive code examples and usage patterns for integrating RiggerShared libraries into your applications across web, mobile, and backend platforms.

## 🌐 Web Integration Examples

### Basic Setup

```javascript
// Import RiggerShared modules
import { 
  Logger, 
  ConfigManager, 
  ApiClient, 
  ValidationUtils 
} from '@rigger/shared';

// Initialize configuration
const config = new ConfigManager({
  environment: process.env.NODE_ENV || 'development',
  apiBaseUrl: process.env.API_BASE_URL
});

// Setup logger
const logger = new Logger({
  level: config.get('LOG_LEVEL', 'info'),
  service: 'rigger-web'
});
```

### API Client Usage

```javascript
// Create API client instance
const apiClient = new ApiClient({
  baseURL: config.get('API_BASE_URL'),
  timeout: 30000,
  retries: 3
});

// Add authentication interceptor
apiClient.addInterceptor('request', (config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example API calls
async function fetchUserProfile(userId) {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    logger.info('User profile fetched successfully', { userId });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user profile', { userId, error });
    throw error;
  }
}

// POST request with validation
async function createJobPosting(jobData) {
  const validatedData = ValidationUtils.validateJobPosting(jobData);
  
  try {
    const response = await apiClient.post('/jobs', validatedData);
    logger.info('Job posting created', { jobId: response.data.id });
    return response.data;
  } catch (error) {
    logger.error('Failed to create job posting', { error });
    throw error;
  }
}
```

### Form Validation Examples

```javascript
import { ValidationSchema, FormValidator } from '@rigger/shared';

// Define validation schema
const userRegistrationSchema = ValidationSchema.object({
  email: ValidationSchema.string().email().required(),
  password: ValidationSchema.string().min(8).required(),
  confirmPassword: ValidationSchema.string().required(),
  profile: ValidationSchema.object({
    firstName: ValidationSchema.string().required(),
    lastName: ValidationSchema.string().required(),
    skills: ValidationSchema.array().min(1)
  })
});

// React component example
function RegistrationForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  
  const validator = new FormValidator(userRegistrationSchema);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validator.validate(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    try {
      await apiClient.post('/auth/register', formData);
      logger.info('User registered successfully');
    } catch (error) {
      logger.error('Registration failed', { error });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## 📱 Mobile Integration Examples

### Android (Kotlin)

```kotlin
// Import RiggerShared Android modules
import com.rigger.shared.network.ApiClient
import com.rigger.shared.logging.Logger
import com.rigger.shared.config.ConfigManager
import com.rigger.shared.validation.ValidationUtils

class RiggerApplication : Application() {
    companion object {
        lateinit var apiClient: ApiClient
        lateinit var logger: Logger
        lateinit var config: ConfigManager
    }
    
    override fun onCreate() {
        super.onCreate()
        
        // Initialize configuration
        config = ConfigManager.Builder()
            .setEnvironment(BuildConfig.ENVIRONMENT)
            .setApiBaseUrl(BuildConfig.API_BASE_URL)
            .build()
        
        // Setup logger
        logger = Logger.Builder()
            .setLevel(config.getLogLevel())
            .setService("rigger-android")
            .build()
        
        // Initialize API client
        apiClient = ApiClient.Builder()
            .setBaseUrl(config.getApiBaseUrl())
            .setTimeout(30000)
            .setRetries(3)
            .addInterceptor(AuthInterceptor())
            .build()
    }
}

// Repository example
class UserRepository {
    suspend fun fetchUserProfile(userId: String): Result<UserProfile> {
        return try {
            val response = RiggerApplication.apiClient.get("/users/$userId")
            RiggerApplication.logger.info("User profile fetched", mapOf("userId" to userId))
            Result.success(response.data)
        } catch (exception: Exception) {
            RiggerApplication.logger.error("Failed to fetch user profile", exception)
            Result.failure(exception)
        }
    }
    
    suspend fun updateProfile(profile: UserProfile): Result<UserProfile> {
        val validationResult = ValidationUtils.validateUserProfile(profile)
        if (!validationResult.isValid) {
            return Result.failure(ValidationException(validationResult.errors))
        }
        
        return try {
            val response = RiggerApplication.apiClient.put("/users/${profile.id}", profile)
            RiggerApplication.logger.info("Profile updated successfully")
            Result.success(response.data)
        } catch (exception: Exception) {
            RiggerApplication.logger.error("Failed to update profile", exception)
            Result.failure(exception)
        }
    }
}
```

### iOS (Swift)

```swift
// Import RiggerShared iOS modules
import RiggerShared

class RiggerAppManager {
    static let shared = RiggerAppManager()
    
    let apiClient: RiggerAPIClient
    let logger: RiggerLogger
    let config: RiggerConfig
    
    private init() {
        // Initialize configuration
        config = RiggerConfig(environment: Bundle.main.environment)
        
        // Setup logger
        logger = RiggerLogger(level: config.logLevel, service: "rigger-ios")
        
        // Initialize API client
        apiClient = RiggerAPIClient(
            baseURL: config.apiBaseURL,
            timeout: 30.0,
            retries: 3
        )
        
        // Add authentication interceptor
        apiClient.addInterceptor { request in
            if let token = KeychainManager.shared.getAuthToken() {
                request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
            }
            return request
        }
    }
}

// Service example
class UserService {
    private let apiClient = RiggerAppManager.shared.apiClient
    private let logger = RiggerAppManager.shared.logger
    
    func fetchUserProfile(userId: String) async throws -> UserProfile {
        do {
            let response: APIResponse<UserProfile> = try await apiClient.get("/users/\(userId)")
            logger.info("User profile fetched successfully", metadata: ["userId": userId])
            return response.data
        } catch {
            logger.error("Failed to fetch user profile", error: error, metadata: ["userId": userId])
            throw error
        }
    }
    
    func createJobPosting(_ jobData: JobPostingData) async throws -> JobPosting {
        let validationResult = RiggerValidation.validateJobPosting(jobData)
        guard validationResult.isValid else {
            throw ValidationError.invalidData(validationResult.errors)
        }
        
        do {
            let response: APIResponse<JobPosting> = try await apiClient.post("/jobs", body: jobData)
            logger.info("Job posting created", metadata: ["jobId": response.data.id])
            return response.data
        } catch {
            logger.error("Failed to create job posting", error: error)
            throw error
        }
    }
}
```

## 🖥️ Backend Integration Examples

### Node.js/Express Server

```javascript
import express from 'express';
import { 
  Logger, 
  ConfigManager, 
  DatabaseManager, 
  ValidationMiddleware,
  AuthMiddleware,
  ErrorHandler 
} from '@rigger/shared';

// Initialize application
const app = express();
const config = new ConfigManager();
const logger = new Logger({ service: 'rigger-backend' });

// Database setup
const db = new DatabaseManager({
  host: config.get('DB_HOST'),
  port: config.get('DB_PORT'),
  database: config.get('DB_NAME'),
  username: config.get('DB_USER'),
  password: config.get('DB_PASSWORD')
});

// Middleware setup
app.use(express.json());
app.use(Logger.requestLogger());
app.use(AuthMiddleware.verify());

// Route handlers
app.post('/api/users', 
  ValidationMiddleware.validate(userSchema),
  async (req, res, next) => {
    try {
      const userData = req.body;
      const user = await db.users.create(userData);
      
      logger.info('User created successfully', { userId: user.id });
      res.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  }
);

app.get('/api/jobs', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, location, skills } = req.query;
    
    const jobs = await db.jobs.findMany({
      where: {
        ...(location && { location }),
        ...(skills && { skills: { in: skills.split(',') } })
      },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    logger.info('Jobs fetched', { count: jobs.length, page, limit });
    res.json({ data: jobs });
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use(ErrorHandler.globalHandler());

// Start server
const PORT = config.get('PORT', 3000);
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
```

### Microservice Example

```javascript
import { MicroserviceFramework } from '@rigger/shared';

class NotificationService extends MicroserviceFramework {
  constructor() {
    super({
      name: 'notification-service',
      version: '1.0.0',
      port: 3001
    });
    
    this.setupRoutes();
    this.setupMessageHandlers();
  }
  
  setupRoutes() {
    this.post('/notifications/send', this.sendNotification.bind(this));
    this.get('/notifications/:userId', this.getUserNotifications.bind(this));
  }
  
  setupMessageHandlers() {
    this.onMessage('user.registered', this.sendWelcomeEmail.bind(this));
    this.onMessage('job.matched', this.sendJobMatchNotification.bind(this));
  }
  
  async sendNotification(req, res) {
    const { type, recipient, content } = req.body;
    
    try {
      const notification = await this.db.notifications.create({
        type,
        recipient,
        content,
        status: 'pending'
      });
      
      await this.deliverNotification(notification);
      
      this.logger.info('Notification sent', { notificationId: notification.id });
      res.json({ success: true, id: notification.id });
    } catch (error) {
      this.logger.error('Failed to send notification', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  async sendWelcomeEmail(data) {
    const { user } = data;
    
    await this.sendNotification({
      body: {
        type: 'email',
        recipient: user.email,
        content: {
          template: 'welcome',
          data: { firstName: user.firstName }
        }
      }
    });
  }
}

// Start the service
const notificationService = new NotificationService();
notificationService.start();
```

## 🧪 Testing Examples

### Unit Tests

```javascript
import { jest } from '@jest/globals';
import { ApiClient, Logger } from '@rigger/shared';

describe('ApiClient', () => {
  let apiClient;
  let mockLogger;
  
  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn()
    };
    
    apiClient = new ApiClient({
      baseURL: 'https://api.test.com',
      logger: mockLogger
    });
  });
  
  test('should make GET request successfully', async () => {
    const mockResponse = { data: { id: 1, name: 'Test User' } };
    
    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });
    
    const result = await apiClient.get('/users/1');
    
    expect(result).toEqual(mockResponse);
    expect(mockLogger.info).toHaveBeenCalledWith(
      'API request successful',
      expect.objectContaining({ method: 'GET', url: '/users/1' })
    );
  });
  
  test('should handle API errors gracefully', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });
    
    await expect(apiClient.get('/users/999')).rejects.toThrow('Not Found');
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
```

### Integration Tests

```javascript
import request from 'supertest';
import { app } from '../src/app.js';
import { DatabaseManager } from '@rigger/shared';

describe('User API Integration', () => {
  let db;
  
  beforeAll(async () => {
    db = new DatabaseManager({ environment: 'test' });
    await db.connect();
  });
  
  afterAll(async () => {
    await db.disconnect();
  });
  
  beforeEach(async () => {
    await db.users.deleteMany({});
  });
  
  test('POST /api/users should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'testpassword123',
      profile: {
        firstName: 'Test',
        lastName: 'User'
      }
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);
    
    expect(response.body.data).toMatchObject({
      email: userData.email,
      profile: userData.profile
    });
    
    // Verify user was created in database
    const user = await db.users.findOne({ email: userData.email });
    expect(user).toBeTruthy();
  });
});
```

## 🎯 Performance Examples

### Caching Implementation

```javascript
import { CacheManager, Logger } from '@rigger/shared';

class UserService {
  constructor() {
    this.cache = new CacheManager({
      type: 'redis',
      ttl: 300 // 5 minutes
    });
    this.logger = new Logger({ service: 'user-service' });
  }
  
  async getUserProfile(userId) {
    const cacheKey = `user:profile:${userId}`;
    
    // Try cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      this.logger.info('Cache hit for user profile', { userId });
      return cached;
    }
    
    // Fetch from database
    const user = await this.db.users.findById(userId);
    
    // Cache the result
    await this.cache.set(cacheKey, user);
    
    this.logger.info('User profile fetched and cached', { userId });
    return user;
  }
}
```

### Batch Processing

```javascript
import { BatchProcessor } from '@rigger/shared';

const emailProcessor = new BatchProcessor({
  batchSize: 100,
  concurrency: 5,
  delay: 1000
});

emailProcessor.process(async (batch) => {
  const emailPromises = batch.map(notification => 
    sendEmail(notification.recipient, notification.content)
  );
  
  const results = await Promise.allSettled(emailPromises);
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  logger.info('Email batch processed', { successful, failed, total: batch.length });
});

// Add notifications to batch
await emailProcessor.add(notifications);
```

## 📚 Additional Resources

- [API Documentation](../api/README.md)
- [Architecture Overview](../architecture/overview.md)
- [Deployment Guide](../deployment/README.md)
- [Troubleshooting Guide](../troubleshooting/README.md)

---

**ChaseWhiteRabbit NGO** | Enterprise-Grade • Ethical • DevOps-Ready
