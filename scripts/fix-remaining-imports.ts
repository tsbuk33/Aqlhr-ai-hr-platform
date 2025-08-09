#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

/**
 * Script to fix remaining AqlHRAIAssistant imports from named to default export
 */
async function fixRemainingImports() {
  console.log('🔧 Fixing remaining AqlHRAIAssistant imports...');
  
  // Find all TypeScript React files
  const files = await glob('src/pages/**/*.{ts,tsx}', { 
    ignore: ['node_modules/**', 'dist/**', 'build/**'] 
  });
  
  let filesFixed = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Pattern to match named import of AqlHRAIAssistant
      const namedImportPattern = /import\s*\{\s*AqlHRAIAssistant\s*\}\s*from\s*['"]@\/components\/ai\/AqlHRAIAssistant['"];?/g;
      
      if (namedImportPattern.test(content)) {
        // Replace with default import
        const newContent = content.replace(
          namedImportPattern,
          "import AqlHRAIAssistant from '@/components/ai/AqlHRAIAssistant';"
        );
        
        fs.writeFileSync(file, newContent);
        console.log(`✅ Fixed import in: ${file}`);
        filesFixed++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }
  
  console.log(`\n🎉 Successfully fixed imports in ${filesFixed} files!`);
}

// Run the script
fixRemainingImports().catch(console.error);