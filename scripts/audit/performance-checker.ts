#!/usr/bin/env tsx

import { glob } from 'glob';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { Project, SourceFile } from 'ts-morph';
import chalk from 'chalk';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';

interface PerformanceIssue {
  file: string;
  line: number;
  type: 'large-bundle' | 'unused-import' | 'lighthouse-fail' | 'large-component' | 'missing-memo';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  metric?: string;
  value?: number;
  threshold?: number;
  fix?: string;
}

export class PerformanceChecker {
  private project: Project;
  private issues: PerformanceIssue[] = [];
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:5173') {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    this.baseUrl = baseUrl;
  }

  async checkAll(): Promise<PerformanceIssue[]> {
    console.log(chalk.blue('⚡ Running performance audit...\n'));
    
    // Check static code issues
    await this.checkBundleSize();
    await this.checkUnusedImports();
    await this.checkLargeComponents();
    await this.checkMemoOpportunities();
    
    // Run Lighthouse audits
    await this.runLighthouseAudits();
    
    return this.issues;
  }

  private async checkBundleSize() {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    // Check for heavy dependencies
    const heavyPackages = [
      'lodash', 'moment', 'rxjs', 'antd', 'material-ui'
    ];
    
    heavyPackages.forEach(pkg => {
      if (dependencies[pkg]) {
        this.issues.push({
          file: 'package.json',
          line: 0,
          type: 'large-bundle',
          severity: 'warning',
          message: `Heavy dependency detected: ${pkg}`,
          fix: `Consider tree-shaking or lighter alternatives`
        });
      }
    });
    
    // Check total dependency count
    const depCount = Object.keys(dependencies).length;
    if (depCount > 100) {
      this.issues.push({
        file: 'package.json',
        line: 0,
        type: 'large-bundle',
        severity: 'warning',
        message: `High dependency count: ${depCount} packages`,
        value: depCount,
        threshold: 100,
        fix: 'Review and remove unused dependencies'
      });
    }
  }

  private async checkUnusedImports() {
    const files = await glob('src/**/*.{ts,tsx}');
    
    for (const filePath of files) {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      const unusedImports = this.findUnusedImports(sourceFile);
      
      unusedImports.forEach(importInfo => {
        this.issues.push({
          file: filePath,
          line: importInfo.line,
          type: 'unused-import',
          severity: 'info',
          message: `Unused import: ${importInfo.name}`,
          fix: 'Remove unused import to reduce bundle size'
        });
      });
    }
  }

  private findUnusedImports(sourceFile: SourceFile): { name: string; line: number }[] {
    const unusedImports: { name: string; line: number }[] = [];
    const sourceText = sourceFile.getFullText();
    
    sourceFile.getImportDeclarations().forEach(importDecl => {
      const importClause = importDecl.getImportClause();
      if (!importClause) return;
      
      // Check default import
      const defaultImport = importClause.getDefaultImport();
      if (defaultImport) {
        const name = defaultImport.getText();
        const regex = new RegExp(`\\b${name}\\b`, 'g');
        const matches = sourceText.match(regex);
        
        if (!matches || matches.length <= 1) { // Only import declaration
          unusedImports.push({
            name,
            line: importDecl.getStartLineNumber()
          });
        }
      }
      
      // Check named imports
      const namedImports = importClause.getNamedImports();
      if (namedImports) {
        namedImports.getElements().forEach(element => {
          const name = element.getName();
          const regex = new RegExp(`\\b${name}\\b`, 'g');
          const matches = sourceText.match(regex);
          
          if (!matches || matches.length <= 1) {
            unusedImports.push({
              name,
              line: importDecl.getStartLineNumber()
            });
          }
        });
      }
    });
    
    return unusedImports;
  }

  private async checkLargeComponents() {
    const files = await glob('src/**/*.{tsx}');
    
    for (const filePath of files) {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').length;
      
      if (lines > 200) {
        this.issues.push({
          file: filePath,
          line: 1,
          type: 'large-component',
          severity: 'warning',
          message: `Large component file: ${lines} lines`,
          value: lines,
          threshold: 200,
          fix: 'Consider breaking into smaller components'
        });
      }
      
      // Check for multiple components in one file
      const componentMatches = content.match(/export\s+(const|function)\s+\w+/g);
      if (componentMatches && componentMatches.length > 3) {
        this.issues.push({
          file: filePath,
          line: 1,
          type: 'large-component',
          severity: 'info',
          message: `Multiple components in one file: ${componentMatches.length}`,
          value: componentMatches.length,
          threshold: 3,
          fix: 'Split into separate files for better maintainability'
        });
      }
    }
  }

  private async checkMemoOpportunities() {
    const files = await glob('src/**/*.{tsx}');
    
    for (const filePath of files) {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      
      sourceFile.forEachDescendant((node) => {
        const text = node.getText();
        
        // Look for functional components that could benefit from React.memo
        if (text.includes('export const') && text.includes('Props') && !text.includes('React.memo')) {
          const hasProps = text.includes(': ') && text.includes('Props');
          if (hasProps) {
            this.issues.push({
              file: filePath,
              line: node.getStartLineNumber(),
              type: 'missing-memo',
              severity: 'info',
              message: 'Component could benefit from React.memo',
              fix: 'Wrap with React.memo if props change infrequently'
            });
          }
        }
        
        // Look for inline functions in JSX
        if (text.includes('onClick={() =>') || text.includes('onSubmit={() =>')) {
          this.issues.push({
            file: filePath,
            line: node.getStartLineNumber(),
            type: 'missing-memo',
            severity: 'info',
            message: 'Inline function in JSX can cause re-renders',
            fix: 'Use useCallback or move function outside component'
          });
        }
      });
    }
  }

  private async runLighthouseAudits() {
    try {
      console.log(chalk.blue('🔍 Running Lighthouse performance audits...'));
      
      // Test key pages
      const testUrls = [
        `${this.baseUrl}`,
        `${this.baseUrl}/core-hr/recruitment`,
        `${this.baseUrl}/strategic/talent-mapping`
      ];
      
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      for (const url of testUrls) {
        try {
          const runnerResult = await lighthouse(url, {
            port: new URL(browser.wsEndpoint()).port,
            output: 'json',
            logLevel: 'error',
            onlyCategories: ['performance']
          });
          
          if (runnerResult && runnerResult.lhr) {
            const lhr = runnerResult.lhr;
            const performance = lhr.categories.performance;
            
            if (performance.score < 0.8) {
              this.issues.push({
                file: url,
                line: 0,
                type: 'lighthouse-fail',
                severity: 'warning',
                message: `Low performance score: ${Math.round(performance.score * 100)}`,
                metric: 'Performance Score',
                value: Math.round(performance.score * 100),
                threshold: 80
              });
            }
            
            // Check specific metrics
            const metrics = lhr.audits;
            
            if (metrics['first-contentful-paint'] && metrics['first-contentful-paint'].numericValue > 3000) {
              this.issues.push({
                file: url,
                line: 0,
                type: 'lighthouse-fail',
                severity: 'warning',
                message: `Slow First Contentful Paint: ${Math.round(metrics['first-contentful-paint'].numericValue)}ms`,
                metric: 'FCP',
                value: Math.round(metrics['first-contentful-paint'].numericValue),
                threshold: 3000
              });
            }
            
            if (metrics['interactive'] && metrics['interactive'].numericValue > 5000) {
              this.issues.push({
                file: url,
                line: 0,
                type: 'lighthouse-fail',
                severity: 'critical',
                message: `Slow Time to Interactive: ${Math.round(metrics['interactive'].numericValue)}ms`,
                metric: 'TTI',
                value: Math.round(metrics['interactive'].numericValue),
                threshold: 5000
              });
            }
          }
        } catch (pageError) {
          console.log(chalk.yellow(`⚠️ Could not audit ${url}: ${pageError.message}`));
        }
      }
      
      await browser.close();
    } catch (error) {
      console.log(chalk.yellow(`⚠️ Lighthouse audit failed: ${error.message}`));
    }
  }

  async autoFix(): Promise<number> {
    let fixedCount = 0;
    
    // Only auto-fix unused imports for now
    const unusedImportIssues = this.issues.filter(i => i.type === 'unused-import');
    
    console.log(chalk.blue(`🔧 Could auto-fix ${unusedImportIssues.length} unused imports`));
    console.log(chalk.yellow('Note: Auto-fix for imports is not implemented in this demo'));
    
    return fixedCount;
  }

  printReport(): void {
    const criticalIssues = this.issues.filter(i => i.severity === 'critical');
    const warningIssues = this.issues.filter(i => i.severity === 'warning');
    const infoIssues = this.issues.filter(i => i.severity === 'info');
    
    console.log(chalk.blue('\n⚡ Performance Audit Report'));
    console.log(chalk.white('='.repeat(50)));
    
    if (criticalIssues.length > 0) {
      console.log(chalk.red(`\n🚨 Critical Issues (${criticalIssues.length}):`));
      criticalIssues.forEach(issue => {
        console.log(`  ${issue.file}:${issue.line} - ${issue.message}`);
        if (issue.metric && issue.value !== undefined) {
          console.log(`    ${issue.metric}: ${issue.value} (threshold: ${issue.threshold})`);
        }
      });
    }
    
    if (warningIssues.length > 0) {
      console.log(chalk.yellow(`\n⚠️  Warnings (${warningIssues.length}):`));
      warningIssues.slice(0, 10).forEach(issue => {
        console.log(`  ${issue.file}:${issue.line} - ${issue.message}`);
      });
    }
    
    if (infoIssues.length > 0) {
      console.log(chalk.blue(`\n📋 Optimization Opportunities (${infoIssues.length}):`));
      infoIssues.slice(0, 5).forEach(issue => {
        console.log(`  ${issue.file}:${issue.line} - ${issue.message}`);
      });
    }
    
    const totalIssues = this.issues.length;
    if (totalIssues === 0) {
      console.log(chalk.green('\n✅ No performance issues detected!'));
    } else {
      console.log(chalk.white(`\nTotal: ${totalIssues} performance issues`));
    }
    
    // Summary by type
    console.log(chalk.blue('\n📊 Issues by Type:'));
    const typeSummary = this.issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    Object.entries(typeSummary).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} issues`);
    });
  }
}

// CLI execution
async function main() {
  const baseUrl = process.argv[2] || 'http://localhost:5173';
  const checker = new PerformanceChecker(baseUrl);
  
  await checker.checkAll();
  
  const applyFixes = process.argv.includes('--apply');
  if (applyFixes) {
    const fixedCount = await checker.autoFix();
    console.log(chalk.green(`\n🔧 Fixed ${fixedCount} performance issues`));
  }
  
  checker.printReport();
  
  const criticalIssues = checker.issues.filter(i => i.severity === 'critical').length;
  process.exit(criticalIssues > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}