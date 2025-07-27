#!/usr/bin/env tsx

import { Project, SyntaxKind, StringLiteral, JsxText, JsxAttribute } from 'ts-morph';
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';

// Configuration for LTR/RTL compliance checking
interface ComplianceConfig {
  scanPatterns: string[];
  localePatterns: {
    english: string[];
    arabic: string[];
  };
  translationFiles: {
    english: string;
    arabic: string;
  };
  outputReport: string;
  keyPrefix: string;
  autoFix: boolean;
  failOnViolations: boolean;
}

// Default configuration
const defaultConfig: ComplianceConfig = {
  scanPatterns: [
    'src/**/*.{tsx,jsx,ts,js}',
    '!src/**/*.test.*',
    '!src/**/*.spec.*',
    '!src/**/*.stories.*'
  ],
  localePatterns: {
    english: ['src/**/*.{en,EN}/*.{tsx,jsx}', 'src/**/en/**/*.{tsx,jsx}'],
    arabic: ['src/**/*.{ar,AR}/*.{tsx,jsx}', 'src/**/ar/**/*.{tsx,jsx}']
  },
  translationFiles: {
    english: 'public/api/translations/en.json',
    arabic: 'public/api/translations/ar.json'
  },
  outputReport: 'scripts/ltr-rtl-compliance-report.md',
  keyPrefix: 'auto_generated',
  autoFix: true,
  failOnViolations: true
};

// Unicode ranges for detecting languages
const ARABIC_UNICODE_RANGE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_UNICODE_RANGE = /[A-Za-z]/;

// Violation types
interface Violation {
  file: string;
  line: number;
  column: number;
  type: 'arabic_in_english' | 'latin_in_arabic';
  content: string;
  context: string;
  autoFixable: boolean;
  suggestedKey?: string;
}

interface FixResult {
  violations: Violation[];
  fixes: number;
  errors: string[];
  skippedFiles: string[];
}

class LTRRTLComplianceChecker {
  private config: ComplianceConfig;
  private project: Project;
  private englishTranslations: Record<string, any> = {};
  private arabicTranslations: Record<string, any> = {};
  private keyCounter = 0;

  constructor(config: Partial<ComplianceConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.project = new Project({
      useInMemoryFileSystem: false,
      manipulationSettings: {
        indentationText: '  '
      }
    });
    this.loadTranslations();
  }

  private loadTranslations(): void {
    try {
      if (fs.existsSync(this.config.translationFiles.english)) {
        this.englishTranslations = JSON.parse(
          fs.readFileSync(this.config.translationFiles.english, 'utf-8')
        );
      }
      if (fs.existsSync(this.config.translationFiles.arabic)) {
        this.arabicTranslations = JSON.parse(
          fs.readFileSync(this.config.translationFiles.arabic, 'utf-8')
        );
      }
    } catch (error) {
      console.warn('Warning: Could not load translation files:', error);
    }
  }

  private saveTranslations(): void {
    try {
      if (Object.keys(this.englishTranslations).length > 0) {
        fs.writeFileSync(
          this.config.translationFiles.english,
          JSON.stringify(this.englishTranslations, null, 2),
          'utf-8'
        );
      }
      if (Object.keys(this.arabicTranslations).length > 0) {
        fs.writeFileSync(
          this.config.translationFiles.arabic,
          JSON.stringify(this.arabicTranslations, null, 2),
          'utf-8'
        );
      }
    } catch (error) {
      console.error('Error saving translation files:', error);
    }
  }

  private detectFileLocale(filePath: string): 'english' | 'arabic' | 'mixed' {
    // Check against Arabic patterns first
    for (const pattern of this.config.localePatterns.arabic) {
      if (this.matchesPattern(filePath, pattern)) {
        return 'arabic';
      }
    }
    
    // Check against English patterns
    for (const pattern of this.config.localePatterns.english) {
      if (this.matchesPattern(filePath, pattern)) {
        return 'english';
      }
    }
    
    // Default to mixed for general files (will check both directions)
    return 'mixed';
  }

  private matchesPattern(filePath: string, pattern: string): boolean {
    // Simple pattern matching - can be enhanced with minimatch if needed
    const regex = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\{([^}]+)\}/g, '($1)')
      .replace(/,/g, '|');
    
    return new RegExp(`^${regex}$`).test(filePath);
  }

  private hasArabicText(text: string): boolean {
    return ARABIC_UNICODE_RANGE.test(text);
  }

  private hasLatinText(text: string): boolean {
    return LATIN_UNICODE_RANGE.test(text);
  }

  private generateTranslationKey(): string {
    return `${this.config.keyPrefix}.generated_${++this.keyCounter}`;
  }

  private findExistingKey(text: string, locale: 'english' | 'arabic'): string | null {
    const translations = locale === 'english' ? this.englishTranslations : this.arabicTranslations;
    
    // Recursive search through nested translation objects
    const searchInObject = (obj: any, path: string = ''): string | null => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string' && value === text) {
          return currentPath;
        } else if (typeof value === 'object' && value !== null) {
          const found = searchInObject(value, currentPath);
          if (found) return found;
        }
      }
      return null;
    };

    return searchInObject(translations);
  }

  private addTranslationKey(key: string, englishText: string, arabicText: string = ''): void {
    // Add to nested structure based on key
    const keyParts = key.split('.');
    
    // Add to English translations
    let enTarget = this.englishTranslations;
    for (let i = 0; i < keyParts.length - 1; i++) {
      if (!enTarget[keyParts[i]]) {
        enTarget[keyParts[i]] = {};
      }
      enTarget = enTarget[keyParts[i]];
    }
    enTarget[keyParts[keyParts.length - 1]] = englishText;

    // Add to Arabic translations
    let arTarget = this.arabicTranslations;
    for (let i = 0; i < keyParts.length - 1; i++) {
      if (!arTarget[keyParts[i]]) {
        arTarget[keyParts[i]] = {};
      }
      arTarget = arTarget[keyParts[i]];
    }
    arTarget[keyParts[keyParts.length - 1]] = arabicText || `[AR: ${englishText}]`;
  }

  private checkStringLiteral(node: StringLiteral, filePath: string, locale: 'english' | 'arabic' | 'mixed'): Violation | null {
    const text = node.getLiteralValue();
    const line = node.getStartLineNumber();
    const column = node.getStart() - node.getStartLinePos() + 1;

    // Skip if text is too short or looks like a technical identifier
    if (text.length < 3 || /^[A-Z_]+$/.test(text) || /^\w+\.\w+/.test(text)) {
      return null;
    }

    let violation: Violation | null = null;

    if ((locale === 'english' || locale === 'mixed') && this.hasArabicText(text)) {
      violation = {
        file: filePath,
        line,
        column,
        type: 'arabic_in_english',
        content: text,
        context: node.getParent()?.getKindName() || 'unknown',
        autoFixable: true
      };
    } else if ((locale === 'arabic' || locale === 'mixed') && this.hasLatinText(text)) {
      violation = {
        file: filePath,
        line,
        column,
        type: 'latin_in_arabic',
        content: text,
        context: node.getParent()?.getKindName() || 'unknown',
        autoFixable: true
      };
    }

    if (violation) {
      // Check if we already have a translation key for this text
      const targetLocale = violation.type === 'arabic_in_english' ? 'arabic' : 'english';
      const existingKey = this.findExistingKey(text, targetLocale);
      violation.suggestedKey = existingKey || this.generateTranslationKey();
    }

    return violation;
  }

  private checkJsxText(node: JsxText, filePath: string, locale: 'english' | 'arabic' | 'mixed'): Violation | null {
    const text = node.getText().trim();
    const line = node.getStartLineNumber();
    const column = node.getStart() - node.getStartLinePos() + 1;

    if (text.length < 3) return null;

    let violation: Violation | null = null;

    if ((locale === 'english' || locale === 'mixed') && this.hasArabicText(text)) {
      violation = {
        file: filePath,
        line,
        column,
        type: 'arabic_in_english',
        content: text,
        context: 'JSX Text',
        autoFixable: true
      };
    } else if ((locale === 'arabic' || locale === 'mixed') && this.hasLatinText(text)) {
      violation = {
        file: filePath,
        line,
        column,
        type: 'latin_in_arabic',
        content: text,
        context: 'JSX Text',
        autoFixable: true
      };
    }

    if (violation) {
      const targetLocale = violation.type === 'arabic_in_english' ? 'arabic' : 'english';
      const existingKey = this.findExistingKey(text, targetLocale);
      violation.suggestedKey = existingKey || this.generateTranslationKey();
    }

    return violation;
  }

  private applyFix(violation: Violation): boolean {
    try {
      const sourceFile = this.project.getSourceFile(violation.file);
      if (!sourceFile) return false;

      const key = violation.suggestedKey!;
      
      // Add translation keys if they don't exist
      if (!this.findExistingKey(violation.content, 'english') && 
          !this.findExistingKey(violation.content, 'arabic')) {
        if (violation.type === 'arabic_in_english') {
          this.addTranslationKey(key, `[EN: ${violation.content}]`, violation.content);
        } else {
          this.addTranslationKey(key, violation.content, `[AR: ${violation.content}]`);
        }
      }

      // Add import for useTranslations hook if not present
      const existingImport = sourceFile.getImportDeclaration(importDecl => 
        importDecl.getModuleSpecifierValue().includes('useTranslations') ||
        importDecl.getModuleSpecifierValue().includes('useLanguage')
      );

      if (!existingImport) {
        sourceFile.addImportDeclaration({
          moduleSpecifier: '@/hooks/useTranslations',
          namedImports: ['useTranslations']
        });
      }

      // Find nodes by line number and replace
      const nodes = sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral)
        .concat(sourceFile.getDescendantsOfKind(SyntaxKind.JsxText) as any)
        .filter(node => node.getStartLineNumber() === violation.line);

      for (const node of nodes) {
        if (node.getKind() === SyntaxKind.StringLiteral) {
          const stringLiteral = node as StringLiteral;
          if (stringLiteral.getLiteralValue() === violation.content) {
            stringLiteral.replaceWithText(`t('${key}')`);
            return true;
          }
        } else if (node.getKind() === SyntaxKind.JsxText) {
          const jsxText = node as JsxText;
          if (jsxText.getText().trim() === violation.content) {
            jsxText.replaceWithText(`{t('${key}')}`);
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error(`Error applying fix to ${violation.file}:${violation.line}:`, error);
      return false;
    }
  }

  private scanFile(filePath: string): Violation[] {
    const violations: Violation[] = [];
    
    try {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      const locale = this.detectFileLocale(filePath);

      // Check string literals
      sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral).forEach(node => {
        const violation = this.checkStringLiteral(node, filePath, locale);
        if (violation) violations.push(violation);
      });

      // Check JSX text nodes
      sourceFile.getDescendantsOfKind(SyntaxKind.JsxText).forEach(node => {
        const violation = this.checkJsxText(node, filePath, locale);
        if (violation) violations.push(violation);
      });

      // Check JSX attribute values (less common but possible)
      sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach(attr => {
        const initializer = attr.getInitializer();
        if (initializer && initializer.getKind() === SyntaxKind.StringLiteral) {
          const violation = this.checkStringLiteral(initializer as StringLiteral, filePath, locale);
          if (violation) violations.push(violation);
        }
      });

    } catch (error) {
      console.warn(`Warning: Could not parse file ${filePath}:`, error);
    }

    return violations;
  }

  public async run(): Promise<FixResult> {
    console.log('🔍 Starting LTR/RTL compliance check...\n');

    const allFiles: string[] = [];
    
    // Gather all files matching scan patterns
    for (const pattern of this.config.scanPatterns) {
      const files = await glob(pattern, { ignore: ['node_modules/**'] });
      allFiles.push(...files);
    }

    const uniqueFiles = [...new Set(allFiles)];
    console.log(`📁 Scanning ${uniqueFiles.length} files...\n`);

    const result: FixResult = {
      violations: [],
      fixes: 0,
      errors: [],
      skippedFiles: []
    };

    for (const filePath of uniqueFiles) {
      try {
        const violations = this.scanFile(filePath);
        result.violations.push(...violations);

        if (this.config.autoFix && violations.length > 0) {
          console.log(`🔧 Fixing ${violations.length} violations in ${filePath}`);
          
          for (const violation of violations) {
            if (violation.autoFixable && this.applyFix(violation)) {
              result.fixes++;
            }
          }

          // Save the fixed file
          const sourceFile = this.project.getSourceFile(filePath);
          if (sourceFile) {
            await sourceFile.save();
          }
        }

      } catch (error) {
        result.errors.push(`${filePath}: ${error}`);
        result.skippedFiles.push(filePath);
      }
    }

    // Save updated translations
    if (result.fixes > 0) {
      this.saveTranslations();
    }

    // Generate report
    await this.generateReport(result);

    return result;
  }

  private async generateReport(result: FixResult): Promise<void> {
    const reportContent = `# LTR/RTL Compliance Report

Generated: ${new Date().toISOString()}

## Summary

- **Total Files Scanned**: ${result.violations.length + result.skippedFiles.length}
- **Violations Found**: ${result.violations.length}
- **Auto-Fixes Applied**: ${result.fixes}
- **Files Skipped**: ${result.skippedFiles.length}
- **Errors**: ${result.errors.length}

## Violations by Type

### Arabic Text in English Files
${result.violations
  .filter(v => v.type === 'arabic_in_english')
  .map(v => `- \`${v.file}:${v.line}:${v.column}\` - "${v.content}" (${v.context})${v.suggestedKey ? ` → \`t('${v.suggestedKey}')\`` : ''}`)
  .join('\n')}

### Latin Text in Arabic Files
${result.violations
  .filter(v => v.type === 'latin_in_arabic')
  .map(v => `- \`${v.file}:${v.line}:${v.column}\` - "${v.content}" (${v.context})${v.suggestedKey ? ` → \`t('${v.suggestedKey}')\`` : ''}`)
  .join('\n')}

## Errors
${result.errors.map(error => `- ${error}`).join('\n')}

## Skipped Files
${result.skippedFiles.map(file => `- ${file}`).join('\n')}

---
*This report was auto-generated by the LTR/RTL compliance checker.*
`;

    fs.writeFileSync(this.config.outputReport, reportContent, 'utf-8');
    console.log(`📊 Report saved to: ${this.config.outputReport}`);
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const autoFix = !args.includes('--no-fix');
  const failOnViolations = !args.includes('--no-fail');

  const checker = new LTRRTLComplianceChecker({
    autoFix,
    failOnViolations
  });

  try {
    const result = await checker.run();
    
    console.log('\n✅ LTR/RTL compliance check completed!');
    console.log(`📊 ${result.violations.length} violations found`);
    console.log(`🔧 ${result.fixes} auto-fixes applied`);
    
    if (result.violations.length > result.fixes && failOnViolations) {
      console.error('\n❌ Compliance check failed! Unresolved violations remain.');
      process.exit(1);
    }
    
    console.log('\n🎉 All violations resolved or auto-fixed!');
    
  } catch (error) {
    console.error('💥 Error during compliance check:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}