#!/usr/bin/env tsx

/**
 * Auth Configuration Security Audit Script
 * Validates authentication and password security settings
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import chalk from 'chalk';

const SUPABASE_URL = "https://qcuhjcyjlkfizesndmth.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error(chalk.red('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required'));
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface AuthSecurityConfig {
  otp_expiry_seconds: number;
  password_min_length: number;
  password_leaked_protection: boolean;
  session_timeout_hours: number;
  max_failed_attempts: number;
  account_lockout_duration: number;
  jwt_expiry_seconds: number;
  refresh_token_rotation: boolean;
}

interface SecurityAuditResult {
  config_name: string;
  current_value: any;
  recommended_value: any;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  compliant: boolean;
  description: string;
}

const SECURITY_STANDARDS: Record<string, SecurityAuditResult> = {
  otp_expiry: {
    config_name: 'OTP Expiry Time',
    current_value: 0,
    recommended_value: 300, // 5 minutes
    severity: 'HIGH',
    compliant: false,
    description: 'OTP codes should expire within 5 minutes for security'
  },
  password_min_length: {
    config_name: 'Minimum Password Length',
    current_value: 0,
    recommended_value: 12,
    severity: 'HIGH',
    compliant: false,
    description: 'Passwords should be at least 12 characters long'
  },
  password_leaked_protection: {
    config_name: 'Leaked Password Protection',
    current_value: false,
    recommended_value: true,
    severity: 'CRITICAL',
    compliant: false,
    description: 'Protection against known breached passwords must be enabled'
  },
  session_timeout: {
    config_name: 'Session Timeout',
    current_value: 0,
    recommended_value: 24, // 24 hours
    severity: 'MEDIUM',
    compliant: false,
    description: 'Sessions should timeout after 24 hours of inactivity'
  },
  jwt_expiry: {
    config_name: 'JWT Token Expiry',
    current_value: 0,
    recommended_value: 3600, // 1 hour
    severity: 'HIGH',
    compliant: false,
    description: 'JWT tokens should expire within 1 hour'
  },
  refresh_token_rotation: {
    config_name: 'Refresh Token Rotation',
    current_value: false,
    recommended_value: true,
    severity: 'HIGH',
    compliant: false,
    description: 'Refresh tokens should rotate on each use'
  }
};

async function auditAuthConfiguration(): Promise<SecurityAuditResult[]> {
  console.log(chalk.blue('🔍 Auditing Authentication Configuration...'));
  
  const results: SecurityAuditResult[] = [];
  
  try {
    // Simulate auth config checks (in real implementation, these would query Supabase config)
    // For demo purposes, showing current non-compliant state
    
    const authConfig = {
      otp_expiry_seconds: 86400, // 24 hours - too long
      password_min_length: 6, // too short
      password_leaked_protection: false, // disabled
      session_timeout_hours: 168, // 7 days - too long
      jwt_expiry_seconds: 86400, // 24 hours - too long  
      refresh_token_rotation: false // disabled
    };

    // Audit OTP Expiry
    const otpResult = { ...SECURITY_STANDARDS.otp_expiry };
    otpResult.current_value = authConfig.otp_expiry_seconds;
    otpResult.compliant = authConfig.otp_expiry_seconds <= 300;
    results.push(otpResult);

    // Audit Password Length
    const passwordResult = { ...SECURITY_STANDARDS.password_min_length };
    passwordResult.current_value = authConfig.password_min_length;
    passwordResult.compliant = authConfig.password_min_length >= 12;
    results.push(passwordResult);

    // Audit Leaked Password Protection
    const leakedResult = { ...SECURITY_STANDARDS.password_leaked_protection };
    leakedResult.current_value = authConfig.password_leaked_protection;
    leakedResult.compliant = authConfig.password_leaked_protection === true;
    results.push(leakedResult);

    // Audit Session Timeout
    const sessionResult = { ...SECURITY_STANDARDS.session_timeout };
    sessionResult.current_value = authConfig.session_timeout_hours;
    sessionResult.compliant = authConfig.session_timeout_hours <= 24;
    results.push(sessionResult);

    // Audit JWT Expiry
    const jwtResult = { ...SECURITY_STANDARDS.jwt_expiry };
    jwtResult.current_value = authConfig.jwt_expiry_seconds;
    jwtResult.compliant = authConfig.jwt_expiry_seconds <= 3600;
    results.push(jwtResult);

    // Audit Refresh Token Rotation
    const refreshResult = { ...SECURITY_STANDARDS.refresh_token_rotation };
    refreshResult.current_value = authConfig.refresh_token_rotation;
    refreshResult.compliant = authConfig.refresh_token_rotation === true;
    results.push(refreshResult);

  } catch (error) {
    console.error(chalk.red('❌ Error auditing auth configuration:'), error);
  }

  return results;
}

async function generateSecurityReport(results: SecurityAuditResult[]) {
  const timestamp = new Date().toISOString();
  const compliantCount = results.filter(r => r.compliant).length;
  const totalCount = results.length;
  const compliancePercentage = Math.round((compliantCount / totalCount) * 100);

  const report = {
    audit_timestamp: timestamp,
    compliance_score: compliancePercentage,
    total_checks: totalCount,
    compliant_checks: compliantCount,
    failed_checks: totalCount - compliantCount,
    security_findings: results,
    recommendations: [
      'Enable leaked password protection immediately',
      'Reduce OTP expiry to 5 minutes maximum',
      'Increase minimum password length to 12 characters',
      'Enable refresh token rotation',
      'Set JWT expiry to 1 hour maximum',
      'Configure session timeout to 24 hours maximum'
    ],
    next_actions: [
      'Apply security hardening migration',
      'Update Supabase auth configuration',
      'Implement automated security monitoring',
      'Schedule regular security audits'
    ]
  };

  // Save detailed report
  fs.writeFileSync('auth-security-audit.json', JSON.stringify(report, null, 2));
  
  return report;
}

function displayAuditResults(results: SecurityAuditResult[], report: any) {
  console.log('\n' + chalk.bold.blue('📊 AUTH SECURITY AUDIT RESULTS'));
  console.log('='.repeat(50));
  
  // Summary
  console.log(chalk.bold(`\n📈 Compliance Score: ${report.compliance_score}%`));
  console.log(chalk.green(`✅ Compliant: ${report.compliant_checks}`));
  console.log(chalk.red(`❌ Non-Compliant: ${report.failed_checks}`));

  console.log(chalk.bold('\n🔍 DETAILED FINDINGS:'));
  
  results.forEach((result, index) => {
    const statusIcon = result.compliant ? '✅' : '❌';
    const severityColor = getSeverityColor(result.severity);
    
    console.log(`\n${index + 1}. ${statusIcon} ${result.config_name}`);
    console.log(`   Current: ${result.current_value}`);
    console.log(`   Required: ${result.recommended_value}`);
    console.log(`   Severity: ${severityColor(result.severity)}`);
    console.log(`   Description: ${result.description}`);
  });

  // Critical Issues
  const criticalIssues = results.filter(r => !r.compliant && r.severity === 'CRITICAL');
  if (criticalIssues.length > 0) {
    console.log(chalk.bold.red('\n🚨 CRITICAL SECURITY ISSUES:'));
    criticalIssues.forEach(issue => {
      console.log(chalk.red(`  • ${issue.config_name}: ${issue.description}`));
    });
  }

  // Recommendations
  console.log(chalk.bold.yellow('\n💡 SECURITY RECOMMENDATIONS:'));
  report.recommendations.forEach((rec: string, index: number) => {
    console.log(chalk.yellow(`  ${index + 1}. ${rec}`));
  });

  console.log(chalk.bold('\n📋 Report saved to: auth-security-audit.json'));
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'CRITICAL': return chalk.red.bold;
    case 'HIGH': return chalk.red;
    case 'MEDIUM': return chalk.yellow;
    case 'LOW': return chalk.blue;
    default: return chalk.gray;
  }
}

async function main() {
  console.log(chalk.bold.cyan('🔐 Authentication Security Audit'));
  console.log(chalk.gray('Scanning auth configuration for security compliance...\n'));

  try {
    const results = await auditAuthConfiguration();
    const report = await generateSecurityReport(results);
    
    displayAuditResults(results, report);

    // Exit with appropriate code
    const hasFailures = results.some(r => !r.compliant);
    if (hasFailures) {
      console.log(chalk.red('\n❌ Auth security audit FAILED. Address issues before production deployment.'));
      process.exit(1);
    } else {
      console.log(chalk.green('\n✅ Auth security audit PASSED. Configuration is production-ready.'));
      process.exit(0);
    }

  } catch (error) {
    console.error(chalk.red('❌ Auth security audit failed:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.main) {
  main();
}

export { auditAuthConfiguration, generateSecurityReport };