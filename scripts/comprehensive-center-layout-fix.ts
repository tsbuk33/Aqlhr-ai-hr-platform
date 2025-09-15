#!/usr/bin/env tsx

import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

interface LayoutFix {
  file: string;
  type: 'center-layout' | 'rtl-support' | 'responsive-fix' | 'container-fix';
  description: string;
  applied: boolean;
}

class ComprehensiveCenterLayoutFixer {
  private fixes: LayoutFix[] = [];
  private dryRun: boolean;
  public modifiedFiles = 0;

  constructor(dryRun = false) {
    this.dryRun = dryRun;
  }

  async scanAndFix(): Promise<{ modifiedFiles: number; fixes: LayoutFix[] }> {
    console.log(chalk.blue(`🎯 ${this.dryRun ? 'Scanning' : 'Fixing'} comprehensive layout issues...\n`));

    // Process all React components
    const componentFiles = await glob('src/**/*.{tsx,ts}', { 
      ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**'] 
    });

    for (const filePath of componentFiles) {
      await this.processFile(filePath);
    }

    // Update global CSS
    await this.updateGlobalCSS();

    // Update Tailwind config
    await this.updateTailwindConfig();

    return {
      modifiedFiles: this.modifiedFiles,
      fixes: this.fixes
    };
  }

  private async processFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;

    // Fix 1: Ensure proper container centering
    if (this.needsContainerFix(content)) {
      newContent = this.applyContainerFix(newContent);
      hasChanges = true;
      this.fixes.push({
        file: filePath,
        type: 'container-fix',
        description: 'Applied proper container centering with max-width and mx-auto',
        applied: !this.dryRun
      });
    }

    // Fix 2: Ensure RTL support
    if (this.needsRTLSupport(content)) {
      newContent = this.applyRTLSupport(newContent);
      hasChanges = true;
      this.fixes.push({
        file: filePath,
        type: 'rtl-support',
        description: 'Added RTL support with conditional classes and direction',
        applied: !this.dryRun
      });
    }

    // Fix 3: Ensure responsive design
    if (this.needsResponsiveFix(content)) {
      newContent = this.applyResponsiveFix(newContent);
      hasChanges = true;
      this.fixes.push({
        file: filePath,
        type: 'responsive-fix',
        description: 'Applied responsive design classes for mobile/tablet/desktop',
        applied: !this.dryRun
      });
    }

    // Fix 4: Apply CenteredLayout wrapper where needed
    if (this.needsCenteredLayout(content)) {
      newContent = this.applyCenteredLayout(newContent);
      hasChanges = true;
      this.fixes.push({
        file: filePath,
        type: 'center-layout',
        description: 'Wrapped component with CenteredLayout for proper centering',
        applied: !this.dryRun
      });
    }

    if (hasChanges && !this.dryRun) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      this.modifiedFiles++;
    }
  }

  private needsContainerFix(content: string): boolean {
    // Check if component has containers that need centering
    return content.includes('className=') && 
           !content.includes('mx-auto') && 
           (content.includes('max-w-') || content.includes('container'));
  }

  private needsRTLSupport(content: string): boolean {
    // Check if component needs RTL support
    return content.includes('className=') && 
           !content.includes('isRTL') && 
           !content.includes('dir=') &&
           (content.includes('text-left') || content.includes('text-right') || content.includes('flex'));
  }

  private needsResponsiveFix(content: string): boolean {
    // Check if component needs responsive classes
    return content.includes('className=') && 
           !content.includes('sm:') && 
           !content.includes('md:') && 
           !content.includes('lg:') &&
           (content.includes('grid') || content.includes('flex') || content.includes('w-'));
  }

  private needsCenteredLayout(content: string): boolean {
    // Check if page component needs CenteredLayout wrapper
    return content.includes('export default') && 
           content.includes('return (') && 
           !content.includes('CenteredLayout') &&
           (content.includes('min-h-screen') || content.includes('page') || content.includes('Page'));
  }

  private applyContainerFix(content: string): string {
    // Add proper container centering
    return content.replace(
      /className="([^"]*max-w-[^"]*?)"/g,
      'className="$1 mx-auto"'
    ).replace(
      /className="([^"]*container[^"]*?)"/g,
      'className="$1 mx-auto px-4 sm:px-6 lg:px-8"'
    );
  }

  private applyRTLSupport(content: string): string {
    let newContent = content;

    // Add RTL import if not present
    if (!content.includes('useUnifiedLocale')) {
      newContent = newContent.replace(
        /import.*from.*react.*;\n/,
        `$&import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';\n`
      );
    }

    // Add RTL hook usage
    if (!content.includes('const { isRTL }')) {
      newContent = newContent.replace(
        /const.*=.*useState/,
        `const { isRTL } = useUnifiedLocale();\n  $&`
      );
    }

    // Add RTL classes to flex containers
    newContent = newContent.replace(
      /className="([^"]*flex[^"]*?)"/g,
      (match, classes) => {
        if (!classes.includes('isRTL')) {
          return `className={\`${classes} \${isRTL ? 'flex-row-reverse' : ''}\`}`;
        }
        return match;
      }
    );

    // Add RTL classes to text alignment
    newContent = newContent.replace(
      /className="([^"]*text-left[^"]*?)"/g,
      `className={\`$1 \${isRTL ? 'text-right' : 'text-left'}\`}`
    );

    return newContent;
  }

  private applyResponsiveFix(content: string): string {
    // Add responsive classes to grid layouts
    let newContent = content.replace(
      /className="([^"]*grid[^"]*?)"/g,
      (match, classes) => {
        if (!classes.includes('sm:') && !classes.includes('md:') && !classes.includes('lg:')) {
          return `className="${classes} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"`;
        }
        return match;
      }
    );

    // Add responsive padding/margin
    newContent = newContent.replace(
      /className="([^"]*p-\d+[^"]*?)"/g,
      (match, classes) => {
        if (!classes.includes('sm:p-') && !classes.includes('md:p-') && !classes.includes('lg:p-')) {
          return `className="${classes} sm:p-6 lg:p-8"`;
        }
        return match;
      }
    );

    return newContent;
  }

  private applyCenteredLayout(content: string): string {
    // Add CenteredLayout import
    let newContent = content;
    if (!content.includes('CenteredLayout')) {
      newContent = newContent.replace(
        /import.*from.*react.*;\n/,
        `$&import CenteredLayout from '@/components/layout/CenteredLayout';\n`
      );
    }

    // Wrap main return content with CenteredLayout
    newContent = newContent.replace(
      /return \(\s*<div className="([^"]*min-h-screen[^"]*?)">/,
      `return (\n    <CenteredLayout>\n      <div className="$1">`
    );

    // Close CenteredLayout wrapper
    newContent = newContent.replace(
      /(<\/div>\s*);(\s*};?\s*export default)/,
      `$1\n    </CenteredLayout>$2`
    );

    return newContent;
  }

  private async updateGlobalCSS(): Promise<void> {
    const cssPath = 'src/styles/centered-layout.css';
    const cssContent = `
/* Comprehensive Center Layout Styles */
.centered-container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.centered-content {
  @apply flex flex-col items-center justify-center min-h-screen;
}

.rtl-container {
  direction: rtl;
}

.ltr-container {
  direction: ltr;
}

/* RTL-aware flex utilities */
.flex-rtl {
  @apply flex;
}

.flex-rtl[dir="rtl"] {
  @apply flex-row-reverse;
}

/* Responsive grid utilities */
.responsive-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8;
}

/* Responsive padding utilities */
.responsive-padding {
  @apply p-4 sm:p-6 lg:p-8;
}

/* Center alignment utilities */
.center-all {
  @apply flex items-center justify-center;
}

.center-content {
  @apply max-w-4xl mx-auto text-center;
}

/* RTL-aware text alignment */
.text-start {
  text-align: start;
}

.text-end {
  text-align: end;
}
`;

    if (!this.dryRun) {
      const dir = path.dirname(cssPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(cssPath, cssContent, 'utf8');
    }

    this.fixes.push({
      file: cssPath,
      type: 'center-layout',
      description: 'Created comprehensive center layout CSS utilities',
      applied: !this.dryRun
    });
  }

  private async updateTailwindConfig(): Promise<void> {
    const configPath = 'tailwind.config.ts';
    if (!fs.existsSync(configPath)) return;

    const content = fs.readFileSync(configPath, 'utf8');
    
    // Add RTL plugin and center utilities
    const updatedContent = content.replace(
      /plugins:\s*\[([^\]]*)\]/,
      `plugins: [$1,
    function({ addUtilities }) {
      addUtilities({
        '.center-layout': {
          '@apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8': {},
        },
        '.rtl-flex': {
          '@apply flex': {},
          '&[dir="rtl"]': {
            '@apply flex-row-reverse': {},
          },
        },
      });
    }]`
    );

    if (!this.dryRun && updatedContent !== content) {
      fs.writeFileSync(configPath, updatedContent, 'utf8');
    }

    this.fixes.push({
      file: configPath,
      type: 'center-layout',
      description: 'Updated Tailwind config with center layout utilities',
      applied: !this.dryRun
    });
  }

  printResults(): void {
    console.log(chalk.green(`\n✅ Comprehensive Layout Fix Complete:`));
    console.log(chalk.blue(`📁 Files processed: ${this.modifiedFiles}`));
    console.log(chalk.blue(`🔧 Total fixes: ${this.fixes.length}`));
    
    const fixTypes = this.fixes.reduce((acc, fix) => {
      acc[fix.type] = (acc[fix.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(chalk.yellow('\n📊 Fix breakdown:'));
    Object.entries(fixTypes).forEach(([type, count]) => {
      console.log(chalk.cyan(`  ${type}: ${count} fixes`));
    });

    if (this.dryRun) {
      console.log(chalk.yellow('\n⚠️  This was a dry run. Use --apply to execute fixes.'));
    } else {
      console.log(chalk.green('\n🎉 All fixes have been applied successfully!'));
    }
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const apply = args.includes('--apply');

  if (!dryRun && !apply) {
    console.log(chalk.yellow('Usage: npx tsx scripts/comprehensive-center-layout-fix.ts [--dry-run|--apply]'));
    process.exit(1);
  }

  const fixer = new ComprehensiveCenterLayoutFixer(dryRun);
  const results = await fixer.scanAndFix();
  fixer.printResults();

  if (apply) {
    console.log(chalk.green('\n🚀 Ready to test! Run: npm run dev'));
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { ComprehensiveCenterLayoutFixer };

