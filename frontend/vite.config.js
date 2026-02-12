/**
 * SKILLCAST BUILD CONFIGURATION - Vite Development & Build Setup
 *
 * This file configures Vite, the modern build tool that powers SkillCast's
 * development environment and production builds.
 *
 * VITE BENEFITS:
 * - ⚡ Lightning-fast hot module replacement (HMR) during development
 * - 📦 Optimized production builds using Rollup
 * - 🔧 Zero-config TypeScript and JSX support
 * - 📱 Built-in dev server with proxy capabilities
 * - 🌟 Modern ES modules support
 *
 * DEVELOPMENT FEATURES:
 * - Instant browser updates when code changes
 * - Source maps for easy debugging
 * - CSS hot reload without losing component state
 * - Error overlay with clear error messages
 *
 * PRODUCTION OPTIMIZATIONS:
 * - Tree shaking to remove unused code
 * - Code splitting for optimal loading
 * - Asset optimization and minification
 * - Modern browser targeting with fallbacks
 *
 * EXTENDING CONFIGURATION:
 * - Add plugins for additional functionality (PWA, testing, etc.)
 * - Configure proxy for API calls: server.proxy configuration
 * - Add build options for custom output directory or formats
 * - Include environment variable definitions
 *
 * COMMON EXTENSIONS:
 * ```js
 * export default defineConfig({
 *   plugins: [react(), pwa()],
 *   server: {
 *     proxy: {
 *       '/api': 'http://localhost:5001'
 *     }
 *   },
 *   build: {
 *     outDir: 'dist',
 *     sourcemap: true
 *   }
 * })
 * ```
 *
 * ENVIRONMENT VARIABLES:
 * - VITE_API_URL - Override default API endpoint
 * - NODE_ENV - Environment mode (development/production)
 * - All VITE_ prefixed variables available in client code
 */

// VITE CORE
import { defineConfig } from "vite";

// REACT PLUGIN
// Provides JSX transformation, Fast Refresh, and React DevTools integration
import react from "@vitejs/plugin-react";

// 📖 Vite documentation: https://vite.dev/config/
export default defineConfig({
  // 🔌 PLUGINS CONFIGURATION
  plugins: [
    // ⚛️ React Plugin - Essential for React development
    // Enables JSX syntax, Fast Refresh, and automatic React imports
    react(),

    // 🔧 POTENTIAL PLUGIN ADDITIONS:
    // - @vitejs/plugin-eslint - ESLint integration
    // - vite-plugin-pwa - Progressive Web App features
    // - @vitejs/plugin-legacy - Legacy browser support
  ],

  // 🛠️ ADDITIONAL CONFIGURATION OPTIONS:

  // 📡 DEVELOPMENT SERVER (uncomment to customize)
  // server: {
  //   port: 3000,           // Custom dev server port
  //   open: true,           // Auto-open browser on start
  //   cors: true,           // Enable CORS for API calls
  //   proxy: {              // Proxy API calls to backend
  //     '/api': {
  //       target: 'http://localhost:5001',
  //       changeOrigin: true,
  //       secure: false
  //     }
  //   }
  // },

  // 🏗️ BUILD OPTIONS (uncomment to customize)
  // build: {
  //   outDir: 'dist',       // Output directory
  //   sourcemap: true,      // Generate source maps
  //   minify: 'terser',     // Minification tool
  //   target: 'esnext',     // Browser target
  //   rollupOptions: {      // Rollup-specific options
  //     output: {
  //       manualChunks: {     // Code splitting strategy
  //         vendor: ['react', 'react-dom']
  //       }
  //     }
  //   }
  // },

  // 🔧 DEFINE GLOBALS (uncomment to add)
  // define: {
  //   __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  //   __BUILD_DATE__: JSON.stringify(new Date().toISOString())
  // },
});
