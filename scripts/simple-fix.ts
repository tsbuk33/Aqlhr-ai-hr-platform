#!/usr/bin/env tsx

import fs from 'fs';
import { glob } from 'glob';

console.log('🚀 Starting simple AI chat fix...');

async function addAIChatToFile(filePath: string): Promise<boolean> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if already has AI chat
    if (content.includes('ModuleAIChat') || content.includes('EnhancedModuleAIChat')) {
      console.log(`⚠️ ${filePath} already has AI chat`);
      return false;
    }

    // Generate module key
    const relativePath = filePath.replace(/^src\/pages\//, '').replace(/\.tsx?$/, '');
    const parts = relativePath.split('/');
    let moduleKey: string;
    
    if (parts.length === 1) {
      moduleKey = parts[0].charAt(0).toLowerCase() + parts[0].slice(1);
    } else {
      const folder = parts.slice(0, -1).join('.');
      const fileName = parts[parts.length - 1].charAt(0).toLowerCase() + parts[parts.length - 1].slice(1);
      moduleKey = `${folder}.${fileName}`;
    }

    // Add imports if not present
    let newContent = content;
    if (!content.includes("from '@/components/universal'")) {
      const importPos = content.lastIndexOf("import");
      const nextLinePos = content.indexOf('\n', importPos);
      newContent = content.slice(0, nextLinePos + 1) + 
        "import { ModuleAIChat, ModuleDocumentUploader } from '@/components/universal';\n" +
        content.slice(nextLinePos + 1);
    }

    // Find return statement and add AI components
    const returnMatch = newContent.match(/return\s*\(/);
    if (returnMatch) {
      const returnPos = returnMatch.index! + returnMatch[0].length;
      
      // Find the closing of the return statement
      let parenCount = 1;
      let pos = returnPos;
      while (pos < newContent.length && parenCount > 0) {
        if (newContent[pos] === '(') parenCount++;
        if (newContent[pos] === ')') parenCount--;
        pos++;
      }
      
      const beforeReturn = newContent.slice(0, returnPos);
      const returnContent = newContent.slice(returnPos, pos - 1);
      const afterReturn = newContent.slice(pos - 1);
      
      const aiComponents = `
        <>
          ${returnContent}
          
          {/* Document Upload Panel */}
          <div className="mb-6">
            <ModuleDocumentUploader 
              moduleKey="${moduleKey}"
              maxFiles={5}
              maxSize={10 * 1024 * 1024}
              acceptedTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']}
            />
          </div>

          {/* AI Assistant Panel */}
          <div className="fixed bottom-4 right-4 z-50">
            <ModuleAIChat 
              moduleKey="${moduleKey}"
              context={{
                moduleName: "${moduleKey}",
                currentData: {}
              }}
              className="w-80 h-96 shadow-2xl rounded-lg"
            />
          </div>
        </>`;
      
      newContent = beforeReturn + aiComponents + afterReturn;
    }

    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Added AI chat to ${filePath} (${moduleKey})`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return false;
  }
}

async function main() {
  const pageFiles = await glob('src/pages/**/*.{tsx,jsx}', {
    ignore: ['**/*.test.*', '**/*.spec.*', '**/test/**', '**/tests/**']
  });

  console.log(`Found ${pageFiles.length} files to process\n`);
  
  let processed = 0;
  let added = 0;
  
  for (const file of pageFiles) {
    processed++;
    const success = await addAIChatToFile(file);
    if (success) added++;
    
    if (processed % 10 === 0) {
      console.log(`Progress: ${processed}/${pageFiles.length} files processed, ${added} modified`);
    }
  }

  console.log(`\n🎉 Completed! ${added} files modified out of ${processed} processed.`);
}

main().catch(console.error);