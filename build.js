const { spawn } = require('child_process');
const path = require('path');

const buildProcess = spawn('npx', ['vite', 'build'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

buildProcess.on('close', (code) => {
  console.log(`Build process exited with code ${code}`);
  process.exit(code);
});
