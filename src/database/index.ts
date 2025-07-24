/**
 * RiggerShared - Database Integration Layer
 * ChaseWhiteRabbit NGO Technology Initiative
 * 
 * Consistent data models and database operations for PostgreSQL and Supabase
 * Provides unified interface for all client applications
 */

import { User, Job, JobApplication, RiggerProfile, EmployerProfile } from '../types/index.js';

// ==========================================
// DATABASE INTERFACES
// ==========================================

export interface DatabaseConfig {
  type: 'postgresql' | 'supabase';
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  supabaseUrl?: string;
  supabaseKey?: string;
}

export interface QueryOptions {
  select?: string[];
  where?: Record<string, any>;
  orderBy?: { field: string; direction: 'asc' | 'desc' }[];
  limit?: number;
  offset?: number;
  include?: string[];
}

export interface QueryResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}

export interface DatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  transaction<T>(operations: (tx: Transaction) => Promise<T>): Promise<T>;
}

export interface Transaction {
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

// ==========================================
// REPOSITORY INTERFACES
// ==========================================

export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findMany(options?: QueryOptions): Promise<QueryResult<T>>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}

export interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByUserType(userType: string, options?: QueryOptions): Promise<QueryResult<User>>;
  updateLastLogin(id: string): Promise<void>;
  deactivateUser(id: string): Promise<void>;
}

export interface JobRepository extends Repository<Job> {
  findByEmployer(employerId: string, options?: QueryOptions): Promise<QueryResult<Job>>;
  findByLocation(location: string, options?: QueryOptions): Promise<QueryResult<Job>>;
  findBySkills(skills: string[], options?: QueryOptions): Promise<QueryResult<Job>>;
  searchJobs(criteria: JobSearchCriteria): Promise<QueryResult<Job>>;
  updateStatus(id: string, status: string): Promise<void>;
}

export interface JobApplicationRepository extends Repository<JobApplication> {
  findByJob(jobId: string, options?: QueryOptions): Promise<QueryResult<JobApplication>>;
  findByRigger(riggerId: string, options?: QueryOptions): Promise<QueryResult<JobApplication>>;
  findByStatus(status: string, options?: QueryOptions): Promise<QueryResult<JobApplication>>;
  updateStatus(id: string, status: string): Promise<void>;
}

export interface JobSearchCriteria {
  keywords?: string;
  location?: string;
  skills?: string[];
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  urgency?: string;
  employerId?: string;
}

// ==========================================
// BASE REPOSITORY IMPLEMENTATION
// ==========================================

export abstract class BaseRepository<T> implements Repository<T> {
  protected connection: DatabaseConnection;
  protected tableName: string;

  constructor(connection: DatabaseConnection, tableName: string) {
    this.connection = connection;
    this.tableName = tableName;
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.connection.query<T>(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result[0] || null;
  }

  async findMany(options: QueryOptions = {}): Promise<QueryResult<T>> {
    let sql = `SELECT ${this.buildSelectClause(options.select)} FROM ${this.tableName}`;
    const params: any[] = [];
    let paramIndex = 1;

    // Build WHERE clause
    if (options.where) {
      const whereConditions = Object.entries(options.where).map(([key, value]) => {
        params.push(value);
        return `${key} = $${paramIndex++}`;
      });
      if (whereConditions.length > 0) {
        sql += ` WHERE ${whereConditions.join(' AND ')}`;
      }
    }

    // Build ORDER BY clause
    if (options.orderBy && options.orderBy.length > 0) {
      const orderClauses = options.orderBy.map(order => 
        `${order.field} ${order.direction.toUpperCase()}`
      );
      sql += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    // Add LIMIT and OFFSET
    if (options.limit) {
      sql += ` LIMIT $${paramIndex++}`;
      params.push(options.limit);
    }
    if (options.offset) {
      sql += ` OFFSET $${paramIndex++}`;
      params.push(options.offset);
    }

    const data = await this.connection.query<T>(sql, params);
    
    // Get total count for pagination
    const countSql = `SELECT COUNT(*) as total FROM ${this.tableName}${
      options.where ? ` WHERE ${Object.keys(options.where).map((key, i) => `${key} = $${i + 1}`).join(' AND ')}` : ''
    }`;
    const countParams = options.where ? Object.values(options.where) : [];
    const countResult = await this.connection.query<{ total: number }>(countSql, countParams);
    const total = countResult[0]?.total || 0;

    return {
      data,
      total,
      hasMore: options.offset ? (options.offset + data.length) < total : data.length < total
    };
  }

  async create(data: Partial<T>): Promise<T> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const sql = `
      INSERT INTO ${this.tableName} (${fields.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await this.connection.query<T>(sql, values);
    return result[0];
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');
    
    const sql = `
      UPDATE ${this.tableName}
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await this.connection.query<T>(sql, [id, ...values]);
    return result[0];
  }

  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM ${this.tableName} WHERE id = $1`;
    await this.connection.query(sql, [id]);
    return true;
  }

  async exists(id: string): Promise<boolean> {
    const sql = `SELECT 1 FROM ${this.tableName} WHERE id = $1`;
    const result = await this.connection.query(sql, [id]);
    return result.length > 0;
  }

  private buildSelectClause(select?: string[]): string {
    return select && select.length > 0 ? select.join(', ') : '*';
  }
}

// ==========================================
// SPECIFIC REPOSITORY IMPLEMENTATIONS
// ==========================================

export class PostgreSQLUserRepository extends BaseRepository<User> implements UserRepository {
  constructor(connection: DatabaseConnection) {
    super(connection, 'users');
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.connection.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result[0] || null;
  }

  async findByUserType(userType: string, options: QueryOptions = {}): Promise<QueryResult<User>> {
    return this.findMany({ ...options, where: { ...options.where, user_type: userType } });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.connection.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }

  async deactivateUser(id: string): Promise<void> {
    await this.connection.query(
      'UPDATE users SET is_active = false WHERE id = $1',
      [id]
    );
  }
}

export class PostgreSQLJobRepository extends BaseRepository<Job> implements JobRepository {
  constructor(connection: DatabaseConnection) {
    super(connection, 'jobs');
  }

  async findByEmployer(employerId: string, options: QueryOptions = {}): Promise<QueryResult<Job>> {
    return this.findMany({ ...options, where: { ...options.where, employer_id: employerId } });
  }

  async findByLocation(location: string, options: QueryOptions = {}): Promise<QueryResult<Job>> {
    const sql = `
      SELECT * FROM jobs 
      WHERE location->>'city' ILIKE $1 OR location->>'state' ILIKE $1
      ${this.buildOptionsClause(options, 2)}
    `;
    const params = [`%${location}%`];
    this.addOptionsParams(options, params);
    
    const data = await this.connection.query<Job>(sql, params);
    const total = data.length; // Simplified for this example
    
    return { data, total, hasMore: false };
  }

  async findBySkills(skills: string[], options: QueryOptions = {}): Promise<QueryResult<Job>> {
    const skillConditions = skills.map((_, i) => `$${i + 1} = ANY(required_skills)`).join(' OR ');
    const sql = `
      SELECT * FROM jobs 
      WHERE ${skillConditions}
      ${this.buildOptionsClause(options, skills.length + 1)}
    `;
    const params = [...skills];
    this.addOptionsParams(options, params);
    
    const data = await this.connection.query<Job>(sql, params);
    const total = data.length;
    
    return { data, total, hasMore: false };
  }

  async searchJobs(criteria: JobSearchCriteria): Promise<QueryResult<Job>> {
    let sql = 'SELECT * FROM jobs WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (criteria.keywords) {
      sql += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${criteria.keywords}%`);
      paramIndex++;
    }

    if (criteria.location) {
      sql += ` AND (location->>'city' ILIKE $${paramIndex} OR location->>'state' ILIKE $${paramIndex})`;
      params.push(`%${criteria.location}%`);
      paramIndex++;
    }

    if (criteria.skills && criteria.skills.length > 0) {
      const skillConditions = criteria.skills.map(() => `$${paramIndex++} = ANY(required_skills)`);
      sql += ` AND (${skillConditions.join(' OR ')})`;
      params.push(...criteria.skills);
    }

    if (criteria.hourlyRateMin) {
      sql += ` AND hourly_rate >= $${paramIndex}`;
      params.push(criteria.hourlyRateMin);
      paramIndex++;
    }

    if (criteria.hourlyRateMax) {
      sql += ` AND hourly_rate <= $${paramIndex}`;
      params.push(criteria.hourlyRateMax);
      paramIndex++;
    }

    if (criteria.urgency) {
      sql += ` AND urgency = $${paramIndex}`;
      params.push(criteria.urgency);
      paramIndex++;
    }

    if (criteria.employerId) {
      sql += ` AND employer_id = $${paramIndex}`;
      params.push(criteria.employerId);
      paramIndex++;
    }

    sql += ' ORDER BY created_at DESC';

    const data = await this.connection.query<Job>(sql, params);
    const total = data.length;
    
    return { data, total, hasMore: false };
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.connection.query(
      'UPDATE jobs SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    );
  }

  private buildOptionsClause(options: QueryOptions, startIndex: number): string {
    let clause = '';
    
    if (options.orderBy && options.orderBy.length > 0) {
      const orderClauses = options.orderBy.map(order => 
        `${order.field} ${order.direction.toUpperCase()}`
      );
      clause += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    if (options.limit) {
      clause += ` LIMIT $${startIndex}`;
      startIndex++;
    }

    if (options.offset) {
      clause += ` OFFSET $${startIndex}`;
    }

    return clause;
  }

  private addOptionsParams(options: QueryOptions, params: any[]): void {
    if (options.limit) {
      params.push(options.limit);
    }
    if (options.offset) {
      params.push(options.offset);
    }
  }
}

export class PostgreSQLJobApplicationRepository extends BaseRepository<JobApplication> implements JobApplicationRepository {
  constructor(connection: DatabaseConnection) {
    super(connection, 'job_applications');
  }

  async findByJob(jobId: string, options: QueryOptions = {}): Promise<QueryResult<JobApplication>> {
    return this.findMany({ ...options, where: { ...options.where, job_id: jobId } });
  }

  async findByRigger(riggerId: string, options: QueryOptions = {}): Promise<QueryResult<JobApplication>> {
    return this.findMany({ ...options, where: { ...options.where, rigger_id: riggerId } });
  }

  async findByStatus(status: string, options: QueryOptions = {}): Promise<QueryResult<JobApplication>> {
    return this.findMany({ ...options, where: { ...options.where, status } });
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.connection.query(
      'UPDATE job_applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [status, id]
    );
  }
}

// ==========================================
// DATABASE CONNECTION IMPLEMENTATIONS
// ==========================================

export class PostgreSQLConnection implements DatabaseConnection {
  private config: DatabaseConfig;
  private client: any;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    // This would use actual PostgreSQL client like 'pg'
    console.log('Connecting to PostgreSQL:', this.config.host);
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.end();
    }
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    // This would execute actual SQL query
    console.log('Executing query:', sql, params);
    return [] as T[];
  }

  async transaction<T>(operations: (tx: Transaction) => Promise<T>): Promise<T> {
    // Implementation for database transactions
    const tx = new PostgreSQLTransaction(this.client);
    try {
      await tx.begin();
      const result = await operations(tx);
      await tx.commit();
      return result;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}

export class SupabaseConnection implements DatabaseConnection {
  private config: DatabaseConfig;
  private client: any;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    // This would initialize Supabase client
    console.log('Connecting to Supabase:', this.config.supabaseUrl);
  }

  async disconnect(): Promise<void> {
    // Supabase doesn't require explicit disconnection
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    // This would use Supabase RPC or query builder
    console.log('Executing Supabase query:', sql, params);
    return [] as T[];
  }

  async transaction<T>(operations: (tx: Transaction) => Promise<T>): Promise<T> {
    // Supabase transaction implementation
    throw new Error('Supabase transactions not implemented yet');
  }
}

class PostgreSQLTransaction implements Transaction {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  async begin(): Promise<void> {
    await this.client.query('BEGIN');
  }

  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const result = await this.client.query(sql, params);
    return result.rows;
  }

  async commit(): Promise<void> {
    await this.client.query('COMMIT');
  }

  async rollback(): Promise<void> {
    await this.client.query('ROLLBACK');
  }
}

// ==========================================
// REPOSITORY FACTORY
// ==========================================

export class DatabaseRepositoryFactory {
  private connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }

  createUserRepository(): UserRepository {
    return new PostgreSQLUserRepository(this.connection);
  }

  createJobRepository(): JobRepository {
    return new PostgreSQLJobRepository(this.connection);
  }

  createJobApplicationRepository(): JobApplicationRepository {
    return new PostgreSQLJobApplicationRepository(this.connection);
  }

  createAllRepositories() {
    return {
      users: this.createUserRepository(),
      jobs: this.createJobRepository(),
      jobApplications: this.createJobApplicationRepository()
    };
  }
}

// ==========================================
// DATABASE MANAGER
// ==========================================

export class DatabaseManager {
  private connection: DatabaseConnection;
  private repositories: {
    users: UserRepository;
    jobs: JobRepository;
    jobApplications: JobApplicationRepository;
  };

  constructor(config: DatabaseConfig) {
    this.connection = this.createConnection(config);
    const factory = new DatabaseRepositoryFactory(this.connection);
    this.repositories = factory.createAllRepositories();
  }

  private createConnection(config: DatabaseConfig): DatabaseConnection {
    switch (config.type) {
      case 'postgresql':
        return new PostgreSQLConnection(config);
      case 'supabase':
        return new SupabaseConnection(config);
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }

  async connect(): Promise<void> {
    await this.connection.connect();
  }

  async disconnect(): Promise<void> {
    await this.connection.disconnect();
  }

  getRepositories() {
    return this.repositories;
  }

  getConnection(): DatabaseConnection {
    return this.connection;
  }
}

// ==========================================
// EXPORTS
// ==========================================

export * from './migrations';
export * from './seeds';
