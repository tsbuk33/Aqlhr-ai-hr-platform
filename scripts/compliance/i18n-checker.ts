import { Project, SourceFile, Node, SyntaxKind } from 'ts-morph';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import chalk from 'chalk';

export interface I18nIssue {
  file: string;
  line: number;
  column: number;
  type: 'hardcoded-string' | 'missing-translation' | 'mixed-language';
  message: string;
  fix?: string;
}

export class I18nChecker {
  private project: Project;
  private issues: I18nIssue[] = [];
  private translations: { en: any; ar: any } = { en: {}, ar: {} };

  constructor() {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    this.loadTranslations();
  }

  private loadTranslations() {
    try {
      this.translations.en = JSON.parse(readFileSync('public/api/translations/en.json', 'utf-8'));
      this.translations.ar = JSON.parse(readFileSync('public/api/translations/ar.json', 'utf-8'));
    } catch (error) {
      console.warn(chalk.yellow('⚠️  Could not load translation files'));
    }
  }

  async checkAll(): Promise<I18nIssue[]> {
    const files = await glob('src/**/*.{ts,tsx}');
    
    for (const filePath of files) {
      await this.checkFile(filePath);
    }

    return this.issues;
  }

  private async checkFile(filePath: string) {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    
    // Check for hardcoded English strings
    this.findHardcodedStrings(sourceFile);
    
    // Check for missing translation keys
    this.findMissingTranslations(sourceFile);
    
    // Check for mixed language content
    this.findMixedLanguage(sourceFile);
  }

  private findHardcodedStrings(sourceFile: SourceFile) {
    sourceFile.forEachDescendant((node) => {
      if (Node.isStringLiteral(node)) {
        const text = node.getLiteralValue();
        if (this.isEnglishText(text) && !this.isInTranslationCall(node)) {
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: node.getStartLineNumber(),
            column: node.getStart(),
            type: 'hardcoded-string',
            message: `Hardcoded English string: "${text}"`,
            fix: this.generateTranslationKey(text)
          });
        }
      }
      
      if (Node.isJsxText(node)) {
        const text = node.getText().trim();
        if (this.isEnglishText(text)) {
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: node.getStartLineNumber(),
            column: node.getStart(),
            type: 'hardcoded-string',
            message: `Hardcoded JSX text: "${text}"`,
            fix: `{t('${this.generateTranslationKey(text)}')}`
          });
        }
      }
    });
  }

  private findMissingTranslations(sourceFile: SourceFile) {
    sourceFile.forEachDescendant((node) => {
      if (Node.isCallExpression(node)) {
        const expression = node.getExpression();
        if (Node.isIdentifier(expression) && expression.getText() === 't') {
          const args = node.getArguments();
          if (args.length > 0 && Node.isStringLiteral(args[0])) {
            const key = args[0].getLiteralValue();
            if (!this.hasTranslation(key)) {
              this.issues.push({
                file: sourceFile.getFilePath(),
                line: node.getStartLineNumber(),
                column: node.getStart(),
                type: 'missing-translation',
                message: `Missing translation for key: "${key}"`,
                fix: key
              });
            }
          }
        }
      }
    });
  }

  private findMixedLanguage(sourceFile: SourceFile) {
    // Check for Arabic text in files that should be LTR
    // and Latin text in RTL-specific files
    const content = sourceFile.getFullText();
    const hasArabic = /[\u0600-\u06FF]/.test(content);
    const hasLatin = /[a-zA-Z]/.test(content);
    
    if (hasArabic && hasLatin) {
      // This is likely normal in translation files, but check context
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (/[\u0600-\u06FF]/.test(line) && !/t\(|translation|i18n/.test(line)) {
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: index + 1,
            column: 0,
            type: 'mixed-language',
            message: `Arabic text found outside translation context: "${line.trim()}"`,
          });
        }
      });
    }
  }

  private isEnglishText(text: string): boolean {
    // Simple heuristic for English text
    return /^[a-zA-Z\s.,!?]+$/.test(text) && 
           text.length > 2 && 
           !/^(px|rem|em|vh|vw|%)$/.test(text) &&
           !/^#[0-9a-fA-F]+$/.test(text) &&
           !/^(true|false|null|undefined)$/.test(text);
  }

  private isInTranslationCall(node: Node): boolean {
    let parent = node.getParent();
    while (parent) {
      if (Node.isCallExpression(parent)) {
        const expression = parent.getExpression();
        if (Node.isIdentifier(expression) && expression.getText() === 't') {
          return true;
        }
      }
      parent = parent.getParent();
    }
    return false;
  }

  private generateTranslationKey(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
  }

  private hasTranslation(key: string): boolean {
    const keys = key.split('.');
    let enValue = this.translations.en;
    let arValue = this.translations.ar;
    
    for (const k of keys) {
      enValue = enValue?.[k];
      arValue = arValue?.[k];
    }
    
    return !!enValue && !!arValue;
  }

  async autoFix(): Promise<number> {
    let fixedCount = 0;
    const missingKeys: { [key: string]: string } = {};
    
    // Collect missing translation keys
    for (const issue of this.issues) {
      if (issue.type === 'missing-translation' && issue.fix) {
        missingKeys[issue.fix] = issue.fix.replace(/_/g, ' ');
        fixedCount++;
      }
    }
    
    // Add missing keys to translation files
    if (Object.keys(missingKeys).length > 0) {
      this.addMissingTranslations(missingKeys);
    }
    
    return fixedCount;
  }

  private addMissingTranslations(missingKeys: { [key: string]: string }) {
    // Add to English translations
    const updatedEn = { ...this.translations.en };
    for (const [key, value] of Object.entries(missingKeys)) {
      this.setNestedValue(updatedEn, key, value);
    }
    
    // Add to Arabic translations (placeholder - needs proper translation)
    const updatedAr = { ...this.translations.ar };
    for (const [key, value] of Object.entries(missingKeys)) {
      this.setNestedValue(updatedAr, key, `[AR] ${value}`);
    }
    
    // Write updated files
    writeFileSync('public/api/translations/en.json', JSON.stringify(updatedEn, null, 2));
    writeFileSync('public/api/translations/ar.json', JSON.stringify(updatedAr, null, 2));
  }

  private setNestedValue(obj: any, path: string, value: string) {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }
}