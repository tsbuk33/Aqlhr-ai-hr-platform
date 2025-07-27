#!/usr/bin/env tsx

// Import the existing CenterLayoutFixer
import { execSync } from 'child_process';
import chalk from 'chalk';

async function runCenterLayoutFixPlatform() {
  console.log(chalk.blue('🎯 RUNNING CENTER LAYOUT FIXER ON ENTIRE AQLHR PLATFORM'));
  console.log('='.repeat(60));
  
  try {
    // First run dry-run to see what will be changed
    console.log(chalk.yellow('\n📋 Phase 1: Scanning for layout issues (dry-run)...'));
    execSync('npx tsx scripts/fix-center-layout.ts --dry-run', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log(chalk.green('\n✨ Phase 2: Applying centering fixes...'));
    // Apply the actual fixes
    execSync('npx tsx scripts/fix-center-layout.ts --apply', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log(chalk.green('\n🎉 CENTER LAYOUT ENFORCEMENT COMPLETE!'));
    console.log(chalk.cyan('📊 All English pages are now LTR-centered'));
    console.log(chalk.cyan('📊 All Arabic pages are now RTL-centered'));
    console.log(chalk.cyan('📊 Check the generated report for detailed changes'));
    
  } catch (error) {
    console.error(chalk.red('💥 Error running center layout fixer:'), error);
    process.exit(1);
  }
}

runCenterLayoutFixPlatform();