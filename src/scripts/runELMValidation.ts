#!/usr/bin/env node

/**
 * ELM Portal Validation Script
 * Comprehensive validation for Education & Learning Management integration
 */

import { executeELMTestSuite } from './testELMIntegration';
import { integrationTracker } from '../utils/governmentIntegrationTracker';

async function runELMValidation(): Promise<{ success: boolean; message: string }> {
  console.log('🎓 Starting ELM Portal Validation...');
  console.log('Portal: Education & Learning Management (14/14)');
  console.log('Validating: Learning Management, Certification, Assessment, Content Management');
  console.log('-'.repeat(80));

  try {
    // Update portal status to testing
    integrationTracker.updatePortalStatus('ELM', { status: 'testing' });
    
    // Execute test suite
    const testsPassed = await executeELMTestSuite();
    
    if (testsPassed) {
      // Mark as completed
      integrationTracker.updatePortalStatus('ELM', { status: 'completed' });
      integrationTracker.completePortalDeployment('ELM');
      
      const successMessage = `
✅ ELM Portal Validation: SUCCESS
🎯 All 38 Education & Learning Management tests passed
🚀 Portal 14/14 is ready for GitHub/Vercel deployment
📊 Learning management systems validated
🎓 Certification systems operational  
📝 Assessment platforms verified
📚 Content management ready
`;
      
      console.log(successMessage);
      return { success: true, message: successMessage };
    } else {
      integrationTracker.updatePortalStatus('ELM', { status: 'failed' });
      
      const failureMessage = `
❌ ELM Portal Validation: FAILED
🔧 Some Education & Learning Management tests failed
⚠️  Portal requires fixes before deployment
`;
      
      console.log(failureMessage);
      return { success: false, message: failureMessage };
    }
  } catch (error) {
    integrationTracker.updatePortalStatus('ELM', { status: 'failed' });
    
    const errorMessage = `
💥 ELM Portal Validation: ERROR
🚨 Validation process encountered an error: ${error}
`;
    
    console.log(errorMessage);
    return { success: false, message: errorMessage };
  }
}

// Execute validation if run directly
if (require.main === module) {
  runELMValidation()
    .then(result => {
      console.log('\n' + '='.repeat(80));
      console.log('ELM PORTAL VALIDATION COMPLETE');
      console.log('='.repeat(80));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 ELM validation execution failed:', error);
      process.exit(1);
    });
}

export { runELMValidation };