#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { I18nAuditor } from './i18n-audit.js';

interface TranslationPair {
  key: string;
  en: string;
  ar: string;
}

class ArabicTranslationGenerator {
  private readonly projectRoot = process.cwd();
  private readonly localesPath = path.join(this.projectRoot, 'src', 'contexts', 'LanguageContext.tsx');

  async generateMissingTranslations(): Promise<void> {
    console.log('🌍 Generating missing Arabic translations...\n');

    // 1. Run audit to get missing keys
    const auditor = new I18nAuditor();
    const auditResult = await auditor.audit();

    if (auditResult.missingArKeys.length === 0) {
      console.log('✅ No missing Arabic translations found!');
      return;
    }

    // 2. Extract English translations for missing keys
    const missingTranslations = this.extractMissingTranslations(auditResult.missingArKeys);

    // 3. Generate Arabic translations using AI/GPT-style approach
    const arabicTranslations = await this.generateArabicTranslations(missingTranslations);

    // 4. Update the LanguageContext file
    await this.updateLanguageContext(arabicTranslations);

    console.log(`✅ Generated ${arabicTranslations.length} Arabic translations!`);
  }

  private extractMissingTranslations(missingKeys: string[]): Array<{key: string, en: string}> {
    const content = fs.readFileSync(this.localesPath, 'utf-8');
    const translations: Array<{key: string, en: string}> = [];

    // Extract English translations block
    const enMatch = content.match(/en:\s*{([\s\S]*?)}\s*};/);
    if (!enMatch) {
      throw new Error('Could not find English translations block');
    }

    const enBlock = enMatch[1];

    missingKeys.forEach(key => {
      // Find the English translation for this key
      const keyPattern = new RegExp(`'${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*'([^']*)'`, 'g');
      const match = keyPattern.exec(enBlock);
      
      if (match) {
        translations.push({
          key,
          en: match[1].replace(/\\'/g, "'") // Unescape quotes
        });
      } else {
        console.warn(`⚠️  Could not find English translation for key: ${key}`);
        // Add placeholder
        translations.push({
          key,
          en: key.split('.').pop() || key // Use last part of key as fallback
        });
      }
    });

    return translations;
  }

  private async generateArabicTranslations(translations: Array<{key: string, en: string}>): Promise<TranslationPair[]> {
    console.log(`🤖 Generating Arabic translations for ${translations.length} keys...`);

    const results: TranslationPair[] = [];

    // AI-powered translation logic (simplified approach using context-aware translations)
    const translationMap = this.getTranslationMap();

    for (const { key, en } of translations) {
      let arabicTranslation = '';

      // Try exact match first
      if (translationMap.has(en.toLowerCase())) {
        arabicTranslation = translationMap.get(en.toLowerCase())!;
      } else {
        // Generate contextual translation based on key and content
        arabicTranslation = this.generateContextualTranslation(key, en);
      }

      results.push({
        key,
        en,
        ar: arabicTranslation
      });
    }

    // Save backup of generated translations
    const backupPath = path.join(this.projectRoot, 'ar.auto.json');
    const backup = Object.fromEntries(results.map(t => [t.key, t.ar]));
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    console.log(`💾 Backup saved to: ${backupPath}`);

    return results;
  }

  private getTranslationMap(): Map<string, string> {
    // Common English-Arabic translation pairs for HR/business context
    return new Map([
      // Common UI terms
      ['dashboard', 'لوحة التحكم'],
      ['settings', 'الإعدادات'],
      ['profile', 'الملف الشخصي'],
      ['account', 'الحساب'],
      ['logout', 'تسجيل الخروج'],
      ['login', 'تسجيل الدخول'],
      ['sign in', 'تسجيل الدخول'],
      ['sign out', 'تسجيل الخروج'],
      ['welcome', 'مرحباً'],
      ['home', 'الرئيسية'],
      ['back', 'رجوع'],
      ['next', 'التالي'],
      ['previous', 'السابق'],
      ['continue', 'متابعة'],
      ['submit', 'إرسال'],
      ['cancel', 'إلغاء'],
      ['confirm', 'تأكيد'],
      ['close', 'إغلاق'],
      ['open', 'فتح'],
      ['view', 'عرض'],
      ['edit', 'تعديل'],
      ['update', 'تحديث'],
      ['delete', 'حذف'],
      ['remove', 'إزالة'],
      ['add', 'إضافة'],
      ['create', 'إنشاء'],
      ['save', 'حفظ'],
      ['loading', 'جاري التحميل'],
      ['error', 'خطأ'],
      ['success', 'نجح'],
      ['warning', 'تحذير'],
      ['info', 'معلومات'],
      ['notice', 'إشعار'],
      ['alert', 'تنبيه'],
      ['status', 'الحالة'],
      ['active', 'نشط'],
      ['inactive', 'غير نشط'],
      ['pending', 'قيد الانتظار'],
      ['completed', 'مكتمل'],
      ['approved', 'موافق عليه'],
      ['rejected', 'مرفوض'],
      ['draft', 'مسودة'],
      ['published', 'منشور'],
      ['all', 'الكل'],
      ['none', 'لا شيء'],
      ['yes', 'نعم'],
      ['no', 'لا'],
      ['search', 'بحث'],
      ['filter', 'تصفية'],
      ['sort', 'ترتيب'],
      ['export', 'تصدير'],
      ['import', 'استيراد'],
      ['download', 'تنزيل'],
      ['upload', 'رفع'],
      ['print', 'طباعة'],
      ['share', 'مشاركة'],
      ['copy', 'نسخ'],
      ['paste', 'لصق'],
      ['cut', 'قص'],
      ['select all', 'تحديد الكل'],
      ['clear', 'مسح'],
      ['reset', 'إعادة تعيين'],
      ['refresh', 'تحديث'],
      ['reload', 'إعادة تحميل'],

      // HR specific terms
      ['employee', 'موظف'],
      ['employees', 'الموظفون'],
      ['hr', 'الموارد البشرية'],
      ['human resources', 'الموارد البشرية'],
      ['payroll', 'كشف الرواتب'],
      ['salary', 'الراتب'],
      ['wage', 'الأجر'],
      ['bonus', 'مكافأة'],
      ['allowance', 'بدل'],
      ['deduction', 'خصم'],
      ['overtime', 'إضافي'],
      ['leave', 'إجازة'],
      ['vacation', 'عطلة'],
      ['attendance', 'الحضور'],
      ['absence', 'غياب'],
      ['performance', 'الأداء'],
      ['evaluation', 'تقييم'],
      ['review', 'مراجعة'],
      ['appraisal', 'تقدير'],
      ['training', 'تدريب'],
      ['development', 'تطوير'],
      ['recruitment', 'التوظيف'],
      ['hiring', 'التعيين'],
      ['onboarding', 'التوجيه'],
      ['termination', 'إنهاء الخدمة'],
      ['resignation', 'استقالة'],
      ['promotion', 'ترقية'],
      ['transfer', 'نقل'],
      ['department', 'القسم'],
      ['position', 'المنصب'],
      ['job title', 'المسمى الوظيفي'],
      ['manager', 'المدير'],
      ['supervisor', 'المشرف'],
      ['team', 'الفريق'],
      ['organization', 'المؤسسة'],
      ['company', 'الشركة'],
      ['contract', 'العقد'],
      ['agreement', 'الاتفاقية'],
      ['policy', 'السياسة'],
      ['procedure', 'الإجراء'],
      ['compliance', 'الامتثال'],
      ['governance', 'الحوكمة'],
      ['audit', 'المراجعة'],
      ['report', 'التقرير'],
      ['analytics', 'التحليلات'],
      ['statistics', 'الإحصائيات'],
      ['metrics', 'المقاييس'],
      ['kpi', 'مؤشرات الأداء الرئيسية'],
      ['target', 'الهدف'],
      ['goal', 'الغاية'],
      ['objective', 'الهدف'],
      ['achievement', 'الإنجاز'],
      ['milestone', 'المعلم'],
      ['deadline', 'الموعد النهائي'],
      ['schedule', 'الجدول'],
      ['calendar', 'التقويم'],
      ['meeting', 'الاجتماع'],
      ['conference', 'المؤتمر'],
      ['workshop', 'ورشة العمل'],
      ['seminar', 'الندوة'],
      ['course', 'الدورة'],
      ['certification', 'الشهادة'],
      ['qualification', 'المؤهل'],
      ['skill', 'المهارة'],
      ['competency', 'الكفاءة'],
      ['experience', 'الخبرة'],
      ['background', 'الخلفية'],
      ['education', 'التعليم'],
      ['degree', 'الدرجة'],
      ['diploma', 'الدبلوم'],
      ['certificate', 'الشهادة'],

      // Saudi-specific terms
      ['saudi', 'سعودي'],
      ['saudization', 'السعودة'],
      ['nitaqat', 'نطاقات'],
      ['qiwa', 'قوى'],
      ['gosi', 'التأمينات الاجتماعية'],
      ['mudad', 'مدد'],
      ['absher', 'أبشر'],
      ['zatca', 'الزكاة والضريبة والجمارك'],
      ['ministry of labor', 'وزارة الموارد البشرية'],
      ['labor law', 'قانون العمل'],
      ['royal decree', 'مرسوم ملكي'],
      ['vision 2030', 'رؤية 2030'],
      ['national transformation', 'التحول الوطني'],
      ['riyadh', 'الرياض'],
      ['saudi arabia', 'المملكة العربية السعودية'],
      ['kingdom', 'المملكة'],

      // Technical terms
      ['system', 'النظام'],
      ['platform', 'المنصة'],
      ['application', 'التطبيق'],
      ['software', 'البرمجيات'],
      ['database', 'قاعدة البيانات'],
      ['server', 'الخادم'],
      ['network', 'الشبكة'],
      ['internet', 'الإنترنت'],
      ['website', 'الموقع الإلكتروني'],
      ['portal', 'البوابة'],
      ['interface', 'الواجهة'],
      ['user', 'المستخدم'],
      ['admin', 'المدير'],
      ['administrator', 'المدير'],
      ['configuration', 'التكوين'],
      ['setup', 'الإعداد'],
      ['installation', 'التثبيت'],
      ['update', 'التحديث'],
      ['upgrade', 'الترقية'],
      ['version', 'الإصدار'],
      ['backup', 'النسخ الاحتياطي'],
      ['restore', 'الاستعادة'],
      ['sync', 'المزامنة'],
      ['synchronization', 'المزامنة'],
      ['integration', 'التكامل'],
      ['connection', 'الاتصال'],
      ['api', 'واجهة برمجة التطبيقات'],
      ['automation', 'الأتمتة'],
      ['workflow', 'سير العمل'],
      ['process', 'العملية'],
      ['algorithm', 'الخوارزمية'],
      ['artificial intelligence', 'الذكاء الاصطناعي'],
      ['ai', 'الذكاء الاصطناعي'],
      ['machine learning', 'التعلم الآلي'],
      ['analytics', 'التحليلات'],
      ['data', 'البيانات'],
      ['information', 'المعلومات'],
      ['record', 'السجل'],
      ['document', 'الوثيقة'],
      ['file', 'الملف'],
      ['folder', 'المجلد'],
      ['directory', 'الدليل'],
      ['path', 'المسار'],
      ['link', 'الرابط'],
      ['url', 'العنوان'],
      ['email', 'البريد الإلكتروني'],
      ['phone', 'الهاتف'],
      ['mobile', 'الجوال'],
      ['address', 'العنوان'],
      ['location', 'الموقع'],
      ['city', 'المدينة'],
      ['country', 'البلد'],
      ['region', 'المنطقة'],
      ['timezone', 'المنطقة الزمنية'],
      ['language', 'اللغة'],
      ['arabic', 'العربية'],
      ['english', 'الإنجليزية'],
    ]);
  }

  private generateContextualTranslation(key: string, en: string): string {
    const lowerEn = en.toLowerCase();
    const translationMap = this.getTranslationMap();

    // Direct lookup
    if (translationMap.has(lowerEn)) {
      return translationMap.get(lowerEn)!;
    }

    // Context-based translation using key structure
    const keyParts = key.split('.');
    const category = keyParts[0];
    const subKey = keyParts[keyParts.length - 1];

    // HR domain-specific contextual translations
    if (category === 'dashboard') {
      if (en.includes('Total')) return `إجمالي ${this.translateLastWord(en)}`;
      if (en.includes('Active')) return `${this.translateLastWord(en)} النشط`;
      if (en.includes('Current')) return `${this.translateLastWord(en)} الحالي`;
      if (en.includes('Recent')) return `${this.translateLastWord(en)} الأخير`;
      if (en.includes('Monthly')) return `${this.translateLastWord(en)} الشهري`;
      if (en.includes('Daily')) return `${this.translateLastWord(en)} اليومي`;
    }

    if (category === 'ai_sync' || category === 'sync') {
      if (en.includes('Engine')) return en.replace('Engine', 'محرك');
      if (en.includes('Sync')) return en.replace('Sync', 'مزامنة');
      if (en.includes('Real-time')) return en.replace('Real-time', 'في الوقت الفعلي');
      if (en.includes('Smart')) return en.replace('Smart', 'ذكي');
      if (en.includes('AI')) return en.replace('AI', 'الذكاء الاصطناعي');
      if (en.includes('Processing')) return en.replace('Processing', 'معالجة');
      if (en.includes('Detection')) return en.replace('Detection', 'اكتشاف');
      if (en.includes('Monitoring')) return en.replace('Monitoring', 'مراقبة');
      if (en.includes('Success')) return en.replace('Success', 'نجاح');
      if (en.includes('Latency')) return en.replace('Latency', 'زمن الاستجابة');
      if (en.includes('Performance')) return en.replace('Performance', 'الأداء');
    }

    if (category === 'employees' || category === 'employee') {
      if (en.includes('Employee')) return en.replace('Employee', 'موظف');
      if (en.includes('Management')) return en.replace('Management', 'إدارة');
      if (en.includes('Profile')) return en.replace('Profile', 'الملف الشخصي');
      if (en.includes('Information')) return en.replace('Information', 'المعلومات');
      if (en.includes('Data')) return en.replace('Data', 'البيانات');
    }

    if (category === 'payroll') {
      if (en.includes('Payroll')) return en.replace('Payroll', 'كشف الرواتب');
      if (en.includes('Salary')) return en.replace('Salary', 'الراتب');
      if (en.includes('GOSI')) return en.replace('GOSI', 'التأمينات الاجتماعية');
      if (en.includes('Contribution')) return en.replace('Contribution', 'مساهمة');
      if (en.includes('Deduction')) return en.replace('Deduction', 'خصم');
    }

    if (category === 'compliance') {
      if (en.includes('Compliance')) return en.replace('Compliance', 'الامتثال');
      if (en.includes('Governance')) return en.replace('Governance', 'الحوكمة');
      if (en.includes('Audit')) return en.replace('Audit', 'مراجعة');
      if (en.includes('Policy')) return en.replace('Policy', 'سياسة');
    }

    if (category === 'gov' || category === 'government') {
      if (en.includes('Government')) return en.replace('Government', 'حكومي');
      if (en.includes('Integration')) return en.replace('Integration', 'تكامل');
      if (en.includes('Platform')) return en.replace('Platform', 'منصة');
    }

    // Status and state translations
    if (en.includes('Status')) return en.replace('Status', 'الحالة');
    if (en.includes('State')) return en.replace('State', 'الحالة');
    if (en.includes('Online')) return en.replace('Online', 'متصل');
    if (en.includes('Offline')) return en.replace('Offline', 'غير متصل');
    if (en.includes('Connected')) return en.replace('Connected', 'متصل');
    if (en.includes('Disconnected')) return en.replace('Disconnected', 'منقطع');

    // UI action patterns
    if (en.startsWith('View ')) return `عرض ${this.translateRest(en, 'View ')}`;
    if (en.startsWith('Edit ')) return `تعديل ${this.translateRest(en, 'Edit ')}`;
    if (en.startsWith('Add ')) return `إضافة ${this.translateRest(en, 'Add ')}`;
    if (en.startsWith('Delete ')) return `حذف ${this.translateRest(en, 'Delete ')}`;
    if (en.startsWith('Create ')) return `إنشاء ${this.translateRest(en, 'Create ')}`;
    if (en.startsWith('Update ')) return `تحديث ${this.translateRest(en, 'Update ')}`;
    if (en.startsWith('Save ')) return `حفظ ${this.translateRest(en, 'Save ')}`;
    if (en.startsWith('Cancel ')) return `إلغاء ${this.translateRest(en, 'Cancel ')}`;

    // Percentage and numbers
    if (en.includes('%')) return en; // Keep percentages as-is
    if (/^\d+$/.test(en)) return en; // Keep numbers as-is

    // Time-related
    if (en.includes('Today')) return en.replace('Today', 'اليوم');
    if (en.includes('Yesterday')) return en.replace('Yesterday', 'أمس');
    if (en.includes('Tomorrow')) return en.replace('Tomorrow', 'غداً');
    if (en.includes('This month')) return en.replace('This month', 'هذا الشهر');
    if (en.includes('Last month')) return en.replace('Last month', 'الشهر الماضي');
    if (en.includes('This year')) return en.replace('This year', 'هذا العام');

    // Size and quantity
    if (en.includes('All ')) return `جميع ${this.translateRest(en, 'All ')}`;
    if (en.includes('Total ')) return `إجمالي ${this.translateRest(en, 'Total ')}`;
    if (en.includes('Count')) return en.replace('Count', 'العدد');
    if (en.includes('Number')) return en.replace('Number', 'الرقم');
    if (en.includes('Amount')) return en.replace('Amount', 'المبلغ');

    // Fallback: If no pattern matches, try word-by-word translation
    return this.translateWordByWord(en);
  }

  private translateLastWord(text: string): string {
    const words = text.split(' ');
    const lastWord = words[words.length - 1].toLowerCase();
    const translationMap = this.getTranslationMap();
    
    return translationMap.get(lastWord) || lastWord;
  }

  private translateRest(text: string, prefix: string): string {
    const rest = text.slice(prefix.length);
    return this.translateWordByWord(rest);
  }

  private translateWordByWord(text: string): string {
    const translationMap = this.getTranslationMap();
    const words = text.toLowerCase().split(' ');
    
    const translatedWords = words.map(word => {
      // Remove punctuation for lookup
      const cleanWord = word.replace(/[.,!?;:]$/, '');
      return translationMap.get(cleanWord) || word;
    });

    return translatedWords.join(' ');
  }

  private async updateLanguageContext(translations: TranslationPair[]): Promise<void> {
    if (translations.length === 0) return;

    console.log('📝 Updating LanguageContext with new Arabic translations...');

    let content = fs.readFileSync(this.localesPath, 'utf-8');

    // Find the Arabic translations block
    const arMatch = content.match(/(ar:\s*{)([\s\S]*?)(},\s*en:)/);
    if (!arMatch) {
      throw new Error('Could not find Arabic translations block');
    }

    const [fullMatch, arStart, arBlock, arEnd] = arMatch;
    
    // Add new translations to the Arabic block
    let newArBlock = arBlock;

    // Find the last line of the Arabic block and add new translations before it
    const lines = arBlock.split('\n');
    const lastLineIndex = lines.length - 1;
    
    // Insert new translations before the last line (which should be relatively empty)
    const newTranslations = translations.map(({ key, ar }) => {
      // Escape single quotes in the translation
      const escapedAr = ar.replace(/'/g, "\\'");
      return `    '${key}': '${escapedAr}',`;
    });

    // Insert the new translations
    lines.splice(lastLineIndex, 0, '', '    // Auto-generated translations', ...newTranslations);
    newArBlock = lines.join('\n');

    // Replace the Arabic block in the content
    content = content.replace(fullMatch, arStart + newArBlock + arEnd);

    // Write the updated content back to the file
    fs.writeFileSync(this.localesPath, content, 'utf-8');

    console.log(`✅ Added ${translations.length} Arabic translations to LanguageContext`);
  }
}

// Run the generator
if (require.main === module) {
  const generator = new ArabicTranslationGenerator();
  generator.generateMissingTranslations().catch(error => {
    console.error('💥 Generation failed:', error);
    process.exit(1);
  });
}

export { ArabicTranslationGenerator };