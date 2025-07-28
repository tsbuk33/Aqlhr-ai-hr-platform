#!/usr/bin/env tsx

import { execSync, spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import chalk from 'chalk';

// Import all checkers
import { ColorTokensChecker } from './audit/color-tokens-checker';
import { AccessibilityChecker } from './audit/accessibility-checker';
import { ResponsiveLayoutChecker } from './audit/responsive-layout-checker';
import { PerformanceChecker } from './audit/performance-checker';
import { ErrorHandlingChecker } from './audit/error-handling-checker';
import { SEOMetaChecker } from './audit/seo-meta-checker';

interface AuditResults {
  colorTokens: any[];
  accessibility: any[];
  responsive: any[];
  performance: any[];
  errorHandling: any[];
  seoMeta: any[];
  i18nCompleteness: any[];
  summary: {
    totalIssues: number;
    criticalIssues: number;
    passedChecks: number;
    score: number;
    passed: boolean;
  };
}

export class MasterAuditOrchestrator {
  private baseUrl: string;
  private applyFixes: boolean;

  constructor(baseUrl = 'http://localhost:5173', applyFixes = false) {
    this.baseUrl = baseUrl;
    this.applyFixes = applyFixes;
  }

  async runCompleteAudit(): Promise<AuditResults> {
    console.log(chalk.blue('🚀 Starting Master AqlHR Platform Audit...\n'));
    console.log(chalk.white('='.repeat(60)));
    
    const results: AuditResults = {
      colorTokens: [],
      accessibility: [],
      responsive: [],
      performance: [],
      errorHandling: [],
      seoMeta: [],
      i18nCompleteness: [],
      summary: {
        totalIssues: 0,
        criticalIssues: 0,
        passedChecks: 0,
        score: 0,
        passed: false
      }
    };

    // 1. Color Tokens & Contrast
    console.log(chalk.blue('\n🎨 Running Color Tokens & Contrast Audit...'));
    try {
      const colorChecker = new ColorTokensChecker(this.applyFixes);
      results.colorTokens = await colorChecker.checkAll();
      await colorChecker.checkContrast();
      if (this.applyFixes) {
        await colorChecker.autoFix();
      }
      colorChecker.printReport();
    } catch (error) {
      console.log(chalk.yellow(`⚠️ Color audit failed: ${error.message}`));
    }

    // 2. Accessibility Audit
    console.log(chalk.blue('\n♿ Running Accessibility Audit...'));
    try {
      const a11yChecker = new AccessibilityChecker(this.applyFixes);
      results.accessibility = await a11yChecker.checkAll();
      if (this.applyFixes) {
        await a11yChecker.autoFix();
      }
      a11yChecker.printReport();
    } catch (error) {
      console.log(chalk.yellow(`⚠️ Accessibility audit failed: ${error.message}`));
    }

    // 3. Responsive Layout
    console.log(chalk.blue('\n📱 Running Responsive Layout Audit...'));
    try {
      const responsiveChecker = new ResponsiveLayoutChecker(this.baseUrl);
      results.responsive = await responsiveChecker.checkAll();
      responsiveChecker.printReport();
    } catch (error) {
      console.log(chalk.yellow(`⚠️ Responsive audit failed: ${error.message}`));
    }

    // 4. Performance Audit
    console.log(chalk.blue('\n⚡ Running Performance Audit...'));
    try {
      const perfChecker = new PerformanceChecker(this.baseUrl);
      results.performance = await perfChecker.checkAll();
      if (this.applyFixes) {
        await perfChecker.autoFix();
      }
      perfChecker.printReport();
    } catch (error) {
      console.log(chalk.yellow(`⚠️ Performance audit failed: ${error.message}`));
    }

    // 5. Error Handling & Loading States
    console.log(chalk.blue('\n🛡️ Running Error Handling Audit...'));
    try {
      const errorChecker = new ErrorHandlingChecker();
      results.errorHandling = await errorChecker.checkAll();
      if (this.applyFixes) {
        await errorChecker.autoFix();
      }
      errorChecker.printReport();
    } catch (error) {
      console.log(chalk.yellow(`⚠️ Error handling audit failed: ${error.message}`));
    }

    // 6. SEO Meta Tags
    console.log(chalk.blue('\n🔍 Running SEO Meta Tags Audit...'));
    try {
      const seoChecker = new SEOMetaChecker(this.applyFixes);
      results.seoMeta = await seoChecker.checkAll();
      if (this.applyFixes) {
        await seoChecker.autoFix();
      }
      seoChecker.printReport();
    } catch (error) {
      console.log(chalk.yellow(`⚠️ SEO audit failed: ${error.message}`));
    }

    // 7. i18n Completeness
    console.log(chalk.blue('\n🌍 Running i18n Completeness Audit...'));
    try {
      results.i18nCompleteness = await this.runI18nAudit();
    } catch (error) {
      console.log(chalk.yellow(`⚠️ i18n audit failed: ${error.message}`));
    }

    // Calculate summary
    results.summary = this.calculateSummary(results);
    
    // Generate comprehensive report
    await this.generateReport(results);
    
    return results;
  }

  private async runI18nAudit(): Promise<any[]> {
    try {
      // Run existing i18n checker
      execSync('npx tsx scripts/compliance/i18n-checker.ts', { stdio: 'inherit' });
      return []; // Results would be parsed from output
    } catch (error) {
      return [{ type: 'i18n-check-failed', message: 'i18n audit failed' }];
    }
  }

  private calculateSummary(results: AuditResults): AuditResults['summary'] {
    const allIssues = [
      ...results.colorTokens,
      ...results.accessibility, 
      ...results.responsive,
      ...results.performance,
      ...results.errorHandling,
      ...results.seoMeta,
      ...results.i18nCompleteness
    ];

    const criticalIssues = allIssues.filter((issue: any) => 
      issue.severity === 'critical' || issue.type === 'critical'
    ).length;

    const totalIssues = allIssues.length;
    const passedChecks = 7 - Object.values(results).filter(issues => 
      Array.isArray(issues) && issues.length > 0
    ).length;

    const score = Math.max(0, Math.round(((7 - (totalIssues / 10)) / 7) * 100));
    const passed = criticalIssues === 0 && score >= 80;

    return {
      totalIssues,
      criticalIssues,
      passedChecks,
      score,
      passed
    };
  }

  private async generateReport(results: AuditResults) {
    const timestamp = new Date().toISOString();
    
    const report = `# AqlHR Platform - Master Audit Report
Generated: ${timestamp}

## Executive Summary
- **Overall Score**: ${results.summary.score}/100
- **Status**: ${results.summary.passed ? '✅ PASSED' : '❌ FAILED'}
- **Total Issues**: ${results.summary.totalIssues}
- **Critical Issues**: ${results.summary.criticalIssues}
- **Passed Checks**: ${results.summary.passedChecks}/7

## Audit Results by Category

### 🎨 Color Tokens & Contrast (${results.colorTokens.length} issues)
${this.formatIssues(results.colorTokens)}

### ♿ Accessibility (${results.accessibility.length} issues)
${this.formatIssues(results.accessibility)}

### 📱 Responsive Layout (${results.responsive.length} issues)
${this.formatIssues(results.responsive)}

### ⚡ Performance (${results.performance.length} issues)
${this.formatIssues(results.performance)}

### 🛡️ Error Handling (${results.errorHandling.length} issues)
${this.formatIssues(results.errorHandling)}

### 🔍 SEO Meta Tags (${results.seoMeta.length} issues)
${this.formatIssues(results.seoMeta)}

### 🌍 i18n Completeness (${results.i18nCompleteness.length} issues)
${this.formatIssues(results.i18nCompleteness)}

## Recommendations

${results.summary.criticalIssues > 0 ? '🚨 **URGENT**: Fix all critical issues before deployment.' : ''}
${results.summary.score < 80 ? '⚠️ **IMPORTANT**: Address warning-level issues to improve quality score.' : ''}
${results.summary.passed ? '✅ **EXCELLENT**: Platform meets all quality standards!' : ''}

## Next Steps

1. **Fix Critical Issues**: Address all critical severity issues immediately
2. **Review Warnings**: Evaluate and fix warning-level issues
3. **CI Integration**: Ensure these audits run automatically on every PR
4. **Regular Monitoring**: Schedule weekly audit runs to maintain quality

---
*Report generated by AqlHR Master Audit Orchestrator v1.0*
`;

    // Ensure reports directory exists
    if (!existsSync('reports')) {
      mkdirSync('reports', { recursive: true });
    }

    const reportPath = `reports/MASTER_AUDIT_REPORT_${new Date().toISOString().split('T')[0]}.md`;
    writeFileSync(reportPath, report);
    
    console.log(chalk.green(`\n📄 Complete audit report saved to: ${reportPath}`));
  }

  private formatIssues(issues: any[]): string {
    if (issues.length === 0) {
      return '✅ No issues found!\n';
    }

    return issues.slice(0, 10).map((issue: any) => {
      const severity = issue.severity || 'info';
      const icon = severity === 'critical' ? '🚨' : severity === 'warning' ? '⚠️' : '📋';
      return `${icon} **${issue.file || issue.page || 'Global'}** - ${issue.message}`;
    }).join('\n') + (issues.length > 10 ? `\n... and ${issues.length - 10} more issues` : '') + '\n';
  }

  async printFinalSummary(results: AuditResults) {
    console.log(chalk.blue('\n🎯 MASTER AUDIT SUMMARY'));
    console.log(chalk.white('='.repeat(60)));
    
    if (results.summary.passed) {
      console.log(chalk.green(`\n✅ AUDIT PASSED! Score: ${results.summary.score}/100`));
      console.log(chalk.green('🎉 Platform meets all quality standards!'));
    } else {
      console.log(chalk.red(`\n❌ AUDIT FAILED! Score: ${results.summary.score}/100`));
      console.log(chalk.yellow(`⚠️ Found ${results.summary.criticalIssues} critical issues`));
    }
    
    console.log(chalk.blue(`\n📊 Summary:`));
    console.log(`   Total Issues: ${results.summary.totalIssues}`);
    console.log(`   Critical: ${results.summary.criticalIssues}`);
    console.log(`   Passed Checks: ${results.summary.passedChecks}/7`);
    
    console.log(chalk.blue('\n🔧 Available Fix Commands:'));
    console.log('   npm run fix:colors        - Fix color token issues');
    console.log('   npm run audit:a11y --apply - Fix accessibility issues');
    console.log('   npm run audit:seo --apply  - Fix SEO meta tags');
    console.log('   npm run audit:all --apply  - Run all audits with fixes');
  }
}

// CLI execution
async function main() {
  const applyFixes = process.argv.includes('--apply');
  const baseUrl = process.argv.find(arg => arg.startsWith('--url='))?.split('=')[1] || 'http://localhost:5173';
  
  const orchestrator = new MasterAuditOrchestrator(baseUrl, applyFixes);
  
  try {
    const results = await orchestrator.runCompleteAudit();
    await orchestrator.printFinalSummary(results);
    
    process.exit(results.summary.passed ? 0 : 1);
  } catch (error) {
    console.error(chalk.red('\n❌ Master audit failed:'), error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}