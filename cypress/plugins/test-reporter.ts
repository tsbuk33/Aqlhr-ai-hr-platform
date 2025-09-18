/**
 * Test Reporter Plugin
 * Generates comprehensive test reports for bilingual testing
 */

import * as fs from 'fs';
import * as path from 'path';

export interface TestResult {
  route: string;
  language: string;
  status: 'pass' | 'fail' | 'partial';
  issues: string[];
  loadTime: number;
  timestamp?: number;
}

export interface TestReport {
  summary: {
    totalRoutes: number;
    totalTests: number;
    passed: number;
    failed: number;
    partial: number;
    successRate: number;
    avgLoadTime: number;
  };
  routeResults: TestResult[];
  languageBreakdown: {
    english: { total: number; passed: number; failed: number; partial: number };
    arabic: { total: number; passed: number; failed: number; partial: number };
  };
  criticalIssues: string[];
  recommendations: string[];
  timestamp: number;
}

export const generateTestReport = (results: TestResult[]): TestReport => {
  const timestamp = Date.now();
  
  // Add timestamps to results
  const timestampedResults = results.map(result => ({
    ...result,
    timestamp
  }));

  // Calculate summary statistics
  const totalTests = results.length;
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const partial = results.filter(r => r.status === 'partial').length;
  const successRate = totalTests > 0 ? (passed / totalTests) * 100 : 0;
  const avgLoadTime = results.length > 0 
    ? results.reduce((sum, r) => sum + r.loadTime, 0) / results.length 
    : 0;

  // Language breakdown
  const englishResults = results.filter(r => r.language === 'en');
  const arabicResults = results.filter(r => r.language === 'ar');

  const languageBreakdown = {
    english: {
      total: englishResults.length,
      passed: englishResults.filter(r => r.status === 'pass').length,
      failed: englishResults.filter(r => r.status === 'fail').length,
      partial: englishResults.filter(r => r.status === 'partial').length
    },
    arabic: {
      total: arabicResults.length,
      passed: arabicResults.filter(r => r.status === 'pass').length,
      failed: arabicResults.filter(r => r.status === 'fail').length,
      partial: arabicResults.filter(r => r.status === 'partial').length
    }
  };

  // Identify critical issues
  const criticalIssues: string[] = [];
  const failedRoutes = results.filter(r => r.status === 'fail');
  
  if (failedRoutes.length > 0) {
    criticalIssues.push(`${failedRoutes.length} routes completely failed to load`);
  }

  const arabicFailures = arabicResults.filter(r => r.status === 'fail');
  if (arabicFailures.length > englishResults.filter(r => r.status === 'fail').length) {
    criticalIssues.push('Arabic routes have higher failure rate than English routes');
  }

  const slowRoutes = results.filter(r => r.loadTime > 5000);
  if (slowRoutes.length > 0) {
    criticalIssues.push(`${slowRoutes.length} routes have slow load times (>5s)`);
  }

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (successRate < 95) {
    recommendations.push('Target 95%+ success rate for production readiness');
  }
  
  if (arabicResults.filter(r => r.status === 'fail').length > 0) {
    recommendations.push('Focus on Arabic route stability and RTL layout issues');
  }
  
  if (avgLoadTime > 3000) {
    recommendations.push('Optimize page load performance, target <3s average load time');
  }

  const commonIssues = getAllIssues(results);
  const frequentIssues = getFrequentIssues(commonIssues);
  if (frequentIssues.length > 0) {
    recommendations.push(`Address frequent issues: ${frequentIssues.join(', ')}`);
  }

  return {
    summary: {
      totalRoutes: new Set(results.map(r => r.route)).size,
      totalTests,
      passed,
      failed,
      partial,
      successRate: Math.round(successRate * 100) / 100,
      avgLoadTime: Math.round(avgLoadTime)
    },
    routeResults: timestampedResults,
    languageBreakdown,
    criticalIssues,
    recommendations,
    timestamp
  };
};

const getAllIssues = (results: TestResult[]): string[] => {
  return results.flatMap(result => result.issues);
};

const getFrequentIssues = (issues: string[]): string[] => {
  const issueCounts: Record<string, number> = {};
  issues.forEach(issue => {
    issueCounts[issue] = (issueCounts[issue] || 0) + 1;
  });
  
  return Object.entries(issueCounts)
    .filter(([, count]) => count >= 3) // Issues appearing 3+ times
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) // Top 5 frequent issues
    .map(([issue]) => issue);
};

export const saveTestReport = (report: TestReport, filename?: string): void => {
  const reportsDir = path.join(process.cwd(), 'cypress', 'reports');
  
  // Ensure reports directory exists
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportFilename = filename || `bilingual-test-report-${new Date().toISOString().split('T')[0]}.json`;
  const reportPath = path.join(reportsDir, reportFilename);
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Test report saved to: ${reportPath}`);
};

export const generateHtmlReport = (report: TestReport): string => {
  const { summary, routeResults, languageBreakdown, criticalIssues, recommendations } = report;
  
  const html = `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AqlHR Bilingual Test Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #2563eb; margin-bottom: 30px; }
    h2 { color: #1e40af; margin-top: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .metric { background: #f8fafc; padding: 20px; border-radius: 6px; text-align: center; border-left: 4px solid #2563eb; }
    .metric-value { font-size: 2rem; font-weight: bold; color: #1e40af; }
    .metric-label { color: #6b7280; margin-top: 5px; }
    .status-pass { color: #059669; }
    .status-fail { color: #dc2626; }
    .status-partial { color: #d97706; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f8fafc; font-weight: 600; color: #374151; }
    .route-table { max-height: 400px; overflow-y: auto; }
    .issue-list { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; }
    .recommendation-list { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 15px; }
    .timestamp { color: #6b7280; font-size: 0.875rem; }
    .language-breakdown { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .lang-card { background: #f8fafc; padding: 20px; border-radius: 6px; }
    .progress-bar { background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden; margin-top: 10px; }
    .progress-fill { height: 100%; transition: width 0.3s ease; }
    .progress-pass { background: #059669; }
    .progress-fail { background: #dc2626; }
    .progress-partial { background: #d97706; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧪 AqlHR Comprehensive Bilingual Test Report</h1>
    <p class="timestamp">Generated: ${new Date(report.timestamp).toLocaleString()}</p>
    
    <h2>📊 Test Summary</h2>
    <div class="summary">
      <div class="metric">
        <div class="metric-value">${summary.totalRoutes}</div>
        <div class="metric-label">Total Routes</div>
      </div>
      <div class="metric">
        <div class="metric-value">${summary.totalTests}</div>
        <div class="metric-label">Total Tests</div>
      </div>
      <div class="metric">
        <div class="metric-value status-pass">${summary.passed}</div>
        <div class="metric-label">Passed</div>
      </div>
      <div class="metric">
        <div class="metric-value status-fail">${summary.failed}</div>
        <div class="metric-label">Failed</div>
      </div>
      <div class="metric">
        <div class="metric-value status-partial">${summary.partial}</div>
        <div class="metric-label">Partial</div>
      </div>
      <div class="metric">
        <div class="metric-value">${summary.successRate}%</div>
        <div class="metric-label">Success Rate</div>
      </div>
    </div>

    <h2>🌐 Language Breakdown</h2>
    <div class="language-breakdown">
      <div class="lang-card">
        <h3>🇺🇸 English (LTR)</h3>
        <p><strong>${languageBreakdown.english.total}</strong> total tests</p>
        <div class="progress-bar">
          <div class="progress-fill progress-pass" style="width: ${(languageBreakdown.english.passed / languageBreakdown.english.total) * 100}%"></div>
        </div>
        <p>✅ ${languageBreakdown.english.passed} passed | ❌ ${languageBreakdown.english.failed} failed | ⚠️ ${languageBreakdown.english.partial} partial</p>
      </div>
      <div class="lang-card">
        <h3>🇸🇦 Arabic (RTL)</h3>
        <p><strong>${languageBreakdown.arabic.total}</strong> total tests</p>
        <div class="progress-bar">
          <div class="progress-fill progress-pass" style="width: ${(languageBreakdown.arabic.passed / languageBreakdown.arabic.total) * 100}%"></div>
        </div>
        <p>✅ ${languageBreakdown.arabic.passed} passed | ❌ ${languageBreakdown.arabic.failed} failed | ⚠️ ${languageBreakdown.arabic.partial} partial</p>
      </div>
    </div>

    ${criticalIssues.length > 0 ? `
    <h2>🚨 Critical Issues</h2>
    <div class="issue-list">
      <ul>
        ${criticalIssues.map(issue => `<li>${issue}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    ${recommendations.length > 0 ? `
    <h2>💡 Recommendations</h2>
    <div class="recommendation-list">
      <ul>
        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <h2>📋 Detailed Results</h2>
    <div class="route-table">
      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Language</th>
            <th>Status</th>
            <th>Load Time (ms)</th>
            <th>Issues</th>
          </tr>
        </thead>
        <tbody>
          ${routeResults.map(result => `
            <tr>
              <td><code>/${result.language}/${result.route}</code></td>
              <td>${result.language === 'ar' ? '🇸🇦 Arabic' : '🇺🇸 English'}</td>
              <td class="status-${result.status}">
                ${result.status === 'pass' ? '✅ Pass' : result.status === 'fail' ? '❌ Fail' : '⚠️ Partial'}
              </td>
              <td>${result.loadTime}</td>
              <td>${result.issues.join(', ') || 'None'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;

  return html;
};

export const saveHtmlReport = (report: TestReport, filename?: string): void => {
  const reportsDir = path.join(process.cwd(), 'cypress', 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const htmlFilename = filename || `bilingual-test-report-${new Date().toISOString().split('T')[0]}.html`;
  const htmlPath = path.join(reportsDir, htmlFilename);
  
  const htmlContent = generateHtmlReport(report);
  fs.writeFileSync(htmlPath, htmlContent);
  
  console.log(`HTML report saved to: ${htmlPath}`);
};

// Task for Cypress
export const setupReportingTasks = (on: Cypress.PluginEvents) => {
  on('task', {
    generateTestReport(results: TestResult[]) {
      const report = generateTestReport(results);
      saveTestReport(report);
      saveHtmlReport(report);
      return report;
    }
  });
};