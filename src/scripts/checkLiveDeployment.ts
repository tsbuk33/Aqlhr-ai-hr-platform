#!/usr/bin/env node

/**
 * Live Deployment Checker
 * Tests if the deployed application is accessible and functioning
 */

interface LiveCheck {
  name: string;
  url: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  responseTime?: number;
  error?: string;
}

const DEPLOYMENT_URLS = [
  'https://your-app.lovable.app', // Replace with actual Lovable URL
  'https://your-app.vercel.app',  // Replace with actual Vercel URL
];

const ROUTES_TO_TEST = [
  '/',
  '/en/system-overview',
  '/en/government/mudad',
  '/en/government/etimad',
  '/en/government/tawakkalna',
  '/en/government/esnad',
  '/en/government/qiwa',
  '/en/government/absher',
  '/en/government/muqeem'
];

async function testEndpoint(url: string): Promise<LiveCheck> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'AqlHR-Deployment-Checker/1.0'
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      name: `GET ${url}`,
      url,
      status: response.ok ? 'PASS' : 'FAIL',
      responseTime,
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    return {
      name: `GET ${url}`,
      url,
      status: 'FAIL',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkAllEndpoints() {
  console.log('🌐 Testing Live Deployment Endpoints...\n');
  
  const allChecks: LiveCheck[] = [];
  
  for (const baseUrl of DEPLOYMENT_URLS) {
    console.log(`Testing ${baseUrl}...`);
    
    for (const route of ROUTES_TO_TEST) {
      const fullUrl = `${baseUrl}${route}`;
      const check = await testEndpoint(fullUrl);
      allChecks.push(check);
      
      const icon = check.status === 'PASS' ? '✅' : '❌';
      const timing = check.responseTime ? ` (${check.responseTime}ms)` : '';
      console.log(`  ${icon} ${route}${timing}`);
      
      if (check.error) {
        console.log(`    Error: ${check.error}`);
      }
    }
    console.log('');
  }
  
  return allChecks;
}

function printSummary(checks: LiveCheck[]) {
  const passed = checks.filter(c => c.status === 'PASS').length;
  const failed = checks.filter(c => c.status === 'FAIL').length;
  const avgResponseTime = checks
    .filter(c => c.responseTime)
    .reduce((sum, c) => sum + (c.responseTime || 0), 0) / checks.length;
  
  console.log('📊 Live Deployment Summary');
  console.log('==========================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️ Average Response Time: ${Math.round(avgResponseTime)}ms`);
  
  if (failed === 0) {
    console.log('\n🎉 All endpoints are accessible! Deployment is live and working.');
  } else {
    console.log('\n⚠️ Some endpoints are not accessible. Check deployment status.');
    
    const failedChecks = checks.filter(c => c.status === 'FAIL');
    console.log('\nFailed endpoints:');
    failedChecks.forEach(check => {
      console.log(`• ${check.url}: ${check.error}`);
    });
  }
}

async function main() {
  console.log('🔍 AqlHR Live Deployment Checker');
  console.log('=================================\n');
  
  console.log('📝 Note: Update DEPLOYMENT_URLS with your actual URLs\n');
  
  try {
    const checks = await checkAllEndpoints();
    printSummary(checks);
  } catch (error) {
    console.error('❌ Error during deployment check:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { checkAllEndpoints };