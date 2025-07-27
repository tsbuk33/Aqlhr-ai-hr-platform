#!/usr/bin/env tsx

/**
 * AqlHR AI Inventory Audit Tool
 * Automatically scans and verifies AI capabilities against golden manifest
 */

import { promises as fs } from 'fs';
import { glob } from 'glob';
import * as path from 'path';
import chalk from 'chalk';

interface AIInventoryManifest {
  lastUpdated: string;
  expectedCounts: {
    edgeFunctions: number;
    aiComponents: number;
    aiHooks: number;
    aiPages: number;
    totalAIFiles: number;
  };
  criticalFunctions: string[];
  aiEcosystemComponents: string[];
  nextPhaseFeatures: {
    voiceAI: boolean;
    advancedOCR: boolean;
    streamingInference: boolean;
    customMLModels: boolean;
  };
}

interface AuditResults {
  edgeFunctions: string[];
  aiComponents: string[];
  aiHooks: string[];
  aiPages: string[];
  missingCritical: string[];
  driftReport: string[];
  passed: boolean;
}

class AIInventoryAuditor {
  private manifest: AIInventoryManifest | null = null;
  private manifestPath = 'ai-inventory.json';

  async loadManifest(): Promise<void> {
    try {
      const manifestContent = await fs.readFile(this.manifestPath, 'utf-8');
      this.manifest = JSON.parse(manifestContent);
      console.log(chalk.blue('✓ Loaded AI inventory manifest'));
    } catch (error) {
      console.log(chalk.yellow('⚠ No manifest found, creating default...'));
      await this.createDefaultManifest();
    }
  }

  async createDefaultManifest(): Promise<void> {
    const defaultManifest: AIInventoryManifest = {
      lastUpdated: new Date().toISOString(),
      expectedCounts: {
        edgeFunctions: 25,
        aiComponents: 50,
        aiHooks: 10,
        aiPages: 20,
        totalAIFiles: 105
      },
      criticalFunctions: [
        'ai-core-engine',
        'ai-document-processor',
        'ai-workforce-analytics',
        'ai-recommendation-engine',
        'enhanced-ai-sync-engine'
      ],
      aiEcosystemComponents: [
        'AICommandCenter',
        'AIDecisionEngine',
        'AqlMindCore',
        'LearningEngine',
        'IntelligenceGatherer'
      ],
      nextPhaseFeatures: {
        voiceAI: false,
        advancedOCR: false,
        streamingInference: false,
        customMLModels: false
      }
    };

    await fs.writeFile(this.manifestPath, JSON.stringify(defaultManifest, null, 2));
    this.manifest = defaultManifest;
    console.log(chalk.green('✓ Created default AI inventory manifest'));
  }

  async scanEdgeFunctions(): Promise<string[]> {
    const functionDirs = await glob('supabase/functions/*/index.ts');
    const functions = functionDirs.map(dir => {
      const parts = dir.split('/');
      return parts[parts.length - 2]; // Get function name from path
    });
    
    console.log(chalk.blue(`Found ${functions.length} Supabase Edge Functions:`));
    functions.forEach(fn => console.log(chalk.gray(`  - ${fn}`)));
    
    return functions;
  }

  async scanAIComponents(): Promise<string[]> {
    const componentFiles = await glob('src/components/**/*AI*.tsx');
    const ecosystemFiles = await glob('src/components/ai*/**/*.tsx');
    
    const allFiles = [...componentFiles, ...ecosystemFiles];
    const uniqueFiles = [...new Set(allFiles)];
    
    console.log(chalk.blue(`Found ${uniqueFiles.length} AI Components:`));
    uniqueFiles.forEach(file => console.log(chalk.gray(`  - ${path.basename(file)}`)));
    
    return uniqueFiles.map(f => path.basename(f, '.tsx'));
  }

  async scanAIHooks(): Promise<string[]> {
    const hookFiles = await glob('src/hooks/useAI*.ts');
    const hooks = hookFiles.map(f => path.basename(f, '.ts'));
    
    console.log(chalk.blue(`Found ${hooks.length} AI Hooks:`));
    hooks.forEach(hook => console.log(chalk.gray(`  - ${hook}`)));
    
    return hooks;
  }

  async scanAIPages(): Promise<string[]> {
    const aiPages = await glob('src/pages/ai*/**/*.tsx');
    const pages = aiPages.map(f => path.basename(f, '.tsx'));
    
    console.log(chalk.blue(`Found ${pages.length} AI Pages:`));
    pages.forEach(page => console.log(chalk.gray(`  - ${page}`)));
    
    return pages;
  }

  async checkCriticalFunctions(edgeFunctions: string[]): Promise<string[]> {
    if (!this.manifest) return [];
    
    const missing = this.manifest.criticalFunctions.filter(
      critical => !edgeFunctions.includes(critical)
    );
    
    if (missing.length > 0) {
      console.log(chalk.red(`❌ Missing ${missing.length} critical functions:`));
      missing.forEach(fn => console.log(chalk.red(`  - ${fn}`)));
    } else {
      console.log(chalk.green('✓ All critical AI functions present'));
    }
    
    return missing;
  }

  generateDriftReport(results: AuditResults): string[] {
    if (!this.manifest) return ['No manifest to compare against'];
    
    const expected = this.manifest.expectedCounts;
    const actual = {
      edgeFunctions: results.edgeFunctions.length,
      aiComponents: results.aiComponents.length,
      aiHooks: results.aiHooks.length,
      aiPages: results.aiPages.length,
      totalAIFiles: results.edgeFunctions.length + results.aiComponents.length + 
                   results.aiHooks.length + results.aiPages.length
    };

    const drifts: string[] = [];
    
    Object.entries(expected).forEach(([key, expectedCount]) => {
      const actualCount = actual[key as keyof typeof actual];
      const diff = actualCount - expectedCount;
      
      if (diff !== 0) {
        const direction = diff > 0 ? 'increased' : 'decreased';
        const color = diff > 0 ? chalk.yellow : chalk.red;
        drifts.push(color(`${key}: ${direction} by ${Math.abs(diff)} (expected: ${expectedCount}, actual: ${actualCount})`));
      }
    });

    return drifts;
  }

  async updateManifest(results: AuditResults): Promise<void> {
    if (!this.manifest) return;
    
    this.manifest.lastUpdated = new Date().toISOString();
    this.manifest.expectedCounts = {
      edgeFunctions: results.edgeFunctions.length,
      aiComponents: results.aiComponents.length,
      aiHooks: results.aiHooks.length,
      aiPages: results.aiPages.length,
      totalAIFiles: results.edgeFunctions.length + results.aiComponents.length + 
                   results.aiHooks.length + results.aiPages.length
    };

    await fs.writeFile(this.manifestPath, JSON.stringify(this.manifest, null, 2));
    console.log(chalk.green('✓ Updated AI inventory manifest'));
  }

  async generateReport(results: AuditResults): Promise<void> {
    const report = `# AqlHR AI Inventory Audit Report
Generated: ${new Date().toISOString()}

## Audit Status: ${results.passed ? '✅ PASSED' : '❌ FAILED'}

## Current AI Inventory
- **Edge Functions**: ${results.edgeFunctions.length}
- **AI Components**: ${results.aiComponents.length}  
- **AI Hooks**: ${results.aiHooks.length}
- **AI Pages**: ${results.aiPages.length}
- **Total AI Files**: ${results.edgeFunctions.length + results.aiComponents.length + results.aiHooks.length + results.aiPages.length}

## Critical Functions Status
${results.missingCritical.length === 0 ? '✅ All critical functions present' : '❌ Missing critical functions:'}
${results.missingCritical.map(fn => `- ${fn}`).join('\n')}

## Drift Analysis
${results.driftReport.length === 0 ? '✅ No drift detected' : results.driftReport.map(drift => `- ${drift}`).join('\n')}

## Edge Functions Inventory
${results.edgeFunctions.map(fn => `- ${fn}`).join('\n')}

## AI Components Inventory  
${results.aiComponents.map(comp => `- ${comp}`).join('\n')}

## AI Hooks Inventory
${results.aiHooks.map(hook => `- ${hook}`).join('\n')}

---
*Generated by AqlHR AI Inventory Auditor*
`;

    await fs.writeFile('docs/AI_CAPABILITIES_AUDIT.md', report);
    console.log(chalk.blue('📄 Generated audit report: docs/AI_CAPABILITIES_AUDIT.md'));
  }

  async runAudit(updateManifest = false): Promise<boolean> {
    console.log(chalk.blue.bold('🤖 AqlHR AI Inventory Audit Starting...\n'));
    
    await this.loadManifest();
    
    const results: AuditResults = {
      edgeFunctions: await this.scanEdgeFunctions(),
      aiComponents: await this.scanAIComponents(),
      aiHooks: await this.scanAIHooks(),
      aiPages: await this.scanAIPages(),
      missingCritical: [],
      driftReport: [],
      passed: true
    };

    results.missingCritical = await this.checkCriticalFunctions(results.edgeFunctions);
    results.driftReport = this.generateDriftReport(results);
    results.passed = results.missingCritical.length === 0 && results.driftReport.length === 0;

    if (updateManifest) {
      await this.updateManifest(results);
    }

    await this.generateReport(results);

    // Summary
    console.log(chalk.blue.bold('\n📊 Audit Summary:'));
    console.log(`Status: ${results.passed ? chalk.green('PASSED') : chalk.red('FAILED')}`);
    console.log(`Edge Functions: ${results.edgeFunctions.length}`);
    console.log(`AI Components: ${results.aiComponents.length}`);
    console.log(`AI Hooks: ${results.aiHooks.length}`);
    console.log(`AI Pages: ${results.aiPages.length}`);
    console.log(`Total AI Files: ${results.edgeFunctions.length + results.aiComponents.length + results.aiHooks.length + results.aiPages.length}`);
    
    if (!results.passed) {
      console.log(chalk.red('\n❌ Audit Failed:'));
      if (results.missingCritical.length > 0) {
        console.log(chalk.red(`  Missing ${results.missingCritical.length} critical functions`));
      }
      if (results.driftReport.length > 0) {
        console.log(chalk.red(`  ${results.driftReport.length} inventory drifts detected`));
      }
    } else {
      console.log(chalk.green('\n✅ All AI inventory checks passed!'));
    }

    return results.passed;
  }
}

// CLI execution
if (require.main === module) {
  const auditor = new AIInventoryAuditor();
  const updateFlag = process.argv.includes('--update');
  
  auditor.runAudit(updateFlag)
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error(chalk.red('Audit failed:'), error);
      process.exit(1);
    });
}

export { AIInventoryAuditor };