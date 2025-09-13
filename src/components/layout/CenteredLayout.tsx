import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

interface CenteredLayoutProps {
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function CenteredLayout({ title, description, className = "", children }: CenteredLayoutProps = {}) {
  const { isRTL } = useUnifiedLocale();
  
  return (
    <main 
      role="main"
      className={`min-h-screen w-full flex flex-col items-center justify-start gap-10 px-4 py-10 text-foreground ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {title && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="w-full max-w-2xl">
        {children || <Outlet />}
      </div>
    </main>
  );
}