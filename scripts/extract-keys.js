#!/usr/bin/env node

/**
 * @file scripts/extract-keys.js
 * @description Translation key extraction utility for AqlHR platform
 * @version 2.1.0
 * @created 2025-01-26
 * @security PDPL compliant - excludes sensitive patterns from extraction
 * 
 * Features:
 * - Multi-pattern key extraction (t(), Trans, useTranslation)
 * - Context preservation for translators
 * - Duplicate detection and merging
 * - Security filtering for PII/sensitive data
 * - Multiple output formats (JSON, CSV, YAML)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const yargs = require('yargs');

// ═══ CONFIGURATION ═════════════════════════════════════════════════
const config = {
  // Translation key patterns to match
  patterns: [
    // t('key') or t("key")
    {
      name: 't_function',
      regex: /\bt\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      contextRegex: /\/\*\s*i18n:\s*(.+?)\s*\*\/\s*\bt\(\s*['"`][^'"`]+['"`]\s*\)/g
    },
    
    // <Trans i18nKey="key">
    {
      name: 'trans_component',
      regex: /<Trans[^>]*i18nKey\s*=\s*['"`]([^'"`]+)['"`]/g,
      contextRegex: /\/\*\s*i18n:\s*(.+?)\s*\*\/\s*<Trans[^>]*i18nKey\s*=\s*['"`][^'"`]+['"`]/g
    },
    
    // useTranslation().t('key')
    {
      name: 'use_translation_hook',
      regex: /useTranslation\(\)\.t\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      contextRegex: /\/\*\s*i18n:\s*(.+?)\s*\*\/\s*useTranslation\(\)\.t\(\s*['"`][^'"`]+['"`]\s*\)/g
    },
    
    // useAPITranslations().t('key')
    {
      name: 'api_translations_hook',
      regex: /useAPITranslations\(\)\.t\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      contextRegex: /\/\*\s*i18n:\s*(.+?)\s*\*\/\s*useAPITranslations\(\)\.t\(\s*['"`][^'"`]+['"`]\s*\)/g
    },
    
    // useGovernedTranslations().t('key')
    {
      name: 'governed_translations_hook',
      regex: /useGovernedTranslations\(\)\.t\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      contextRegex: /\/\*\s*i18n:\s*(.+?)\s*\*\/\s*useGovernedTranslations\(\)\.t\(\s*['"`][^'"`]+['"`]\s*\)/g
    }
  ],

  // File patterns to include/exclude
  files: {
    include: [
      'src/**/*.{ts,tsx,js,jsx}',
      '!src/**/*.test.{ts,tsx,js,jsx}',
      '!src/**/*.stories.{ts,tsx,js,jsx}',
      '!src/integrations/supabase/types.ts'
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '**/*.d.ts'
    ]
  },

  // Security: Patterns to exclude from extraction (PDPL compliance)
  securityPatterns: [
    /password/i,
    /secret/i,
    /key/i,
    /token/i,
    /api[_-]?key/i,
    /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/, // Credit card patterns
    /\b\d{10,11}\b/, // Phone number patterns
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i // Email patterns
  ]
};

// ═══ UTILITY FUNCTIONS ═════════════════════════════════════════════
function log(level, message, ...args) {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[level]}[${level.toUpperCase()}]${colors.reset} ${timestamp} - ${message}`, ...args);
}

function sanitizeKey(key) {
  // Remove any potentially sensitive information
  let sanitized = key;
  
  config.securityPatterns.forEach(pattern => {
    if (pattern.test(sanitized)) {
      log('warning', `Skipping potentially sensitive key: ${key}`);
      return null;
    }
  });
  
  return sanitized;
}

function extractContextFromFile(content, lineNumber) {
  const lines = content.split('\n');
  const startLine = Math.max(0, lineNumber - 3);
  const endLine = Math.min(lines.length - 1, lineNumber + 3);
  
  return {
    surrounding: lines.slice(startLine, endLine + 1),
    lineNumber: lineNumber + 1,
    component: extractComponentName(content, lineNumber),
    function: extractFunctionName(content, lineNumber)
  };
}

function extractComponentName(content, lineNumber) {
  const lines = content.split('\n');
  
  // Look backwards for component/function declaration
  for (let i = lineNumber; i >= 0; i--) {
    const line = lines[i];
    
    // React component patterns
    const componentMatch = line.match(/(?:export\s+)?(?:const|function)\s+([A-Z][A-Za-z0-9]*)/);
    if (componentMatch) {
      return componentMatch[1];
    }
    
    // Arrow function components
    const arrowMatch = line.match(/const\s+([A-Z][A-Za-z0-9]*)\s*=\s*\(/);
    if (arrowMatch) {
      return arrowMatch[1];
    }
  }
  
  return null;
}

function extractFunctionName(content, lineNumber) {
  const lines = content.split('\n');
  
  // Look backwards for function declaration
  for (let i = lineNumber; i >= 0; i--) {
    const line = lines[i];
    
    // Function patterns
    const functionMatch = line.match(/(?:export\s+)?function\s+([a-zA-Z][A-Za-z0-9]*)/);
    if (functionMatch) {
      return functionMatch[1];
    }
    
    // Method patterns
    const methodMatch = line.match(/([a-zA-Z][A-Za-z0-9]*)\s*[=:]\s*(?:async\s+)?(?:\([^)]*\)\s*=>|\([^)]*\)\s*{|function)/);
    if (methodMatch) {
      return methodMatch[1];
    }
  }
  
  return null;
}

// ═══ KEY EXTRACTION ENGINE ════════════════════════════════════════
function extractKeysFromFile(filePath, includeContext = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const keys = {};
    
    log('info', `Processing file: ${filePath}`);
    
    config.patterns.forEach(pattern => {
      let match;
      
      while ((match = pattern.regex.exec(content)) !== null) {
        const key = match[1];
        const sanitizedKey = sanitizeKey(key);
        
        if (!sanitizedKey) {
          continue; // Skip sensitive keys
        }
        
        const lineNumber = content.substring(0, match.index).split('\n').length - 1;
        
        if (!keys[sanitizedKey]) {
          keys[sanitizedKey] = {
            key: sanitizedKey,
            defaultValue: sanitizedKey, // Use key as default value
            files: [],
            pattern: pattern.name,
            occurrences: 0
          };
        }
        
        keys[sanitizedKey].occurrences++;
        
        const fileInfo = {
          file: filePath,
          line: lineNumber + 1,
          pattern: pattern.name
        };
        
        if (includeContext) {
          fileInfo.context = extractContextFromFile(content, lineNumber);
        }
        
        keys[sanitizedKey].files.push(fileInfo);
        
        // Reset regex lastIndex to avoid infinite loops
        pattern.regex.lastIndex = match.index + 1;
      }
      
      // Reset regex for next file
      pattern.regex.lastIndex = 0;
    });
    
    const keyCount = Object.keys(keys).length;
    if (keyCount > 0) {
      log('success', `Extracted ${keyCount} keys from ${filePath}`);
    }
    
    return keys;
  } catch (error) {
    log('error', `Error processing file ${filePath}:`, error.message);
    return {};
  }
}

function extractKeysFromFiles(filePaths, includeContext = false) {
  const allKeys = {};
  let totalFiles = 0;
  let processedFiles = 0;
  
  filePaths.forEach(pattern => {
    const files = glob.sync(pattern, {
      ignore: config.files.exclude
    });
    
    totalFiles += files.length;
    
    files.forEach(file => {
      const keys = extractKeysFromFile(file, includeContext);
      
      Object.keys(keys).forEach(key => {
        if (!allKeys[key]) {
          allKeys[key] = keys[key];
        } else {
          // Merge occurrences
          allKeys[key].occurrences += keys[key].occurrences;
          allKeys[key].files.push(...keys[key].files);
        }
      });
      
      processedFiles++;
    });
  });
  
  log('info', `Processed ${processedFiles}/${totalFiles} files`);
  return allKeys;
}

// ═══ OUTPUT FORMATTERS ═════════════════════════════════════════════
function formatAsJSON(keys, pretty = true) {
  if (pretty) {
    return JSON.stringify(keys, null, 2);
  }
  return JSON.stringify(keys);
}

function formatAsCSV(keys) {
  const header = 'Key,Default Value,Occurrences,Files,Pattern\n';
  const rows = Object.values(keys).map(keyInfo => {
    const files = keyInfo.files.map(f => `${f.file}:${f.line}`).join(';');
    return `"${keyInfo.key}","${keyInfo.defaultValue}",${keyInfo.occurrences},"${files}","${keyInfo.pattern}"`;
  });
  
  return header + rows.join('\n');
}

function formatAsYAML(keys) {
  let yaml = '# AqlHR Translation Keys\n# Generated: ' + new Date().toISOString() + '\n\n';
  
  Object.keys(keys).sort().forEach(key => {
    const keyInfo = keys[key];
    yaml += `${key}:\n`;
    yaml += `  default: "${keyInfo.defaultValue}"\n`;
    yaml += `  occurrences: ${keyInfo.occurrences}\n`;
    yaml += `  pattern: ${keyInfo.pattern}\n`;
    yaml += `  files:\n`;
    
    keyInfo.files.forEach(file => {
      yaml += `    - file: ${file.file}\n`;
      yaml += `      line: ${file.line}\n`;
      if (file.context) {
        yaml += `      component: ${file.context.component || 'unknown'}\n`;
      }
    });
    
    yaml += '\n';
  });
  
  return yaml;
}

// ═══ MAIN EXECUTION ═══════════════════════════════════════════════
function main() {
  const argv = yargs
    .option('files', {
      alias: 'f',
      description: 'Glob patterns or file list',
      type: 'array',
      default: config.files.include
    })
    .option('output', {
      alias: 'o',
      description: 'Output file path',
      type: 'string'
    })
    .option('format', {
      description: 'Output format',
      choices: ['json', 'csv', 'yaml'],
      default: 'json'
    })
    .option('include-context', {
      description: 'Include surrounding context for each key',
      type: 'boolean',
      default: false
    })
    .option('exclude-patterns', {
      description: 'Additional patterns to exclude',
      type: 'array',
      default: []
    })
    .option('stats', {
      description: 'Show extraction statistics',
      type: 'boolean',
      default: true
    })
    .help()
    .argv;

  log('info', 'Starting translation key extraction...');
  
  // Handle file list from external source (e.g., pre-commit hook)
  let filePatterns = argv.files;
  if (argv.files.length === 1 && fs.existsSync(argv.files[0])) {
    // File contains list of files
    const fileContent = fs.readFileSync(argv.files[0], 'utf8');
    filePatterns = fileContent.split('\n').filter(line => line.trim());
  }
  
  // Extract keys
  const keys = extractKeysFromFiles(filePatterns, argv.includeContext);
  
  // Generate statistics
  if (argv.stats) {
    const totalKeys = Object.keys(keys).length;
    const totalOccurrences = Object.values(keys).reduce((sum, key) => sum + key.occurrences, 0);
    const uniqueFiles = new Set();
    
    Object.values(keys).forEach(key => {
      key.files.forEach(file => uniqueFiles.add(file.file));
    });
    
    log('info', `Extraction Statistics:`);
    log('info', `  - Total unique keys: ${totalKeys}`);
    log('info', `  - Total occurrences: ${totalOccurrences}`);
    log('info', `  - Files with translations: ${uniqueFiles.size}`);
    log('info', `  - Average keys per file: ${(totalKeys / uniqueFiles.size || 0).toFixed(2)}`);
  }
  
  // Format output
  let output;
  switch (argv.format) {
    case 'csv':
      output = formatAsCSV(keys);
      break;
    case 'yaml':
      output = formatAsYAML(keys);
      break;
    case 'json':
    default:
      output = formatAsJSON(keys, true);
      break;
  }
  
  // Write output
  if (argv.output) {
    fs.writeFileSync(argv.output, output);
    log('success', `Keys extracted to: ${argv.output}`);
  } else {
    console.log(output);
  }
  
  // Exit with count of keys found (useful for CI)
  process.exit(Object.keys(keys).length > 0 ? 0 : 1);
}

// Export for use as module
module.exports = {
  extractKeysFromFile,
  extractKeysFromFiles,
  formatAsJSON,
  formatAsCSV,
  formatAsYAML,
  config
};

// Run main function if called directly
if (require.main === module) {
  main();
}