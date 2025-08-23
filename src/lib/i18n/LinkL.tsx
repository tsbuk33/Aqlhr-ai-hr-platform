import React from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';
import { localePath } from './localePath';

type Props = Omit<LinkProps, 'to'> & { to: string; lang?: 'en'|'ar' };
export const LinkL: React.FC<Props> = ({ to, lang, ...rest }) => {
  const href = localePath(to, lang);
  return <Link to={href} {...rest} />;
};

// Optional helper: keep current path and switch language
export const useSwitchLang = () => {
  const loc = useLocation();
  return (lang: 'en'|'ar') => {
    const segments = loc.pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'ar') segments[1] = lang;
    else segments.splice(1, 0, lang);
    const next = segments.join('') ? segments.join('/') : `/${lang}`;
    return next + (loc.search || '');
  };
};
