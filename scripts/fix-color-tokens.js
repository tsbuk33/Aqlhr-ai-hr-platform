#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🎨 Fixing color tokens and contrast issues...\n'));

try {
  // Run color tokens checker with auto-fix
  console.log('🔍 Scanning for hardcoded colors...');
  execSync('npx tsx scripts/audit/color-tokens-checker.ts --apply', { stdio: 'inherit' });
  
  console.log(chalk.green('\n✅ Color token fixes completed!'));
  console.log('📄 Check the report above for any remaining manual fixes needed.');
  
} catch (error) {
  console.error(chalk.red('❌ Color fix failed:'), error.message);
  process.exit(1);
}