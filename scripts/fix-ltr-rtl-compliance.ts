#!/usr/bin/env tsx

import { Project, SyntaxKind, StringLiteral, JsxText, JsxAttribute, SourceFile, Node } from 'ts-morph';
import { glob } from 'glob';
import { Command } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

// ============= CONFIGURATION =============

interface ComplianceConfig {
  scanPatterns: string[];
  localePatterns: {
    english: string[];
    arabic: string[];
  };
  translationFiles: {
    english: string[];
    arabic: string[];
  };
  outputReport: string;
  keyPrefix: string;
  headingClassification: {
    modules: string[];
    submodules: string[];
    tools: string[];
    subtools: string[];
  };
}

const defaultConfig: ComplianceConfig = {
  scanPatterns: [
    'src/pages/**/*.{tsx,jsx,ts,js}',
    'src/components/**/*.{tsx,jsx,ts,js}',
    'src/modules/**/*.{tsx,jsx,ts,js}',
    'src/features/**/*.{tsx,jsx,ts,js}',
    '!**/*.test.*',
    '!**/*.spec.*',
    '!**/*.stories.*'
  ],
  localePatterns: {
    english: [
      'src/**/en/**/*.{tsx,jsx}',
      'src/**/*.en.{tsx,jsx}',
      'src/**/*.EN.{tsx,jsx}'
    ],
    arabic: [
      'src/**/ar/**/*.{tsx,jsx}',
      'src/**/*.ar.{tsx,jsx}',
      'src/**/*.AR.{tsx,jsx}'
    ]
  },
  translationFiles: {
    english: [
      'public/locales/en/common.json',
      'public/locales/en/modules.json',
      'public/api/translations/en.json'
    ],
    arabic: [
      'public/locales/ar/common.json',
      'public/locales/ar/modules.json',
      'public/api/translations/ar.json'
    ]
  },
  outputReport: 'scripts/compliance-report.md',
  keyPrefix: 'auto_fix',
  headingClassification: {
    modules: ['Dashboard', 'Analytics', 'Employees', 'Payroll', 'Core HR', 'Government'],
    submodules: ['Master Data', 'Reports', 'Settings', 'Configuration'],
    tools: ['EXPORT', 'IMPORT', 'SYNC', 'BACKUP', 'RESTORE', 'VALIDATE'],
    subtools: ['parser', 'validator', 'formatter', 'converter', 'filter']
  }
};

// ============= UNICODE DETECTION =============

const ARABIC_UNICODE_RANGE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_UNICODE_RANGE = /[A-Za-z]/;

// ============= VIOLATION TYPES =============

interface HeadingViolation {
  type: 'heading';
  subtype: 'module' | 'submodule' | 'tool' | 'subtool';
  file: string;
  line: number;
  column: number;
  original: string;
  expected: string;
  context: string;
  nodeType: 'StringLiteral' | 'JsxText' | 'JsxAttribute';
}

interface LTRRTLViolation {
  type: 'ltr-rtl';
  subtype: 'arabic_in_english' | 'latin_in_arabic';
  file: string;
  line: number;
  column: number;
  original: string;
  suggestedKey: string;
  context: string;
  nodeType: 'StringLiteral' | 'JsxText' | 'JsxAttribute';
}

type Violation = HeadingViolation | LTRRTLViolation;

interface FixResult {
  violations: Violation[];
  headingFixes: number;
  ltrRtlFixes: number;
  translationKeysAdded: number;
  errors: string[];
  skippedFiles: string[];
  processedFiles: number;
}

// ============= CASE TRANSFORMATION UTILITIES =============

class CaseTransformer {
  static toTitleCase(text: string): string {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  static toSentenceCase(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  static toUpperCase(text: string): string {
    return text.toUpperCase();
  }

  static toLowerCase(text: string): string {
    return text.toLowerCase();
  }
}

// ============= HEADING CLASSIFIER =============

class HeadingClassifier {
  private config: ComplianceConfig;

  constructor(config: ComplianceConfig) {
    this.config = config;
  }

  classify(text: string, context: string): { type: 'module' | 'submodule' | 'tool' | 'subtool' | null, expected: string } {
    const cleanText = text.trim();

    // Check for tools (typically ALL CAPS or contains action words)
    if (this.config.headingClassification.tools.some(tool => 
        cleanText.toUpperCase().includes(tool) || 
        /^[A-Z\s_]+$/.test(cleanText))) {
      return { type: 'tool', expected: CaseTransformer.toUpperCase(cleanText) };
    }

    // Check for sub-tools (typically lowercase utility names)
    if (this.config.headingClassification.subtools.some(subtool => 
        cleanText.toLowerCase().includes(subtool) ||
        /^[a-z\s_]+$/.test(cleanText))) {
      return { type: 'subtool', expected: CaseTransformer.toLowerCase(cleanText) };
    }

    // Check for modules (main navigation items)
    if (this.config.headingClassification.modules.some(module => 
        cleanText.includes(module))) {
      return { type: 'module', expected: CaseTransformer.toTitleCase(cleanText) };
    }

    // Check for submodules (secondary navigation)
    if (this.config.headingClassification.submodules.some(submodule => 
        cleanText.includes(submodule)) ||
        context.includes('submodule') || context.includes('secondary')) {
      return { type: 'submodule', expected: CaseTransformer.toSentenceCase(cleanText) };
    }

    // Default classification based on length and context
    if (cleanText.length > 20) {
      return { type: 'module', expected: CaseTransformer.toTitleCase(cleanText) };
    } else if (cleanText.length < 8 && cleanText.toUpperCase() === cleanText) {
      return { type: 'tool', expected: CaseTransformer.toUpperCase(cleanText) };
    }

    return { type: null, expected: cleanText };
  }
}

// ============= TRANSLATION MANAGER =============

class TranslationManager {
  private englishTranslations: Record<string, any> = {};
  private arabicTranslations: Record<string, any> = {};
  private keyCounter = 0;
  private config: ComplianceConfig;

  constructor(config: ComplianceConfig) {
    this.config = config;
    this.loadTranslations();
  }

  private loadTranslations(): void {
    // Load English translations
    for (const filePath of this.config.translationFiles.english) {
      try {
        if (fs.existsSync(filePath)) {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          this.mergeTranslations(this.englishTranslations, content);
        }
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Could not load ${filePath}`));
      }
    }

    // Load Arabic translations
    for (const filePath of this.config.translationFiles.arabic) {
      try {
        if (fs.existsSync(filePath)) {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          this.mergeTranslations(this.arabicTranslations, content);
        }
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Could not load ${filePath}`));
      }
    }
  }

  private mergeTranslations(target: Record<string, any>, source: Record<string, any>): void {
    for (const [key, value] of Object.entries(source)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (!target[key]) target[key] = {};
        this.mergeTranslations(target[key], value);
      } else {
        target[key] = value;
      }
    }
  }

  generateKey(): string {
    return `${this.config.keyPrefix}.generated_${++this.keyCounter}`;
  }

  findExistingKey(text: string, locale: 'english' | 'arabic'): string | null {
    const translations = locale === 'english' ? this.englishTranslations : this.arabicTranslations;
    
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

  addTranslationKey(key: string, englishText: string, arabicText: string = ''): void {
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

  saveTranslations(): void {
    try {
      // Save to the first available translation file for each locale
      const enFile = this.config.translationFiles.english.find(f => 
        fs.existsSync(f) || fs.existsSync(path.dirname(f))
      ) || this.config.translationFiles.english[0];
      
      const arFile = this.config.translationFiles.arabic.find(f => 
        fs.existsSync(f) || fs.existsSync(path.dirname(f))
      ) || this.config.translationFiles.arabic[0];

      // Ensure directories exist
      fs.mkdirSync(path.dirname(enFile), { recursive: true });
      fs.mkdirSync(path.dirname(arFile), { recursive: true });

      fs.writeFileSync(enFile, JSON.stringify(this.englishTranslations, null, 2), 'utf-8');
      fs.writeFileSync(arFile, JSON.stringify(this.arabicTranslations, null, 2), 'utf-8');
      
      console.log(chalk.green(`✅ Updated translations: ${enFile}, ${arFile}`));
    } catch (error) {
      console.error(chalk.red('❌ Error saving translation files:'), error);
    }
  }
}

// ============= MAIN COMPLIANCE CHECKER =============

class ComprehensiveComplianceChecker {
  private config: ComplianceConfig;
  private project: Project;
  private headingClassifier: HeadingClassifier;
  private translationManager: TranslationManager;

  constructor(config: Partial<ComplianceConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.project = new Project({
      useInMemoryFileSystem: false,
      manipulationSettings: {
        indentationText: '  '
      }
    });
    this.headingClassifier = new HeadingClassifier(this.config);
    this.translationManager = new TranslationManager(this.config);
  }

  private detectFileLocale(filePath: string): 'english' | 'arabic' | 'mixed' {
    // Check Arabic patterns
    for (const pattern of this.config.localePatterns.arabic) {
      if (this.matchesGlobPattern(filePath, pattern)) {
        return 'arabic';
      }
    }
    
    // Check English patterns
    for (const pattern of this.config.localePatterns.english) {
      if (this.matchesGlobPattern(filePath, pattern)) {
        return 'english';
      }
    }
    
    return 'mixed';
  }

  private matchesGlobPattern(filePath: string, pattern: string): boolean {
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

  private shouldSkipText(text: string): boolean {
    // Skip technical identifiers, CSS classes, short strings, etc.
    return (
      text.length < 3 ||
      /^[A-Z_]+$/.test(text) ||
      /^\w+\.\w+/.test(text) ||
      /^(px|em|rem|vh|vw|ms|s)$/.test(text) ||
      /^#[0-9a-f]{3,8}$/i.test(text) ||
      /^(true|false|null|undefined)$/.test(text) ||
      /^bg-|text-|border-|hover:|focus:/.test(text)
    );
  }

  private analyzeNode(node: StringLiteral | JsxText | JsxAttribute, filePath: string, locale: 'english' | 'arabic' | 'mixed'): Violation[] {
    const violations: Violation[] = [];
    let text: string;
    let nodeType: 'StringLiteral' | 'JsxText' | 'JsxAttribute';
    let context: string;

    // Extract text and context based on node type
    if (node.getKind() === SyntaxKind.StringLiteral) {
      const stringLiteral = node as StringLiteral;
      text = stringLiteral.getLiteralValue();
      nodeType = 'StringLiteral';
      context = stringLiteral.getParent()?.getKindName() || 'unknown';
    } else if (node.getKind() === SyntaxKind.JsxText) {
      const jsxText = node as JsxText;
      text = jsxText.getText().trim();
      nodeType = 'JsxText';
      context = 'JSX Text';
    } else {
      const jsxAttr = node as JsxAttribute;
      const initializer = jsxAttr.getInitializer();
      if (!initializer || initializer.getKind() !== SyntaxKind.StringLiteral) return violations;
      text = (initializer as StringLiteral).getLiteralValue();
      nodeType = 'JsxAttribute';
      context = `JSX Attribute: ${jsxAttr.getName()}`;
    }

    if (this.shouldSkipText(text)) return violations;

    const line = node.getStartLineNumber();
    const column = node.getStart() - node.getStartLinePos() + 1;

    // Check for heading case violations
    const classification = this.headingClassifier.classify(text, context);
    if (classification.type && classification.expected !== text) {
      violations.push({
        type: 'heading',
        subtype: classification.type,
        file: filePath,
        line,
        column,
        original: text,
        expected: classification.expected,
        context,
        nodeType
      });
    }

    // Check for LTR/RTL violations
    if ((locale === 'english' || locale === 'mixed') && this.hasArabicText(text)) {
      const existingKey = this.translationManager.findExistingKey(text, 'arabic');
      violations.push({
        type: 'ltr-rtl',
        subtype: 'arabic_in_english',
        file: filePath,
        line,
        column,
        original: text,
        suggestedKey: existingKey || this.translationManager.generateKey(),
        context,
        nodeType
      });
    }

    if ((locale === 'arabic' || locale === 'mixed') && this.hasLatinText(text)) {
      const existingKey = this.translationManager.findExistingKey(text, 'english');
      violations.push({
        type: 'ltr-rtl',
        subtype: 'latin_in_arabic',
        file: filePath,
        line,
        column,
        original: text,
        suggestedKey: existingKey || this.translationManager.generateKey(),
        context,
        nodeType
      });
    }

    return violations;
  }

  private applyHeadingFix(violation: HeadingViolation): boolean {
    try {
      const sourceFile = this.project.getSourceFile(violation.file);
      if (!sourceFile) return false;

      const nodes = this.findNodesByLine(sourceFile, violation.line, violation.nodeType);
      
      for (const node of nodes) {
        const currentText = this.extractTextFromNode(node);
        if (currentText === violation.original) {
          this.replaceNodeText(node, violation.expected);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(chalk.red(`Error applying heading fix: ${error}`));
      return false;
    }
  }

  private applyLTRRTLFix(violation: LTRRTLViolation): boolean {
    try {
      const sourceFile = this.project.getSourceFile(violation.file);
      if (!sourceFile) return false;

      // Add translation key if it doesn't exist
      if (!this.translationManager.findExistingKey(violation.original, 'english') && 
          !this.translationManager.findExistingKey(violation.original, 'arabic')) {
        if (violation.subtype === 'arabic_in_english') {
          this.translationManager.addTranslationKey(
            violation.suggestedKey,
            `[EN: ${violation.original}]`,
            violation.original
          );
        } else {
          this.translationManager.addTranslationKey(
            violation.suggestedKey,
            violation.original,
            `[AR: ${violation.original}]`
          );
        }
      }

      // Add import if needed
      this.ensureTranslationImport(sourceFile);

      // Replace the node
      const nodes = this.findNodesByLine(sourceFile, violation.line, violation.nodeType);
      
      for (const node of nodes) {
        const currentText = this.extractTextFromNode(node);
        if (currentText === violation.original) {
          if (violation.nodeType === 'JsxText') {
            this.replaceNodeText(node, `{t('${violation.suggestedKey}')}`);
          } else {
            this.replaceNodeText(node, `t('${violation.suggestedKey}')`);
          }
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(chalk.red(`Error applying LTR/RTL fix: ${error}`));
      return false;
    }
  }

  private findNodesByLine(sourceFile: SourceFile, line: number, nodeType: string): Node[] {
    const allNodes: Node[] = [];
    
    if (nodeType === 'StringLiteral') {
      allNodes.push(...sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral));
    } else if (nodeType === 'JsxText') {
      allNodes.push(...sourceFile.getDescendantsOfKind(SyntaxKind.JsxText));
    } else if (nodeType === 'JsxAttribute') {
      allNodes.push(...sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute));
    }

    return allNodes.filter(node => node.getStartLineNumber() === line);
  }

  private extractTextFromNode(node: Node): string {
    if (node.getKind() === SyntaxKind.StringLiteral) {
      return (node as StringLiteral).getLiteralValue();
    } else if (node.getKind() === SyntaxKind.JsxText) {
      return (node as JsxText).getText().trim();
    } else if (node.getKind() === SyntaxKind.JsxAttribute) {
      const attr = node as JsxAttribute;
      const initializer = attr.getInitializer();
      if (initializer && initializer.getKind() === SyntaxKind.StringLiteral) {
        return (initializer as StringLiteral).getLiteralValue();
      }
    }
    return '';
  }

  private replaceNodeText(node: Node, newText: string): void {
    if (node.getKind() === SyntaxKind.StringLiteral) {
      (node as StringLiteral).replaceWithText(`"${newText}"`);
    } else if (node.getKind() === SyntaxKind.JsxText) {
      (node as JsxText).replaceWithText(newText);
    } else if (node.getKind() === SyntaxKind.JsxAttribute) {
      const attr = node as JsxAttribute;
      const initializer = attr.getInitializer();
      if (initializer && initializer.getKind() === SyntaxKind.StringLiteral) {
        (initializer as StringLiteral).replaceWithText(`"${newText}"`);
      }
    }
  }

  private ensureTranslationImport(sourceFile: SourceFile): void {
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
  }

  private scanFile(filePath: string): Violation[] {
    const violations: Violation[] = [];
    
    try {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      const locale = this.detectFileLocale(filePath);

      // Analyze string literals
      sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral).forEach(node => {
        violations.push(...this.analyzeNode(node, filePath, locale));
      });

      // Analyze JSX text
      sourceFile.getDescendantsOfKind(SyntaxKind.JsxText).forEach(node => {
        violations.push(...this.analyzeNode(node, filePath, locale));
      });

      // Analyze JSX attributes
      sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach(node => {
        violations.push(...this.analyzeNode(node, filePath, locale));
      });

    } catch (error) {
      console.warn(chalk.yellow(`Warning: Could not parse ${filePath}: ${error}`));
    }

    return violations;
  }

  async run(dryRun: boolean = false): Promise<FixResult> {
    console.log(chalk.blue('🔍 Starting comprehensive compliance check...\n'));

    const allFiles: string[] = [];
    
    // Gather all files
    for (const pattern of this.config.scanPatterns) {
      const files = await glob(pattern, { ignore: ['node_modules/**'] });
      allFiles.push(...files);
    }

    const uniqueFiles = [...new Set(allFiles)];
    console.log(chalk.cyan(`📁 Scanning ${uniqueFiles.length} files...\n`));

    const result: FixResult = {
      violations: [],
      headingFixes: 0,
      ltrRtlFixes: 0,
      translationKeysAdded: 0,
      errors: [],
      skippedFiles: [],
      processedFiles: 0
    };

    for (const filePath of uniqueFiles) {
      try {
        const violations = this.scanFile(filePath);
        result.violations.push(...violations);
        result.processedFiles++;

        if (!dryRun && violations.length > 0) {
          console.log(chalk.yellow(`🔧 Fixing ${violations.length} violations in ${filePath}`));
          
          for (const violation of violations) {
            if (violation.type === 'heading') {
              if (this.applyHeadingFix(violation)) {
                result.headingFixes++;
              }
            } else if (violation.type === 'ltr-rtl') {
              if (this.applyLTRRTLFix(violation)) {
                result.ltrRtlFixes++;
                result.translationKeysAdded++;
              }
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

    // Save translations if any LTR/RTL fixes were made
    if (result.ltrRtlFixes > 0 && !dryRun) {
      this.translationManager.saveTranslations();
    }

    // Generate report
    await this.generateReport(result, dryRun);

    return result;
  }

  private async generateReport(result: FixResult, dryRun: boolean): Promise<void> {
    const headingViolations = result.violations.filter(v => v.type === 'heading') as HeadingViolation[];
    const ltrRtlViolations = result.violations.filter(v => v.type === 'ltr-rtl') as LTRRTLViolation[];

    const reportContent = `# Comprehensive Compliance Report

Generated: ${new Date().toISOString()}
Mode: ${dryRun ? 'DRY RUN' : 'APPLY FIXES'}

## Summary

- **Total Files Scanned**: ${result.processedFiles}
- **Total Violations Found**: ${result.violations.length}
- **Heading Case Violations**: ${headingViolations.length}
- **LTR/RTL Violations**: ${ltrRtlViolations.length}
- **Heading Fixes Applied**: ${result.headingFixes}
- **LTR/RTL Fixes Applied**: ${result.ltrRtlFixes}
- **Translation Keys Added**: ${result.translationKeysAdded}
- **Files Skipped**: ${result.skippedFiles.length}
- **Errors**: ${result.errors.length}

## Heading Case Violations

### Modules (Should be Title Case)
${headingViolations
  .filter(v => v.subtype === 'module')
  .map(v => `- \`${v.file}:${v.line}:${v.column}\` - "${v.original}" → "${v.expected}" (${v.context})`)
  .join('\n')}

### Submodules (Should be Sentence case)
${headingViolations
  .filter(v => v.subtype === 'submodule')
  .map(v => `- \`${v.file}:${v.line}:${v.column}\` - "${v.original}" → "${v.expected}" (${v.context})`)
  .join('\n')}

### Tools (Should be UPPERCASE)
${headingViolations
  .filter(v => v.subtype === 'tool')
  .map(v => `- \`${v.file}:${v.line}:${v.column}\` - "${v.original}" → "${v.expected}" (${v.context})`)
  .join('\n')}

### Sub-tools (Should be lowercase)
${headingViolations
  .filter(v => v.subtype === 'subtool')
  .map(v => `- \`${v.file}:${v.line}:${v.column}\` - "${v.original}" → "${v.expected}" (${v.context})`)
  .join('\n')}

## LTR/RTL Violations

### Arabic Text in English Files
${ltrRtlViolations
  .filter(v => v.subtype === 'arabic_in_english')
  .map(v => `- \`${v.file}:${v.line}:${v.column}\` - "${v.original}" → \`t('${v.suggestedKey}')\` (${v.context})`)
  .join('\n')}

### Latin Text in Arabic Files
${ltrRtlViolations
  .filter(v => v.subtype === 'latin_in_arabic')
  .map(v => `- \`${v.file}:${v.line}:${v.column}\` - "${v.original}" → \`t('${v.suggestedKey}')\` (${v.context})`)
  .join('\n')}

## Errors
${result.errors.map(error => `- ${error}`).join('\n')}

## Skipped Files
${result.skippedFiles.map(file => `- ${file}`).join('\n')}

---
*This report was auto-generated by the Comprehensive Compliance Checker.*
`;

    fs.writeFileSync(this.config.outputReport, reportContent, 'utf-8');
    console.log(chalk.green(`📊 Report saved to: ${this.config.outputReport}`));
  }
}

// ============= CLI INTERFACE =============

const program = new Command();

program
  .name('fix-ltr-rtl-compliance')
  .description('Comprehensive tool for fixing heading case and LTR/RTL compliance violations')
  .version('1.0.0')
  .option('--dry-run', 'Show violations without applying fixes', false)
  .option('--apply', 'Apply fixes to files (default)', true)
  .option('--no-fail', 'Do not exit with error code on violations')
  .action(async (options) => {
    const checker = new ComprehensiveComplianceChecker();
    
    try {
      const result = await checker.run(options.dryRun);
      
      console.log(chalk.green('\n✅ Compliance check completed!'));
      console.log(chalk.cyan(`📊 ${result.violations.length} total violations found`));
      console.log(chalk.cyan(`🔧 ${result.headingFixes} heading fixes applied`));
      console.log(chalk.cyan(`🌍 ${result.ltrRtlFixes} LTR/RTL fixes applied`));
      console.log(chalk.cyan(`🔑 ${result.translationKeysAdded} translation keys added`));
      
      const unresolved = result.violations.length - result.headingFixes - result.ltrRtlFixes;
      if (unresolved > 0 && !options.noFail) {
        console.error(chalk.red(`\n❌ ${unresolved} violations remain unresolved!`));
        process.exit(1);
      }
      
      console.log(chalk.green('\n🎉 All violations resolved!'));
      
    } catch (error) {
      console.error(chalk.red('💥 Error during compliance check:'), error);
      process.exit(1);
    }
  });

// CLI execution
if (require.main === module) {
  program.parse();
}