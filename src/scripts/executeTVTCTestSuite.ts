#!/usr/bin/env node

/**
 * Execute TVTC Test Suite - Portal 12/14 Validation
 * Runs comprehensive 38-test validation for TVTC Portal Integration
 * Updates integration tracker and validates all portal functionality
 */

import { TVTCIntegrationTester } from './testTVTCIntegration';
import { integrationTracker } from '../utils/governmentIntegrationTracker';

async function executeTVTCTestSuite() {
  console.log('🚀 EXECUTING TVTC PORTAL TEST SUITE');
  console.log('Portal: 12/14 - Technical and Vocational Training Corporation');
  console.log('Tests: 38 Comprehensive Integration Validations');
  console.log('Scope: Training Programs, Certification, Assessment, Learning Management');
  console.log('='.repeat(80));

  try {
    // Initialize TVTC integration tester
    const tester = new TVTCIntegrationTester();
    
    // Execute all 38 tests
    console.log('\n📋 Running TVTC Portal Test Suite...\n');
    const results = await tester.runAllTests();

    // Display detailed results
    console.log('\n📊 DETAILED TEST RESULTS:');
    console.log('─'.repeat(80));
    
    // Group tests by category
    const categories = {
      'API Connectivity': results.results.slice(0, 5),
      'Training Programs': results.results.slice(5, 13),
      'Certification Management': results.results.slice(13, 21),
      'Learning Management': results.results.slice(21, 29),
      'Quality Assurance': results.results.slice(29, 35),
      'Integration Systems': results.results.slice(35, 38)
    };

    Object.entries(categories).forEach(([category, tests]) => {
      const passed = tests.filter(t => t.passed).length;
      const total = tests.length;
      const percentage = ((passed / total) * 100).toFixed(1);
      
      console.log(`${category}: ${passed}/${total} (${percentage}%) ${passed === total ? '✅' : '❌'}`);
    });

    // Display integration tracker status
    console.log('\n🎯 INTEGRATION PROGRESS UPDATE:');
    console.log('─'.repeat(80));
    const progress = integrationTracker.getProgress();
    console.log(`Total Portals Completed: ${progress.completedPortals}/14`);
    console.log(`TVTC Portal: Portal 12/14 - ${results.passed === results.total ? 'COMPLETED' : 'NEEDS ATTENTION'}`);
    
    // List completed portals
    console.log('\n✅ COMPLETED PORTALS:');
    const completedPortals = progress.portals.filter(p => p.status === 'completed');
    completedPortals.forEach((portal, index) => {
      console.log(`  ${index + 1}. ${portal.portalName}`);
    });

    // Display next portal
    if (progress.nextPortal) {
      console.log(`\n🎯 NEXT PORTAL: ${progress.nextPortal}`);
    }

    // Final validation
    if (results.passed === results.total) {
      console.log('\n🎉 TVTC PORTAL INTEGRATION COMPLETED SUCCESSFULLY!');
      console.log('✅ All 38 tests passed - Portal ready for production use');
      console.log('✅ Training program management operational');
      console.log('✅ Certification tracking validated');
      console.log('✅ Skills assessment functional');
      console.log('✅ Learning management system integrated');
    } else {
      console.log('\n⚠️  TVTC PORTAL INTEGRATION NEEDS ATTENTION');
      console.log(`❌ ${results.failed} tests failed - Review required before production`);
    }

    console.log('\n' + '='.repeat(80));
    return results.passed === results.total;

  } catch (error) {
    console.error('\n💥 TVTC TEST SUITE EXECUTION FAILED:');
    console.error(error);
    
    integrationTracker.updatePortalStatus('TVTC', {
      status: 'failed'
    });

    return false;
  }
}

// Execute if run directly
if (require.main === module) {
  executeTVTCTestSuite()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Execution failed:', error);
      process.exit(1);
    });
}

export { executeTVTCTestSuite };