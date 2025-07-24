# Developer Guide

👨‍💻 **ChaseWhiteRabbit NGO Development Standards**

## 📋 Overview

This guide establishes development standards, workflows, and best practices for contributing to RiggerShared and the broader Rigger ecosystem, ensuring enterprise-grade, ethical, and maintainable code.

## 🏗️ Development Environment Setup

### Prerequisites

1. **Node.js**: Version 18.0.0 or higher
2. **Docker**: For containerized development
3. **Git**: Version 2.30.0 or higher
4. **IDE**: VS Code with recommended extensions

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode-remote.remote-containers",
    "ms-vscode.test-adapter-converter"
  ]
}
```

### Environment Configuration

```bash
# Clone repository
git clone git@github.com:tiation-repos/RiggerShared.git
cd RiggerShared

# Install dependencies
npm install

# Setup Git hooks
npm run prepare

# Create local environment file
cp .env.development .env.local

# Start development server
npm run dev
```

## 📝 Coding Standards

### Code Style

We follow **ESLint** and **Prettier** configurations for consistent code formatting:

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Naming Conventions

#### Files and Directories
- **Components**: `PascalCase` (e.g., `UserProfile.js`)
- **Utilities**: `camelCase` (e.g., `apiHelper.js`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_ENDPOINTS.js`)
- **Directories**: `kebab-case` (e.g., `user-management/`)

#### Variables and Functions
```javascript
// Constants
const API_BASE_URL = 'https://api.rigger.com';

// Variables
const userName = 'john_doe';
const isAuthenticated = true;

// Functions
function getUserProfile(userId) { }
const fetchUserData = async () => { };

// Classes
class UserManager { }

// Interfaces (TypeScript)
interface UserProfile { }
```

### Documentation Standards

#### JSDoc Comments
```javascript
/**
 * Fetches user profile from the API
 * @param {string} userId - The unique identifier for the user
 * @param {Object} options - Additional options for the request
 * @param {boolean} options.includePreferences - Whether to include user preferences
 * @returns {Promise<Object>} The user profile object
 * @throws {Error} When the user is not found or API is unavailable
 * @example
 * const profile = await getUserProfile('123', { includePreferences: true });
 */
async function getUserProfile(userId, options = {}) {
  // Implementation
}
```

## 🔄 Git Workflow

### Branch Strategy

We follow **GitFlow** with the following branch types:

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: New features (`feature/user-authentication`)
- **`bugfix/*`**: Bug fixes (`bugfix/login-validation`)
- **`hotfix/*`**: Critical production fixes
- **`release/*`**: Release preparation

### Commit Messages

Follow **Conventional Commits** specification:

```bash
# Format
<type>[optional scope]: <description>

# Types
feat: add user authentication system
fix: resolve login validation issue
docs: update API documentation
style: format code with prettier
refactor: restructure user service
test: add unit tests for auth module
chore: update dependencies

# Examples
feat(auth): implement JWT token validation
fix(api): handle network timeout errors
docs(readme): add setup instructions
test(user): add integration tests for user creation
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature
   ```

2. **Development and Testing**
   ```bash
   # Make changes
   git add .
   git commit -m "feat: implement new feature"
   
   # Run tests
   npm run test
   npm run lint
   ```

3. **Create Pull Request**
   - Base branch: `develop`
   - Include description of changes
   - Reference related issues
   - Add reviewers
   - Ensure CI/CD passes

4. **Code Review Requirements**
   - [ ] At least 2 approvals required
   - [ ] All tests passing
   - [ ] Code coverage maintained
   - [ ] Documentation updated
   - [ ] No security vulnerabilities

## 🧪 Testing Standards

### Testing Strategy

```bash
# Run all tests
npm run test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Structure

```javascript
// user.test.js
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { UserService } from '../src/services/UserService.js';

describe('UserService', () => {
  let userService;
  
  beforeEach(() => {
    userService = new UserService();
  });
  
  afterEach(() => {
    // Cleanup
  });
  
  describe('getUserProfile', () => {
    test('should return user profile for valid ID', async () => {
      // Arrange
      const userId = '123';
      const expectedProfile = { id: userId, name: 'John Doe' };
      
      // Act
      const result = await userService.getUserProfile(userId);
      
      // Assert
      expect(result).toEqual(expectedProfile);
    });
    
    test('should throw error for invalid ID', async () => {
      // Arrange
      const invalidId = 'invalid';
      
      // Act & Assert
      await expect(userService.getUserProfile(invalidId))
        .rejects.toThrow('User not found');
    });
  });
});
```

### Test Coverage Requirements

- **Minimum Coverage**: 80%
- **Critical Paths**: 95%
- **New Code**: 90%

## 🔐 Security Guidelines

### Code Security

1. **Input Validation**
```javascript
import { ValidationSchema } from '@rigger/shared';

const userSchema = ValidationSchema.object({
  email: ValidationSchema.string().email().required(),
  password: ValidationSchema.string().min(8).required()
});

function validateUserInput(data) {
  const result = userSchema.validate(data);
  if (result.error) {
    throw new ValidationError(result.error.details);
  }
  return result.value;
}
```

2. **Authentication & Authorization**
```javascript
// Always verify JWT tokens
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
};

// Implement role-based access control
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user.roles.includes(role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

3. **Data Sanitization**
```javascript
import { sanitize } from '@rigger/shared';

function processUserInput(input) {
  return {
    name: sanitize.string(input.name),
    email: sanitize.email(input.email),
    description: sanitize.html(input.description)
  };
}
```

### Environment Variables

Never commit sensitive data:

```javascript
// ✅ Good
const apiKey = process.env.API_KEY;

// ❌ Bad
const apiKey = 'sk-1234567890abcdef';
```

## 🚀 Performance Guidelines

### Code Optimization

1. **Efficient Data Structures**
```javascript
// Use Map for frequent lookups
const userCache = new Map();

// Use Set for unique collections
const activeUsers = new Set();

// Avoid deep object cloning when possible
const updatedUser = { ...user, name: newName };
```

2. **Async/Await Best Practices**
```javascript
// ✅ Parallel execution
const [user, profile, preferences] = await Promise.all([
  fetchUser(userId),
  fetchProfile(userId),
  fetchPreferences(userId)
]);

// ❌ Sequential execution
const user = await fetchUser(userId);
const profile = await fetchProfile(userId);
const preferences = await fetchPreferences(userId);
```

3. **Memory Management**
```javascript
// Clean up event listeners
const cleanup = () => {
  window.removeEventListener('resize', handleResize);
  clearInterval(intervalId);
};

// Use WeakMap for private data
const privateData = new WeakMap();
```

### Database Optimization

```javascript
// Use indexes for frequent queries
db.users.createIndex({ email: 1 });

// Implement pagination
async function getUsers(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  return db.users.find()
    .skip(offset)
    .limit(limit);
}

// Use aggregation for complex queries
const pipeline = [
  { $match: { status: 'active' } },
  { $group: { _id: '$department', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
];
```

## 📚 API Development

### RESTful API Guidelines

```javascript
// Resource naming
GET    /api/users           // Get all users
GET    /api/users/:id       // Get specific user
POST   /api/users           // Create user
PUT    /api/users/:id       // Update user
DELETE /api/users/:id       // Delete user

// Nested resources
GET    /api/users/:id/posts // Get user's posts
POST   /api/users/:id/posts // Create post for user
```

### Response Format

```javascript
// Success response
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2024-07-24T12:00:00Z",
    "version": "1.0.0"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-07-24T12:00:00Z",
    "requestId": "req_123456"
  }
}
```

## 🔧 Development Tools

### Local Development

```bash
# Start development environment
npm run dev

# Run with debugger
npm run dev:debug

# Build for development
npm run build:dev

# Watch for changes
npm run watch
```

### Docker Development

```bash
# Build development container
docker-compose -f docker-compose.dev.yml build

# Start development environment
docker-compose -f docker-compose.dev.yml up

# Run tests in container
docker-compose exec app npm run test
```

### Debugging

```javascript
// Use structured logging
import { Logger } from '@rigger/shared';

const logger = new Logger({ service: 'user-service' });

logger.debug('Processing user request', { userId, action: 'update' });
logger.info('User updated successfully', { userId, changes });
logger.error('Failed to update user', { userId, error: error.message });
```

## 🌐 Deployment Considerations

### Environment-Specific Code

```javascript
// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Feature flags
const features = {
  newUserFlow: process.env.FEATURE_NEW_USER_FLOW === 'true',
  betaFeatures: process.env.FEATURE_BETA === 'true'
};

// Configuration
const config = {
  api: {
    baseUrl: process.env.API_BASE_URL,
    timeout: parseInt(process.env.API_TIMEOUT) || 30000
  },
  database: {
    url: process.env.DATABASE_URL,
    poolSize: parseInt(process.env.DB_POOL_SIZE) || 10
  }
};
```

## 📖 Code Review Checklist

### Before Submitting PR

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Code coverage maintained
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Security considerations addressed
- [ ] Performance implications reviewed

### Review Criteria

- [ ] **Functionality**: Does the code work as intended?
- [ ] **Readability**: Is the code easy to understand?
- [ ] **Maintainability**: Can the code be easily modified?
- [ ] **Performance**: Are there any performance bottlenecks?
- [ ] **Security**: Are there any security vulnerabilities?
- [ ] **Testing**: Are there adequate tests?

## 🚨 Common Pitfalls

### Avoid These Patterns

```javascript
// ❌ Don't use var
var user = 'john';

// ✅ Use const/let
const user = 'john';

// ❌ Don't mutate props
function Component({ items }) {
  items.push(newItem); // Mutates original array
}

// ✅ Create new array
function Component({ items }) {
  const newItems = [...items, newItem];
}

// ❌ Don't ignore errors
fetch('/api/users'); // No error handling

// ✅ Handle errors properly
try {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
} catch (error) {
  logger.error('API request failed', { error });
}
```

## 📞 Support and Resources

### Getting Help

- **Technical Issues**: Create GitHub issue
- **Development Questions**: Team Slack channel
- **Security Concerns**: security@chasewhiterabbit.org

### Additional Resources

- [API Documentation](../api/README.md)
- [Architecture Overview](../architecture/overview.md)
- [Deployment Guide](../deployment/README.md)
- [Troubleshooting Guide](../troubleshooting/README.md)

---

**ChaseWhiteRabbit NGO** | Enterprise-Grade • Ethical • DevOps-Ready
