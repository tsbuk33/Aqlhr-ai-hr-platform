import React from 'react';
import { Link, LinkProps, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentLang, Lang } from './localeDriver';

interface LinkLProps extends Omit<LinkProps, 'to'> {
  to: string;
  lang?: Lang;
}

/**
 * Locale-aware Link component that automatically prepends language prefix to routes
 */
export const LinkL: React.FC<LinkLProps> = ({ to, lang, ...props }) => {
  const currentLang = lang || getCurrentLang();
  
  // Convert relative paths to include language prefix
  const localizedTo = to.startsWith('/') && !to.match(/^\/(en|ar)\//)
    ? `/${currentLang}${to}`
    : to;

  return <Link to={localizedTo} {...props} />;
};

/**
 * Hook that provides locale-aware navigation functions
 */
export const useLocalePath = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = getCurrentLang();

  const navigateL = (to: string, options?: { replace?: boolean; state?: any; lang?: Lang }) => {
    const targetLang = options?.lang || currentLang;
    
    // Convert relative paths to include language prefix
    const localizedTo = to.startsWith('/') && !to.match(/^\/(en|ar)\//)
      ? `/${targetLang}${to}`
      : to;

    navigate(localizedTo, {
      replace: options?.replace,
      state: options?.state
    });
  };

  const getCurrentPath = () => {
    return location.pathname.replace(/^\/(en|ar)/, '');
  };

  const switchLanguage = (newLang: Lang) => {
    const currentPath = getCurrentPath();
    const search = location.search;
    navigate(`/${newLang}${currentPath}${search}`, { replace: true });
  };

  return {
    navigate: navigateL,
    getCurrentPath,
    switchLanguage,
    currentLang
  };
};

/**
 * Get current path without language prefix
 */
export const usePathWithoutLang = (): string => {
  const location = useLocation();
  return location.pathname.replace(/^\/(en|ar)/, '') || '/';
};