#!/usr/bin/env node

import { spawn } from 'child_process';

console.log('🚀 Running AI Chat Embedder...\n');

const child = spawn('npx', ['tsx', 'scripts/fix-embed-ai-chat.ts'], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ AI Chat embedding completed successfully!');
  } else {
    console.error(`\n❌ Process exited with code ${code}`);
  }
});

child.on('error', (error) => {
  console.error('❌ Error starting process:', error);
});