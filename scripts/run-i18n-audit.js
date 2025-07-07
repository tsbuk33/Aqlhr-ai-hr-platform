#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Run audit
console.log('🔍 Running i18n audit...\n');

try {
  // First compile the TypeScript files
  execSync('npx tsc bin/i18n-audit.ts --target es2020 --module commonjs --outDir bin/compiled --esModuleInterop --skipLibCheck', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  execSync('node bin/compiled/i18n-audit.js', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.log('Audit completed - proceeding to generate missing translations...\n');
}

// Run translation generation
console.log('🌍 Generating missing Arabic translations...\n');

try {
  // Compile the generator
  execSync('npx tsc bin/generate-arabic-translations.ts --target es2020 --module commonjs --outDir bin/compiled --esModuleInterop --skipLibCheck', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  execSync('node bin/compiled/generate-arabic-translations.js', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('Translation generation failed:', error);
  process.exit(1);
}