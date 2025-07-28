#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🔍 Starting complete audit and scaffolding process...\n'));

try {
  // Step 1: Run complete scaffolding
  console.log(chalk.yellow('📦 Step 1: Running complete scaffolding...'));
  execSync('node complete-scaffolding.js', { stdio: 'inherit' });

  // Step 2: Run audit to verify
  console.log(chalk.yellow('\n🔍 Step 2: Running audit verification...'));
  execSync('npx tsx scripts/audit-module-features.ts > audit-manifest.json', { stdio: 'inherit' });

  // Step 3: Run verification script
  console.log(chalk.yellow('\n✅ Step 3: Running verification...'));
  execSync('node scripts/verify-audit-manifest.js', { stdio: 'inherit' });

  console.log(chalk.green('\n🎉 All 170 modules successfully scaffolded and verified!'));

} catch (error) {
  console.error(chalk.red('\n❌ Process failed:'), error.message);
  process.exit(1);
}