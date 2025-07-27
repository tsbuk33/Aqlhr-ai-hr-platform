import { readFileSync } from 'fs';
import { glob } from 'glob';
import chalk from 'chalk';
import { contrast } from 'wcag-contrast';

export interface ThemeIssue {
  file: string;
  line: number;
  type: 'low-contrast' | 'invalid-color' | 'missing-dark-mode';
  message: string;
  foreground?: string;
  background?: string;
  ratio?: number;
  fix?: string;
}

export class ThemeChecker {
  private issues: ThemeIssue[] = [];
  private cssVariables: Map<string, string> = new Map();

  async checkAll(): Promise<ThemeIssue[]> {
    // Load CSS variables
    await this.loadCSSVariables();
    
    // Check CSS files
    const cssFiles = await glob('src/**/*.css');
    for (const file of cssFiles) {
      await this.checkCSSFile(file);
    }

    // Check component files for inline styles
    const componentFiles = await glob('src/**/*.{ts,tsx}');
    for (const file of componentFiles) {
      await this.checkComponentFile(file);
    }

    return this.issues;
  }

  private async loadCSSVariables() {
    try {
      const indexCSS = readFileSync('src/index.css', 'utf-8');
      const tailwindConfig = readFileSync('tailwind.config.ts', 'utf-8');
      
      // Parse CSS variables from index.css
      const cssVarRegex = /--([\w-]+):\s*([^;]+);/g;
      let match;
      while ((match = cssVarRegex.exec(indexCSS)) !== null) {
        this.cssVariables.set(match[1], match[2].trim());
      }
    } catch (error) {
      console.warn(chalk.yellow('⚠️  Could not load CSS variables'));
    }
  }

  private async checkCSSFile(filePath: string) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for hardcoded colors
      const colorRegex = /(color|background-color|border-color):\s*(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/g;
      let match;
      while ((match = colorRegex.exec(line)) !== null) {
        this.issues.push({
          file: filePath,
          line: index + 1,
          type: 'invalid-color',
          message: `Hardcoded color found: ${match[2]}. Use CSS variables instead.`,
          fix: 'hsl(var(--primary))'
        });
      }

      // Check contrast ratios for color combinations
      this.checkContrastInLine(filePath, line, index + 1);
    });
  }

  private async checkComponentFile(filePath: string) {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for inline style objects with colors
      const inlineStyleRegex = /style\s*=\s*\{\{[^}]*color:\s*['"]([^'"]+)['"][^}]*\}\}/g;
      let match;
      while ((match = inlineStyleRegex.exec(line)) !== null) {
        this.issues.push({
          file: filePath,
          line: index + 1,
          type: 'invalid-color',
          message: `Inline color style found: ${match[1]}. Use Tailwind classes instead.`,
          fix: 'className="text-foreground"'
        });
      }

      // Check for Tailwind classes with hardcoded colors
      const tailwindColorRegex = /(text|bg|border)-(white|black|gray-\d+|red-\d+|blue-\d+)/g;
      while ((match = tailwindColorRegex.exec(line)) !== null) {
        if (!this.isInComment(line, match.index)) {
          this.issues.push({
            file: filePath,
            line: index + 1,
            type: 'invalid-color',
            message: `Hardcoded Tailwind color: ${match[0]}. Use semantic tokens instead.`,
            fix: this.getSuggestedSemanticColor(match[0])
          });
        }
      }
    });
  }

  private checkContrastInLine(filePath: string, line: string, lineNumber: number) {
    // Look for potential foreground/background combinations
    const combinations = [
      { fg: 'color', bg: 'background-color' },
      { fg: 'color', bg: 'background' }
    ];

    combinations.forEach(combo => {
      const fgMatch = line.match(new RegExp(`${combo.fg}:\\s*([^;]+)`));
      const bgMatch = line.match(new RegExp(`${combo.bg}:\\s*([^;]+)`));

      if (fgMatch && bgMatch) {
        const fgColor = this.resolveColor(fgMatch[1].trim());
        const bgColor = this.resolveColor(bgMatch[1].trim());

        if (fgColor && bgColor) {
          const ratio = contrast(fgColor, bgColor);
          if (ratio < 4.5) { // WCAG AA standard
            this.issues.push({
              file: filePath,
              line: lineNumber,
              type: 'low-contrast',
              message: `Low contrast ratio: ${ratio.toFixed(2)} (minimum 4.5)`,
              foreground: fgColor,
              background: bgColor,
              ratio,
              fix: 'Increase contrast between foreground and background colors'
            });
          }
        }
      }
    });
  }

  private resolveColor(colorValue: string): string | null {
    // Remove quotes and whitespace
    colorValue = colorValue.replace(/['"]/g, '').trim();

    // Handle CSS variables
    if (colorValue.startsWith('var(--')) {
      const varName = colorValue.match(/var\(--([^)]+)\)/)?.[1];
      if (varName && this.cssVariables.has(varName)) {
        return this.resolveColor(this.cssVariables.get(varName)!);
      }
    }

    // Handle HSL values
    if (colorValue.startsWith('hsl(')) {
      return this.hslToHex(colorValue);
    }

    // Handle hex colors
    if (colorValue.startsWith('#')) {
      return colorValue;
    }

    // Handle rgb/rgba
    if (colorValue.startsWith('rgb')) {
      return this.rgbToHex(colorValue);
    }

    return null;
  }

  private hslToHex(hsl: string): string {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return '#000000';

    const h = parseInt(match[1]) / 360;
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  private rgbToHex(rgb: string): string {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return '#000000';

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  private isInComment(line: string, index: number): boolean {
    const beforeIndex = line.substring(0, index);
    const commentStart = beforeIndex.lastIndexOf('//');
    const commentEnd = beforeIndex.lastIndexOf('\n');
    return commentStart > commentEnd;
  }

  private getSuggestedSemanticColor(tailwindClass: string): string {
    const colorMap: { [key: string]: string } = {
      'text-white': 'text-foreground',
      'text-black': 'text-foreground',
      'bg-white': 'bg-background',
      'bg-black': 'bg-background',
      'text-gray-': 'text-muted-foreground',
      'bg-gray-': 'bg-muted',
      'border-gray-': 'border-border',
      'text-blue-': 'text-primary',
      'bg-blue-': 'bg-primary',
      'text-red-': 'text-destructive',
      'bg-red-': 'bg-destructive'
    };

    for (const [pattern, replacement] of Object.entries(colorMap)) {
      if (tailwindClass.includes(pattern)) {
        return replacement;
      }
    }

    return 'Use semantic color token';
  }

  async autoFix(): Promise<number> {
    // Auto-fix would require more complex AST manipulation
    // For now, return count of fixable issues
    return this.issues.filter(issue => issue.fix).length;
  }
}