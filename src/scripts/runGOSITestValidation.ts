#!/usr/bin/env node

/**
 * Run GOSI Test Validation - Complete Portal 10/14 Testing
 * Executes GOSI integration tests and validates deployment readiness
 */

import { executeGOSITestSuite } from './executeGOSITestSuite';

async function runGOSITestValidation() {
  console.log('🎯 GOSI PORTAL VALIDATION - Portal 10/14');
  console.log('General Organization for Social Insurance Integration');
  console.log('Executing 38 comprehensive integration tests...');
  console.log('='.repeat(70));

  try {
    const success = await executeGOSITestSuite();
    
    if (success) {
      console.log('\n🎉 GOSI PORTAL VALIDATION COMPLETED SUCCESSFULLY!');
      console.log('✅ Portal 10/14 ready for GitHub push and Vercel deployment');
      console.log('✅ Employee registration system validated');
      console.log('✅ Contribution calculations verified');  
      console.log('✅ Compliance reporting functional');
      console.log('✅ All 38 tests passed');
      
      console.log('\n📋 NEXT STEPS:');
      console.log('1. Push changes to GitHub (auto-sync enabled)');
      console.log('2. Verify Vercel deployment');
      console.log('3. Proceed with Portal 11/14 development');
    } else {
      console.log('\n⚠️ GOSI PORTAL VALIDATION FAILED');
      console.log('❌ Some tests failed - review required before deployment');
    }

    return success;
  } catch (error) {
    console.error('\n💥 VALIDATION EXECUTION FAILED:', error);
    return false;
  }
}

// Execute validation
runGOSITestValidation()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Execution failed:', error);
    process.exit(1);
  });

export { runGOSITestValidation };