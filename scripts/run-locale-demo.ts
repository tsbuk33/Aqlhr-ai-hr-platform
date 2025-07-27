#!/usr/bin/env tsx

// Demo runner for LTR/RTL compliance fixer
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Create sample files with violations for demonstration
const createSampleFiles = () => {
  // Create English file with Arabic text violation
  const englishSample = `import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const WelcomeCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>مرحباً بك في النظام</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome to the AqlHR platform!</p>
        <span>Last updated: January 2025</span>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;`;

  // Create Arabic file with English text violation  
  const arabicSample = `import React from 'react';
import { Button } from '@/components/ui/button';

const PayrollSummary = () => {
  return (
    <div className="payroll-summary">
      <h2>ملخص الرواتب</h2>
      <p>Total processed: 2,847 employees</p>
      <span>Status: Complete</span>
      <Button title="إضافة موظف جديد">
        Add New Employee
      </Button>
    </div>
  );
};

export default PayrollSummary;`;

  // Ensure demo directories exist
  fs.mkdirSync('src/demo/en', { recursive: true });
  fs.mkdirSync('src/demo/ar', { recursive: true });

  // Write sample files
  fs.writeFileSync('src/demo/en/WelcomeCard.tsx', englishSample);
  fs.writeFileSync('src/demo/ar/PayrollSummary.tsx', arabicSample);

  console.log('📝 Created sample files with LTR/RTL violations:');
  console.log('   - src/demo/en/WelcomeCard.tsx (Arabic text in English file)');
  console.log('   - src/demo/ar/PayrollSummary.tsx (English text in Arabic file)');
};

const showBeforeState = () => {
  console.log('\n📋 BEFORE STATE:');
  console.log('\n🇺🇸 English File (src/demo/en/WelcomeCard.tsx):');
  console.log('```tsx');
  console.log(fs.readFileSync('src/demo/en/WelcomeCard.tsx', 'utf-8'));
  console.log('```');
  
  console.log('\n🇸🇦 Arabic File (src/demo/ar/PayrollSummary.tsx):');
  console.log('```tsx'); 
  console.log(fs.readFileSync('src/demo/ar/PayrollSummary.tsx', 'utf-8'));
  console.log('```');
};

const runComplianceCheck = () => {
  console.log('\n🔍 Running LTR/RTL compliance fixer...\n');
  
  try {
    // Run with restricted pattern to only check our demo files
    const result = execSync('npx tsx scripts/fix-ltr-rtl-compliance.ts', { 
      encoding: 'utf-8',
      cwd: process.cwd(),
      env: { ...process.env, DEMO_MODE: 'true' }
    });
    console.log(result);
  } catch (error) {
    console.log('Compliance check output:');
    console.log(error.stdout || error.message);
  }
};

const showAfterState = () => {
  console.log('\n📋 AFTER STATE:');
  
  if (fs.existsSync('src/demo/en/WelcomeCard.tsx')) {
    console.log('\n🇺🇸 Fixed English File:');
    console.log('```tsx');
    console.log(fs.readFileSync('src/demo/en/WelcomeCard.tsx', 'utf-8'));
    console.log('```');
  }
  
  if (fs.existsSync('src/demo/ar/PayrollSummary.tsx')) {
    console.log('\n🇸🇦 Fixed Arabic File:');
    console.log('```tsx');
    console.log(fs.readFileSync('src/demo/ar/PayrollSummary.tsx', 'utf-8'));
    console.log('```');
  }
};

const showTranslationUpdates = () => {
  console.log('\n🔑 Translation Keys Added:');
  
  try {
    const enTranslations = JSON.parse(fs.readFileSync('public/api/translations/en.json', 'utf-8'));
    const arTranslations = JSON.parse(fs.readFileSync('public/api/translations/ar.json', 'utf-8'));
    
    if (enTranslations.auto_generated) {
      console.log('\n📝 English translations (en.json):');
      console.log('```json');
      console.log(JSON.stringify({ auto_generated: enTranslations.auto_generated }, null, 2));
      console.log('```');
    }
    
    if (arTranslations.auto_generated) {
      console.log('\n📝 Arabic translations (ar.json):');
      console.log('```json');
      console.log(JSON.stringify({ auto_generated: arTranslations.auto_generated }, null, 2));
      console.log('```');
    }
  } catch (error) {
    console.log('No translation updates found.');
  }
};

const cleanup = () => {
  console.log('\n🧹 Cleaning up demo files...');
  try {
    if (fs.existsSync('src/demo')) {
      fs.rmSync('src/demo', { recursive: true, force: true });
    }
    console.log('✅ Demo cleanup complete');
  } catch (error) {
    console.warn('Warning: Could not clean up demo files:', error.message);
  }
};

// Main demo execution
async function main() {
  console.log('🚀 LTR/RTL Compliance Fixer Demo\n');
  console.log('This demo will:');
  console.log('1. Create sample files with LTR/RTL violations');
  console.log('2. Show the before state');
  console.log('3. Run the compliance fixer');
  console.log('4. Show the after state with fixes applied');
  console.log('5. Display translation updates');
  console.log('6. Clean up demo files\n');

  try {
    createSampleFiles();
    showBeforeState();
    runComplianceCheck();
    showAfterState();
    showTranslationUpdates();
  } catch (error) {
    console.error('Demo error:', error);
  } finally {
    cleanup();
  }
  
  console.log('\n🎉 Demo complete! The LTR/RTL compliance fixer is ready for production use.');
  console.log('\nTo run on your entire codebase:');
  console.log('  npx tsx scripts/fix-ltr-rtl-compliance.ts');
  console.log('\nTo check without fixing:');
  console.log('  npx tsx scripts/fix-ltr-rtl-compliance.ts --no-fix');
}

if (require.main === module) {
  main();
}