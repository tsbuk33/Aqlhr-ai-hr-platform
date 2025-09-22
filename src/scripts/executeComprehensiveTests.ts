#!/usr/bin/env node

/**
 * Execute Comprehensive Tests - Single Command Entry Point
 * Runs all deployment tests and portal validations for GitHub/Vercel integration
 */

import { runComprehensiveDeploymentTest } from './runComprehensiveDeploymentTest';

console.log('🚀 EXECUTING COMPREHENSIVE DEPLOYMENT TESTS');
console.log('Target: GitHub Integration + Vercel Deployment + 8 Government Portals');
console.log('Total Tests: 304 Portal Tests + Deployment Checks + Live Endpoint Tests');
console.log('='.repeat(80));

runComprehensiveDeploymentTest().catch(console.error);