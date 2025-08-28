import React from 'react';
import { useLanguage } from '@/hooks/useLanguageCompat';

export default function ImportCenter() {
  const { isRTL } = useLanguage();
  const strings = isRTL ? AR : EN;

  return (
    <div className="p-6 max-w-4xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {strings.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {strings.subtitle}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {strings.comingSoon}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {strings.description}
          </p>
        </div>
      </div>
    </div>
  );
}

const EN = {
  title: 'Import Center',
  subtitle: 'Centralized data import and integration hub for HR systems.',
  comingSoon: 'Coming Soon',
  description: 'Advanced data import capabilities with validation, mapping, and integration features will be available here.'
};

const AR = {
  title: 'مركز الاستيراد',
  subtitle: 'مركز استيراد البيانات والتكامل المركزي لأنظمة الموارد البشرية.',
  comingSoon: 'قريباً',
  description: 'ستتوفر هنا إمكانيات استيراد البيانات المتقدمة مع ميزات التحقق والربط والتكامل.'
};