#!/usr/bin/env tsx

import { Project, SourceFile, Node } from 'ts-morph';
import { glob } from 'glob';
import { readFileSync } from 'fs';
import chalk from 'chalk';

interface ErrorHandlingIssue {
  file: string;
  line: number;
  type: 'missing-loading' | 'missing-error' | 'missing-boundary' | 'unsafe-async' | 'missing-fallback';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  component?: string;
  fix?: string;
}

export class ErrorHandlingChecker {
  private project: Project;
  private issues: ErrorHandlingIssue[] = [];

  constructor() {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
  }

  async checkAll(): Promise<ErrorHandlingIssue[]> {
    const files = await glob('src/**/*.{ts,tsx}');
    
    for (const filePath of files) {
      await this.checkFile(filePath);
    }
    
    return this.issues;
  }

  private async checkFile(filePath: string) {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    
    this.checkUniversalComponents(sourceFile);
    this.checkAsyncOperations(sourceFile);
    this.checkErrorBoundaries(sourceFile);
    this.checkLoadingStates(sourceFile);
  }

  private checkUniversalComponents(sourceFile: SourceFile) {
    const universalComponents = [
      'ModuleDocumentUploader',
      'ModuleAIChat', 
      'ModuleDiagnosticPanel',
      'HowToUsePanel'
    ];
    
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)) {
        const tagName = node.getTagNameNode().getText();
        
        if (universalComponents.includes(tagName)) {
          const fileContent = sourceFile.getFullText();
          
          // Check for loading state
          if (!this.hasLoadingState(fileContent, tagName)) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'missing-loading',
              severity: 'warning',
              message: `${tagName} missing loading state`,
              component: tagName,
              fix: 'Add loading spinner or skeleton while data loads'
            });
          }
          
          // Check for error state
          if (!this.hasErrorState(fileContent, tagName)) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'missing-error',
              severity: 'warning',
              message: `${tagName} missing error state`,
              component: tagName,
              fix: 'Add error handling and retry mechanism'
            });
          }
        }
      }
    });
  }

  private checkAsyncOperations(sourceFile: SourceFile) {
    sourceFile.forEachDescendant((node) => {
      // Check for unhandled async operations
      if (Node.isAwaitExpression(node)) {
        const parent = node.getParent();
        
        // Check if await is inside try-catch
        let hasTryCatch = false;
        let currentParent = parent;
        
        while (currentParent) {
          if (Node.isTryStatement(currentParent)) {
            hasTryCatch = true;
            break;
          }
          currentParent = currentParent.getParent();
        }
        
        if (!hasTryCatch) {
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: node.getStartLineNumber(),
            type: 'unsafe-async',
            severity: 'warning',
            message: 'Await expression not wrapped in try-catch',
            fix: 'Wrap async operations in try-catch blocks'
          });
        }
      }
      
      // Check for .catch() on promises
      if (Node.isCallExpression(node)) {
        const expression = node.getExpression();
        if (Node.isPropertyAccessExpression(expression)) {
          const name = expression.getName();
          if (['then', 'fetch'].includes(name)) {
            const text = node.getText();
            if (!text.includes('.catch(')) {
              this.issues.push({
                file: sourceFile.getFilePath(),
                line: node.getStartLineNumber(),
                type: 'unsafe-async',
                severity: 'info',
                message: 'Promise not handling rejection',
                fix: 'Add .catch() handler or use try-catch with await'
              });
            }
          }
        }
      }
    });
  }

  private checkErrorBoundaries(sourceFile: SourceFile) {
    const content = sourceFile.getFullText();
    
    // Check if this is a page component that should have error boundary
    if (sourceFile.getFilePath().includes('/pages/') && 
        content.includes('export default') &&
        !content.includes('ErrorBoundary')) {
      
      this.issues.push({
        file: sourceFile.getFilePath(),
        line: 1,
        type: 'missing-boundary',
        severity: 'info',
        message: 'Page component missing error boundary',
        fix: 'Wrap page content in <ErrorBoundary> component'
      });
    }
  }

  private checkLoadingStates(sourceFile: SourceFile) {
    const content = sourceFile.getFullText();
    
    // Check for data fetching without loading states
    if ((content.includes('useQuery') || content.includes('useState')) &&
        content.includes('loading') === false &&
        content.includes('isLoading') === false) {
      
      // Check if there's any loading UI
      const hasLoadingUI = /loading|spinner|skeleton|Loader/i.test(content);
      
      if (!hasLoadingUI) {
        this.issues.push({
          file: sourceFile.getFilePath(),
          line: 1,
          type: 'missing-loading',
          severity: 'info',
          message: 'Component with state management missing loading UI',
          fix: 'Add loading spinner or skeleton screens'
        });
      }
    }
  }

  private hasLoadingState(content: string, component: string): boolean {
    const loadingPatterns = [
      /loading/i,
      /isLoading/i,
      /pending/i,
      /spinner/i,
      /skeleton/i,
      /Loader/,
      /<Loading/
    ];
    
    return loadingPatterns.some(pattern => pattern.test(content));
  }

  private hasErrorState(content: string, component: string): boolean {
    const errorPatterns = [
      /error/i,
      /hasError/i,
      /isError/i,
      /catch/i,
      /Error.*component/i,
      /try.*catch/i
    ];
    
    return errorPatterns.some(pattern => pattern.test(content));
  }

  async autoFix(): Promise<number> {
    // For now, just log what could be fixed
    const fixableIssues = this.issues.filter(issue => 
      ['missing-loading', 'missing-error'].includes(issue.type)
    );
    
    console.log(chalk.blue(`🔧 Could auto-fix ${fixableIssues.length} error handling issues`));
    console.log(chalk.yellow('Note: Auto-fix templates would inject standard loading/error components'));
    
    return fixableIssues.length;
  }

  printReport(): void {
    const criticalIssues = this.issues.filter(i => i.severity === 'critical');
    const warningIssues = this.issues.filter(i => i.severity === 'warning');
    const infoIssues = this.issues.filter(i => i.severity === 'info');
    
    console.log(chalk.blue('\n🛡️  Error Handling & Loading States Report'));
    console.log(chalk.white('='.repeat(50)));
    
    if (criticalIssues.length > 0) {
      console.log(chalk.red(`\n🚨 Critical Issues (${criticalIssues.length}):`));
      criticalIssues.forEach(issue => {
        console.log(`  ${issue.file}:${issue.line} - ${issue.message}`);
        if (issue.component) {
          console.log(`    Component: ${issue.component}`);
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
      console.log(chalk.blue(`\n📋 Recommendations (${infoIssues.length}):`));
      infoIssues.slice(0, 5).forEach(issue => {
        console.log(`  ${issue.file}:${issue.line} - ${issue.message}`);
      });
    }
    
    const totalIssues = this.issues.length;
    if (totalIssues === 0) {
      console.log(chalk.green('\n✅ All components have proper error handling!'));
    } else {
      console.log(chalk.white(`\nTotal: ${totalIssues} error handling issues`));
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
  const checker = new ErrorHandlingChecker();
  
  console.log(chalk.blue('🛡️  Checking error handling and loading states...\n'));
  
  await checker.checkAll();
  
  const applyFixes = process.argv.includes('--apply');
  if (applyFixes) {
    const fixedCount = await checker.autoFix();
    console.log(chalk.green(`\n🔧 Could fix ${fixedCount} error handling issues`));
  }
  
  checker.printReport();
  
  const criticalIssues = checker.issues.filter(i => i.severity === 'critical').length;
  process.exit(criticalIssues > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}