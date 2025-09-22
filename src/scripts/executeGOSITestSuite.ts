#!/usr/bin/env node

/**
 * Execute GOSI Test Suite - Portal 10/14 Validation
 * Runs comprehensive 38-test validation for GOSI Portal Integration
 * Updates integration tracker and validates all portal functionality
 */

import { GOSIIntegrationTester } from './testGOSIIntegration';
import { integrationTracker } from '../utils/governmentIntegrationTracker';

async function executeGOSITestSuite() {
  console.log('🚀 EXECUTING GOSI PORTAL TEST SUITE');
  console.log('Portal: 10/14 - General Organization for Social Insurance');
  console.log('Tests: 38 Comprehensive Integration Validations');
  console.log('Scope: Employee Registration, Contributions, Compliance, Security');
  console.log('='.repeat(80));

  try {
    // Initialize GOSI integration tester
    const tester = new GOSIIntegrationTester();
    
    // Execute all 38 tests
    console.log('\n📋 Running GOSI Portal Test Suite...\n');
    const results = await tester.runAllTests();

    // Display detailed results
    console.log('\n📊 DETAILED TEST RESULTS:');
    console.log('─'.repeat(80));
    
    // Group tests by category
    const categories = {
      'API Connectivity': results.results.slice(0, 5),
      'Employee Registration': results.results.slice(5, 12),
      'Contribution Calculations': results.results.slice(12, 20),
      'Inquiry Services': results.results.slice(20, 26),
      'Compliance Reporting': results.results.slice(26, 32),
      'Data Integrity': results.results.slice(32, 38)
    };

    Object.entries(categories).forEach(([category, tests]) => {
      const passed = tests.filter(t => t.passed).length;
      const total = tests.length;
      const percentage = ((passed / total) * 100).toFixed(1);
      
      console.log(`${category}: ${passed}/${total} (${percentage}%) ${passed === total ? '✅' : '❌'}`);
    });

    // Update integration tracker with comprehensive data
    const trackerUpdate = {
      testsRun: results.total,
      testsPassed: results.passed,
      testsFailed: results.failed,
      completionRate: (results.passed / results.total) * 100,
      lastTestDate: new Date().toISOString(),
      integrationHealth: results.passed === results.total ? 'EXCELLENT' : 
                        results.passed / results.total > 0.9 ? 'GOOD' : 'NEEDS_ATTENTION',
      categories: {
        apiConnectivity: { passed: categories['API Connectivity'].filter(t => t.passed).length, total: 5 },
        employeeRegistration: { passed: categories['Employee Registration'].filter(t => t.passed).length, total: 7 },
        contributionCalculations: { passed: categories['Contribution Calculations'].filter(t => t.passed).length, total: 8 },
        inquiryServices: { passed: categories['Inquiry Services'].filter(t => t.passed).length, total: 6 },
        complianceReporting: { passed: categories['Compliance Reporting'].filter(t => t.passed).length, total: 6 },
        dataIntegrity: { passed: categories['Data Integrity'].filter(t => t.passed).length, total: 6 }
      }
    };

    integrationTracker.updatePortalStatus('GOSI', {
      status: results.passed === results.total ? 'completed' : 'failed',
      testsStatus: {
        total: results.total,
        passed: results.passed,
        failed: results.failed,
        lastRun: new Date()
      }
    });

    // Display integration tracker status
    console.log('\n🎯 INTEGRATION PROGRESS UPDATE:');
    console.log('─'.repeat(80));
    const progress = integrationTracker.getProgress();
    console.log(`Total Portals Completed: ${progress.completedPortals}/14`);
    console.log(`GOSI Portal: Portal 10/14 - ${results.passed === results.total ? 'COMPLETED' : 'NEEDS ATTENTION'}`);
    
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
      console.log('\n🎉 GOSI PORTAL INTEGRATION COMPLETED SUCCESSFULLY!');
      console.log('✅ All 38 tests passed - Portal ready for production use');
      console.log('✅ Employee registration system operational');
      console.log('✅ Contribution calculations validated');
      console.log('✅ Compliance reporting functional');
      console.log('✅ Data security measures verified');
    } else {
      console.log('\n⚠️  GOSI PORTAL INTEGRATION NEEDS ATTENTION');
      console.log(`❌ ${results.failed} tests failed - Review required before production`);
    }

    console.log('\n' + '='.repeat(80));
    return results.passed === results.total;

  } catch (error) {
    console.error('\n💥 GOSI TEST SUITE EXECUTION FAILED:');
    console.error(error);
    
    integrationTracker.updatePortalStatus('GOSI', {
      status: 'failed'
    });

    return false;
  }
}

// Execute if run directly
if (require.main === module) {
  executeGOSITestSuite()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Execution failed:', error);
      process.exit(1);
    });
}

export { executeGOSITestSuite };