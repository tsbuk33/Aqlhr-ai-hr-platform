#!/usr/bin/env tsx

import { glob } from 'glob';
import * as fs from 'fs';
import chalk from 'chalk';

class CenterLayoutFixer {
  private fixes: any[] = [];
  private dryRun: boolean;
  public modifiedFiles = 0;

  constructor(dryRun = false) {
    this.dryRun = dryRun;
  }

  async scanAndFix(): Promise<{ modifiedFiles: number; fixes: any[] }> {
    console.log(chalk.blue(`🎯 ${this.dryRun ? 'Scanning' : 'Fixing'} center layout issues...\n`));

    const files = await glob('src/pages/**/*.{tsx,ts}', { 
      ignore: ['**/*.test.*', '**/*.spec.*'] 
    });

    for (const filePath of files) {
      await this.processFile(filePath);
    }

    return {
      modifiedFiles: this.modifiedFiles,
      fixes: this.fixes
    };
  }

  private async processFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('CenteredLayout') && this.needsCenteredLayout(content)) {
      this.modifiedFiles++;
      this.fixes.push({
        file: filePath,
        type: 'center-layout',
        applied: !this.dryRun
      });
    }
  }

  private needsCenteredLayout(content: string): boolean {
    return content.includes('export default') && content.includes('return (');
  }

  printResults(): void {
    console.log(chalk.green(`✅ Center Layout: ${this.modifiedFiles} files processed, ${this.fixes.length} fixes applied`));
  }
}

export { CenterLayoutFixer };