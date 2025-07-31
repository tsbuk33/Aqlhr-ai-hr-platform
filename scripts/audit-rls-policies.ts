#!/usr/bin/env tsx

/**
 * RLS Policy Audit Script
 * Validates Row Level Security policy coverage across all tables
 */

import { supabase } from '@/integrations/supabase/client';
import chalk from 'chalk';
import fs from 'fs';

interface TablePolicy {
  table_name: string;
  policy_count: number;
  rls_enabled: boolean;
  policies: Array<{
    policy_name: string;
    command: string;
    permissive: boolean;
    roles: string[];
    using_expression?: string;
    check_expression?: string;
  }>;
}

interface RLSAuditResult {
  timestamp: string;
  total_tables: number;
  tables_with_rls: number;
  tables_with_policies: number;
  tables_missing_policies: string[];
  coverage_percentage: number;
  critical_tables_unprotected: string[];
  detailed_results: TablePolicy[];
  recommendations: string[];
}

class RLSPolicyAuditor {
  private criticalTables = [
    'employees',
    'performance_reviews',
    'leave_requests', 
    'attendance',
    'ai_recommendations',
    'ai_document_embeddings',
    'system_health_reports',
    'user_roles',
    'job_applications',
    'workplace_transfers',
    'hse_incidents'
  ];

  async auditAllTables(): Promise<RLSAuditResult> {
    console.log(chalk.blue('🔍 Starting RLS Policy Audit...'));

    try {
      // Get all tables with their RLS status and policy counts
      const { data: auditData, error } = await supabase.rpc('audit_rls_policies');
      
      if (error) {
        throw new Error(`Failed to audit RLS policies: ${error.message}`);
      }

      if (!auditData) {
        throw new Error('No audit data returned from database');
      }

      // Get detailed policy information for each table
      const detailedResults = await this.getDetailedPolicyInfo(auditData);

      // Calculate metrics
      const tablesWithRLS = auditData.filter((table: any) => table.rls_enabled).length;
      const tablesWithPolicies = auditData.filter((table: any) => table.policy_count > 0).length;
      const tablesMissingPolicies = auditData.filter((table: any) => 
        !table.rls_enabled || table.policy_count === 0
      ).map((table: any) => table.table_name);

      const coveragePercentage = auditData.length > 0 
        ? Math.round((tablesWithPolicies / auditData.length) * 100) 
        : 0;

      // Identify critical unprotected tables
      const criticalTablesUnprotected = auditData
        .filter((table: any) => 
          this.criticalTables.includes(table.table_name.split('.')[1]) &&
          table.rls_enabled && 
          table.policy_count === 0
        )
        .map((table: any) => table.table_name);

      const recommendations = this.generateRecommendations(auditData, criticalTablesUnprotected);

      const result: RLSAuditResult = {
        timestamp: new Date().toISOString(),
        total_tables: auditData.length,
        tables_with_rls: tablesWithRLS,
        tables_with_policies: tablesWithPolicies,
        tables_missing_policies: tablesMissingPolicies,
        coverage_percentage: coveragePercentage,
        critical_tables_unprotected: criticalTablesUnprotected,
        detailed_results: detailedResults,
        recommendations
      };

      return result;

    } catch (error) {
      console.error(chalk.red('❌ RLS audit failed:'), error);
      throw error;
    }
  }

  private async getDetailedPolicyInfo(auditData: any[]): Promise<TablePolicy[]> {
    // Note: This would require additional Supabase RPC functions to get detailed policy info
    // For now, we'll structure the data we have
    return auditData.map((table: any) => ({
      table_name: table.table_name,
      policy_count: table.policy_count,
      rls_enabled: table.rls_enabled,
      policies: [] // Would be populated with actual policy details
    }));
  }

  private generateRecommendations(auditData: any[], criticalUnprotected: string[]): string[] {
    const recommendations: string[] = [];

    if (criticalUnprotected.length > 0) {
      recommendations.push(
        `🚨 CRITICAL: ${criticalUnprotected.length} critical tables lack RLS policies: ${criticalUnprotected.join(', ')}`
      );
    }

    const tablesWithoutRLS = auditData.filter((table: any) => !table.rls_enabled);
    if (tablesWithoutRLS.length > 0) {
      recommendations.push(
        `⚠️  ${tablesWithoutRLS.length} tables don't have RLS enabled`
      );
    }

    const rlsEnabledNoPolicies = auditData.filter((table: any) => 
      table.rls_enabled && table.policy_count === 0
    );
    
    if (rlsEnabledNoPolicies.length > 0) {
      recommendations.push(
        `🔒 ${rlsEnabledNoPolicies.length} tables have RLS enabled but no policies (blocking all access)`
      );
    }

    // Add specific remediation steps
    recommendations.push(
      '✅ Create company-scoped RLS policies using: CREATE POLICY "Company access" ON table_name USING (company_id = get_user_company_id())'
    );

    recommendations.push(
      '✅ Test RLS policies with: npm run test:security:isolation'
    );

    return recommendations;
  }

  async generateReport(result: RLSAuditResult): Promise<void> {
    const reportPath = 'rls-policy-audit.md';
    const jsonPath = 'rls-audit.json';

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(result);
    fs.writeFileSync(reportPath, markdownReport);

    // Save JSON results for CI/CD consumption
    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));

    console.log(chalk.green(`📄 Report saved to: ${reportPath}`));
    console.log(chalk.green(`📊 JSON results saved to: ${jsonPath}`));
  }

  private generateMarkdownReport(result: RLSAuditResult): string {
    const statusIcon = result.coverage_percentage === 100 ? '✅' : 
                      result.coverage_percentage >= 80 ? '⚠️' : '🚨';

    return `# 🔒 RLS Policy Audit Report

*Generated: ${result.timestamp}*

## ${statusIcon} Executive Summary

**RLS Policy Coverage: ${result.coverage_percentage}%**

- **Total Tables:** ${result.total_tables}
- **Tables with RLS Enabled:** ${result.tables_with_rls}
- **Tables with Policies:** ${result.tables_with_policies}
- **Tables Missing Policies:** ${result.tables_missing_policies}

${result.critical_tables_unprotected.length > 0 ? 
`## 🚨 CRITICAL SECURITY ISSUES

The following critical business tables lack RLS policies:
${result.critical_tables_unprotected.map(table => `- \`${table}\``).join('\n')}

**IMPACT:** Complete data exposure across companies - any authenticated user can access ALL data.` : 
'## ✅ No Critical Security Issues'}

## 📊 Detailed Results

| Table Name | RLS Enabled | Policy Count | Status |
|------------|-------------|--------------|---------|
${result.detailed_results.map(table => {
  const status = !table.rls_enabled ? '⚠️ No RLS' : 
                 table.policy_count === 0 ? '🚨 No Policies' : 
                 '✅ Protected';
  return `| ${table.table_name} | ${table.rls_enabled ? '✅' : '❌'} | ${table.policy_count} | ${status} |`;
}).join('\n')}

## 🔧 Recommendations

${result.recommendations.map(rec => `- ${rec}`).join('\n')}

## 🛠️ Next Steps

### Immediate Actions (Critical):
1. **Add RLS policies to critical tables:**
   \`\`\`sql
   ${result.critical_tables_unprotected.map(table => 
   `CREATE POLICY "Company access policy" ON ${table}
     USING (company_id = get_user_company_id());`
   ).join('\n\n   ')}
   \`\`\`

2. **Test company isolation:**
   \`\`\`bash
   npm run test:security:isolation
   \`\`\`

### Ongoing Security:
- Set up automated RLS policy validation in CI/CD
- Regular security audits (weekly)
- Monitor for new tables without policies

---

*This report is automatically generated. Re-run with: \`npm run audit:rls\`*
`;
  }

  printSummary(result: RLSAuditResult): void {
    console.log('\n' + chalk.bold('🔒 RLS POLICY AUDIT SUMMARY'));
    console.log('================================');
    
    const statusColor = result.coverage_percentage === 100 ? chalk.green : 
                       result.coverage_percentage >= 80 ? chalk.yellow : chalk.red;
    
    console.log(`Coverage: ${statusColor(result.coverage_percentage + '%')}`);
    console.log(`Tables with RLS: ${chalk.blue(result.tables_with_rls)}`);
    console.log(`Tables with Policies: ${chalk.green(result.tables_with_policies)}`);
    console.log(`Missing Policies: ${chalk.red(result.tables_missing_policies.length)}`);

    if (result.critical_tables_unprotected.length > 0) {
      console.log('\n' + chalk.red.bold('🚨 CRITICAL ISSUES:'));
      result.critical_tables_unprotected.forEach(table => {
        console.log(chalk.red(`  - ${table} (no RLS policies)`));
      });
    }

    console.log('\n' + chalk.blue('📋 Recommendations:'));
    result.recommendations.slice(0, 3).forEach(rec => {
      console.log(chalk.blue(`  ${rec}`));
    });

    console.log('\n');
  }
}

async function main() {
  try {
    const auditor = new RLSPolicyAuditor();
    const result = await auditor.auditAllTables();
    
    auditor.printSummary(result);
    await auditor.generateReport(result);

    // Exit with error code if critical issues found
    if (result.critical_tables_unprotected.length > 0 || result.coverage_percentage < 100) {
      console.log(chalk.red('\n❌ RLS audit failed - critical security issues detected'));
      process.exit(1);
    } else {
      console.log(chalk.green('\n✅ RLS audit passed - all tables properly protected'));
      process.exit(0);
    }

  } catch (error) {
    console.error(chalk.red('💥 RLS audit execution failed:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { RLSPolicyAuditor };