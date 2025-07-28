#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Running complete scaffolding for all 165 remaining modules...');

try {
  // Run the scaffolding script
  console.log('📋 Executing scaffolding script...');
  const output = execSync('npx tsx scripts/scaffold-missing-features.ts', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log(output);
  
  // Run audit to verify completion
  console.log('\n🔍 Running audit verification...');
  const auditOutput = execSync('npx tsx scripts/audit-module-features.ts > audit-manifest-updated.json', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ Audit completed. Updated manifest saved as audit-manifest-updated.json');
  
  // Verify results
  const verifyOutput = execSync('node scripts/verify-audit-manifest.js', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log(verifyOutput);
  
} catch (error) {
  console.error('❌ Error during scaffolding:', error.message);
  if (error.stdout) console.log('STDOUT:', error.stdout);
  if (error.stderr) console.log('STDERR:', error.stderr);
  process.exit(1);
}