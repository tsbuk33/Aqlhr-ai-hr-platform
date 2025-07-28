#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface ModuleAudit {
  name: string;
  path: string;
  type: string;
  category: string;
  hasHoverTooltip: boolean;
  hasHowToUsePanel: boolean;
  hasDocumentUpload: boolean;
  hasAIDiagnostic: boolean;
  hasAIChat: boolean;
  hasCenteredLayout: boolean;
  missingFeatures: string[];
}

interface AuditManifest {
  modules: ModuleAudit[];
}

const UNIVERSAL_IMPORTS = `
import ModuleTooltip from '@/components/universal/ModuleTooltip';
import HowToUsePanel from '@/components/universal/HowToUsePanel';
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import ModuleAIChat from '@/components/universal/ModuleAIChat';
import ModuleDiagnosticPanel from '@/components/universal/ModuleDiagnosticPanel';
import { useModuleFeatures } from '@/hooks/useModuleFeatures';
import CenteredLayout from '@/components/layout/CenteredLayout';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { useAPITranslations } from '@/hooks/useAPITranslations';
`;

function getModuleKey(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function addUniversalFeatures(filePath: string, moduleAudit: ModuleAudit): void {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const moduleKey = getModuleKey(moduleAudit.name);
  
  // Check if already has universal features
  if (content.includes('ModuleTooltip') && content.includes('HowToUsePanel')) {
    console.log(`✅ ${moduleAudit.name} already has universal features`);
    return;
  }

  console.log(`🔧 Scaffolding features for: ${moduleAudit.name}`);
  
  // Add imports if not present
  if (!content.includes('ModuleTooltip')) {
    const importMatch = content.match(/import.*from ['"][^'"]+['"];?\n/g);
    if (importMatch) {
      const lastImport = importMatch[importMatch.length - 1];
      content = content.replace(lastImport, lastImport + UNIVERSAL_IMPORTS);
    }
  }

  // Add useLanguage and useAPITranslations hooks if not present
  if (!content.includes('useLanguage') || !content.includes('useAPITranslations')) {
    const componentMatch = content.match(/const\s+\w+\s*=\s*\(\s*\)\s*=>\s*{/);
    if (componentMatch) {
      const hookInsertion = `
  const { language } = useLanguage();
  const { t } = useAPITranslations();
  const isArabic = language === 'ar';
  const moduleFeatures = useModuleFeatures('${moduleKey}');
`;
      content = content.replace(componentMatch[0], componentMatch[0] + hookInsertion);
    }
  }

  // Wrap main content in CenteredLayout if not already
  if (!content.includes('CenteredLayout') && moduleAudit.missingFeatures.includes('centered-layout')) {
    const returnMatch = content.match(/return\s*\(/);
    if (returnMatch) {
      const returnIndex = content.indexOf(returnMatch[0]);
      const openParenIndex = content.indexOf('(', returnIndex);
      const closingIndex = findClosingParen(content, openParenIndex);
      
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

        ${content.slice(openParenIndex + 1, closingIndex)}

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
                `return (${wrappedContent}
  );` + 
                content.slice(closingIndex + 2);
    }
  }

  // Write the updated content
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Updated: ${moduleAudit.name}`);
}

function findClosingParen(content: string, openIndex: number): number {
  let depth = 1;
  let index = openIndex + 1;
  
  while (index < content.length && depth > 0) {
    if (content[index] === '(') depth++;
    if (content[index] === ')') depth--;
    index++;
  }
  
  return index - 1;
}

function updateTranslationFiles(modules: ModuleAudit[]): void {
  const enPath = 'public/api/translations/en.json';
  const arPath = 'public/api/translations/ar.json';
  
  // Read existing translations
  const enTranslations = fs.existsSync(enPath) ? JSON.parse(fs.readFileSync(enPath, 'utf-8')) : {};
  const arTranslations = fs.existsSync(arPath) ? JSON.parse(fs.readFileSync(arPath, 'utf-8')) : {};

  modules.forEach(module => {
    const moduleKey = getModuleKey(module.name);
    
    // Add English translations
    if (!enTranslations[moduleKey]) {
      enTranslations[moduleKey] = {
        title: module.name,
        description: `Comprehensive ${module.name.toLowerCase()} management and analytics`,
        tooltip: `Learn how to use the ${module.name} module effectively`,
        howToUse: {
          title: `How to Use ${module.name}`,
          description: `Step-by-step guidance for using the ${module.name} module effectively`,
          steps: [
            `Navigate to the ${module.name} dashboard`,
            'Review the key metrics and indicators',
            'Upload relevant documents for analysis',
            'Use the AI diagnostic to identify issues',
            'Chat with the AI assistant for guidance',
            'Generate reports and export data'
          ]
        }
      };
    }

    // Add Arabic translations (using placeholder text - would need proper translation)
    if (!arTranslations[moduleKey]) {
      arTranslations[moduleKey] = {
        title: `${module.name} (عربي)`,
        description: `إدارة وتحليلات ${module.name.toLowerCase()} الشاملة`,
        tooltip: `تعلم كيفية استخدام وحدة ${module.name} بفعالية`,
        howToUse: {
          title: `كيفية استخدام ${module.name}`,
          description: `إرشادات خطوة بخطوة لاستخدام وحدة ${module.name} بفعالية`,
          steps: [
            `انتقل إلى لوحة تحكم ${module.name}`,
            'راجع المقاييس والمؤشرات الرئيسية',
            'ارفع المستندات ذات الصلة للتحليل',
            'استخدم التشخيص الذكي لتحديد المشاكل',
            'تحدث مع المساعد الذكي للحصول على الإرشاد',
            'أنشئ التقارير وصدر البيانات'
          ]
        }
      };
    }
  });

  // Write updated translations
  fs.writeFileSync(enPath, JSON.stringify(enTranslations, null, 2), 'utf-8');
  fs.writeFileSync(arPath, JSON.stringify(arTranslations, null, 2), 'utf-8');
  
  console.log('✅ Updated translation files');
}

async function main() {
  console.log('🚀 Starting universal feature scaffolding...');
  
  // Read audit manifest
  if (!fs.existsSync('audit-manifest.json')) {
    console.error('❌ audit-manifest.json not found. Run audit first.');
    process.exit(1);
  }

  const manifest: AuditManifest = JSON.parse(fs.readFileSync('audit-manifest.json', 'utf-8'));
  
  // Update translation files first
  updateTranslationFiles(manifest.modules);
  
  // Process each module
  let updatedCount = 0;
  for (const module of manifest.modules) {
    if (module.missingFeatures.length > 0) {
      addUniversalFeatures(module.path, module);
      updatedCount++;
    }
  }
  
  console.log(`\n✅ Scaffolding complete! Updated ${updatedCount} modules.`);
  console.log('🔄 Run "npm run audit:modules" to verify all features are now present.');
}

if (require.main === module) {
  main().catch(console.error);
}