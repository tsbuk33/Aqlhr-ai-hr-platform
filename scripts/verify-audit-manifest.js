#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');

function verifyAuditManifest() {
  console.log(chalk.blue('🔍 Verifying audit manifest...'));

  if (!fs.existsSync('audit-manifest.json')) {
    console.error(chalk.red('❌ audit-manifest.json not found. Run audit first.'));
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync('audit-manifest.json', 'utf8'));
  
  let hasFailures = false;
  const minThreshold = 90; // 90% completion required

  console.log(chalk.bold('\n📊 Feature Completeness Verification:'));
  
  Object.entries(manifest.featuresCompleteness).forEach(([feature, percentage]) => {
    const status = percentage >= minThreshold ? 'PASS' : 'FAIL';
    const color = percentage >= minThreshold ? chalk.green : chalk.red;
    
    console.log(`  ${feature}: ${color(percentage + '%')} ${color(status)}`);
    
    if (percentage < minThreshold) {
      hasFailures = true;
    }
  });

  if (Object.keys(manifest.missingFeaturesSummary).length > 0) {
    console.log(chalk.bold('\n🚨 Missing Features:'));
    Object.entries(manifest.missingFeaturesSummary).forEach(([feature, modules]) => {
      console.log(chalk.red(`  ${feature}: ${modules.length} modules affected`));
      hasFailures = true;
    });
  }

  if (hasFailures) {
    console.log(chalk.red('\n❌ Audit verification FAILED. Some modules are missing required features.'));
    console.log(chalk.yellow('💡 Run the scaffolding tools to fix missing features.'));
    process.exit(1);
  } else {
    console.log(chalk.green('\n✅ Audit verification PASSED. All modules meet feature requirements.'));
    process.exit(0);
  }
}

verifyAuditManifest();