import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    mockExtensions: ['.css', '.scss', '.less', '.sass'],
    // Add CSS mocking
    css: {
      include: /\.css$/,
      modules: {
        classNameStrategy: 'non-scoped'
      }
    }
  }
})
