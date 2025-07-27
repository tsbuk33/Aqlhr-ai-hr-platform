// Temporary runner for the heading fixer script
const { execSync } = require('child_process');

try {
  console.log('🚀 Running AqlHR Heading Case Fixer...\n');
  execSync('npx tsx scripts/fix-heading-case.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('Error running script:', error.message);
}