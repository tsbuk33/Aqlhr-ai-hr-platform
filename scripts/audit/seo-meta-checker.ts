#!/usr/bin/env tsx

import { Project, SourceFile, Node } from 'ts-morph';
import { glob } from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';

interface SEOIssue {
  file: string;
  line: number;
  type: 'missing-title' | 'missing-description' | 'missing-lang' | 'missing-viewport' | 'long-title' | 'long-description';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  fix?: string;
}

export class SEOMetaChecker {
  private project: Project;
  private issues: SEOIssue[] = [];
  private applyFixes: boolean;

  constructor(applyFixes = false) {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    this.applyFixes = applyFixes;
  }

  async checkAll(): Promise<SEOIssue[]> {
    // Check page components for meta tags
    await this.checkPageComponents();
    
    // Check index.html for basic meta tags
    await this.checkIndexHTML();
    
    return this.issues;
  }

  private async checkPageComponents() {
    const pageFiles = await glob('src/pages/**/*.{ts,tsx}');
    
    for (const filePath of pageFiles) {
      await this.checkPageComponent(filePath);
    }
  }

  private async checkPageComponent(filePath: string) {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    const content = sourceFile.getFullText();
    
    // Extract module/page name from file path
    const moduleName = this.extractModuleName(filePath);
    
    // Check if component has title/meta tags
    const hasTitle = this.hasMetaTitle(content);
    const hasDescription = this.hasMetaDescription(content);
    const hasHelmet = content.includes('Helmet') || content.includes('<title>') || content.includes('<meta');
    
    if (!hasTitle && !hasHelmet) {
      this.issues.push({
        file: filePath,
        line: 1,
        type: 'missing-title',
        severity: 'critical',
        message: `Page missing title meta tag`,
        fix: `Add <title>{t('${moduleName}.title')} – AqlHR</title>`
      });
    }
    
    if (!hasDescription && !hasHelmet) {
      this.issues.push({
        file: filePath,
        line: 1,
        type: 'missing-description',
        severity: 'warning',
        message: `Page missing description meta tag`,
        fix: `Add <meta name="description" content={t('${moduleName}.description')} />`
      });
    }
    
    // Check for long titles/descriptions
    this.checkMetaLength(sourceFile, content);
  }

  private extractModuleName(filePath: string): string {
    // Convert file path to module key
    const parts = filePath
      .replace('src/pages/', '')
      .replace('.tsx', '')
      .replace('.ts', '')
      .split('/');
    
    return parts.join('.');
  }

  private hasMetaTitle(content: string): boolean {
    return /(<title>|useTitle|document\.title)/i.test(content);
  }

  private hasMetaDescription(content: string): boolean {
    return /<meta[^>]*name=["']description["']/i.test(content);
  }

  private checkMetaLength(sourceFile: SourceFile, content: string) {
    // Check for title length issues
    const titleMatches = content.match(/<title>([^<]+)<\/title>/g);
    if (titleMatches) {
      titleMatches.forEach(match => {
        const titleContent = match.replace(/<\/?title>/g, '');
        if (titleContent.length > 60) {
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: 1,
            type: 'long-title',
            severity: 'warning',
            message: `Title too long: ${titleContent.length} characters (max 60)`,
            fix: 'Shorten title for better SEO'
          });
        }
      });
    }
    
    // Check for description length issues
    const descMatches = content.match(/content=["']([^"']+)["'][^>]*name=["']description["']/g);
    if (descMatches) {
      descMatches.forEach(match => {
        const descContent = match.match(/content=["']([^"']+)["']/)?.[1] || '';
        if (descContent.length > 160) {
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: 1,
            type: 'long-description',
            severity: 'warning',
            message: `Description too long: ${descContent.length} characters (max 160)`,
            fix: 'Shorten description for better SEO'
          });
        }
      });
    }
  }

  private async checkIndexHTML() {
    try {
      const indexContent = readFileSync('index.html', 'utf-8');
      
      // Check for basic meta tags
      if (!indexContent.includes('<meta name="viewport"')) {
        this.issues.push({
          file: 'index.html',
          line: 1,
          type: 'missing-viewport',
          severity: 'critical',
          message: 'Missing viewport meta tag',
          fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0">'
        });
      }
      
      if (!indexContent.includes('lang=')) {
        this.issues.push({
          file: 'index.html',
          line: 1,
          type: 'missing-lang',
          severity: 'warning',
          message: 'Missing lang attribute on html element',
          fix: 'Add lang="en" to <html> tag'
        });
      }
      
    } catch (error) {
      console.log(chalk.yellow('⚠️ Could not read index.html'));
    }
  }

  async autoFix(): Promise<number> {
    if (!this.applyFixes) return 0;
    
    let fixedCount = 0;
    const pageIssues = this.issues.filter(issue => 
      issue.file.includes('src/pages/') && 
      ['missing-title', 'missing-description'].includes(issue.type)
    );
    
    // Group fixes by file
    const fileGroups = pageIssues.reduce((acc, issue) => {
      if (!acc[issue.file]) acc[issue.file] = [];
      acc[issue.file].push(issue);
      return acc;
    }, {} as { [file: string]: SEOIssue[] });
    
    for (const [filePath, fileIssues] of Object.entries(fileGroups)) {
      try {
        const sourceFile = this.project.getSourceFile(filePath);
        if (!sourceFile) continue;
        
        let content = sourceFile.getFullText();
        const moduleName = this.extractModuleName(filePath);
        
        // Add imports if needed
        if (!content.includes('useTranslation')) {
          content = `import { useTranslation } from 'react-i18next';\n${content}`;
        }
        
        if (!content.includes('Helmet')) {
          content = `import { Helmet } from 'react-helmet-async';\n${content}`;
        }
        
        // Find the component function and add meta tags
        const componentMatch = content.match(/(export\s+(?:default\s+)?(?:function|const)\s+\w+[^{]*{)/);
        if (componentMatch) {
          const insertIndex = componentMatch.index! + componentMatch[0].length;
          
          let metaTags = `\n  const { t } = useTranslation();\n\n`;
          metaTags += `  return (\n    <>\n      <Helmet>\n`;
          
          if (fileIssues.some(issue => issue.type === 'missing-title')) {
            metaTags += `        <title>{t('${moduleName}.title')} – AqlHR</title>\n`;
            fixedCount++;
          }
          
          if (fileIssues.some(issue => issue.type === 'missing-description')) {
            metaTags += `        <meta name="description" content={t('${moduleName}.description')} />\n`;
            fixedCount++;
          }
          
          metaTags += `      </Helmet>\n`;
          
          content = content.slice(0, insertIndex) + metaTags + content.slice(insertIndex);
        }
        
        // Write the updated content
        writeFileSync(filePath, content);
        
      } catch (error) {
        console.log(chalk.yellow(`⚠️ Could not fix ${filePath}: ${error.message}`));
      }
    }
    
    return fixedCount;
  }

  printReport(): void {
    const criticalIssues = this.issues.filter(i => i.severity === 'critical');
    const warningIssues = this.issues.filter(i => i.severity === 'warning');
    const infoIssues = this.issues.filter(i => i.severity === 'info');
    
    console.log(chalk.blue('\n🔍 SEO Meta Tags Report'));
    console.log(chalk.white('='.repeat(50)));
    
    if (criticalIssues.length > 0) {
      console.log(chalk.red(`\n🚨 Critical Issues (${criticalIssues.length}):`));
      criticalIssues.forEach(issue => {
        console.log(`  ${issue.file}:${issue.line} - ${issue.message}`);
        if (issue.fix) {
          console.log(`    Fix: ${issue.fix}`);
        }
      });
    }
    
    if (warningIssues.length > 0) {
      console.log(chalk.yellow(`\n⚠️  Warnings (${warningIssues.length}):`));
      warningIssues.forEach(issue => {
        console.log(`  ${issue.file}:${issue.line} - ${issue.message}`);
      });
    }
    
    if (infoIssues.length > 0) {
      console.log(chalk.blue(`\n📋 Recommendations (${infoIssues.length}):`));
      infoIssues.forEach(issue => {
        console.log(`  ${issue.file}:${issue.line} - ${issue.message}`);
      });
    }
    
    const totalIssues = this.issues.length;
    if (totalIssues === 0) {
      console.log(chalk.green('\n✅ All pages have proper SEO meta tags!'));
    } else {
      console.log(chalk.white(`\nTotal: ${totalIssues} SEO issues`));
    }
  }
}

// CLI execution
async function main() {
  const applyFixes = process.argv.includes('--apply');
  const checker = new SEOMetaChecker(applyFixes);
  
  console.log(chalk.blue('🔍 Checking SEO meta tags...\n'));
  
  await checker.checkAll();
  
  if (applyFixes) {
    const fixedCount = await checker.autoFix();
    console.log(chalk.green(`\n🔧 Fixed ${fixedCount} SEO issues`));
  }
  
  checker.printReport();
  
  const criticalIssues = checker.issues.filter(i => i.severity === 'critical').length;
  process.exit(criticalIssues > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}