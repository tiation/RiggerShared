/**
 * RiggerShared - Database Migrations
 * ChaseWhiteRabbit NGO Technology Initiative
 * 
 * Consistent database schema management for PostgreSQL and Supabase
 * Ensures data model consistency across all platforms
 */

import { DatabaseConnection } from './index.js';

// ==========================================
// MIGRATION INTERFACES
// ==========================================

export interface Migration {
  id: string;
  name: string;
  version: string;
  up: (connection: DatabaseConnection) => Promise<void>;
  down: (connection: DatabaseConnection) => Promise<void>;
  dependencies: string[];
  createdAt: string;
}

export interface MigrationRecord {
  id: string;
  name: string;
  version: string;
  appliedAt: string;
  batch: number;
}

export interface MigrationStatus {
  pending: Migration[];
  applied: MigrationRecord[];
  canRollback: boolean;
  nextBatch: number;
}

// ==========================================
// SCHEMA DEFINITIONS
// ==========================================

export const SCHEMA_MIGRATIONS: Migration[] = [
  {
    id: '001',
    name: 'create_users_table',
    version: '1.0.0',
    dependencies: [],
    createdAt: '2024-07-24T00:00:00Z',
    up: async (connection: DatabaseConnection) => {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255),
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('rigger', 'employer', 'admin')),
          profile_picture TEXT,
          phone_number VARCHAR(20),
          is_active BOOLEAN DEFAULT true,
          is_verified BOOLEAN DEFAULT false,
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await connection.query(`
        CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_users_user_type ON users(user_type);
        CREATE INDEX idx_users_is_active ON users(is_active);
      `);
    },
    down: async (connection: DatabaseConnection) => {
      await connection.query('DROP TABLE IF EXISTS users CASCADE;');
    }
  },

  {
    id: '002',
    name: 'create_locations_table',
    version: '1.0.0',
    dependencies: [],
    createdAt: '2024-07-24T00:01:00Z',
    up: async (connection: DatabaseConnection) => {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS locations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          address TEXT NOT NULL,
          city VARCHAR(100) NOT NULL,
          state VARCHAR(100) NOT NULL,
          postcode VARCHAR(20) NOT NULL,
          country VARCHAR(100) NOT NULL DEFAULT 'Australia',
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await connection.query(`
        CREATE INDEX idx_locations_city ON locations(city);
        CREATE INDEX idx_locations_state ON locations(state);
        CREATE INDEX idx_locations_postcode ON locations(postcode);
        CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);
      `);
    },
    down: async (connection: DatabaseConnection) => {
      await connection.query('DROP TABLE IF EXISTS locations CASCADE;');
    }
  },

  {
    id: '003',
    name: 'create_rigger_profiles_table',
    version: '1.0.0',
    dependencies: ['001', '002'],
    createdAt: '2024-07-24T00:02:00Z',
    up: async (connection: DatabaseConnection) => {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS rigger_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          location_id UUID REFERENCES locations(id),
          hourly_rate DECIMAL(8, 2),
          safety_rating DECIMAL(3, 2) DEFAULT 0.00,
          completed_jobs INTEGER DEFAULT 0,
          years_experience INTEGER DEFAULT 0,
          bio TEXT,
          availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
          max_travel_distance INTEGER DEFAULT 50,
          weekdays_only BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await connection.query(`
        CREATE INDEX idx_rigger_profiles_user_id ON rigger_profiles(user_id);
        CREATE INDEX idx_rigger_profiles_location_id ON rigger_profiles(location_id);
        CREATE INDEX idx_rigger_profiles_hourly_rate ON rigger_profiles(hourly_rate);
        CREATE INDEX idx_rigger_profiles_safety_rating ON rigger_profiles(safety_rating);
        CREATE INDEX idx_rigger_profiles_availability ON rigger_profiles(availability_status);
      `);
    },
    down: async (connection: DatabaseConnection) => {
      await connection.query('DROP TABLE IF EXISTS rigger_profiles CASCADE;');
    }
  },

  {
    id: '004',
    name: 'create_employer_profiles_table',
    version: '1.0.0',
    dependencies: ['001', '002'],
    createdAt: '2024-07-24T00:03:00Z',
    up: async (connection: DatabaseConnection) => {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS employer_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          location_id UUID REFERENCES locations(id),
          company_name VARCHAR(255) NOT NULL,
          company_abn VARCHAR(11),
          company_size VARCHAR(20) CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
          industry VARCHAR(50) CHECK (industry IN ('construction', 'oil_gas', 'mining', 'manufacturing', 'infrastructure', 'other')),
          verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
          rating DECIMAL(3, 2) DEFAULT 0.00,
          total_jobs_posted INTEGER DEFAULT 0,
          website VARCHAR(255),
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await connection.query(`
        CREATE INDEX idx_employer_profiles_user_id ON employer_profiles(user_id);
        CREATE INDEX idx_employer_profiles_company_name ON employer_profiles(company_name);
        CREATE INDEX idx_employer_profiles_verification_status ON employer_profiles(verification_status);
        CREATE INDEX idx_employer_profiles_industry ON employer_profiles(industry);
        CREATE INDEX idx_employer_profiles_rating ON employer_profiles(rating);
      `);
    },
    down: async (connection: DatabaseConnection) => {
      await connection.query('DROP TABLE IF EXISTS employer_profiles CASCADE;');
    }
  },

  {
    id: '005',
    name: 'create_jobs_table',
    version: '1.0.0',
    dependencies: ['001', '002'],
    createdAt: '2024-07-24T00:04:00Z',
    up: async (connection: DatabaseConnection) => {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          employer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          location_id UUID REFERENCES locations(id),
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          requirements TEXT[],
          required_skills TEXT[],
          certification_required TEXT[],
          safety_requirements TEXT[],
          hourly_rate DECIMAL(8, 2) NOT NULL,
          duration VARCHAR(50),
          start_date DATE,
          end_date DATE,
          status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled', 'expired')),
          urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
          assigned_rigger_id UUID REFERENCES users(id),
          applications_count INTEGER DEFAULT 0,
          views_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await connection.query(`
        CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
        CREATE INDEX idx_jobs_location_id ON jobs(location_id);
        CREATE INDEX idx_jobs_status ON jobs(status);
        CREATE INDEX idx_jobs_urgency ON jobs(urgency);
        CREATE INDEX idx_jobs_hourly_rate ON jobs(hourly_rate);
        CREATE INDEX idx_jobs_start_date ON jobs(start_date);
        CREATE INDEX idx_jobs_assigned_rigger_id ON jobs(assigned_rigger_id);
        CREATE INDEX idx_jobs_required_skills ON jobs USING GIN (required_skills);
        CREATE INDEX idx_jobs_certification_required ON jobs USING GIN (certification_required);
      `);
    },
    down: async (connection: DatabaseConnection) => {
      await connection.query('DROP TABLE IF EXISTS jobs CASCADE;');
    }
  },

  {
    id: '006',
    name: 'create_job_applications_table',
    version: '1.0.0',
    dependencies: ['001', '005'],
    createdAt: '2024-07-24T00:05:00Z',
    up: async (connection: DatabaseConnection) => {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS job_applications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
          rigger_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
          proposed_rate DECIMAL(8, 2),
          message TEXT,
          cover_letter TEXT,
          portfolio_links TEXT[],
          submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          reviewed_at TIMESTAMP,
          reviewed_by UUID REFERENCES users(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(job_id, rigger_id)
        );
      `);

      await connection.query(`
        CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
        CREATE INDEX idx_job_applications_rigger_id ON job_applications(rigger_id);
        CREATE INDEX idx_job_applications_status ON job_applications(status);
        CREATE INDEX idx_job_applications_submitted_at ON job_applications(submitted_at);
      `);
    },
    down: async (connection: DatabaseConnection) => {
      await connection.query('DROP TABLE IF EXISTS job_applications CASCADE;');
    }
  },

  {
    id: '007',
    name: 'create_certifications_table',
    version: '1.0.0',
    dependencies: ['003'],
    createdAt: '2024-07-24T00:06:00Z',
    up: async (connection: DatabaseConnection) => {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS certifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          rigger_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          issuing_authority VARCHAR(255) NOT NULL,
          certificate_number VARCHAR(100),
          issue_date DATE NOT NULL,
          expiry_date DATE,
          is_verified BOOLEAN DEFAULT false,
          document_url TEXT,
          verification_notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await connection.query(`
        CREATE INDEX idx_certifications_rigger_id ON certifications(rigger_id);
        CREATE INDEX idx_certifications_name ON certifications(name);
        CREATE INDEX idx_certifications_expiry_date ON certifications(expiry_date);
        CREATE INDEX idx_certifications_is_verified ON certifications(is_verified);
      `);
    },
    down: async (connection: DatabaseConnection) => {
      await connection.query('DROP TABLE IF EXISTS certifications CASCADE;');
    }
  },

  {
    id: '008',
    name: 'create_skills_table',
    version: '1.0.0',
    dependencies: ['003'],
    createdAt: '2024-07-24T00:07:00Z',
    up: async (connection: DatabaseConnection) => {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS skills (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          rigger_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(50) CHECK (category IN ('rigging', 'crane_operation', 'safety', 'logistics', 'technical', 'leadership')),
          level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
          years_experience INTEGER DEFAULT 0,
          is_verified BOOLEAN DEFAULT false,
          verified_by UUID REFERENCES users(id),
          verification_date TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await connection.query(`
        CREATE INDEX idx_skills_rigger_id ON skills(rigger_id);
        CREATE INDEX idx_skills_name ON skills(name);
        CREATE INDEX idx_skills_category ON skills(category);
        CREATE INDEX idx_skills_level ON skills(level);
        CREATE INDEX idx_skills_is_verified ON skills(is_verified);
      `);
    },
    down: async (connection: DatabaseConnection) => {
      await connection.query('DROP TABLE IF EXISTS skills CASCADE;');
    }
  },

  {
    id: '009',
    name: 'create_notifications_table',
    version: '1.0.0',
    dependencies: ['001'],
    createdAt: '2024-07-24T00:08:00Z',
    up: async (connection: DatabaseConnection) => {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL CHECK (type IN (
            'job_application', 'job_status_update', 'payment_received', 
            'certification_expiry', 'system_announcement', 'safety_alert'
          )),
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          data JSONB,
          is_read BOOLEAN DEFAULT false,
          read_at TIMESTAMP,
          expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await connection.query(`
        CREATE INDEX idx_notifications_user_id ON notifications(user_id);
        CREATE INDEX idx_notifications_type ON notifications(type);
        CREATE INDEX idx_notifications_is_read ON notifications(is_read);
        CREATE INDEX idx_notifications_created_at ON notifications(created_at);
        CREATE INDEX idx_notifications_expires_at ON notifications(expires_at);
      `);
    },
    down: async (connection: DatabaseConnection) => {
      await connection.query('DROP TABLE IF EXISTS notifications CASCADE;');
    }
  },

  {
    id: '010',
    name: 'create_payments_table',
    version: '1.0.0',
    dependencies: ['001', '005'],
    createdAt: '2024-07-24T00:09:00Z',
    up: async (connection: DatabaseConnection) => {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          job_id UUID REFERENCES jobs(id),
          from_user_id UUID NOT NULL REFERENCES users(id),
          to_user_id UUID NOT NULL REFERENCES users(id),
          amount DECIMAL(10, 2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'AUD',
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
          payment_method VARCHAR(20) CHECK (payment_method IN ('stripe', 'bank_transfer', 'paypal', 'other')),
          transaction_id VARCHAR(255),
          stripe_payment_intent_id VARCHAR(255),
          description TEXT,
          metadata JSONB,
          processed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await connection.query(`
        CREATE INDEX idx_payments_job_id ON payments(job_id);
        CREATE INDEX idx_payments_from_user_id ON payments(from_user_id);
        CREATE INDEX idx_payments_to_user_id ON payments(to_user_id);
        CREATE INDEX idx_payments_status ON payments(status);
        CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
        CREATE INDEX idx_payments_created_at ON payments(created_at);
      `);
    },
    down: async (connection: DatabaseConnection) => {
      await connection.query('DROP TABLE IF EXISTS payments CASCADE;');
    }
  }
];

// ==========================================
// MIGRATION MANAGER
// ==========================================

export class MigrationManager {
  private connection: DatabaseConnection;
  private migrations: Map<string, Migration> = new Map();

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
    this.loadMigrations();
  }

  private loadMigrations(): void {
    SCHEMA_MIGRATIONS.forEach(migration => {
      this.migrations.set(migration.id, migration);
    });
  }

  async initializeMigrationsTable(): Promise<void> {
    await this.connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id VARCHAR(10) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        version VARCHAR(20) NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        batch INTEGER NOT NULL
      );
    `);
  }

  async getAppliedMigrations(): Promise<MigrationRecord[]> {
    const result = await this.connection.query<MigrationRecord>(`
      SELECT id, name, version, applied_at::text as "appliedAt", batch
      FROM schema_migrations
      ORDER BY batch, id
    `);
    return result;
  }

  async getPendingMigrations(): Promise<Migration[]> {
    const applied = await this.getAppliedMigrations();
    const appliedIds = new Set(applied.map(m => m.id));
    
    return Array.from(this.migrations.values())
      .filter(migration => !appliedIds.has(migration.id))
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  async getStatus(): Promise<MigrationStatus> {
    const applied = await this.getAppliedMigrations();
    const pending = await this.getPendingMigrations();
    const nextBatch = Math.max(0, ...applied.map(m => m.batch)) + 1;

    return {
      applied,
      pending,
      canRollback: applied.length > 0,
      nextBatch
    };
  }

  async runMigrations(): Promise<void> {
    await this.initializeMigrationsTable();
    
    const pending = await this.getPendingMigrations();
    if (pending.length === 0) {
      console.log('No pending migrations to run');
      return;
    }

    const status = await this.getStatus();
    const batch = status.nextBatch;

    console.log(`Running ${pending.length} migrations in batch ${batch}...`);

    for (const migration of pending) {
      try {
        console.log(`Running migration ${migration.id}: ${migration.name}`);
        
        // Check dependencies
        await this.checkDependencies(migration);
        
        // Run the migration
        await migration.up(this.connection);
        
        // Record the migration
        await this.connection.query(`
          INSERT INTO schema_migrations (id, name, version, batch)
          VALUES ($1, $2, $3, $4)
        `, [migration.id, migration.name, migration.version, batch]);
        
        console.log(`✓ Migration ${migration.id} completed`);
      } catch (error) {
        console.error(`✗ Migration ${migration.id} failed:`, error);
        throw error;
      }
    }

    console.log(`All migrations completed successfully`);
  }

  async rollbackLastBatch(): Promise<void> {
    const applied = await this.getAppliedMigrations();
    if (applied.length === 0) {
      console.log('No migrations to rollback');
      return;
    }

    const lastBatch = Math.max(...applied.map(m => m.batch));
    const migrationsToRollback = applied
      .filter(m => m.batch === lastBatch)
      .reverse(); // Rollback in reverse order

    console.log(`Rolling back batch ${lastBatch} (${migrationsToRollback.length} migrations)...`);

    for (const migrationRecord of migrationsToRollback) {
      const migration = this.migrations.get(migrationRecord.id);
      if (!migration) {
        console.error(`Migration ${migrationRecord.id} not found in current codebase`);
        continue;
      }

      try {
        console.log(`Rolling back migration ${migration.id}: ${migration.name}`);
        
        // Run the down migration
        await migration.down(this.connection);
        
        // Remove the migration record
        await this.connection.query(`
          DELETE FROM schema_migrations WHERE id = $1
        `, [migration.id]);
        
        console.log(`✓ Migration ${migration.id} rolled back`);
      } catch (error) {
        console.error(`✗ Rollback of migration ${migration.id} failed:`, error);
        throw error;
      }
    }

    console.log(`Batch ${lastBatch} rolled back successfully`);
  }

  async rollbackTo(migrationId: string): Promise<void> {
    const applied = await this.getAppliedMigrations();
    const targetIndex = applied.findIndex(m => m.id === migrationId);
    
    if (targetIndex === -1) {
      throw new Error(`Migration ${migrationId} has not been applied`);
    }

    const migrationsToRollback = applied
      .slice(targetIndex + 1)
      .reverse(); // Rollback in reverse order

    console.log(`Rolling back to migration ${migrationId} (${migrationsToRollback.length} migrations)...`);

    for (const migrationRecord of migrationsToRollback) {
      const migration = this.migrations.get(migrationRecord.id);
      if (!migration) {
        console.error(`Migration ${migrationRecord.id} not found in current codebase`);
        continue;
      }

      try {
        console.log(`Rolling back migration ${migration.id}: ${migration.name}`);
        
        // Run the down migration
        await migration.down(this.connection);
        
        // Remove the migration record
        await this.connection.query(`
          DELETE FROM schema_migrations WHERE id = $1
        `, [migration.id]);
        
        console.log(`✓ Migration ${migration.id} rolled back`);
      } catch (error) {
        console.error(`✗ Rollback of migration ${migration.id} failed:`, error);
        throw error;
      }
    }

    console.log(`Successfully rolled back to migration ${migrationId}`);
  }

  private async checkDependencies(migration: Migration): Promise<void> {
    if (migration.dependencies.length === 0) {
      return;
    }

    const applied = await this.getAppliedMigrations();
    const appliedIds = new Set(applied.map(m => m.id));

    for (const dependencyId of migration.dependencies) {
      if (!appliedIds.has(dependencyId)) {
        throw new Error(`Migration ${migration.id} depends on ${dependencyId} which has not been applied`);
      }
    }
  }

  addMigration(migration: Migration): void {
    this.migrations.set(migration.id, migration);
  }

  getMigration(id: string): Migration | undefined {
    return this.migrations.get(id);
  }

  getAllMigrations(): Migration[] {
    return Array.from(this.migrations.values()).sort((a, b) => a.id.localeCompare(b.id));
  }
}

// ==========================================
// EXPORTS
// ==========================================

export const createMigrationManager = (connection: DatabaseConnection): MigrationManager => {
  return new MigrationManager(connection);
};
