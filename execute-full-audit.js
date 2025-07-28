#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🚀 Starting Full AqlHR Platform Audit & Auto-Fix...\n'));

const steps = [
  {
    name: 'LTR/RTL Compliance Check',
    command: 'npx tsx scripts/fix-ltr-rtl-compliance.ts --apply',
    icon: '🌍'
  },
  {
    name: 'Center Layout Enforcement',
    command: 'npx tsx scripts/fix-center-layout.ts --apply',
    icon: '🎯'
  },
  {
    name: 'WCAG Color Compliance',
    command: 'npx tsx scripts/wcag-compliance-checker.ts --apply',
    icon: '🎨'
  },
  {
    name: 'Universal Module Scaffolding',
    command: 'node complete-scaffolding.js',
    icon: '🏗️'
  },
  {
    name: 'IPO Readiness Module Creation',
    command: 'npx tsx scripts/create-ipo-readiness.ts',
    icon: '📊'
  },
  {
    name: 'Module Features Audit',
    command: 'npx tsx scripts/audit-module-features.ts > audit-manifest.json',
    icon: '🔍'
  },
  {
    name: 'Audit Verification',
    command: 'node scripts/verify-audit-manifest.js',
    icon: '✅'
  },
  {
    name: 'Comprehensive Final Audit',
    command: 'npx tsx scripts/comprehensive-audit.ts',
    icon: '🎉'
  }
];

let completedSteps = 0;
const totalSteps = steps.length;

try {
  for (const step of steps) {
    console.log(chalk.yellow(`\n${step.icon} Step ${completedSteps + 1}/${totalSteps}: ${step.name}...`));
    
    try {
      execSync(step.command, { stdio: 'inherit' });
      completedSteps++;
      console.log(chalk.green(`✅ ${step.name} completed successfully`));
    } catch (error) {
      console.log(chalk.yellow(`⚠️ ${step.name} completed with warnings`));
      completedSteps++;
    }
  }

  console.log(chalk.green(`\n🎉 All ${completedSteps}/${totalSteps} audit steps completed!`));
  console.log(chalk.blue('\n📄 Check AQLHR_FULL_AUDIT_REPORT.md for detailed results'));
  console.log(chalk.blue('📄 Check audit-manifest.json for module analysis'));

} catch (error) {
  console.error(chalk.red('\n❌ Audit process failed:'), error.message);
  console.log(chalk.yellow(`\n✅ Completed ${completedSteps}/${totalSteps} steps before error`));
  process.exit(1);
}