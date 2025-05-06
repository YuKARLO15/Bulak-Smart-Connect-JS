import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, '../src/');

// List of directories or files that contain utility functions, not components
const skipPatterns = [
  'services',
  'utils',
  'helpers',
  'context',
  'hooks',
  '.test.',
  '.spec.',
];

// List of filenames to skip
const skipFiles = [
  'NewUserInfo.js',
  'ApplicationData.js',
  'RegularBirth.jsx',
  'main.jsx',
  'App.jsx',         // Main app component
  'index.js',        // Entry point
  'index.jsx',       // Entry point
  'vite.config.js',  // Configuration
  'setupTests.js'    // Test configuration
];

// Function to generate the story content
async function generateStory(componentName, componentPath) {
  const storyContent = `
import React from 'react';
import ${componentName} from '${componentPath}';

export default {
  title: 'Components/${componentName}',
  component: ${componentName},
};

export const Default = () => <${componentName} />;
  `;

  return storyContent.trim();
}

// Check if a file should be skipped
function shouldSkipFile(filePath, fileName) {
  // Skip files in the skip list
  if (skipFiles.includes(fileName)) {
    return true;
  }
  
  // Skip files matching patterns
  return skipPatterns.some(pattern => filePath.includes(pattern));
}

// Recursive function to process directories
async function processDirectory(directory) {
  const files = await fs.readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      // Skip the __tests__ directory and other utility directories
      if (file === '__tests__' || skipPatterns.some(pattern => file === pattern)) {
        console.log(`Skipping directory: ${filePath}`);
        continue;
      }

      // Recursively process subdirectories
      await processDirectory(filePath);
    } else {
      // Process component files
      const ext = path.extname(file);
      if (['.jsx', '.tsx'].includes(ext)) {
        const componentName = path.basename(file, ext);
        
        // Skip files that are already stories
        if (componentName.includes('.stories')) {
          console.log(`Skipping story file: ${filePath}`);
          continue;
        }
        
        // Skip utility files and non-component files
        if (shouldSkipFile(filePath, file)) {
          console.log(`Skipping utility file: ${filePath}`);
          continue;
        }
        
        const storyPath = path.join(directory, `${componentName}.stories.jsx`);
        const relativeImportPath = `./${path.basename(file)}`;

        try {
          // Check if the story file already exists
          await fs.access(storyPath);
          console.log(`Story already exists for ${componentName}`);
        } catch {
          // Generate and write the story file
          const storyContent = await generateStory(componentName, relativeImportPath);
          await fs.writeFile(storyPath, storyContent);
          console.log(`Generated story for ${componentName}`);
        }
      }
    }
  }
}

// Start processing the components directory
await processDirectory(componentsDir);