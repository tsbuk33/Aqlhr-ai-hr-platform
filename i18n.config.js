/**
 * @file i18n.config.js
 * @description Translation Memory System Configuration for AqlHR Platform
 * @version 2.1.0
 * @created 2025-01-26
 * @compliance PDPL compliant - no sensitive data in configuration
 * 
 * Supported TM Systems:
 * - Crowdin (Primary)
 * - Lokalise (Secondary)
 * - Custom API (Enterprise)
 */

const config = {
  // ═══ PROJECT CONFIGURATION ════════════════════════════════════
  project: {
    id: process.env.TM_PROJECT_ID || 'aqlhr-platform',
    name: 'AqlHR Platform Localization',
    description: 'Enterprise HR platform for Saudi Arabia market',
    organization: process.env.TM_ORGANIZATION || 'aqlhr-dev'
  },

  // ═══ TM SYSTEM SELECTION ══════════════════════════════════════
  tmSystem: process.env.TM_SYSTEM || 'crowdin', // 'crowdin' | 'lokalise' | 'custom'

  // ═══ API CONFIGURATION ════════════════════════════════════════
  api: {
    // Crowdin Configuration
    crowdin: {
      baseUrl: 'https://api.crowdin.com/api/v2',
      projectId: process.env.CROWDIN_PROJECT_ID || 'PLACEHOLDER_PROJECT_ID',
      apiKey: process.env.CROWDIN_API_KEY || 'PLACEHOLDER_API_KEY',
      organizationId: process.env.CROWDIN_ORG_ID || 'PLACEHOLDER_ORG_ID',
      // Enterprise features
      tmId: process.env.CROWDIN_TM_ID || 'PLACEHOLDER_TM_ID',
      glossaryId: process.env.CROWDIN_GLOSSARY_ID || 'PLACEHOLDER_GLOSSARY_ID'
    },

    // Lokalise Configuration (Alternative)
    lokalise: {
      baseUrl: 'https://api.lokalise.com/api2',
      projectId: process.env.LOKALISE_PROJECT_ID || 'PLACEHOLDER_PROJECT_ID',
      apiKey: process.env.LOKALISE_API_KEY || 'PLACEHOLDER_API_KEY',
      teamId: process.env.LOKALISE_TEAM_ID || 'PLACEHOLDER_TEAM_ID'
    },

    // Custom API Configuration (Enterprise)
    custom: {
      baseUrl: process.env.CUSTOM_TM_URL || 'https://tm.aqlhr.com/api/v1',
      apiKey: process.env.CUSTOM_TM_KEY || 'PLACEHOLDER_CUSTOM_KEY',
      projectKey: process.env.CUSTOM_PROJECT_KEY || 'aqlhr-platform'
    }
  },

  // ═══ LOCALE CONFIGURATION ═════════════════════════════════════
  locales: {
    source: 'en-US',
    targets: ['ar-SA'],
    fallback: 'en-US',
    
    // Locale-specific settings
    settings: {
      'en-US': {
        name: 'English (United States)',
        direction: 'ltr',
        currency: 'USD',
        dateFormat: 'MM/dd/yyyy',
        timeFormat: '12h'
      },
      'ar-SA': {
        name: 'Arabic (Saudi Arabia)',
        direction: 'rtl',
        currency: 'SAR',
        dateFormat: 'dd/MM/yyyy',
        timeFormat: '12h',
        // Saudi-specific settings
        calendar: 'hijri-support',
        numericFormat: 'eastern-arabic'
      }
    }
  },

  // ═══ FILE STRUCTURE CONFIGURATION ═════════════════════════════
  files: {
    // Source files for key extraction
    source: {
      patterns: [
        'src/**/*.{ts,tsx,js,jsx}',
        '!src/**/*.test.{ts,tsx,js,jsx}',
        '!src/**/*.stories.{ts,tsx,js,jsx}',
        '!src/integrations/supabase/types.ts'
      ],
      keyPatterns: [
        /t\(['"`]([^'"`]+)['"`]\)/g,
        /<Trans[^>]*i18nKey=['"`]([^'"`]+)['"`]/g,
        /useTranslation\(\)\.t\(['"`]([^'"`]+)['"`]\)/g
      ]
    },

    // Translation files
    translations: {
      input: 'public/api/translations',
      output: 'public/api/translations',
      format: 'json',
      structure: 'nested', // 'flat' | 'nested'
      files: {
        'en-US': 'en.json',
        'ar-SA': 'ar.json'
      }
    },

    // Glossary and TM resources
    resources: {
      glossary: 'localization/terms.yaml',
      styleguide: 'LOCALIZATION_STYLEGUIDE.md',
      reports: 'localization/reports'
    }
  },

  // ═══ WORKFLOW CONFIGURATION ═══════════════════════════════════
  workflow: {
    // Pre-commit validation
    preCommit: {
      enabled: true,
      autoExtract: true,
      autoUpload: true,
      validateKeys: true,
      abortOnMissing: true
    },

    // CI/CD integration
    ci: {
      enabled: true,
      downloadOnBuild: true,
      validateCompleteness: true,
      failOnMissing: true,
      generateReports: true
    },

    // Quality assurance
    qa: {
      glossaryValidation: true,
      styleguideCompliance: true,
      contextValidation: true,
      pluralizationCheck: true
    }
  },

  // ═══ SECURITY & COMPLIANCE ════════════════════════════════════
  security: {
    // PDPL compliance settings
    dataProtection: {
      anonymizeContent: true,
      excludePatterns: [
        /password/i,
        /secret/i,
        /key/i,
        /token/i,
        /\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/, // Credit card patterns
        /\b\d{10,11}\b/ // Phone number patterns
      ]
    },

    // API security
    encryption: {
      inTransit: true,
      apiKeyRotation: 90, // days
      auditLogging: true
    }
  },

  // ═══ ADVANCED FEATURES ════════════════════════════════════════
  features: {
    // AI-powered translation suggestions
    aiTranslation: {
      enabled: true,
      provider: 'openai', // 'openai' | 'google' | 'azure'
      model: 'gpt-4',
      contextWindow: 2048,
      customPrompts: {
        hrTerminology: true,
        saudiContext: true,
        businessFormal: true
      }
    },

    // Translation memory leverage
    memoryLeverage: {
      fuzzyMatching: true,
      threshold: 75, // percentage
      autoApproval: 95, // percentage for auto-approval
      contextSensitive: true
    },

    // Quality metrics
    qualityScoring: {
      enabled: true,
      metrics: ['consistency', 'accuracy', 'fluency', 'cultural_adaptation'],
      thresholds: {
        minimum: 80,
        target: 95
      }
    }
  },

  // ═══ REPORTING CONFIGURATION ══════════════════════════════════
  reporting: {
    formats: ['json', 'csv', 'html'],
    metrics: [
      'translation_completeness',
      'quality_scores',
      'glossary_compliance',
      'missing_keys',
      'outdated_translations'
    ],
    schedule: {
      daily: ['missing_keys'],
      weekly: ['translation_completeness', 'quality_scores'],
      monthly: ['glossary_compliance', 'outdated_translations']
    }
  }
};

// ═══ ENVIRONMENT VALIDATION ═══════════════════════════════════════
function validateConfig() {
  const errors = [];
  
  // Check required environment variables
  const requiredVars = [
    'TM_PROJECT_ID',
    'TM_API_KEY'
  ];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName] || process.env[varName].includes('PLACEHOLDER')) {
      errors.push(`Missing or placeholder value for ${varName}`);
    }
  });
  
  if (errors.length > 0) {
    console.warn('⚠️  Translation Memory Configuration Warnings:');
    errors.forEach(error => console.warn(`   - ${error}`));
    console.warn('   Set up proper API credentials in your environment or secrets.');
  }
  
  return errors.length === 0;
}

// ═══ EXPORTS ═══════════════════════════════════════════════════════
module.exports = {
  ...config,
  validateConfig,
  
  // Helper functions
  getCurrentTMConfig: () => config.api[config.tmSystem],
  getLocaleSettings: (locale) => config.locales.settings[locale],
  isValidLocale: (locale) => Object.keys(config.locales.settings).includes(locale),
  
  // Security helpers
  sanitizeForUpload: (content) => {
    const { excludePatterns } = config.security.dataProtection;
    let sanitized = content;
    
    excludePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });
    
    return sanitized;
  }
};

// Validate configuration on load
if (require.main === module) {
  validateConfig();
}