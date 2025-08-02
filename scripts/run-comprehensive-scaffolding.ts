#!/usr/bin/env tsx

import { execSync } from 'child_process';
import * as fs from 'fs';
import chalk from 'chalk';

console.log(chalk.blue('🚀 Starting comprehensive scaffolding for all 170+ modules...\n'));

try {
  // Step 1: Run audit to get current state
  console.log(chalk.yellow('📋 Step 1: Running module audit...'));
  execSync('npx tsx scripts/audit-module-features.ts > audit-manifest.json', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  // Step 2: Run scaffolding to fix all missing features
  console.log(chalk.yellow('🔧 Step 2: Scaffolding all missing features...'));
  const scaffoldOutput = execSync('npx tsx scripts/scaffold-missing-features.ts', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log(scaffoldOutput);
  
  // Step 3: Run audit again to verify completion
  console.log(chalk.yellow('🔍 Step 3: Verifying completion...'));
  execSync('npx tsx scripts/audit-module-features.ts > audit-manifest-updated.json', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  // Step 4: Compare results
  const originalManifest = JSON.parse(fs.readFileSync('audit-manifest.json', 'utf-8'));
  const updatedManifest = JSON.parse(fs.readFileSync('audit-manifest-updated.json', 'utf-8'));
  
  console.log(chalk.bold('\n📊 SCAFFOLDING RESULTS\n'));
  console.log(`Total Modules: ${chalk.cyan(updatedManifest.totalModules)}`);
  
  console.log(chalk.bold('\n🎯 Feature Completeness Improvement:'));
  Object.entries(updatedManifest.featuresCompleteness).forEach(([feature, newPercentage]) => {
    const oldPercentage = originalManifest.featuresCompleteness[feature] || 0;
    const improvement = newPercentage - oldPercentage;
    const color = newPercentage >= 90 ? chalk.green : newPercentage >= 70 ? chalk.yellow : chalk.red;
    const arrow = improvement > 0 ? chalk.green(`↗ +${improvement}%`) : '';
    console.log(`  ${feature}: ${color(newPercentage + '%')} ${arrow}`);
  });
  
  console.log(chalk.bold('\n🚨 Remaining Issues:'));
  const remainingIssues = Object.keys(updatedManifest.missingFeaturesSummary).length;
  if (remainingIssues === 0) {
    console.log(chalk.green('  ✅ All universal features successfully implemented!'));
  } else {
    Object.entries(updatedManifest.missingFeaturesSummary).forEach(([feature, modules]) => {
      console.log(`  ${chalk.red(feature)}: ${modules.length} modules still missing`);
    });
  }
  
  console.log(chalk.bold.green('\n✅ SCAFFOLDING COMPLETE!\n'));
  console.log('📄 Updated manifests saved as:');
  console.log('  - audit-manifest.json (original)');
  console.log('  - audit-manifest-updated.json (after scaffolding)');
  
} catch (error) {
  console.error(chalk.red('❌ Scaffolding failed:'), error.message);
  if (error.stdout) console.log('STDOUT:', error.stdout);
  if (error.stderr) console.log('STDERR:', error.stderr);
  process.exit(1);
}