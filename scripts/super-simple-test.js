// Super simple test - no imports, no modules
console.log('✅ JavaScript is working!');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

// Check if src/pages directory exists
const fs = require('fs');
try {
  const exists = fs.existsSync('src/pages');
  console.log('src/pages exists:', exists);
  
  if (exists) {
    const files = fs.readdirSync('src/pages');
    console.log('Files in src/pages:', files.length);
  }
} catch (error) {
  console.log('Error checking files:', error.message);
}

console.log('🎉 Test completed successfully!');