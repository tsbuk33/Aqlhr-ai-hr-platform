#!/usr/bin/env node

/**
 * Execute SADAD Portal Validation and Deployment Check
 * Complete validation of Portal 9/14 with GitHub/Vercel integration
 */

import { executeSADADTestSuite } from './executeSADADTestSuite';
import { runComprehensiveDeploymentTest } from './runComprehensiveDeploymentTest';
import { integrationTracker } from '@/utils/governmentIntegrationTracker';

async function executeSADADValidation() {
  console.log('🚀 SADAD PORTAL VALIDATION & DEPLOYMENT CHECK');
  console.log('='.repeat(70));
  console.log('🎯 Portal: 9/14 - SADAD Payment Platform');
  console.log('📊 Validation: 38 Tests + GitHub/Vercel Deployment');
  console.log('='.repeat(70));

  try {
    // Step 1: Execute SADAD test suite
    console.log('\n🧪 STEP 1: SADAD PORTAL TEST EXECUTION');
    console.log('─'.repeat(50));
    
    const sadadResult = await executeSADADTestSuite();
    
    if (!sadadResult.success) {
      console.log('❌ SADAD tests failed - deployment not ready');
      return false;
    }
    
    console.log('✅ SADAD Portal 9/14: All 38 tests passed!');
    
    // Step 2: Run comprehensive deployment tests
    console.log('\n🔍 STEP 2: COMPREHENSIVE DEPLOYMENT VALIDATION');
    console.log('─'.repeat(50));
    
    const deploymentResult = await runComprehensiveDeploymentTest();
    
    // Step 3: Integration tracker status
    const progress = integrationTracker.getProgress();
    
    console.log('\n📊 FINAL VALIDATION REPORT');
    console.log('='.repeat(70));
    console.log(`✅ SADAD Portal: ${sadadResult.success ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Deployment Check: ${deploymentResult.overallSuccess ? 'PASSED' : 'FAILED'}`);
    console.log(`📈 Overall Progress: ${progress.overallProgress.toFixed(1)}%`);
    console.log(`🔢 Completed Portals: ${progress.completedPortals}/${progress.totalPortals}`);
    
    if (sadadResult.success && deploymentResult.overallSuccess) {
      console.log('\n🎉 SADAD PORTAL VALIDATION: COMPLETE SUCCESS!');
      console.log('✅ Portal 9/14 ready for production');
      console.log('✅ GitHub integration verified');
      console.log('✅ Vercel deployment ready');
      console.log('✅ All 304 portal tests operational');
      
      return true;
    } else {
      console.log('\n⚠️ VALIDATION ISSUES DETECTED');
      if (!sadadResult.success) {
        console.log('❌ SADAD portal tests require attention');
      }
      if (!deploymentResult.overallSuccess) {
        console.log('❌ Deployment readiness issues found');
      }
      
      return false;
    }
    
  } catch (error) {
    console.error('💥 VALIDATION EXECUTION FAILED:', error);
    return false;
  }
}

// Execute validation
if (require.main === module) {
  executeSADADValidation().then(success => {
    if (success) {
      console.log('\n🎯 SADAD PORTAL VALIDATION: SUCCESS!');
      console.log('🚀 Ready for GitHub push and Vercel deployment!');
      process.exit(0);
    } else {
      console.log('\n🚨 SADAD PORTAL VALIDATION: FAILED!');
      process.exit(1);
    }
  }).catch(error => {
    console.error('💥 EXECUTION ERROR:', error);
    process.exit(1);
  });
}

export { executeSADADValidation };
export default executeSADADValidation;