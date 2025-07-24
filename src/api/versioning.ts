/**
 * RiggerShared - API Versioning System
 * ChaseWhiteRabbit NGO Technology Initiative
 * 
 * Robust versioning system to avoid breaking changes across platforms
 * Supports semantic versioning, backward compatibility, and migration paths
 */

// ==========================================
// VERSION TYPES
// ==========================================

export interface Version {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
}

export interface ApiVersion {
  version: Version;
  releaseDate: string;
  deprecated?: boolean;
  sunsetDate?: string;
  compatibleWith: Version[];
  breakingChanges: BreakingChange[];
}

export interface BreakingChange {
  type: 'removed' | 'modified' | 'renamed';
  endpoint: string;
  description: string;
  migrationPath?: string;
  affectedClients: string[];
}

export interface CompatibilityMatrix {
  [clientVersion: string]: {
    supportedApiVersions: string[];
    recommendedApiVersion: string;
    deprecationWarnings?: string[];
  };
}

// ==========================================
// VERSION PARSER
// ==========================================

export class VersionParser {
  static parse(versionString: string): Version {
    const regex = /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9\-\.]+))?$/;
    const match = versionString.match(regex);
    
    if (!match) {
      throw new Error(`Invalid version format: ${versionString}`);
    }

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      prerelease: match[4]
    };
  }

  static toString(version: Version): string {
    let versionString = `${version.major}.${version.minor}.${version.patch}`;
    if (version.prerelease) {
      versionString += `-${version.prerelease}`;
    }
    return versionString;
  }

  static compare(a: Version, b: Version): number {
    if (a.major !== b.major) return a.major - b.major;
    if (a.minor !== b.minor) return a.minor - b.minor;
    if (a.patch !== b.patch) return a.patch - b.patch;
    
    // Handle prerelease versions
    if (a.prerelease && !b.prerelease) return -1;
    if (!a.prerelease && b.prerelease) return 1;
    if (a.prerelease && b.prerelease) {
      return a.prerelease.localeCompare(b.prerelease);
    }
    
    return 0;
  }

  static isCompatible(clientVersion: Version, apiVersion: Version): boolean {
    // Major version must match for compatibility
    if (clientVersion.major !== apiVersion.major) {
      return false;
    }
    
    // Client can use older or same minor version
    return clientVersion.minor <= apiVersion.minor;
  }
}

// ==========================================
// VERSION MANAGER
// ==========================================

export class ApiVersionManager {
  private supportedVersions: Map<string, ApiVersion> = new Map();
  private defaultVersion: string;
  private compatibilityMatrix: CompatibilityMatrix;

  constructor(defaultVersion: string = '1.0.0') {
    this.defaultVersion = defaultVersion;
    this.compatibilityMatrix = {};
    this.initializeVersions();
  }

  private initializeVersions() {
    // Initialize supported API versions
    const versions: ApiVersion[] = [
      {
        version: { major: 1, minor: 0, patch: 0 },
        releaseDate: '2024-07-24',
        compatibleWith: [
          { major: 1, minor: 0, patch: 0 }
        ],
        breakingChanges: []
      },
      {
        version: { major: 1, minor: 1, patch: 0 },
        releaseDate: '2024-08-01',
        compatibleWith: [
          { major: 1, minor: 0, patch: 0 },
          { major: 1, minor: 1, patch: 0 }
        ],
        breakingChanges: []
      }
    ];

    versions.forEach(apiVersion => {
      const versionString = VersionParser.toString(apiVersion.version);
      this.supportedVersions.set(versionString, apiVersion);
    });

    // Initialize compatibility matrix
    this.compatibilityMatrix = {
      'RiggerConnect-web@1.0.0': {
        supportedApiVersions: ['1.0.0', '1.1.0'],
        recommendedApiVersion: '1.1.0'
      },
      'RiggerConnect-android@1.0.0': {
        supportedApiVersions: ['1.0.0', '1.1.0'],
        recommendedApiVersion: '1.1.0'
      },
      'RiggerConnect-ios@1.0.0': {
        supportedApiVersions: ['1.0.0', '1.1.0'],
        recommendedApiVersion: '1.1.0'
      },
      'RiggerHub-web@1.0.0': {
        supportedApiVersions: ['1.0.0', '1.1.0'],
        recommendedApiVersion: '1.1.0'
      },
      'RiggerHub-android@1.0.0': {
        supportedApiVersions: ['1.0.0', '1.1.0'],
        recommendedApiVersion: '1.1.0'
      },
      'RiggerHub-ios@1.0.0': {
        supportedApiVersions: ['1.0.0', '1.1.0'],
        recommendedApiVersion: '1.1.0'
      }
    };
  }

  getVersion(versionString?: string): ApiVersion | null {
    const version = versionString || this.defaultVersion;
    return this.supportedVersions.get(version) || null;
  }

  getSupportedVersions(): string[] {
    return Array.from(this.supportedVersions.keys());
  }

  getCompatibleVersions(clientVersion: string): string[] {
    const compatibility = this.compatibilityMatrix[clientVersion];
    return compatibility ? compatibility.supportedApiVersions : [];
  }

  getRecommendedVersion(clientVersion: string): string {
    const compatibility = this.compatibilityMatrix[clientVersion];
    return compatibility ? compatibility.recommendedApiVersion : this.defaultVersion;
  }

  isVersionSupported(versionString: string): boolean {
    return this.supportedVersions.has(versionString);
  }

  isVersionDeprecated(versionString: string): boolean {
    const version = this.getVersion(versionString);
    return version ? version.deprecated === true : false;
  }

  getDeprecationInfo(versionString: string): { deprecated: boolean; sunsetDate?: string } {
    const version = this.getVersion(versionString);
    if (!version) {
      return { deprecated: false };
    }

    return {
      deprecated: version.deprecated === true,
      sunsetDate: version.sunsetDate
    };
  }

  addVersion(apiVersion: ApiVersion): void {
    const versionString = VersionParser.toString(apiVersion.version);
    this.supportedVersions.set(versionString, apiVersion);
  }

  deprecateVersion(versionString: string, sunsetDate?: string): boolean {
    const version = this.getVersion(versionString);
    if (version) {
      version.deprecated = true;
      if (sunsetDate) {
        version.sunsetDate = sunsetDate;
      }
      return true;
    }
    return false;
  }
}

// ==========================================
// VERSION MIDDLEWARE
// ==========================================

export interface VersionedRequest {
  version?: string;
  clientIdentifier?: string;
  headers: Record<string, string>;
}

export interface VersionedResponse {
  version: string;
  deprecationWarning?: string;
  migrationInfo?: {
    nextVersion: string;
    migrationGuide: string;
  };
}

export class VersionMiddleware {
  private versionManager: ApiVersionManager;

  constructor(versionManager: ApiVersionManager) {
    this.versionManager = versionManager;
  }

  extractVersion(request: VersionedRequest): string {
    // Try to get version from various sources
    const headerVersion = request.headers['api-version'] || 
                         request.headers['x-api-version'] ||
                         request.headers['accept-version'];
    
    const queryVersion = request.version;
    const clientVersion = request.clientIdentifier;

    // Priority: header > query > client-recommended > default
    if (headerVersion && this.versionManager.isVersionSupported(headerVersion)) {
      return headerVersion;
    }

    if (queryVersion && this.versionManager.isVersionSupported(queryVersion)) {
      return queryVersion;
    }

    if (clientVersion) {
      const recommended = this.versionManager.getRecommendedVersion(clientVersion);
      if (recommended && this.versionManager.isVersionSupported(recommended)) {
        return recommended;
      }
    }

    return this.versionManager.getSupportedVersions()[0]; // Default to latest
  }

  validateVersion(versionString: string): { valid: boolean; error?: string } {
    if (!this.versionManager.isVersionSupported(versionString)) {
      return {
        valid: false,
        error: `Unsupported API version: ${versionString}. Supported versions: ${this.versionManager.getSupportedVersions().join(', ')}`
      };
    }

    return { valid: true };
  }

  createVersionedResponse(version: string, data: any): VersionedResponse & any {
    const response: VersionedResponse & any = {
      version,
      ...data
    };

    // Add deprecation warning if needed
    const deprecationInfo = this.versionManager.getDeprecationInfo(version);
    if (deprecationInfo.deprecated) {
      response.deprecationWarning = `API version ${version} is deprecated.`;
      if (deprecationInfo.sunsetDate) {
        response.deprecationWarning += ` Sunset date: ${deprecationInfo.sunsetDate}`;
      }
    }

    return response;
  }
}

// ==========================================
// MIGRATION MANAGER
// ==========================================

export interface MigrationPath {
  fromVersion: string;
  toVersion: string;
  transformations: DataTransformation[];
  validationRules: ValidationRule[];
}

export interface DataTransformation {
  field: string;
  operation: 'rename' | 'remove' | 'transform' | 'add';
  newField?: string;
  transformer?: (value: any) => any;
  defaultValue?: any;
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'type' | 'format' | 'range';
  validator: (value: any) => boolean;
  message: string;
}

export class MigrationManager {
  private migrationPaths: Map<string, MigrationPath> = new Map();

  addMigrationPath(migration: MigrationPath): void {
    const key = `${migration.fromVersion}->${migration.toVersion}`;
    this.migrationPaths.set(key, migration);
  }

  getMigrationPath(fromVersion: string, toVersion: string): MigrationPath | null {
    const key = `${fromVersion}->${toVersion}`;
    return this.migrationPaths.get(key) || null;
  }

  transformData(data: any, fromVersion: string, toVersion: string): any {
    const migrationPath = this.getMigrationPath(fromVersion, toVersion);
    if (!migrationPath) {
      return data; // No transformation needed
    }

    let transformedData = { ...data };

    migrationPath.transformations.forEach(transformation => {
      switch (transformation.operation) {
        case 'rename':
          if (transformation.newField && transformedData[transformation.field] !== undefined) {
            transformedData[transformation.newField] = transformedData[transformation.field];
            delete transformedData[transformation.field];
          }
          break;
          
        case 'remove':
          delete transformedData[transformation.field];
          break;
          
        case 'transform':
          if (transformation.transformer && transformedData[transformation.field] !== undefined) {
            transformedData[transformation.field] = transformation.transformer(
              transformedData[transformation.field]
            );
          }
          break;
          
        case 'add':
          if (transformation.defaultValue !== undefined) {
            transformedData[transformation.field] = transformation.defaultValue;
          }
          break;
      }
    });

    return transformedData;
  }

  validateTransformedData(data: any, migrationPath: MigrationPath): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    migrationPath.validationRules.forEach(rule => {
      if (!rule.validator(data[rule.field])) {
        errors.push(rule.message);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// ==========================================
// EXPORTS
// ==========================================

export const DEFAULT_VERSION_MANAGER = new ApiVersionManager('1.0.0');
export const DEFAULT_VERSION_MIDDLEWARE = new VersionMiddleware(DEFAULT_VERSION_MANAGER);
export const DEFAULT_MIGRATION_MANAGER = new MigrationManager();
