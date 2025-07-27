#!/usr/bin/env node

import { CenterLayoutFixer } from './scripts/fix-center-layout.ts';

async function runCenterLayoutFixer() {
  console.log('🎯 Running Center Layout Fixer across entire AqlHR platform...');
  
  try {
    // First run dry-run to see what will be changed
    console.log('\n📋 Scanning for layout issues (dry-run)...');
    const dryRunFixer = new CenterLayoutFixer(true);
    const dryResults = await dryRunFixer.scanAndFix();
    dryRunFixer.printResults();
    
    if (dryResults.modifiedFiles > 0) {
      console.log('\n✨ Applying centering fixes...');
      // Apply the actual fixes
      const applyFixer = new CenterLayoutFixer(false);
      const results = await applyFixer.scanAndFix();
      applyFixer.printResults();
      
      console.log('\n🎉 Center layout enforcement complete!');
      console.log(`📊 Modified ${results.modifiedFiles} files with ${results.fixes.length} total fixes`);
    } else {
      console.log('\n✅ No layout issues found - all pages already perfectly centered!');
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

runCenterLayoutFixer();