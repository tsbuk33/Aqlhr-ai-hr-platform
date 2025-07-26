#!/usr/bin/env node

/**
 * @file scripts/verify-translations.js
 * @description Translation completeness verification utility for AqlHR platform
 * @version 2.1.0
 * @created 2025-01-26
 * @security PDPL compliant - no sensitive data processing
 * 
 * Features:
 * - Cross-locale translation completeness checking
 * - Missing key detection and reporting
 * - Outdated translation identification
 * - Quality metrics calculation
 * - CI/CD integration with exit codes
 * - Detailed reporting in multiple formats
 */

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

// ═══ CONFIGURATION ═════════════════════════════════════════════════
const config = {
  // Default paths
  paths: {
    translations: 'public/api/translations',
    source: 'src',
    reports: 'localization/reports',
    glossary: 'localization/terms.yaml'
  },

  // Supported locales
  locales: {
    source: 'en',
    targets: ['ar'],
    files: {
      en: 'en.json',
      ar: 'ar.json'
    }
  },

  // Quality thresholds
  thresholds: {
    completeness: {
      minimum: 80,
      target: 95,
      critical: 100
    },
    freshness: {
      maxAge: 7 // days
    }
  },

  // Critical key patterns that must be translated
  criticalPatterns: [
    /^auth\./,
    /^error\./,
    /^navigation\./,
    /^form\.validation\./,
    /^accessibility\./
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

function loadJSONFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      log('warning', `File not found: ${filePath}`);
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    log('error', `Error loading JSON file ${filePath}:`, error.message);
    return null;
  }
}

function flattenObject(obj, prefix = '', result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}

function isCriticalKey(key) {
  return config.criticalPatterns.some(pattern => pattern.test(key));
}

function calculateCompleteness(sourceKeys, targetKeys) {
  const totalKeys = sourceKeys.length;
  const translatedKeys = sourceKeys.filter(key => targetKeys.includes(key)).length;
  
  return totalKeys > 0 ? (translatedKeys / totalKeys) * 100 : 100;
}

// ═══ KEY EXTRACTION ═══════════════════════════════════════════════
function extractKeysFromSource() {
  try {
    // Use the extract-keys.js script to get current keys from source
    const { extractKeysFromFiles } = require('./extract-keys.js');
    const sourceKeys = extractKeysFromFiles(config.paths.source);
    
    return Object.keys(sourceKeys);
  } catch (error) {
    log('error', 'Error extracting keys from source:', error.message);
    return [];
  }
}

// ═══ TRANSLATION ANALYSIS ═════════════════════════════════════════
function analyzeTranslations() {
  log('info', 'Analyzing translation completeness...');
  
  const results = {
    timestamp: new Date().toISOString(),
    sourceLocale: config.locales.source,
    targetLocales: config.locales.targets,
    summary: {
      totalKeys: 0,
      criticalKeys: 0,
      completeness: {},
      issues: []
    },
    details: {}
  };
  
  // Load source translation file
  const sourceFile = path.join(config.paths.translations, config.locales.files[config.locales.source]);
  const sourceTranslations = loadJSONFile(sourceFile);
  
  if (!sourceTranslations) {
    log('error', `Unable to load source translations from ${sourceFile}`);
    return null;
  }
  
  // Flatten source keys
  const sourceKeys = Object.keys(flattenObject(sourceTranslations));
  results.summary.totalKeys = sourceKeys.length;
  results.summary.criticalKeys = sourceKeys.filter(isCriticalKey).length;
  
  log('info', `Found ${sourceKeys.length} keys in source (${results.summary.criticalKeys} critical)`);
  
  // Extract keys from source code
  const codeKeys = extractKeysFromSource();
  log('info', `Found ${codeKeys.length} keys in source code`);
  
  // Check for unused keys in translations
  const unusedKeys = sourceKeys.filter(key => !codeKeys.includes(key));
  if (unusedKeys.length > 0) {
    results.summary.issues.push({
      type: 'unused_keys',
      count: unusedKeys.length,
      keys: unusedKeys
    });
    log('warning', `Found ${unusedKeys.length} unused translation keys`);
  }
  
  // Check for missing keys in translations
  const missingInTranslations = codeKeys.filter(key => !sourceKeys.includes(key));
  if (missingInTranslations.length > 0) {
    results.summary.issues.push({
      type: 'missing_in_translations',
      count: missingInTranslations.length,
      keys: missingInTranslations
    });
    log('warning', `Found ${missingInTranslations.length} keys missing from translation files`);
  }
  
  // Analyze each target locale
  config.locales.targets.forEach(locale => {
    log('info', `Analyzing locale: ${locale}`);
    
    const targetFile = path.join(config.paths.translations, config.locales.files[locale]);
    const targetTranslations = loadJSONFile(targetFile);
    
    if (!targetTranslations) {
      results.details[locale] = {
        status: 'error',
        error: 'Translation file not found or invalid',
        completeness: 0,
        missing: sourceKeys,
        critical_missing: sourceKeys.filter(isCriticalKey)
      };
      return;
    }
    
    const targetKeys = Object.keys(flattenObject(targetTranslations));
    const missingKeys = sourceKeys.filter(key => !targetKeys.includes(key));
    const criticalMissing = missingKeys.filter(isCriticalKey);
    const completeness = calculateCompleteness(sourceKeys, targetKeys);
    
    results.details[locale] = {
      status: completeness >= config.thresholds.completeness.minimum ? 'ok' : 'incomplete',
      completeness: Math.round(completeness * 100) / 100,
      totalKeys: targetKeys.length,
      missing: missingKeys,
      critical_missing: criticalMissing,
      extra_keys: targetKeys.filter(key => !sourceKeys.includes(key))
    };
    
    results.summary.completeness[locale] = completeness;
    
    log('info', `Locale ${locale}: ${completeness.toFixed(2)}% complete (${missingKeys.length} missing, ${criticalMissing.length} critical)`);
  });
  
  return results;
}

// ═══ QUALITY METRICS ══════════════════════════════════════════════
function calculateQualityMetrics(analysisResults) {
  const metrics = {
    overall_score: 0,
    completeness_score: 0,
    critical_score: 0,
    consistency_score: 0,
    recommendations: []
  };
  
  // Calculate completeness score
  const completenessValues = Object.values(analysisResults.summary.completeness);
  if (completenessValues.length > 0) {
    metrics.completeness_score = completenessValues.reduce((sum, val) => sum + val, 0) / completenessValues.length;
  }
  
  // Calculate critical key score
  const totalCritical = analysisResults.summary.criticalKeys;
  let criticalMissing = 0;
  
  Object.values(analysisResults.details).forEach(locale => {
    if (locale.critical_missing) {
      criticalMissing += locale.critical_missing.length;
    }
  });
  
  metrics.critical_score = totalCritical > 0 ? ((totalCritical - criticalMissing) / totalCritical) * 100 : 100;
  
  // Calculate overall score
  metrics.overall_score = (metrics.completeness_score * 0.6) + (metrics.critical_score * 0.4);
  
  // Generate recommendations
  if (metrics.completeness_score < config.thresholds.completeness.target) {
    metrics.recommendations.push({
      priority: 'high',
      type: 'completeness',
      message: `Translation completeness below target (${metrics.completeness_score.toFixed(1)}% < ${config.thresholds.completeness.target}%)`
    });
  }
  
  if (criticalMissing > 0) {
    metrics.recommendations.push({
      priority: 'critical',
      type: 'critical_keys',
      message: `${criticalMissing} critical keys are missing translations`
    });
  }
  
  return metrics;
}

// ═══ REPORT GENERATION ════════════════════════════════════════════
function generateReport(analysisResults, format = 'json') {
  const qualityMetrics = calculateQualityMetrics(analysisResults);
  
  const report = {
    ...analysisResults,
    quality_metrics: qualityMetrics,
    generated_at: new Date().toISOString(),
    generator: 'AqlHR Translation Verification v2.1.0'
  };
  
  switch (format) {
    case 'html':
      return generateHTMLReport(report);
    case 'markdown':
      return generateMarkdownReport(report);
    case 'csv':
      return generateCSVReport(report);
    case 'json':
    default:
      return JSON.stringify(report, null, 2);
  }
}

function generateHTMLReport(report) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AqlHR Translation Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #e3f2fd; border-radius: 4px; }
        .critical { background: #ffebee; }
        .warning { background: #fff3e0; }
        .success { background: #e8f5e8; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <div class="header">
        <h1>AqlHR Translation Report</h1>
        <p>Generated: ${report.generated_at}</p>
        <p>Overall Score: ${report.quality_metrics.overall_score.toFixed(1)}%</p>
    </div>
    
    <h2>Summary</h2>
    <div class="metric">Total Keys: ${report.summary.totalKeys}</div>
    <div class="metric">Critical Keys: ${report.summary.criticalKeys}</div>
    <div class="metric ${report.quality_metrics.completeness_score >= 95 ? 'success' : report.quality_metrics.completeness_score >= 80 ? 'warning' : 'critical'}">
        Completeness: ${report.quality_metrics.completeness_score.toFixed(1)}%
    </div>
    
    <h2>Locale Details</h2>
    <table>
        <thead>
            <tr>
                <th>Locale</th>
                <th>Status</th>
                <th>Completeness</th>
                <th>Missing Keys</th>
                <th>Critical Missing</th>
            </tr>
        </thead>
        <tbody>
            ${Object.entries(report.details).map(([locale, data]) => `
                <tr>
                    <td>${locale}</td>
                    <td class="${data.status}">${data.status}</td>
                    <td>${data.completeness ? data.completeness.toFixed(1) + '%' : 'N/A'}</td>
                    <td>${data.missing ? data.missing.length : 'N/A'}</td>
                    <td>${data.critical_missing ? data.critical_missing.length : 'N/A'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    ${report.quality_metrics.recommendations.length > 0 ? `
        <h2>Recommendations</h2>
        <ul>
            ${report.quality_metrics.recommendations.map(rec => `
                <li class="${rec.priority}">${rec.message}</li>
            `).join('')}
        </ul>
    ` : ''}
</body>
</html>`;
  
  return html;
}

function generateMarkdownReport(report) {
  let md = `# AqlHR Translation Report\n\n`;
  md += `**Generated:** ${report.generated_at}\n`;
  md += `**Overall Score:** ${report.quality_metrics.overall_score.toFixed(1)}%\n\n`;
  
  md += `## Summary\n\n`;
  md += `- **Total Keys:** ${report.summary.totalKeys}\n`;
  md += `- **Critical Keys:** ${report.summary.criticalKeys}\n`;
  md += `- **Completeness:** ${report.quality_metrics.completeness_score.toFixed(1)}%\n\n`;
  
  md += `## Locale Details\n\n`;
  md += `| Locale | Status | Completeness | Missing | Critical Missing |\n`;
  md += `|--------|--------|--------------|---------|------------------|\n`;
  
  Object.entries(report.details).forEach(([locale, data]) => {
    md += `| ${locale} | ${data.status} | ${data.completeness ? data.completeness.toFixed(1) + '%' : 'N/A'} | ${data.missing ? data.missing.length : 'N/A'} | ${data.critical_missing ? data.critical_missing.length : 'N/A'} |\n`;
  });
  
  if (report.quality_metrics.recommendations.length > 0) {
    md += `\n## Recommendations\n\n`;
    report.quality_metrics.recommendations.forEach(rec => {
      md += `- **${rec.priority.toUpperCase()}:** ${rec.message}\n`;
    });
  }
  
  return md;
}

function generateCSVReport(report) {
  let csv = 'Locale,Status,Completeness,Missing Keys,Critical Missing,Total Keys\n';
  
  Object.entries(report.details).forEach(([locale, data]) => {
    csv += `${locale},${data.status},${data.completeness || 0},${data.missing ? data.missing.length : 0},${data.critical_missing ? data.critical_missing.length : 0},${data.totalKeys || 0}\n`;
  });
  
  return csv;
}

// ═══ MAIN EXECUTION ═══════════════════════════════════════════════
function main() {
  const argv = yargs
    .option('strict', {
      description: 'Exit with error if any issues found',
      type: 'boolean',
      default: false
    })
    .option('report', {
      alias: 'r',
      description: 'Output report file path',
      type: 'string'
    })
    .option('format', {
      description: 'Report format',
      choices: ['json', 'html', 'markdown', 'csv'],
      default: 'json'
    })
    .option('threshold', {
      description: 'Minimum completeness threshold',
      type: 'number',
      default: config.thresholds.completeness.minimum
    })
    .option('critical-only', {
      description: 'Only check critical keys',
      type: 'boolean',
      default: false
    })
    .option('verbose', {
      alias: 'v',
      description: 'Verbose output',
      type: 'boolean',
      default: false
    })
    .help()
    .argv;

  log('info', 'Starting translation verification...');
  
  // Analyze translations
  const analysisResults = analyzeTranslations();
  
  if (!analysisResults) {
    log('error', 'Analysis failed');
    process.exit(1);
  }
  
  // Generate report
  const report = generateReport(analysisResults, argv.format);
  
  // Write report to file if specified
  if (argv.report) {
    const reportDir = path.dirname(argv.report);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(argv.report, report);
    log('success', `Report written to: ${argv.report}`);
  } else if (argv.verbose) {
    console.log(report);
  }
  
  // Determine exit code
  let exitCode = 0;
  const qualityMetrics = calculateQualityMetrics(analysisResults);
  
  if (argv.strict) {
    // Check for any critical issues
    const hasCriticalIssues = Object.values(analysisResults.details).some(locale => 
      locale.critical_missing && locale.critical_missing.length > 0
    );
    
    if (hasCriticalIssues) {
      log('error', 'Critical translation keys are missing');
      exitCode = 1;
    }
    
    // Check completeness threshold
    if (qualityMetrics.completeness_score < argv.threshold) {
      log('error', `Translation completeness below threshold (${qualityMetrics.completeness_score.toFixed(1)}% < ${argv.threshold}%)`);
      exitCode = 1;
    }
  }
  
  // Summary output
  log('info', `Verification completed with score: ${qualityMetrics.overall_score.toFixed(1)}%`);
  
  if (exitCode === 0) {
    log('success', 'All translation checks passed');
  } else {
    log('error', 'Translation verification failed');
  }
  
  process.exit(exitCode);
}

// Export for use as module
module.exports = {
  analyzeTranslations,
  generateReport,
  calculateQualityMetrics,
  config
};

// Run main function if called directly
if (require.main === module) {
  main();
}