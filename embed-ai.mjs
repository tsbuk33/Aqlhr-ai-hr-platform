#!/usr/bin/env node

import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Running AI Chat Embedder...\n');

// Use spawnSync for better output streaming and error handling
const result = spawnSync('npx', ['tsx', resolve(__dirname, 'scripts/advanced-ai-embedder.ts')], {
  stdio: 'inherit'
});

if (result.error) {
  console.error('❌ Failed to start embedder process:', result.error.message);
  process.exit(1);
}

if (result.status === 0) {
  console.log('\n✅ AI Chat embedding completed successfully!');
  console.log('💡 Next: Run test-ai-chat-presence.ts to verify coverage');
} else if (result.status === 1) {
  console.warn('⚠️  Embedder completed with warnings. Check output above.');
  process.exit(1);
} else {
  console.error(`\n❌ Process exited with code ${result.status}`);
  process.exit(result.status);
}