#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Running Arabic i18n audit...\n');

// Function to scan for untranslated keys
function scanForRawKeys() {
  try {
    // Scan TypeScript/TSX files for raw translation keys
    const files = execSync('find src -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' }).trim().split('\n');
    const rawKeys = new Set();
    
    files.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Look for t('key.pattern') calls
        const tCallMatches = content.match(/t\(['"`]([^'"`]+)['"`]\)/g);
        if (tCallMatches) {
          tCallMatches.forEach(match => {
            const keyMatch = match.match(/t\(['"`]([^'"`]+)['"`]\)/);
            if (keyMatch) {
              rawKeys.add(keyMatch[1]);
            }
          });
        }
        
        // Look for hardcoded English strings that should be translated
        const hardcodedStrings = content.match(/(title|placeholder|label)=['"`]([A-Z][a-zA-Z\s]+)['"`]/g);
        if (hardcodedStrings) {
          console.log(`⚠️  Found potential hardcoded strings in ${file}:`);
          hardcodedStrings.forEach(str => console.log(`   ${str}`));
        }
      }
    });
    
    console.log(`📊 Found ${rawKeys.size} unique translation keys in use\n`);
    
    // Check if Arabic translations exist for all keys
    const languageFile = 'src/contexts/LanguageContext.tsx';
    if (fs.existsSync(languageFile)) {
      const langContent = fs.readFileSync(languageFile, 'utf8');
      const missingKeys = [];
      
      rawKeys.forEach(key => {
        if (!langContent.includes(`'${key}':`)) {
          missingKeys.push(key);
        }
      });
      
      if (missingKeys.length === 0) {
        console.log('✅ All translation keys have Arabic translations!');
      } else {
        console.log(`❌ Missing ${missingKeys.length} Arabic translations:`);
        missingKeys.forEach(key => console.log(`   - ${key}`));
      }
      
      return missingKeys.length === 0;
    }
    
    return false;
  } catch (error) {
    console.error('Error during audit:', error.message);
    return false;
  }
}

// Run the audit
const passed = scanForRawKeys();

console.log('\n' + '='.repeat(50));
console.log(passed ? '🎉 i18n Audit PASSED' : '💥 i18n Audit FAILED');
console.log('='.repeat(50));

process.exit(passed ? 0 : 1);