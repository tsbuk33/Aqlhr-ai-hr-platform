#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

/**
 * Script to normalize all AqlHRAIAssistant imports to use barrel export
 */
async function normalizeImports() {
  console.log('🔧 Normalizing AqlHRAIAssistant imports to use barrel export...');
  
  // Find all TypeScript React files
  const files = await glob('src/**/*.{ts,tsx}', { 
    ignore: ['node_modules/**', 'dist/**', 'build/**'] 
  });
  
  let filesFixed = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let newContent = content;
      let hasChanges = false;
      
      // Pattern 1: Named import from component file
      const namedFromComponentPattern = /import\s*\{\s*AqlHRAIAssistant\s*\}\s*from\s*['"]@\/components\/ai\/AqlHRAIAssistant(?:\.tsx)?['"];?/g;
      
      // Pattern 2: Default import from component file  
      const defaultFromComponentPattern = /import\s+AqlHRAIAssistant\s+from\s+['"]@\/components\/ai\/AqlHRAIAssistant(?:\.tsx)?['"];?/g;
      
      // Replace both patterns with barrel import
      if (namedFromComponentPattern.test(content)) {
        newContent = newContent.replace(
          namedFromComponentPattern,
          "import { AqlHRAIAssistant } from '@/components/ai';"
        );
        hasChanges = true;
      }
      
      if (defaultFromComponentPattern.test(newContent)) {
        newContent = newContent.replace(
          defaultFromComponentPattern,
          "import { AqlHRAIAssistant } from '@/components/ai';"
        );
        hasChanges = true;
      }
      
      if (hasChanges) {
        fs.writeFileSync(file, newContent);
        console.log(`✅ Fixed import in: ${file}`);
        filesFixed++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }
  
  console.log(`\n🎉 Successfully normalized imports in ${filesFixed} files!`);
}

// Run the script
normalizeImports().catch(console.error);