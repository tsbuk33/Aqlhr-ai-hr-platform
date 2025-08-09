#!/usr/bin/env tsx

import { glob } from 'glob';
import fs from 'fs';

/**
 * Audit script to ensure all AqlHRAIAssistant imports use the barrel export
 */
const BAD_PATTERNS = [
  // Named import from component file
  /import\s*\{\s*AqlHRAIAssistant\s*\}\s*from\s*['"]@\/components\/ai\/AqlHRAIAssistant(?:\.tsx)?['"]/,
  // Default import from component file
  /import\s+AqlHRAIAssistant\s+from\s+['"]@\/components\/ai\/AqlHRAIAssistant(?:\.tsx)?['"]/,
];

async function auditImports() {
  console.log('🔍 Auditing AqlHRAIAssistant imports...');
  
  const files = await glob('src/**/*.{ts,tsx}', { 
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'] 
  });
  
  const offenders: string[] = [];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const hasBadImport = BAD_PATTERNS.some(pattern => pattern.test(content));
      
      if (hasBadImport) {
        offenders.push(file);
        
        // Show the specific bad import
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (BAD_PATTERNS.some(pattern => pattern.test(line))) {
            console.error(`  ${file}:${index + 1} - ${line.trim()}`);
          }
        });
      }
    } catch (error) {
      console.error(`❌ Error reading ${file}:`, error);
    }
  }
  
  if (offenders.length > 0) {
    console.error(`\n❌ Found ${offenders.length} files with bad AqlHRAIAssistant imports:`);
    console.error('   Use: import { AqlHRAIAssistant } from \'@/components/ai\';');
    process.exit(1);
  }
  
  console.log('✅ All AqlHRAIAssistant imports are using the correct barrel export.');
}

// Run the audit
auditImports().catch(console.error);