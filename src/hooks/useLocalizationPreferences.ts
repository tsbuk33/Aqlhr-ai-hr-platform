import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from './useUserCompany';

interface LocalizationPrefs {
  default_language: string;
  numeral_system: string;
  default_calendar: string;
  module_calendar_prefs: Record<string, string>;
  date_format: string;
  time_format: string;
  currency_symbol: string;
  decimal_separator: string;
  thousands_separator: string;
  timezone: string;
}

export function useLocalizationPreferences() {
  const { companyId } = useUserCompany();
  const [preferences, setPreferences] = useState<LocalizationPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPreferences = async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_tenant_localization_prefs', {
        p_tenant_id: companyId
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setPreferences({
          default_language: data[0].default_language,
          numeral_system: data[0].numeral_system,
          default_calendar: data[0].default_calendar,
          module_calendar_prefs: (data[0].module_calendar_prefs as Record<string, string>) || {},
          date_format: data[0].date_format,
          time_format: data[0].time_format,
          currency_symbol: data[0].currency_symbol,
          decimal_separator: data[0].decimal_separator,
          thousands_separator: data[0].thousands_separator,
          timezone: data[0].timezone
        });
      } else {
        // Set default preferences if none exist
        setPreferences({
          default_language: 'en',
          numeral_system: 'western',
          default_calendar: 'gregorian',
          module_calendar_prefs: {},
          date_format: 'DD/MM/YYYY',
          time_format: '24h',
          currency_symbol: 'SAR',
          decimal_separator: '.',
          thousands_separator: ',',
          timezone: 'Asia/Riyadh'
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPrefs: Partial<LocalizationPrefs>) => {
    if (!companyId || !preferences) return;

    try {
      const updatedPrefs = { ...preferences, ...newPrefs };
      
      const { error } = await supabase.rpc('update_localization_prefs', {
        p_tenant_id: companyId,
        p_preferences: updatedPrefs as any
      });

      if (error) throw error;
      
      setPreferences(updatedPrefs);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      return false;
    }
  };

  const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
    if (!preferences) return num.toString();
    
    const locale = preferences.numeral_system === 'arabic_indic' ? 'ar-SA' : 'en-US';
    return num.toLocaleString(locale, options);
  };

  const formatCurrency = (amount: number) => {
    if (!preferences) return amount.toString();
    
    const formatted = formatNumber(amount, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return `${formatted} ${preferences.currency_symbol}`;
  };

  const formatDate = (date: Date, moduleKey?: string) => {
    if (!preferences) return date.toLocaleDateString();
    
    const calendarType = moduleKey 
      ? preferences.module_calendar_prefs[moduleKey] || preferences.default_calendar
      : preferences.default_calendar;
    
    const locale = preferences.default_language === 'ar' ? 'ar-SA' : 'en-GB';
    const options: Intl.DateTimeFormatOptions = {};
    
    if (calendarType === 'hijri') {
      options.calendar = 'islamic';
    }
    
    return date.toLocaleDateString(locale, options);
  };

  const getCalendarForModule = (moduleKey: string) => {
    if (!preferences) return 'gregorian';
    return preferences.module_calendar_prefs[moduleKey] || preferences.default_calendar;
  };

  useEffect(() => {
    loadPreferences();
  }, [companyId]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    formatNumber,
    formatCurrency,
    formatDate,
    getCalendarForModule,
    refresh: loadPreferences
  };
}