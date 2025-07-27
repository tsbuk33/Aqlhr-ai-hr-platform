import { Project, SourceFile, Node, SyntaxKind } from 'ts-morph';
import { glob } from 'glob';
import chalk from 'chalk';

export interface LayoutIssue {
  file: string;
  line: number;
  column: number;
  type: 'missing-centered-layout' | 'conflicting-classes' | 'incorrect-width';
  message: string;
  fix?: string;
}

export class LayoutChecker {
  private project: Project;
  private issues: LayoutIssue[] = [];

  constructor() {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
  }

  async checkAll(): Promise<LayoutIssue[]> {
    const files = await glob('src/pages/**/*.{ts,tsx}');
    
    for (const filePath of files) {
      await this.checkFile(filePath);
    }

    return this.issues;
  }

  private async checkFile(filePath: string) {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    
    // Check for missing CenteredLayout usage
    this.checkCenteredLayoutUsage(sourceFile);
    
    // Check for conflicting Tailwind classes
    this.checkConflictingClasses(sourceFile);
    
    // Check for proper page structure
    this.checkPageStructure(sourceFile);
  }

  private checkCenteredLayoutUsage(sourceFile: SourceFile) {
    const imports = sourceFile.getImportDeclarations();
    const hasCenteredLayoutImport = imports.some(imp => 
      imp.getModuleSpecifierValue().includes('CenteredLayout')
    );

    // Check if this is a page component
    const filePath = sourceFile.getFilePath();
    if (filePath.includes('/pages/')) {
      const hasReturnStatement = sourceFile.getDescendantsOfKind(SyntaxKind.ReturnStatement).length > 0;
      
      if (hasReturnStatement && !hasCenteredLayoutImport) {
        this.issues.push({
          file: filePath,
          line: 1,
          column: 0,
          type: 'missing-centered-layout',
          message: 'Page component should use CenteredLayout',
          fix: `import CenteredLayout from '@/components/layout/CenteredLayout';`
        });
      }
    }
  }

  private checkConflictingClasses(sourceFile: SourceFile) {
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxAttribute(node) && node.getName() === 'className') {
        const value = node.getInitializer();
        if (Node.isStringLiteral(value)) {
          const classes = value.getLiteralValue();
          this.analyzeClasses(classes, sourceFile.getFilePath(), node.getStartLineNumber());
        }
      }
    });
  }

  private analyzeClasses(classes: string, filePath: string, line: number) {
    const classArray = classes.split(/\s+/).filter(Boolean);
    
    // Check for conflicting text alignment
    const textAlignClasses = classArray.filter(c => c.match(/^text-(left|right|center)$/));
    if (textAlignClasses.length > 1) {
      this.issues.push({
        file: filePath,
        line,
        column: 0,
        type: 'conflicting-classes',
        message: `Conflicting text alignment classes: ${textAlignClasses.join(', ')}`,
        fix: 'text-center'
      });
    }

    // Check for conflicting flex direction
    const flexDirectionClasses = classArray.filter(c => c.match(/^flex-(row|col|row-reverse|col-reverse)$/));
    if (flexDirectionClasses.length > 1) {
      this.issues.push({
        file: filePath,
        line,
        column: 0,
        type: 'conflicting-classes',
        message: `Conflicting flex direction classes: ${flexDirectionClasses.join(', ')}`,
      });
    }

    // Check for conflicting justify/align
    const justifyClasses = classArray.filter(c => c.startsWith('justify-'));
    const alignClasses = classArray.filter(c => c.startsWith('items-'));
    
    if (justifyClasses.length > 1) {
      this.issues.push({
        file: filePath,
        line,
        column: 0,
        type: 'conflicting-classes',
        message: `Multiple justify classes: ${justifyClasses.join(', ')}`,
        fix: 'justify-center'
      });
    }

    if (alignClasses.length > 1) {
      this.issues.push({
        file: filePath,
        line,
        column: 0,
        type: 'conflicting-classes',
        message: `Multiple items classes: ${alignClasses.join(', ')}`,
        fix: 'items-center'
      });
    }
  }

  private checkPageStructure(sourceFile: SourceFile) {
    // Check for proper page width constraints
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxElement(node)) {
        const tagName = node.getOpeningElement().getTagNameNode().getText();
        if (tagName === 'div') {
          const classAttr = node.getOpeningElement().getAttribute('className');
          if (classAttr && Node.isJsxAttribute(classAttr)) {
            const value = classAttr.getInitializer();
            if (Node.isStringLiteral(value)) {
              const classes = value.getLiteralValue();
              if (classes.includes('min-h-screen') && !classes.includes('max-w-')) {
                this.issues.push({
                  file: sourceFile.getFilePath(),
                  line: node.getStartLineNumber(),
                  column: node.getStart(),
                  type: 'incorrect-width',
                  message: 'Full-height container should have max-width constraint',
                  fix: 'max-w-screen-xl'
                });
              }
            }
          }
        }
      }
    });
  }

  async autoFix(): Promise<number> {
    let fixedCount = 0;
    
    // Group issues by file for efficient fixing
    const issuesByFile = new Map<string, LayoutIssue[]>();
    for (const issue of this.issues) {
      if (!issuesByFile.has(issue.file)) {
        issuesByFile.set(issue.file, []);
      }
      issuesByFile.get(issue.file)!.push(issue);
    }

    // Apply fixes file by file
    for (const [filePath, fileIssues] of issuesByFile) {
      const sourceFile = this.project.getSourceFile(filePath);
      if (sourceFile) {
        for (const issue of fileIssues) {
          if (issue.fix) {
            await this.applyFix(sourceFile, issue);
            fixedCount++;
          }
        }
        await sourceFile.save();
      }
    }

    return fixedCount;
  }

  private async applyFix(sourceFile: SourceFile, issue: LayoutIssue) {
    switch (issue.type) {
      case 'missing-centered-layout':
        // Add CenteredLayout import
        sourceFile.addImportDeclaration({
          moduleSpecifier: '@/components/layout/CenteredLayout',
          defaultImport: 'CenteredLayout'
        });
        break;
        
      case 'conflicting-classes':
        // Find and replace conflicting classes
        sourceFile.forEachDescendant((node) => {
          if (Node.isJsxAttribute(node) && node.getName() === 'className') {
            const value = node.getInitializer();
            if (Node.isStringLiteral(value) && node.getStartLineNumber() === issue.line) {
              let classes = value.getLiteralValue();
              
              // Apply the fix
              if (issue.fix === 'text-center') {
                classes = classes.replace(/text-(left|right)/g, '').replace(/\s+/g, ' ').trim();
                if (!classes.includes('text-center')) {
                  classes += ' text-center';
                }
              } else if (issue.fix === 'justify-center') {
                classes = classes.replace(/justify-\w+/g, '').replace(/\s+/g, ' ').trim();
                if (!classes.includes('justify-center')) {
                  classes += ' justify-center';
                }
              } else if (issue.fix === 'items-center') {
                classes = classes.replace(/items-\w+/g, '').replace(/\s+/g, ' ').trim();
                if (!classes.includes('items-center')) {
                  classes += ' items-center';
                }
              }
              
              value.setLiteralValue(classes.trim());
            }
          }
        });
        break;
        
      case 'incorrect-width':
        // Add max-width constraint
        sourceFile.forEachDescendant((node) => {
          if (Node.isJsxAttribute(node) && node.getName() === 'className') {
            const value = node.getInitializer();
            if (Node.isStringLiteral(value) && node.getStartLineNumber() === issue.line) {
              let classes = value.getLiteralValue();
              if (!classes.includes('max-w-') && issue.fix) {
                classes += ` ${issue.fix}`;
                value.setLiteralValue(classes.trim());
              }
            }
          }
        });
        break;
    }
  }
}