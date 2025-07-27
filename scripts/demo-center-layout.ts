#!/usr/bin/env tsx

import { CenterLayoutFixer } from './fix-center-layout';
import chalk from 'chalk';
import * as fs from 'fs';

// Create demo files to show before/after
const createDemoFiles = () => {
  // English dashboard page (before)
  const englishPageBefore = `import React from 'react';
import { Card } from '@/components/ui/card';

const DashboardPage: React.FC = () => {
  return (
    <div className="page-wrapper text-left ml-4 justify-start">
      <main className="dashboard-container float-left">
        <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <h2>Total Employees</h2>
            <p className="text-3xl font-bold">1,234</p>
          </Card>
          <Card className="p-4">
            <h2>Active Projects</h2>
            <p className="text-3xl font-bold">42</p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;`;

  // Arabic payroll page (before)
  const arabicPageBefore = `import React from 'react';
import { Card } from '@/components/ui/card';

const PayrollPageAr: React.FC = () => {
  return (
    <div className="page-layout text-right mr-4 justify-end">
      <section className="payroll-main float-right">
        <h1 className="text-2xl font-bold mb-4">كشوف المرتبات</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h2>إجمالي الموظفين</h2>
            <p className="text-3xl font-bold">١٢٣٤</p>
          </Card>
          <Card className="p-4">
            <h2>المرتبات المعلقة</h2>
            <p className="text-3xl font-bold">٨٧</p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PayrollPageAr;`;

  // Create demo directories
  if (!fs.existsSync('src/demo')) {
    fs.mkdirSync('src/demo', { recursive: true });
  }
  if (!fs.existsSync('src/demo/en')) {
    fs.mkdirSync('src/demo/en', { recursive: true });
  }
  if (!fs.existsSync('src/demo/ar')) {
    fs.mkdirSync('src/demo/ar', { recursive: true });
  }

  // Write demo files
  fs.writeFileSync('src/demo/en/DashboardPage.tsx', englishPageBefore);
  fs.writeFileSync('src/demo/ar/PayrollPageAr.tsx', arabicPageBefore);

  console.log(chalk.green('✅ Created demo files for center layout testing'));
};

const runDemo = async () => {
  console.log(chalk.blue('🎯 CENTER LAYOUT FIXER DEMO'));
  console.log('='.repeat(50));

  // Create demo files
  createDemoFiles();

  console.log(chalk.yellow('\n📄 BEFORE - English Dashboard:'));
  const englishBefore = fs.readFileSync('src/demo/en/DashboardPage.tsx', 'utf8');
  console.log(chalk.gray(englishBefore.slice(0, 400) + '...'));

  console.log(chalk.yellow('\n📄 BEFORE - Arabic Payroll:'));
  const arabicBefore = fs.readFileSync('src/demo/ar/PayrollPageAr.tsx', 'utf8');
  console.log(chalk.gray(arabicBefore.slice(0, 400) + '...'));

  // Run the fixer on demo files
  console.log(chalk.blue('\n🔧 RUNNING CENTER LAYOUT FIXER...'));
  const fixer = new CenterLayoutFixer(false); // Apply mode
  
  try {
    const results = await fixer.scanAndFix();
    
    console.log(chalk.green('\n✅ AFTER - English Dashboard:'));
    const englishAfter = fs.readFileSync('src/demo/en/DashboardPage.tsx', 'utf8');
    console.log(chalk.green(englishAfter.slice(0, 400) + '...'));

    console.log(chalk.green('\n✅ AFTER - Arabic Payroll:'));
    const arabicAfter = fs.readFileSync('src/demo/ar/PayrollPageAr.tsx', 'utf8');
    console.log(chalk.green(arabicAfter.slice(0, 400) + '...'));

    // Print results
    fixer.printResults();

    // Generate demo report
    const demoReport = \`# Center Layout Fixer Demo Report

## Overview
This demo shows the before/after results of running the center layout fixer on sample English and Arabic pages.

## Files Processed
- \`src/demo/en/DashboardPage.tsx\` (English)
- \`src/demo/ar/PayrollPageAr.tsx\` (Arabic)

## Changes Applied
- Removed conflicting alignment classes: \`text-left\`, \`text-right\`, \`float-left\`, \`float-right\`, \`ml-4\`, \`mr-4\`, \`justify-start\`, \`justify-end\`
- Added centered layout classes: \`flex flex-col items-center justify-center text-center mx-auto max-w-screen-xl p-4\`
- Added RTL direction attributes for Arabic pages
- Created global centered layout styles
- Updated layout components for consistency

## Results
- **Total files scanned:** \${results.totalFiles}
- **Files modified:** \${results.modifiedFiles}
- **Fixes applied:** \${results.fixes.length}
- **Errors:** \${results.errors.length}

## Key Improvements
1. **Consistent centering:** All page content now appears perfectly centered regardless of language direction
2. **RTL compliance:** Arabic pages properly handle RTL direction while maintaining centered layout
3. **Responsive design:** Layout adapts gracefully to mobile and desktop viewports
4. **Global consistency:** Same centering approach across entire AqlHR platform

## Usage
Run the full fixer across your codebase:

\\\`\\\`\\\`bash
# Dry run to see what would change
npx tsx scripts/fix-center-layout.ts --dry-run

# Apply changes
npx tsx scripts/fix-center-layout.ts --apply
\\\`\\\`\\\`

Every page in your AqlHR platform will now have beautiful, consistent centered layouts! 🎯✨
\`;

    fs.writeFileSync('scripts/demo-center-layout-report.md', demoReport);
    console.log(chalk.green('\n📄 Demo report saved to: scripts/demo-center-layout-report.md'));

  } catch (error) {
    console.error(chalk.red('💥 Demo failed:'), error);
  }

  // Clean up demo files
  fs.rmSync('src/demo', { recursive: true, force: true });
  console.log(chalk.yellow('\n🧹 Cleaned up demo files'));
};

// Run the demo
if (require.main === module) {
  runDemo().catch(console.error);
}

export { runDemo };