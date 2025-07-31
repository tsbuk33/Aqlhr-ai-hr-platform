#!/usr/bin/env tsx

/**
 * Quick Security Validation Script
 * Runs key security tests locally to validate our security infrastructure
 */

import { runCompanyIsolationTests } from './security-tests/company-isolation.test.js';
import { RLSPolicyAuditor } from './audit-rls-policies.js';
import chalk from 'chalk';

async function runSecurityValidation() {
  console.log(chalk.blue.bold('🔒 AqlHR Security Validation Suite'));
  console.log(chalk.blue('=====================================\n'));

  let allTestsPassed = true;

  try {
    // 1. RLS Policy Audit
    console.log(chalk.yellow('📊 Step 1: RLS Policy Audit'));
    console.log(chalk.gray('Checking database security policies...\n'));
    
    const auditor = new RLSPolicyAuditor();
    const rlsResult = await auditor.auditAllTables();
    auditor.printSummary(rlsResult);
    
    if (rlsResult.critical_tables_unprotected.length > 0) {
      allTestsPassed = false;
    }

    // 2. Company Isolation Tests  
    console.log(chalk.yellow('\n🏢 Step 2: Company Data Isolation Tests'));
    console.log(chalk.gray('Testing multi-tenant security...\n'));
    
    const isolationPassed = await runCompanyIsolationTests();
    if (!isolationPassed) {
      allTestsPassed = false;
    }

    // 3. Security Report Summary
    console.log(chalk.yellow('\n📋 Step 3: Security Summary'));
    console.log(chalk.gray('Generating final security status...\n'));

    const criticalIssues = rlsResult.critical_tables_unprotected.length;
    const rlsCoverage = rlsResult.coverage_percentage;

    console.log('🔒 SECURITY STATUS SUMMARY:');
    console.log('===========================');
    console.log(`RLS Policy Coverage: ${rlsCoverage}%`);
    console.log(`Critical Tables Unprotected: ${criticalIssues}`);
    console.log(`Company Isolation Tests: ${isolationPassed ? '✅ PASSED' : '❌ FAILED'}`);

    if (allTestsPassed && rlsCoverage === 100 && criticalIssues === 0) {
      console.log(chalk.green.bold('\n✅ ALL SECURITY TESTS PASSED!'));
      console.log(chalk.green('🚀 Platform is ready for secure deployment\n'));
      return true;
    } else {
      console.log(chalk.red.bold('\n❌ SECURITY ISSUES DETECTED!'));
      console.log(chalk.red('🛑 Platform requires security hardening before deployment\n'));
      
      console.log(chalk.yellow('🔧 IMMEDIATE ACTIONS REQUIRED:'));
      if (criticalIssues > 0) {
        console.log(chalk.red(`   • Fix ${criticalIssues} critical RLS policy violations`));
      }
      if (rlsCoverage < 100) {
        console.log(chalk.red(`   • Improve RLS coverage from ${rlsCoverage}% to 100%`));
      }
      if (!isolationPassed) {
        console.log(chalk.red('   • Fix company data isolation issues'));
      }
      
      console.log(chalk.blue('\n📚 Next Steps:'));
      console.log(chalk.blue('   1. Review SECURITY_AUDIT_REPORT.md for detailed findings'));
      console.log(chalk.blue('   2. Follow docs/security/README.md for remediation steps'));
      console.log(chalk.blue('   3. Implement authentication system (see security playbook)'));
      console.log(chalk.blue('   4. Add missing RLS policies for critical tables'));
      console.log(chalk.blue('   5. Re-run this script to validate fixes\n'));
      
      return false;
    }

  } catch (error) {
    console.error(chalk.red.bold('\n💥 Security validation failed:'), error);
    return false;
  }
}

// Run validation
runSecurityValidation().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error(chalk.red('Script execution failed:'), error);
  process.exit(1);
});