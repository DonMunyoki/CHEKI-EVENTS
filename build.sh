#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Starting build process...');

try {
  // Try to run vite build directly
  execSync('npx vite build', { stdio: 'inherit', cwd: process.cwd() });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
