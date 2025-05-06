import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, '../src/components');
const storiesDir = path.join(__dirname, '../src/stories');

// Ensure the stories directory exists
await fs.mkdir(storiesDir, { recursive: true });

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

const files = await fs.readdir(componentsDir);

for (const file of files) {
  const componentName = path.basename(file, path.extname(file));
  const componentPath = `../components/${componentName}`;
  const storyPath = path.join(storiesDir, `${componentName}.stories.jsx`);

  try {
    await fs.access(storyPath);
    console.log(`Story already exists for ${componentName}`);
  } catch {
    const storyContent = await generateStory(componentName, componentPath);
    await fs.writeFile(storyPath, storyContent);
    console.log(`Generated story for ${componentName}`);
  }
}