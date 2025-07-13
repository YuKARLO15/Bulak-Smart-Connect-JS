import { defineConfig } from 'vite'

// Comment and Uncomment the following line to change the React plugin used
//import react from '@vitejs/plugin-react' // Use the default React plugin for Vite, if incompatible with SWC
import react from '@vitejs/plugin-react-swc' // Use SWC for faster builds and better performance
// Comment and Uncomment the following line to change the React plugin used
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'stats.html',
      open: false, // Set to true to automatically open the visualization after build
      gzipSize: true,
      brotliSize: true,
      template: 'treemap' // Options: 'sunburst', 'treemap', 'network'
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module' // Use 'module' for modern browsers, 'classic' for older browsers
      },
      workbox: {
        // **ENHANCED**: More aggressive cache busting
        skipWaiting: true,
        clientsClaim: true,
        // Add image patterns to cache
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,JPEG}'],
        runtimeCaching: [
          {
            // Cache images specifically
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|JPEG)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.onrender\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [200, 201, 202, 204] // Cache successful responses
              }
            }
          }
        ],
        // **FORCE UPDATE**: Clear old caches on update
        cleanupOutdatedCaches: true,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Bulak Smart Connect',
        short_name: 'Bulak Smart Connect', 
        description: 'Smart queue and information system for Municipal Civil Registrar of San Ildefonso, Bulacan',
        theme_color: '#184a5b',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        id: 'bulak-smart-connect',
        icons: [
          {
            src: 'BulakLGULogo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable any'
          },
          {
            src: 'BulakLGULogo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ],
        categories: ['government', 'productivity', 'utilities'],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'Go to user dashboard',
            url: '/UserDashboard',
            icons: [{ src: 'BulakLGULogo.png', sizes: '192x192' }]
          },
          {
            name: 'Applications',
            short_name: 'Applications',
            description: 'Document applications',
            url: '/ApplicationForm',
            icons: [{ src: 'BulakLGULogo.png', sizes: '192x192' }]
          },
          {
            name: 'Walk-in Queue',
            short_name: 'Walk-in',
            description: 'Smart walk-in queue',
            url: '/WalkInForm',
            icons: [{ src: 'BulakLGULogo.png', sizes: '192x192' }]
          }
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    mockExtensions: ['.css', '.scss', '.less', '.sass'],
    // Add CSS mocking
    css: {
      //include: /\.css$/, commented out to avoid issues with CSS imports
      modules: {
        classNameStrategy: 'non-scoped'
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps in production
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // **ENHANCED**: Better cache busting for builds
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          utils: ['axios', 'date-fns', 'qrcode.react'],
          pdf: ['@react-pdf/renderer']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  base: '/', // Important for Render static sites
})
