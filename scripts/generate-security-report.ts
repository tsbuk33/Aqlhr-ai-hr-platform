#!/usr/bin/env tsx

/**
 * Security Report Generator
 * Consolidates all security audit results into comprehensive reports
 */

import fs from 'fs';
import chalk from 'chalk';

interface SecuritySummary {
  timestamp: string;
  overallScore: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  rlsPolicyCoverage: number;
  authTestsPassed: boolean;
  isolationTestsPassed: boolean;
  securityStatus: 'CRITICAL' | 'HIGH_RISK' | 'MEDIUM_RISK' | 'LOW_RISK' | 'SECURE';
  readyForProduction: boolean;
}

class SecurityReportGenerator {
  
  async generateComprehensiveReport(): Promise<SecuritySummary> {
    console.log(chalk.blue('📊 Generating comprehensive security report...'));

    // Initialize with current known issues
    const summary: SecuritySummary = {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      criticalIssues: 60, // Known RLS policy violations
      highIssues: 1,     // Missing authentication system
      mediumIssues: 3,   // Input validation, XSS risks, etc.
      rlsPolicyCoverage: 0, // Will be updated from audit
      authTestsPassed: false, // No auth system yet
      isolationTestsPassed: false, // Depends on RLS policies
      securityStatus: 'CRITICAL',
      readyForProduction: false
    };

    // Try to read existing audit results
    try {
      if (fs.existsSync('rls-audit-results.json')) {
        const rlsResults = JSON.parse(fs.readFileSync('rls-audit-results.json', 'utf8'));
        summary.rlsPolicyCoverage = rlsResults.coverage_percentage || 0;
        summary.criticalIssues = rlsResults.tables_missing_policies || 60;
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️  Could not read existing RLS audit results'));
    }

    // Calculate overall security score
    summary.overallScore = this.calculateSecurityScore(summary);
    
    // Determine security status
    summary.securityStatus = this.determineSecurityStatus(summary);
    
    // Check production readiness
    summary.readyForProduction = summary.criticalIssues === 0 && 
                                summary.rlsPolicyCoverage === 100 && 
                                summary.authTestsPassed;

    // Save summary for CI/CD consumption
    fs.writeFileSync('security-summary.json', JSON.stringify(summary, null, 2));

    this.printSecuritySummary(summary);
    
    return summary;
  }

  private calculateSecurityScore(summary: SecuritySummary): number {
    let score = 100;
    
    // Deduct points for issues
    score -= summary.criticalIssues * 10; // 10 points per critical issue
    score -= summary.highIssues * 5;      // 5 points per high issue  
    score -= summary.mediumIssues * 2;    // 2 points per medium issue
    
    // Add points for good coverage
    score += (summary.rlsPolicyCoverage / 100) * 20; // Up to 20 points for full RLS coverage
    
    if (summary.authTestsPassed) score += 15;
    if (summary.isolationTestsPassed) score += 15;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private determineSecurityStatus(summary: SecuritySummary): SecuritySummary['securityStatus'] {
    if (summary.criticalIssues > 10 || summary.rlsPolicyCoverage < 50) {
      return 'CRITICAL';
    } else if (summary.criticalIssues > 0 || summary.rlsPolicyCoverage < 80) {
      return 'HIGH_RISK';
    } else if (summary.highIssues > 0 || summary.rlsPolicyCoverage < 100) {
      return 'MEDIUM_RISK';
    } else if (summary.mediumIssues > 0) {
      return 'LOW_RISK';
    } else {
      return 'SECURE';
    }
  }

  private printSecuritySummary(summary: SecuritySummary): void {
    console.log('\n' + chalk.bold('🔒 COMPREHENSIVE SECURITY REPORT'));
    console.log('=' .repeat(50));
    
    const statusColor = summary.securityStatus === 'CRITICAL' ? chalk.red :
                       summary.securityStatus === 'HIGH_RISK' ? chalk.red :
                       summary.securityStatus === 'MEDIUM_RISK' ? chalk.yellow :
                       summary.securityStatus === 'LOW_RISK' ? chalk.yellow :
                       chalk.green;
    
    console.log(`Overall Security Score: ${chalk.bold(summary.overallScore + '/100')}`);
    console.log(`Security Status: ${statusColor.bold(summary.securityStatus)}`);
    console.log(`Production Ready: ${summary.readyForProduction ? chalk.green('✅ YES') : chalk.red('❌ NO')}`);
    
    console.log('\n' + chalk.bold('📊 Issue Breakdown:'));
    console.log(`Critical Issues: ${chalk.red(summary.criticalIssues)}`);
    console.log(`High Risk Issues: ${chalk.yellow(summary.highIssues)}`);
    console.log(`Medium Risk Issues: ${chalk.blue(summary.mediumIssues)}`);
    
    console.log('\n' + chalk.bold('🛡️ Security Coverage:'));
    console.log(`RLS Policy Coverage: ${chalk.blue(summary.rlsPolicyCoverage + '%')}`);
    console.log(`Authentication Tests: ${summary.authTestsPassed ? chalk.green('✅') : chalk.red('❌')}`);
    console.log(`Isolation Tests: ${summary.isolationTestsPassed ? chalk.green('✅') : chalk.red('❌')}`);

    if (!summary.readyForProduction) {
      console.log('\n' + chalk.red.bold('🚨 PRODUCTION DEPLOYMENT BLOCKED'));
      console.log(chalk.red('The following critical issues must be resolved:'));
      
      if (summary.criticalIssues > 0) {
        console.log(chalk.red(`  • ${summary.criticalIssues} critical RLS policy violations`));
      }
      if (summary.rlsPolicyCoverage < 100) {
        console.log(chalk.red(`  • RLS policy coverage below 100% (currently ${summary.rlsPolicyCoverage}%)`));
      }
      if (!summary.authTestsPassed) {
        console.log(chalk.red('  • Authentication system not implemented'));
      }
      
      console.log('\n' + chalk.blue('📋 Remediation Plan:'));
      console.log(chalk.blue('  1. Follow Phase 1 in SECURITY_AUDIT_REPORT.md'));
      console.log(chalk.blue('  2. Implement missing RLS policies'));
      console.log(chalk.blue('  3. Add Supabase authentication system'));
      console.log(chalk.blue('  4. Re-run security validation'));
    } else {
      console.log('\n' + chalk.green.bold('🚀 READY FOR PRODUCTION DEPLOYMENT'));
      console.log(chalk.green('All critical security requirements have been met!'));
    }

    console.log('\n');
  }
}

async function main() {
  try {
    const generator = new SecurityReportGenerator();
    const summary = await generator.generateComprehensiveReport();
    
    // Exit with appropriate code for CI/CD
    process.exit(summary.readyForProduction ? 0 : 1);
    
  } catch (error) {
    console.error(chalk.red('💥 Security report generation failed:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { SecurityReportGenerator };