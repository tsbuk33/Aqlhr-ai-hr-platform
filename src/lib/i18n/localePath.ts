// Locale helpers usable anywhere
export type Lang = 'en' | 'ar';

export const resolveLang = (): Lang => {
  // Cookie > path > browser
  const cookie = document.cookie.match(/(?:^|;\s*)aqlhr\.lang=(en|ar)/)?.[1] as Lang | undefined;
  const fromPath = location.pathname.split('/')[1];
  if (fromPath === 'en' || fromPath === 'ar') return fromPath;
  if (cookie === 'en' || cookie === 'ar') return cookie;
  const browser = (navigator.language || 'en').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  return browser as Lang;
};

export const setLang = (lang: Lang) => {
  document.cookie = `aqlhr.lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`;
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
};

export const localePath = (path: string, lang?: Lang) => {
  const l = lang ?? resolveLang();
  // normalize: strip leading slash if present
  const p = path.startsWith('/') ? path.slice(1) : path;
  return `/${l}/${p}`;
};