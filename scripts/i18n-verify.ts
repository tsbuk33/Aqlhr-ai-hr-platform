#!/usr/bin/env tsx

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

interface TranslationBundle {
  [key: string]: string | TranslationBundle;
}

interface LocaleBundles {
  en: Record<string, TranslationBundle>;
  ar: Record<string, TranslationBundle>;
}

function extractTranslations(filePath: string): LocaleBundles | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Extract the bundles object using regex
    const bundlesMatch = content.match(/const bundles[^=]*=\s*({[\s\S]*?});/);
    if (!bundlesMatch) {
      console.error('Could not find bundles object in', filePath);
      return null;
    }
    
    // Use eval to parse the bundles (safe in our controlled environment)
    const bundlesCode = bundlesMatch[1];
    const bundles = eval(`(${bundlesCode})`);
    
    return bundles as LocaleBundles;
  } catch (error) {
    console.error('Error parsing translations:', error);
    return null;
  }
}

function flattenKeys(obj: TranslationBundle, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'string') {
      keys.push(fullKey);
    } else if (typeof value === 'object' && value !== null) {
      keys.push(...flattenKeys(value, fullKey));
    }
  }
  
  return keys.sort();
}

function findMissingKeys(enKeys: string[], arKeys: string[]): { missingInAr: string[], missingInEn: string[] } {
  const enSet = new Set(enKeys);
  const arSet = new Set(arKeys);
  
  const missingInAr = enKeys.filter(key => !arSet.has(key));
  const missingInEn = arKeys.filter(key => !enSet.has(key));
  
  return { missingInAr, missingInEn };
}

async function checkLegacyUsage(): Promise<string[]> {
  const srcFiles = await glob('src/**/*.{ts,tsx}', { ignore: 'node_modules/**' });
  const violations: string[] = [];
  
  for (const file of srcFiles) {
    const content = readFileSync(file, 'utf-8');
    
    if (content.includes('SimpleLanguageContext')) {
      violations.push(file);
    }
  }
  
  return violations;
}

async function main() {
  console.log('🔍 Verifying i18n integrity...');
  
  // Check for locale.tsx file
  const localePath = join('src', 'i18n', 'locale.tsx');
  if (!existsSync(localePath)) {
    console.error('❌ src/i18n/locale.tsx not found!');
    process.exit(1);
  }
  
  // Extract translations
  const bundles = extractTranslations(localePath);
  if (!bundles) {
    console.error('❌ Failed to extract translations from locale.tsx');
    process.exit(1);
  }
  
  let hasErrors = false;
  
  // Check each namespace
  for (const namespace of Object.keys(bundles.en)) {
    console.log(`\n📋 Checking namespace: ${namespace}`);
    
    if (!bundles.ar[namespace]) {
      console.error(`❌ Missing Arabic translations for namespace: ${namespace}`);
      hasErrors = true;
      continue;
    }
    
    const enKeys = flattenKeys(bundles.en[namespace]);
    const arKeys = flattenKeys(bundles.ar[namespace]);
    
    const { missingInAr, missingInEn } = findMissingKeys(enKeys, arKeys);
    
    if (missingInAr.length > 0) {
      console.error(`❌ Missing Arabic translations in ${namespace}:`);
      missingInAr.forEach(key => console.error(`   - ${key}`));
      hasErrors = true;
    }
    
    if (missingInEn.length > 0) {
      console.error(`❌ Missing English translations in ${namespace}:`);
      missingInEn.forEach(key => console.error(`   - ${key}`));
      hasErrors = true;
    }
    
    if (missingInAr.length === 0 && missingInEn.length === 0) {
      console.log(`✅ ${namespace}: ${enKeys.length} keys verified`);
    }
  }
  
  // Check for legacy usage
  console.log('\n🔍 Checking for legacy SimpleLanguageContext usage...');
  const legacyFiles = await checkLegacyUsage();
  
  if (legacyFiles.length > 0) {
    console.error('❌ Found legacy SimpleLanguageContext usage in:');
    legacyFiles.forEach(file => console.error(`   - ${file}`));
    hasErrors = true;
  } else {
    console.log('✅ No legacy SimpleLanguageContext usage found');
  }
  
  // Summary
  if (hasErrors) {
    console.log('\n❌ i18n verification failed!');
    process.exit(1);
  } else {
    console.log('\n✅ i18n verification passed!');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});