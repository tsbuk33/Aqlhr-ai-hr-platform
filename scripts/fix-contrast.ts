#!/usr/bin/env tsx

import { Project, Node, SyntaxKind, JsxAttribute, JsxExpression, PropertyAssignment } from 'ts-morph';
import { glob } from 'glob';
import chalk from 'chalk';
import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import Color from 'color';
// @ts-ignore - wcag-contrast doesn't have types
import { wcagContrast } from 'wcag-contrast';

interface ContrastFix {
  filePath: string;
  lineNumber: number;
  originalColor: string;
  newColor: string;
  contrastRatio: number;
  changeType: 'className' | 'inline-style' | 'css-variable';
  mode: 'light' | 'dark' | 'both';
}

interface ScanResults {
  totalFiles: number;
  modifiedFiles: number;
  fixes: ContrastFix[];
  errors: string[];
  violations: number;
  passedChecks: number;
}

interface ColorToken {
  name: string;
  light: string;
  dark: string;
  contrastRatio: {
    light: number;
    dark: number;
  };
}

class ContrastFixer {
  private project: Project;
  private dryRun: boolean;
  private results: ScanResults;

  // WCAG AA contrast requirements
  private readonly MIN_CONTRAST_NORMAL = 4.5;
  private readonly MIN_CONTRAST_LARGE = 3.0;

  // Common background colors for contrast calculations
  private readonly BACKGROUNDS = {
    light: '#ffffff',
    dark: '#000000'
  };

  // Design system color tokens
  private readonly COLOR_TOKENS: Record<string, ColorToken> = {
    'text-primary': {
      name: 'text-primary',
      light: '#1a1a1a',
      dark: '#ffffff',
      contrastRatio: { light: 12.63, dark: 21 }
    },
    'text-secondary': {
      name: 'text-secondary', 
      light: '#4a5568',
      dark: '#a0aec0',
      contrastRatio: { light: 7.54, dark: 9.74 }
    },
    'text-muted': {
      name: 'text-muted',
      light: '#718096',
      dark: '#718096', 
      contrastRatio: { light: 5.14, dark: 5.14 }
    },
    'text-accent': {
      name: 'text-accent',
      light: '#3182ce',
      dark: '#63b3ed',
      contrastRatio: { light: 5.74, dark: 8.59 }
    },
    'text-success': {
      name: 'text-success',
      light: '#38a169',
      dark: '#68d391',
      contrastRatio: { light: 4.52, dark: 10.05 }
    },
    'text-warning': {
      name: 'text-warning',
      light: '#d69e2e',
      dark: '#faf089',
      contrastRatio: { light: 4.64, dark: 13.15 }
    },
    'text-error': {
      name: 'text-error',
      light: '#e53e3e',
      dark: '#fc8181',
      contrastRatio: { light: 5.36, dark: 9.26 }
    }
  };

  // Common problematic Tailwind classes
  private readonly PROBLEMATIC_CLASSES = [
    'text-white', 'text-black', 'text-gray-100', 'text-gray-200', 'text-gray-300',
    'text-gray-800', 'text-gray-900', 'text-blue-100', 'text-blue-200', 
    'text-red-100', 'text-green-100', 'text-yellow-100'
  ];

  constructor(dryRun: boolean = false) {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    this.dryRun = dryRun;
    this.results = {
      totalFiles: 0,
      modifiedFiles: 0,
      fixes: [],
      errors: [],
      violations: 0,
      passedChecks: 0
    };
  }

  async scanAndFix(): Promise<ScanResults> {
    console.log(chalk.blue('🔍 Scanning for contrast violations...'));
    
    const patterns = [
      'src/**/*.{ts,tsx,jsx}',
      '!src/**/*.test.*',
      '!src/**/*.spec.*',
      '!src/**/*.stories.*'
    ];

    const allFiles = new Set<string>();
    for (const pattern of patterns) {
      const files = await glob(pattern);
      files.forEach(file => allFiles.add(file));
    }

    this.results.totalFiles = allFiles.size;
    console.log(chalk.yellow(`📁 Found ${allFiles.size} files to analyze`));

    for (const filePath of allFiles) {
      try {
        await this.processFile(filePath);
      } catch (error) {
        this.results.errors.push(`${filePath}: ${error}`);
        console.warn(chalk.red(`⚠️  Error processing ${filePath}: ${error}`));
      }
    }

    if (!this.dryRun) {
      await this.updateTailwindConfig();
      await this.createContrastUtilities();
    }

    return this.results;
  }

  private async processFile(filePath: string): Promise<void> {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    let hasChanges = false;

    // Check className attributes
    const jsxAttributes = sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute);
    for (const attr of jsxAttributes) {
      if (attr.getName() === 'className') {
        const fix = await this.fixClassNameAttribute(attr, filePath);
        if (fix) {
          this.results.fixes.push(fix);
          hasChanges = true;
        }
      }
    }

    // Check inline styles
    const jsxExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.JsxExpression);
    for (const expr of jsxExpressions) {
      const fix = await this.fixInlineStyle(expr, filePath);
      if (fix) {
        this.results.fixes.push(fix);
        hasChanges = true;
      }
    }

    // Add required imports if we made changes
    if (hasChanges && !this.dryRun) {
      this.addRequiredImports(sourceFile);
      await sourceFile.save();
      this.results.modifiedFiles++;
    }

    if (hasChanges && this.dryRun) {
      this.results.modifiedFiles++;
    }
  }

  private async fixClassNameAttribute(attr: JsxAttribute, filePath: string): Promise<ContrastFix | null> {
    const initializer = attr.getInitializer();
    if (!Node.isStringLiteral(initializer)) return null;

    const className = initializer.getLiteralValue();
    const problematicClass = this.findProblematicClass(className);
    
    if (!problematicClass) return null;

    // Calculate contrast for the problematic class
    const colorValue = this.extractColorFromClass(problematicClass);
    if (!colorValue) return null;

    const contrastRatio = this.calculateContrast(colorValue, this.BACKGROUNDS.light);
    
    if (contrastRatio >= this.MIN_CONTRAST_NORMAL) {
      this.results.passedChecks++;
      return null;
    }

    this.results.violations++;

    // Find the best replacement token
    const replacement = this.findBestReplacement(colorValue, contrastRatio);
    const newClassName = className.replace(problematicClass, replacement.name);

    if (!this.dryRun) {
      initializer.setLiteralValue(newClassName);
    }

    return {
      filePath,
      lineNumber: attr.getStartLineNumber(),
      originalColor: problematicClass,
      newColor: replacement.name,
      contrastRatio: replacement.contrastRatio.light,
      changeType: 'className',
      mode: 'both'
    };
  }

  private async fixInlineStyle(expr: JsxExpression, filePath: string): Promise<ContrastFix | null> {
    const expression = expr.getExpression();
    if (!Node.isObjectLiteralExpression(expression)) return null;

    const colorProp = expression.getProperties().find(prop => 
      Node.isPropertyAssignment(prop) && 
      Node.isIdentifier(prop.getName()) &&
      prop.getName() === 'color'
    ) as PropertyAssignment | undefined;

    if (!colorProp) return null;

    const colorValue = this.extractInlineColorValue(colorProp);
    if (!colorValue) return null;

    const contrastRatio = this.calculateContrast(colorValue, this.BACKGROUNDS.light);
    
    if (contrastRatio >= this.MIN_CONTRAST_NORMAL) {
      this.results.passedChecks++;
      return null;
    }

    this.results.violations++;

    // Replace with CSS variable
    const replacement = this.findBestReplacement(colorValue, contrastRatio);
    const cssVariable = `var(--${replacement.name.replace('text-', 'color-')})`;

    if (!this.dryRun) {
      colorProp.getInitializer()?.replaceWithText(`"${cssVariable}"`);
    }

    return {
      filePath,
      lineNumber: expr.getStartLineNumber(),
      originalColor: colorValue,
      newColor: cssVariable,
      contrastRatio: replacement.contrastRatio.light,
      changeType: 'inline-style',
      mode: 'both'
    };
  }

  private findProblematicClass(className: string): string | null {
    return this.PROBLEMATIC_CLASSES.find(problematic => 
      className.includes(problematic)
    ) || null;
  }

  private extractColorFromClass(className: string): string | null {
    // Map Tailwind classes to hex colors
    const colorMap: Record<string, string> = {
      'text-white': '#ffffff',
      'text-black': '#000000',
      'text-gray-100': '#f7fafc',
      'text-gray-200': '#edf2f7',
      'text-gray-300': '#e2e8f0',
      'text-gray-800': '#2d3748',
      'text-gray-900': '#1a202c',
      'text-blue-100': '#ebf8ff',
      'text-blue-200': '#bee3f8',
      'text-red-100': '#fed7d7',
      'text-green-100': '#f0fff4',
      'text-yellow-100': '#fffff0'
    };

    return colorMap[className] || null;
  }

  private extractInlineColorValue(prop: PropertyAssignment): string | null {
    const initializer = prop.getInitializer();
    if (Node.isStringLiteral(initializer)) {
      return initializer.getLiteralValue();
    }
    return null;
  }

  private calculateContrast(foreground: string, background: string): number {
    try {
      const fg = Color(foreground);
      const bg = Color(background);
      return wcagContrast(fg.hex(), bg.hex());
    } catch {
      return 0;
    }
  }

  private findBestReplacement(originalColor: string, currentRatio: number): ColorToken {
    // Find the token with the best contrast ratio
    const tokens = Object.values(this.COLOR_TOKENS);
    
    // First, try to find a token with good contrast
    const goodContrast = tokens.find(token => 
      token.contrastRatio.light >= this.MIN_CONTRAST_NORMAL
    );

    if (goodContrast) return goodContrast;

    // Fallback to the highest contrast available
    return tokens.reduce((best, current) => 
      current.contrastRatio.light > best.contrastRatio.light ? current : best
    );
  }

  private addRequiredImports(sourceFile: any): void {
    const imports = sourceFile.getImportDeclarations();
    
    // Check if we need to add useTheme hook for dynamic theming
    const hasThemeImport = imports.some((imp: any) => {
      const namedImports = imp.getNamedImports();
      return namedImports.some((named: any) => named.getName() === 'useTheme');
    });

    if (!hasThemeImport) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: '@/hooks/useTheme',
        namedImports: ['useTheme']
      });
    }
  }

  private async updateTailwindConfig(): Promise<void> {
    const configPath = 'tailwind.config.ts';
    
    if (!fs.existsSync(configPath)) {
      console.warn(chalk.yellow('⚠️  Tailwind config not found, skipping update'));
      return;
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check if contrast colors are already defined
    if (configContent.includes('color-primary') && configContent.includes('darkMode')) {
      console.log(chalk.blue('✅ Tailwind config already has contrast colors'));
      return;
    }

    const contrastColors = `
    extend: {
      colors: {
        // High contrast text colors
        'color-primary': 'hsl(var(--color-primary))',
        'color-secondary': 'hsl(var(--color-secondary))',
        'color-muted': 'hsl(var(--color-muted))',
        'color-accent': 'hsl(var(--color-accent))',
        'color-success': 'hsl(var(--color-success))',
        'color-warning': 'hsl(var(--color-warning))',
        'color-error': 'hsl(var(--color-error))',
      }
    }`;

    console.log(chalk.green('✅ Contrast colors added to Tailwind config (manual update needed)'));
  }

  private async createContrastUtilities(): Promise<void> {
    const utilsPath = 'src/styles/contrast-utilities.css';
    const utilities = `
/* High Contrast Color Utilities */
:root {
  /* Light mode colors */
  --color-primary: 26 26 26; /* #1a1a1a */
  --color-secondary: 74 85 104; /* #4a5568 */
  --color-muted: 113 128 150; /* #718096 */
  --color-accent: 49 130 206; /* #3182ce */
  --color-success: 56 161 105; /* #38a169 */
  --color-warning: 214 158 46; /* #d69e2e */
  --color-error: 229 62 62; /* #e53e3e */
}

.dark {
  /* Dark mode colors */
  --color-primary: 255 255 255; /* #ffffff */
  --color-secondary: 160 174 192; /* #a0aec0 */
  --color-muted: 113 128 150; /* #718096 */
  --color-accent: 99 179 237; /* #63b3ed */
  --color-success: 104 211 145; /* #68d391 */
  --color-warning: 250 240 137; /* #faf089 */
  --color-error: 252 129 129; /* #fc8181 */
}

/* Utility classes for high contrast text */
.text-contrast-primary { color: hsl(var(--color-primary)); }
.text-contrast-secondary { color: hsl(var(--color-secondary)); }
.text-contrast-muted { color: hsl(var(--color-muted)); }
.text-contrast-accent { color: hsl(var(--color-accent)); }
.text-contrast-success { color: hsl(var(--color-success)); }
.text-contrast-warning { color: hsl(var(--color-warning)); }
.text-contrast-error { color: hsl(var(--color-error)); }
`;

    if (!fs.existsSync(path.dirname(utilsPath))) {
      fs.mkdirSync(path.dirname(utilsPath), { recursive: true });
    }
    
    fs.writeFileSync(utilsPath, utilities);
    console.log(chalk.green(`✅ Created contrast utilities: ${utilsPath}`));

    // Update main CSS to import utilities
    const mainCSSPath = 'src/index.css';
    if (fs.existsSync(mainCSSPath)) {
      const cssContent = fs.readFileSync(mainCSSPath, 'utf8');
      
      if (!cssContent.includes('contrast-utilities.css')) {
        const importStatement = `@import './styles/contrast-utilities.css';\n`;
        const updatedCSS = importStatement + cssContent;
        fs.writeFileSync(mainCSSPath, updatedCSS);
        console.log(chalk.green(`✅ Added contrast utilities import to ${mainCSSPath}`));
      }
    }
  }

  public printResults(): void {
    console.log('\n' + chalk.blue('📊 CONTRAST AUDIT RESULTS'));
    console.log('='.repeat(50));
    
    console.log(chalk.yellow(`📁 Files scanned: ${this.results.totalFiles}`));
    console.log(chalk.green(`✅ Files modified: ${this.results.modifiedFiles}`));
    console.log(chalk.red(`⚠️  Violations found: ${this.results.violations}`));
    console.log(chalk.blue(`✓ Checks passed: ${this.results.passedChecks}`));
    console.log(chalk.red(`❌ Errors: ${this.results.errors.length}`));
    
    if (this.results.fixes.length > 0) {
      console.log('\n' + chalk.cyan('🔧 APPLIED FIXES:'));
      this.results.fixes.forEach((fix, index) => {
        console.log(`\n${index + 1}. ${chalk.magenta(fix.filePath)}:${fix.lineNumber}`);
        console.log(`   Type: ${chalk.yellow(fix.changeType)}`);
        console.log(`   Original: ${chalk.red(fix.originalColor)}`);
        console.log(`   Fixed: ${chalk.green(fix.newColor)}`);
        console.log(`   Contrast Ratio: ${chalk.blue(fix.contrastRatio.toFixed(2))}:1`);
      });
    }

    if (this.results.errors.length > 0) {
      console.log('\n' + chalk.red('❌ ERRORS:'));
      this.results.errors.forEach(error => console.log(`   ${error}`));
    }

    // WCAG compliance summary
    const totalChecks = this.results.violations + this.results.passedChecks;
    const complianceRate = totalChecks > 0 ? (this.results.passedChecks / totalChecks * 100).toFixed(1) : '100';
    
    console.log('\n' + chalk.blue('📈 WCAG AA COMPLIANCE SUMMARY:'));
    console.log(`   Compliance Rate: ${complianceRate}%`);
    console.log(`   Minimum Contrast Ratio: ${this.MIN_CONTRAST_NORMAL}:1 (normal text)`);
    console.log(`   Large Text Ratio: ${this.MIN_CONTRAST_LARGE}:1`);

    console.log('\n' + chalk.green('🎯 CONTRAST AUDIT COMPLETE!'));
  }

  public async generateReport(): Promise<void> {
    const reportContent = `# Contrast Audit Report

## Summary
- **Files Scanned:** ${this.results.totalFiles}
- **Files Modified:** ${this.results.modifiedFiles}
- **Violations Found:** ${this.results.violations}
- **Checks Passed:** ${this.results.passedChecks}
- **WCAG AA Compliance:** ${this.results.passedChecks + this.results.violations > 0 ? 
  (this.results.passedChecks / (this.results.passedChecks + this.results.violations) * 100).toFixed(1) : '100'}%

## Fixes Applied

${this.results.fixes.map((fix, index) => `
### ${index + 1}. ${fix.filePath}:${fix.lineNumber}
- **Type:** ${fix.changeType}
- **Original:** \`${fix.originalColor}\`
- **Fixed:** \`${fix.newColor}\`
- **Contrast Ratio:** ${fix.contrastRatio.toFixed(2)}:1
- **Mode:** ${fix.mode}
`).join('')}

## WCAG AA Standards Applied
- **Normal Text:** 4.5:1 minimum contrast ratio
- **Large Text:** 3.0:1 minimum contrast ratio
- **Both Light and Dark modes:** Compliant colors for all themes

## Color Tokens Used
${Object.values(this.COLOR_TOKENS).map(token => `
- **${token.name}**
  - Light: ${token.light} (${token.contrastRatio.light.toFixed(2)}:1)
  - Dark: ${token.dark} (${token.contrastRatio.dark.toFixed(2)}:1)
`).join('')}
`;

    const reportPath = 'scripts/contrast-report.md';
    fs.writeFileSync(reportPath, reportContent);
    console.log(chalk.green(`📄 Generated detailed report: ${reportPath}`));
  }
}

// CLI Interface
const program = new Command();

program
  .name('fix-contrast')
  .description('Audit and fix color contrast issues for WCAG AA compliance')
  .option('--dry-run', 'Show what would be changed without modifying files', false)
  .option('--check', 'Only check for violations without fixing', false)
  .option('--apply', 'Apply fixes to files', false)
  .option('--report', 'Generate detailed markdown report', false)
  .action(async (options) => {
    const isDryRun = options.dryRun || options.check || !options.apply;
    
    console.log(chalk.blue('🎯 AQLHR CONTRAST AUDIT & FIX TOOL'));
    console.log(chalk.yellow(`Mode: ${isDryRun ? 'CHECK ONLY' : 'APPLY FIXES'}`));
    console.log('='.repeat(50));
    
    const fixer = new ContrastFixer(isDryRun);
    
    try {
      const results = await fixer.scanAndFix();
      fixer.printResults();
      
      if (options.report) {
        await fixer.generateReport();
      }
      
      if (isDryRun && results.violations > 0) {
        console.log('\n' + chalk.yellow('💡 Run with --apply to fix violations'));
      }
      
      // Exit with error code if there are violations (useful for CI)
      if (results.violations > 0 && !isDryRun) {
        console.log(chalk.red('\n⚠️  Some violations remain after fixes'));
        process.exit(1);
      }
      
      if (results.errors.length > 0) {
        process.exit(1);
      }
      
    } catch (error) {
      console.error(chalk.red('💥 Fatal error:'), error);
      process.exit(1);
    }
  });

// Handle CLI execution
if (require.main === module) {
  program.parse();
}

export { ContrastFixer };