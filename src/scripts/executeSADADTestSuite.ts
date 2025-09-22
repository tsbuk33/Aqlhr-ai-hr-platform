#!/usr/bin/env node

/**
 * SADAD Test Suite Executor
 * Executes Portal 9/14 test suite and updates integration tracking
 */

import fs from 'fs';
import path from 'path';
import { runSADADTestSuite } from './testSADADIntegration';
import { integrationTracker } from '@/utils/governmentIntegrationTracker';

interface ExecutionResult {
  success: boolean;
  testReport: any;
  message: string;
  timestamp: string;
}

async function executeSADADTestSuite(): Promise<ExecutionResult> {
  const executionId = `SADAD_EXEC_${Date.now()}`;
  const startTime = Date.now();
  
  console.log('🚀 SADAD TEST SUITE EXECUTION');
  console.log('='.repeat(60));
  console.log(`🆔 Execution ID: ${executionId}`);
  console.log('🎯 Portal: 9/14 - SADAD Payment Platform');
  console.log('📊 Target: 38 Payment Integration Tests');
  console.log('='.repeat(60));

  let executionResult: ExecutionResult = {
    success: false,
    testReport: null,
    message: '',
    timestamp: new Date().toISOString()
  };

  try {
    // Execute the test suite
    console.log('\n🧪 Executing SADAD integration tests...');
    const testReport = await runSADADTestSuite();
    
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    // Determine if deployment ready (100% pass rate required)
    const deploymentReady = testReport.failedTests === 0 && testReport.successRate === 100;
    
    executionResult = {
      success: deploymentReady,
      testReport,
      message: deploymentReady 
        ? 'All tests passed - Portal ready for deployment'
        : `${testReport.failedTests} test(s) failed - requires fixes`,
      timestamp: new Date().toISOString()
    };

    // Update integration tracker
    integrationTracker.updatePortalStatus('SADAD', { 
      status: deploymentReady ? 'completed' : 'in-progress',
      testsStatus: {
        total: testReport.totalTests,
        passed: testReport.passedTests,
        failed: testReport.failedTests,
        lastRun: new Date()
      }
    });

    // Save execution result
    const resultPath = path.join(process.cwd(), 'test-reports', `sadad-execution-${executionId}.json`);
    const reportDir = path.dirname(resultPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(resultPath, JSON.stringify({
      executionId,
      portal: 'SADAD',
      portalNumber: '9/14',
      totalDuration,
      ...executionResult
    }, null, 2));

    // Final execution report
    console.log('\n📊 EXECUTION SUMMARY');
    console.log('='.repeat(60));
    console.log(`🎯 Portal: SADAD Payment Platform (9/14)`);
    console.log(`📋 Total Tests: ${testReport.totalTests}`);
    console.log(`✅ Passed: ${testReport.passedTests}`);
    console.log(`❌ Failed: ${testReport.failedTests}`);
    console.log(`📈 Success Rate: ${testReport.successRate.toFixed(1)}%`);
    console.log(`⏱️ Duration: ${totalDuration}ms`);
    console.log(`💾 Report: ${resultPath}`);
    console.log(`🚀 Deployment Ready: ${deploymentReady ? 'YES' : 'NO'}`);

    if (deploymentReady) {
      console.log('\n🎉 SADAD INTEGRATION COMPLETE!');
      console.log('✅ All 38 tests passed successfully');
      console.log('✅ Payment gateway fully operational');
      console.log('✅ Security compliance verified');
      console.log('✅ Ready for production deployment');
      
      // Show integration progress
      const progress = integrationTracker.getProgress();
      console.log(`\n📈 Overall Progress: ${progress.overallProgress.toFixed(1)}%`);
      console.log(`✅ Completed: ${progress.completedPortals}/${progress.totalPortals} portals`);
      console.log(`⏭️ Next: ${progress.nextPortal || 'All portals completed'}`);
      
    } else {
      console.log('\n⚠️ SADAD INTEGRATION INCOMPLETE');
      console.log(`❌ ${testReport.failedTests} test(s) require attention`);
      console.log('🔧 Review failed tests and implement fixes');
      console.log('🔄 Re-run test suite after corrections');
    }

    return executionResult;

  } catch (error) {
    const endTime = Date.now();
    const totalDuration = endTime - startTime;
    
    console.error('\n❌ SADAD test suite execution failed:', error);
    
    // Update tracker with failure
    integrationTracker.updatePortalStatus('SADAD', {
      status: 'failed',
      testsStatus: {
        total: 38,
        passed: 0,
        failed: 38,
        lastRun: new Date()
      }
    });

    return executionResult;
  }
}

// Execute if called directly
if (require.main === module) {
  executeSADADTestSuite().then(result => {
    if (result.success) {
      console.log('\n🎉 SADAD PORTAL EXECUTION: SUCCESS!');
      process.exit(0);
    } else {
      console.log('\n🚨 SADAD PORTAL EXECUTION: FAILED!');
      process.exit(1);
    }
  }).catch(error => {
    console.error('💥 EXECUTION FAILED:', error);
    process.exit(1);
  });
}

export { executeSADADTestSuite };
export default executeSADADTestSuite;