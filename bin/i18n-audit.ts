#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface AuditResult {
  hardcodedStrings: Array<{
    file: string;
    line: number;
    content: string;
    context: string;
  }>;
  tKeys: Set<string>;
  enKeys: Set<string>;
  arKeys: Set<string>;
  missingArKeys: string[];
  unusedKeys: string[];
  summary: {
    filesScanned: number;
    hardcodedStringsFound: number;
    tKeysFound: number;
    enKeysCount: number;
    arKeysCount: number;
    missingArKeysCount: number;
    unusedKeysCount: number;
    coveragePercent: number;
  };
}

class I18nAuditor {
  private result: AuditResult = {
    hardcodedStrings: [],
    tKeys: new Set(),
    enKeys: new Set(),
    arKeys: new Set(),
    missingArKeys: [],
    unusedKeys: [],
    summary: {
      filesScanned: 0,
      hardcodedStringsFound: 0,
      tKeysFound: 0,
      enKeysCount: 0,
      arKeysCount: 0,
      missingArKeysCount: 0,
      unusedKeysCount: 0,
      coveragePercent: 0,
    },
  };

  private readonly projectRoot = process.cwd();
  private readonly srcPath = path.join(this.projectRoot, 'src');
  private readonly localesPath = path.join(this.srcPath, 'contexts', 'LanguageContext.tsx');

  async audit(): Promise<AuditResult> {
    console.log('🔍 Starting i18n audit...\n');

    // 1. Scan all TSX/TS files
    await this.scanSourceFiles();

    // 2. Extract locale keys from LanguageContext
    await this.extractLocaleKeys();

    // 3. Identify missing keys and unused keys
    this.identifyMissingKeys();
    this.identifyUnusedKeys();

    // 4. Calculate summary statistics
    this.calculateSummary();

    // 5. Output results
    this.outputResults();

    return this.result;
  }

  private async scanSourceFiles(): Promise<void> {
    const pattern = path.join(this.srcPath, '**/*.{ts,tsx}').replace(/\\/g, '/');
    const files = await glob(pattern, { ignore: '**/*.d.ts' });

    console.log(`📂 Scanning ${files.length} source files...`);

    for (const file of files) {
      await this.scanFile(file);
    }

    this.result.summary.filesScanned = files.length;
    console.log(`✅ Scanned ${files.length} files\n`);
  }

  private async scanFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Find t('key') patterns
      const tMatches = line.match(/t\(['"`]([^'"`]+)['"`]\)/g);
      if (tMatches) {
        tMatches.forEach(match => {
          const keyMatch = match.match(/t\(['"`]([^'"`]+)['"`]\)/);
          if (keyMatch) {
            this.result.tKeys.add(keyMatch[1]);
          }
        });
      }

      // Find hardcoded strings (simple heuristic)
      this.findHardcodedStrings(line, index + 1, filePath);
    });
  }

  private findHardcodedStrings(line: string, lineNumber: number, filePath: string): void {
    // Skip lines with comments, imports, console.log, etc.
    if (
      line.trim().startsWith('//') ||
      line.trim().startsWith('/*') ||
      line.includes('import ') ||
      line.includes('console.') ||
      line.includes('@') ||
      line.includes('className=') ||
      line.includes('data-') ||
      line.includes('aria-') ||
      line.includes('id=') ||
      line.includes('href=') ||
      line.includes('src=') ||
      line.includes('alt=""') ||
      line.includes('placeholder=""') ||
      line.includes("'h-") ||
      line.includes("'w-") ||
      line.includes("'text-") ||
      line.includes("'bg-") ||
      line.includes("'border-") ||
      line.includes("'flex") ||
      line.includes("'grid") ||
      line.includes("'space-") ||
      line.includes("'gap-") ||
      line.includes("'p-") ||
      line.includes("'m-") ||
      line.includes("'rounded") ||
      line.includes('t(') ||
      line.includes('Key') ||
      line.includes('Id') ||
      line.includes('URL') ||
      line.includes('API') ||
      line.includes('SQL') ||
      line.includes('JSON') ||
      line.includes('HTTP') ||
      line.includes('.env') ||
      line.includes('typeof')
    ) {
      return;
    }

    // Look for quoted strings that could be user-facing text
    const stringPatterns = [
      /"([^"]{3,50})"/g,  // Double quoted strings
      /'([^']{3,50})'/g,  // Single quoted strings
      /`([^`]{3,50})`/g,  // Template literals
    ];

    stringPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        const text = match[1];
        
        // Filter out non-user-facing strings
        if (this.isUserFacingString(text)) {
          this.result.hardcodedStrings.push({
            file: path.relative(this.projectRoot, filePath),
            line: lineNumber,
            content: text,
            context: line.trim(),
          });
        }
      }
    });
  }

  private isUserFacingString(text: string): boolean {
    // Skip if it looks like code, URLs, IDs, etc.
    if (
      text.length < 3 ||
      text.length > 50 ||
      /^[A-Z_]+$/.test(text) || // CONSTANTS
      /^[a-z_]+$/.test(text) || // variables
      /^[0-9.]+$/.test(text) || // numbers
      text.includes('/') || // paths
      text.includes('@') || // emails/handles
      text.includes('px') || // CSS
      text.includes('%') ||
      text.includes('#') ||
      text.includes('var(') ||
      text.startsWith('hsl(') ||
      text.startsWith('rgb(') ||
      text.includes('rem') ||
      text.includes('vh') ||
      text.includes('vw') ||
      text.includes('calc(') ||
      text.includes('function') ||
      text.includes('return') ||
      text.includes('const ') ||
      text.includes('let ') ||
      text.includes('var ') ||
      text.includes('typeof') ||
      text.includes('instanceof') ||
      text.includes('===') ||
      text.includes('!==') ||
      text.includes('&&') ||
      text.includes('||') ||
      /^[a-f0-9]{8,}$/i.test(text) // hex strings
    ) {
      return false;
    }

    // Look for natural language patterns
    return /[A-Z][a-z]|[a-z] [a-z]|[a-z]'[a-z]/.test(text);
  }

  private async extractLocaleKeys(): Promise<void> {
    console.log('📚 Extracting locale keys from LanguageContext...');

    if (!fs.existsSync(this.localesPath)) {
      console.error(`❌ LanguageContext file not found: ${this.localesPath}`);
      return;
    }

    const content = fs.readFileSync(this.localesPath, 'utf-8');
    
    // Extract keys from the translations object
    const arMatch = content.match(/ar:\s*{([\s\S]*?)},\s*en:/);
    const enMatch = content.match(/en:\s*{([\s\S]*?)}\s*};/);

    if (arMatch) {
      this.extractKeysFromTranslationBlock(arMatch[1], this.result.arKeys);
    }

    if (enMatch) {
      this.extractKeysFromTranslationBlock(enMatch[1], this.result.enKeys);
    }

    console.log(`✅ Found ${this.result.enKeys.size} English keys and ${this.result.arKeys.size} Arabic keys\n`);
  }

  private extractKeysFromTranslationBlock(block: string, keySet: Set<string>): void {
    // Match keys in the format 'key': 'value'
    const keyMatches = block.match(/'([^']+)':/g);
    if (keyMatches) {
      keyMatches.forEach(match => {
        const key = match.slice(1, -2); // Remove quotes and colon
        keySet.add(key);
      });
    }
  }

  private identifyMissingKeys(): void {
    // Keys that exist in English but not in Arabic
    this.result.missingArKeys = Array.from(this.result.enKeys).filter(
      key => !this.result.arKeys.has(key)
    );

    // Also check for t() keys that don't exist in either locale
    const missingFromBoth = Array.from(this.result.tKeys).filter(
      key => !this.result.enKeys.has(key) && !this.result.arKeys.has(key)
    );

    if (missingFromBoth.length > 0) {
      console.log(`⚠️  Found ${missingFromBoth.length} t() keys not in any locale:`);
      missingFromBoth.forEach(key => console.log(`   - ${key}`));
      console.log('');
    }
  }

  private identifyUnusedKeys(): void {
    // Keys that exist in locales but are never used in t() calls
    this.result.unusedKeys = Array.from(this.result.enKeys).filter(
      key => !this.result.tKeys.has(key)
    );
  }

  private calculateSummary(): void {
    this.result.summary.hardcodedStringsFound = this.result.hardcodedStrings.length;
    this.result.summary.tKeysFound = this.result.tKeys.size;
    this.result.summary.enKeysCount = this.result.enKeys.size;
    this.result.summary.arKeysCount = this.result.arKeys.size;
    this.result.summary.missingArKeysCount = this.result.missingArKeys.length;
    this.result.summary.unusedKeysCount = this.result.unusedKeys.length;
    
    if (this.result.enKeys.size > 0) {
      this.result.summary.coveragePercent = Math.round(
        (this.result.arKeys.size / this.result.enKeys.size) * 100
      );
    }
  }

  private outputResults(): void {
    console.log('📊 AUDIT RESULTS');
    console.log('================\n');

    console.log('📈 Summary:');
    console.log(`   Files scanned: ${this.result.summary.filesScanned}`);
    console.log(`   Hardcoded strings: ${this.result.summary.hardcodedStringsFound}`);
    console.log(`   t() keys found: ${this.result.summary.tKeysFound}`);
    console.log(`   English keys: ${this.result.summary.enKeysCount}`);
    console.log(`   Arabic keys: ${this.result.summary.arKeysCount}`);
    console.log(`   Missing Arabic keys: ${this.result.summary.missingArKeysCount}`);
    console.log(`   Coverage: ${this.result.summary.coveragePercent}%\n`);

    if (this.result.missingArKeys.length > 0) {
      console.log('❌ Missing Arabic translations:');
      this.result.missingArKeys.forEach(key => console.log(`   - ${key}`));
      console.log('');
    }

    if (this.result.hardcodedStrings.length > 0) {
      console.log('⚠️  Potential hardcoded strings:');
      this.result.hardcodedStrings.slice(0, 10).forEach(item => {
        console.log(`   ${item.file}:${item.line} - "${item.content}"`);
      });
      if (this.result.hardcodedStrings.length > 10) {
        console.log(`   ... and ${this.result.hardcodedStrings.length - 10} more`);
      }
      console.log('');
    }

    // Write detailed results to JSON
    const outputPath = path.join(this.projectRoot, 'missing_ar_keys.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.result, (key, value) => {
      if (value instanceof Set) {
        return Array.from(value);
      }
      return value;
    }, 2));

    console.log(`📄 Detailed results written to: ${outputPath}\n`);

    // Exit with error code if there are missing keys
    if (this.result.missingArKeys.length > 0) {
      console.log('❌ AUDIT FAILED: Missing Arabic translations detected');
      process.exit(1);
    } else {
      console.log('✅ AUDIT PASSED: All keys have Arabic translations');
    }
  }
}

// Run the audit
if (require.main === module) {
  const auditor = new I18nAuditor();
  auditor.audit().catch(error => {
    console.error('💥 Audit failed:', error);
    process.exit(1);
  });
}

export { I18nAuditor };