import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';
import { getLang } from '@/lib/i18n/getLang';
import {
  Globe,
  Calendar,
  Hash,
  Clock,
  DollarSign,
  Settings,
  Save,
  RefreshCw,
  Languages,
  MapPin
} from 'lucide-react';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

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

const Localization = () => {
  const { lang } = useParams();
  const isArabic = lang === 'ar';
  const { companyId } = useUserCompany();
  const { toast } = useToast();

  const [preferences, setPreferences] = useState<LocalizationPrefs>({
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Available modules for calendar preferences
  const modules = [
    { key: 'hr', name: 'Human Resources', nameAr: 'الموارد البشرية' },
    { key: 'payroll', name: 'Payroll', nameAr: 'الرواتب' },
    { key: 'performance', name: 'Performance', nameAr: 'الأداء' },
    { key: 'compliance', name: 'Compliance', nameAr: 'الامتثال' },
    { key: 'reporting', name: 'Reporting', nameAr: 'التقارير' },
    { key: 'analytics', name: 'Analytics', nameAr: 'التحليلات' }
  ];

  // Translation helper
  const t = (key: string) => {
    const translations: Record<string, any> = {
      'title': isArabic ? 'إعدادات التعريب والتنسيق' : 'Localization & Format Policy',
      'description': isArabic ? 'تكوين اللغة الافتراضية والأرقام والتقويم لكل وحدة' : 'Configure default language, numerals, and calendar preferences per module',
      'language_settings': isArabic ? 'إعدادات اللغة' : 'Language Settings',
      'format_settings': isArabic ? 'إعدادات التنسيق' : 'Format Settings',
      'calendar_settings': isArabic ? 'إعدادات التقويم' : 'Calendar Settings',
      'advanced_settings': isArabic ? 'إعدادات متقدمة' : 'Advanced Settings',
      'default_language': isArabic ? 'اللغة الافتراضية' : 'Default Language',
      'numeral_system': isArabic ? 'نظام الأرقام' : 'Numeral System',
      'default_calendar': isArabic ? 'التقويم الافتراضي' : 'Default Calendar',
      'module_calendar_prefs': isArabic ? 'تفضيلات التقويم لكل وحدة' : 'Module Calendar Preferences',
      'date_format': isArabic ? 'تنسيق التاريخ' : 'Date Format',
      'time_format': isArabic ? 'تنسيق الوقت' : 'Time Format',
      'currency_format': isArabic ? 'تنسيق العملة' : 'Currency Format',
      'number_format': isArabic ? 'تنسيق الأرقام' : 'Number Format',
      'timezone': isArabic ? 'المنطقة الزمنية' : 'Timezone',
      'save_changes': isArabic ? 'حفظ التغييرات' : 'Save Changes',
      'reset_defaults': isArabic ? 'إعادة تعيين الافتراضات' : 'Reset to Defaults',
      'arabic': isArabic ? 'العربية' : 'Arabic',
      'english': isArabic ? 'الإنجليزية' : 'English',
      'western': isArabic ? 'أرقام غربية (1, 2, 3)' : 'Western Numerals (1, 2, 3)',
      'arabic_indic': isArabic ? 'أرقام هندية عربية (٠، ١، ٢)' : 'Arabic-Indic Numerals (٠، ١، ٢)',
      'gregorian': isArabic ? 'التقويم الميلادي' : 'Gregorian Calendar',
      'hijri': isArabic ? 'التقويم الهجري' : 'Hijri Calendar',
      '12h': isArabic ? '12 ساعة (صباحاً/مساءً)' : '12-hour (AM/PM)',
      '24h': isArabic ? '24 ساعة' : '24-hour',
      'decimal_separator': isArabic ? 'فاصل الكسور العشرية' : 'Decimal Separator',
      'thousands_separator': isArabic ? 'فاصل الآلاف' : 'Thousands Separator',
      'currency_symbol': isArabic ? 'رمز العملة' : 'Currency Symbol',
      'preview': isArabic ? 'معاينة' : 'Preview',
      'number_example': isArabic ? 'مثال الرقم' : 'Number Example',
      'date_example': isArabic ? 'مثال التاريخ' : 'Date Example',
      'currency_example': isArabic ? 'مثال العملة' : 'Currency Example'
    };
    return translations[key] || key;
  };

  // Load preferences
  useEffect(() => {
    if (companyId) {
      loadPreferences();
    }
  }, [companyId]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase.rpc('get_tenant_localization_prefs' as any, {
        p_tenant_id: companyId
      });

      if (error) throw error;

      if (data && (data as any[]).length > 0) {
        const dataArray = data as any[];
        setPreferences({
          default_language: dataArray[0].default_language,
          numeral_system: dataArray[0].numeral_system,
          default_calendar: dataArray[0].default_calendar,
          module_calendar_prefs: (dataArray[0].module_calendar_prefs as Record<string, string>) || {},
          date_format: dataArray[0].date_format,
          time_format: dataArray[0].time_format,
          currency_symbol: dataArray[0].currency_symbol,
          decimal_separator: dataArray[0].decimal_separator,
          thousands_separator: dataArray[0].thousands_separator,
          timezone: dataArray[0].timezone
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load localization preferences',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.rpc('update_localization_prefs' as any, {
        p_tenant_id: companyId,
        p_preferences: preferences as any
      });

      if (error) throw error;

      toast({
        title: t('save_changes'),
        description: 'Localization preferences updated successfully'
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save localization preferences',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
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
  };

  const updateModuleCalendar = (moduleKey: string, calendar: string) => {
    setPreferences(prev => ({
      ...prev,
      module_calendar_prefs: {
        ...prev.module_calendar_prefs,
        [moduleKey]: calendar
      }
    }));
  };

  // Generate preview examples
  const generateNumberExample = () => {
    const number = 1234567.89;
    const formatted = preferences.numeral_system === 'arabic_indic'
      ? number.toLocaleString('ar-SA')
      : number.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
    return formatted;
  };

  const generateDateExample = () => {
    const today = new Date();
    if (preferences.default_calendar === 'hijri') {
      return today.toLocaleDateString('ar-SA-u-ca-islamic');
    }
    return today.toLocaleDateString(
      preferences.default_language === 'ar' ? 'ar-SA' : 'en-GB'
    );
  };

  const generateCurrencyExample = () => {
    const amount = 1500.50;
    return `${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ${preferences.currency_symbol}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-6 ${isArabic ? 'rtl' : 'ltr'}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Globe className="h-8 w-8" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="language" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="language">
                <Languages className="h-4 w-4 mr-2" />
                Language
              </TabsTrigger>
              <TabsTrigger value="format">
                <Hash className="h-4 w-4 mr-2" />
                Format
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <Settings className="h-4 w-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="language" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('language_settings')}</CardTitle>
                  <CardDescription>
                    Configure the default language and numeral system for your organization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('default_language')}</label>
                    <Select
                      value={preferences.default_language}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, default_language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">{t('english')}</SelectItem>
                        <SelectItem value="ar">{t('arabic')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('numeral_system')}</label>
                    <Select
                      value={preferences.numeral_system}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, numeral_system: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="western">{t('western')}</SelectItem>
                        <SelectItem value="arabic_indic">{t('arabic_indic')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="format" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('format_settings')}</CardTitle>
                  <CardDescription>
                    Configure date, time, and number formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('date_format')}</label>
                      <Select
                        value={preferences.date_format}
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, date_format: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('time_format')}</label>
                      <Select
                        value={preferences.time_format}
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, time_format: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">{t('24h')}</SelectItem>
                          <SelectItem value="12h">{t('12h')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('decimal_separator')}</label>
                      <Select
                        value={preferences.decimal_separator}
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, decimal_separator: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=".">. (dot)</SelectItem>
                          <SelectItem value=",">, (comma)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('thousands_separator')}</label>
                      <Select
                        value={preferences.thousands_separator}
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, thousands_separator: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=",">, (comma)</SelectItem>
                          <SelectItem value=" ">  (space)</SelectItem>
                          <SelectItem value="">(none)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('currency_symbol')}</label>
                      <Select
                        value={preferences.currency_symbol}
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, currency_symbol: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAR">SAR</SelectItem>
                          <SelectItem value="ر.س">ر.س</SelectItem>
                          <SelectItem value="SR">SR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('calendar_settings')}</CardTitle>
                  <CardDescription>
                    Configure calendar preferences globally and per module
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('default_calendar')}</label>
                    <Select
                      value={preferences.default_calendar}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, default_calendar: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gregorian">{t('gregorian')}</SelectItem>
                        <SelectItem value="hijri">{t('hijri')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">{t('module_calendar_prefs')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {modules.map((module) => (
                        <div key={module.key} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm font-medium">
                            {isArabic ? module.nameAr : module.name}
                          </span>
                          <Select
                            value={preferences.module_calendar_prefs[module.key] || preferences.default_calendar}
                            onValueChange={(value) => updateModuleCalendar(module.key, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gregorian">{t('gregorian')}</SelectItem>
                              <SelectItem value="hijri">{t('hijri')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('advanced_settings')}</CardTitle>
                  <CardDescription>
                    Configure timezone and other advanced localization options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t('timezone')}
                    </label>
                    <Select
                      value={preferences.timezone}
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Riyadh">Asia/Riyadh (UTC+3)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="Asia/Dubai">Asia/Dubai (UTC+4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                {t('preview')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">{t('number_example')}</div>
                  <div className="text-lg">{generateNumberExample()}</div>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">{t('date_example')}</div>
                  <div className="text-lg">{generateDateExample()}</div>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">{t('currency_example')}</div>
                  <div className="text-lg">{generateCurrencyExample()}</div>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">Language Direction</div>
                  <div className="text-lg">
                    <Badge variant={preferences.default_language === 'ar' ? 'default' : 'secondary'}>
                      {preferences.default_language === 'ar' ? 'RTL' : 'LTR'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Button
                  onClick={savePreferences}
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {t('save_changes')}
                </Button>

                <Button
                  variant="outline"
                  onClick={resetToDefaults}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('reset_defaults')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="localization-settings" 
        companyId="demo-company" 
        enabledFeatures={['localization-management', 'multi-language', 'regional-settings', 'format-configuration']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="admin.localization" 
        companyId="demo-company"
      />
    </div>
  );
};

export default Localization;