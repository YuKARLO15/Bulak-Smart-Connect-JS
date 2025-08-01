#!/usr/bin/env node

// Build hook to ensure cache busting on Render
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a build ID
const buildId = Date.now();
const buildDate = new Date().toISOString();

// Create a build info file
const buildInfo = {
  buildId,
  buildDate,
  version: `v${buildDate.slice(0, 10)}-${buildId}`,
  environment: process.env.NODE_ENV || 'production'
};

// Write build info to public folder
const buildInfoPath = path.join(__dirname, '../public/build-info.json');
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

console.log(`🚀 Build info generated: ${buildInfo.version}`);
console.log(`📅 Build date: ${buildInfo.buildDate}`);
console.log(`📄 Build info saved to: ${buildInfoPath}`);