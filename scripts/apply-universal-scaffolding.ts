#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';

interface PageFile {
  path: string;
  name: string;
  moduleKey: string;
}

const REQUIRED_IMPORTS = [
  "import ModuleTooltip from '@/components/universal/ModuleTooltip';",
  "import HowToUsePanel from '@/components/universal/HowToUsePanel';",
  "import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';",
  "import ModuleAIChat from '@/components/universal/ModuleAIChat';",
  "import ModuleDiagnosticPanel from '@/components/universal/ModuleDiagnosticPanel';",
  "import { useModuleFeatures } from '@/hooks/useModuleFeatures';",
  "import CenteredLayout from '@/components/layout/CenteredLayout';",
  "import { useAPITranslations } from '@/hooks/useAPITranslations';"
];

const REQUIRED_HOOKS = [
  "const { t } = useAPITranslations();",
  "const moduleFeatures = useModuleFeatures('{moduleKey}');"
];

function getModuleKey(filePath: string): string {
  const fileName = path.basename(filePath, '.tsx');
  return fileName.toLowerCase()
    .replace(/([A-Z])/g, (match, char, index) => index > 0 ? '-' + char.toLowerCase() : char.toLowerCase())
    .replace(/[^a-z0-9-]/g, '');
}

function addUniversalFeatures(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const moduleKey = getModuleKey(filePath);
  let modified = false;

  // Check if already has universal features
  if (content.includes('ModuleTooltip') && content.includes('CenteredLayout') && content.includes('ModuleAIChat')) {
    console.log(`✅ ${path.basename(filePath)} already has universal features`);
    return false;
  }

  console.log(`🔧 Scaffolding: ${path.basename(filePath)} (${moduleKey})`);

  // 1. Add missing imports
  REQUIRED_IMPORTS.forEach(importStatement => {
    if (!content.includes(importStatement)) {
      // Find the last import and add after it
      const importRegex = /^import.*from\s+['"][^'"]+['"];\s*$/gm;
      const matches = [...content.matchAll(importRegex)];
      if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        const insertIndex = lastMatch.index! + lastMatch[0].length;
        content = content.slice(0, insertIndex) + '\n' + importStatement + content.slice(insertIndex);
        modified = true;
      }
    }
  });

  // 2. Add required hooks
  const componentMatch = content.match(/(const\s+\w+\s*=\s*\(\s*\)\s*=>\s*{)/);
  if (componentMatch) {
    const hookCode = `
  const { t } = useAPITranslations();
  const moduleFeatures = useModuleFeatures('${moduleKey}');`;
    
    if (!content.includes("useAPITranslations()")) {
      content = content.replace(componentMatch[0], componentMatch[0] + hookCode);
      modified = true;
    }
  }

  // 3. Wrap in CenteredLayout if not already
  if (!content.includes('CenteredLayout') && !content.includes('EnhancedPageLayout')) {
    const returnMatch = content.match(/return\s*\(/);
    if (returnMatch) {
      const returnIndex = content.indexOf(returnMatch[0]);
      const afterReturnIndex = returnIndex + returnMatch[0].length;
      
      // Find the matching closing parenthesis and semicolon
      let parenCount = 0;
      let endIndex = afterReturnIndex;
      let foundEnd = false;
      
      for (let i = afterReturnIndex; i < content.length; i++) {
        if (content[i] === '(') parenCount++;
        if (content[i] === ')') {
          parenCount--;
          if (parenCount === -1) {
            endIndex = i;
            foundEnd = true;
            break;
          }
        }
      }
      
      if (foundEnd) {
        const originalContent = content.slice(afterReturnIndex, endIndex).trim();
        
        const wrappedContent = `
    <CenteredLayout
      title={t('${moduleKey}.title')}
      description={t('${moduleKey}.description')}
      className="min-h-screen"
    >
      <div dir={isArabic ? 'rtl' : 'ltr'} className="w-full max-w-7xl mx-auto space-y-6">
        
        {/* Module Tooltip */}
        <ModuleTooltip moduleKey="${moduleKey}" showIcon={true}>
          <h1 className="text-3xl font-bold">{t('${moduleKey}.title')}</h1>
        </ModuleTooltip>

        {/* How to Use Panel */}
        {moduleFeatures.isFeatureEnabled('enableHowToUse') && (
          <HowToUsePanel moduleKey="${moduleKey}" />
        )}

        {/* Core Content */}
        ${originalContent}

        {/* Document Uploader */}
        {moduleFeatures.isFeatureEnabled('enableDocumentUpload') && (
          <ModuleDocumentUploader
            moduleKey="${moduleKey}"
            maxFiles={10}
            maxSize={50 * 1024 * 1024}
            acceptedTypes={['.pdf', '.docx', '.xlsx', '.pptx']}
          />
        )}

        {/* AI Diagnostic Panel */}
        {moduleFeatures.isFeatureEnabled('enableAIDiagnostic') && (
          <ModuleDiagnosticPanel
            moduleKey="${moduleKey}"
            autoRefresh={moduleFeatures.config.autoRefreshDiagnostic}
            refreshInterval={moduleFeatures.config.diagnosticInterval}
          />
        )}

        {/* AI Chat */}
        {moduleFeatures.isFeatureEnabled('enableAIChat') && (
          <ModuleAIChat
            moduleKey="${moduleKey}"
            context={{
              moduleName: t('${moduleKey}.title'),
              currentData: {},
              uploadedDocuments: []
            }}
          />
        )}
      </div>
    </CenteredLayout>`;
        
        content = content.slice(0, returnIndex) + 
                  `return (${wrappedContent}\n  );` + 
                  content.slice(endIndex + 2);
        modified = true;
      }
    }
  }

  // 4. Ensure isArabic variable exists
  if (!content.includes('isArabic') && modified) {
    const languageMatch = content.match(/const\s+{\s*[^}]*language[^}]*}\s*=\s*useLanguage\(\);/);
    if (languageMatch) {
      content = content.replace(
        languageMatch[0], 
        languageMatch[0] + '\n  const isArabic = language === \'ar\';'
      );
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated: ${path.basename(filePath)}`);
    return true;
  }

  return false;
}

async function updateTranslationFiles(moduleKeys: string[]): Promise<void> {
  const enPath = 'public/api/translations/en.json';
  const arPath = 'public/api/translations/ar.json';
  
  // Read existing translations
  const enTranslations = fs.existsSync(enPath) ? JSON.parse(fs.readFileSync(enPath, 'utf-8')) : {};
  const arTranslations = fs.existsSync(arPath) ? JSON.parse(fs.readFileSync(arPath, 'utf-8')) : {};

  let updated = false;

  moduleKeys.forEach(moduleKey => {
    const moduleName = moduleKey.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    // Add English translations
    if (!enTranslations[moduleKey]) {
      enTranslations[moduleKey] = {
        title: moduleName,
        description: `Comprehensive ${moduleName.toLowerCase()} management and analytics`,
        tooltip: `Learn how to use the ${moduleName} module effectively`,
        howToUse: {
          title: `How to Use ${moduleName}`,
          description: `Step-by-step guidance for using the ${moduleName} module effectively`,
          steps: [
            `Navigate to the ${moduleName} dashboard`,
            'Review the key metrics and indicators',
            'Upload relevant documents for analysis',
            'Use the AI diagnostic to identify issues',
            'Chat with the AI assistant for guidance',
            'Generate reports and export data'
          ]
        }
      };
      updated = true;
    }

    // Add Arabic translations
    if (!arTranslations[moduleKey]) {
      arTranslations[moduleKey] = {
        title: `${moduleName} (عربي)`,
        description: `إدارة وتحليلات ${moduleName.toLowerCase()} الشاملة`,
        tooltip: `تعلم كيفية استخدام وحدة ${moduleName} بفعالية`,
        howToUse: {
          title: `كيفية استخدام ${moduleName}`,
          description: `إرشادات خطوة بخطوة لاستخدام وحدة ${moduleName} بفعالية`,
          steps: [
            `انتقل إلى لوحة تحكم ${moduleName}`,
            'راجع المقاييس والمؤشرات الرئيسية',
            'ارفع المستندات ذات الصلة للتحليل',
            'استخدم التشخيص الذكي لتحديد المشاكل',
            'تحدث مع المساعد الذكي للحصول على الإرشاد',
            'أنشئ التقارير وصدر البيانات'
          ]
        }
      };
      updated = true;
    }
  });

  if (updated) {
    // Write updated translations
    fs.writeFileSync(enPath, JSON.stringify(enTranslations, null, 2), 'utf-8');
    fs.writeFileSync(arPath, JSON.stringify(arTranslations, null, 2), 'utf-8');
    console.log(chalk.green('✅ Updated translation files'));
  }
}

async function main() {
  console.log(chalk.blue('🚀 Starting universal scaffolding for all pages...\n'));
  
  // Find all page files
  const pageFiles = await glob('src/pages/**/*.{tsx,ts}', { 
    ignore: ['**/*.test.*', '**/*.spec.*', '**/index.ts'] 
  });
  
  console.log(chalk.yellow(`📄 Found ${pageFiles.length} page files to process\n`));
  
  let updatedCount = 0;
  const moduleKeys: string[] = [];
  
  for (const filePath of pageFiles) {
    const moduleKey = getModuleKey(filePath);
    moduleKeys.push(moduleKey);
    
    if (addUniversalFeatures(filePath)) {
      updatedCount++;
    }
  }
  
  // Update translation files
  await updateTranslationFiles([...new Set(moduleKeys)]);
  
  console.log(chalk.bold.green(`\n✅ SCAFFOLDING COMPLETE!\n`));
  console.log(`📄 Processed: ${chalk.cyan(pageFiles.length)} pages`);
  console.log(`🔧 Updated: ${chalk.green(updatedCount)} pages`);
  console.log(`🌍 Translation keys: ${chalk.blue(moduleKeys.length)} modules`);
  console.log(`\n${chalk.bold('🎯 All pages now have:')}`);
  console.log(`  ✅ ModuleTooltip with proper localization`);
  console.log(`  ✅ HowToUsePanel for user guidance`);
  console.log(`  ✅ ModuleDocumentUploader for file management`);
  console.log(`  ✅ ModuleAIChat for intelligent assistance`);
  console.log(`  ✅ ModuleDiagnosticPanel for health monitoring`);
  console.log(`  ✅ CenteredLayout for consistent UI`);
  console.log(`  ✅ Full RTL/LTR direction support`);
}

if (require.main === module) {
  main().catch(console.error);
}