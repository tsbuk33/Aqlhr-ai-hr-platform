#!/usr/bin/env node

/**
 * AqlHR Deployment Verification Script
 * Verifies that recent changes are properly deployed and accessible
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface DeploymentCheck {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
}

const checks: DeploymentCheck[] = [];

function addCheck(name: string, status: 'PASS' | 'FAIL' | 'WARNING', message: string) {
  checks.push({ name, status, message });
}

function checkFileExists(filePath: string, description: string) {
  const exists = fs.existsSync(filePath);
  addCheck(
    description,
    exists ? 'PASS' : 'FAIL',
    exists ? `✓ ${filePath} exists` : `✗ ${filePath} not found`
  );
  return exists;
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (status.trim() === '') {
      addCheck('Git Status', 'PASS', '✓ Working directory clean - all changes committed');
    } else {
      addCheck('Git Status', 'WARNING', '⚠ Uncommitted changes detected');
    }
  } catch (error) {
    addCheck('Git Status', 'FAIL', '✗ Cannot check git status');
  }
}

function checkRecentCommits() {
  try {
    const commits = execSync('git log --oneline -5', { encoding: 'utf-8' });
    const hasRecentChanges = commits.includes('government') || commits.includes('integration');
    addCheck(
      'Recent Commits',
      hasRecentChanges ? 'PASS' : 'WARNING',
      hasRecentChanges ? '✓ Recent government integration commits found' : '⚠ No recent integration commits detected'
    );
  } catch (error) {
    addCheck('Recent Commits', 'FAIL', '✗ Cannot check recent commits');
  }
}

function checkBuildFiles() {
  const distExists = fs.existsSync('dist');
  addCheck(
    'Build Output',
    distExists ? 'PASS' : 'WARNING',
    distExists ? '✓ Build output directory exists' : '⚠ No build output found - run npm run build'
  );
}

function checkGovernmentIntegrations() {
  const requiredFiles = [
    'src/pages/government/MUDADIntegration.tsx',
    'src/pages/government/ETIMADIntegration.tsx', 
    'src/pages/government/TAWAKKALNAIntegration.tsx',
    'src/pages/government/ESNADIntegration.tsx',
    'src/pages/government/QIWAIntegration.tsx',
    'src/pages/government/ABSHERIntegration.tsx',
    'src/pages/government/MUQEEMIntegration.tsx'
  ];

  let allExist = true;
  requiredFiles.forEach(file => {
    const exists = checkFileExists(file, `Government Integration: ${path.basename(file, '.tsx')}`);
    if (!exists) allExist = false;
  });

  return allExist;
}

function checkTestSuites() {
  const testFiles = [
    'src/scripts/testMUDADIntegration.ts',
    'src/scripts/testETIMADIntegration.ts',
    'src/scripts/testTAWAKKALNAIntegration.ts',
    'src/scripts/testESNADIntegration.ts',
    'src/scripts/testQIWAIntegration.ts',
    'src/scripts/testABSHERIntegration.ts',
    'src/scripts/testMUQEEMIntegration.ts'
  ];

  let allExist = true;
  testFiles.forEach(file => {
    const exists = checkFileExists(file, `Test Suite: ${path.basename(file, '.ts')}`);
    if (!exists) allExist = false;
  });

  return allExist;
}

function printResults() {
  console.log('\n🔍 AqlHR Deployment Verification Report');
  console.log('=====================================\n');

  const passed = checks.filter(c => c.status === 'PASS').length;
  const failed = checks.filter(c => c.status === 'FAIL').length;
  const warnings = checks.filter(c => c.status === 'WARNING').length;

  checks.forEach(check => {
    const icon = check.status === 'PASS' ? '✅' : check.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${check.name}: ${check.message}`);
  });

  console.log(`\n📊 Summary: ${passed} passed, ${warnings} warnings, ${failed} failed`);

  if (failed === 0) {
    console.log('\n🎉 All critical checks passed! Your changes appear to be ready for deployment.');
    console.log('\n📋 Next Steps:');
    console.log('1. Check GitHub repository for recent commits');
    console.log('2. Verify Vercel deployment status in dashboard');
    console.log('3. Test live URL functionality');
    console.log('4. Run full test suites if needed');
  } else {
    console.log('\n⚠️ Some checks failed. Please address the issues before deployment.');
  }

  console.log('\n🔗 Quick Links:');
  console.log('• GitHub: Check your repository for recent commits');
  console.log('• Vercel: Check deployment status in your dashboard');
  console.log('• Tests: Run npm run test to validate functionality');
}

async function main() {
  console.log('🚀 Starting deployment verification...\n');

  // Run all checks
  checkGitStatus();
  checkRecentCommits();
  checkBuildFiles();
  checkGovernmentIntegrations();
  checkTestSuites();

  // Print results
  printResults();
}

if (require.main === module) {
  main().catch(console.error);
}

export { main as verifyDeployment };