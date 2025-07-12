import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, Globe, Calendar, DollarSign, Palette, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserPreferences {
  language: 'ar' | 'en';
  currency: 'SAR' | 'USD' | 'EUR';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  theme: 'light' | 'dark' | 'system';
  hijriCalendar: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
  };
  culturalSettings: {
    prayerTimes: boolean;
    islamicHolidays: boolean;
    saudiWorkWeek: boolean;
  };
}

const defaultPreferences: UserPreferences = {
  language: 'ar',
  currency: 'SAR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  theme: 'system',
  hijriCalendar: true,
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false
  },
  culturalSettings: {
    prayerTimes: true,
    islamicHolidays: true,
    saudiWorkWeek: true
  }
};

export const UserPreferences = () => {
  const { language, setLanguage } = useLanguage();
  const isRTL = language === 'ar';
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load saved preferences from localStorage
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved preferences:', error);
      }
    }
  }, []);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateNestedPreference = <
    K extends keyof UserPreferences,
    NK extends keyof NonNullable<UserPreferences[K]>
  >(
    key: K,
    nestedKey: NK,
    value: UserPreferences[K] extends object ? UserPreferences[K][NK] : never
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: { 
        ...(prev[key] as object), 
        [nestedKey]: value 
      }
    }));
    setHasChanges(true);
  };

  const savePreferences = () => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Apply language change
      if (preferences.language !== language) {
        setLanguage(preferences.language);
      }

      // Apply accessibility settings
      document.documentElement.classList.toggle('high-contrast', preferences.accessibility.highContrast);
      document.documentElement.classList.toggle('large-text', preferences.accessibility.largeText);
      document.documentElement.classList.toggle('reduced-motion', preferences.accessibility.reducedMotion);

      // Apply theme
      if (preferences.theme !== 'system') {
        document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
      }

      setHasChanges(false);
      toast({
        title: isRTL ? "تم حفظ الإعدادات" : "Preferences Saved",
        description: isRTL ? "تم تطبيق التغييرات بنجاح" : "Your changes have been applied successfully"
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast({
        title: isRTL ? "خطأ في الحفظ" : "Save Error",
        description: isRTL ? "فشل في حفظ الإعدادات" : "Failed to save preferences",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {isRTL ? 'إعدادات المستخدم' : 'User Preferences'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 'تخصيص تجربتك حسب احتياجاتك الثقافية واللغوية' : 'Customize your experience for cultural and language needs'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Language & Region */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {isRTL ? 'اللغة والمنطقة' : 'Language & Region'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{isRTL ? 'اللغة' : 'Language'}</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value: 'ar' | 'en') => updatePreference('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية (Arabic)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{isRTL ? 'العملة' : 'Currency'}</Label>
                <Select
                  value={preferences.currency}
                  onValueChange={(value: 'SAR' | 'USD' | 'EUR') => updatePreference('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{isRTL ? 'تنسيق التاريخ' : 'Date Format'}</Label>
                <Select
                  value={preferences.dateFormat}
                  onValueChange={(value: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD') => 
                    updatePreference('dateFormat', value)}
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
                <Label>{isRTL ? 'تنسيق الوقت' : 'Time Format'}</Label>
                <Select
                  value={preferences.timeFormat}
                  onValueChange={(value: '12h' | '24h') => updatePreference('timeFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 {isRTL ? 'ساعة' : 'Hour'}</SelectItem>
                    <SelectItem value="24h">24 {isRTL ? 'ساعة' : 'Hour'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{isRTL ? 'التقويم الهجري' : 'Hijri Calendar'}</Label>
                <p className="text-sm text-muted-foreground">
                  {isRTL ? 'عرض التواريخ الهجرية مع الميلادية' : 'Show Hijri dates alongside Gregorian'}
                </p>
              </div>
              <Switch
                checked={preferences.hijriCalendar}
                onCheckedChange={(checked) => updatePreference('hijriCalendar', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Cultural Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {isRTL ? 'الإعدادات الثقافية' : 'Cultural Settings'}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{isRTL ? 'أوقات الصلاة' : 'Prayer Times'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'عرض أوقات الصلاة في التطبيق' : 'Display prayer times in the app'}
                  </p>
                </div>
                <Switch
                  checked={preferences.culturalSettings.prayerTimes}
                  onCheckedChange={(checked) => 
                    updateNestedPreference('culturalSettings', 'prayerTimes', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{isRTL ? 'الإجازات الإسلامية' : 'Islamic Holidays'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تطبيق الإجازات الإسلامية تلقائياً' : 'Automatically apply Islamic holidays'}
                  </p>
                </div>
                <Switch
                  checked={preferences.culturalSettings.islamicHolidays}
                  onCheckedChange={(checked) => 
                    updateNestedPreference('culturalSettings', 'islamicHolidays', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{isRTL ? 'أسبوع العمل السعودي' : 'Saudi Work Week'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'الأحد إلى الخميس كأسبوع عمل' : 'Sunday to Thursday as work week'}
                  </p>
                </div>
                <Switch
                  checked={preferences.culturalSettings.saudiWorkWeek}
                  onCheckedChange={(checked) => 
                    updateNestedPreference('culturalSettings', 'saudiWorkWeek', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {isRTL ? 'المظهر' : 'Appearance'}
            </h3>

            <div className="space-y-2">
              <Label>{isRTL ? 'السمة' : 'Theme'}</Label>
              <Select
                value={preferences.theme}
                onValueChange={(value: 'light' | 'dark' | 'system') => updatePreference('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{isRTL ? 'فاتح' : 'Light'}</SelectItem>
                  <SelectItem value="dark">{isRTL ? 'داكن' : 'Dark'}</SelectItem>
                  <SelectItem value="system">{isRTL ? 'النظام' : 'System'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {isRTL ? 'الإشعارات' : 'Notifications'}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{isRTL ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}</Label>
                <Switch
                  checked={preferences.notifications.email}
                  onCheckedChange={(checked) => 
                    updateNestedPreference('notifications', 'email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>{isRTL ? 'الإشعارات الفورية' : 'Push Notifications'}</Label>
                <Switch
                  checked={preferences.notifications.push}
                  onCheckedChange={(checked) => 
                    updateNestedPreference('notifications', 'push', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>{isRTL ? 'إشعارات SMS' : 'SMS Notifications'}</Label>
                <Switch
                  checked={preferences.notifications.sms}
                  onCheckedChange={(checked) => 
                    updateNestedPreference('notifications', 'sms', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Accessibility */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {isRTL ? 'إمكانية الوصول' : 'Accessibility'}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{isRTL ? 'تباين عالي' : 'High Contrast'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'زيادة التباين للرؤية الأفضل' : 'Increase contrast for better visibility'}
                  </p>
                </div>
                <Switch
                  checked={preferences.accessibility.highContrast}
                  onCheckedChange={(checked) => 
                    updateNestedPreference('accessibility', 'highContrast', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{isRTL ? 'نص كبير' : 'Large Text'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'زيادة حجم النص' : 'Increase text size'}
                  </p>
                </div>
                <Switch
                  checked={preferences.accessibility.largeText}
                  onCheckedChange={(checked) => 
                    updateNestedPreference('accessibility', 'largeText', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{isRTL ? 'تقليل الحركة' : 'Reduced Motion'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {isRTL ? 'تقليل الرسوم المتحركة' : 'Reduce animations and transitions'}
                  </p>
                </div>
                <Switch
                  checked={preferences.accessibility.reducedMotion}
                  onCheckedChange={(checked) => 
                    updateNestedPreference('accessibility', 'reducedMotion', checked)}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6">
            <Button 
              onClick={savePreferences} 
              disabled={!hasChanges}
              className="w-full gap-2"
            >
              <Save className="h-4 w-4" />
              {isRTL ? 'حفظ الإعدادات' : 'Save Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};