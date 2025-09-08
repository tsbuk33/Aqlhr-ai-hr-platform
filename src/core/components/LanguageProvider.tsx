/**
 * Comprehensive Language Provider for AQLHR Platform
 * Handles all language switching, RTL/LTR layouts, and translations
 * 
 * @version 2.0.0
 * @author Expert Developer Team
 * @date 2025-09-08
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { languageManager, Language, t, useLanguage } from '../i18n/unified-translation-system';

// Language Context Interface
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  direction: 'rtl' | 'ltr';
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  formatDateTime: (date: Date) => string;
}

// Create Language Context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language Provider Props
interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

// Language Provider Component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  defaultLanguage = 'ar' 
}) => {
  const {
    language,
    setLanguage,
    t,
    isRTL,
    direction,
    formatNumber,
    formatCurrency,
    formatDate,
    formatDateTime
  } = useLanguage();

  // Initialize language on mount
  useEffect(() => {
    if (defaultLanguage && language !== defaultLanguage) {
      setLanguage(defaultLanguage);
    }
  }, [defaultLanguage, language, setLanguage]);

  // Apply language-specific styles to document
  useEffect(() => {
    const applyLanguageStyles = () => {
      // Apply language class to body
      document.body.className = `${language}-language ${direction}-layout`;
      
      // Apply direction to html element
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
      
      // Apply font family based on language
      if (language === 'ar') {
        document.body.style.fontFamily = "'Cairo', 'Amiri', 'Noto Sans Arabic', sans-serif";
      } else {
        document.body.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      }
      
      // Force center alignment for all content
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.classList.add('center-content');
      }
      
      // Apply center alignment to all page content
      const pageElements = document.querySelectorAll('.page-content, .component-center');
      pageElements.forEach(element => {
        element.classList.add('center-content');
      });
    };

    applyLanguageStyles();
  }, [language, direction]);

  // Context value
  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL,
    direction,
    formatNumber,
    formatCurrency,
    formatDate,
    formatDateTime
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};

// Language Switcher Component
interface LanguageSwitcherProps {
  className?: string;
  showLabels?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '', 
  showLabels = true 
}) => {
  const { language, setLanguage, t } = useLanguageContext();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    
    // Force page refresh to ensure all components update
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className={`language-switcher ${className}`}>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <button
          onClick={() => handleLanguageChange('ar')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            language === 'ar'
              ? 'bg-primary-color text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          aria-label={t('common.switchToArabic')}
        >
          {showLabels ? 'العربية' : 'ع'}
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            language === 'en'
              ? 'bg-primary-color text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          aria-label={t('common.switchToEnglish')}
        >
          {showLabels ? 'English' : 'En'}
        </button>
      </div>
    </div>
  );
};

// Text Component with automatic translation
interface TextProps {
  children: string;
  params?: Record<string, string | number>;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  params, 
  className = '', 
  as: Component = 'span' 
}) => {
  const { t } = useLanguageContext();
  
  return (
    <Component className={`${className} text-center`}>
      {t(children, params)}
    </Component>
  );
};

// Heading Component with automatic translation
interface HeadingProps {
  children: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  params?: Record<string, string | number>;
}

export const Heading: React.FC<HeadingProps> = ({ 
  children, 
  level = 1, 
  className = '', 
  params 
}) => {
  const { t } = useLanguageContext();
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Component className={`${className} text-center font-semibold`}>
      {t(children, params)}
    </Component>
  );
};

// Button Component with automatic translation
interface ButtonProps {
  children: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  params?: Record<string, string | number>;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  params
}) => {
  const { t } = useLanguageContext();
  
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline'
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {t(children, params)}
    </button>
  );
};

// Form Label Component with automatic translation
interface LabelProps {
  children: string;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  params?: Record<string, string | number>;
}

export const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  required = false,
  className = '',
  params
}) => {
  const { t } = useLanguageContext();
  
  return (
    <label 
      htmlFor={htmlFor} 
      className={`form-label ${className}`}
    >
      {t(children, params)}
      {required && <span className="text-error-color ml-1">*</span>}
    </label>
  );
};

// Input Component with RTL support
interface InputProps {
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  id,
  name
}) => {
  const { t, isRTL } = useLanguageContext();
  
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder ? t(placeholder) : undefined}
      required={required}
      disabled={disabled}
      className={`form-control ${className}`}
      style={{ textAlign: isRTL ? 'right' : 'left' }}
      id={id}
      name={name}
    />
  );
};

// Select Component with RTL support
interface SelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  children,
  required = false,
  disabled = false,
  className = '',
  id,
  name
}) => {
  const { isRTL } = useLanguageContext();
  
  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`form-control ${className}`}
      style={{ textAlign: isRTL ? 'right' : 'left' }}
      id={id}
      name={name}
    >
      {children}
    </select>
  );
};

// Option Component with automatic translation
interface OptionProps {
  value: string;
  children: string;
  params?: Record<string, string | number>;
}

export const Option: React.FC<OptionProps> = ({ value, children, params }) => {
  const { t } = useLanguageContext();
  
  return (
    <option value={value}>
      {t(children, params)}
    </option>
  );
};

// Card Component with RTL support
interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  titleParams?: Record<string, string | number>;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  titleParams 
}) => {
  const { t } = useLanguageContext();
  
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <h3 className="card-title text-center">
            {t(title, titleParams)}
          </h3>
        </div>
      )}
      <div className="card-body center-content">
        {children}
      </div>
    </div>
  );
};

// Modal Component with RTL support
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  titleParams?: Record<string, string | number>;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  titleParams
}) => {
  const { t } = useLanguageContext();
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className={`modal ${className}`}>
        {title && (
          <div className="modal-header">
            <h2 className="modal-title text-center">
              {t(title, titleParams)}
            </h2>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              aria-label={t('common.close')}
            >
              ×
            </button>
          </div>
        )}
        <div className="modal-body center-content">
          {children}
        </div>
      </div>
    </>
  );
};

// Alert Component with automatic translation
interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  children: string;
  className?: string;
  params?: Record<string, string | number>;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  children,
  className = '',
  params
}) => {
  const { t } = useLanguageContext();
  
  return (
    <div className={`alert alert-${type} ${className} text-center`}>
      {t(children, params)}
    </div>
  );
};

// Badge Component with automatic translation
interface BadgeProps {
  children: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  outline?: boolean;
  className?: string;
  params?: Record<string, string | number>;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  outline = false,
  className = '',
  params
}) => {
  const { t } = useLanguageContext();
  
  const classes = `badge badge-${variant} ${outline ? 'badge-outline' : ''} ${className}`;
  
  return (
    <span className={classes}>
      {t(children, params)}
    </span>
  );
};

// Loading Component with automatic translation
interface LoadingProps {
  text?: string;
  className?: string;
  params?: Record<string, string | number>;
}

export const Loading: React.FC<LoadingProps> = ({
  text = 'common.loading',
  className = '',
  params
}) => {
  const { t } = useLanguageContext();
  
  return (
    <div className={`flex-center ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
      <span className="ml-2 text-secondary">{t(text, params)}</span>
    </div>
  );
};

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Language Provider Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="center-content p-8">
          <Alert type="error">
            error.operationFailed
          </Alert>
          <Button
            onClick={() => this.setState({ hasError: false })}
            variant="outline"
            className="mt-4"
          >
            common.refresh
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export all components and hooks
export {
  LanguageContext,
  useLanguageContext as useLanguage,
  languageManager,
  t
};

// Default export
export default LanguageProvider;

