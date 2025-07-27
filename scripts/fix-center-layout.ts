#!/usr/bin/env tsx

import { Project, Node, SyntaxKind, JsxElement, JsxSelfClosingElement } from 'ts-morph';
import { glob } from 'glob';
import chalk from 'chalk';
import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';

interface LayoutFix {
  filePath: string;
  lineNumber: number;
  before: string;
  after: string;
  changeType: 'wrap-centered' | 'add-classes' | 'remove-conflicts' | 'add-rtl-dir';
}

interface ScanResults {
  totalFiles: number;
  modifiedFiles: number;
  fixes: LayoutFix[];
  errors: string[];
  skipped: string[];
}

class CenterLayoutFixer {
  private project: Project;
  private dryRun: boolean;
  private results: ScanResults;

  // Pattern to detect page-level containers
  private readonly PAGE_CONTAINER_PATTERNS = [
    'div className.*page',
    'main',
    'section className.*container',
    'div className.*layout',
    'div className.*wrapper',
    'PageContainer',
    'PageLayout',
    'div className.*dashboard'
  ];

  // Classes that conflict with centering
  private readonly CONFLICTING_CLASSES = [
    'text-left',
    'text-right', 
    'float-left',
    'float-right',
    'ml-auto',
    'mr-auto',
    'justify-start',
    'justify-end',
    'items-start',
    'items-end'
  ];

  // Centered layout classes to apply
  private readonly CENTERED_CLASSES = 'flex flex-col items-center justify-center text-center mx-auto max-w-screen-xl p-4';

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
      skipped: []
    };
  }

  async scanAndFix(): Promise<ScanResults> {
    console.log(chalk.blue('🔍 Scanning for layout files...'));
    
    const patterns = [
      'src/pages/**/*.{ts,tsx}',
      'src/components/**/Page*.{ts,tsx}',
      'src/layouts/**/*.{ts,tsx}',
      'src/modules/**/*.{ts,tsx}',
      'src/features/**/*.{ts,tsx}'
    ];

    const allFiles = new Set<string>();
    for (const pattern of patterns) {
      const files = await glob(pattern, { ignore: ['**/*.test.*', '**/*.spec.*'] });
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
      await this.createGlobalStyles();
      await this.updateLayoutComponents();
      await this.ensureGlobalCSSImport();
      await this.updateTailwindConfig();
    }

    return this.results;
  }

  private async processFile(filePath: string): Promise<void> {
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    const isArabicFile = this.isArabicFile(filePath);
    let hasChanges = false;

    // Skip if already using CenteredLayout or PageTemplate
    const fileText = sourceFile.getFullText();
    if (fileText.includes('CenteredLayout') || fileText.includes('PageTemplate') || fileText.includes('LayoutShell')) {
      this.results.skipped.push(`${filePath}: Already using centered layout component`);
      return;
    }

    // Find JSX elements that look like page containers
    const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement);
    const jsxSelfClosing = sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);

    for (const element of [...jsxElements, ...jsxSelfClosing]) {
      if (this.isPageContainer(element)) {
        const fix = await this.fixElement(element, isArabicFile);
        if (fix) {
          this.results.fixes.push({
            filePath,
            lineNumber: element.getStartLineNumber(),
            before: fix.before,
            after: fix.after,
            changeType: fix.changeType
          });
          hasChanges = true;
        }
      }
    }

    // Add RTL dir attribute for Arabic files
    if (isArabicFile && !fileText.includes('dir="rtl"')) {
      const htmlElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement)
        .filter(el => el.getOpeningElement().getTagNameNode().getText() === 'div');
      
      if (htmlElements.length > 0) {
        const rootDiv = htmlElements[0];
        await this.addRTLDirection(rootDiv);
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

  private isPageContainer(element: JsxElement | JsxSelfClosingElement): boolean {
    const tagName = this.getTagName(element);
    const className = this.getClassName(element);
    
    // Check if it's a main page element
    if (['main', 'section'].includes(tagName)) return true;
    
    // Check if className suggests it's a page container
    if (className) {
      return this.PAGE_CONTAINER_PATTERNS.some(pattern => 
        new RegExp(pattern, 'i').test(`${tagName} className="${className}"`)
      );
    }

    return false;
  }

  private async fixElement(element: JsxElement | JsxSelfClosingElement, isArabicFile: boolean) {
    const before = element.getText();
    const sourceFile = element.getSourceFile();
    
    // Strategy: Wrap the entire element with CenteredLayout instead of just adding classes
    if (!this.dryRun) {
      this.wrapWithCenteredLayout(element, isArabicFile, sourceFile);
    }
    
    return {
      before: before.slice(0, 100) + (before.length > 100 ? '...' : ''),
      after: `<CenteredLayout>${element.getTagName()}>...</CenteredLayout>`,
      changeType: 'wrap-centered' as const
    };
  }

  private wrapWithCenteredLayout(element: JsxElement | JsxSelfClosingElement, isArabicFile: boolean, sourceFile: any): void {
    // Remove conflicting classes from the element first
    this.removeConflictingClasses(element);
    
    // Get the element's content
    const elementText = element.getText();
    
    // Create the wrapper
    const wrapperProps = isArabicFile ? ' className="rtl"' : '';
    const wrappedElement = `<CenteredLayout${wrapperProps}>\n  ${elementText}\n</CenteredLayout>`;
    
    // Replace the element
    element.replaceWithText(wrappedElement);
  }

  private removeConflictingClasses(element: JsxElement | JsxSelfClosingElement): void {
    const className = this.getClassName(element);
    if (!className) return;

    // Remove conflicting classes
    let newClassName = className;
    this.CONFLICTING_CLASSES.forEach(conflictClass => {
      newClassName = newClassName.replace(new RegExp(`\\b${conflictClass}\\b`, 'g'), '').trim();
    });

    // Clean up extra spaces
    newClassName = newClassName.replace(/\s+/g, ' ').trim();
    
    if (newClassName !== className) {
      if (newClassName) {
        this.setClassName(element, newClassName);
      } else {
        // Remove className attribute if empty
        const openingElement = Node.isJsxElement(element) 
          ? element.getOpeningElement()
          : element;
        const classNameAttr = openingElement.getAttribute('className');
        if (classNameAttr) {
          classNameAttr.remove();
        }
      }
    }
  }

  private getTagName(element: JsxElement | JsxSelfClosingElement): string {
    if (Node.isJsxElement(element)) {
      return element.getOpeningElement().getTagNameNode().getText();
    }
    return element.getTagNameNode().getText();
  }

  private getClassName(element: JsxElement | JsxSelfClosingElement): string | undefined {
    const attributes = Node.isJsxElement(element) 
      ? element.getOpeningElement().getAttributes()
      : element.getAttributes();

    for (const attr of attributes) {
      if (Node.isJsxAttribute(attr) && attr.getName() === 'className') {
        const initializer = attr.getInitializer();
        if (Node.isStringLiteral(initializer)) {
          return initializer.getLiteralValue();
        }
      }
    }
    return undefined;
  }

  private setClassName(element: JsxElement | JsxSelfClosingElement, newClassName: string): void {
    const openingElement = Node.isJsxElement(element) 
      ? element.getOpeningElement()
      : element;

    const classNameAttr = openingElement.getAttribute('className');
    
    if (classNameAttr && Node.isJsxAttribute(classNameAttr)) {
      classNameAttr.setInitializer(`"${newClassName}"`);
    } else {
      openingElement.addAttribute({
        name: 'className',
        initializer: `"${newClassName}"`
      });
    }
  }

  private async addRTLDirection(element: JsxElement): Promise<void> {
    const openingElement = element.getOpeningElement();
    const dirAttr = openingElement.getAttribute('dir');
    
    if (!dirAttr) {
      openingElement.addAttribute({
        name: 'dir',
        initializer: '"rtl"'
      });
    }
  }

  private addRequiredImports(sourceFile: any): void {
    const imports = sourceFile.getImportDeclarations();
    
    // Check if CenteredLayout is already imported
    const hasCenteredLayoutImport = imports.some((imp: any) => {
      const namedImports = imp.getNamedImports();
      const defaultImport = imp.getDefaultImport();
      return (
        (defaultImport && defaultImport.getText() === 'CenteredLayout') ||
        namedImports.some((named: any) => named.getName() === 'CenteredLayout')
      );
    });

    // Add CenteredLayout import if not present
    if (!hasCenteredLayoutImport) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: '@/components/layout/CenteredLayout',
        defaultImport: 'CenteredLayout'
      });
      console.log(chalk.green(`✅ Added CenteredLayout import to ${sourceFile.getBaseName()}`));
    }

    // Ensure React import exists (for JSX)
    const hasReactImport = imports.some((imp: any) => 
      imp.getModuleSpecifierValue() === 'react'
    );

    if (!hasReactImport) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: 'react',
        defaultImport: 'React'
      });
    }
  }

  private isArabicFile(filePath: string): boolean {
    return /\/(ar|AR)\//.test(filePath) || filePath.includes('.ar.') || filePath.includes('arabic');
  }

  private async createGlobalStyles(): Promise<void> {
    const globalStylesPath = 'src/styles/centered-layout.css';
    const globalStyles = `
/* Centered Layout Global Styles */
.centered-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
  max-width: 1200px;
  padding: 2rem;
  min-height: 100vh;
}

.centered-layout-rtl {
  direction: rtl;
  text-align: center; /* Override RTL default */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .centered-layout {
    padding: 1rem;
    max-width: 100%;
  }
}

/* Ensure consistent spacing */
.centered-layout > * + * {
  margin-top: 1.5rem;
}

/* Override any conflicting text alignment */
.centered-layout .text-left,
.centered-layout .text-right {
  text-align: center !important;
}
`;

    if (!fs.existsSync(path.dirname(globalStylesPath))) {
      fs.mkdirSync(path.dirname(globalStylesPath), { recursive: true });
    }
    
    fs.writeFileSync(globalStylesPath, globalStyles);
    console.log(chalk.green(`✅ Created global styles: ${globalStylesPath}`));
  }

  private async updateLayoutComponents(): Promise<void> {
    // Update the existing CenteredPageTemplate to be more robust
    const centeredTemplateContent = `import { useLanguage } from "@/hooks/useLanguageCompat";
import PageHeader from "@/components/common/PageHeader";
import { ReactNode } from "react";

interface CenteredLayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

// Universal Centered Layout - ALWAYS CENTER EVERYTHING
const CenteredLayout = ({ title, description, children, className = "" }: CenteredLayoutProps) => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div 
      className={\`flex flex-col items-center justify-center text-center mx-auto max-w-screen-xl p-4 min-h-screen \${isArabic ? 'rtl' : 'ltr'} \${className}\`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {title && (
        <PageHeader title={title} description={description} />
      )}
      <div className="w-full flex flex-col items-center justify-center text-center space-y-6">
        {children}
      </div>
    </div>
  );
};

export default CenteredLayout;

// Export a HOC for easy wrapping
export const withCenteredLayout = <P extends object>(
  Component: React.ComponentType<P>,
  layoutProps?: Omit<CenteredLayoutProps, 'children'>
) => {
  return (props: P) => (
    <CenteredLayout {...layoutProps}>
      <Component {...props} />
    </CenteredLayout>
  );
};
`;

    fs.writeFileSync('src/components/layout/CenteredLayout.tsx', centeredTemplateContent);
    console.log(chalk.green('✅ Updated CenteredLayout component'));
  }

  private async ensureGlobalCSSImport(): Promise<void> {
    const mainCSSPath = 'src/index.css';
    const centeredLayoutCSSPath = '@/styles/centered-layout.css';
    
    if (fs.existsSync(mainCSSPath)) {
      const cssContent = fs.readFileSync(mainCSSPath, 'utf8');
      
      if (!cssContent.includes('centered-layout.css')) {
        const importStatement = `@import '${centeredLayoutCSSPath}';\n`;
        const updatedCSS = importStatement + cssContent;
        fs.writeFileSync(mainCSSPath, updatedCSS);
        console.log(chalk.green(`✅ Added centered-layout.css import to ${mainCSSPath}`));
      }
    }
  }

  private async updateTailwindConfig(): Promise<void> {
    const tailwindConfigPath = 'tailwind.config.ts';
    
    if (fs.existsSync(tailwindConfigPath)) {
      const configContent = fs.readFileSync(tailwindConfigPath, 'utf8');
      
      // Check if max-w-screen-xl is already in the config
      if (!configContent.includes('max-w-screen-xl') && !configContent.includes('maxWidth')) {
        console.log(chalk.yellow('⚠️  Consider adding max-w-screen-xl to your Tailwind config maxWidth section'));
        console.log(chalk.blue('💡 Example: maxWidth: { "screen-xl": "1280px" }'));
      }
      
      // Ensure container centering is enabled
      if (!configContent.includes('center: true')) {
        console.log(chalk.yellow('⚠️  Consider enabling container centering in Tailwind config'));
        console.log(chalk.blue('💡 Example: container: { center: true, padding: "2rem" }'));
      }
    }
  }

  public printResults(): void {
    console.log('\n' + chalk.blue('📊 CENTER LAYOUT ENFORCEMENT RESULTS'));
    console.log('='.repeat(50));
    
    console.log(chalk.yellow(`📁 Files scanned: ${this.results.totalFiles}`));
    console.log(chalk.green(`✅ Files modified: ${this.results.modifiedFiles}`));
    console.log(chalk.blue(`⏭️  Files skipped: ${this.results.skipped.length}`));
    console.log(chalk.red(`❌ Errors: ${this.results.errors.length}`));
    
    if (this.results.fixes.length > 0) {
      console.log('\n' + chalk.cyan('🔧 APPLIED FIXES:'));
      this.results.fixes.forEach((fix, index) => {
        console.log(`\n${index + 1}. ${chalk.magenta(fix.filePath)}:${fix.lineNumber}`);
        console.log(`   Type: ${chalk.yellow(fix.changeType)}`);
        console.log(`   Before: ${chalk.red(fix.before)}`);
        console.log(`   After:  ${chalk.green(fix.after)}`);
      });
    }

    if (this.results.skipped.length > 0) {
      console.log('\n' + chalk.blue('⏭️  SKIPPED FILES:'));
      this.results.skipped.forEach(skip => console.log(`   ${skip}`));
    }

    if (this.results.errors.length > 0) {
      console.log('\n' + chalk.red('❌ ERRORS:'));
      this.results.errors.forEach(error => console.log(`   ${error}`));
    }

    console.log('\n' + chalk.green('🎯 CENTER LAYOUT ENFORCEMENT COMPLETE!'));
  }
}

// CLI Interface
const program = new Command();

program
  .name('fix-center-layout')
  .description('Enforce centered layout consistency across all AqlHR pages')
  .option('--dry-run', 'Show what would be changed without modifying files', false)
  .option('--apply', 'Apply changes to files', false)
  .action(async (options) => {
    const isDryRun = options.dryRun || !options.apply;
    
    console.log(chalk.blue('🎯 AqlHR CENTER LAYOUT ENFORCEMENT TOOL'));
    console.log(chalk.yellow(`Mode: ${isDryRun ? 'DRY RUN' : 'APPLY CHANGES'}`));
    console.log('='.repeat(50));
    
    const fixer = new CenterLayoutFixer(isDryRun);
    
    try {
      const results = await fixer.scanAndFix();
      fixer.printResults();
      
      if (isDryRun && results.modifiedFiles > 0) {
        console.log('\n' + chalk.yellow('💡 Run with --apply to make actual changes'));
      }
      
      // Exit with error code if there were any errors
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

export { CenterLayoutFixer };