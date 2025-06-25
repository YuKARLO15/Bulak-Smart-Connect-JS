import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
    css: false, // Disable CSS processing to avoid JSDOM issues
    // Mock CSS files
    mockReset: true,
    clearMocks: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})