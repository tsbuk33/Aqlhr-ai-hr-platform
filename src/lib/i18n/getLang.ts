export function getLang() {
  const url = new URL(window.location.href);
  const qp = url.searchParams.get('lang');
  const ls = localStorage.getItem('aqlhr.lang');
  const lang = (qp || ls || 'en').toLowerCase();
  // persist and normalize
  localStorage.setItem('aqlhr.lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  return lang;
}