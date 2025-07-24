/**
 * RiggerShared - Cross-Platform Integration Examples
 * ChaseWhiteRabbit NGO Technology Initiative
 * 
 * Demonstrates how to use standardized APIs, database integration,
 * and shared libraries across all Rigger ecosystem applications
 */

import {
  // API Services
  RiggerApiFactory,
  createStandardPipeline,
  
  // Database Integration
  DatabaseManager,
  createMigrationManager,
  
  // Versioning
  ApiVersionManager,
  VersionMiddleware,
  
  // Types
  User,
  Job,
  JobApplication,
  
  // Configuration
  config,
  validateEnvironment
} from '@rigger/shared';

// ==========================================
// CONFIGURATION SETUP
// ==========================================

// Validate environment variables
validateEnvironment();

// Configuration for different environments
const getApiConfig = () => {
  const environment = process.env.NODE_ENV || 'development';
  
  const configs = {
    development: {
      baseUrl: 'http://localhost:3000/api',
      timeout: 30000,
      headers: {
        'X-Environment': 'development'
      }
    },
    staging: {
      baseUrl: 'https://api-staging.riggerconnect.tiation.net',
      timeout: 15000,
      headers: {
        'X-Environment': 'staging'
      }
    },
    production: {
      baseUrl: 'https://api.riggerconnect.tiation.net',
      timeout: 10000,
      headers: {
        'X-Environment': 'production'
      }
    }
  };
  
  return configs[environment] || configs.development;
};

const getDatabaseConfig = () => {
  const environment = process.env.NODE_ENV || 'development';
  
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    return {
      type: 'supabase',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY
    };
  }
  
  return {
    type: 'postgresql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'rigger_dev',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: environment === 'production'
  };
};

// ==========================================
// API INTEGRATION EXAMPLES
// ==========================================

class RiggerPlatformIntegration {
  constructor() {
    this.apiConfig = getApiConfig();
    this.databaseConfig = getDatabaseConfig();
    this.apiFactory = new RiggerApiFactory(this.apiConfig);
    this.databaseManager = new DatabaseManager(this.databaseConfig);
    this.versionManager = new ApiVersionManager('1.0.0');
    
    this.initializeServices();
  }

  initializeServices() {
    // Create all API services
    this.services = this.apiFactory.createAllServices();
    
    // Initialize middleware pipeline
    this.middleware = createStandardPipeline({
      rateLimitConfig: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100
      },
      cacheConfig: {
        ttl: 5 * 60 * 1000 // 5 minutes cache
      },
      authExemptPaths: ['/health', '/version', '/auth/login', '/auth/register']
    });
  }

  // ==========================================
  // WEB APPLICATION EXAMPLES
  // ==========================================

  // Example for RiggerConnect-web and RiggerHub-web
  async webApplicationExample() {
    console.log('🌐 Web Application Integration Example');
    
    try {
      // Initialize database connection
      await this.databaseManager.connect();
      
      // Run migrations if needed
      const migrationManager = createMigrationManager(this.databaseManager.getConnection());
      const status = await migrationManager.getStatus();
      
      if (status.pending.length > 0) {
        console.log(`Running ${status.pending.length} pending migrations...`);
        await migrationManager.runMigrations();
      }
      
      // Example: User authentication flow
      const authResult = await this.services.auth.login(
        'rigger@example.com',
        'secure-password'
      );
      
      if (authResult.success) {
        console.log('✓ User authenticated:', authResult.data.user.email);
        
        // Example: Search for jobs
        const jobsResult = await this.services.jobMatching.searchJobs({
          location: 'Perth, WA',
          skills: ['rigging', 'crane_operation'],
          hourlyRateMin: 50,
          hourlyRateMax: 100,
          page: 1,
          limit: 10
        });
        
        if (jobsResult.success) {
          console.log(`✓ Found ${jobsResult.data.data.length} jobs`);
          
          // Example: Apply to a job
          if (jobsResult.data.data.length > 0) {
            const firstJob = jobsResult.data.data[0];
            const applicationResult = await this.services.jobMatching.applyToJob(
              firstJob.id,
              {
                proposedRate: 75,
                message: 'I am very interested in this position and have 5+ years of experience.',
                coverLetter: 'Dear Hiring Manager...'
              }
            );
            
            if (applicationResult.success) {
              console.log('✓ Job application submitted successfully');
            }
          }
        }
        
        // Example: AI-powered job matching
        const aiMatchResult = await this.services.ai.analyzeJobMatch(
          authResult.data.user,
          jobsResult.data.data[0]
        );
        
        if (aiMatchResult.success) {
          console.log(`✓ AI Match Score: ${aiMatchResult.data.score}%`);
          console.log('Match reasons:', aiMatchResult.data.reasons);
        }
        
      }
      
    } catch (error) {
      console.error('❌ Web application integration failed:', error);
    }
  }

  // ==========================================
  // MOBILE APPLICATION EXAMPLES
  // ==========================================

  // Example for React Native (Capacitor) apps
  async mobileApplicationExample() {
    console.log('📱 Mobile Application Integration Example');
    
    try {
      // Mobile-specific API configuration
      const mobileApiConfig = {
        ...this.apiConfig,
        headers: {
          ...this.apiConfig.headers,
          'X-Platform': 'mobile',
          'X-App-Version': '1.0.0'
        }
      };
      
      const mobileApiFactory = new RiggerApiFactory(mobileApiConfig);
      const mobileServices = mobileApiFactory.createAllServices();
      
      // Example: Offline-first data synchronization
      const localCache = new Map();
      
      // Check network connectivity (mobile-specific)
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      
      if (isOnline) {
        // Fetch fresh data from API
        const jobsResult = await mobileServices.jobMatching.searchJobs({
          location: 'Current Location', // Would use GPS coordinates
          limit: 20
        });
        
        if (jobsResult.success) {
          // Cache data locally
          localCache.set('recent_jobs', {
            data: jobsResult.data,
            timestamp: Date.now()
          });
          
          console.log('✓ Jobs cached for offline access');
        }
      } else {
        // Use cached data when offline
        const cachedJobs = localCache.get('recent_jobs');
        if (cachedJobs) {
          console.log('📱 Using cached jobs (offline mode)');
        }
      }
      
      // Example: Push notification handling
      const notificationData = {
        userId: 'user-123',
        type: 'job_application',
        title: 'New Job Match Found!',
        message: 'A job matching your skills is available nearby.',
        data: {
          jobId: 'job-456',
          location: 'Perth, WA'
        }
      };
      
      console.log('📱 Push notification prepared:', notificationData.title);
      
    } catch (error) {
      console.error('❌ Mobile application integration failed:', error);
    }
  }

  // ==========================================
  // ANDROID APPLICATION EXAMPLES
  // ==========================================

  // Example for native Android integration
  async androidApplicationExample() {
    console.log('🤖 Android Application Integration Example');
    
    try {
      // Android-specific configuration
      const androidApiConfig = {
        ...this.apiConfig,
        headers: {
          ...this.apiConfig.headers,
          'X-Platform': 'android',
          'X-Device-ID': 'android-device-123',
          'X-App-Bundle': 'com.tiation.riggerconnect'
        }
      };
      
      const androidServices = new RiggerApiFactory(androidApiConfig).createAllServices();
      
      // Example: Biometric authentication integration
      const biometricAuth = {
        supported: true, // Would check Android BiometricManager
        enabled: true
      };
      
      if (biometricAuth.supported && biometricAuth.enabled) {
        console.log('🔐 Biometric authentication available');
        
        // Simulate biometric verification
        const biometricResult = await this.simulateBiometricAuth();
        
        if (biometricResult.success) {
          // Use stored credentials for seamless login
          const authResult = await androidServices.auth.refreshToken();
          
          if (authResult.success) {
            console.log('✓ Seamless authentication via biometrics');
          }
        }
      }
      
      // Example: Location-based job recommendations
      const gpsLocation = {
        latitude: -31.9505, // Perth coordinates
        longitude: 115.8605
      };
      
      const nearbyJobs = await androidServices.jobMatching.searchJobs({
        location: `${gpsLocation.latitude},${gpsLocation.longitude}`,
        limit: 10
      });
      
      if (nearbyJobs.success) {
        console.log(`✓ Found ${nearbyJobs.data.data.length} nearby jobs`);
      }
      
    } catch (error) {
      console.error('❌ Android application integration failed:', error);
    }
  }

  // ==========================================
  // iOS APPLICATION EXAMPLES
  // ==========================================

  // Example for native iOS integration
  async iosApplicationExample() {
    console.log('🍎 iOS Application Integration Example');
    
    try {
      // iOS-specific configuration
      const iosApiConfig = {
        ...this.apiConfig,
        headers: {
          ...this.apiConfig.headers,
          'X-Platform': 'ios',
          'X-Device-ID': 'ios-device-123',
          'X-App-Bundle': 'com.tiation.riggerconnect'
        }
      };
      
      const iosServices = new RiggerApiFactory(iosApiConfig).createAllServices();
      
      // Example: Face ID / Touch ID integration
      const faceIdAuth = {
        supported: true, // Would check LAContext.canEvaluatePolicy
        enrolled: true
      };
      
      if (faceIdAuth.supported && faceIdAuth.enrolled) {
        console.log('👤 Face ID authentication available');
        
        // Simulate Face ID verification
        const faceIdResult = await this.simulateFaceIdAuth();
        
        if (faceIdResult.success) {
          const authResult = await iosServices.auth.refreshToken();
          
          if (authResult.success) {
            console.log('✓ Seamless authentication via Face ID');
          }
        }
      }
      
      // Example: iOS-specific features (CallKit, Siri Shortcuts, etc.)
      const iosFeatures = {
        callKit: true,   // For job-related calls
        siriShortcuts: true, // Voice commands for job search
        widgets: true    // Home screen job widgets
      };
      
      console.log('🍎 iOS-specific features available:', Object.keys(iosFeatures).filter(key => iosFeatures[key]));
      
    } catch (error) {
      console.error('❌ iOS application integration failed:', error);
    }
  }

  // ==========================================
  // DATABASE INTEGRATION EXAMPLES
  // ==========================================

  async databaseIntegrationExample() {
    console.log('🗄️ Database Integration Example');
    
    try {
      // Get repository instances
      const repositories = this.databaseManager.getRepositories();
      
      // Example: Create a new user
      const newUser = await repositories.users.create({
        email: 'newrigger@example.com',
        firstName: 'John',
        lastName: 'Doe',
        userType: 'rigger',
        isActive: true,
        isVerified: false
      });
      
      console.log('✓ New user created:', newUser.id);
      
      // Example: Search users by type
      const riggers = await repositories.users.findByUserType('rigger', {
        limit: 10,
        orderBy: [{ field: 'created_at', direction: 'desc' }]
      });
      
      console.log(`✓ Found ${riggers.data.length} riggers`);
      
      // Example: Complex job search
      const jobSearchResults = await repositories.jobs.searchJobs({
        keywords: 'crane operator',
        location: 'Perth',
        skills: ['crane_operation', 'rigging'],
        hourlyRateMin: 60,
        hourlyRateMax: 120
      });
      
      console.log(`✓ Job search returned ${jobSearchResults.data.length} results`);
      
      // Example: Database transaction
      await this.databaseManager.getConnection().transaction(async (tx) => {
        // Create job
        const job = await tx.query(`
          INSERT INTO jobs (employer_id, title, description, hourly_rate, status)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `, ['employer-123', 'Senior Rigger Position', 'Experienced rigger needed...', 85.00, 'published']);
        
        // Update employer's job count
        await tx.query(`
          UPDATE employer_profiles
          SET total_jobs_posted = total_jobs_posted + 1
          WHERE user_id = $1
        `, ['employer-123']);
        
        console.log('✓ Job created and employer stats updated in transaction');
      });
      
    } catch (error) {
      console.error('❌ Database integration failed:', error);
    }
  }

  // ==========================================
  // COMPLIANCE & SAFETY INTEGRATION
  // ==========================================

  async complianceIntegrationExample() {
    console.log('⚖️ Compliance Integration Example');
    
    try {
      // Example: Safety compliance check
      const complianceResult = await this.services.compliance.checkSafetyCompliance('job-123');
      
      if (complianceResult.success) {
        if (complianceResult.data.compliant) {
          console.log('✓ Job meets all safety compliance requirements');
        } else {
          console.log('⚠️ Compliance issues found:', complianceResult.data.issues);
        }
      }
      
      // Example: Worker certification validation
      const certValidation = await this.services.compliance.validateWorkerCertifications('rigger-456');
      
      if (certValidation.success) {
        console.log('✓ Worker certifications validated');
        if (certValidation.data.expiringCerts.length > 0) {
          console.log('⚠️ Expiring certifications:', certValidation.data.expiringCerts.map(cert => cert.name));
        }
      }
      
      // Example: Generate compliance report
      const reportResult = await this.services.compliance.generateComplianceReport('job-123');
      
      if (reportResult.success) {
        console.log('✓ Compliance report generated:', reportResult.data.reportUrl);
      }
      
    } catch (error) {
      console.error('❌ Compliance integration failed:', error);
    }
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================

  async simulateBiometricAuth() {
    // Simulate biometric authentication
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, type: 'fingerprint' });
      }, 1000);
    });
  }

  async simulateFaceIdAuth() {
    // Simulate Face ID authentication
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, type: 'face_id' });
      }, 1500);
    });
  }

  async cleanup() {
    try {
      await this.databaseManager.disconnect();
      console.log('✓ Database connection closed');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }
}

// ==========================================
// USAGE EXAMPLES
// ==========================================

async function runIntegrationExamples() {
  console.log('🚀 Starting RiggerShared Cross-Platform Integration Examples\n');
  
  const integration = new RiggerPlatformIntegration();
  
  try {
    // Run all examples
    await integration.webApplicationExample();
    console.log('\n');
    
    await integration.mobileApplicationExample();
    console.log('\n');
    
    await integration.androidApplicationExample();
    console.log('\n');
    
    await integration.iosApplicationExample();
    console.log('\n');
    
    await integration.databaseIntegrationExample();
    console.log('\n');
    
    await integration.complianceIntegrationExample();
    console.log('\n');
    
    console.log('✅ All integration examples completed successfully!');
    
  } catch (error) {
    console.error('❌ Integration examples failed:', error);
  } finally {
    await integration.cleanup();
  }
}

// ==========================================
// PLATFORM-SPECIFIC USAGE PATTERNS
// ==========================================

// Example for RiggerConnect-web
export const riggerConnectWebExample = {
  async initialize() {
    const apiFactory = new RiggerApiFactory(getApiConfig());
    const services = apiFactory.createAllServices();
    
    return { services };
  },
  
  async searchJobs(criteria) {
    const { services } = await this.initialize();
    return await services.jobMatching.searchJobs(criteria);
  }
};

// Example for RiggerHub-web
export const riggerHubWebExample = {
  async initialize() {
    const apiFactory = new RiggerApiFactory(getApiConfig());
    const dbManager = new DatabaseManager(getDatabaseConfig());
    
    await dbManager.connect();
    
    return {
      services: apiFactory.createAllServices(),
      repositories: dbManager.getRepositories()
    };
  },
  
  async createJob(jobData) {
    const { repositories } = await this.initialize();
    return await repositories.jobs.create(jobData);
  }
};

// Example for mobile applications
export const mobileAppExample = {
  async initialize(platform) {
    const apiConfig = {
      ...getApiConfig(),
      headers: {
        ...getApiConfig().headers,
        'X-Platform': platform,
        'X-App-Version': '1.0.0'
      }
    };
    
    const apiFactory = new RiggerApiFactory(apiConfig);
    return { services: apiFactory.createAllServices() };
  }
};

// Run examples if this file is executed directly
if (typeof window === 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationExamples().catch(console.error);
}

export default RiggerPlatformIntegration;
