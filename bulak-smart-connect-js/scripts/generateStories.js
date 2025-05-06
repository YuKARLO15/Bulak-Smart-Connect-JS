import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, '../src/');

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

// Recursive function to process directories
async function processDirectory(directory) {
  const files = await fs.readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      // Skip the __tests__ directory
      if (file === '__tests__') {
        console.log(`Skipping directory: ${filePath}`);
        continue;
      }

      // Recursively process subdirectories
      await processDirectory(filePath);
    } else {
      // Process component files
      const ext = path.extname(file);
      if (['.jsx', '.tsx', '.js', '.ts'].includes(ext)) {
        const componentName = path.basename(file, ext);
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