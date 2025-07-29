#!/usr/bin/env tsx

import { glob } from 'glob';
import chalk from 'chalk';
import * as fs from 'fs/promises';
import * as path from 'path';

interface PerformanceMetrics {
  filePath: string;
  moduleKey: string;
  bundleSize: number;
  hasLazyLoading: boolean;
  componentCount: number;
  importCount: number;
  hasAIAssistant: boolean;
  hasDocumentUploader: boolean;
  optimizationScore: number;
}

class PerformanceAuditor {
  private metrics: PerformanceMetrics[] = [];

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

  private async analyzeFile(filePath: string): Promise<PerformanceMetrics> {
    const content = await fs.readFile(filePath, 'utf-8');
    const moduleKey = this.generateModuleKey(filePath);
    
    // Basic metrics
    const bundleSize = Buffer.byteLength(content, 'utf8');
    const importCount = (content.match(/^import.*from/gm) || []).length;
    const componentCount = (content.match(/<[A-Z][a-zA-Z]*.*?>/g) || []).length;
    
    // Feature detection
    const hasLazyLoading = /lazy\(|React\.lazy/.test(content);
    const hasAIAssistant = /AqlHRAIAssistant/.test(content);
    const hasDocumentUploader = /ModuleDocumentUploader/.test(content);
    const hasSuspense = /Suspense/.test(content);
    const hasDynamicImport = /import\(/.test(content);
    
    // Calculate optimization score (0-100)
    let optimizationScore = 50; // Base score
    
    if (hasLazyLoading) optimizationScore += 25;
    if (hasSuspense) optimizationScore += 15;
    if (hasDynamicImport) optimizationScore += 10;
    if (bundleSize < 10000) optimizationScore += 10; // Small file bonus
    if (importCount < 10) optimizationScore += 5; // Few imports bonus
    
    // Penalties
    if (bundleSize > 50000) optimizationScore -= 20; // Large file penalty
    if (importCount > 20) optimizationScore -= 10; // Too many imports
    if (!hasAIAssistant && !hasDocumentUploader) optimizationScore -= 15; // Missing features
    
    optimizationScore = Math.max(0, Math.min(100, optimizationScore));

    return {
      filePath,
      moduleKey,
      bundleSize,
      hasLazyLoading,
      componentCount,
      importCount,
      hasAIAssistant,
      hasDocumentUploader,
      optimizationScore
    };
  }

  async run(): Promise<void> {
    console.log(chalk.blue('⚡ Starting Performance Audit...\n'));

    const pageFiles = await glob('src/pages/**/*.tsx', {
      ignore: ['src/pages/NotFound.tsx', 'src/pages/TestHarness.tsx', 'src/pages/**/index.tsx']
    });

    console.log(chalk.cyan(`📊 Analyzing ${pageFiles.length} files...\n`));

    // Analyze files in parallel
    this.metrics = await Promise.all(
      pageFiles.map(file => this.analyzeFile(file))
    );

    this.printReport();
  }

  private printReport(): void {
    console.log(chalk.yellow('⚡ PERFORMANCE AUDIT REPORT'));
    console.log(chalk.yellow('═'.repeat(40)));

    // Summary statistics
    const totalFiles = this.metrics.length;
    const fullyEquipped = this.metrics.filter(m => m.hasAIAssistant && m.hasDocumentUploader).length;
    const lazyLoaded = this.metrics.filter(m => m.hasLazyLoading).length;
    const avgBundleSize = Math.round(this.metrics.reduce((sum, m) => sum + m.bundleSize, 0) / totalFiles);
    const avgOptimizationScore = Math.round(this.metrics.reduce((sum, m) => sum + m.optimizationScore, 0) / totalFiles);

    console.log(chalk.green(`📁 Total Files: ${totalFiles}`));
    console.log(chalk.green(`✅ Fully Equipped: ${fullyEquipped} (${Math.round(fullyEquipped/totalFiles*100)}%)`));
    console.log(chalk.cyan(`⚡ Lazy Loaded: ${lazyLoaded} (${Math.round(lazyLoaded/totalFiles*100)}%)`));
    console.log(chalk.blue(`📦 Avg Bundle Size: ${avgBundleSize} bytes`));
    console.log(chalk.magenta(`🎯 Avg Optimization Score: ${avgOptimizationScore}/100`));

    // Top performers
    const topPerformers = this.metrics
      .filter(m => m.optimizationScore >= 80)
      .sort((a, b) => b.optimizationScore - a.optimizationScore)
      .slice(0, 10);

    if (topPerformers.length > 0) {
      console.log(chalk.green('\n🏆 TOP PERFORMERS (80+ score):'));
      topPerformers.forEach(metric => {
        const features = [];
        if (metric.hasLazyLoading) features.push('⚡Lazy');
        if (metric.hasAIAssistant) features.push('🤖AI');
        if (metric.hasDocumentUploader) features.push('📁Upload');
        
        console.log(chalk.gray(`  • ${metric.moduleKey}: ${metric.optimizationScore}/100 ${features.join(' ')}`));
      });
    }

    // Files needing optimization
    const needsOptimization = this.metrics
      .filter(m => m.optimizationScore < 60)
      .sort((a, b) => a.optimizationScore - b.optimizationScore)
      .slice(0, 10);

    if (needsOptimization.length > 0) {
      console.log(chalk.orange('\n⚠️  NEEDS OPTIMIZATION (<60 score):'));
      needsOptimization.forEach(metric => {
        const issues = [];
        if (!metric.hasLazyLoading) issues.push('No lazy loading');
        if (!metric.hasAIAssistant) issues.push('Missing AI');
        if (!metric.hasDocumentUploader) issues.push('Missing uploader');
        if (metric.bundleSize > 50000) issues.push('Large bundle');
        
        console.log(chalk.gray(`  • ${metric.moduleKey}: ${metric.optimizationScore}/100`));
        console.log(chalk.gray(`    Issues: ${issues.join(', ')}`));
      });
    }

    // Bundle size analysis
    const largeBundles = this.metrics
      .filter(m => m.bundleSize > 30000)
      .sort((a, b) => b.bundleSize - a.bundleSize)
      .slice(0, 5);

    if (largeBundles.length > 0) {
      console.log(chalk.orange('\n📦 LARGEST BUNDLES:'));
      largeBundles.forEach(metric => {
        const sizeKB = Math.round(metric.bundleSize / 1024);
        console.log(chalk.gray(`  • ${metric.moduleKey}: ${sizeKB}KB`));
      });
    }

    // Recommendations
    console.log(chalk.yellow('\n💡 OPTIMIZATION RECOMMENDATIONS:'));
    console.log(chalk.yellow('─'.repeat(35)));
    
    const missingLazy = this.metrics.filter(m => !m.hasLazyLoading && (m.hasAIAssistant || m.hasDocumentUploader)).length;
    const missingFeatures = this.metrics.filter(m => !m.hasAIAssistant || !m.hasDocumentUploader).length;
    const largeBundleCount = this.metrics.filter(m => m.bundleSize > 50000).length;

    if (missingLazy > 0) {
      console.log(chalk.cyan(`1. Add lazy loading to ${missingLazy} files with AI components`));
    }
    
    if (missingFeatures > 0) {
      console.log(chalk.orange(`2. Complete feature integration for ${missingFeatures} files`));
    }
    
    if (largeBundleCount > 0) {
      console.log(chalk.red(`3. Optimize ${largeBundleCount} large bundle files`));
    }

    console.log(chalk.green('4. Consider code splitting for heavy components'));
    console.log(chalk.green('5. Implement bundle analysis with webpack-bundle-analyzer'));

    console.log('\n' + chalk.green('⚡ Performance audit complete!'));
  }
}

// Run the auditor
const auditor = new PerformanceAuditor();
auditor.run().catch(console.error);