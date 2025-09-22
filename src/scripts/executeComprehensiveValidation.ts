#!/usr/bin/env node

/**
 * Execute Complete Portal and Deployment Validation
 * Tests all 9 completed portals + GitHub/Vercel integration
 */

import { validateAllPortalTests } from './validateAllPortalTests';
import { runComprehensiveDeploymentTest } from './runComprehensiveDeploymentTest';
import { integrationTracker } from '@/utils/governmentIntegrationTracker';

console.log('🚀 COMPLETE PORTAL & DEPLOYMENT VALIDATION');
console.log('Target: 9 Government Portals × 38 Tests + GitHub/Vercel');
console.log('Total Coverage: 342 Portal Tests + Deployment Validation');
console.log('='.repeat(80));

async function executeComprehensiveValidation() {
  try {
    // Step 1: Validate all portals
    console.log('\n📋 VALIDATING ALL GOVERNMENT PORTALS');
    const portalResults = await validateAllPortalTests();
    
    // Step 2: Run deployment tests  
    console.log('\n🚀 VALIDATING DEPLOYMENT READINESS');
    const deploymentResults = await runComprehensiveDeploymentTest();
    
    // Step 3: Final assessment
    const progress = integrationTracker.getProgress();
    
    console.log('\n📊 COMPREHENSIVE VALIDATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`📈 Portal Progress: ${progress.overallProgress.toFixed(1)}%`);
    console.log(`✅ Completed Portals: ${progress.completedPortals}/${progress.totalPortals}`);
    console.log(`🧪 Portal Tests: ${portalResults.success ? 'PASSED' : 'FAILED'}`);
    console.log(`🚀 Deployment: ${deploymentResults.overallSuccess ? 'READY' : 'NOT READY'}`);
    
    const overallSuccess = portalResults.success && deploymentResults.overallSuccess;
    
    if (overallSuccess) {
      console.log('\n🎉 COMPREHENSIVE VALIDATION: COMPLETE SUCCESS!');
      console.log('✅ All 9 government portals operational');
      console.log('✅ 342 total tests passing');
      console.log('✅ GitHub integration ready');
      console.log('✅ Vercel deployment ready');
      console.log('✅ Production deployment approved');
    } else {
      console.log('\n⚠️ VALIDATION ISSUES REQUIRE ATTENTION');
      if (!portalResults.success) {
        console.log('❌ Portal test failures detected');
      }
      if (!deploymentResults.overallSuccess) {
        console.log('❌ Deployment readiness issues found');
      }
    }
    
    return overallSuccess;
    
  } catch (error) {
    console.error('💥 COMPREHENSIVE VALIDATION FAILED:', error);
    return false;
  }
}

executeComprehensiveValidation().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 EXECUTION FAILED:', error);
  process.exit(1);
});