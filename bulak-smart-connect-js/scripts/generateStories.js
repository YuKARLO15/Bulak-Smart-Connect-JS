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
import ${componentName} from './${componentName}';

export default {
  title: 'Components/${componentName}',
  component: ${componentName},
};

export const Default = () => <${componentName} />;
  `;

  return storyContent.trim();
}

// Read all files in the components directory
const files = await fs.readdir(componentsDir);

for (const file of files) {
  const componentPath = path.join(componentsDir, file);
  const componentName = path.basename(file, path.extname(file));

  // Check if the file is a directory (skip non-component files)
  const stats = await fs.stat(componentPath);
  if (!stats.isDirectory()) {
    continue;
  }

  // Find the component file (e.g., .jsx or .tsx)
  const componentFiles = await fs.readdir(componentPath);
  const componentFile = componentFiles.find((f) =>
    ['.jsx', '.tsx', '.js', '.ts'].includes(path.extname(f))
  );

  if (!componentFile) {
    console.log(`No component file found for ${componentName}`);
    continue;
  }

  const storyPath = path.join(componentPath, `${componentName}.stories.jsx`);
  const relativeImportPath = `./${componentFile}`;

  try {
    // Check if the story file already exists
    await fs.access(storyPath);
    console.log(`Story already exists for ${componentName}`);
  } catch {
    // Generate and write the story file
    const storyContent = `
import React from 'react';
import ${componentName} from '${relativeImportPath}';

export default {
  title: 'Components/${componentName}',
  component: ${componentName},
};

export const Default = () => <${componentName} />;
    `.trim();

    await fs.writeFile(storyPath, storyContent);
    console.log(`Generated story for ${componentName}`);
  }
}