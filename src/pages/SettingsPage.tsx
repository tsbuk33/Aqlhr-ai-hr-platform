import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings, User, Bell, Shield, Globe, Database, Palette, Monitor } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const SettingsPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  const settingsCategories = [
    {
      title: isArabic ? 'الملف الشخصي' : 'Profile Settings',
      description: isArabic ? 'إدارة معلومات الملف الشخصي' : 'Manage your profile information',
      icon: User,
      badge: 'Personal',
      settings: [
        { label: isArabic ? 'تحديث الصورة الشخصية' : 'Update Profile Picture', enabled: true },
        { label: isArabic ? 'تغيير كلمة المرور' : 'Change Password', enabled: false },
        { label: isArabic ? 'المعلومات الشخصية' : 'Personal Information', enabled: true }
      ]
    },
    {
      title: isArabic ? 'الإشعارات' : 'Notifications',
      description: isArabic ? 'تخصيص إعدادات الإشعارات' : 'Customize notification preferences',
      icon: Bell,
      badge: 'Alerts',
      settings: [
        { label: isArabic ? 'إشعارات البريد الإلكتروني' : 'Email Notifications', enabled: true },
        { label: isArabic ? 'الإشعارات الفورية' : 'Push Notifications', enabled: true },
        { label: isArabic ? 'إشعارات التطبيق' : 'In-App Notifications', enabled: false }
      ]
    },
    {
      title: isArabic ? 'الأمان' : 'Security',
      description: isArabic ? 'إعدادات الأمان والخصوصية' : 'Security and privacy settings',
      icon: Shield,
      badge: 'Security',
      settings: [
        { label: isArabic ? 'المصادقة الثنائية' : 'Two-Factor Authentication', enabled: false },
        { label: isArabic ? 'تشفير البيانات' : 'Data Encryption', enabled: true },
        { label: isArabic ? 'تسجيل الدخول الآمن' : 'Secure Login', enabled: true }
      ]
    },
    {
      title: isArabic ? 'اللغة والمنطقة' : 'Language & Region',
      description: isArabic ? 'إعدادات اللغة والمنطقة الزمنية' : 'Language and timezone settings',
      icon: Globe,
      badge: 'Localization',
      settings: [
        { label: isArabic ? 'اللغة العربية' : 'Arabic Language', enabled: isArabic },
        { label: isArabic ? 'المنطقة الزمنية' : 'Timezone Settings', enabled: true },
        { label: isArabic ? 'تنسيق التاريخ' : 'Date Format', enabled: true }
      ]
    },
    {
      title: isArabic ? 'قاعدة البيانات' : 'Database',
      description: isArabic ? 'إعدادات قاعدة البيانات والنسخ الاحتياطي' : 'Database and backup settings',
      icon: Database,
      badge: 'Data',
      settings: [
        { label: isArabic ? 'النسخ الاحتياطي التلقائي' : 'Auto Backup', enabled: true },
        { label: isArabic ? 'ضغط البيانات' : 'Data Compression', enabled: false },
        { label: isArabic ? 'تنظيف البيانات' : 'Data Cleanup', enabled: true }
      ]
    },
    {
      title: isArabic ? 'المظهر' : 'Appearance',
      description: isArabic ? 'تخصيص مظهر التطبيق' : 'Customize application appearance',
      icon: Palette,
      badge: 'UI/UX',
      settings: [
        { label: isArabic ? 'الوضع الليلي' : 'Dark Mode', enabled: false },
        { label: isArabic ? 'الألوان المخصصة' : 'Custom Colors', enabled: true },
        { label: isArabic ? 'حجم الخط' : 'Font Size', enabled: true }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          {isArabic ? 'إعدادات النظام' : 'System Settings'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'إدارة وتخصيص إعدادات منصة الموارد البشرية'
            : 'Manage and customize your HR platform settings'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsCategories.map((category, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <category.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </div>
                <Badge variant="secondary">{category.badge}</Badge>
              </div>
              <CardDescription className="text-sm">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.settings.map((setting, settingIndex) => (
                <div key={settingIndex} className="flex items-center justify-between py-2">
                  <span className="text-sm">{setting.label}</span>
                  <Switch checked={setting.enabled} />
                </div>
              ))}
              <Button className="w-full mt-4" variant="outline">
                {isArabic ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-6 w-6" />
            {isArabic ? 'معلومات النظام' : 'System Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'إصدار النظام' : 'System Version'}
              </p>
              <p className="font-semibold">AqlHR v2.4.1</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'آخر تحديث' : 'Last Updated'}
              </p>
              <p className="font-semibold">2024-01-15</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'حالة النظام' : 'System Status'}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="font-semibold text-green-600">
                  {isArabic ? 'متصل' : 'Online'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Integration for Settings */}
      <UniversalAIIntegrator 
        pageType="general" 
        moduleName="system-settings" 
        companyId="demo-company" 
        enabledFeatures={['contextual-help', 'workflow-automation', 'real-time-insights']}
      />
    </div>
  );
};

export default SettingsPage;