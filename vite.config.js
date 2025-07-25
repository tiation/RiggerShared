import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  // Build configuration
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'RiggerShared',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'rigger-shared.esm.js';
          case 'cjs':
            return 'rigger-shared.cjs.js';
          case 'umd':
            return 'rigger-shared.umd.js';
          default:
            return `rigger-shared.${format}.js`;
        }
      }
    },
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: [
        'dotenv',
        'axios',
        'winston',
        'pino',
        'joi',
        'zod',
        'uuid',
        '@types/uuid',
        'module',
        'fs',
        'path',
        'crypto',
        'os'
      ],
      output: {
        // Provide global variables for UMD build
        globals: {
          'axios': 'axios',
          'uuid': 'uuid',
          'winston': 'winston',
          'pino': 'pino',
          'joi': 'joi',
          'zod': 'zod'
        }
      }
    }
  },

  // Define configuration
  define: {
    // Environment variables
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
    
    // API Configuration
    'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || 'http://localhost:3000/api'),
    'process.env.API_VERSION': JSON.stringify(process.env.API_VERSION || 'v1'),
    'process.env.API_TIMEOUT': JSON.stringify(process.env.API_TIMEOUT || '30000'),
    
    // Supabase Configuration (public keys only)
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || ''),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || ''),
    
    // Feature Flags
    'process.env.ENABLE_DEBUG_MODE': JSON.stringify(process.env.ENABLE_DEBUG_MODE || 'false'),
    'process.env.ENABLE_METRICS_COLLECTION': JSON.stringify(process.env.ENABLE_METRICS_COLLECTION || 'true'),
    'process.env.ENABLE_PERFORMANCE_MONITORING': JSON.stringify(process.env.ENABLE_PERFORMANCE_MONITORING || 'true'),
    
    // Service URLs
    'process.env.RIGGER_CONNECT_URL': JSON.stringify(process.env.RIGGER_CONNECT_URL || 'http://localhost:3001'),
    'process.env.RIGGER_HUB_URL': JSON.stringify(process.env.RIGGER_HUB_URL || 'http://localhost:3002'),
    'process.env.RIGGER_BACKEND_URL': JSON.stringify(process.env.RIGGER_BACKEND_URL || 'http://localhost:3003'),
    
    // Security Settings
    'process.env.CORS_ENABLED': JSON.stringify(process.env.CORS_ENABLED || 'true'),
    'process.env.RATE_LIMIT_ENABLED': JSON.stringify(process.env.RATE_LIMIT_ENABLED || 'false'),
  },

  // Resolve configuration for Node.js module fallbacks
  resolve: {
    alias: {
      // Node.js built-in modules fallbacks for browser compatibility
      path: 'path-browserify',
      crypto: 'crypto-browserify', 
      stream: 'stream-browserify',
      buffer: 'buffer',
      process: 'process/browser',
      util: 'util',
      url: 'url',
      querystring: 'querystring-es3',
      os: 'os-browserify/browser',
      assert: 'assert',
      constants: 'constants-browserify',
      timers: 'timers-browserify',
      console: 'console-browserify',
      vm: 'vm-browserify',
      zlib: 'browserify-zlib',
      tty: 'tty-browserify',
      domain: 'domain-browser',
      events: 'events',
      punycode: 'punycode',
      http: 'stream-http',
      https: 'https-browserify'
    }
  },

  // Optimization configuration
  optimizeDeps: {
    include: [
      'buffer',
      'process',
      'util',
      'events',
      'crypto-browserify',
      'stream-browserify',
      'path-browserify'
    ],
    exclude: [
      'fs',
      'path',
      'crypto',
      'stream',
      'os',
      'net',
      'dgram'
    ]
  },

  // Server configuration for development
  server: {
    port: 3000,
    host: true,
    open: false
  },

  // Environment files to load
  envDir: './',
  envPrefix: ['VITE_', 'RIGGER_', 'API_', 'SUPABASE_']
});
