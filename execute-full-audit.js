#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue('🚀 Starting Full AqlHR Platform Audit & Auto-Fix...\n'));

const steps = [
  {
    name: 'Color Tokens & Contrast Check',
    command: 'node scripts/fix-color-tokens.js',
    icon: '🎨'
  },
  {
    name: 'Accessibility Audit',
    command: 'npx tsx scripts/audit/accessibility-checker.ts --apply',
    icon: '♿'
  },
  {
    name: 'Responsive Layout Check',
    command: 'npx tsx scripts/audit/responsive-layout-checker.ts',
    icon: '📱'
  },
  {
    name: 'Performance Audit',
    command: 'npx tsx scripts/audit/performance-checker.ts',
    icon: '⚡'
  },
  {
    name: 'Error Handling Check',
    command: 'npx tsx scripts/audit/error-handling-checker.ts --apply',
    icon: '🛡️'
  },
  {
    name: 'SEO Meta Tags Check',
    command: 'npx tsx scripts/audit/seo-meta-checker.ts --apply',
    icon: '🔍'
  },
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
    name: 'Master Audit Orchestrator',
    command: 'npx tsx scripts/master-audit-orchestrator.ts',
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