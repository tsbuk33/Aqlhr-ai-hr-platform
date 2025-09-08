/**
 * AQLHR Platform - Expert-Level RTL Main Layout Component
 * Professional Arabic/English Layout with Perfect RTL Support
 * @author AQLHR Development Team
 * @version 3.0.0
 */

import React, { useState } from 'react';
import { useRTLLanguage } from '@/contexts/RTLLanguageContext';
import { RTLSidebar, RTLNavItem, RTLLanguageSwitcher } from './RTLSidebar';
import { cn } from '@/lib/utils';

interface RTLMainLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export const RTLMainLayout: React.FC<RTLMainLayoutProps> = ({
  children,
  currentPage = 'dashboard'
}) => {
  const { direction, isArabic, t } = useRTLLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Navigation items with RTL support
  const navigationItems = [
    {
      id: 'dashboard',
      label: t('nav.dashboard', 'لوحة التحكم'),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
        </svg>
      ),
      href: '/dashboard'
    },
    {
      id: 'recruitment',
      label: t('nav.recruitment', 'التوظيف والإعداد'),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      href: '/core-hr/recruitment',
      badge: '14'
    },
    {
      id: 'employees',
      label: t('nav.employees', 'الموظفون'),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      href: '/core-hr/employees'
    },
    {
      id: 'payroll',
      label: t('nav.payroll', 'كشوف المرتبات'),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: '/core-hr/payroll'
    },
    {
      id: 'performance',
      label: t('nav.performance', 'إدارة الأداء'),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: '/core-hr/performance'
    },
    {
      id: 'training',
      label: t('nav.training', 'التدريب والتطوير'),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      href: '/core-hr/training'
    },
    {
      id: 'compliance',
      label: t('nav.compliance', 'الامتثال'),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      href: '/compliance',
      badge: '7'
    },
    {
      id: 'analytics',
      label: t('nav.analytics', 'التحليلات'),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/analytics'
    },
    {
      id: 'settings',
      label: t('nav.settings', 'الإعدادات'),
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: '/settings'
    }
  ];

  return (
    <div 
      dir={direction}
      className={cn(
        'min-h-screen bg-gray-50 flex',
        isArabic ? 'rtl' : 'ltr'
      )}
    >
      {/* RTL Sidebar */}
      <RTLSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="fixed inset-y-0 z-50"
        style={{
          [isArabic ? 'right' : 'left']: 0
        }}
      >
        {/* Navigation Items */}
        {navigationItems.map((item) => (
          <RTLNavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={currentPage === item.id}
            isCollapsed={sidebarCollapsed}
            href={item.href}
            badge={item.badge}
          />
        ))}

        {/* Language Switcher */}
        <div className="mt-8 pt-4 border-t border-gray-700">
          <RTLLanguageSwitcher isCollapsed={sidebarCollapsed} />
        </div>
      </RTLSidebar>

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64',
          isArabic ? (sidebarCollapsed ? 'mr-16 ml-0' : 'mr-64 ml-0') : ''
        )}
      >
        {/* Top Header */}
        <header className={cn(
          'bg-white shadow-sm border-b border-gray-200 px-6 py-4',
          isArabic ? 'text-right' : 'text-left'
        )}>
          <div className={cn(
            'flex items-center justify-between',
            isArabic ? 'flex-row-reverse' : 'flex-row'
          )}>
            {/* Page Title */}
            <div>
              <h1 className={cn(
                'text-2xl font-bold text-gray-900',
                isArabic ? 'font-cairo' : 'font-sans'
              )}>
                {navigationItems.find(item => item.id === currentPage)?.label || t('nav.dashboard', 'لوحة التحكم')}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {t('nav.welcome', 'مرحباً بك في منصة عقل للموارد البشرية')}
              </p>
            </div>

            {/* Header Actions */}
            <div className={cn(
              'flex items-center space-x-4',
              isArabic ? 'space-x-reverse' : ''
            )}>
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.5a6 6 0 0 1 9 9l-9-9zM13.5 13.5a6 6 0 0 1-9-9l9 9z" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className={cn(
                'flex items-center space-x-3',
                isArabic ? 'space-x-reverse' : ''
              )}>
                <div className={cn(
                  'text-sm',
                  isArabic ? 'text-right' : 'text-left'
                )}>
                  <p className="font-medium text-gray-900">
                    {t('user.name', 'أحمد الراشد')}
                  </p>
                  <p className="text-gray-600">
                    {t('user.role', 'مدير الموارد البشرية')}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">AR</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={cn(
          'p-6',
          isArabic ? 'text-right' : 'text-left'
        )}>
          <div dir={direction}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RTLMainLayout;

