#!/usr/bin/env tsx

/**
 * AqlHR AI Inventory Manifest Version Bumper
 * Automatically updates ai-inventory.json with new version and detected changes
 */

import chalk from 'chalk';
import { promises as fs } from 'fs';
import { glob } from 'glob';

interface BumpHistoryEntry {
  version: string;
  date: string;
  changes: string;
  author: string;
}

interface AIInventory {
  lastUpdated: string;
  version: string;
  manifestSchema: string;
  bumpHistory: BumpHistoryEntry[];
  expectedCounts: {
    edgeFunctions: number;
    aiComponents: number;
    aiHooks: number;
    aiPages: number;
    totalAIFiles: number;
  };
  // ... other fields
}

class ManifestBumper {
  async getCurrentCounts(): Promise<{
    edgeFunctions: number;
    aiComponents: number;
    aiHooks: number;
    aiPages: number;
    totalAIFiles: number;
  }> {
    console.log(chalk.blue('📊 Scanning current AI capabilities...'));

    // Count Edge Functions
    const edgeFunctions = await glob('supabase/functions/*/index.ts');
    
    // Count AI Components
    const aiComponents = await glob('src/components/ai-ecosystem/**/*.tsx');
    
    // Count AI Hooks
    const aiHooks = await glob('src/hooks/useAI*.ts');
    
    // Count AI Pages  
    const aiPages = await glob('src/pages/ai/**/*.tsx');
    
    const totalAIFiles = edgeFunctions.length + aiComponents.length + aiHooks.length + aiPages.length;

    return {
      edgeFunctions: edgeFunctions.length,
      aiComponents: aiComponents.length,
      aiHooks: aiHooks.length,
      aiPages: aiPages.length,
      totalAIFiles
    };
  }

  async bumpVersion(type: 'patch' | 'minor' | 'major' = 'patch', changes?: string): Promise<void> {
    console.log(chalk.blue.bold('🔄 Bumping AI inventory manifest...\n'));

    // Read current manifest
    let manifest: AIInventory;
    try {
      const manifestContent = await fs.readFile('ai-inventory.json', 'utf8');
      manifest = JSON.parse(manifestContent);
    } catch (error) {
      console.error(chalk.red('❌ Could not read ai-inventory.json'));
      process.exit(1);
    }

    // Get current counts
    const currentCounts = await this.getCurrentCounts();
    const previousCounts = manifest.expectedCounts;

    // Calculate version bump
    const currentVersion = manifest.version.split('.').map(Number);
    switch (type) {
      case 'major':
        currentVersion[0]++;
        currentVersion[1] = 0;
        currentVersion[2] = 0;
        break;
      case 'minor':
        currentVersion[1]++;
        currentVersion[2] = 0;
        break;
      case 'patch':
      default:
        currentVersion[2]++;
        break;
    }
    const newVersion = currentVersion.join('.');

    // Detect changes
    const detectedChanges = [];
    if (currentCounts.edgeFunctions !== previousCounts.edgeFunctions) {
      detectedChanges.push(`Edge Functions: ${previousCounts.edgeFunctions} → ${currentCounts.edgeFunctions}`);
    }
    if (currentCounts.aiComponents !== previousCounts.aiComponents) {
      detectedChanges.push(`AI Components: ${previousCounts.aiComponents} → ${currentCounts.aiComponents}`);
    }
    if (currentCounts.aiHooks !== previousCounts.aiHooks) {
      detectedChanges.push(`AI Hooks: ${previousCounts.aiHooks} → ${currentCounts.aiHooks}`);
    }
    if (currentCounts.aiPages !== previousCounts.aiPages) {
      detectedChanges.push(`AI Pages: ${previousCounts.aiPages} → ${currentCounts.aiPages}`);
    }

    const changeDescription = changes || detectedChanges.join(', ') || 'Routine manifest update';

    // Update manifest
    manifest.version = newVersion;
    manifest.lastUpdated = new Date().toISOString();
    manifest.expectedCounts = currentCounts;
    
    // Add to bump history
    manifest.bumpHistory.push({
      version: newVersion,
      date: new Date().toISOString(),
      changes: changeDescription,
      author: process.env.GITHUB_ACTOR || process.env.USER || 'automated'
    });

    // Write updated manifest
    await fs.writeFile('ai-inventory.json', JSON.stringify(manifest, null, 2));

    console.log(chalk.green('✅ Successfully bumped manifest version'));
    console.log(chalk.blue(`📦 Version: ${manifest.version}`));
    console.log(chalk.blue(`📊 Total AI Files: ${currentCounts.totalAIFiles}`));
    console.log(chalk.blue(`📝 Changes: ${changeDescription}`));

    if (detectedChanges.length > 0) {
      console.log(chalk.yellow('\n🔍 Detected Changes:'));
      detectedChanges.forEach(change => console.log(chalk.yellow(`  - ${change}`)));
    }
  }
}

// CLI execution
if (require.main === module) {
  const bumper = new ManifestBumper();
  const bumpType = (process.argv[2] as 'patch' | 'minor' | 'major') || 'patch';
  const changes = process.argv[3];
  
  bumper.bumpVersion(bumpType, changes)
    .then(() => {
      console.log(chalk.green('\n🎉 Manifest bump completed successfully!'));
      process.exit(0);
    })
    .catch(error => {
      console.error(chalk.red('Manifest bump failed:'), error);
      process.exit(1);
    });
}

export { ManifestBumper };
