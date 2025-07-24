# Browser Compatibility Guide

## Overview

The @rigger/shared package has been updated to be browser-compatible while maintaining full Node.js functionality. This document explains the changes made to remove Node-specific dependencies and ensure smooth operation in both server and browser environments.

## Key Changes Made

### 1. Environment Configuration (src/config/environment.js)

**Problem**: The original configuration used Node-specific imports like `createRequire`, `module`, and `path`.

**Solution**: 
- Created a browser-compatible environment variable access system
- Added conditional dynamic imports for Node.js utilities
- Environment variables can be accessed through:
  - `process.env` (Node.js or webpack/vite polyfill)
  - `window.__RIGGER_ENV__` (browser global)
  - Fallback defaults for pure browser environments

**Usage**:
```javascript
// Works in both Node.js and browser
import { config } from '@rigger/shared';

console.log(config.environment.NODE_ENV); // 'development' 
console.log(config.api.BASE_URL); // 'http://localhost:3000/api'
```

### 2. Server-Only Utilities (src/utils/server.js)

**Problem**: Node-specific utilities were mixed with browser-compatible code.

**Solution**: 
- Created a separate `server.js` module for Node.js-only utilities
- Contains sensitive server configuration (database passwords, JWT secrets)
- Uses conditional dynamic imports to avoid bundling in browser builds

**Usage**:
```javascript
// Server-side only
import { getServerConfig, ServerEnvUtils } from '@rigger/shared/server';

const serverConfig = getServerConfig(); // Includes sensitive data
console.log(ServerEnvUtils.getPlatform()); // Node.js platform info
```

### 3. Browser-Compatible Environment Configuration (src/config/environment.browser.js)

**Problem**: Some environments need a pure browser version without any Node.js references.

**Solution**: 
- Created a dedicated browser-only configuration module
- Provides same API as main configuration but optimized for browsers
- Excludes sensitive server-only configuration

**Usage**:
```javascript
// Browser-optimized import
import { config } from '@rigger/shared/browser';

// Safe for browser environments
console.log(config.supabase.ANON_KEY); // Public Supabase key only
```

### 4. Logger Updates (src/utils/Logger.js)

**Problem**: Winston logger caused issues in browser environments due to file system dependencies.

**Solution**:
- Conditional dynamic import of winston for Node.js environments
- Graceful fallback to console logging in browsers
- Same API surface for seamless usage

**Usage**:
```javascript
import Logger from '@rigger/shared/Logger';

// Works in both environments
Logger.info('Application started'); // Winston in Node.js, console in browser
Logger.error('Error occurred', { error: 'details' });
```

### 5. Utilities Cleanup (src/utils/index.js)

**Problem**: Environment utilities used direct `process.env` access.

**Solution**:
- Removed Node-specific environment utilities from shared utilities
- Server-specific environment utilities moved to `server.js`
- Browser-compatible utilities remain in main utils

### 6. Build Configuration Updates (rollup.config.js)

**Problem**: Build system didn't properly handle browser vs Node.js builds.

**Solution**:
- Updated external dependencies configuration
- Node-only modules marked as external for browser builds
- Environment variable injection optimized for different targets

## Usage Patterns

### For Browser Applications

```javascript
// Standard import works in browsers
import { config, StringUtils, ValidationUtils } from '@rigger/shared';

// Check environment
if (config.environment.isBrowser) {
  console.log('Running in browser');
}

// Use utilities safely
const slug = StringUtils.toSlug('My Title');
const isValid = ValidationUtils.isValidEmail('test@example.com');
```

### For Node.js Applications

```javascript
// Standard import + server utilities
import { config, Logger } from '@rigger/shared';
import { getServerConfig } from '@rigger/shared/server';

// Access server-only configuration
const serverConfig = getServerConfig();
console.log(serverConfig.database.PASSWORD); // Server-side only

// Logging works with winston
Logger.info('Server started', { port: 3000 });
```

### For Hybrid Applications (SSR)

```javascript
// Works in both server and browser contexts
import { config, DateUtils } from '@rigger/shared';

// Safe for both environments
const formattedDate = DateUtils.formatAustralianDate(new Date());

// Conditional server-only imports
if (typeof process !== 'undefined' && process.versions?.node) {
  const { getServerConfig } = await import('@rigger/shared/server');
  // Server-side logic here
}
```

## Environment Variable Setup

### For Browser Applications

Set environment variables through your build tool (webpack/vite):

```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE_URL': JSON.stringify('https://api.example.com'),
      'process.env.SUPABASE_URL': JSON.stringify('https://your-project.supabase.co'),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify('your-anon-key'),
    })
  ]
};
```

Or use a global variable:

```javascript
// In your HTML or app initialization
window.__RIGGER_ENV__ = {
  API_BASE_URL: 'https://api.example.com',
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key'
};
```

### For Node.js Applications

Use traditional .env files:

```bash
# .env.production
NODE_ENV=production
API_BASE_URL=https://api.example.com
DATABASE_URL=postgresql://user:pass@host:5432/db
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Security Considerations

### Browser-Safe vs Server-Only Configuration

**Browser-Safe** (included in client bundles):
- API endpoints
- Supabase anonymous key  
- Feature flags
- Public configuration

**Server-Only** (never sent to browser):
- Database credentials
- Supabase service role key
- JWT secrets
- Private API keys

### Best Practices

1. **Never expose sensitive data**: Server-only utilities ensure sensitive configuration stays on the server
2. **Use environment-specific builds**: Different builds for browser vs Node.j applications
3. **Validate configuration**: Use the built-in validation functions to ensure required variables are present
4. **Principle of least privilege**: Only include necessary configuration in each environment

## Migration Guide

If you're upgrading from a previous version:

1. **Update imports**: No changes needed for basic usage
2. **Check sensitive data**: Ensure sensitive configuration is accessed through server utilities
3. **Update build configuration**: Browser builds will automatically exclude Node.js dependencies
4. **Test both environments**: Verify functionality in both Node.js and browser contexts

## Troubleshooting

### Common Issues

**"Module not found" errors in browser**:
- Ensure your bundler is configured to handle ES modules
- Check that Node.js modules are properly externalized

**Environment variables not loading**:
- Verify build tool configuration for environment variable injection
- Check that `window.__RIGGER_ENV__` is set for pure browser environments

**Winston logger not working**:
- Expected behavior in browsers - logger falls back to console
- For Node.js, ensure winston is installed as a dependency

## Conclusion

These changes ensure @rigger/shared works seamlessly in both browser and Node.js environments while maintaining security best practices. The conditional loading approach means you only get the functionality you need for your target environment.
