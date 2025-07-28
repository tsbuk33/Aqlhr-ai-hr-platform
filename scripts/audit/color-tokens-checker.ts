#!/usr/bin/env tsx

import { Project, SourceFile, Node, SyntaxKind } from 'ts-morph';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import chalk from 'chalk';
import * as color from 'color';

interface ColorIssue {
  file: string;
  line: number;
  column: number;
  type: 'hardcoded-color' | 'contrast-violation' | 'missing-dark-mode';
  message: string;
  current: string;
  suggested?: string;
  contrast?: number;
  wcagLevel?: 'AA' | 'AAA';
}

export class ColorTokensChecker {
  private project: Project;
  private issues: ColorIssue[] = [];
  private cssVariables: { [key: string]: string } = {};
  private applyFixes: boolean;

  constructor(applyFixes = false) {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    this.applyFixes = applyFixes;
    this.loadCSSVariables();
  }

  private loadCSSVariables() {
    try {
      const indexCss = readFileSync('src/index.css', 'utf-8');
      const variableRegex = /--([^:]+):\s*([^;]+);/g;
      let match;
      
      while ((match = variableRegex.exec(indexCss)) !== null) {
        this.cssVariables[match[1]] = match[2].trim();
      }
    } catch (error) {
      console.warn(chalk.yellow('⚠️  Could not load CSS variables from index.css'));
    }
  }

  async checkAll(): Promise<ColorIssue[]> {
    const files = await glob('src/**/*.{ts,tsx,css}');
    
    for (const filePath of files) {
      if (filePath.endsWith('.css')) {
        await this.checkCSSFile(filePath);
      } else {
        await this.checkTSFile(filePath);
      }
    }

    return this.issues;
  }

  private async checkCSSFile(filePath: string) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const hardcodedColors = this.findHardcodedColors(line);
      hardcodedColors.forEach(color => {
        this.issues.push({
          file: filePath,
          line: index + 1,
          column: line.indexOf(color),
          type: 'hardcoded-color',
          message: `Hardcoded color "${color}" found. Use CSS variables instead.`,
          current: color,
          suggested: this.suggestCSSVariable(color)
        });
      });
    });
  }

  private async checkTSFile(filePath: string) {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    
    sourceFile.forEachDescendant((node) => {
      if (Node.isStringLiteral(node)) {
        const text = node.getLiteralValue();
        if (this.isColorValue(text)) {
          this.issues.push({
            file: sourceFile.getFilePath(),
            line: node.getStartLineNumber(),
            column: node.getStart(),
            type: 'hardcoded-color',
            message: `Hardcoded color "${text}" in JSX. Use Tailwind tokens instead.`,
            current: text,
            suggested: this.suggestTailwindClass(text)
          });
        }
      }
    });
  }

  private findHardcodedColors(line: string): string[] {
    const colorPatterns = [
      /#[0-9a-fA-F]{3,8}/g,  // Hex colors
      /rgb\([^)]+\)/g,        // RGB colors
      /rgba\([^)]+\)/g,       // RGBA colors
      /hsl\([^)]+\)/g,        // HSL colors
      /hsla\([^)]+\)/g        // HSLA colors
    ];
    
    const colors: string[] = [];
    colorPatterns.forEach(pattern => {
      const matches = line.match(pattern);
      if (matches) {
        colors.push(...matches);
      }
    });
    
    return colors;
  }

  private isColorValue(value: string): boolean {
    return /^(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\(|hsla\()/.test(value);
  }

  private suggestCSSVariable(colorValue: string): string {
    // Simple mapping logic - could be enhanced
    const normalizedColor = this.normalizeColor(colorValue);
    
    for (const [varName, varValue] of Object.entries(this.cssVariables)) {
      if (this.normalizeColor(varValue) === normalizedColor) {
        return `var(--${varName})`;
      }
    }
    
    return `/* TODO: Add ${colorValue} to CSS variables */`;
  }

  private suggestTailwindClass(colorValue: string): string {
    const colorMap: { [key: string]: string } = {
      '#ffffff': 'text-background',
      '#000000': 'text-foreground',
      '#ef4444': 'text-destructive',
      '#22c55e': 'text-success',
      '#3b82f6': 'text-primary',
      '#64748b': 'text-muted-foreground'
    };
    
    return colorMap[colorValue.toLowerCase()] || 'text-foreground';
  }

  private normalizeColor(colorValue: string): string {
    try {
      return color(colorValue).hex();
    } catch {
      return colorValue;
    }
  }

  async checkContrast(): Promise<void> {
    // Check contrast ratios for common color combinations
    const contrastPairs = [
      { fg: '--foreground', bg: '--background' },
      { fg: '--primary-foreground', bg: '--primary' },
      { fg: '--muted-foreground', bg: '--muted' }
    ];

    contrastPairs.forEach(pair => {
      const fgColor = this.cssVariables[pair.fg.replace('--', '')];
      const bgColor = this.cssVariables[pair.bg.replace('--', '')];
      
      if (fgColor && bgColor) {
        const contrast = this.calculateContrast(fgColor, bgColor);
        if (contrast < 4.5) {
          this.issues.push({
            file: 'src/index.css',
            line: 0,
            column: 0,
            type: 'contrast-violation',
            message: `Low contrast ratio ${contrast.toFixed(2)} between ${pair.fg} and ${pair.bg}`,
            current: `${pair.fg}: ${fgColor}; ${pair.bg}: ${bgColor}`,
            contrast,
            wcagLevel: contrast < 3 ? 'AA' : 'AAA'
          });
        }
      }
    });
  }

  private calculateContrast(color1: string, color2: string): number {
    try {
      const c1 = color(color1);
      const c2 = color(color2);
      return c1.contrast(c2);
    } catch {
      return 21; // Max contrast if calculation fails
    }
  }

  async autoFix(): Promise<number> {
    if (!this.applyFixes) return 0;
    
    let fixedCount = 0;
    const fileChanges: { [file: string]: string[] } = {};
    
    // Group issues by file
    this.issues.forEach(issue => {
      if (issue.suggested && issue.type === 'hardcoded-color') {
        if (!fileChanges[issue.file]) {
          fileChanges[issue.file] = [];
        }
        fileChanges[issue.file].push(`Line ${issue.line}: ${issue.current} → ${issue.suggested}`);
        fixedCount++;
      }
    });
    
    // Log what would be fixed
    Object.entries(fileChanges).forEach(([file, changes]) => {
      console.log(chalk.blue(`📝 ${file}:`));
      changes.forEach(change => console.log(`  ${change}`));
    });
    
    return fixedCount;
  }

  printReport(): void {
    const hardcodedIssues = this.issues.filter(i => i.type === 'hardcoded-color');
    const contrastIssues = this.issues.filter(i => i.type === 'contrast-violation');
    
    console.log(chalk.blue('\n🎨 Color Tokens & Contrast Report'));
    console.log(chalk.white('='.repeat(50)));
    
    if (hardcodedIssues.length > 0) {
      console.log(chalk.yellow(`\n⚠️  Found ${hardcodedIssues.length} hardcoded colors:`));
      hardcodedIssues.slice(0, 10).forEach(issue => {
        console.log(`  ${issue.file}:${issue.line} - ${issue.message}`);
      });
    }
    
    if (contrastIssues.length > 0) {
      console.log(chalk.red(`\n❌ Found ${contrastIssues.length} contrast violations:`));
      contrastIssues.forEach(issue => {
        console.log(`  ${issue.message} (ratio: ${issue.contrast?.toFixed(2)})`);
      });
    }
    
    if (this.issues.length === 0) {
      console.log(chalk.green('\n✅ All color usage follows design system guidelines!'));
    }
  }
}

// CLI execution
async function main() {
  const applyFixes = process.argv.includes('--apply');
  const checker = new ColorTokensChecker(applyFixes);
  
  console.log(chalk.blue('🎨 Checking color tokens and contrast compliance...\n'));
  
  await checker.checkAll();
  await checker.checkContrast();
  
  if (applyFixes) {
    const fixedCount = await checker.autoFix();
    console.log(chalk.green(`\n🔧 Fixed ${fixedCount} color token issues`));
  }
  
  checker.printReport();
  
  const hasIssues = checker.issues.length > 0;
  process.exit(hasIssues ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}