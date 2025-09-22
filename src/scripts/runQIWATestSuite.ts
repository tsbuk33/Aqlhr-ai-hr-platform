// Execute QIWA Testing Suite - Portal 5/14 Completion
import { runQIWATestSuite } from './testQIWAIntegration';

console.log('🚀 EXECUTING QIWA LABOR MARKET PLATFORM TEST SUITE');
console.log('=' .repeat(60));

runQIWATestSuite().catch(console.error);