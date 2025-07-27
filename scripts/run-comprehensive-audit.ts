#!/usr/bin/env tsx

/**
 * AqlHR Comprehensive Audit Runner
 * Orchestrates all audit tools and generates consolidated reports
 */

import chalk from 'chalk';
import { promises as fs } from 'fs';
import { AIInventoryAuditor } from './audit-ai-inventory';
import { ReliabilityVerifier } from './verify-uptime';
import { EdgeFunctionLocaleAuditor } from './audit-edge-locale';

interface ComprehensiveAuditResults {
  timestamp: string;
  aiInventory: {
    passed: boolean;
    score: number;
    details: any;
  };
  reliability: {
    passed: boolean;
    score: number;
    details: any;
  };
  localeCompliance: {
    passed: boolean;
    score: number;
    details: any;
  };
  overallScore: number;
  overallPassed: boolean;
  recommendations: string[];
}

class ComprehensiveAuditor {
  async runAllAudits(): Promise<ComprehensiveAuditResults> {
    console.log(chalk.blue.bold('🚀 AqlHR Comprehensive Audit Suite Starting...\n'));

    const results: ComprehensiveAuditResults = {
      timestamp: new Date().toISOString(),
      aiInventory: { passed: false, score: 0, details: null },
      reliability: { passed: false, score: 0, details: null },
      localeCompliance: { passed: false, score: 0, details: null },
      overallScore: 0,
      overallPassed: false,
      recommendations: []
    };

    // Run AI Inventory Audit
    console.log(chalk.yellow('🤖 Running AI Inventory Audit...'));
    try {
      const aiAuditor = new AIInventoryAuditor();
      const aiPassed = await aiAuditor.runAudit();
      results.aiInventory.passed = aiPassed;
      results.aiInventory.score = aiPassed ? 100 : 60; // Binary for now, could be more granular
      console.log(chalk.green('✓ AI Inventory Audit completed\n'));
    } catch (error) {
      console.error(chalk.red('❌ AI Inventory Audit failed:'), error);
      results.recommendations.push('Fix AI inventory audit errors');
    }

    // Run Reliability Verification
    console.log(chalk.yellow('📊 Running Reliability Verification...'));
    try {
      const reliabilityVerifier = new ReliabilityVerifier();
      const reliabilityPassed = await reliabilityVerifier.runVerification();
      results.reliability.passed = reliabilityPassed;
      results.reliability.score = reliabilityPassed ? 100 : 75; // Assume partial compliance
      console.log(chalk.green('✓ Reliability Verification completed\n'));
    } catch (error) {
      console.error(chalk.red('❌ Reliability Verification failed:'), error);
      results.recommendations.push('Address reliability monitoring issues');
    }

    // Run Locale Compliance Audit
    console.log(chalk.yellow('🌍 Running Locale Compliance Audit...'));
    try {
      const localeAuditor = new EdgeFunctionLocaleAuditor();
      const localePassed = await localeAuditor.runAudit();
      results.localeCompliance.passed = localePassed;
      results.localeCompliance.score = localePassed ? 100 : 80; // Assume partial compliance
      console.log(chalk.green('✓ Locale Compliance Audit completed\n'));
    } catch (error) {
      console.error(chalk.red('❌ Locale Compliance Audit failed:'), error);
      results.recommendations.push('Fix locale compliance issues');
    }

    // Calculate overall scores
    const totalScore = results.aiInventory.score + results.reliability.score + results.localeCompliance.score;
    results.overallScore = totalScore / 3;
    results.overallPassed = results.aiInventory.passed && results.reliability.passed && results.localeCompliance.passed;

    // Generate recommendations
    if (!results.overallPassed) {
      if (!results.aiInventory.passed) {
        results.recommendations.push('Review and update AI inventory manifest');
      }
      if (!results.reliability.passed) {
        results.recommendations.push('Investigate and resolve performance issues');
      }
      if (!results.localeCompliance.passed) {
        results.recommendations.push('Add locale handling to non-compliant functions');
      }
    }

    return results;
  }

  async generateConsolidatedReport(results: ComprehensiveAuditResults): Promise<void> {
    const report = `# AqlHR Comprehensive Audit Report
Generated: ${results.timestamp}

## 🎯 Executive Summary
- **Overall Status**: ${results.overallPassed ? '✅ ALL CHECKS PASSED' : '❌ ISSUES DETECTED'}
- **Overall Score**: ${results.overallScore.toFixed(1)}/100
- **Timestamp**: ${results.timestamp}

## 📊 Audit Results

### 🤖 AI Inventory Audit
- **Status**: ${results.aiInventory.passed ? '✅ PASSED' : '❌ FAILED'}
- **Score**: ${results.aiInventory.score}/100
- **Details**: [AI Capabilities Audit Report](./AI_CAPABILITIES_AUDIT.md)

### 📈 Reliability Verification  
- **Status**: ${results.reliability.passed ? '✅ PASSED' : '❌ FAILED'}
- **Score**: ${results.reliability.score}/100
- **Details**: [Reliability Report](./RELIABILITY_REPORT.md)

### 🌍 Locale Compliance Audit
- **Status**: ${results.localeCompliance.passed ? '✅ PASSED' : '❌ FAILED'}
- **Score**: ${results.localeCompliance.score}/100  
- **Details**: [Edge Function Locale Audit](./EDGE_FUNCTION_LOCALE_AUDIT.md)

## 🔧 Recommendations

${results.recommendations.length > 0 ? 
  results.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n') :
  '✅ No immediate actions required - all audits passed!'
}

## 📋 Action Items

${!results.overallPassed ? `
### High Priority
${!results.aiInventory.passed ? '- [ ] Fix AI inventory inconsistencies' : ''}
${!results.reliability.passed ? '- [ ] Address performance/reliability issues' : ''}
${!results.localeCompliance.passed ? '- [ ] Implement locale handling in edge functions' : ''}

### Medium Priority
- [ ] Review audit thresholds and targets
- [ ] Enhance monitoring and alerting
- [ ] Update documentation and runbooks

### Low Priority  
- [ ] Optimize audit tool performance
- [ ] Add additional audit categories
- [ ] Implement automated remediation
` : `
### Maintenance Tasks
- [ ] Monitor metrics for drift
- [ ] Review audit frequency settings
- [ ] Update audit tool dependencies
- [ ] Consider additional audit categories
`}

## 🎯 Next Phase Readiness

${results.overallPassed ? 
  '✅ **Ready for Next Phase Development**\n\nAll core systems are audited and compliant. You can proceed with confidence to implement advanced features like Voice AI, Advanced OCR, or Custom ML Models.' :
  '⚠️ **Address Issues Before Next Phase**\n\nResolve the identified issues to ensure a solid foundation before implementing new features.'
}

## 📞 Support & Escalation

- **Critical Issues**: Contact dev-team immediately
- **Non-Critical Issues**: Create GitHub issue
- **Questions**: Reference individual audit reports for details

---

## 📚 Related Documentation

- [AI Inventory Manifest](../ai-inventory.json)
- [Reliability Targets & SLAs](./RELIABILITY_REPORT.md)
- [Locale Compliance Standards](./EDGE_FUNCTION_LOCALE_AUDIT.md)
- [Audit Tool Documentation](../scripts/README.md)

---
*Generated by AqlHR Comprehensive Audit Suite*
*Next scheduled audit: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()}*
`;

    await fs.writeFile('docs/COMPREHENSIVE_AUDIT_REPORT.md', report);
    console.log(chalk.blue('📄 Generated consolidated report: docs/COMPREHENSIVE_AUDIT_REPORT.md'));
  }

  async runComprehensiveAudit(): Promise<boolean> {
    const results = await this.runAllAudits();
    await this.generateConsolidatedReport(results);

    // Final summary
    console.log(chalk.blue.bold('🏁 Comprehensive Audit Complete!\n'));
    console.log(`Overall Status: ${results.overallPassed ? chalk.green('PASSED') : chalk.red('FAILED')}`);
    console.log(`Overall Score: ${results.overallScore.toFixed(1)}/100`);
    console.log(`AI Inventory: ${results.aiInventory.passed ? chalk.green('✓') : chalk.red('✗')}`);
    console.log(`Reliability: ${results.reliability.passed ? chalk.green('✓') : chalk.red('✗')}`);
    console.log(`Locale Compliance: ${results.localeCompliance.passed ? chalk.green('✓') : chalk.red('✗')}`);

    if (results.recommendations.length > 0) {
      console.log(chalk.yellow('\n📋 Action Items:'));
      results.recommendations.forEach((rec, i) => {
        console.log(chalk.yellow(`  ${i + 1}. ${rec}`));
      });
    }

    if (results.overallPassed) {
      console.log(chalk.green.bold('\n🎉 All audits passed! System is ready for next phase development.'));
    } else {
      console.log(chalk.red.bold('\n⚠️ Some audits failed. Address issues before proceeding.'));
    }

    return results.overallPassed;
  }
}

// CLI execution
if (require.main === module) {
  const auditor = new ComprehensiveAuditor();
  
  auditor.runComprehensiveAudit()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error(chalk.red('Comprehensive audit failed:'), error);
      process.exit(1);
    });
}

export { ComprehensiveAuditor };