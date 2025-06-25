import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
    css: false,
    mockReset: true,
    clearMocks: true,
    testTimeout: 10000, // Longer timeout for integration tests
    include: ['**/*.integration.test.{js,jsx}'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})