#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Executing complete scaffolding for all 165 remaining modules...');

try {
  console.log('Running scaffolding script...');
  execSync('npx tsx scripts/scaffold-missing-features.ts', { stdio: 'inherit' });
  
  console.log('\n✅ Scaffolding completed successfully!');
  console.log('Updated all modules with universal features.');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}