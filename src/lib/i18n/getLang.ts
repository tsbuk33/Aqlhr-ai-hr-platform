export function getLang() {
  const url = new URL(window.location.href);
  const qp = url.searchParams.get('lang');
  const ls = localStorage.getItem('aqlhr.locale');
  const lang = (qp || ls || 'en').toLowerCase();
  // persist and normalize
  localStorage.setItem('aqlhr.locale', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  return lang;
}