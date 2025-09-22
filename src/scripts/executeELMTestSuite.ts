#!/usr/bin/env node

/**
 * Execute ELM Test Suite - Standalone Runner
 * Education & Learning Management Integration Testing
 */

import { executeELMTestSuite } from './testELMIntegration';

console.log('🎓 EXECUTING ELM INTEGRATION TEST SUITE');
console.log('Portal: Education & Learning Management (14/14)');
console.log('Test Coverage: 38 Education & Learning Management Tests');
console.log('='.repeat(60));

executeELMTestSuite()
  .then(success => {
    if (success) {
      console.log('\n✅ ELM Integration Test Suite: ALL TESTS PASSED');
      console.log('🎯 Education & Learning Management integration is ready for deployment');
      process.exit(0);
    } else {
      console.log('\n❌ ELM Integration Test Suite: SOME TESTS FAILED');
      console.log('🔧 Please review and fix the failing tests before deployment');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 ELM Integration Test Suite execution failed:', error);
    process.exit(1);
  });