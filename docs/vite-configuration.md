# Vite Configuration for RiggerShared

## Overview

This document explains the Vite configuration setup for RiggerShared, specifically how it handles external modules and provides fallbacks for Node.js built-in modules to ensure compatibility across different environments.

## Configuration Features

### 1. Multi-Format Build Output

The Vite configuration generates three different build formats:

- **ESM (ES Modules)**: `dist/rigger-shared.esm.js` - For modern bundlers and environments
- **CJS (CommonJS)**: `dist/rigger-shared.cjs.js` - For Node.js and legacy systems
- **UMD (Universal Module Definition)**: `dist/rigger-shared.umd.js` - For browser environments

### 2. External Module Handling

The configuration externalizes several dependencies to prevent them from being bundled:

```javascript
external: [
  'dotenv',
  'axios', 
  'winston',
  'pino',
  'joi',
  'zod',
  'uuid',
  '@types/uuid',
  'module',      // Node.js built-in
  'fs',          // Node.js built-in  
  'path',        // Node.js built-in
  'crypto',      // Node.js built-in
  'os'           // Node.js built-in
]
```

This approach:
- Reduces bundle size
- Prevents Node.js modules from breaking browser builds
- Allows consuming applications to provide their own versions

### 3. Node.js Module Fallbacks

For browser compatibility, the configuration provides polyfills for Node.js built-in modules:

```javascript
resolve: {
  alias: {
    path: 'path-browserify',
    crypto: 'crypto-browserify',
    stream: 'stream-browserify',
    buffer: 'buffer',
    process: 'process/browser',
    // ... more fallbacks
  }
}
```

### 4. Environment Variable Injection

The configuration injects environment variables at build time:

```javascript
define: {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || 'http://localhost:3000/api'),
  // ... more environment variables
}
```

## Browser Polyfills

The following browser polyfills are installed and configured:

| Node.js Module | Browser Polyfill |
|---------------|------------------|
| `path` | `path-browserify` |
| `crypto` | `crypto-browserify` |
| `stream` | `stream-browserify` |
| `buffer` | `buffer` |
| `process` | `process/browser` |
| `util` | `util` |
| `url` | `url` |
| `os` | `os-browserify/browser` |
| `events` | `events` |
| `assert` | `assert` |
| `http` | `stream-http` |
| `https` | `https-browserify` |

## Build Scripts

The package.json includes several build scripts:

- `npm run build` - Production build using Vite
- `npm run build:dev` - Development build with source maps
- `npm run build:prod` - Explicit production build
- `npm run build:staging` - Staging environment build
- `npm run build:rollup` - Alternative build using original Rollup config

## Development Server

For development, Vite provides a dev server configured to:

- Run on port 3000
- Accept connections from any host
- Load environment variables from multiple sources
- Support hot module replacement

## Best Practices

### 1. Environment Variables

- Use `VITE_` prefix for variables exposed to the client
- Keep sensitive keys in server-side only variables
- Provide sensible defaults for all configuration

### 2. External Dependencies

- Keep large dependencies external when possible
- Only bundle code that's specific to your library
- Test builds in different environments (Node.js, browser, etc.)

### 3. Browser Compatibility

- Test UMD builds in actual browser environments
- Verify that Node.js polyfills work as expected
- Monitor bundle sizes to avoid shipping unnecessary polyfills

## Troubleshooting

### Common Issues

1. **"Module not found" in browser**: Add the module to the `external` array
2. **Node.js built-ins failing**: Add appropriate polyfill to `resolve.alias`
3. **Large bundle size**: Check if dependencies should be externalized
4. **Environment variables undefined**: Ensure proper `define` configuration

### Debug Tips

- Use `npm run build` to check for build warnings
- Test different output formats separately
- Verify polyfills are being used with browser dev tools

## Migration from Rollup

This project previously used Rollup and still maintains the `rollup.config.js` for compatibility. The Vite configuration provides:

- Faster builds and better development experience
- Built-in TypeScript support
- Better handling of modern JavaScript features
- Integrated development server

To use the legacy Rollup build: `npm run build:rollup`
