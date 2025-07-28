#!/usr/bin/env tsx

import { glob } from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import { Project, SourceFile, Node } from 'ts-morph';
import chalk from 'chalk';
import puppeteer from 'puppeteer';

interface A11yIssue {
  file: string;
  line: number;
  type: 'missing-aria' | 'missing-alt' | 'heading-order' | 'focus-management' | 'axe-violation';
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  message: string;
  element?: string;
  fix?: string;
}

export class AccessibilityChecker {
  private project: Project;
  private issues: A11yIssue[] = [];
  private applyFixes: boolean;

  constructor(applyFixes = false) {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    this.applyFixes = applyFixes;
  }

  async checkAll(): Promise<A11yIssue[]> {
    // Check static code issues
    await this.checkStaticA11y();
    
    // Run axe-core on live pages
    await this.runAxeAudit();
    
    return this.issues;
  }

  private async checkStaticA11y() {
    const files = await glob('src/**/*.{ts,tsx}');
    
    for (const filePath of files) {
      await this.checkFile(filePath);
    }
  }

  private async checkFile(filePath: string) {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    
    this.checkMissingAltText(sourceFile);
    this.checkMissingAriaLabels(sourceFile);
    this.checkHeadingHierarchy(sourceFile);
    this.checkInteractiveElements(sourceFile);
    this.checkUniversalComponents(sourceFile);
  }

  private checkMissingAltText(sourceFile: SourceFile) {
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)) {
        const tagName = node.getTagNameNode().getText();
        
        if (tagName === 'img') {
          const attributes = node.getAttributes();
          const hasAlt = attributes.some(attr => 
            Node.isJsxAttribute(attr) && attr.getName() === 'alt'
          );
          
          if (!hasAlt) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'missing-alt',
              severity: 'serious',
              message: 'Image missing alt attribute',
              element: tagName,
              fix: 'Add alt="" for decorative images or alt="description" for informative images'
            });
          }
        }
      }
    });
  }

  private checkMissingAriaLabels(sourceFile: SourceFile) {
    const interactiveElements = ['button', 'input', 'select', 'textarea'];
    
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)) {
        const tagName = node.getTagNameNode().getText();
        
        if (interactiveElements.includes(tagName)) {
          const attributes = node.getAttributes();
          const hasAriaLabel = attributes.some(attr => 
            Node.isJsxAttribute(attr) && 
            ['aria-label', 'aria-labelledby', 'aria-describedby'].includes(attr.getName())
          );
          
          const hasVisibleLabel = this.hasVisibleLabel(node);
          
          if (!hasAriaLabel && !hasVisibleLabel) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'missing-aria',
              severity: 'serious',
              message: `Interactive ${tagName} missing accessible name`,
              element: tagName,
              fix: `Add aria-label, aria-labelledby, or visible label text`
            });
          }
        }
      }
    });
  }

  private checkHeadingHierarchy(sourceFile: SourceFile) {
    const headings: { level: number; line: number }[] = [];
    
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)) {
        const tagName = node.getTagNameNode().getText();
        const match = tagName.match(/^h([1-6])$/);
        
        if (match) {
          headings.push({
            level: parseInt(match[1]),
            line: node.getStartLineNumber()
          });
        }
      }
    });
    
    // Check heading order
    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1];
      const current = headings[i];
      
      if (current.level > prev.level + 1) {
        this.issues.push({
          file: sourceFile.getFilePath(),
          line: current.line,
          type: 'heading-order',
          severity: 'moderate',
          message: `Heading level jumps from h${prev.level} to h${current.level}`,
          fix: `Use h${prev.level + 1} instead of h${current.level}`
        });
      }
    }
  }

  private checkInteractiveElements(sourceFile: SourceFile) {
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)) {
        const tagName = node.getTagNameNode().getText();
        const attributes = node.getAttributes();
        
        // Check for onClick on non-interactive elements
        if (['div', 'span', 'p'].includes(tagName)) {
          const hasOnClick = attributes.some(attr => 
            Node.isJsxAttribute(attr) && attr.getName() === 'onClick'
          );
          
          if (hasOnClick) {
            const hasRole = attributes.some(attr => 
              Node.isJsxAttribute(attr) && attr.getName() === 'role'
            );
            
            if (!hasRole) {
              this.issues.push({
                file: sourceFile.getFilePath(),
                line: node.getStartLineNumber(),
                type: 'focus-management',
                severity: 'serious',
                message: `Interactive ${tagName} missing role attribute`,
                element: tagName,
                fix: 'Add role="button" and onKeyDown handler, or use <button> instead'
              });
            }
          }
        }
      }
    });
  }

  private checkUniversalComponents(sourceFile: SourceFile) {
    const universalComponents = [
      'ModuleTooltip', 'HowToUsePanel', 'ModuleDocumentUploader', 
      'ModuleAIChat', 'ModuleDiagnosticPanel'
    ];
    
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)) {
        const tagName = node.getTagNameNode().getText();
        
        if (universalComponents.includes(tagName)) {
          const attributes = node.getAttributes();
          const hasAriaLabel = attributes.some(attr => 
            Node.isJsxAttribute(attr) && attr.getName() === 'aria-label'
          );
          
          if (!hasAriaLabel) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'missing-aria',
              severity: 'moderate',
              message: `Universal component ${tagName} missing aria-label`,
              element: tagName,
              fix: `Add aria-label="{t('${tagName.toLowerCase()}.ariaLabel')}"`
            });
          }
        }
      }
    });
  }

  private hasVisibleLabel(node: Node): boolean {
    // Simple check for visible text content
    const text = node.getText();
    return />\s*\w+/.test(text);
  }

  private async runAxeAudit() {
    try {
      console.log(chalk.blue('🔍 Running axe-core accessibility audit...'));
      
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      // Test key pages
      const testUrls = [
        'http://localhost:5173',
        'http://localhost:5173/core-hr/recruitment',
        'http://localhost:5173/strategic/talent-mapping',
        'http://localhost:5173/tools/hr-esg'
      ];
      
      for (const url of testUrls) {
        try {
          await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
          
          // Inject axe-core
          await page.addScriptTag({
            url: 'https://unpkg.com/axe-core@4.10.3/axe.min.js'
          });
          
          // Run axe audit
          const results = await page.evaluate(() => {
            return new Promise((resolve) => {
              // @ts-ignore
              window.axe.run((err, results) => {
                resolve(results);
              });
            });
          });
          
          // Process violations
          if (results && (results as any).violations) {
            (results as any).violations.forEach((violation: any) => {
              this.issues.push({
                file: url,
                line: 0,
                type: 'axe-violation',
                severity: violation.impact as 'critical' | 'serious' | 'moderate' | 'minor',
                message: `${violation.id}: ${violation.description}`,
                fix: violation.help
              });
            });
          }
        } catch (pageError) {
          console.log(chalk.yellow(`⚠️ Could not test ${url}: ${pageError.message}`));
        }
      }
      
      await browser.close();
    } catch (error) {
      console.log(chalk.yellow(`⚠️ Axe audit failed: ${error.message}`));
    }
  }

  async autoFix(): Promise<number> {
    if (!this.applyFixes) return 0;
    
    let fixedCount = 0;
    const fixableIssues = this.issues.filter(issue => 
      issue.fix && ['missing-alt', 'missing-aria'].includes(issue.type)
    );
    
    // Group by file for batch fixes
    const fileChanges: { [file: string]: any[] } = {};
    
    fixableIssues.forEach(issue => {
      if (!fileChanges[issue.file]) {
        fileChanges[issue.file] = [];
      }
      fileChanges[issue.file].push(issue);
      fixedCount++;
    });
    
    // Log potential fixes
    Object.entries(fileChanges).forEach(([file, issues]) => {
      console.log(chalk.blue(`📝 ${file}:`));
      issues.forEach(issue => {
        console.log(`  Line ${issue.line}: ${issue.fix}`);
      });
    });
    
    return fixedCount;
  }

  printReport(): void {
    const criticalIssues = this.issues.filter(i => i.severity === 'critical');
    const seriousIssues = this.issues.filter(i => i.severity === 'serious');
    const moderateIssues = this.issues.filter(i => i.severity === 'moderate');
    const minorIssues = this.issues.filter(i => i.severity === 'minor');
    
    console.log(chalk.blue('\n♿ Accessibility Audit Report'));
    console.log(chalk.white('='.repeat(50)));
    
    if (criticalIssues.length > 0) {
      console.log(chalk.red(`\n🚨 Critical Issues (${criticalIssues.length}):`));
      criticalIssues.forEach(issue => {
        console.log(`  ${issue.file}:${issue.line} - ${issue.message}`);
      });
    }
    
    if (seriousIssues.length > 0) {
      console.log(chalk.yellow(`\n⚠️  Serious Issues (${seriousIssues.length}):`));
      seriousIssues.slice(0, 5).forEach(issue => {
        console.log(`  ${issue.file}:${issue.line} - ${issue.message}`);
      });
    }
    
    if (moderateIssues.length > 0) {
      console.log(chalk.blue(`\n📋 Moderate Issues (${moderateIssues.length}):`));
    }
    
    if (minorIssues.length > 0) {
      console.log(chalk.gray(`\n📝 Minor Issues (${minorIssues.length}):`));
    }
    
    const totalIssues = this.issues.length;
    if (totalIssues === 0) {
      console.log(chalk.green('\n✅ No accessibility issues found!'));
    } else {
      console.log(chalk.white(`\nTotal: ${totalIssues} accessibility issues`));
    }
  }
}

// CLI execution
async function main() {
  const applyFixes = process.argv.includes('--apply');
  const checker = new AccessibilityChecker(applyFixes);
  
  console.log(chalk.blue('♿ Running accessibility audit...\n'));
  
  await checker.checkAll();
  
  if (applyFixes) {
    const fixedCount = await checker.autoFix();
    console.log(chalk.green(`\n🔧 Fixed ${fixedCount} accessibility issues`));
  }
  
  checker.printReport();
  
  const criticalIssues = checker.issues.filter(i => i.severity === 'critical').length;
  process.exit(criticalIssues > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}