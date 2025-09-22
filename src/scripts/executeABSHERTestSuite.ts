// Execute ABSHER Government Services Platform Testing - Portal 6/14
// Comprehensive 38-Test Validation Suite

import './completeQIWAAndStartABSHER';
import { runABSHERTestSuite } from './testABSHERIntegration';

// Execute the complete test suite
console.log('🏛️ ABSHER PLATFORM TESTING PIPELINE');
console.log('Portal 6/14: Ministry of Interior Government Services');
console.log('Security Level: MAXIMUM (Government Identity Services)');

runABSHERTestSuite().catch(console.error);