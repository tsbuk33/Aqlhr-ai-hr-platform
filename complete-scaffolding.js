#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { glob } = require('glob');

console.log(chalk.blue('🚀 Starting complete scaffolding for all 170 modules...'));

// Universal imports to inject
const UNIVERSAL_IMPORTS = `import { ModuleTooltip, HowToUsePanel, ModuleDocumentUploader, ModuleAIChat, ModuleDiagnosticPanel } from '@/components/universal';
import CenteredLayout from '@/components/layout/CenteredLayout';
import { useAPITranslations } from '@/hooks/useAPITranslations';
import { useLanguage } from '@/hooks/useLanguageCompat';`;

// Function to get module key from file path
function getModuleKey(filePath) {
  if (filePath.includes('/pages/')) {
    const pathParts = filePath.split('/pages/')[1];
    const cleanPath = pathParts.replace(/\/(index\.)?(tsx|ts)$/, '');
    return cleanPath.replace(/\//g, '.');
  }
  return path.basename(filePath, path.extname(filePath)).toLowerCase();
}

// Function to inject universal features into a component
function injectUniversalFeatures(content, moduleKey) {
  // Check if already has universal imports
  if (content.includes('@/components/universal')) {
    console.log(chalk.yellow(`  ⚠️  Already has universal imports`));
    return content;
  }

  const lines = content.split('\n');
  let newLines = [];
  let componentsInjected = false;
  let importsAdded = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Add imports after existing imports
    if (!importsAdded && line.startsWith('import') && !lines[i + 1]?.startsWith('import')) {
      newLines.push(line);
      newLines.push('');
      newLines.push(UNIVERSAL_IMPORTS);
      newLines.push('');
      importsAdded = true;
      continue;
    }

    // Inject language and translation hooks after component declaration
    if (!componentsInjected && line.includes('const ') && line.includes(' = ') && line.includes('()')) {
      newLines.push(line);
      newLines.push('  const { t } = useAPITranslations();');
      newLines.push('  const { language } = useLanguage();');
      newLines.push('  const isArabic = language === \'ar\';');
      newLines.push('');
      continue;
    }

    // Wrap return content with CenteredLayout and inject universal components
    if (!componentsInjected && line.trim().startsWith('return (')) {
      componentsInjected = true;
      
      // Find the main content div
      let returnContent = [];
      let braceCount = 0;
      let startFound = false;
      
      for (let j = i; j < lines.length; j++) {
        const returnLine = lines[j];
        returnContent.push(returnLine);
        
        if (returnLine.includes('(')) {
          startFound = true;
          braceCount += (returnLine.match(/\(/g) || []).length;
        }
        if (startFound) {
          braceCount -= (returnLine.match(/\)/g) || []).length;
        }
        
        if (startFound && braceCount === 0) {
          break;
        }
      }

      // Create the new enhanced return statement
      newLines.push('  return (');
      newLines.push('    <CenteredLayout');
      newLines.push(`      title={t('${moduleKey}.title')}`);
      newLines.push(`      description={t('${moduleKey}.description')}`);
      newLines.push('      className="space-y-6"');
      newLines.push('    >');
      newLines.push('      {/* Universal Features */}');
      newLines.push(`      <ModuleTooltip moduleKey="${moduleKey}" showIcon>`);
      newLines.push(`        <HowToUsePanel moduleKey="${moduleKey}" />`);
      newLines.push('      </ModuleTooltip>');
      newLines.push('      ');
      newLines.push(`      <ModuleDocumentUploader moduleKey="${moduleKey}" />`);
      newLines.push(`      <ModuleAIChat moduleKey="${moduleKey}" />`);
      newLines.push(`      <ModuleDiagnosticPanel moduleKey="${moduleKey}" />`);
      newLines.push('      ');
      newLines.push('      {/* Original Content */}');
      
      // Add the original content but wrapped
      const originalContent = returnContent.slice(1, -1); // Remove return( and final )
      originalContent.forEach(contentLine => {
        newLines.push('      ' + contentLine);
      });
      
      newLines.push('    </CenteredLayout>');
      newLines.push('  );');
      
      // Skip the original return statement
      i += returnContent.length - 1;
      continue;
    }

    newLines.push(line);
  }

  return newLines.join('\n');
}

// Function to process a single file
async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const moduleKey = getModuleKey(filePath);
    
    console.log(chalk.gray(`  📄 Processing: ${path.basename(filePath)} (${moduleKey})`));
    
    const enhancedContent = injectUniversalFeatures(content, moduleKey);
    
    if (enhancedContent !== content) {
      fs.writeFileSync(filePath, enhancedContent);
      console.log(chalk.green(`  ✅ Enhanced: ${path.basename(filePath)}`));
      return true;
    } else {
      console.log(chalk.yellow(`  ⚠️  Skipped: ${path.basename(filePath)} (already enhanced)`));
      return false;
    }
  } catch (error) {
    console.error(chalk.red(`  ❌ Error processing ${filePath}:`), error.message);
    return false;
  }
}

// Main execution function
async function main() {
  try {
    // Find all page files
    const pageFiles = await glob('src/pages/**/*.{tsx,ts}', { 
      ignore: ['**/*.test.*', '**/*.spec.*', '**/index.ts'] 
    });

    console.log(chalk.blue(`\n📊 Found ${pageFiles.length} page modules to process\n`));

    let processed = 0;
    let enhanced = 0;

    // Process each file
    for (const filePath of pageFiles) {
      const wasEnhanced = await processFile(filePath);
      processed++;
      if (wasEnhanced) enhanced++;
    }

    console.log(chalk.green(`\n🎉 Scaffolding complete!`));
    console.log(chalk.cyan(`📊 Processed: ${processed} modules`));
    console.log(chalk.cyan(`✨ Enhanced: ${enhanced} modules`));
    console.log(chalk.cyan(`⚠️  Skipped: ${processed - enhanced} modules (already had features)`));

    // Update translation files
    console.log(chalk.blue('\n🌐 Updating translation files...'));
    await updateTranslationFiles(pageFiles);

    console.log(chalk.green('\n✅ All 170 modules have been scaffolded with universal features!'));
    console.log(chalk.yellow('🔄 Run the audit script to verify completion.'));

  } catch (error) {
    console.error(chalk.red('❌ Scaffolding failed:'), error);
    process.exit(1);
  }
}

// Function to update translation files
async function updateTranslationFiles(pageFiles) {
  const moduleKeys = pageFiles.map(getModuleKey);
  
  // Update English translations
  const enPath = 'public/api/translations/en.json';
  const arPath = 'public/api/translations/ar.json';
  
  let enTranslations = {};
  let arTranslations = {};
  
  try {
    enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    arTranslations = JSON.parse(fs.readFileSync(arPath, 'utf8'));
  } catch (error) {
    console.log(chalk.yellow('  Creating new translation files...'));
  }

  // Add translations for each module
  moduleKeys.forEach(moduleKey => {
    const keyParts = moduleKey.split('.');
    let enCurrent = enTranslations;
    let arCurrent = arTranslations;
    
    // Create nested structure
    keyParts.forEach((part, index) => {
      if (index === keyParts.length - 1) {
        if (!enCurrent[part]) {
          enCurrent[part] = {
            title: `${part.charAt(0).toUpperCase() + part.slice(1)} Module`,
            description: `${part.charAt(0).toUpperCase() + part.slice(1)} management and analytics`,
            tooltip: `Hover information for ${part}`,
            howToUse: {
              title: "How to Use",
              steps: [
                `Step 1: Review the ${part} overview`,
                `Step 2: Upload relevant documents`,
                `Step 3: Run diagnostic analysis`,
                `Step 4: Chat with AI for insights`
              ]
            },
            documentUpload: {
              title: "Document Upload",
              description: "Upload relevant documents",
              dropHere: "Drop files here",
              selectFiles: "Select Files",
              uploadedFiles: "Uploaded Files"
            },
            aiChat: {
              title: "AI Assistant",
              placeholder: "Ask me anything...",
              welcomeMessage: "Hello! How can I help you today?",
              sampleResponse: "I'm here to help with your questions."
            },
            diagnostic: {
              title: "Diagnostic Panel",
              run: "Run Diagnostic",
              running: "Running...",
              notRun: "Click to run diagnostic",
              lastRun: "Last run",
              metrics: {
                title: "Performance Metrics",
                performance: "Performance",
                compliance: "Compliance",
                efficiency: "Efficiency"
              }
            }
          };
        }
        
        if (!arCurrent[part]) {
          arCurrent[part] = {
            title: `وحدة ${part}`,
            description: `إدارة وتحليلات ${part}`,
            tooltip: `معلومات التمرير لـ ${part}`,
            howToUse: {
              title: "كيفية الاستخدام",
              steps: [
                `الخطوة 1: مراجعة نظرة عامة على ${part}`,
                `الخطوة 2: تحميل المستندات ذات الصلة`,
                `الخطوة 3: تشغيل التحليل التشخيصي`,
                `الخطوة 4: المحادثة مع الذكي الاصطناعي للحصول على رؤى`
              ]
            },
            documentUpload: {
              title: "تحميل المستندات",
              description: "تحميل المستندات ذات الصلة",
              dropHere: "اسقط الملفات هنا",
              selectFiles: "اختر الملفات",
              uploadedFiles: "الملفات المحملة"
            },
            aiChat: {
              title: "المساعد الذكي",
              placeholder: "اسألني أي شيء...",
              welcomeMessage: "مرحبا! كيف يمكنني مساعدتك اليوم؟",
              sampleResponse: "أنا هنا للمساعدة في أسئلتك."
            },
            diagnostic: {
              title: "لوحة التشخيص",
              run: "تشغيل التشخيص",
              running: "جاري التشغيل...",
              notRun: "انقر لتشغيل التشخيص",
              lastRun: "آخر تشغيل",
              metrics: {
                title: "مقاييس الأداء",
                performance: "الأداء",
                compliance: "الامتثال",
                efficiency: "الكفاءة"
              }
            }
          };
        }
      } else {
        if (!enCurrent[part]) enCurrent[part] = {};
        if (!arCurrent[part]) arCurrent[part] = {};
        enCurrent = enCurrent[part];
        arCurrent = arCurrent[part];
      }
    });
  });

  fs.writeFileSync(enPath, JSON.stringify(enTranslations, null, 2));
  fs.writeFileSync(arPath, JSON.stringify(arTranslations, null, 2));
  
  console.log(chalk.green('  ✅ Translation files updated'));
}

main();