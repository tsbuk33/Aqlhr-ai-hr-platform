#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Running AI Chat Embedder...');

try {
  execSync('npx tsx scripts/fix-embed-ai-chat.ts', { stdio: 'inherit' });
  console.log('\n✅ AI Chat embedding completed successfully!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}