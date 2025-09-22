// Execute All Portal Tests - Complete Testing Pipeline
// Runs all 7 portal test suites in sequence for full validation

import { validateAllPortalTests } from './validateAllPortalTests';

console.log('🚀 EXECUTING COMPLETE PORTAL TESTING PIPELINE');
console.log('Portal Testing: 7 Government Integrations × 38 Tests Each');
console.log('Target: 266 Total Tests with 100% Pass Rate');
console.log('='.repeat(80));

validateAllPortalTests().catch(console.error);