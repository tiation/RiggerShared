/**
 * RiggerShared - Database Seeds
 * ChaseWhiteRabbit NGO Technology Initiative
 * 
 * Database seeding utilities for development and testing
 */

import { DatabaseConnection } from './index.js';
import { User, Job, JobApplication } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

// ==========================================
// SEED DATA INTERFACES
// ==========================================

export interface SeedConfig {
  connection: DatabaseConnection;
  environment: 'development' | 'testing' | 'staging';
  overwrite?: boolean;
}

export interface SeedResult {
  table: string;
  recordsCreated: number;
  success: boolean;
  error?: string;
}

// ==========================================
// SEED DATA TEMPLATES
// ==========================================

export const seedUsers: Partial<User>[] = [
  {
    id: uuidv4(),
    email: 'rigger@example.com',
    user_type: 'rigger',
    profile: {
      first_name: 'John',
      last_name: 'Rigger',
      phone: '555-0101',
      location: { city: 'Denver', state: 'CO', country: 'USA' }
    },
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: uuidv4(),
    email: 'employer@example.com',
    user_type: 'employer',
    profile: {
      first_name: 'Jane',
      last_name: 'Employer',
      phone: '555-0102',
      company_name: 'Example Oil Company',
      location: { city: 'Houston', state: 'TX', country: 'USA' }
    },
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

export const seedJobs: Partial<Job>[] = [
  {
    id: uuidv4(),
    title: 'Senior Drilling Technician',
    description: 'Experienced drilling technician needed for offshore rig operations.',
    location: { city: 'Gulf of Mexico', state: 'LA', country: 'USA' },
    required_skills: ['drilling', 'safety', 'maintenance'],
    hourly_rate: 45.00,
    urgency: 'high',
    status: 'active',
    duration_weeks: 8,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: uuidv4(),
    title: 'Rig Safety Inspector',
    description: 'Safety inspector position for land-based drilling operations.',
    location: { city: 'Midland', state: 'TX', country: 'USA' },
    required_skills: ['safety', 'inspection', 'compliance'],
    hourly_rate: 38.00,
    urgency: 'medium',
    status: 'active',
    duration_weeks: 12,
    created_at: new Date(),
    updated_at: new Date()
  }
];

// ==========================================
// SEEDING FUNCTIONS
// ==========================================

export class DatabaseSeeder {
  private config: SeedConfig;

  constructor(config: SeedConfig) {
    this.config = config;
  }

  async seedAll(): Promise<SeedResult[]> {
    const results: SeedResult[] = [];

    try {
      await this.config.connection.connect();

      // Clear existing data if overwrite is enabled
      if (this.config.overwrite) {
        await this.clearAllTables();
      }

      // Seed in dependency order
      results.push(await this.seedTable('users', seedUsers));
      results.push(await this.seedTable('jobs', seedJobs));

      return results;
    } catch (error) {
      console.error('Error during database seeding:', error);
      throw error;
    }
  }

  async seedTable<T>(tableName: string, data: Partial<T>[]): Promise<SeedResult> {
    try {
      let recordsCreated = 0;

      for (const record of data) {
        const fields = Object.keys(record);
        const values = Object.values(record);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        const sql = `
          INSERT INTO ${tableName} (${fields.join(', ')})
          VALUES (${placeholders})
          ON CONFLICT (id) DO NOTHING
        `;

        const result = await this.config.connection.query(sql, values);
        if (result.length > 0 || this.config.environment === 'development') {
          recordsCreated++;
        }
      }

      return {
        table: tableName,
        recordsCreated,
        success: true
      };
    } catch (error) {
      return {
        table: tableName,
        recordsCreated: 0,
        success: false,
        error: (error as Error).message
      };
    }
  }

  async clearAllTables(): Promise<void> {
    const tables = ['job_applications', 'jobs', 'users']; // In reverse dependency order
    
    for (const table of tables) {
      await this.config.connection.query(`TRUNCATE TABLE ${table} CASCADE`);
    }

    console.log('✅ All tables cleared for fresh seeding');
  }

  async seedDevelopmentData(): Promise<SeedResult[]> {
    if (this.config.environment !== 'development') {
      throw new Error('Development seeding can only be run in development environment');
    }

    return this.seedAll();
  }

  async seedTestingData(): Promise<SeedResult[]> {
    if (this.config.environment !== 'testing') {
      throw new Error('Testing seeding can only be run in testing environment');
    }

    // Use smaller, more controlled dataset for testing
    const testUsers = seedUsers.slice(0, 2);
    const testJobs = seedJobs.slice(0, 1);

    const results: SeedResult[] = [];
    results.push(await this.seedTable('users', testUsers));
    results.push(await this.seedTable('jobs', testJobs));

    return results;
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export async function runSeeds(config: SeedConfig): Promise<void> {
  const seeder = new DatabaseSeeder(config);
  const results = await seeder.seedAll();

  console.log('🌱 Database seeding results:');
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.table}: ${result.recordsCreated} records created`);
    } else {
      console.log(`❌ ${result.table}: Failed - ${result.error}`);
    }
  });
}

export function generateTestUser(overrides: Partial<User> = {}): Partial<User> {
  return {
    id: uuidv4(),
    email: `test-${Date.now()}@example.com`,
    user_type: 'rigger',
    profile: {
      first_name: 'Test',
      last_name: 'User',
      phone: '555-0000'
    },
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides
  };
}

export function generateTestJob(overrides: Partial<Job> = {}): Partial<Job> {
  return {
    id: uuidv4(),
    title: `Test Job ${Date.now()}`,
    description: 'Test job description',
    location: { city: 'Test City', state: 'TX', country: 'USA' },
    required_skills: ['testing'],
    hourly_rate: 25.00,
    urgency: 'low',
    status: 'active',
    duration_weeks: 4,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides
  };
}
