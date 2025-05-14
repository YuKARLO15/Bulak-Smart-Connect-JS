import { defineConfig } from 'vite'

// Comment and Uncomment the following line to change the React plugin used
//import react from '@vitejs/plugin-react' // Use the default React plugin for Vite, if incompatible with SWC
import react from '@vitejs/plugin-react-swc' // Use SWC for faster builds and better performance
// Comment and Uncomment the following line to change the React plugin used
import { visualizer } from 'rollup-plugin-visualizer'

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
    })
  ],
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
