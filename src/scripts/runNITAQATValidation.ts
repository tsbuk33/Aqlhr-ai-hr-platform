#!/usr/bin/env node

/**
 * Run NITAQAT Validation - Complete Portal 11/14 Testing
 * Executes NITAQAT integration tests and validates deployment readiness
 */

import { executeNITAQATTestSuite } from './executeNITAQATTestSuite';

async function runNITAQATValidation() {
  console.log('🎯 NITAQAT PORTAL VALIDATION - Portal 11/14');
  console.log('Saudization Compliance Platform Integration');
  console.log('Executing 38 comprehensive integration tests...');
  console.log('='.repeat(70));

  try {
    const success = await executeNITAQATTestSuite();
    
    if (success) {
      console.log('\n🎉 NITAQAT PORTAL VALIDATION COMPLETED SUCCESSFULLY!');
      console.log('✅ Portal 11/14 ready for GitHub push and Vercel deployment');
      console.log('✅ Saudization compliance monitoring validated');
      console.log('✅ Workforce analytics verified');  
      console.log('✅ Compliance reporting functional');
      console.log('✅ All 38 tests passed');
      
      console.log('\n📋 NEXT STEPS:');
      console.log('1. Push changes to GitHub (auto-sync enabled)');
      console.log('2. Verify Vercel deployment');
      console.log('3. Proceed with Portal 12/14 development');
    } else {
      console.log('\n⚠️ NITAQAT PORTAL VALIDATION FAILED');
      console.log('❌ Some tests failed - review required before deployment');
    }

    return success;
  } catch (error) {
    console.error('\n💥 VALIDATION EXECUTION FAILED:', error);
    return false;
  }
}

// Execute validation
runNITAQATValidation()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Execution failed:', error);
    process.exit(1);
  });

export { runNITAQATValidation };