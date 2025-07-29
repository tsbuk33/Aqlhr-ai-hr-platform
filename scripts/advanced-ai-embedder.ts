#!/usr/bin/env tsx

import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import { glob } from 'glob';
import * as path from 'path';
import chalk from 'chalk';

interface EmbedResult {
  filePath: string;
  moduleKey: string;
  status: 'injected' | 'already_exists' | 'skipped' | 'error';
  hasAIAssistant: boolean;
  hasDocumentUploader: boolean;
  reason?: string;
  performanceImpact?: string;
}

interface ModuleConfig {
  uploadEnabled: boolean;
  aiEnabled: boolean;
  lazyLoad: boolean;
}

class AdvancedAIEmbedder {
  private project: Project;
  private results: EmbedResult[] = [];
  private excludedPatterns = [
    'src/pages/NotFound.tsx',
    'src/pages/TestHarness.tsx',
    'src/pages/SystemEngineer.tsx',
    'src/pages/**/index.tsx'
  ];

  constructor() {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
  }

  private generateModuleKey(filePath: string): string {
    const relativePath = path.relative('src/pages', filePath);
    const withoutExtension = relativePath.replace(/\.tsx?$/, '');
    const segments = withoutExtension.split('/');
    
    if (segments.length === 1) {
      return segments[0].toLowerCase();
    }
    
    return segments.map((segment, index) => 
      index === 0 ? segment.toLowerCase() : 
      segment.charAt(0).toUpperCase() + segment.slice(1)
    ).join('.');
  }

  private getModuleConfig(moduleKey: string): ModuleConfig {
    // Default configuration - can be extended with feature flags
    const readOnlyModules = ['analytics', 'reports', 'dashboard'];
    const isReadOnly = readOnlyModules.some(pattern => moduleKey.includes(pattern));
    
    return {
      uploadEnabled: !isReadOnly,
      aiEnabled: true,
      lazyLoad: true
    };
  }

  private hasAIAssistantImport(sourceFile: SourceFile): boolean {
    const importDeclarations = sourceFile.getImportDeclarations();
    return importDeclarations.some(importDecl => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      const namedImports = importDecl.getNamedImports();
      return moduleSpecifier.includes('@/components/ai/AqlHRAIAssistant') ||
             namedImports.some(namedImport => 
               namedImport.getName() === 'AqlHRAIAssistant'
             );
    });
  }

  private hasDocumentUploaderImport(sourceFile: SourceFile): boolean {
    const importDeclarations = sourceFile.getImportDeclarations();
    return importDeclarations.some(importDecl => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      const namedImports = importDecl.getNamedImports();
      return moduleSpecifier.includes('ModuleDocumentUploader') ||
             namedImports.some(namedImport => 
               namedImport.getName() === 'ModuleDocumentUploader'
             );
    });
  }

  private hasAIAssistantComponent(sourceFile: SourceFile): boolean {
    const text = sourceFile.getFullText();
    return /AqlHRAIAssistant|EnhancedModuleAIChat/.test(text);
  }

  private hasDocumentUploaderComponent(sourceFile: SourceFile): boolean {
    const text = sourceFile.getFullText();
    return /ModuleDocumentUploader/.test(text);
  }

  private addDynamicImports(sourceFile: SourceFile, config: ModuleConfig): void {
    const imports: string[] = [];
    
    if (config.lazyLoad) {
      // Add React lazy imports
      const reactImport = sourceFile.getImportDeclaration('@react') || 
                         sourceFile.getImportDeclaration('react');
      
      if (reactImport && !reactImport.getNamedImports().some(imp => imp.getName() === 'lazy')) {
        reactImport.addNamedImport('lazy');
      } else if (!reactImport) {
        sourceFile.addImportDeclaration({
          moduleSpecifier: 'react',
          namedImports: ['lazy']
        });
      }
      
      // Add dynamic imports
      if (config.aiEnabled && !this.hasAIAssistantImport(sourceFile)) {
        imports.push(`const AqlHRAIAssistant = lazy(() => import('@/components/ai/AqlHRAIAssistant').then(m => ({ default: m.AqlHRAIAssistant })));`);
      }
      
      if (config.uploadEnabled && !this.hasDocumentUploaderImport(sourceFile)) {
        imports.push(`const ModuleDocumentUploader = lazy(() => import('@/components/universal/ModuleDocumentUploader'));`);
      }
      
      if (imports.length > 0) {
        // Add imports after the last import declaration
        const lastImport = sourceFile.getImportDeclarations().pop();
        if (lastImport) {
          lastImport.insertText(lastImport.getEnd(), '\n\n' + imports.join('\n'));
        }
      }
    } else {
      // Standard imports
      if (config.aiEnabled && !this.hasAIAssistantImport(sourceFile)) {
        sourceFile.addImportDeclaration({
          moduleSpecifier: '@/components/ai/AqlHRAIAssistant',
          namedImports: ['AqlHRAIAssistant']
        });
      }
      
      if (config.uploadEnabled && !this.hasDocumentUploaderImport(sourceFile)) {
        sourceFile.addImportDeclaration({
          moduleSpecifier: '@/components/universal/ModuleDocumentUploader',
          defaultImport: 'ModuleDocumentUploader'
        });
      }
    }
  }

  private injectUniversalComponents(sourceFile: SourceFile, moduleKey: string, config: ModuleConfig): boolean {
    const exportAssignments = sourceFile.getExportAssignments();
    const defaultExport = exportAssignments.find(exp => 
      exp.getExpression().getKind() === SyntaxKind.Identifier
    );

    if (!defaultExport) {
      const functionDeclarations = sourceFile.getFunctions();
      const arrowFunctions = sourceFile.getVariableDeclarations().filter(decl =>
        decl.getInitializer()?.getKind() === SyntaxKind.ArrowFunction
      );

      let targetFunction = functionDeclarations[0] || arrowFunctions[0];
      
      if (!targetFunction && arrowFunctions.length === 0) {
        return false;
      }

      // Find JSX return statement
      const returnStatements = targetFunction.getDescendantsOfKind(SyntaxKind.ReturnStatement);
      const jsxReturn = returnStatements.find(ret => 
        ret.getExpression()?.getKind() === SyntaxKind.JsxElement ||
        ret.getExpression()?.getKind() === SyntaxKind.JsxFragment
      );

      if (!jsxReturn) return false;

      const returnExpression = jsxReturn.getExpression();
      if (!returnExpression) return false;

      // Build components JSX with Suspense wrapper for lazy loading
      const components: string[] = [];
      
      if (config.uploadEnabled) {
        components.push(`        <ModuleDocumentUploader moduleKey="${moduleKey}" />`);
      }
      
      if (config.aiEnabled) {
        components.push(`        <AqlHRAIAssistant moduleContext="${moduleKey}" />`);
      }

      if (components.length === 0) return false;

      const componentsJsx = `\n      \n${components.join('\n')}\n    `;
      
      // Wrap in Suspense if lazy loading
      const suspenseWrapper = config.lazyLoad ? 
        `\n      <Suspense fallback={<div>Loading...</div>}>${componentsJsx}</Suspense>\n` : 
        componentsJsx;

      // Inject components
      if (returnExpression.getKind() === SyntaxKind.JsxElement) {
        const jsxElement = returnExpression.asKindOrThrow(SyntaxKind.JsxElement);
        const closingElement = jsxElement.getClosingElement();
        if (closingElement) {
          closingElement.insertText(0, suspenseWrapper);
        }
      } else if (returnExpression.getKind() === SyntaxKind.JsxFragment) {
        const jsxFragment = returnExpression.asKindOrThrow(SyntaxKind.JsxFragment);
        const closingFragment = jsxFragment.getClosingFragment();
        if (closingFragment) {
          closingFragment.insertText(0, suspenseWrapper);
        }
      }

      // Add Suspense import if lazy loading
      if (config.lazyLoad) {
        const reactImport = sourceFile.getImportDeclaration('react');
        if (reactImport && !reactImport.getNamedImports().some(imp => imp.getName() === 'Suspense')) {
          reactImport.addNamedImport('Suspense');
        }
      }

      return true;
    }

    return false;
  }

  private async processFile(filePath: string): Promise<void> {
    try {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      const moduleKey = this.generateModuleKey(filePath);
      const config = this.getModuleConfig(moduleKey);
      
      const hasAI = this.hasAIAssistantComponent(sourceFile);
      const hasUploader = this.hasDocumentUploaderComponent(sourceFile);
      
      if (hasAI && hasUploader) {
        this.results.push({
          filePath,
          moduleKey,
          status: 'already_exists',
          hasAIAssistant: true,
          hasDocumentUploader: true,
          performanceImpact: 'minimal'
        });
        return;
      }

      // Add imports
      this.addDynamicImports(sourceFile, config);
      
      // Inject components
      const injected = this.injectUniversalComponents(sourceFile, moduleKey, config);
      
      if (injected) {
        await sourceFile.save();
        this.results.push({
          filePath,
          moduleKey,
          status: 'injected',
          hasAIAssistant: true,
          hasDocumentUploader: config.uploadEnabled,
          performanceImpact: config.lazyLoad ? 'optimized' : 'standard'
        });
      } else {
        this.results.push({
          filePath,
          moduleKey,
          status: 'skipped',
          hasAIAssistant: hasAI,
          hasDocumentUploader: hasUploader,
          reason: 'Could not find suitable injection point'
        });
      }
    } catch (error) {
      this.results.push({
        filePath,
        moduleKey: this.generateModuleKey(filePath),
        status: 'error',
        hasAIAssistant: false,
        hasDocumentUploader: false,
        reason: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async run(): Promise<void> {
    console.log(chalk.blue('🚀 Starting Advanced AI Embedder with Performance Optimizations...\n'));

    // Find all page files excluding shell pages
    const pageFiles = await glob('src/pages/**/*.tsx', {
      ignore: this.excludedPatterns
    });

    console.log(chalk.cyan(`📁 Found ${pageFiles.length} functional page files\n`));

    // Process files in batches for better performance
    const batchSize = 10;
    for (let i = 0; i < pageFiles.length; i += batchSize) {
      const batch = pageFiles.slice(i, i + batchSize);
      await Promise.all(batch.map(file => this.processFile(file)));
      
      const progress = Math.round(((i + batch.length) / pageFiles.length) * 100);
      console.log(chalk.gray(`⚡ Progress: ${progress}% (${i + batch.length}/${pageFiles.length})`));
    }

    this.printResults();
  }

  private printResults(): void {
    const injected = this.results.filter(r => r.status === 'injected');
    const alreadyExists = this.results.filter(r => r.status === 'already_exists');
    const skipped = this.results.filter(r => r.status === 'skipped');
    const errors = this.results.filter(r => r.status === 'error');

    const totalFunctional = injected.length + alreadyExists.length + skipped.length + errors.length;
    const fullyEquipped = injected.length + alreadyExists.length;
    const coveragePercent = Math.round((fullyEquipped / totalFunctional) * 100);

    console.log('\n' + chalk.yellow('🎯 ADVANCED AI EMBEDDER AUDIT REPORT'));
    console.log(chalk.yellow('═'.repeat(50)));
    
    console.log(chalk.green(`✅ Successfully Injected: ${injected.length}`));
    console.log(chalk.blue(`🔄 Already Equipped: ${alreadyExists.length}`));
    console.log(chalk.orange(`⚠️  Skipped: ${skipped.length}`));
    console.log(chalk.red(`❌ Errors: ${errors.length}`));
    console.log(chalk.magenta(`📊 Coverage: ${coveragePercent}% (${fullyEquipped}/${totalFunctional})`));

    // Performance metrics
    const optimizedFiles = this.results.filter(r => r.performanceImpact === 'optimized').length;
    console.log(chalk.cyan(`⚡ Performance Optimized: ${optimizedFiles} files with lazy loading`));

    // Detailed breakdown by category
    console.log('\n' + chalk.yellow('📋 DETAILED BREAKDOWN:'));
    console.log(chalk.yellow('─'.repeat(30)));

    if (injected.length > 0) {
      console.log(chalk.green('\n✅ NEWLY INJECTED:'));
      injected.forEach(result => {
        const perf = result.performanceImpact === 'optimized' ? ' ⚡' : '';
        console.log(chalk.gray(`  • ${result.moduleKey}${perf}`));
      });
    }

    if (skipped.length > 0) {
      console.log(chalk.orange('\n⚠️  SKIPPED FILES:'));
      skipped.forEach(result => {
        console.log(chalk.gray(`  • ${result.moduleKey}: ${result.reason}`));
      });
    }

    if (errors.length > 0) {
      console.log(chalk.red('\n❌ ERROR FILES:'));
      errors.forEach(result => {
        console.log(chalk.gray(`  • ${result.moduleKey}: ${result.reason}`));
      });
    }

    // Action items
    console.log('\n' + chalk.yellow('🎬 NEXT STEPS:'));
    console.log(chalk.yellow('─'.repeat(20)));
    
    if (skipped.length > 0 || errors.length > 0) {
      console.log(chalk.orange('1. Review and manually fix skipped/error files'));
    }
    
    console.log(chalk.cyan('2. Run performance audit: npm run lighthouse'));
    console.log(chalk.cyan('3. Test lazy loading in development'));
    console.log(chalk.green('4. Monitor usage analytics in production'));
    
    console.log('\n' + chalk.green('🎉 Advanced AI embedding complete!'));
  }
}

// Run the embedder
const embedder = new AdvancedAIEmbedder();
embedder.run().catch(console.error);