#!/usr/bin/env node

/**
 * AqlHR Translation Migration Tool
 * Migrates existing translations to new term bank governance structure
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const TRANSLATIONS_PATH = 'public/api/translations';
const TERMS_PATH = 'localization/terms.yaml';

console.log('🚀 AqlHR Translation Migration Tool');
console.log('===================================\n');

// Load existing translations
function loadExistingTranslations() {
  const enPath = path.join(TRANSLATIONS_PATH, 'en.json');
  const arPath = path.join(TRANSLATIONS_PATH, 'ar.json');
  
  const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const arTranslations = JSON.parse(fs.readFileSync(arPath, 'utf8'));
  
  return { en: enTranslations, ar: arTranslations };
}

// Load term bank
function loadTermBank() {
  try {
    const termBankContent = fs.readFileSync(TERMS_PATH, 'utf8');
    return yaml.load(termBankContent);
  } catch (error) {
    console.error('❌ Could not load term bank:', error.message);
    return {};
  }
}

// Extract translation pairs from nested objects
function extractTranslationPairs(enObj, arObj, prefix = '') {
  const pairs = [];
  
  for (const [key, enValue] of Object.entries(enObj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const arValue = arObj[key];
    
    if (typeof enValue === 'string' && typeof arValue === 'string') {
      pairs.push({
        key: fullKey,
        en: enValue,
        ar: arValue,
        category: prefix.split('.')[0] || 'general'
      });
    } else if (typeof enValue === 'object' && typeof arValue === 'object') {
      pairs.push(...extractTranslationPairs(enValue, arValue, fullKey));
    }
  }
  
  return pairs;
}

// Categorize translations by domain
function categorizeTranslations(pairs) {
  const categories = {
    business_terms: [],
    technical_terms: [],
    interface_terms: [],
    status_terms: [],
    uncategorized: []
  };
  
  pairs.forEach(pair => {
    // Business/HR terms
    if (pair.key.includes('employee') || pair.key.includes('payroll') || 
        pair.key.includes('saudization') || pair.key.includes('compliance') ||
        pair.key.includes('training') || pair.key.includes('performance')) {
      categories.business_terms.push(pair);
    }
    // Technical terms
    else if (pair.key.includes('system') || pair.key.includes('ai') || 
             pair.key.includes('automation') || pair.key.includes('integration')) {
      categories.technical_terms.push(pair);
    }
    // Interface terms
    else if (pair.key.includes('search') || pair.key.includes('filter') ||
             pair.key.includes('add') || pair.key.includes('edit') ||
             pair.key.includes('save') || pair.key.includes('cancel')) {
      categories.interface_terms.push(pair);
    }
    // Status terms
    else if (pair.key.includes('active') || pair.key.includes('error') ||
             pair.key.includes('success') || pair.key.includes('warning') ||
             pair.key.includes('loading') || pair.key.includes('complete')) {
      categories.status_terms.push(pair);
    }
    // Everything else
    else {
      categories.uncategorized.push(pair);
    }
  });
  
  return categories;
}

// Generate updated term bank
function generateUpdatedTermBank(existingTerms, categorizedPairs) {
  const updatedTerms = { ...existingTerms };
  
  Object.entries(categorizedPairs).forEach(([category, pairs]) => {
    if (!updatedTerms[category]) {
      updatedTerms[category] = {};
    }
    
    pairs.forEach(pair => {
      const termKey = pair.key.split('.').pop(); // Use last part as key
      
      // Avoid overwriting existing terms
      if (!updatedTerms[category][termKey]) {
        updatedTerms[category][termKey] = {
          en: pair.en,
          ar: pair.ar,
          context: `Migrated from ${pair.key}`,
          usage: "Legacy translation - needs review"
        };
      }
    });
  });
  
  return updatedTerms;
}

// Create migration report
function createMigrationReport(categorizedPairs, migratedCount, existingCount) {
  const report = `# AqlHR Translation Migration Report
Generated: ${new Date().toISOString()}

## Summary
- **Existing Terms**: ${existingCount}
- **Migrated Terms**: ${migratedCount}
- **Total Terms**: ${existingCount + migratedCount}

## Migration Breakdown
${Object.entries(categorizedPairs).map(([category, pairs]) => 
  `- **${category}**: ${pairs.length} terms`
).join('\n')}

## Required Actions
1. Review all migrated terms in \`localization/terms.yaml\`
2. Update context and usage fields for migrated terms
3. Run ESLint to identify hardcoded strings
4. Update components to use new translation structure

## Next Steps
1. Run \`npm run lint\` to check for localization issues
2. Update components to use \`useGoverned Translations\` hook
3. Review and approve all migrated terms
4. Remove legacy translation files (after backup)

## Categories Overview
${Object.entries(categorizedPairs).map(([category, pairs]) => 
  `### ${category}\n${pairs.map(p => `- \`${p.key}\`: "${p.en}" / "${p.ar}"`).join('\n')}`
).join('\n\n')}
`;

  fs.writeFileSync('localization/MIGRATION_REPORT.md', report);
  return report;
}

// Main migration function
function runMigration() {
  try {
    console.log('📄 Loading existing translations...');
    const existingTranslations = loadExistingTranslations();
    
    console.log('📖 Loading term bank...');
    const existingTerms = loadTermBank();
    
    console.log('🔍 Extracting translation pairs...');
    const translationPairs = extractTranslationPairs(
      existingTranslations.en, 
      existingTranslations.ar
    );
    
    console.log(`✅ Found ${translationPairs.length} translation pairs`);
    
    console.log('📊 Categorizing translations...');
    const categorizedPairs = categorizeTranslations(translationPairs);
    
    console.log('🔄 Generating updated term bank...');
    const updatedTermBank = generateUpdatedTermBank(existingTerms, categorizedPairs);
    
    // Count existing vs new terms
    const existingCount = Object.keys(existingTerms).length;
    const migratedCount = translationPairs.length;
    
    console.log('💾 Saving updated term bank...');
    const yamlContent = yaml.dump(updatedTermBank, {
      lineWidth: 120,
      noRefs: true,
      quotingType: '"'
    });
    fs.writeFileSync(TERMS_PATH, yamlContent);
    
    console.log('📋 Creating migration report...');
    createMigrationReport(categorizedPairs, migratedCount, existingCount);
    
    console.log('\n✅ Migration completed successfully!');
    console.log(`📁 Updated term bank: ${TERMS_PATH}`);
    console.log('📁 Migration report: localization/MIGRATION_REPORT.md');
    console.log('\n🔄 Next steps:');
    console.log('1. Review migrated terms and update context/usage');
    console.log('2. Run "npm run lint" to check for localization issues');
    console.log('3. Update components to use governed translations');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
runMigration();