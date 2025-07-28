const fs = require('fs');
const path = require('path');

console.log('🧪 AI Chat Presence Test - CommonJS Version');
console.log('Current working directory:', process.cwd());

// Check if src/pages exists
if (!fs.existsSync('src/pages')) {
  console.log('❌ src/pages directory not found!');
  console.log('Available directories:', fs.readdirSync('.').filter(item => fs.statSync(item).isDirectory()));
  process.exit(1);
}

console.log('✅ src/pages directory found');

// Generate module key for a file path
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

// Find all .tsx files recursively
function findTsxFiles(dir) {
  const files = [];
  
  try {
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
  } catch (error) {
    console.log(`Cannot read directory: ${dir}`, error.message);
  }
  
  return files;
}

const pageFiles = findTsxFiles('src/pages');
console.log(`\nFound ${pageFiles.length} page files:`);

if (pageFiles.length === 0) {
  console.log('❌ No page files found!');
  process.exit(1);
}

let summary = {
  withAIChat: 0,
  withUploader: 0,
  withCorrectKeys: 0,
  total: pageFiles.length
};

console.log('\n📋 Analysis Results:');
console.log('─'.repeat(80));

pageFiles.forEach(file => {
  console.log(`\n📄 ${file}`);
  
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const moduleKey = generateModuleKey(file);
    
    const hasAIChat = content.includes('ModuleAIChat') || content.includes('EnhancedModuleAIChat');
    const hasUploader = content.includes('ModuleDocumentUploader');
    const hasCorrectModuleKey = new RegExp(`moduleKey\\s*=\\s*["']${moduleKey}["']`).test(content);
    
    console.log(`   Expected Module Key: ${moduleKey}`);
    console.log(`   AI Chat: ${hasAIChat ? '✅' : '❌'}`);
    console.log(`   Document Uploader: ${hasUploader ? '✅' : '❌'}`);
    console.log(`   Correct Module Key: ${hasCorrectModuleKey ? '✅' : '❌'}`);
    
    if (hasAIChat) summary.withAIChat++;
    if (hasUploader) summary.withUploader++;
    if (hasCorrectModuleKey || !hasAIChat) summary.withCorrectKeys++;
    
  } catch (error) {
    console.log(`   ❌ Error reading file: ${error.message}`);
  }
});

console.log('\n📊 Summary:');
console.log('─'.repeat(40));
console.log(`✅ Files with AI Chat: ${summary.withAIChat}/${summary.total}`);
console.log(`📁 Files with Document Uploader: ${summary.withUploader}/${summary.total}`);
console.log(`🔑 Files with Correct Module Keys: ${summary.withCorrectKeys}/${summary.total}`);

if (summary.withAIChat === summary.total && summary.withUploader === summary.total && summary.withCorrectKeys === summary.total) {
  console.log('\n🎉 All tests passed! Every page has AI chat with correct configuration.');
} else {
  console.log('\n⚠️  Some pages are missing AI chat components.');
}

console.log('\n✅ Test completed!');