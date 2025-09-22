import { molIntegrationTester } from './testMOLIntegration';
import { integrationTracker } from '@/utils/governmentIntegrationTracker';

export async function executeMOLTestSuite(): Promise<void> {
  console.log('🏛️ Executing MOL Integration Test Suite...');
  
  try {
    // Update portal status to testing
    integrationTracker.updatePortalStatus('MOL', {
      status: 'testing',
      testsStatus: {
        total: 38,
        passed: 0,
        failed: 0,
        lastRun: new Date()
      }
    });

    // Run all 38 tests
    const results = await molIntegrationTester.runAllTests();
    
    // Update portal with test results
    integrationTracker.completePortalTesting('MOL', {
      passed: results.passed,
      failed: results.failed
    });

    // Log detailed results
    console.log('\n📊 MOL Integration Test Results:');
    console.log(`Total Tests: ${results.totalTests}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Warnings: ${results.warnings}`);
    console.log(`Overall Score: ${results.overallScore}%`);
    
    // Log test breakdown by category
    const categories = [...new Set(results.results.map(r => r.category))];
    categories.forEach(category => {
      const categoryTests = results.results.filter(r => r.category === category);
      const categoryPassed = categoryTests.filter(r => r.status === 'passed').length;
      console.log(`\n${category}: ${categoryPassed}/${categoryTests.length} passed`);
      
      categoryTests.forEach(test => {
        const status = test.status === 'passed' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
        console.log(`  ${status} ${test.testName} (${test.executionTime}ms)`);
      });
    });

    if (results.failed === 0) {
      console.log('\n🎉 All MOL Integration tests passed successfully!');
      console.log('✅ MOL Portal (13/14) ready for deployment');
    } else {
      console.log(`\n⚠️ ${results.failed} tests failed. Review and fix before deployment.`);
    }

  } catch (error) {
    console.error('❌ MOL Test Suite execution failed:', error);
    
    integrationTracker.updatePortalStatus('MOL', {
      status: 'failed',
      testsStatus: {
        total: 38,
        passed: 0,
        failed: 38,
        lastRun: new Date()
      }
    });
  }
}

// Execute if run directly
if (require.main === module) {
  executeMOLTestSuite();
}