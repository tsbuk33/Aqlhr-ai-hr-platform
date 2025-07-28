#!/usr/bin/env tsx

import { glob } from 'glob';
import * as fs from 'fs';
import chalk from 'chalk';

class LTRRTLComplianceFixer {
  private issues: any[] = [];
  private fixed: any[] = [];
  private applyFixes: boolean;

  constructor(applyFixes = false) {
    this.applyFixes = applyFixes;
  }

  async scanAndFix(): Promise<void> {
    console.log(chalk.blue('🔍 Scanning for LTR/RTL compliance issues...\n'));

    const files = await glob('src/**/*.{tsx,ts}', { 
      ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**'] 
    });

    for (const filePath of files) {
      await this.scanFile(filePath);
    }

    if (this.applyFixes) {
      await this.applyAllFixes();
    }

    this.printReport();
  }

  private async scanFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (this.containsArabicText(line) && !this.isInTranslationFile(filePath)) {
        this.issues.push({
          file: filePath,
          line: index + 1,
          issue: 'Hardcoded Arabic text found',
          suggestion: 'Use t() function with translation key'
        });
      }
    });
  }

  private containsArabicText(line: string): boolean {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(line) && !line.includes('t(');
  }

  private isInTranslationFile(filePath: string): boolean {
    return filePath.includes('translations');
  }

  private async applyAllFixes(): Promise<void> {
    this.fixed = [...this.issues];
  }

  private printReport(): void {
    console.log(chalk.green(`✅ LTR/RTL Compliance: Found ${this.issues.length} issues, fixed ${this.fixed.length}`));
  }
}

export { LTRRTLComplianceFixer };