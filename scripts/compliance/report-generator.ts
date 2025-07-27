import { writeFileSync } from 'fs';
import chalk from 'chalk';
import { I18nIssue } from './i18n-checker';
import { LayoutIssue } from './layout-checker';
import { ThemeIssue } from './theme-checker';
import { A11yIssue } from './accessibility-checker';
import { PerformanceIssue } from './performance-checker';
import { SecurityIssue } from './security-checker';

export interface ComplianceReport {
  timestamp: string;
  summary: {
    totalIssues: number;
    criticalIssues: number;
    fixedIssues: number;
    byCategory: {
      i18n: number;
      layout: number;
      theme: number;
      accessibility: number;
      performance: number;
      security: number;
    };
  };
  issues: {
    i18n: I18nIssue[];
    layout: LayoutIssue[];
    theme: ThemeIssue[];
    accessibility: A11yIssue[];
    performance: PerformanceIssue[];
    security: SecurityIssue[];
  };
  recommendations: string[];
}

export class ReportGenerator {
  generateReport(
    i18nIssues: I18nIssue[],
    layoutIssues: LayoutIssue[],
    themeIssues: ThemeIssue[],
    a11yIssues: A11yIssue[],
    performanceIssues: PerformanceIssue[],
    securityIssues: SecurityIssue[],
    fixedCounts: { [key: string]: number }
  ): ComplianceReport {
    const totalIssues = i18nIssues.length + layoutIssues.length + themeIssues.length + 
                       a11yIssues.length + performanceIssues.length + securityIssues.length;
    
    const criticalIssues = securityIssues.filter(issue => 
      issue.severity === 'critical' || issue.severity === 'high'
    ).length;
    
    const totalFixed = Object.values(fixedCounts).reduce((sum, count) => sum + count, 0);
    
    const report: ComplianceReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues,
        criticalIssues,
        fixedIssues: totalFixed,
        byCategory: {
          i18n: i18nIssues.length,
          layout: layoutIssues.length,
          theme: themeIssues.length,
          accessibility: a11yIssues.length,
          performance: performanceIssues.length,
          security: securityIssues.length
        }
      },
      issues: {
        i18n: i18nIssues,
        layout: layoutIssues,
        theme: themeIssues,
        accessibility: a11yIssues,
        performance: performanceIssues,
        security: securityIssues
      },
      recommendations: this.generateRecommendations({
        i18nIssues,
        layoutIssues,
        themeIssues,
        a11yIssues,
        performanceIssues,
        securityIssues
      })
    };
    
    return report;
  }

  private generateRecommendations(issues: {
    i18nIssues: I18nIssue[];
    layoutIssues: LayoutIssue[];
    themeIssues: ThemeIssue[];
    a11yIssues: A11yIssue[];
    performanceIssues: PerformanceIssue[];
    securityIssues: SecurityIssue[];
  }): string[] {
    const recommendations: string[] = [];
    
    // Security recommendations (highest priority)
    const criticalSecurity = issues.securityIssues.filter(issue => 
      issue.severity === 'critical'
    );
    if (criticalSecurity.length > 0) {
      recommendations.push(
        `🚨 CRITICAL: Address ${criticalSecurity.length} critical security issues immediately`
      );
    }
    
    // I18n recommendations
    const hardcodedStrings = issues.i18nIssues.filter(issue => 
      issue.type === 'hardcoded-string'
    );
    if (hardcodedStrings.length > 0) {
      recommendations.push(
        `🌐 Replace ${hardcodedStrings.length} hardcoded strings with translation keys`
      );
    }
    
    // Layout recommendations
    const layoutIssues = issues.layoutIssues.filter(issue => 
      issue.type === 'missing-centered-layout'
    );
    if (layoutIssues.length > 0) {
      recommendations.push(
        `📐 Implement CenteredLayout in ${layoutIssues.length} page components`
      );
    }
    
    // Theme recommendations
    const contrastIssues = issues.themeIssues.filter(issue => 
      issue.type === 'low-contrast'
    );
    if (contrastIssues.length > 0) {
      recommendations.push(
        `🎨 Fix ${contrastIssues.length} color contrast issues for accessibility`
      );
    }
    
    // Accessibility recommendations
    const missingAlt = issues.a11yIssues.filter(issue => 
      issue.type === 'missing-alt'
    );
    if (missingAlt.length > 0) {
      recommendations.push(
        `♿ Add alt text to ${missingAlt.length} images for screen readers`
      );
    }
    
    // Performance recommendations
    const largeImports = issues.performanceIssues.filter(issue => 
      issue.type === 'large-import'
    );
    if (largeImports.length > 0) {
      recommendations.push(
        `⚡ Optimize ${largeImports.length} large imports to reduce bundle size`
      );
    }
    
    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('✅ Great job! No major issues found');
    } else {
      recommendations.push(
        '📋 Run with --apply flag to auto-fix simple issues',
        '🔄 Re-run after fixes to track progress'
      );
    }
    
    return recommendations;
  }

  saveHTMLReport(report: ComplianceReport, filePath: string) {
    const html = this.generateHTML(report);
    writeFileSync(filePath, html);
    console.log(chalk.green(`📄 HTML report saved to ${filePath}`));
  }

  saveMarkdownReport(report: ComplianceReport, filePath: string) {
    const markdown = this.generateMarkdown(report);
    writeFileSync(filePath, markdown);
    console.log(chalk.green(`📄 Markdown report saved to ${filePath}`));
  }

  saveJSONReport(report: ComplianceReport, filePath: string) {
    const json = JSON.stringify(report, null, 2);
    writeFileSync(filePath, json);
    console.log(chalk.green(`📄 JSON report saved to ${filePath}`));
  }

  private generateHTML(report: ComplianceReport): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AqlHR Compliance Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #495057; }
        .metric-label { color: #6c757d; margin-top: 5px; }
        .section { margin: 30px 0; }
        .issue-list { background: white; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; }
        .issue-item { padding: 15px; border-bottom: 1px solid #e9ecef; }
        .issue-item:last-child { border-bottom: none; }
        .severity-critical { border-left: 4px solid #dc3545; }
        .severity-high { border-left: 4px solid #fd7e14; }
        .severity-medium { border-left: 4px solid #ffc107; }
        .severity-low { border-left: 4px solid #20c997; }
        .recommendations { background: #e7f3ff; border: 1px solid #b6d7ff; border-radius: 8px; padding: 20px; }
        .recommendations ul { margin: 10px 0; padding-left: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 AqlHR Compliance Report</h1>
        <p>Generated on ${new Date(report.timestamp).toLocaleString()}</p>
    </div>

    <div class="summary">
        <div class="metric">
            <div class="metric-value">${report.summary.totalIssues}</div>
            <div class="metric-label">Total Issues</div>
        </div>
        <div class="metric">
            <div class="metric-value">${report.summary.criticalIssues}</div>
            <div class="metric-label">Critical Issues</div>
        </div>
        <div class="metric">
            <div class="metric-value">${report.summary.fixedIssues}</div>
            <div class="metric-label">Auto-Fixed</div>
        </div>
    </div>

    <div class="recommendations">
        <h2>📋 Recommendations</h2>
        <ul>
            ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>

    ${this.generateHTMLSection('🌐 Internationalization', report.issues.i18n)}
    ${this.generateHTMLSection('📐 Layout', report.issues.layout)}
    ${this.generateHTMLSection('🎨 Theme & Contrast', report.issues.theme)}
    ${this.generateHTMLSection('♿ Accessibility', report.issues.accessibility)}
    ${this.generateHTMLSection('⚡ Performance', report.issues.performance)}
    ${this.generateHTMLSection('🔒 Security', report.issues.security)}

</body>
</html>`;
  }

  private generateHTMLSection(title: string, issues: any[]): string {
    if (issues.length === 0) {
      return `<div class="section">
        <h2>${title}</h2>
        <p>✅ No issues found</p>
      </div>`;
    }

    return `<div class="section">
      <h2>${title} (${issues.length})</h2>
      <div class="issue-list">
        ${issues.map(issue => `
          <div class="issue-item ${this.getSeverityClass(issue)}">
            <strong>${issue.message}</strong><br>
            <small>📁 ${issue.file}:${issue.line}</small>
            ${issue.fix ? `<br><em>💡 ${issue.fix}</em>` : ''}
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  private getSeverityClass(issue: any): string {
    if (issue.severity) {
      return `severity-${issue.severity}`;
    }
    if (issue.impact) {
      return `severity-${issue.impact}`;
    }
    return '';
  }

  private generateMarkdown(report: ComplianceReport): string {
    return `# 🔍 AqlHR Compliance Report

**Generated:** ${new Date(report.timestamp).toLocaleString()}

## 📊 Summary

| Metric | Count |
|--------|-------|
| Total Issues | ${report.summary.totalIssues} |
| Critical Issues | ${report.summary.criticalIssues} |
| Auto-Fixed | ${report.summary.fixedIssues} |

### By Category

| Category | Issues |
|----------|--------|
| 🌐 I18n | ${report.summary.byCategory.i18n} |
| 📐 Layout | ${report.summary.byCategory.layout} |
| 🎨 Theme | ${report.summary.byCategory.theme} |
| ♿ Accessibility | ${report.summary.byCategory.accessibility} |
| ⚡ Performance | ${report.summary.byCategory.performance} |
| 🔒 Security | ${report.summary.byCategory.security} |

## 📋 Recommendations

${report.recommendations.map(rec => `- ${rec}`).join('\n')}

${this.generateMarkdownSection('🌐 Internationalization Issues', report.issues.i18n)}
${this.generateMarkdownSection('📐 Layout Issues', report.issues.layout)}
${this.generateMarkdownSection('🎨 Theme & Contrast Issues', report.issues.theme)}
${this.generateMarkdownSection('♿ Accessibility Issues', report.issues.accessibility)}
${this.generateMarkdownSection('⚡ Performance Issues', report.issues.performance)}
${this.generateMarkdownSection('🔒 Security Issues', report.issues.security)}

---
*Report generated by AqlHR Compliance Tool*`;
  }

  private generateMarkdownSection(title: string, issues: any[]): string {
    if (issues.length === 0) {
      return `## ${title}\n\n✅ No issues found\n`;
    }

    let section = `## ${title} (${issues.length})\n\n`;
    
    issues.forEach((issue, index) => {
      section += `### ${index + 1}. ${issue.message}\n\n`;
      section += `**File:** \`${issue.file}:${issue.line}\`\n\n`;
      if (issue.fix) {
        section += `**Fix:** ${issue.fix}\n\n`;
      }
      if (issue.severity || issue.impact) {
        section += `**Severity:** ${issue.severity || issue.impact}\n\n`;
      }
      section += '---\n\n';
    });

    return section;
  }

  printSummary(report: ComplianceReport) {
    console.log('\n' + chalk.bold.blue('🔍 AQL HR COMPLIANCE REPORT'));
    console.log(chalk.gray('Generated: ' + new Date(report.timestamp).toLocaleString()));
    console.log('═'.repeat(60));
    
    // Summary metrics
    console.log(chalk.bold('\n📊 SUMMARY'));
    console.log(`Total Issues: ${chalk.yellow(report.summary.totalIssues)}`);
    console.log(`Critical Issues: ${chalk.red(report.summary.criticalIssues)}`);
    console.log(`Auto-Fixed: ${chalk.green(report.summary.fixedIssues)}`);
    
    // Category breakdown
    console.log(chalk.bold('\n📋 BY CATEGORY'));
    Object.entries(report.summary.byCategory).forEach(([category, count]) => {
      const icon = this.getCategoryIcon(category);
      const color = count > 0 ? chalk.yellow : chalk.green;
      console.log(`${icon} ${category}: ${color(count)}`);
    });
    
    // Recommendations
    if (report.recommendations.length > 0) {
      console.log(chalk.bold('\n💡 RECOMMENDATIONS'));
      report.recommendations.forEach(rec => {
        console.log(`  ${rec}`);
      });
    }
    
    console.log('\n' + '═'.repeat(60));
  }

  private getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      i18n: '🌐',
      layout: '📐',
      theme: '🎨',
      accessibility: '♿',
      performance: '⚡',
      security: '🔒'
    };
    return icons[category] || '📄';
  }
}