const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src');
const storiesDir = path.join(__dirname, '../src/stories');

if (!fs.existsSync(storiesDir)) {
  fs.mkdirSync(storiesDir);
}

function generateStory(componentName, componentPath) {
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

fs.readdirSync(componentsDir).forEach((file) => {
  const componentName = path.basename(file, path.extname(file));
  const componentPath = `../components/${componentName}`;
  const storyPath = path.join(storiesDir, `${componentName}.stories.jsx`);

  if (!fs.existsSync(storyPath)) {
    const storyContent = generateStory(componentName, componentPath);
    fs.writeFileSync(storyPath, storyContent);
    console.log(`Generated story for ${componentName}`);
  }
});