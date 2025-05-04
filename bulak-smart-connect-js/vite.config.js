import { defineConfig } from 'vite'

// Comment and Uncomment the following line to change the React plugin used
//import react from '@vitejs/plugin-react' // Use the default React plugin for Vite, if incompatible with SWC
import react from '@vitejs/plugin-react-swc' // Use SWC for faster builds and better performance
// Comment and Uncomment the following line to change the React plugin used

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
