#!/usr/bin/env tsx

import { Project, SourceFile, Node } from 'ts-morph';
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

interface ModuleFeatures {
  name: string;
  path: string;
  type: 'page' | 'component' | 'tool' | 'function';
  category: string;
  hasHoverTooltip: boolean;
  hasHowToUsePanel: boolean;
  hasDocumentUpload: boolean;
  hasAIDiagnostic: boolean;
  hasAIChat: boolean;
  hasProperLocalization: boolean;
  hasCenteredLayout: boolean;
  hasDirectionHandling: boolean;
  missingFeatures: string[];
  localizationKeys: string[];
  componentImports: string[];
}

interface AuditManifest {
  version: string;
  auditDate: string;
  totalModules: number;
  modulesByCategory: Record<string, number>;
  featuresCompleteness: {
    hoverTooltips: number;
    howToUsePanels: number;
    documentUpload: number;
    aiDiagnostics: number;
    aiChat: number;
    localization: number;
    centeredLayout: number;
  };
  modules: ModuleFeatures[];
  missingFeaturesSummary: Record<string, string[]>;
  nextActions: string[];
}

class ModuleAuditor {
  private project: Project;
  private manifest: AuditManifest;

  constructor() {
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    
    this.manifest = {
      version: '1.0.0',
      auditDate: new Date().toISOString(),
      totalModules: 0,
      modulesByCategory: {},
      featuresCompleteness: {
        hoverTooltips: 0,
        howToUsePanels: 0,
        documentUpload: 0,
        aiDiagnostics: 0,
        aiChat: 0,
        localization: 0,
        centeredLayout: 0,
      },
      modules: [],
      missingFeaturesSummary: {},
      nextActions: [],
    };
  }

  async auditAll(): Promise<AuditManifest> {
    console.log(chalk.blue('🔍 Starting comprehensive module audit...\n'));

    // Scan all page modules
    await this.scanPages();
    
    // Scan component modules
    await this.scanComponents();
    
    // Scan edge functions
    await this.scanEdgeFunctions();
    
    // Calculate statistics
    this.calculateStatistics();
    
    // Generate recommendations
    this.generateRecommendations();
    
    console.log(chalk.green(`✅ Audit complete! Found ${this.manifest.totalModules} modules\n`));
    
    return this.manifest;
  }

  private async scanPages() {
    console.log(chalk.yellow('📄 Scanning pages...'));
    
    const pageFiles = await glob('src/pages/**/*.{tsx,ts}', { ignore: ['**/*.test.*', '**/*.spec.*'] });
    
    for (const filePath of pageFiles) {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      const module = await this.auditFile(sourceFile, 'page');
      if (module) {
        this.manifest.modules.push(module);
      }
    }
  }

  private async scanComponents() {
    console.log(chalk.yellow('🧩 Scanning components...'));
    
    const componentFiles = await glob('src/components/**/*.{tsx,ts}', { ignore: ['**/ui/**', '**/*.test.*', '**/*.spec.*'] });
    
    for (const filePath of componentFiles) {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      const module = await this.auditFile(sourceFile, 'component');
      if (module) {
        this.manifest.modules.push(module);
      }
    }
  }

  private async scanEdgeFunctions() {
    console.log(chalk.yellow('⚡ Scanning edge functions...'));
    
    const functionFiles = await glob('supabase/functions/**/*.ts', { ignore: ['**/*.test.*'] });
    
    for (const filePath of functionFiles) {
      if (fs.existsSync(filePath)) {
        const sourceFile = this.project.addSourceFileAtPath(filePath);
        const module = await this.auditFile(sourceFile, 'function');
        if (module) {
          this.manifest.modules.push(module);
        }
      }
    }
  }

  private async auditFile(sourceFile: SourceFile, type: 'page' | 'component' | 'tool' | 'function'): Promise<ModuleFeatures | null> {
    const filePath = sourceFile.getFilePath();
    const fileName = path.basename(filePath, path.extname(filePath));
    
    // Skip index files and generic components
    if (fileName === 'index' && type === 'component') return null;
    if (filePath.includes('/ui/')) return null;
    
    const content = sourceFile.getFullText();
    const category = this.determineCategory(filePath);
    
    const module: ModuleFeatures = {
      name: this.extractModuleName(filePath, fileName),
      path: filePath,
      type,
      category,
      hasHoverTooltip: this.checkHoverTooltip(content),
      hasHowToUsePanel: this.checkHowToUsePanel(content),
      hasDocumentUpload: this.checkDocumentUpload(content),
      hasAIDiagnostic: this.checkAIDiagnostic(content),
      hasAIChat: this.checkAIChat(content),
      hasProperLocalization: this.checkProperLocalization(content),
      hasCenteredLayout: this.checkCenteredLayout(content),
      hasDirectionHandling: this.checkDirectionHandling(content),
      missingFeatures: [],
      localizationKeys: this.extractLocalizationKeys(content),
      componentImports: this.extractComponentImports(sourceFile),
    };

    // Determine missing features
    module.missingFeatures = this.determineMissingFeatures(module);
    
    return module;
  }

  private determineCategory(filePath: string): string {
    if (filePath.includes('/pages/')) {
      const pathParts = filePath.split('/pages/')[1].split('/');
      return pathParts[0] || 'general';
    }
    if (filePath.includes('/components/')) {
      const pathParts = filePath.split('/components/')[1].split('/');
      return pathParts[0] || 'common';
    }
    if (filePath.includes('/functions/')) {
      return 'edge-functions';
    }
    return 'misc';
  }

  private extractModuleName(filePath: string, fileName: string): string {
    if (filePath.includes('/pages/')) {
      const pathParts = filePath.split('/pages/')[1];
      const cleanPath = pathParts.replace(/\/(index\.)?(tsx|ts)$/, '');
      return cleanPath.split('/').map(part => 
        part.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      ).join(' - ');
    }
    
    return fileName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private checkHoverTooltip(content: string): boolean {
    return content.includes('Tooltip') || 
           content.includes('tooltip') ||
           content.includes('title=') ||
           content.includes('aria-label=');
  }

  private checkHowToUsePanel(content: string): boolean {
    return content.includes('HowToUse') ||
           content.includes('howToUse') ||
           content.includes('instructions') ||
           content.includes('guide');
  }

  private checkDocumentUpload(content: string): boolean {
    return content.includes('FileUpload') ||
           content.includes('useFileUpload') ||
           content.includes('document') ||
           content.includes('upload');
  }

  private checkAIDiagnostic(content: string): boolean {
    return content.includes('diagnostic') ||
           content.includes('Diagnostic') ||
           content.includes('ai-') ||
           content.includes('useAI');
  }

  private checkAIChat(content: string): boolean {
    return content.includes('AIChat') ||
           content.includes('chat') ||
           content.includes('assistant') ||
           content.includes('conversation');
  }

  private checkProperLocalization(content: string): boolean {
    return (content.includes('useTranslation') || 
            content.includes('useAPITranslations') ||
            content.includes('t(')) &&
           !content.includes('"en"') && 
           !content.includes('"ar"');
  }

  private checkCenteredLayout(content: string): boolean {
    return content.includes('CenteredLayout') ||
           content.includes('flex flex-col items-center justify-center text-center');
  }

  private checkDirectionHandling(content: string): boolean {
    return content.includes('dir=') ||
           content.includes('isArabic') ||
           content.includes('rtl') ||
           content.includes('ltr');
  }

  private extractLocalizationKeys(content: string): string[] {
    const keys: string[] = [];
    const tRegex = /t\(['"`]([^'"`]+)['"`]\)/g;
    let match;
    
    while ((match = tRegex.exec(content)) !== null) {
      keys.push(match[1]);
    }
    
    return [...new Set(keys)];
  }

  private extractComponentImports(sourceFile: SourceFile): string[] {
    const imports: string[] = [];
    
    sourceFile.getImportDeclarations().forEach(importDecl => {
      const namedImports = importDecl.getNamedImports();
      namedImports.forEach(namedImport => {
        imports.push(namedImport.getName());
      });
      
      const defaultImport = importDecl.getDefaultImport();
      if (defaultImport) {
        imports.push(defaultImport.getText());
      }
    });
    
    return imports;
  }

  private determineMissingFeatures(module: ModuleFeatures): string[] {
    const missing: string[] = [];
    
    if (!module.hasHoverTooltip && module.type === 'page') {
      missing.push('hover-tooltip');
    }
    if (!module.hasHowToUsePanel && module.type === 'page') {
      missing.push('how-to-use-panel');
    }
    if (!module.hasDocumentUpload && module.type === 'page') {
      missing.push('document-upload');
    }
    if (!module.hasAIDiagnostic && module.type === 'page') {
      missing.push('ai-diagnostic');
    }
    if (!module.hasAIChat && module.type === 'page') {
      missing.push('ai-chat');
    }
    if (!module.hasProperLocalization) {
      missing.push('proper-localization');
    }
    if (!module.hasCenteredLayout && module.type === 'page') {
      missing.push('centered-layout');
    }
    if (!module.hasDirectionHandling) {
      missing.push('direction-handling');
    }
    
    return missing;
  }

  private calculateStatistics() {
    this.manifest.totalModules = this.manifest.modules.length;
    
    // Count by category
    this.manifest.modules.forEach(module => {
      this.manifest.modulesByCategory[module.category] = 
        (this.manifest.modulesByCategory[module.category] || 0) + 1;
    });
    
    // Calculate feature completeness
    const pages = this.manifest.modules.filter(m => m.type === 'page');
    const total = pages.length;
    
    if (total > 0) {
      this.manifest.featuresCompleteness = {
        hoverTooltips: Math.round((pages.filter(m => m.hasHoverTooltip).length / total) * 100),
        howToUsePanels: Math.round((pages.filter(m => m.hasHowToUsePanel).length / total) * 100),
        documentUpload: Math.round((pages.filter(m => m.hasDocumentUpload).length / total) * 100),
        aiDiagnostics: Math.round((pages.filter(m => m.hasAIDiagnostic).length / total) * 100),
        aiChat: Math.round((pages.filter(m => m.hasAIChat).length / total) * 100),
        localization: Math.round((this.manifest.modules.filter(m => m.hasProperLocalization).length / this.manifest.totalModules) * 100),
        centeredLayout: Math.round((pages.filter(m => m.hasCenteredLayout).length / total) * 100),
      };
    }
    
    // Group missing features
    this.manifest.modules.forEach(module => {
      module.missingFeatures.forEach(feature => {
        if (!this.manifest.missingFeaturesSummary[feature]) {
          this.manifest.missingFeaturesSummary[feature] = [];
        }
        this.manifest.missingFeaturesSummary[feature].push(module.name);
      });
    });
  }

  private generateRecommendations() {
    const actions: string[] = [];
    
    Object.entries(this.manifest.missingFeaturesSummary).forEach(([feature, modules]) => {
      if (modules.length > 0) {
        actions.push(`Scaffold ${feature} for ${modules.length} modules: ${modules.slice(0, 3).join(', ')}${modules.length > 3 ? '...' : ''}`);
      }
    });
    
    actions.push('Create universal components for consistent feature implementation');
    actions.push('Update i18n files with missing translation keys');
    actions.push('Generate edge functions for AI diagnostics');
    actions.push('Implement automated testing for all features');
    
    this.manifest.nextActions = actions;
  }

  async saveManifest(outputPath: string = 'audit-manifest.json') {
    fs.writeFileSync(outputPath, JSON.stringify(this.manifest, null, 2));
    console.log(chalk.green(`📄 Manifest saved to ${outputPath}`));
  }

  printSummary() {
    console.log(chalk.bold('\n📊 AUDIT SUMMARY\n'));
    console.log(`Total Modules: ${chalk.cyan(this.manifest.totalModules)}`);
    console.log(`Categories: ${chalk.cyan(Object.keys(this.manifest.modulesByCategory).length)}`);
    
    console.log(chalk.bold('\n🎯 Feature Completeness:'));
    Object.entries(this.manifest.featuresCompleteness).forEach(([feature, percentage]) => {
      const color = percentage >= 80 ? chalk.green : percentage >= 50 ? chalk.yellow : chalk.red;
      console.log(`  ${feature}: ${color(percentage + '%')}`);
    });
    
    console.log(chalk.bold('\n🚨 Missing Features Summary:'));
    Object.entries(this.manifest.missingFeaturesSummary).forEach(([feature, modules]) => {
      console.log(`  ${chalk.red(feature)}: ${modules.length} modules`);
    });
    
    console.log(chalk.bold('\n📋 Next Actions:'));
    this.manifest.nextActions.forEach((action, i) => {
      console.log(`  ${i + 1}. ${action}`);
    });
  }
}

// CLI execution
async function main() {
  const auditor = new ModuleAuditor();
  
  try {
    const manifest = await auditor.auditAll();
    await auditor.saveManifest();
    auditor.printSummary();
    
    // Exit with error code if there are missing features
    const hasMissingFeatures = Object.keys(manifest.missingFeaturesSummary).length > 0;
    process.exit(hasMissingFeatures ? 1 : 0);
    
  } catch (error) {
    console.error(chalk.red('❌ Audit failed:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { ModuleAuditor, type AuditManifest, type ModuleFeatures };