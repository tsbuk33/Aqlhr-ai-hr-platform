#!/usr/bin/env tsx

console.log('🧪 Simple test script running...');
console.log('Working directory:', process.cwd());
console.log('Script starting successfully!');

import fs from 'fs';
import path from 'path';

function findFiles(dir: string, extension: string): string[] {
  const files: string[] = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...findFiles(fullPath, extension));
      } else if (item.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.log(`Cannot read directory: ${dir}`);
  }
  
  return files;
}

console.log('Current working directory:', process.cwd());

const pageFiles = findFiles('src/pages', '.tsx');
console.log(`Found ${pageFiles.length} page files:`);

pageFiles.forEach(file => {
  console.log(`  - ${file}`);
  
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const hasAIChat = content.includes('ModuleAIChat') || content.includes('EnhancedModuleAIChat');
    const hasUploader = content.includes('ModuleDocumentUploader');
    
    console.log(`    AI Chat: ${hasAIChat ? '✅' : '❌'}, Uploader: ${hasUploader ? '✅' : '❌'}`);
  } catch (error) {
    console.log(`    Error reading file: ${error}`);
  }
});

console.log('✅ Test completed!');