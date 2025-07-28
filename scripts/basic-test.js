const fs = require('fs');
const path = require('path');

console.log('🧪 Basic test script running...');
console.log('Current working directory:', process.cwd());

// Check if src/pages exists
if (!fs.existsSync('src/pages')) {
  console.log('❌ src/pages directory not found!');
  process.exit(1);
}

console.log('✅ src/pages directory found');

// List all .tsx files in src/pages
function findTsxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findTsxFiles(fullPath));
    } else if (item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

const pageFiles = findTsxFiles('src/pages');
console.log(`\nFound ${pageFiles.length} page files:`);

pageFiles.forEach(file => {
  console.log(`  - ${file}`);
  
  const content = fs.readFileSync(file, 'utf-8');
  const hasAIChat = content.includes('ModuleAIChat');
  const hasUploader = content.includes('ModuleDocumentUploader');
  
  console.log(`    AI Chat: ${hasAIChat ? '✅' : '❌'}, Uploader: ${hasUploader ? '✅' : '❌'}`);
});

console.log('\n✅ Test completed!');