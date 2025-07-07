import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  isRTL: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary
const translations = {
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.core_hr': 'الموارد البشرية الأساسية',
    'nav.employees': 'الموظفون',
    'nav.payroll': 'كشف الرواتب',
    'nav.analytics': 'التحليلات',
    'nav.compliance': 'الامتثال والحوكمة',
    'nav.government': 'التكامل الحكومي',
    'nav.ai_features': 'مميزات الذكاء الاصطناعي',
    
    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.add': 'إضافة',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
    'common.import': 'استيراد',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'تم بنجاح',
    
    // Dashboard
    'dashboard.title': 'سند للموارد البشرية - لوحة التحكم',
    'dashboard.subtitle': 'النظام الأكثر تطوراً للموارد البشرية في المملكة العربية السعودية',
    'dashboard.total_employees': 'إجمالي الموظفين',
    'dashboard.active_employees': 'الموظفون النشطون',
    'dashboard.payroll_processed': 'الرواتب المعالجة',
    'dashboard.compliance_score': 'درجة الامتثال',
    
    // Employee Management
    'employees.title': 'إدارة الموظفين',
    'employees.add_employee': 'إضافة موظف جديد',
    'employees.employee_number': 'رقم الموظف',
    'employees.national_id': 'رقم الهوية الوطنية',
    'employees.first_name': 'الاسم الأول',
    'employees.last_name': 'اسم العائلة',
    'employees.email': 'البريد الإلكتروني',
    'employees.department': 'القسم',
    'employees.position': 'المنصب',
    'employees.salary': 'الراتب',
    'employees.hire_date': 'تاريخ التوظيف',
    'employees.status': 'الحالة',
    'employees.nationality': 'الجنسية',
    'employees.is_saudi': 'سعودي',
    
    // Compliance
    'compliance.title': 'الامتثال والحوكمة',
    'compliance.overall_score': 'الدرجة الإجمالية للامتثال',
    'compliance.saudi_labor_law': 'قانون العمل السعودي',
    'compliance.pdpl': 'قانون حماية البيانات الشخصية',
    'compliance.monitoring': 'المراقبة المستمرة',
    'compliance.alerts': 'التنبيهات',
    'compliance.audit_trails': 'سجل التدقيق',
    
    // Government Integration
    'gov.qiwa': 'منصة قوى',  
    'gov.gosi': 'التأمينات الاجتماعية',
    'gov.mudad': 'منصة مدد',
    'gov.absher': 'أبشر',
    'gov.status': 'الحالة',
    'gov.last_sync': 'آخر مزامنة',
    'gov.sync_now': 'مزامنة الآن',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.core_hr': 'Core HR',
    'nav.employees': 'Employees',
    'nav.payroll': 'Payroll',
    'nav.analytics': 'Analytics',
    'nav.compliance': 'Compliance & Governance',
    'nav.government': 'Government Integration',
    'nav.ai_features': 'AI Features',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Dashboard
    'dashboard.title': 'SanadHR - Dashboard',
    'dashboard.subtitle': 'Saudi Arabia\'s Most Advanced HR Management System',
    'dashboard.total_employees': 'Total Employees',
    'dashboard.active_employees': 'Active Employees',
    'dashboard.payroll_processed': 'Payroll Processed',
    'dashboard.compliance_score': 'Compliance Score',
    
    // Employee Management
    'employees.title': 'Employee Management',
    'employees.add_employee': 'Add New Employee',
    'employees.employee_number': 'Employee Number',
    'employees.national_id': 'National ID',
    'employees.first_name': 'First Name',
    'employees.last_name': 'Last Name',
    'employees.email': 'Email',
    'employees.department': 'Department',
    'employees.position': 'Position',
    'employees.salary': 'Salary',
    'employees.hire_date': 'Hire Date',
    'employees.status': 'Status',
    'employees.nationality': 'Nationality',
    'employees.is_saudi': 'Saudi',
    
    // Compliance
    'compliance.title': 'Compliance & Governance',
    'compliance.overall_score': 'Overall Compliance Score',
    'compliance.saudi_labor_law': 'Saudi Labor Law',
    'compliance.pdpl': 'Personal Data Protection Law',
    'compliance.monitoring': 'Continuous Monitoring',
    'compliance.alerts': 'Alerts',
    'compliance.audit_trails': 'Audit Trails',
    
    // Government Integration
    'gov.qiwa': 'Qiwa Platform',
    'gov.gosi': 'GOSI',
    'gov.mudad': 'Mudad Platform',
    'gov.absher': 'Absher',
    'gov.status': 'Status',
    'gov.last_sync': 'Last Sync',
    'gov.sync_now': 'Sync Now',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  useEffect(() => {
    // Apply direction to document
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    
    // Apply RTL-specific styling
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [direction, isRTL, language]);

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      direction,
      isRTL,
      toggleLanguage,
      setLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};