#!/usr/bin/env tsx

import { Command } from 'commander';
import chalk from 'chalk';
import { I18nChecker } from './compliance/i18n-checker';
import { LayoutChecker } from './compliance/layout-checker';
import { ThemeChecker } from './compliance/theme-checker';
import { AccessibilityChecker } from './compliance/accessibility-checker';
import { PerformanceChecker } from './compliance/performance-checker';
import { SecurityChecker } from './compliance/security-checker';
import { ReportGenerator, ComplianceReport } from './compliance/report-generator';
import { readFileSync, existsSync } from 'fs';

interface ComplianceConfig {
  checks: {
    i18n: { enabled: boolean };
    layout: { enabled: boolean };
    theming: { enabled: boolean };
    accessibility: { enabled: boolean };
    codeQuality: { enabled: boolean };
    performance: { enabled: boolean };
    security: { enabled: boolean };
  };
  paths: {
    src: string;
    translations: string;
    reports: string;
  };
}

class ComplianceTool {
  private config: ComplianceConfig;
  private program: Command;

  constructor() {
    this.program = new Command();
    this.loadConfig();
    this.setupCommands();
  }

  private loadConfig() {
    const configPath = '.compliancerc.json';
    if (existsSync(configPath)) {
      try {
        this.config = JSON.parse(readFileSync(configPath, 'utf-8'));
      } catch (error) {
        console.warn(chalk.yellow('⚠️  Could not load .compliancerc.json, using defaults'));
        this.config = this.getDefaultConfig();
      }
    } else {
      this.config = this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): ComplianceConfig {
    return {
      checks: {
        i18n: { enabled: true },
        layout: { enabled: true },
        theming: { enabled: true },
        accessibility: { enabled: true },
        codeQuality: { enabled: true },
        performance: { enabled: true },
        security: { enabled: true }
      },
      paths: {
        src: 'src/',
        translations: 'public/api/translations/',
        reports: 'artifacts/'
      }
    };
  }

  private setupCommands() {
    this.program
      .name('fix-all-compliance')
      .description('AqlHR comprehensive compliance tool')
      .version('1.0.0');

    this.program
      .command('check')
      .description('Run all compliance checks without applying fixes')
      .option('--category <category>', 'Check specific category only')
      .option('--format <format>', 'Report format (html|markdown|json)', 'html')
      .action((options) => this.runChecks(false, options));

    this.program
      .command('fix')
      .description('Run checks and apply automatic fixes')
      .option('--category <category>', 'Fix specific category only')
      .option('--format <format>', 'Report format (html|markdown|json)', 'html')
      .action((options) => this.runChecks(true, options));

    this.program
      .command('report')
      .description('Generate report from previous run')
      .option('--format <format>', 'Report format (html|markdown|json)', 'html')
      .action((options) => this.generateReportOnly(options));
  }

  async run() {
    try {
      await this.program.parseAsync();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  }

  private async runChecks(applyFixes: boolean, options: any) {
    const startTime = Date.now();
    
    console.log(chalk.bold.blue('\n🔍 AQL HR COMPLIANCE TOOL'));
    console.log(chalk.gray(`Mode: ${applyFixes ? 'Fix & Report' : 'Check Only'}`));
    console.log('═'.repeat(60));

    const results = {
      i18n: [],
      layout: [],
      theme: [],
      accessibility: [],
      performance: [],
      security: []
    };

    const fixedCounts = {
      i18n: 0,
      layout: 0,
      theme: 0,
      accessibility: 0,
      performance: 0,
      security: 0
    };

    // Run checks based on configuration and category filter
    const category = options.category?.toLowerCase();

    if (this.shouldRunCheck('i18n', category)) {
      await this.runI18nChecks(results, fixedCounts, applyFixes);
    }

    if (this.shouldRunCheck('layout', category)) {
      await this.runLayoutChecks(results, fixedCounts, applyFixes);
    }

    if (this.shouldRunCheck('theming', category) || this.shouldRunCheck('theme', category)) {
      await this.runThemeChecks(results, fixedCounts, applyFixes);
    }

    if (this.shouldRunCheck('accessibility', category)) {
      await this.runAccessibilityChecks(results, fixedCounts, applyFixes);
    }

    if (this.shouldRunCheck('performance', category)) {
      await this.runPerformanceChecks(results, fixedCounts, applyFixes);
    }

    if (this.shouldRunCheck('security', category)) {
      await this.runSecurityChecks(results, fixedCounts, applyFixes);
    }

    // Generate and save report
    const reportGenerator = new ReportGenerator();
    const report = reportGenerator.generateReport(
      results.i18n,
      results.layout,
      results.theme,
      results.accessibility,
      results.performance,
      results.security,
      fixedCounts
    );

    this.saveReport(report, options.format);
    reportGenerator.printSummary(report);

    const duration = Date.now() - startTime;
    console.log(chalk.gray(`\n⏱️  Completed in ${duration}ms`));

    if (report.summary.criticalIssues > 0) {
      process.exit(1);
    }
  }

  private shouldRunCheck(checkName: string, categoryFilter?: string): boolean {
    if (categoryFilter && categoryFilter !== checkName) {
      return false;
    }
    return this.config.checks[checkName as keyof typeof this.config.checks]?.enabled ?? true;
  }

  private async runI18nChecks(results: any, fixedCounts: any, applyFixes: boolean) {
    console.log(chalk.cyan('\n🌐 Checking Internationalization...'));
    const checker = new I18nChecker();
    results.i18n = await checker.checkAll();
    
    if (applyFixes && results.i18n.length > 0) {
      fixedCounts.i18n = await checker.autoFix();
      console.log(chalk.green(`   ✅ Auto-fixed ${fixedCounts.i18n} issues`));
    }
    
    console.log(chalk.gray(`   Found ${results.i18n.length} i18n issues`));
  }

  private async runLayoutChecks(results: any, fixedCounts: any, applyFixes: boolean) {
    console.log(chalk.cyan('\n📐 Checking Layout & Styling...'));
    const checker = new LayoutChecker();
    results.layout = await checker.checkAll();
    
    if (applyFixes && results.layout.length > 0) {
      fixedCounts.layout = await checker.autoFix();
      console.log(chalk.green(`   ✅ Auto-fixed ${fixedCounts.layout} issues`));
    }
    
    console.log(chalk.gray(`   Found ${results.layout.length} layout issues`));
  }

  private async runThemeChecks(results: any, fixedCounts: any, applyFixes: boolean) {
    console.log(chalk.cyan('\n🎨 Checking Theme & Contrast...'));
    const checker = new ThemeChecker();
    results.theme = await checker.checkAll();
    
    if (applyFixes && results.theme.length > 0) {
      fixedCounts.theme = await checker.autoFix();
      console.log(chalk.green(`   ✅ Auto-fixed ${fixedCounts.theme} issues`));
    }
    
    console.log(chalk.gray(`   Found ${results.theme.length} theme issues`));
  }

  private async runAccessibilityChecks(results: any, fixedCounts: any, applyFixes: boolean) {
    console.log(chalk.cyan('\n♿ Checking Accessibility...'));
    const checker = new AccessibilityChecker();
    results.accessibility = await checker.checkAll();
    
    if (applyFixes && results.accessibility.length > 0) {
      fixedCounts.accessibility = await checker.autoFix();
      console.log(chalk.green(`   ✅ Auto-fixed ${fixedCounts.accessibility} issues`));
    }
    
    console.log(chalk.gray(`   Found ${results.accessibility.length} accessibility issues`));
  }

  private async runPerformanceChecks(results: any, fixedCounts: any, applyFixes: boolean) {
    console.log(chalk.cyan('\n⚡ Checking Performance...'));
    const checker = new PerformanceChecker();
    results.performance = await checker.checkAll();
    
    if (applyFixes && results.performance.length > 0) {
      fixedCounts.performance = await checker.autoFix();
      console.log(chalk.green(`   ✅ Auto-fixed ${fixedCounts.performance} issues`));
    }
    
    console.log(chalk.gray(`   Found ${results.performance.length} performance issues`));
  }

  private async runSecurityChecks(results: any, fixedCounts: any, applyFixes: boolean) {
    console.log(chalk.cyan('\n🔒 Checking Security...'));
    const checker = new SecurityChecker();
    results.security = await checker.checkAll();
    
    if (applyFixes && results.security.length > 0) {
      fixedCounts.security = await checker.autoFix();
      console.log(chalk.green(`   ✅ Auto-fixed ${fixedCounts.security} issues`));
    }
    
    console.log(chalk.gray(`   Found ${results.security.length} security issues`));
  }

  private saveReport(report: ComplianceReport, format: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportGenerator = new ReportGenerator();
    
    switch (format.toLowerCase()) {
      case 'html':
        reportGenerator.saveHTMLReport(report, `${this.config.paths.reports}compliance-report-${timestamp}.html`);
        break;
      case 'markdown':
      case 'md':
        reportGenerator.saveMarkdownReport(report, `${this.config.paths.reports}compliance-report-${timestamp}.md`);
        break;
      case 'json':
        reportGenerator.saveJSONReport(report, `${this.config.paths.reports}compliance-report-${timestamp}.json`);
        break;
      default:
        console.warn(chalk.yellow(`⚠️  Unknown format '${format}', using HTML`));
        reportGenerator.saveHTMLReport(report, `${this.config.paths.reports}compliance-report-${timestamp}.html`);
    }
  }

  private async generateReportOnly(options: any) {
    console.log(chalk.yellow('📄 Report-only mode not yet implemented'));
    console.log(chalk.gray('   Run "check" or "fix" commands to generate reports'));
  }
}

// Run the tool
const tool = new ComplianceTool();
tool.run();