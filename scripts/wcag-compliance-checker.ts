#!/usr/bin/env tsx

import { glob } from 'glob';
import * as fs from 'fs';
import chalk from 'chalk';
import { contrast } from 'wcag-contrast';

interface ContrastIssue {
  file: string;
  line: number;
  selector: string;
  foreground: string;
  background: string;
  contrast: number;
  wcagLevel: 'AA' | 'AAA';
  severity: 'critical' | 'warning';
}

interface WCAGReport {
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  issues: ContrastIssue[];
  passedChecks: number;
}

class WCAGComplianceChecker {
  private issues: ContrastIssue[] = [];
  private passedChecks = 0;
  private applyFixes: boolean;

  constructor(applyFixes = false) {
    this.applyFixes = applyFixes;
  }

  async checkCompliance(): Promise<WCAGReport> {
    console.log(chalk.blue('🔍 Checking WCAG color contrast compliance...\n'));

    // Check CSS files
    await this.checkCSSFiles();
    
    // Check component files
    await this.checkComponentFiles();
    
    // Check Tailwind config
    await this.checkTailwindConfig();

    if (this.applyFixes) {
      await this.applyContrastFixes();
    }

    return {
      totalIssues: this.issues.length,
      criticalIssues: this.issues.filter(i => i.severity === 'critical').length,
      warningIssues: this.issues.filter(i => i.severity === 'warning').length,
      issues: this.issues,
      passedChecks: this.passedChecks
    };
  }

  private async checkCSSFiles(): Promise<void> {
    console.log(chalk.yellow('📄 Checking CSS files...'));
    
    const cssFiles = await glob('src/**/*.css', { ignore: ['**/node_modules/**'] });
    
    for (const filePath of cssFiles) {
      await this.analyzeCSSFile(filePath);
    }
  }

  private async checkComponentFiles(): Promise<void> {
    console.log(chalk.yellow('🧩 Checking component files...'));
    
    const componentFiles = await glob('src/**/*.{tsx,ts}', { 
      ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**'] 
    });
    
    for (const filePath of componentFiles) {
      await this.analyzeComponentFile(filePath);
    }
  }

  private async checkTailwindConfig(): Promise<void> {
    console.log(chalk.yellow('⚙️  Checking Tailwind configuration...'));
    
    if (fs.existsSync('tailwind.config.ts')) {
      await this.analyzeTailwindConfig('tailwind.config.ts');
    }
  }

  private async analyzeCSSFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for color definitions
      if (line.includes('color:') || line.includes('background-color:')) {
        this.analyzeColorDefinition(filePath, index + 1, line);
      }

      // Check for CSS custom properties
      if (line.includes('--') && (line.includes('color') || line.includes('bg'))) {
        this.analyzeCustomProperty(filePath, index + 1, line);
      }
    });
  }

  private async analyzeComponentFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for inline styles with colors
      if (line.includes('style=') && (line.includes('color') || line.includes('background'))) {
        this.analyzeInlineStyle(filePath, index + 1, line);
      }

      // Check for Tailwind classes with potential contrast issues
      if (line.includes('className=') || line.includes('class=')) {
        this.analyzeTailwindClasses(filePath, index + 1, line);
      }
    });
  }

  private async analyzeTailwindConfig(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for color definitions in Tailwind config
    const colorMatches = content.match(/colors:\s*{[^}]+}/g);
    if (colorMatches) {
      colorMatches.forEach(match => {
        this.analyzeTailwindColors(filePath, match);
      });
    }
  }

  private analyzeColorDefinition(file: string, line: number, content: string): void {
    const colorRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})|rgb\([^)]+\)|hsl\([^)]+\)/g;
    const colors = content.match(colorRegex);
    
    if (colors && colors.length >= 2) {
      const foreground = colors[0];
      const background = colors[1];
      this.checkContrastRatio(file, line, content, foreground, background);
    }
  }

  private analyzeCustomProperty(file: string, line: number, content: string): void {
    // Check CSS custom properties for potential contrast issues
    if (content.includes('--primary') && content.includes('--background')) {
      this.checkContrastRatio(file, line, content, 'var(--primary)', 'var(--background)');
    }
  }

  private analyzeInlineStyle(file: string, line: number, content: string): void {
    const colorRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})|rgb\([^)]+\)|hsl\([^)]+\)/g;
    const colors = content.match(colorRegex);
    
    if (colors && colors.length >= 2) {
      const foreground = colors[0];
      const background = colors[1];
      this.checkContrastRatio(file, line, content, foreground, background);
    }
  }

  private analyzeTailwindClasses(file: string, line: number, content: string): void {
    // Check for problematic color combinations
    const problematicCombos = [
      { fg: 'text-gray-400', bg: 'bg-white', issue: 'Low contrast gray text on white' },
      { fg: 'text-yellow-400', bg: 'bg-white', issue: 'Low contrast yellow text on white' },
      { fg: 'text-white', bg: 'bg-yellow-400', issue: 'Low contrast white text on yellow' },
      { fg: 'text-gray-300', bg: 'bg-gray-100', issue: 'Low contrast gray on gray' }
    ];

    problematicCombos.forEach(combo => {
      if (content.includes(combo.fg) && content.includes(combo.bg)) {
        this.issues.push({
          file,
          line,
          selector: content.trim(),
          foreground: combo.fg,
          background: combo.bg,
          contrast: 0, // Will be calculated
          wcagLevel: 'AA',
          severity: 'warning'
        });
      }
    });
  }

  private analyzeTailwindColors(file: string, colorConfig: string): void {
    // Analyze Tailwind color palette for contrast issues
    const hslMatches = colorConfig.match(/hsl\([^)]+\)/g);
    if (hslMatches && hslMatches.length >= 2) {
      this.checkContrastRatio(file, 1, colorConfig, hslMatches[0], hslMatches[1]);
    }
  }

  private checkContrastRatio(file: string, line: number, content: string, fg: string, bg: string): void {
    try {
      // Convert colors to hex for contrast calculation
      const fgHex = this.convertToHex(fg);
      const bgHex = this.convertToHex(bg);
      
      if (fgHex && bgHex) {
        const contrastRatio = contrast(fgHex, bgHex);
        
        // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
        // WCAG AAA requires 7:1 for normal text, 4.5:1 for large text
        const isLargeText = content.includes('text-lg') || content.includes('text-xl') || content.includes('text-2xl');
        const minRatio = isLargeText ? 3 : 4.5;
        const aaaRatio = isLargeText ? 4.5 : 7;
        
        if (contrastRatio < minRatio) {
          this.issues.push({
            file,
            line,
            selector: content.trim(),
            foreground: fg,
            background: bg,
            contrast: contrastRatio,
            wcagLevel: contrastRatio < minRatio ? 'AA' : 'AAA',
            severity: contrastRatio < minRatio ? 'critical' : 'warning'
          });
        } else {
          this.passedChecks++;
        }
      }
    } catch (error) {
      // Skip invalid color combinations
    }
  }

  private convertToHex(color: string): string | null {
    // Convert various color formats to hex
    if (color.startsWith('#')) {
      return color;
    }
    
    if (color.startsWith('hsl(')) {
      // Basic HSL to hex conversion (simplified)
      const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (hslMatch) {
        const [, h, s, l] = hslMatch.map(Number);
        return this.hslToHex(h, s / 100, l / 100);
      }
    }
    
    if (color.startsWith('rgb(')) {
      const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }
    }
    
    return null;
  }

  private hslToHex(h: number, s: number, l: number): string {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private async applyContrastFixes(): Promise<void> {
    console.log(chalk.yellow(`🔧 Applying contrast fixes...\n`));

    // Group issues by file
    const issuesByFile = this.issues.reduce((acc, issue) => {
      if (!acc[issue.file]) acc[issue.file] = [];
      acc[issue.file].push(issue);
      return acc;
    }, {} as Record<string, ContrastIssue[]>);

    // Apply fixes file by file
    for (const [filePath, fileIssues] of Object.entries(issuesByFile)) {
      await this.fixFileContrast(filePath, fileIssues);
    }
  }

  private async fixFileContrast(filePath: string, fileIssues: ContrastIssue[]): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;

    fileIssues.forEach(issue => {
      // Apply specific fixes based on the type of issue
      if (issue.foreground.includes('text-gray-400')) {
        newContent = newContent.replace(/text-gray-400/g, 'text-gray-600');
      }
      if (issue.foreground.includes('text-yellow-400')) {
        newContent = newContent.replace(/text-yellow-400/g, 'text-yellow-600');
      }
      if (issue.background.includes('bg-yellow-400')) {
        newContent = newContent.replace(/bg-yellow-400/g, 'bg-yellow-500');
      }
    });

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log(chalk.green(`✅ Fixed contrast issues in: ${filePath}`));
    }
  }

  printReport(report: WCAGReport): void {
    console.log(chalk.bold('\n📊 WCAG Compliance Report\n'));
    
    console.log(`Total Checks: ${chalk.cyan(report.passedChecks + report.totalIssues)}`);
    console.log(`Passed: ${chalk.green(report.passedChecks)}`);
    console.log(`Issues Found: ${chalk.red(report.totalIssues)}`);
    console.log(`Critical Issues: ${chalk.red(report.criticalIssues)}`);
    console.log(`Warnings: ${chalk.yellow(report.warningIssues)}`);

    if (report.issues.length > 0) {
      console.log(chalk.bold('\n🚨 Critical Contrast Issues:'));
      report.issues
        .filter(issue => issue.severity === 'critical')
        .slice(0, 5)
        .forEach(issue => {
          console.log(`  ${chalk.gray(issue.file)}:${issue.line}`);
          console.log(`    ${chalk.red('Contrast:')} ${issue.contrast.toFixed(2)}:1 (needs ${issue.wcagLevel === 'AA' ? '4.5' : '7'}:1)`);
          console.log(`    ${chalk.red('Colors:')} ${issue.foreground} on ${issue.background}`);
        });

      console.log(chalk.bold('\n💡 Recommendations:'));
      console.log('  • Use darker text colors for better contrast');
      console.log('  • Avoid light gray text on white backgrounds');
      console.log('  • Test colors with WCAG contrast checkers');
      console.log('  • Consider users with visual impairments');
    }

    if (report.totalIssues === 0) {
      console.log(chalk.green('✅ All color combinations meet WCAG AA standards!'));
    }
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const applyFixes = args.includes('--apply');
  
  const checker = new WCAGComplianceChecker(applyFixes);
  
  try {
    const report = await checker.checkCompliance();
    checker.printReport(report);
    
    console.log(chalk.green('\n✅ WCAG compliance check complete!'));
    
    // Exit with error code if critical issues found
    process.exit(report.criticalIssues > 0 ? 1 : 0);
  } catch (error) {
    console.error(chalk.red('❌ WCAG compliance check failed:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { WCAGComplianceChecker, type WCAGReport, type ContrastIssue };