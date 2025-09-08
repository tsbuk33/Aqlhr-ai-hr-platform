/**
 * AQLHR Platform - Advanced Language Enforcer
 * Expert-level solution for 100% language consistency
 * @author AQLHR Development Team
 * @version 5.0.0
 */

import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Comprehensive translation mappings
const COMPLETE_TRANSLATIONS = {
  ar: {
    // LEO Module - Complete Arabic translations
    'LEO - Learning Experience Optimization': 'تحسين تجربة التعلم',
    'AI-Powered Micro-Learning, Adaptive Pathways & Personalized Skill Development': 'التعلم المصغر المدعوم بالذكاء الاصطناعي، المسارات التكيفية وتطوير المهارات الشخصية',
    'Dashboard': 'لوحة التحكم',
    'My Learning': 'تعلمي',
    'Skills Progress': 'تقدم المهارات',
    'Learning Paths': 'مسارات التعلم',
    'Smart AI': 'الذكاء الذكي',
    'Analytics': 'التحليلات',
    'Engagement Score': 'نتيجة المشاركة',
    'Learning Hours': 'ساعات التعلم',
    'Day Streak': 'سلسلة الأيام',
    'Skills Acquired': 'المهارات المكتسبة',
    'Modules Completed': 'الوحدات المكتملة',
    'Live Demo Data Active': 'بيانات العرض التوضيحي المباشر نشطة',
    'Viewing 5 training modules, 5 learning records, and 6 employee profiles with real-time progress tracking': 'عرض 5 وحدات تدريبية، 5 سجلات تعلم، و 6 ملفات شخصية للموظفين مع تتبع التقدم في الوقت الفعلي',
    'Data Loaded': 'تم تحميل البيانات',
    'Active Training Modules': 'وحدات التدريب النشطة',
    'total': 'إجمالي',
    'Leadership Excellence': 'التميز في القيادة',
    'Advanced leadership skills for managers': 'مهارات القيادة المتقدمة للمديرين',
    'Digital Transformation': 'التحول الرقمي',
    'Understanding digital tools and processes': 'فهم الأدوات والعمليات الرقمية',
    'Safety Protocols': 'بروتوكولات السلامة',
    'Workplace safety and emergency procedures': 'سلامة مكان العمل وإجراءات الطوارئ',
    'Customer Service Excellence': 'التميز في خدمة العملاء',
    'Enhancing customer interaction skills': 'تعزيز مهارات التفاعل مع العملاء',
    'Cultural Awareness': 'الوعي الثقافي',
    'Understanding Saudi culture and values': 'فهم الثقافة والقيم السعودية',
    'Required': 'مطلوب',
    'active': 'نشط',
    'Duration': 'المدة',
    'Category': 'الفئة',
    'Leadership': 'القيادة',
    'Technology': 'التكنولوجيا',
    'Safety': 'السلامة',
    'Customer Service': 'خدمة العملاء',
    'Culture': 'الثقافة',
    'Deadline': 'الموعد النهائي',
    'Continue': 'متابعة',
    'Complete': 'مكتمل',
    'spent': 'مُستغرق',
    'Last accessed': 'آخر وصول',
    'Avg Quiz Score': 'متوسط نتيجة الاختبار',
    'Continue Learning': 'متابعة التعلم',
    'Next': 'التالي',
    'Technical': 'تقني',
    'Behavioral': 'سلوكي',
    'Strategic': 'استراتيجي',
    'min': 'دقيقة',
    'AI Recommendations': 'توصيات الذكاء الاصطناعي',
    'High': 'عالي',
    'Medium': 'متوسط',
    'match': 'تطابق',
    'Start': 'ابدأ',
    'Individual Learning Progress': 'تقدم التعلم الفردي',
    
    // Training & Development Module
    'Training & Development': 'التدريب والتطوير',
    'Professional training and development program management with Saudi platform integration': 'إدارة برامج التدريب والتطوير المهني مع التكامل مع المنصات السعودية',
    'Overview': 'نظرة عامة',
    'Programs': 'البرامج',
    'Certificates': 'الشهادات',
    'Progress': 'التقدم',
    'Active Programs': 'البرامج النشطة',
    'Professional & Technical Certificates': 'شهادات التقنية والمهني',
    'Training Hours': 'ساعات التدريب',
    'Completion Rate': 'معدل الإكمال',
    
    // Skills Intelligence Module
    'Skills Intelligence': 'ذكاء المهارات',
    'Job Analysis': 'تحليل الوظائف',
    'Skills Matrix': 'مصفوفة المهارات',
    'Gap Analysis': 'تحليل الفجوات',
    'Smart Recommendations': 'التوصيات الذكية',
    'Market Analysis': 'تحليل السوق',
    'Integration Points': 'نقاط التكامل',
    'Technical Skills': 'المهارات التقنية',
    'Behavioral Skills': 'المهارات السلوكية',
    'Tracked Certificates': 'الشهادات المتتبعة',
    'Skills Gaps': 'فجوات المهارات',
    'Completion Percentage': 'نسبة الاكتمال',
    'Programming & IT': 'البرمجة وتقنية المعلومات',
    'Management & Leadership': 'الإدارة والقيادة',
    'Finance & Accounting': 'المالية والمحاسبة',
    'Operations & Quality': 'العمليات والجودة',
    'Sales & Marketing': 'المبيعات والتسويق',
    'Human Resources': 'الموارد البشرية',
    'Administrative': 'الأعمال الإدارية',
    'Communication': 'التواصل',
    'Cultural Competence': 'الكفاءة الثقافية',
    'Recent Updates': 'التحديثات الأخيرة',
    'added for': 'أضيف لـ',
    'updated for': 'محدث لـ',
    'requirement added for': 'متطلب أضيف لـ',
    'gap identified for': 'فجوة محددة لـ',
    'positions': 'المناصب',
    'hours ago': 'ساعات مضت',
    'day ago': 'يوم مضى',
    'days ago': 'أيام مضت',
    'Run Comprehensive Analysis': 'تشغيل التحليل الشامل',
    'View Executive Reports': 'عرض التقارير التنفيذية',
    'Export Data': 'تصدير البيانات',
    
    // Common UI Elements
    'Save': 'حفظ',
    'Cancel': 'إلغاء',
    'Delete': 'حذف',
    'Edit': 'تعديل',
    'Add': 'إضافة',
    'Search': 'بحث',
    'Filter': 'تصفية',
    'Export': 'تصدير',
    'Import': 'استيراد',
    'Upload': 'رفع',
    'Download': 'تحميل',
    'View': 'عرض',
    'Details': 'التفاصيل',
    'Reports': 'التقارير',
    'Settings': 'الإعدادات',
    'Loading...': 'جاري التحميل...',
    'Success': 'نجح',
    'Error': 'خطأ',
    'Warning': 'تحذير',
    'Info': 'معلومات',
    'Yes': 'نعم',
    'No': 'لا',
    'OK': 'موافق',
    'Close': 'إغلاق',
    'Back': 'رجوع',
    'Next': 'التالي',
    'Previous': 'السابق',
    'Submit': 'إرسال',
    'Reset': 'إعادة تعيين',
    'Clear': 'مسح',
    'Select': 'اختيار',
    'All': 'الكل',
    'None': 'لا شيء',
    'Total': 'الإجمالي',
    'Count': 'العدد',
    'Date': 'التاريخ',
    'Time': 'الوقت',
    'Status': 'الحالة',
    'Type': 'النوع',
    'Category': 'الفئة',
    'Name': 'الاسم',
    'Description': 'الوصف',
    
    // Saudi Compliance Platforms
    'Absher': 'أبشر',
    'GOSI': 'التأمينات الاجتماعية',
    'Qiwa Platform': 'نظام قوى',
    'Ministry of Labor': 'وزارة العمل',
    'HRSD': 'هيئة تنمية الموارد البشرية',
    'WPS': 'نظام حماية الأجور',
    'Nitaqat': 'برنامج نطاقات',
    
    // Time and Date
    'Today': 'اليوم',
    'Yesterday': 'أمس',
    'Tomorrow': 'غداً',
    'This Week': 'هذا الأسبوع',
    'This Month': 'هذا الشهر',
    'This Year': 'هذا العام',
    'Last Week': 'الأسبوع الماضي',
    'Last Month': 'الشهر الماضي',
    'Last Year': 'العام الماضي',
    
    // Numbers and Units
    'hours': 'ساعات',
    'days': 'أيام',
    'weeks': 'أسابيع',
    'months': 'أشهر',
    'years': 'سنوات',
    'minutes': 'دقائق',
    'seconds': 'ثوان',
  },
  
  en: {
    // Reverse translations for English
    'تحسين تجربة التعلم': 'LEO - Learning Experience Optimization',
    'التعلم المصغر المدعوم بالذكاء الاصطناعي، المسارات التكيفية وتطوير المهارات الشخصية': 'AI-Powered Micro-Learning, Adaptive Pathways & Personalized Skill Development',
    'لوحة التحكم': 'Dashboard',
    'تعلمي': 'My Learning',
    'تقدم المهارات': 'Skills Progress',
    'مسارات التعلم': 'Learning Paths',
    'الذكاء الذكي': 'Smart AI',
    'التحليلات': 'Analytics',
    'نتيجة المشاركة': 'Engagement Score',
    'ساعات التعلم': 'Learning Hours',
    'سلسلة الأيام': 'Day Streak',
    'المهارات المكتسبة': 'Skills Acquired',
    'الوحدات المكتملة': 'Modules Completed',
    'بيانات العرض التوضيحي المباشر نشطة': 'Live Demo Data Active',
    'تم تحميل البيانات': 'Data Loaded',
    'وحدات التدريب النشطة': 'Active Training Modules',
    'إجمالي': 'total',
    'التميز في القيادة': 'Leadership Excellence',
    'التحول الرقمي': 'Digital Transformation',
    'بروتوكولات السلامة': 'Safety Protocols',
    'مطلوب': 'Required',
    'نشط': 'active',
    'متابعة': 'Continue',
    'التدريب والتطوير': 'Training & Development',
    'نظرة عامة': 'Overview',
    'البرامج': 'Programs',
    'الشهادات': 'Certificates',
    'التقدم': 'Progress',
    'أبشر': 'Absher',
    'التأمينات الاجتماعية': 'GOSI',
    'نظام قوى': 'Qiwa Platform',
    'وزارة العمل': 'Ministry of Labor',
  }
};

export const LanguageEnforcer: React.FC = () => {
  const { language, isRTL } = useLanguage();

  const enforceCompleteLanguageConsistency = () => {
    const translations = COMPLETE_TRANSLATIONS[language];
    
    // Get all text nodes in the document
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes: Text[] = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }

    // Replace all mixed content
    textNodes.forEach(textNode => {
      let content = textNode.textContent || '';
      let hasChanges = false;

      Object.entries(translations).forEach(([wrong, correct]) => {
        if (content.includes(wrong)) {
          content = content.replace(new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), correct);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        textNode.textContent = content;
      }
    });

    // Also check and update element attributes
    const elementsWithText = document.querySelectorAll('[title], [placeholder], [aria-label]');
    elementsWithText.forEach(element => {
      ['title', 'placeholder', 'aria-label'].forEach(attr => {
        const value = element.getAttribute(attr);
        if (value) {
          let newValue = value;
          Object.entries(translations).forEach(([wrong, correct]) => {
            if (newValue.includes(wrong)) {
              newValue = newValue.replace(new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), correct);
            }
          });
          if (newValue !== value) {
            element.setAttribute(attr, newValue);
          }
        }
      });
    });
  };

  const applyCenterAlignment = () => {
    // Apply center alignment to main content areas
    const mainContentSelectors = [
      '.main-content',
      '.page-content',
      '.module-content',
      '.dashboard-content',
      '.leo-content',
      '.training-content',
      '.skills-content',
      '[class*="content"]',
      'main',
      '.container',
      '.wrapper'
    ];

    mainContentSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.textAlign = 'center';
          element.style.display = 'flex';
          element.style.flexDirection = 'column';
          element.style.alignItems = 'center';
          element.style.justifyContent = 'center';
        }
      });
    });

    // Apply center alignment to specific content types
    const centerElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .stat-card, .metric-card, .module-card');
    centerElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.textAlign = 'center';
      }
    });
  };

  const enforceRTLLayout = () => {
    if (isRTL) {
      // Ensure RTL layout for Arabic
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.body.style.direction = 'rtl';
      document.body.style.textAlign = 'right';
      
      // Apply RTL to all flex containers
      const flexElements = document.querySelectorAll('.flex, [class*="flex"]');
      flexElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.flexDirection = 'row-reverse';
        }
      });
    } else {
      // Ensure LTR layout for English
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
      document.body.style.direction = 'ltr';
      document.body.style.textAlign = 'left';
    }
  };

  useEffect(() => {
    // Apply all fixes with delays to ensure DOM is ready
    setTimeout(() => {
      enforceCompleteLanguageConsistency();
      applyCenterAlignment();
      enforceRTLLayout();
    }, 100);

    // Set up mutation observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      let shouldFix = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldFix = true;
        }
      });

      if (shouldFix) {
        setTimeout(() => {
          enforceCompleteLanguageConsistency();
          applyCenterAlignment();
          enforceRTLLayout();
        }, 50);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      observer.disconnect();
    };
  }, [language, isRTL]);

  return null;
};

export default LanguageEnforcer;

