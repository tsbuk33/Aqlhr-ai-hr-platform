#!/usr/bin/env tsx

/**
 * Universal Scaffolding Coverage Audit Script
 * Validates that all pages have the required universal components
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import glob from 'glob';

interface ScaffoldingComponent {
  name: string;
  pattern: RegExp;
  required: boolean;
  description: string;
}

interface PageAuditResult {
  file_path: string;
  page_name: string;
  components_found: string[];
  components_missing: string[];
  coverage_percentage: number;
  fully_compliant: boolean;
  recommendations: string[];
}

// Universal scaffolding components to check for
const UNIVERSAL_COMPONENTS: ScaffoldingComponent[] = [
  {
    name: 'ModuleTooltip',
    pattern: /import.*ModuleTooltip.*from.*['"]@\/components\/universal\/ModuleTooltip['"]|<ModuleTooltip/,
    required: true,
    description: 'Provides contextual help tooltips for modules'
  },
  {
    name: 'ErrorBoundary',
    pattern: /import.*ErrorBoundary|<ErrorBoundary|ErrorBoundaryProvider/,
    required: false,
    description: 'Handles runtime errors gracefully'
  },
  {
    name: 'LoadingSpinner',
    pattern: /import.*Loading|<Loading|isLoading|loading/,
    required: false,
    description: 'Shows loading states for better UX'
  },
  {
    name: 'AuthGuard',
    pattern: /useAuth|auth\.uid|authenticated|login|logout/,
    required: false,
    description: 'Ensures proper authentication checks'
  },
  {
    name: 'Translation',
    pattern: /useTranslation|useAPITranslations|t\(|i18n/,
    required: false,
    description: 'Supports internationalization'
  },
  {
    name: 'AccessControl',
    pattern: /hasRole|permission|authorize|canAccess/,
    required: false,
    description: 'Implements role-based access control'
  }
];

function findPageFiles(): string[] {
  const patterns = [
    'src/pages/**/*.tsx',
    'src/pages/**/*.ts',
    'src/components/pages/**/*.tsx'
  ];
  
  let files: string[] = [];
  patterns.forEach(pattern => {
    const found = glob.sync(pattern);
    files = files.concat(found);
  });
  
  // Remove duplicates and filter out test files
  return [...new Set(files)].filter(file => 
    !file.includes('.test.') && 
    !file.includes('.spec.') &&
    !file.includes('.stories.')
  );
}

function auditPageScaffolding(filePath: string): PageAuditResult {
  const content = fs.readFileSync(filePath, 'utf-8');
  const pageName = path.basename(filePath, path.extname(filePath));
  
  const componentsFound: string[] = [];
  const componentsMissing: string[] = [];
  
  UNIVERSAL_COMPONENTS.forEach(component => {
    if (component.pattern.test(content)) {
      componentsFound.push(component.name);
    } else {
      componentsMissing.push(component.name);
    }
  });
  
  const requiredComponents = UNIVERSAL_COMPONENTS.filter(c => c.required);
  const requiredFound = componentsFound.filter(name => 
    requiredComponents.some(c => c.name === name)
  );
  
  const coveragePercentage = Math.round(
    (componentsFound.length / UNIVERSAL_COMPONENTS.length) * 100
  );
  
  const fullyCompliant = requiredFound.length === requiredComponents.length;
  
  const recommendations = generateRecommendations(componentsMissing, filePath);
  
  return {
    file_path: filePath,
    page_name: pageName,
    components_found: componentsFound,
    components_missing: componentsMissing,
    coverage_percentage: coveragePercentage,
    fully_compliant: fullyCompliant,
    recommendations
  };
}

function generateRecommendations(missing: string[], filePath: string): string[] {
  const recommendations: string[] = [];
  
  if (missing.includes('ModuleTooltip')) {
    recommendations.push('Add ModuleTooltip import and wrap key UI elements');
    recommendations.push('Example: <ModuleTooltip moduleKey="employees">');
  }
  
  if (missing.includes('ErrorBoundary')) {
    recommendations.push('Wrap main component in ErrorBoundary for error handling');
  }
  
  if (missing.includes('LoadingSpinner')) {
    recommendations.push('Add loading states for async operations');
  }
  
  if (missing.includes('AuthGuard')) {
    recommendations.push('Add authentication checks if page requires login');
  }
  
  if (missing.includes('Translation')) {
    recommendations.push('Implement i18n support using useAPITranslations hook');
  }
  
  if (missing.includes('AccessControl')) {
    recommendations.push('Add role-based access control if needed');
  }
  
  return recommendations;
}

function auditAllPages(): PageAuditResult[] {
  console.log(chalk.blue('🔍 Scanning pages for universal scaffolding...'));
  
  const pageFiles = findPageFiles();
  console.log(chalk.gray(`Found ${pageFiles.length} page files to audit`));
  
  const results: PageAuditResult[] = [];
  
  pageFiles.forEach(filePath => {
    try {
      const result = auditPageScaffolding(filePath);
      results.push(result);
    } catch (error) {
      console.error(chalk.red(`❌ Error auditing ${filePath}:`), error);
    }
  });
  
  return results;
}

function displayScaffoldingAuditResults(results: PageAuditResult[]) {
  console.log('\n' + chalk.bold.blue('📊 UNIVERSAL SCAFFOLDING AUDIT RESULTS'));
  console.log('='.repeat(50));
  
  const compliantPages = results.filter(r => r.fully_compliant).length;
  const averageCoverage = Math.round(
    results.reduce((sum, r) => sum + r.coverage_percentage, 0) / results.length
  );
  
  console.log(chalk.bold(`\n📈 Scaffolding Coverage: ${averageCoverage}%`));
  console.log(chalk.green(`✅ Fully Compliant: ${compliantPages}/${results.length}`));
  console.log(chalk.blue(`📄 Total Pages Audited: ${results.length}`));
  
  // Show top performers
  const topPerformers = results
    .filter(r => r.coverage_percentage >= 80)
    .sort((a, b) => b.coverage_percentage - a.coverage_percentage)
    .slice(0, 5);
    
  if (topPerformers.length > 0) {
    console.log(chalk.bold.green('\n🏆 TOP PERFORMING PAGES:'));
    topPerformers.forEach((page, index) => {
      console.log(`${index + 1}. ${page.page_name}: ${page.coverage_percentage}%`);
    });
  }
  
  // Show pages needing attention
  const needsAttention = results
    .filter(r => r.coverage_percentage < 50)
    .sort((a, b) => a.coverage_percentage - b.coverage_percentage);
    
  if (needsAttention.length > 0) {
    console.log(chalk.bold.yellow('\n⚠️  PAGES NEEDING ATTENTION:'));
    needsAttention.forEach((page, index) => {
      console.log(`${index + 1}. ${page.page_name}: ${page.coverage_percentage}%`);
      console.log(chalk.gray(`   File: ${page.file_path}`));
      console.log(chalk.red(`   Missing: ${page.components_missing.join(', ')}`));
      
      if (page.recommendations.length > 0) {
        console.log(chalk.yellow('   Recommendations:'));
        page.recommendations.slice(0, 2).forEach(rec => {
          console.log(chalk.yellow(`     • ${rec}`));
        });
      }
      console.log(); // Add spacing
    });
  }
  
  // Component usage statistics
  console.log(chalk.bold('\n📊 COMPONENT USAGE STATISTICS:'));
  UNIVERSAL_COMPONENTS.forEach(component => {
    const usageCount = results.filter(r => 
      r.components_found.includes(component.name)
    ).length;
    const usagePercentage = Math.round((usageCount / results.length) * 100);
    const requiredText = component.required ? '(Required)' : '(Optional)';
    
    console.log(`${component.name} ${requiredText}: ${usageCount}/${results.length} (${usagePercentage}%)`);
  });
}

function saveScaffoldingAuditReport(results: PageAuditResult[]) {
  const compliantPages = results.filter(r => r.fully_compliant).length;
  const averageCoverage = Math.round(
    results.reduce((sum, r) => sum + r.coverage_percentage, 0) / results.length
  );
  
  const report = {
    audit_timestamp: new Date().toISOString(),
    total_pages: results.length,
    compliant_pages: compliantPages,
    average_coverage: averageCoverage,
    compliance_percentage: Math.round((compliantPages / results.length) * 100),
    component_usage: UNIVERSAL_COMPONENTS.map(component => ({
      name: component.name,
      required: component.required,
      usage_count: results.filter(r => r.components_found.includes(component.name)).length,
      usage_percentage: Math.round((results.filter(r => r.components_found.includes(component.name)).length / results.length) * 100)
    })),
    detailed_results: results
  };
  
  fs.writeFileSync('scaffolding-audit-report.json', JSON.stringify(report, null, 2));
  console.log(chalk.blue('\n📄 Detailed report saved to: scaffolding-audit-report.json'));
}

async function main() {
  console.log(chalk.bold.cyan('🏗️  Universal Scaffolding Coverage Audit'));
  console.log(chalk.gray('Analyzing pages for universal component implementation...\n'));
  
  try {
    const results = auditAllPages();
    
    if (results.length === 0) {
      console.log(chalk.yellow('⚠️ No page files found to audit'));
      process.exit(1);
    }
    
    displayScaffoldingAuditResults(results);
    saveScaffoldingAuditReport(results);
    
    // Exit with appropriate code
    const averageCoverage = Math.round(
      results.reduce((sum, r) => sum + r.coverage_percentage, 0) / results.length
    );
    
    if (averageCoverage < 70) {
      console.log(chalk.red('\n❌ Scaffolding audit FAILED. Improve universal component coverage.'));
      process.exit(1);
    } else {
      console.log(chalk.green('\n✅ Scaffolding audit PASSED. Universal components properly implemented.'));
      process.exit(0);
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Scaffolding audit failed:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.main) {
  main();
}

export { auditAllPages, displayScaffoldingAuditResults };