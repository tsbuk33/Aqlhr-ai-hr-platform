import fs from 'fs';
import { glob } from 'glob';

console.log('🚀 Starting AI chat injection...');

function generateModuleKey(filePath) {
  const relativePath = filePath.replace(/^src\/pages\//, '').replace(/\.tsx?$/, '');
  const parts = relativePath.split('/');
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toLowerCase() + parts[0].slice(1);
  }
  
  const folder = parts.slice(0, -1).join('.');
  const fileName = parts[parts.length - 1].charAt(0).toLowerCase() + parts[parts.length - 1].slice(1);
  return `${folder}.${fileName}`;
}

async function addAIChatToFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if already has AI chat
    if (content.includes('ModuleAIChat') || content.includes('EnhancedModuleAIChat')) {
      console.log(`⚠️ ${filePath} already has AI chat`);
      return false;
    }

    const moduleKey = generateModuleKey(filePath);
    let newContent = content;

    // Add imports
    const hasUniversalImport = content.includes("from '@/components/universal'");
    if (!hasUniversalImport) {
      const lastImportIndex = content.lastIndexOf('import');
      if (lastImportIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', lastImportIndex);
        const importStatement = "import { ModuleAIChat, ModuleDocumentUploader } from '@/components/universal';\n";
        newContent = content.slice(0, nextLineIndex + 1) + importStatement + content.slice(nextLineIndex + 1);
      }
    }

    // Find the return statement and inject components
    const returnRegex = /return\s*\(/;
    const match = newContent.match(returnRegex);
    
    if (match) {
      const startPos = match.index + match[0].length;
      
      // Find the matching closing parenthesis
      let depth = 1;
      let endPos = startPos;
      
      while (endPos < newContent.length && depth > 0) {
        const char = newContent[endPos];
        if (char === '(') depth++;
        if (char === ')') depth--;
        endPos++;
      }
      
      const beforeReturn = newContent.slice(0, startPos);
      const returnContent = newContent.slice(startPos, endPos - 1);
      const afterReturn = newContent.slice(endPos - 1);
      
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
      
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Added AI chat to ${filePath} (${moduleKey})`);
      return true;
    }
    
    console.log(`⚠️ Could not find return statement in ${filePath}`);
    return false;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  try {
    const pageFiles = await glob('src/pages/**/*.{tsx,jsx}', {
      ignore: ['**/*.test.*', '**/*.spec.*', '**/test/**', '**/tests/**']
    });

    console.log(`Found ${pageFiles.length} files to process\n`);
    
    let processed = 0;
    let added = 0;
    
    for (const file of pageFiles) {
      const success = await addAIChatToFile(file);
      if (success) added++;
      processed++;
      
      if (processed % 20 === 0) {
        console.log(`Progress: ${processed}/${pageFiles.length} files processed, ${added} modified`);
      }
    }

    console.log(`\n🎉 Completed! ${added} files modified out of ${processed} processed.`);
    
  } catch (error) {
    console.error('❌ Script failed:', error.message);
  }
}

main();