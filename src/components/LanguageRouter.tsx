import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocaleDriver } from './LocaleDriver';

interface LanguageRouterProps {
  children: React.ReactNode;
}

export const LanguageRouter: React.FC<LanguageRouterProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // CRITICAL: Fix language detection and persistence
  useEffect(() => {
    const detectAndSetLanguage = () => {
      const pathname = location.pathname;
      
      // Extract language from route
      const routeLanguage = pathname.startsWith('/ar') ? 'ar' : 
                           pathname.startsWith('/en') ? 'en' : null;
      
      if (routeLanguage) {
        setCurrentLanguage(routeLanguage);
        localStorage.setItem('aqlhr-language', routeLanguage);
        
        // Set HTML dir attribute immediately
        document.documentElement.dir = routeLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = routeLanguage;
        
        console.log(`Language set to: ${routeLanguage} from route: ${pathname}`);
      } else {
        const storedLanguage = localStorage.getItem('aqlhr-language') as 'en' | 'ar' || 'en';
        const redirectPath = `/${storedLanguage}${pathname}`;
        navigate(redirectPath, { replace: true });
        return;
      }
      
      setIsInitialized(true);
    };

    detectAndSetLanguage();
  }, [location.pathname, navigate]);

  // CRITICAL: Prevent language switching on /ar routes
  useEffect(() => {
    if (!isInitialized) return;
    
    const pathname = location.pathname;
    const expectedLanguage = pathname.startsWith('/ar') ? 'ar' : 'en';
    
    if (currentLanguage !== expectedLanguage) {
      console.warn(`Language mismatch detected. Route: ${pathname}, Current: ${currentLanguage}, Expected: ${expectedLanguage}`);
      setCurrentLanguage(expectedLanguage);
      document.documentElement.dir = expectedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = expectedLanguage;
    }
  }, [location.pathname, currentLanguage, isInitialized]);

  if (!isInitialized) {
    return <div className="loading-language">Loading...</div>;
  }

  return (
    <LocaleDriver language={currentLanguage}>
      {children}
    </LocaleDriver>
  );
};