export type Lang = 'ar' | 'en';

class LocaleDriver extends EventTarget {
  private currentLang: Lang = 'en';
  private cookieKey = 'aqlhr.lang';

  constructor() {
    super();
    this.initialize();
  }

  private initialize() {
    const resolved = this.resolveLang();
    this.setLang(resolved);
  }

  resolveLang(): Lang {
    // 1. Check URL path parameter (highest priority for route-based system)
    const pathLang = this.extractLangFromPath();
    if (pathLang) return pathLang;

    // 2. Check cookie
    const cookieLang = this.getCookie();
    if (cookieLang) return cookieLang;

    // 3. Check navigator languages
    const browserLang = this.getBrowserLang();
    if (browserLang) return browserLang;

    // 4. Default
    return 'en';
  }

  private extractLangFromPath(): Lang | null {
    const path = window.location.pathname;
    const match = path.match(/^\/([a-z]{2})\//);
    if (match) {
      const lang = match[1] as Lang;
      if (lang === 'ar' || lang === 'en') return lang;
    }
    return null;
  }

  private getCookie(): Lang | null {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${this.cookieKey}=`));
    
    if (cookie) {
      const value = cookie.split('=')[1] as Lang;
      if (value === 'ar' || value === 'en') return value;
    }
    return null;
  }

  private getBrowserLang(): Lang | null {
    const browserLangs = navigator.languages || [navigator.language];
    
    for (const browserLang of browserLangs) {
      const lang = browserLang.toLowerCase();
      if (lang.startsWith('ar')) return 'ar';
      if (lang.startsWith('en')) return 'en';
    }
    return null;
  }

  private setCookie(lang: Lang) {
    // Set cookie with 1 year expiry
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${this.cookieKey}=${lang}; expires=${expires.toUTCString()}; path=/`;
  }

  setLang(lang: Lang) {
    console.log('[LocaleDriver] Setting language:', lang, 'Current:', this.currentLang);
    if (lang === this.currentLang) return;
    
    this.currentLang = lang;
    this.setCookie(lang);
    this.updateDocument();
    
    // Dispatch change event
    this.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    console.log('[LocaleDriver] Language set to:', lang, 'Document dir:', document.documentElement.dir);
  }

  private updateDocument() {
    console.log('[LocaleDriver] Updating document for lang:', this.currentLang);
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('rtl', this.currentLang === 'ar');
    
    // Update localStorage for compatibility with existing system
    localStorage.setItem('aqlhr.locale', this.currentLang);
    console.log('[LocaleDriver] Document updated - lang:', document.documentElement.lang, 'dir:', document.documentElement.dir);
  }

  getLang(): Lang {
    return this.currentLang;
  }

  isRTL(): boolean {
    return this.currentLang === 'ar';
  }

  // Convenience method for components
  onLangChange(callback: (lang: Lang) => void): () => void {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ lang: Lang }>;
      callback(customEvent.detail.lang);
    };
    
    this.addEventListener('langchange', handler);
    
    // Return cleanup function
    return () => this.removeEventListener('langchange', handler);
  }
}

// Export singleton instance
export const localeDriver = new LocaleDriver();

// Utility functions
export const getCurrentLang = (): Lang => localeDriver.getLang();
export const setCurrentLang = (lang: Lang) => localeDriver.setLang(lang);
export const isRTL = (): boolean => localeDriver.isRTL();