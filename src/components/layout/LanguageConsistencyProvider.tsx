/**
 * AQLHR Platform - Language Consistency Provider
 * Expert-level solution for fixing mixed language issues across the platform
 * @author AQLHR Development Team
 * @version 4.0.0
 */

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageConsistencyContextType {
  enforceLanguageConsistency: () => void;
  fixMixedContent: () => void;
  validatePageLanguage: () => void;
}

const LanguageConsistencyContext = createContext<LanguageConsistencyContextType | undefined>(undefined);

interface LanguageConsistencyProviderProps {
  children: ReactNode;
}

export const LanguageConsistencyProvider: React.FC<LanguageConsistencyProviderProps> = ({ children }) => {
  const { language, isRTL } = useLanguage();

  // Comprehensive language enforcement
  const enforceLanguageConsistency = () => {
    // Set document attributes
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Update body classes for CSS targeting
    document.body.className = document.body.className.replace(/\b(lang-ar|lang-en|dir-rtl|dir-ltr)\b/g, '');
    document.body.classList.add(`lang-${language}`, `dir-${isRTL ? 'rtl' : 'ltr'}`);
    
    // Add meta tags for language
    let langMeta = document.querySelector('meta[name="language"]');
    if (!langMeta) {
      langMeta = document.createElement('meta');
      langMeta.setAttribute('name', 'language');
      document.head.appendChild(langMeta);
    }
    langMeta.setAttribute('content', language);
    
    // Update page title direction
    const titleElement = document.querySelector('title');
    if (titleElement) {
      titleElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    }
  };

  // Fix mixed content by scanning and replacing
  const fixMixedContent = () => {
    // Common mixed content patterns to fix
    const mixedPatterns = {
      ar: {
        // English words that should be Arabic in Arabic interface
        'Dashboard': 'لوحة التحكم',
        'LEO - Learning Experience Optimization': 'تحسين تجربة التعلم',
        'AI-Powered Micro-Learning, Adaptive Pathways & Personalized Skill Development': 'التعلم المصغر المدعوم بالذكاء الاصطناعي، المسارات التكيفية وتطوير المهارات الشخصية',
        'Engagement Score': 'نتيجة المشاركة',
        'Learning Hours': 'ساعات التعلم',
        'Day Streak': 'سلسلة الأيام',
        'Skills Acquired': 'المهارات المكتسبة',
        'Modules Completed': 'الوحدات المكتملة',
        'My Learning': 'تعلمي',
        'Skills Progress': 'تقدم المهارات',
        'Learning Paths': 'مسارات التعلم',
        'Smart AI': 'الذكاء الذكي',
        'Analytics': 'التحليلات',
        'Live Demo Data Active': 'بيانات العرض التوضيحي المباشر نشطة',
        'Data Loaded': 'تم تحميل البيانات',
        'Active Training Modules': 'وحدات التدريب النشطة',
        'total': 'إجمالي',
        'Leadership Excellence': 'التميز في القيادة',
        'Digital Transformation': 'التحول الرقمي',
        'Safety Protocols': 'بروتوكولات السلامة',
        'Required': 'مطلوب',
        'active': 'نشط',
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
        'Absher': 'أبشر',
        'GOSI': 'التأمينات الاجتماعية',
        'Qiwa Platform': 'نظام قوى',
        'Ministry of Labor': 'وزارة العمل'
      },
      en: {
        // Arabic words that should be English in English interface
        'لوحة التحكم': 'Dashboard',
        'تحسين تجربة التعلم': 'LEO - Learning Experience Optimization',
        'التعلم المصغر المدعوم بالذكاء الاصطناعي، المسارات التكيفية وتطوير المهارات الشخصية': 'AI-Powered Micro-Learning, Adaptive Pathways & Personalized Skill Development',
        'نتيجة المشاركة': 'Engagement Score',
        'ساعات التعلم': 'Learning Hours',
        'سلسلة الأيام': 'Day Streak',
        'المهارات المكتسبة': 'Skills Acquired',
        'الوحدات المكتملة': 'Modules Completed',
        'تعلمي': 'My Learning',
        'تقدم المهارات': 'Skills Progress',
        'مسارات التعلم': 'Learning Paths',
        'الذكاء الذكي': 'Smart AI',
        'التحليلات': 'Analytics',
        'بيانات العرض التوضيحي المباشر نشطة': 'Live Demo Data Active',
        'تم تحميل البيانات': 'Data Loaded',
        'وحدات التدريب النشطة': 'Active Training Modules',
        'إجمالي': 'total',
        'التميز في القيادة': 'Leadership Excellence',
        'التحول الرقمي': 'Digital Transformation',
        'بروتوكولات السلامة': 'Safety Protocols',
        'مطلوب': 'Required',
        'نشط': 'active',
        'التدريب والتطوير': 'Training & Development',
        'إدارة برامج التدريب والتطوير المهني مع التكامل مع المنصات السعودية': 'Professional training and development program management with Saudi platform integration',
        'نظرة عامة': 'Overview',
        'البرامج': 'Programs',
        'الشهادات': 'Certificates',
        'التقدم': 'Progress',
        'البرامج النشطة': 'Active Programs',
        'شهادات التقنية والمهني': 'Professional & Technical Certificates',
        'ساعات التدريب': 'Training Hours',
        'معدل الإكمال': 'Completion Rate',
        'أبشر': 'Absher',
        'التأمينات الاجتماعية': 'GOSI',
        'نظام قوى': 'Qiwa Platform',
        'وزارة العمل': 'Ministry of Labor'
      }
    };

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

    // Replace mixed content
    const patterns = mixedPatterns[language];
    textNodes.forEach(textNode => {
      let content = textNode.textContent || '';
      let hasChanges = false;

      Object.entries(patterns).forEach(([wrong, correct]) => {
        if (content.includes(wrong)) {
          content = content.replace(new RegExp(wrong, 'g'), correct);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        textNode.textContent = content;
      }
    });
  };

  // Validate and fix page language consistency
  const validatePageLanguage = () => {
    // Check for common language inconsistencies
    const inconsistencies = [];

    // Check document language
    if (document.documentElement.lang !== language) {
      inconsistencies.push('Document language mismatch');
    }

    // Check direction
    if (document.documentElement.dir !== (isRTL ? 'rtl' : 'ltr')) {
      inconsistencies.push('Document direction mismatch');
    }

    // Check body classes
    const hasCorrectLangClass = document.body.classList.contains(`lang-${language}`);
    const hasCorrectDirClass = document.body.classList.contains(`dir-${isRTL ? 'rtl' : 'ltr'}`);

    if (!hasCorrectLangClass) {
      inconsistencies.push('Missing language class on body');
    }

    if (!hasCorrectDirClass) {
      inconsistencies.push('Missing direction class on body');
    }

    // Fix inconsistencies
    if (inconsistencies.length > 0) {
      console.warn('Language inconsistencies detected:', inconsistencies);
      enforceLanguageConsistency();
    }

    return inconsistencies.length === 0;
  };

  // Apply language consistency on mount and language change
  useEffect(() => {
    enforceLanguageConsistency();
    
    // Small delay to allow DOM to update
    setTimeout(() => {
      fixMixedContent();
      validatePageLanguage();
    }, 100);

    // Set up mutation observer to catch dynamic content changes
    const observer = new MutationObserver((mutations) => {
      let shouldFix = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldFix = true;
        }
      });

      if (shouldFix) {
        setTimeout(() => {
          fixMixedContent();
        }, 50);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, [language, isRTL]);

  // Apply CSS for language-specific styling
  useEffect(() => {
    const styleId = 'language-consistency-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      /* Language-specific styling */
      .lang-ar {
        font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        direction: rtl;
        text-align: right;
      }

      .lang-en {
        font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        direction: ltr;
        text-align: left;
      }

      /* RTL-specific adjustments */
      .dir-rtl {
        direction: rtl;
      }

      .dir-rtl .flex {
        flex-direction: row-reverse;
      }

      .dir-rtl .space-x-2 > * + * {
        margin-left: 0;
        margin-right: 0.5rem;
      }

      .dir-rtl .space-x-3 > * + * {
        margin-left: 0;
        margin-right: 0.75rem;
      }

      .dir-rtl .space-x-4 > * + * {
        margin-left: 0;
        margin-right: 1rem;
      }

      /* Center alignment for both languages */
      .center-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .center-content h1,
      .center-content h2,
      .center-content h3,
      .center-content h4,
      .center-content h5,
      .center-content h6 {
        text-align: center;
      }

      .center-content p {
        text-align: center;
      }

      /* Force center alignment for specific components */
      .force-center {
        text-align: center !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
      }

      /* Language consistency enforcement */
      [data-lang-enforced="true"] {
        transition: all 0.2s ease-in-out;
      }

      /* Hide mixed content during transition */
      .lang-transition {
        opacity: 0.7;
        transition: opacity 0.1s ease-in-out;
      }

      /* Ensure proper text direction for all text elements */
      .lang-ar * {
        direction: rtl;
        text-align: right;
      }

      .lang-en * {
        direction: ltr;
        text-align: left;
      }

      /* Override for centered content */
      .center-content *,
      .force-center * {
        text-align: center !important;
      }

      /* Fix for navigation and buttons */
      .lang-ar .flex-row {
        flex-direction: row-reverse;
      }

      .lang-ar .justify-between {
        flex-direction: row-reverse;
      }

      /* Ensure consistent spacing */
      .lang-ar .mr-2 {
        margin-right: 0;
        margin-left: 0.5rem;
      }

      .lang-ar .ml-2 {
        margin-left: 0;
        margin-right: 0.5rem;
      }
    `;
  }, [language, isRTL]);

  const value: LanguageConsistencyContextType = {
    enforceLanguageConsistency,
    fixMixedContent,
    validatePageLanguage,
  };

  return (
    <LanguageConsistencyContext.Provider value={value}>
      {children}
    </LanguageConsistencyContext.Provider>
  );
};

export const useLanguageConsistency = (): LanguageConsistencyContextType => {
  const context = useContext(LanguageConsistencyContext);
  if (context === undefined) {
    throw new Error('useLanguageConsistency must be used within a LanguageConsistencyProvider');
  }
  return context;
};

export default LanguageConsistencyProvider;

