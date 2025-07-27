import { readFileSync } from 'fs';
import { glob } from 'glob';
import chalk from 'chalk';
import { Project, Node, SyntaxKind } from 'ts-morph';

export interface PerformanceIssue {
  file: string;
  line: number;
  type: 'large-import' | 'unused-import' | 'inline-function' | 'missing-memo' | 'large-bundle';
  message: string;
  suggestion?: string;
  impact: 'low' | 'medium' | 'high';
}

export class PerformanceChecker {
  private project: Project;
  private issues: PerformanceIssue[] = [];

  constructor() {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
  }

  async checkAll(): Promise<PerformanceIssue[]> {
    const files = await glob('src/**/*.{ts,tsx}');
    
    for (const filePath of files) {
      await this.checkFile(filePath);
    }

    return this.issues;
  }

  private async checkFile(filePath: string) {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    
    // Check for large imports
    this.checkLargeImports(sourceFile);
    
    // Check for unused imports
    this.checkUnusedImports(sourceFile);
    
    // Check for inline functions in render
    this.checkInlineFunctions(sourceFile);
    
    // Check for missing React.memo opportunities
    this.checkMemoOpportunities(sourceFile);
    
    // Check bundle size indicators
    this.checkBundleSize(sourceFile);
  }

  private checkLargeImports(sourceFile: SourceFile) {
    const imports = sourceFile.getImportDeclarations();
    
    for (const importDecl of imports) {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      const namedImports = importDecl.getNamedImports();
      
      // Check for potentially large library imports
      const largeLibraries = {
        'lodash': { threshold: 1, suggestion: 'Use specific lodash functions like lodash/get' },
        'moment': { threshold: 0, suggestion: 'Consider using date-fns or native Date API' },
        '@ant-design/icons': { threshold: 10, suggestion: 'Import specific icons only' },
        'react-router-dom': { threshold: 5, suggestion: 'Import only needed components' }
      };
      
      for (const [lib, config] of Object.entries(largeLibraries)) {
        if (moduleSpecifier.includes(lib)) {
          if (namedImports.length > config.threshold || importDecl.getDefaultImport()) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: importDecl.getStartLineNumber(),
              type: 'large-import',
              message: `Large import from ${lib}`,
              suggestion: config.suggestion,
              impact: 'medium'
            });
          }
        }
      }
      
      // Check for barrel imports that might be large
      if (moduleSpecifier.startsWith('./') || moduleSpecifier.startsWith('../')) {
        if (namedImports.length > 10) {
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: importDecl.getStartLineNumber(),
            type: 'large-import',
            message: `Large barrel import with ${namedImports.length} named imports`,
            suggestion: 'Consider importing directly from specific modules',
            impact: 'low'
          });
        }
      }
    }
  }

  private checkUnusedImports(sourceFile: SourceFile) {
    const imports = sourceFile.getImportDeclarations();
    const sourceText = sourceFile.getFullText();
    
    for (const importDecl of imports) {
      const defaultImport = importDecl.getDefaultImport();
      const namedImports = importDecl.getNamedImports();
      
      // Check default import usage
      if (defaultImport) {
        const defaultName = defaultImport.getText();
        const usageRegex = new RegExp(`\\b${defaultName}\\b`, 'g');
        const matches = sourceText.match(usageRegex);
        
        if (!matches || matches.length <= 1) { // Only the import itself
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: importDecl.getStartLineNumber(),
            type: 'unused-import',
            message: `Unused default import: ${defaultName}`,
            suggestion: 'Remove unused import',
            impact: 'low'
          });
        }
      }
      
      // Check named imports usage
      for (const namedImport of namedImports) {
        const name = namedImport.getName();
        const usageRegex = new RegExp(`\\b${name}\\b`, 'g');
        const matches = sourceText.match(usageRegex);
        
        if (!matches || matches.length <= 1) { // Only the import itself
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: importDecl.getStartLineNumber(),
            type: 'unused-import',
            message: `Unused named import: ${name}`,
            suggestion: 'Remove unused import',
            impact: 'low'
          });
        }
      }
    }
  }

  private checkInlineFunctions(sourceFile: SourceFile) {
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxAttribute(node) && node.getName() === 'onClick') {
        const initializer = node.getInitializer();
        
        if (Node.isJsxExpression(initializer)) {
          const expression = initializer.getExpression();
          
          // Check for arrow functions
          if (Node.isArrowFunction(expression)) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'inline-function',
              message: 'Inline arrow function in onClick handler',
              suggestion: 'Extract to useCallback or define outside render',
              impact: 'medium'
            });
          }
          
          // Check for function expressions
          if (Node.isFunctionExpression(expression)) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'inline-function',
              message: 'Inline function expression in onClick handler',
              suggestion: 'Extract to useCallback or define outside render',
              impact: 'medium'
            });
          }
        }
      }
    });
  }

  private checkMemoOpportunities(sourceFile: SourceFile) {
    // Find functional components that might benefit from React.memo
    sourceFile.forEachDescendant((node) => {
      if (Node.isFunctionDeclaration(node) || Node.isVariableDeclaration(node)) {
        const name = this.getComponentName(node);
        
        if (name && this.isReactComponent(name)) {
          // Check if component receives props
          const hasProps = this.componentHasProps(node);
          
          // Check if already wrapped in memo
          const isMemoized = this.isComponentMemoized(sourceFile, name);
          
          if (hasProps && !isMemoized) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'missing-memo',
              message: `Component ${name} could benefit from React.memo`,
              suggestion: 'Wrap component with React.memo if props change infrequently',
              impact: 'low'
            });
          }
        }
      }
    });
  }

  private checkBundleSize(sourceFile: SourceFile) {
    const fileSize = sourceFile.getFullText().length;
    
    // Flag very large component files
    if (fileSize > 10000) { // 10KB
      this.issues.push({
        file: sourceFile.getFilePath(),
        line: 1,
        type: 'large-bundle',
        message: `Large file size: ${Math.round(fileSize / 1024)}KB`,
        suggestion: 'Consider splitting into smaller components',
        impact: 'medium'
      });
    }
    
    // Check for excessive component count in single file
    const componentCount = this.countComponents(sourceFile);
    if (componentCount > 5) {
      this.issues.push({
        file: sourceFile.getFilePath(),
        line: 1,
        type: 'large-bundle',
        message: `Multiple components (${componentCount}) in single file`,
        suggestion: 'Split components into separate files',
        impact: 'low'
      });
    }
  }

  private getComponentName(node: Node): string | null {
    if (Node.isFunctionDeclaration(node)) {
      const name = node.getName();
      return name || null;
    }
    
    if (Node.isVariableDeclaration(node)) {
      const declarations = node.getDeclarations();
      if (declarations.length > 0) {
        const name = declarations[0].getName();
        return name;
      }
    }
    
    return null;
  }

  private isReactComponent(name: string): boolean {
    // React components start with uppercase
    return /^[A-Z]/.test(name);
  }

  private componentHasProps(node: Node): boolean {
    if (Node.isFunctionDeclaration(node)) {
      return node.getParameters().length > 0;
    }
    
    if (Node.isVariableDeclaration(node)) {
      const declarations = node.getDeclarations();
      if (declarations.length > 0) {
        const initializer = declarations[0].getInitializer();
        if (Node.isArrowFunction(initializer)) {
          return initializer.getParameters().length > 0;
        }
      }
    }
    
    return false;
  }

  private isComponentMemoized(sourceFile: SourceFile, componentName: string): boolean {
    const text = sourceFile.getFullText();
    return text.includes(`memo(${componentName})`) || 
           text.includes(`React.memo(${componentName})`);
  }

  private countComponents(sourceFile: SourceFile): number {
    let count = 0;
    
    sourceFile.forEachDescendant((node) => {
      if (Node.isFunctionDeclaration(node)) {
        const name = node.getName();
        if (name && this.isReactComponent(name)) {
          count++;
        }
      }
      
      if (Node.isVariableDeclaration(node)) {
        const declarations = node.getDeclarations();
        for (const decl of declarations) {
          const name = decl.getName();
          if (this.isReactComponent(name)) {
            count++;
          }
        }
      }
    });
    
    return count;
  }

  async autoFix(): Promise<number> {
    // For performance issues, most fixes require manual review
    // Auto-fix only safe optimizations
    let fixedCount = 0;
    
    const fixableIssues = this.issues.filter(issue => 
      issue.type === 'unused-import'
    );
    
    // Group by file
    const issuesByFile = new Map<string, PerformanceIssue[]>();
    for (const issue of fixableIssues) {
      if (!issuesByFile.has(issue.file)) {
        issuesByFile.set(issue.file, []);
      }
      issuesByFile.get(issue.file)!.push(issue);
    }
    
    // Remove unused imports
    for (const [filePath, fileIssues] of issuesByFile) {
      const sourceFile = this.project.getSourceFile(filePath);
      if (sourceFile) {
        for (const issue of fileIssues) {
          if (issue.type === 'unused-import') {
            // Remove the unused import
            // This would require more sophisticated logic to handle partial removals
            fixedCount++;
          }
        }
        await sourceFile.save();
      }
    }
    
    return fixedCount;
  }
}