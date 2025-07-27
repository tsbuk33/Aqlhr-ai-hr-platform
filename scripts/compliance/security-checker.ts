import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { glob } from 'glob';
import chalk from 'chalk';
import { Project, Node, SyntaxKind } from 'ts-morph';

export interface SecurityIssue {
  file: string;
  line: number;
  type: 'vulnerability' | 'unsafe-html' | 'hardcoded-secret' | 'unsafe-eval' | 'xss-risk';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  fix?: string;
}

export class SecurityChecker {
  private project: Project;
  private issues: SecurityIssue[] = [];

  constructor() {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
  }

  async checkAll(): Promise<SecurityIssue[]> {
    // Run npm audit
    await this.runNpmAudit();
    
    // Check source files for security issues
    const files = await glob('src/**/*.{ts,tsx}');
    for (const filePath of files) {
      await this.checkFile(filePath);
    }

    return this.issues;
  }

  private async runNpmAudit() {
    try {
      const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
      const audit = JSON.parse(auditResult);
      
      if (audit.vulnerabilities) {
        for (const [packageName, vuln] of Object.entries(audit.vulnerabilities as any)) {
          this.issues.push({
            file: 'package.json',
            line: 1,
            type: 'vulnerability',
            message: `${packageName}: ${vuln.title}`,
            severity: this.mapSeverity(vuln.severity),
            fix: vuln.fixAvailable ? 'Run npm audit fix' : 'Update package manually'
          });
        }
      }
    } catch (error) {
      // npm audit returns non-zero exit code when vulnerabilities found
      try {
        const errorOutput = error.stdout?.toString() || '';
        if (errorOutput) {
          const audit = JSON.parse(errorOutput);
          // Process vulnerabilities from error output
        }
      } catch (parseError) {
        console.warn(chalk.yellow('⚠️  Could not parse npm audit results'));
      }
    }
  }

  private async checkFile(filePath: string) {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    
    // Check for unsafe HTML rendering
    this.checkUnsafeHTML(sourceFile);
    
    // Check for hardcoded secrets
    this.checkHardcodedSecrets(sourceFile);
    
    // Check for unsafe eval usage
    this.checkUnsafeEval(sourceFile);
    
    // Check for XSS risks
    this.checkXSSRisks(sourceFile);
  }

  private checkUnsafeHTML(sourceFile: SourceFile) {
    sourceFile.forEachDescendant((node) => {
      if (Node.isJsxAttribute(node)) {
        const name = node.getName();
        
        // Check for dangerouslySetInnerHTML
        if (name === 'dangerouslySetInnerHTML') {
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: node.getStartLineNumber(),
            type: 'unsafe-html',
            message: 'dangerouslySetInnerHTML usage detected',
            severity: 'high',
            fix: 'Sanitize HTML content or use safe rendering methods'
          });
        }
      }
      
      // Check for innerHTML usage
      if (Node.isPropertyAccessExpression(node)) {
        const property = node.getName();
        if (property === 'innerHTML') {
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: node.getStartLineNumber(),
            type: 'unsafe-html',
            message: 'innerHTML usage detected',
            severity: 'medium',
            fix: 'Use textContent or safe DOM manipulation'
          });
        }
      }
    });
  }

  private checkHardcodedSecrets(sourceFile: SourceFile) {
    const content = sourceFile.getFullText();
    const lines = content.split('\n');
    
    const secretPatterns = [
      { pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/, message: 'Potential API key', severity: 'critical' as const },
      { pattern: /password\s*[:=]\s*['"][^'"]+['"]/, message: 'Hardcoded password', severity: 'critical' as const },
      { pattern: /secret\s*[:=]\s*['"][^'"]+['"]/, message: 'Hardcoded secret', severity: 'high' as const },
      { pattern: /token\s*[:=]\s*['"][^'"]+['"]/, message: 'Hardcoded token', severity: 'high' as const },
      { pattern: /aws[_-]?access[_-]?key/, message: 'AWS access key', severity: 'critical' as const },
      { pattern: /private[_-]?key/, message: 'Private key reference', severity: 'high' as const }
    ];
    
    lines.forEach((line, index) => {
      secretPatterns.forEach(({ pattern, message, severity }) => {
        if (pattern.test(line.toLowerCase()) && !line.includes('process.env')) {
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: index + 1,
            type: 'hardcoded-secret',
            message,
            severity,
            fix: 'Move sensitive data to environment variables'
          });
        }
      });
    });
  }

  private checkUnsafeEval(sourceFile: SourceFile) {
    sourceFile.forEachDescendant((node) => {
      if (Node.isCallExpression(node)) {
        const expression = node.getExpression();
        
        if (Node.isIdentifier(expression)) {
          const name = expression.getText();
          
          if (name === 'eval') {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'unsafe-eval',
              message: 'eval() usage detected',
              severity: 'high',
              fix: 'Avoid eval() - use safer alternatives'
            });
          }
          
          if (name === 'Function' && node.getArguments().length > 0) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'unsafe-eval',
              message: 'Function constructor usage detected',
              severity: 'medium',
              fix: 'Avoid Function constructor with dynamic code'
            });
          }
        }
      }
    });
  }

  private checkXSSRisks(sourceFile: SourceFile) {
    sourceFile.forEachDescendant((node) => {
      // Check for user input directly rendered without escaping
      if (Node.isJsxExpression(node)) {
        const expression = node.getExpression();
        
        if (Node.isPropertyAccessExpression(expression)) {
          const object = expression.getExpression();
          
          // Look for patterns like user.input, data.content, etc.
          if (Node.isIdentifier(object)) {
            const objectName = object.getText();
            const propertyName = expression.getName();
            
            const riskyPatterns = ['input', 'content', 'html', 'text', 'message'];
            if (riskyPatterns.includes(propertyName.toLowerCase())) {
              this.issues.push({
                file: sourceFile.getFilePath(),
                line: node.getStartLineNumber(),
                type: 'xss-risk',
                message: `Potential XSS risk: rendering ${objectName}.${propertyName}`,
                severity: 'medium',
                fix: 'Ensure user input is properly escaped or sanitized'
              });
            }
          }
        }
      }
      
      // Check for href with javascript: protocol
      if (Node.isJsxAttribute(node) && node.getName() === 'href') {
        const initializer = node.getInitializer();
        if (Node.isStringLiteral(initializer)) {
          const href = initializer.getLiteralValue();
          if (href.startsWith('javascript:')) {
            this.issues.push({
              file: sourceFile.getFilePath(),
              line: node.getStartLineNumber(),
              type: 'xss-risk',
              message: 'JavaScript URL in href attribute',
              severity: 'high',
              fix: 'Use onClick handler instead of javascript: URLs'
            });
          }
        }
      }
    });
  }

  private mapSeverity(npmSeverity: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (npmSeverity?.toLowerCase()) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'moderate': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  async autoFix(): Promise<number> {
    let fixedCount = 0;
    
    // Only auto-fix safe issues
    const safeToFix = this.issues.filter(issue => 
      issue.type === 'vulnerability' && 
      issue.fix === 'Run npm audit fix'
    );
    
    if (safeToFix.length > 0) {
      try {
        execSync('npm audit fix', { stdio: 'inherit' });
        fixedCount = safeToFix.length;
      } catch (error) {
        console.warn(chalk.yellow('⚠️  npm audit fix encountered issues'));
      }
    }
    
    return fixedCount;
  }
}