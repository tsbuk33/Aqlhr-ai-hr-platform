#!/usr/bin/env node

/**
 * Run TVTC Validation - Complete Portal 12/14 Testing
 * Executes TVTC integration tests and validates deployment readiness
 */

import { executeTVTCTestSuite } from './executeTVTCTestSuite';

async function runTVTCValidation() {
  console.log('🎯 TVTC PORTAL VALIDATION - Portal 12/14');
  console.log('Technical and Vocational Training Corporation Integration');
  console.log('Executing 38 comprehensive integration tests...');
  console.log('='.repeat(70));

  try {
    const success = await executeTVTCTestSuite();
    
    if (success) {
      console.log('\n🎉 TVTC PORTAL VALIDATION COMPLETED SUCCESSFULLY!');
      console.log('✅ Portal 12/14 ready for GitHub push and Vercel deployment');
      console.log('✅ Training program management validated');
      console.log('✅ Certification tracking verified');  
      console.log('✅ Learning management system integrated');
      console.log('✅ All 38 tests passed');
      
      console.log('\n📋 NEXT STEPS:');
      console.log('1. Push changes to GitHub (auto-sync enabled)');
      console.log('2. Verify Vercel deployment');
      console.log('3. Proceed with Portal 13/14 development');
    } else {
      console.log('\n⚠️ TVTC PORTAL VALIDATION FAILED');
      console.log('❌ Some tests failed - review required before deployment');
    }

    return success;
  } catch (error) {
    console.error('\n💥 VALIDATION EXECUTION FAILED:', error);
    return false;
  }
}

// Execute validation
runTVTCValidation()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Execution failed:', error);
    process.exit(1);
  });

export { runTVTCValidation };