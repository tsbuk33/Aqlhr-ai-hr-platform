import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

interface CenteredLayoutProps {
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  variant?: 'page' | 'auth' | 'dashboard' | 'form';
}

export default function CenteredLayout({ 
  title, 
  description, 
  className = "", 
  children,
  maxWidth = 'lg',
  variant = 'page'
}: CenteredLayoutProps = {}) {
  const { isRTL } = useUnifiedLocale();
  
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      case '2xl': return 'max-w-6xl';
      case 'full': return 'max-w-full';
      default: return 'max-w-2xl';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'auth':
        return 'auth-container';
      case 'dashboard':
        return 'dashboard-container min-h-screen';
      case 'form':
        return 'center-layout form-container';
      default:
        return 'page-container';
    }
  };
  
  return (
    <main 
      role="main"
      className={`${getVariantClasses()} ${isRTL ? 'rtl-container' : 'ltr-container'} ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {title && (
        <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'} sm:text-center`}>
          <h1 className="text-3xl font-bold mb-2 text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground text-lg">{description}</p>}
        </div>
      )}
      <div className={`w-full ${getMaxWidthClass()} center-content`}>
        {children || <Outlet />}
      </div>
    </main>
  );
}