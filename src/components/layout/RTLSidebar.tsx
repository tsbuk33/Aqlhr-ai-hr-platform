/**
 * AQLHR Platform - Expert-Level RTL Sidebar Component
 * Professional Arabic/English Sidebar with Perfect RTL Support
 * @author AQLHR Development Team
 * @version 3.0.0
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';

interface RTLSidebarProps {
  children: React.ReactNode;
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const RTLSidebar: React.FC<RTLSidebarProps> = ({
  children,
  className,
  isCollapsed = false,
  onToggle
}) => {
  const { isRTL, t } = useLanguage();

  return (
    <aside
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        // Base styles
        'flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out',
        
        // RTL-specific positioning
        isRTL ? 'border-l border-gray-700' : 'border-r border-gray-700',
        
        // Width management
        isCollapsed ? 'w-16' : 'w-64',
        
        // RTL text alignment
        isRTL ? 'text-right' : 'text-left',
        
        // Custom classes
        className
      )}
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: isRTL ? 'right' : 'left'
      }}
    >
      <div className={cn(
        'flex items-center justify-between p-4 border-b border-gray-700',
        isRTL ? 'flex-row-reverse' : 'flex-row'
      )}>
        {!isCollapsed && (
          <div className={cn(
            'flex items-center space-x-3',
            isRTL ? 'space-x-reverse' : ''
          )}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className={cn(
                'text-xl font-bold',
                isRTL ? 'font-cairo' : 'font-sans'
              )}>
                {t('nav.aqlhr') || 'عقل HR'}
              </h1>
              <p className="text-xs text-gray-400">
                {t('nav.subtitle') || 'منصة الموارد البشرية الذكية'}
              </p>
            </div>
          </div>
        )}
        
        {onToggle && (
          <button
            onClick={onToggle}
            className={cn(
              'p-2 rounded-lg hover:bg-gray-800 transition-colors',
              isCollapsed ? 'mx-auto' : ''
            )}
            aria-label={t('nav.toggleSidebar') || 'تبديل الشريط الجانبي'}
          >
            <svg
              className={cn(
                'w-5 h-5 transition-transform',
                isRTL && !isCollapsed ? 'rotate-180' : ''
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
              />
            </svg>
          </button>
        )}
      </div>

      <div className={cn(
        'flex-1 overflow-y-auto',
        isRTL ? 'scrollbar-rtl' : 'scrollbar-ltr'
      )}>
        <nav className="p-4 space-y-2">
          {children}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className={cn(
        'p-4 border-t border-gray-700',
        isRTL ? 'text-right' : 'text-left'
      )}>
        {!isCollapsed && (
          <div className="text-xs text-gray-400">
            <p>{t('nav.version') || 'الإصدار'} 3.0.0</p>
            <p>{t('nav.allRightsReserved') || 'جميع الحقوق محفوظة'}</p>
          </div>
        )}
      </div>
    </aside>
  );
};

// RTL Navigation Item Component
interface RTLNavItemProps {
  icon?: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  href?: string;
  badge?: string | number;
  children?: React.ReactNode;
}

export const RTLNavItem: React.FC<RTLNavItemProps> = ({
  icon,
  label,
  isActive = false,
  isCollapsed = false,
  onClick,
  href,
  badge,
  children
}) => {
  const { isRTL, t } = useLanguage();

  const content = (
    <div
      className={cn(
        // Base styles
        'flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer group',
        
        // RTL layout
        isRTL ? 'flex-row-reverse' : 'flex-row',
        
        // Active state
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        
        // Collapsed state
        isCollapsed ? 'justify-center' : 'justify-between'
      )}
      onClick={onClick}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className={cn(
        'flex items-center',
        isRTL ? 'flex-row-reverse' : 'flex-row',
        isCollapsed ? '' : isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'
      )}>
        {icon && (
          <div className={cn(
            'flex-shrink-0 w-5 h-5',
            isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
          )}>
            {icon}
          </div>
        )}
        
        {!isCollapsed && (
          <span className={cn(
            'font-medium transition-colors',
            isRTL ? 'font-cairo text-right' : 'font-sans text-left'
          )}>
            {label}
          </span>
        )}
      </div>

      {!isCollapsed && badge && (
        <span className={cn(
          'px-2 py-1 text-xs rounded-full',
          isActive
            ? 'bg-white text-blue-600'
            : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
        )}>
          {badge}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return (
    <div>
      {content}
      {children && !isCollapsed && (
        <div className={cn(
          'ml-8 mt-2 space-y-1',
          isRTL ? 'mr-8 ml-0' : 'ml-8'
        )}>
          {children}
        </div>
      )}
    </div>
  );
};

// RTL Language Switcher Component
export const RTLLanguageSwitcher: React.FC<{ isCollapsed?: boolean }> = ({ 
  isCollapsed = false 
}) => {
  const { language, setLanguage, isRTL, t } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
      className={cn(
        'flex items-center p-3 rounded-lg transition-all duration-200',
        'text-gray-300 hover:bg-gray-800 hover:text-white',
        isRTL ? 'flex-row-reverse' : 'flex-row',
        isCollapsed ? 'justify-center' : 'justify-between w-full'
      )}
      title={t('nav.switchLanguage') || 'تبديل اللغة'}
    >
      <div className={cn(
        'flex items-center',
        isRTL ? 'flex-row-reverse' : 'flex-row',
        isCollapsed ? '' : isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'
      )}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        
        {!isCollapsed && (
          <span className="font-medium">
            {language === 'ar' ? 'English' : 'العربية'}
          </span>
        )}
      </div>

      {!isCollapsed && (
        <div className={cn(
          'w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center',
          'transition-colors group-hover:border-gray-400'
        )}>
          <div className={cn(
            'w-2 h-2 rounded-full transition-colors',
            language === 'ar' ? 'bg-green-500' : 'bg-blue-500'
          )} />
        </div>
      )}
    </button>
  );
};

export default RTLSidebar;

