#!/usr/bin/env node

/**
 * Execute NITAQAT Test Suite - Portal 11/14 Validation
 * Runs comprehensive 38-test validation for NITAQAT Portal Integration
 * Updates integration tracker and validates all portal functionality
 */

import { NITAQATIntegrationTester } from './testNITAQATIntegration';
import { integrationTracker } from '../utils/governmentIntegrationTracker';

async function executeNITAQATTestSuite() {
  console.log('🚀 EXECUTING NITAQAT PORTAL TEST SUITE');
  console.log('Portal: 11/14 - Saudization Compliance Platform');
  console.log('Tests: 38 Comprehensive Integration Validations');
  console.log('Scope: Compliance Monitoring, Workforce Analytics, Reporting, Security');
  console.log('='.repeat(80));

  try {
    // Initialize NITAQAT integration tester
    const tester = new NITAQATIntegrationTester();
    
    // Execute all 38 tests
    console.log('\n📋 Running NITAQAT Portal Test Suite...\n');
    const results = await tester.runAllTests();

    // Display detailed results
    console.log('\n📊 DETAILED TEST RESULTS:');
    console.log('─'.repeat(80));
    
    // Group tests by category
    const categories = {
      'API Connectivity': results.results.slice(0, 5),
      'Compliance Monitoring': results.results.slice(5, 13),
      'Workforce Analytics': results.results.slice(13, 21),
      'Reporting System': results.results.slice(21, 27),
      'Data Integration': results.results.slice(27, 33),
      'Security Compliance': results.results.slice(33, 38)
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
    console.log(`NITAQAT Portal: Portal 11/14 - ${results.passed === results.total ? 'COMPLETED' : 'NEEDS ATTENTION'}`);
    
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
      console.log('\n🎉 NITAQAT PORTAL INTEGRATION COMPLETED SUCCESSFULLY!');
      console.log('✅ All 38 tests passed - Portal ready for production use');
      console.log('✅ Saudization compliance monitoring operational');
      console.log('✅ Workforce analytics validated');
      console.log('✅ Compliance reporting functional');
      console.log('✅ Data security measures verified');
    } else {
      console.log('\n⚠️  NITAQAT PORTAL INTEGRATION NEEDS ATTENTION');
      console.log(`❌ ${results.failed} tests failed - Review required before production`);
    }

    console.log('\n' + '='.repeat(80));
    return results.passed === results.total;

  } catch (error) {
    console.error('\n💥 NITAQAT TEST SUITE EXECUTION FAILED:');
    console.error(error);
    
    integrationTracker.updatePortalStatus('NITAQAT', {
      status: 'failed'
    });

    return false;
  }
}

// Execute if run directly
if (require.main === module) {
  executeNITAQATTestSuite()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Execution failed:', error);
      process.exit(1);
    });
}

export { executeNITAQATTestSuite };