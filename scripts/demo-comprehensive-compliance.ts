#!/usr/bin/env tsx

// Demo runner for comprehensive compliance fixer
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

// Create sample files with both heading and LTR/RTL violations
const createDemoFiles = () => {
  // English file with violations
  const englishSample = `import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EmployeeDashboard = () => {
  return (
    <div className="dashboard">
      <Card>
        <CardHeader>
          <CardTitle>مرحباً بك في لوحة التحكم</CardTitle> {/* Arabic in English file */}
        </CardHeader>
        <CardContent>
          <h2>employee master data</h2> {/* Should be Title Case module */}
          <h3>reports and analytics</h3> {/* Should be Sentence case submodule */}
          <Button title="EXPORT tool">export data</Button> {/* Should be UPPERCASE tool */}
          <span>data Parser utility</span> {/* Should be lowercase sub-tool */}
          <p>Welcome to the AqlHR platform!</p>
          <div>Status: الموظفين النشطين</div> {/* Arabic in English file */}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;`;

  // Arabic file with violations  
  const arabicSample = `import React from 'react';
import { Button } from '@/components/ui/button';

const PayrollSummaryArabic = () => {
  return (
    <div className="payroll-summary">
      <h1>ملخص الرواتب</h1>
      <h2>EMPLOYEE data export</h2> {/* Should be Title Case module */}
      <h3>Settings And Configuration</h3> {/* Should be Sentence case submodule */}
      <p>Total processed: 2,847 employees</p> {/* English in Arabic file */}
      <span>Status: Complete</span> {/* English in Arabic file */}
      <Button title="Add New Employee">
        import BACKUP tool {/* Mixed case tool - should be UPPERCASE */}
      </Button>
      <div>validator function</div> {/* Should be lowercase sub-tool */}
    </div>
  );
};

export default PayrollSummaryArabic;`;

  // Ensure demo directories exist
  fs.mkdirSync('src/demo/en', { recursive: true });
  fs.mkdirSync('src/demo/ar', { recursive: true });

  // Write sample files
  fs.writeFileSync('src/demo/en/EmployeeDashboard.tsx', englishSample);
  fs.writeFileSync('src/demo/ar/PayrollSummary.tsx', arabicSample);

  console.log(chalk.blue('📝 Created demo files with violations:'));
  console.log('   - src/demo/en/EmployeeDashboard.tsx (Arabic text + heading case issues)');
  console.log('   - src/demo/ar/PayrollSummary.tsx (English text + heading case issues)');
};

const showBeforeState = () => {
  console.log(chalk.magenta('\n📋 BEFORE STATE:\n'));
  
  console.log(chalk.yellow('🇺🇸 English File (src/demo/en/EmployeeDashboard.tsx):'));
  console.log('```tsx');
  console.log(fs.readFileSync('src/demo/en/EmployeeDashboard.tsx', 'utf-8'));
  console.log('```\n');
  
  console.log(chalk.yellow('🇸🇦 Arabic File (src/demo/ar/PayrollSummary.tsx):'));
  console.log('```tsx'); 
  console.log(fs.readFileSync('src/demo/ar/PayrollSummary.tsx', 'utf-8'));
  console.log('```\n');
};

const runComplianceCheck = (dryRun: boolean = false) => {
  console.log(chalk.blue(`\n🔍 Running comprehensive compliance ${dryRun ? 'check (dry-run)' : 'fixer'}...\n`));
  
  try {
    // Create a custom config for demo that only scans our demo files
    const customConfigPath = 'scripts/demo-config.json';
    const demoConfig = {
      scanPatterns: ['src/demo/**/*.{tsx,jsx,ts,js}'],
      outputReport: 'scripts/demo-compliance-report.md'
    };
    
    fs.writeFileSync(customConfigPath, JSON.stringify(demoConfig, null, 2));
    
    const result = execSync(
      `npx tsx scripts/fix-ltr-rtl-compliance.ts ${dryRun ? '--dry-run' : '--apply'}`, 
      { 
        encoding: 'utf-8',
        cwd: process.cwd()
      }
    );
    console.log(result);
    
    // Clean up
    if (fs.existsSync(customConfigPath)) {
      fs.unlinkSync(customConfigPath);
    }
    
  } catch (error: any) {
    console.log('Compliance check output:');
    console.log(error.stdout || error.message);
  }
};

const showAfterState = () => {
  console.log(chalk.green('\n📋 AFTER STATE:\n'));
  
  if (fs.existsSync('src/demo/en/EmployeeDashboard.tsx')) {
    console.log(chalk.yellow('🇺🇸 Fixed English File:'));
    console.log('```tsx');
    console.log(fs.readFileSync('src/demo/en/EmployeeDashboard.tsx', 'utf-8'));
    console.log('```\n');
  }
  
  if (fs.existsSync('src/demo/ar/PayrollSummary.tsx')) {
    console.log(chalk.yellow('🇸🇦 Fixed Arabic File:'));
    console.log('```tsx');
    console.log(fs.readFileSync('src/demo/ar/PayrollSummary.tsx', 'utf-8'));
    console.log('```\n');
  }
};

const showTranslationUpdates = () => {
  console.log(chalk.cyan('\n🔑 Translation Updates:\n'));
  
  try {
    const enPath = 'public/api/translations/en.json';
    const arPath = 'public/api/translations/ar.json';
    
    if (fs.existsSync(enPath)) {
      const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
      if (enTranslations.auto_fix) {
        console.log(chalk.yellow('📝 English translations (en.json):'));
        console.log('```json');
        console.log(JSON.stringify({ auto_fix: enTranslations.auto_fix }, null, 2));
        console.log('```\n');
      }
    }
    
    if (fs.existsSync(arPath)) {
      const arTranslations = JSON.parse(fs.readFileSync(arPath, 'utf-8'));
      if (arTranslations.auto_fix) {
        console.log(chalk.yellow('📝 Arabic translations (ar.json):'));
        console.log('```json');
        console.log(JSON.stringify({ auto_fix: arTranslations.auto_fix }, null, 2));
        console.log('```\n');
      }
    }
  } catch (error) {
    console.log('No translation updates found or error reading files.');
  }
};

const showReport = () => {
  console.log(chalk.cyan('\n📊 Generated Report:\n'));
  
  try {
    if (fs.existsSync('scripts/compliance-report.md')) {
      const report = fs.readFileSync('scripts/compliance-report.md', 'utf-8');
      console.log('```markdown');
      console.log(report);
      console.log('```\n');
    }
  } catch (error) {
    console.log('No report file found.');
  }
};

const cleanup = () => {
  console.log(chalk.gray('\n🧹 Cleaning up demo files...'));
  try {
    if (fs.existsSync('src/demo')) {
      fs.rmSync('src/demo', { recursive: true, force: true });
    }
    ['scripts/compliance-report.md', 'scripts/demo-compliance-report.md'].forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    console.log(chalk.green('✅ Demo cleanup complete\n'));
  } catch (error) {
    console.warn('Warning: Could not clean up all demo files');
  }
};

// Main demo execution
async function main() {
  console.log(chalk.blue.bold('🚀 COMPREHENSIVE COMPLIANCE FIXER DEMO\n'));
  console.log('This demo will:');
  console.log('1. Create sample files with heading case + LTR/RTL violations');
  console.log('2. Show the before state');
  console.log('3. Run dry-run to show what would be fixed');
  console.log('4. Apply fixes');
  console.log('5. Show the after state with all fixes applied');
  console.log('6. Display translation updates and reports');
  console.log('7. Clean up demo files\n');

  try {
    createDemoFiles();
    showBeforeState();
    
    console.log(chalk.blue('📋 First, let\'s see what violations would be detected:\n'));
    runComplianceCheck(true); // Dry run first
    
    console.log(chalk.blue('\n📋 Now applying all fixes:\n'));
    runComplianceCheck(false); // Apply fixes
    
    showAfterState();
    showTranslationUpdates();
    showReport();
  } catch (error) {
    console.error('Demo error:', error);
  } finally {
    cleanup();
  }
  
  console.log(chalk.green.bold('🎉 Demo complete! The comprehensive compliance fixer is ready.'));
  console.log(chalk.cyan('\nTo run on your entire codebase:'));
  console.log(chalk.white('  npx tsx scripts/fix-ltr-rtl-compliance.ts --apply'));
  console.log(chalk.cyan('\nTo check without fixing:'));
  console.log(chalk.white('  npx tsx scripts/fix-ltr-rtl-compliance.ts --dry-run'));
  console.log(chalk.cyan('\nCI/CD integration:'));
  console.log(chalk.white('  npx tsx scripts/fix-ltr-rtl-compliance.ts --dry-run --no-fail'));
}

if (require.main === module) {
  main();
}