/**
 * AqlHR Unified Locale System - Phase 1A
 * Consolidates all competing language systems into a single source of truth
 * Designed by HR platform expert with 35 years experience
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Lang = 'en' | 'ar';
export type Locale = Lang; // For compatibility

interface LocaleState {
  lang: Lang;
  isRTL: boolean;
  isLoading: boolean;
}

interface LocaleContextValue extends LocaleState {
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  isArabic: boolean; // Legacy compatibility
  language: Lang; // Legacy compatibility
}

/**
 * Unified Locale Driver - Single Source of Truth
 */
class UnifiedLocaleDriver extends EventTarget {
  private state: LocaleState = {
    lang: 'en',
    isRTL: false,
    isLoading: true
  };
  
  private listeners = new Set<(state: LocaleState) => void>();
  private cookieKey = 'aqlhr.lang';
  private initialized = false;

  constructor() {
    super();
    // Don't initialize in constructor to avoid SSR issues
  }

  /**
   * Initialize locale system - called once per app lifecycle
   */
  initialize(): void {
    if (this.initialized) return;
    console.log('[UnifiedLocale] Initializing...');
    
    const detected = this.detectLanguage();
    this.setState({ 
      lang: detected, 
      isRTL: detected === 'ar',
      isLoading: false 
    });
    
    this.updateDocument();
    this.initialized = true;
    console.log('[UnifiedLocale] Initialized with language:', detected);
  }

  /**
   * Detect language from URL then Cookie then Browser then Default
   */
  private detectLanguage(): Lang {
    // 1. URL path (highest priority for route-based system)
    const urlLang = this.extractLangFromURL();
    if (urlLang) {
      console.log('[UnifiedLocale] Language from URL:', urlLang);
      return urlLang;
    }

    // 2. Cookie
    const cookieLang = this.getCookieLang();
    if (cookieLang) {
      console.log('[UnifiedLocale] Language from cookie:', cookieLang);
      return cookieLang;
    }

    // 3. Browser language
    const browserLang = this.getBrowserLang();
    if (browserLang) {
      console.log('[UnifiedLocale] Language from browser:', browserLang);
      return browserLang;
    }

    // 4. Default
    console.log('[UnifiedLocale] Using default language: en');
    return 'en';
  }

  private extractLangFromURL(): Lang | null {
    const path = window.location.pathname;
    const match = path.match(/^\/([a-z]{2})\//);
    if (match) {
      const lang = match[1] as Lang;
      return (lang === 'ar' || lang === 'en') ? lang : null;
    }
    return null;
  }

  private getCookieLang(): Lang | null {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${this.cookieKey}=`));
    
    if (cookie) {
      const value = cookie.split('=')[1] as Lang;
      return (value === 'ar' || value === 'en') ? value : null;
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

  /**
   * Update internal state and notify listeners
   */
  private setState(newState: Partial<LocaleState>): void {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };
    
    // Only notify if state actually changed
    if (prevState.lang !== this.state.lang || 
        prevState.isRTL !== this.state.isRTL ||
        prevState.isLoading !== this.state.isLoading) {
      
      console.log('[UnifiedLocale] State changed:', prevState, 'to', this.state);
      this.notifyListeners();
      this.dispatchEvent(new CustomEvent('langchange', { 
        detail: this.state 
      }));
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('[UnifiedLocale] Listener error:', error);
      }
    });
  }

  /**
   * Update document attributes and styles
   */
  private updateDocument(): void {
    const { lang, isRTL } = this.state;
    
    console.log('[UnifiedLocale] Updating document:', { lang, isRTL });
    
    // Update document attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Update CSS classes for styling
    document.documentElement.classList.toggle('rtl', isRTL);
    document.documentElement.classList.toggle('ltr', !isRTL);
    document.documentElement.classList.toggle('arabic', lang === 'ar');
    document.documentElement.classList.toggle('english', lang === 'en');
    
    // Update localStorage for compatibility
    localStorage.setItem('aqlhr.locale', lang);
    
    // Set cookie with 1 year expiry
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${this.cookieKey}=${lang}; expires=${expires.toUTCString()}; path=/`;
    
    console.log('[UnifiedLocale] Document updated - lang:', document.documentElement.lang, 'dir:', document.documentElement.dir);
  }

  /**
   * Public API
   */
  setLang(lang: Lang): void {
    if (!this.initialized) {
      console.warn('[UnifiedLocale] Setting language before initialization');
      this.initialize();
    }
    
    if (lang === this.state.lang) return;
    
    console.log('[UnifiedLocale] Setting language:', lang);
    this.setState({ 
      lang, 
      isRTL: lang === 'ar' 
    });
    this.updateDocument();
  }

  getLang(): Lang {
    return this.state.lang;
  }

  getState(): LocaleState {
    return { ...this.state };
  }

  isRTL(): boolean {
    return this.state.isRTL;
  }

  toggleLang(): void {
    const newLang = this.state.lang === 'en' ? 'ar' : 'en';
    this.setLang(newLang);
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: LocaleState) => void): () => void {
    this.listeners.add(listener);
    
    // Immediately call with current state
    listener(this.state);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Route synchronization - call this when route changes
   */
  syncWithRoute(routeLang: string): void {
    if (routeLang === 'en' || routeLang === 'ar') {
      if (routeLang !== this.state.lang) {
        console.log('[UnifiedLocale] Syncing with route:', routeLang);
        this.setLang(routeLang as Lang);
      }
    }
  }
}

// Global singleton instance
export const unifiedLocaleDriver = new UnifiedLocaleDriver();

// React Context
const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Modern React Context Provider
 */
export const UnifiedLocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LocaleState>(() => unifiedLocaleDriver.getState());

  useEffect(() => {
    // Initialize driver
    unifiedLocaleDriver.initialize();
    
    // Subscribe to changes
    const unsubscribe = unifiedLocaleDriver.subscribe(setState);
    
    return unsubscribe;
  }, []);

  const setLang = useCallback((lang: Lang) => {
    unifiedLocaleDriver.setLang(lang);
  }, []);

  const toggleLang = useCallback(() => {
    unifiedLocaleDriver.toggleLang();
  }, []);

  const value: LocaleContextValue = {
    ...state,
    setLang,
    toggleLang,
    // Legacy compatibility
    isArabic: state.isRTL,
    language: state.lang,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
};

/**
 * Main hook for consuming locale state
 */
export const useUnifiedLocale = (): LocaleContextValue => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useUnifiedLocale must be used within UnifiedLocaleProvider');
  }
  return context;
};

// Legacy compatibility hooks
export const useLocale = useUnifiedLocale;
export const useSimpleLanguage = useUnifiedLocale;
export const useLanguage = useUnifiedLocale;

/**
 * Route synchronization hook
 */
export const useRouteLangSync = (routeLang: string | undefined) => {
  useEffect(() => {
    if (routeLang) {
      unifiedLocaleDriver.syncWithRoute(routeLang);
    }
  }, [routeLang]);
};

/**
 * Utility functions
 */
export const getCurrentLang = (): Lang => unifiedLocaleDriver.getLang();
export const setCurrentLang = (lang: Lang) => unifiedLocaleDriver.setLang(lang);
export const isRTL = (): boolean => unifiedLocaleDriver.isRTL();