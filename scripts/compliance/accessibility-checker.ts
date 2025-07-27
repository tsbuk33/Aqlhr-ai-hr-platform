import { readFileSync } from 'fs';
import { glob } from 'glob';
import chalk from 'chalk';
import { Project, Node, SyntaxKind } from 'ts-morph';

export interface A11yIssue {
  file: string;
  line: number;
  type: 'missing-alt' | 'missing-aria-label' | 'missing-role' | 'invalid-heading-order' | 'color-only-info';
  message: string;
  element?: string;
  fix?: string;
}

export class AccessibilityChecker {
  private project: Project;
  private issues: A11yIssue[] = [];

  constructor() {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
  }

  async checkAll(): Promise<A11yIssue[]> {
    const files = await glob('src/**/*.{ts,tsx}');
    
    for (const filePath of files) {
      await this.checkFile(filePath);
    }

    return this.issues;
  }

  private async checkFile(filePath: string) {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    
    // Check for missing alt attributes
    this.checkMissingAltText(sourceFile);
    
    // Check for missing ARIA labels
    this.checkMissingAriaLabels(sourceFile);
    
    // Check for proper heading hierarchy
    this.checkHeadingHierarchy(sourceFile);
    
    // Check for interactive elements without proper roles
    this.checkInteractiveElements(sourceFile);
    
    // Check for color-only information
    this.checkColorOnlyInfo(sourceFile);
  }

  private checkMissingAltText(sourceFile: SourceFile) {
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxSelfClosingElement(node) || Node.isJsxOpeningElement(node)) {
        const tagName = node.getTagNameNode().getText();
        
        if (tagName === 'img') {
          const altAttr = node.getAttribute('alt');
          const srcAttr = node.getAttribute('src');
          
          if (!altAttr && srcAttr) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'missing-alt',
              message: 'Image missing alt attribute',
              element: 'img',
              fix: 'alt="Descriptive text for the image"'
            });
          }
        }
      }
    });
  }

  private checkMissingAriaLabels(sourceFile: SourceFile) {
    const interactiveElements = ['button', 'input', 'select', 'textarea'];
    
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxSelfClosingElement(node) || Node.isJsxOpeningElement(node)) {
        const tagName = node.getTagNameNode().getText();
        
        if (interactiveElements.includes(tagName)) {
          const ariaLabel = node.getAttribute('aria-label');
          const ariaLabelledBy = node.getAttribute('aria-labelledby');
          const title = node.getAttribute('title');
          
          // Check if element has any form of accessible name
          const hasAccessibleName = ariaLabel || ariaLabelledBy || title;
          
          // For inputs, check if there's a label element
          let hasLabel = false;
          if (tagName === 'input') {
            const id = node.getAttribute('id');
            if (id) {
              // Look for label with for attribute
              sourceFile.forEachDescendant((labelNode) => {
                if (Node.isJsxOpeningElement(labelNode) && 
                    labelNode.getTagNameNode().getText() === 'label') {
                  const forAttr = labelNode.getAttribute('for') || labelNode.getAttribute('htmlFor');
                  if (forAttr && Node.isJsxAttribute(forAttr)) {
                    const forValue = forAttr.getInitializer();
                    if (Node.isStringLiteral(forValue)) {
                      hasLabel = true;
                    }
                  }
                }
              });
            }
          }
          
          if (!hasAccessibleName && !hasLabel) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'missing-aria-label',
              message: `${tagName} element missing accessible name`,
              element: tagName,
              fix: 'aria-label="Descriptive label"'
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
        const headingMatch = tagName.match(/^h([1-6])$/);
        
        if (headingMatch) {
          const level = parseInt(headingMatch[1]);
          headings.push({ level, line: node.getStartLineNumber() });
        }
      }
    });
    
    // Check heading hierarchy
    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1];
      const curr = headings[i];
      
      if (curr.level > prev.level + 1) {
        this.issues.push({
          file: sourceFile.getFilePath(),
          line: curr.line,
          type: 'invalid-heading-order',
          message: `Heading level jumps from h${prev.level} to h${curr.level}`,
          element: `h${curr.level}`,
          fix: `Use h${prev.level + 1} instead`
        });
      }
    }
  }

  private checkInteractiveElements(sourceFile: SourceFile) {
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxOpeningElement(node) || Node.isJsxSelfClosingElement(node)) {
        const tagName = node.getTagNameNode().getText();
        
        // Check for divs with click handlers that should be buttons
        if (tagName === 'div') {
          const onClick = node.getAttribute('onClick');
          const role = node.getAttribute('role');
          
          if (onClick && !role) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'missing-role',
              message: 'Interactive div missing role attribute',
              element: 'div',
              fix: 'role="button" or use <button> element'
            });
          }
        }
        
        // Check for buttons without type attribute in forms
        if (tagName === 'button') {
          const type = node.getAttribute('type');
          if (!type) {
            // Check if button is inside a form
            let parent = node.getParent();
            let insideForm = false;
            while (parent) {
              if (Node.isJsxOpeningElement(parent) && 
                  parent.getTagNameNode().getText() === 'form') {
                insideForm = true;
                break;
              }
              parent = parent.getParent();
            }
            
            if (insideForm) {
              this.issues.push({
                file: sourceFile.getFilePath(),
                line: node.getStartLineNumber(),
                type: 'missing-role',
                message: 'Button in form missing type attribute',
                element: 'button',
                fix: 'type="button" or type="submit"'
              });
            }
          }
        }
      }
    });
  }

  private checkColorOnlyInfo(sourceFile: SourceFile) {
    const content = sourceFile.getFullText();
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // Look for patterns that might indicate color-only information
      const colorOnlyPatterns = [
        /className.*text-(red|green|yellow|blue)-\d+.*>.*\w+.*</,
        /style.*color:\s*(red|green|blue|#[0-9a-f]{3,6}).*>.*\w+.*</i
      ];
      
      colorOnlyPatterns.forEach(pattern => {
        if (pattern.test(line) && !line.includes('icon') && !line.includes('Icon')) {
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: index + 1,
            type: 'color-only-info',
            message: 'Information conveyed by color only',
            fix: 'Add icon, text, or other visual indicator'
          });
        }
      });
    });
  }

  async autoFix(): Promise<number> {
    let fixedCount = 0;
    
    // Group issues by file for efficient fixing
    const issuesByFile = new Map<string, A11yIssue[]>();
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
          if (this.canAutoFix(issue)) {
            await this.applyFix(sourceFile, issue);
            fixedCount++;
          }
        }
        await sourceFile.save();
      }
    }

    return fixedCount;
  }

  private canAutoFix(issue: A11yIssue): boolean {
    return issue.type === 'missing-alt' || 
           issue.type === 'missing-aria-label' ||
           (issue.type === 'missing-role' && issue.element === 'button');
  }

  private async applyFix(sourceFile: SourceFile, issue: A11yIssue) {
    sourceFile.forEachDescendant((node) => {
      if ((Node.isJsxSelfClosingElement(node) || Node.isJsxOpeningElement(node)) &&
          node.getStartLineNumber() === issue.line) {
        
        switch (issue.type) {
          case 'missing-alt':
            if (issue.element === 'img') {
              node.addAttribute({
                name: 'alt',
                initializer: '"Image description"'
              });
            }
            break;
            
          case 'missing-aria-label':
            node.addAttribute({
              name: 'aria-label',
              initializer: '"Accessible label"'
            });
            break;
            
          case 'missing-role':
            if (issue.element === 'button') {
              node.addAttribute({
                name: 'type',
                initializer: '"button"'
              });
            } else if (issue.element === 'div') {
              node.addAttribute({
                name: 'role',
                initializer: '"button"'
              });
            }
            break;
        }
      }
    });
  }
}