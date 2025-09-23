import React, { useState } from 'react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  Globe, 
  Clock, 
  Mail, 
  Database, 
  Server,
  Palette,
  Bell,
  Shield,
  Zap,
  Save,
  RotateCcw
} from 'lucide-react';

interface ConfigSection {
  id: string;
  title: string;
  titleAr: string;
  icon: any;
  settings: ConfigSetting[];
}

interface ConfigSetting {
  id: string;
  name: string;
  nameAr: string;
  type: 'boolean' | 'number' | 'text' | 'select' | 'range';
  value: any;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
  description?: string;
  descriptionAr?: string;
}

export const SystemConfigurationTools: React.FC = () => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  
  const [configurations, setConfigurations] = useState<ConfigSection[]>([
    {
      id: 'general',
      title: 'General Settings',
      titleAr: 'الإعدادات العامة',
      icon: Settings,
      settings: [
        {
          id: 'system_name',
          name: 'System Name',
          nameAr: 'اسم النظام',
          type: 'text',
          value: 'AqlHR Platform',
          description: 'Display name for the system',
          descriptionAr: 'اسم العرض للنظام'
        },
        {
          id: 'maintenance_mode',
          name: 'Maintenance Mode',
          nameAr: 'وضع الصيانة',
          type: 'boolean',
          value: false,
          description: 'Enable to put system in maintenance mode',
          descriptionAr: 'تفعيل لوضع النظام في وضع الصيانة'
        },
        {
          id: 'max_concurrent_users',
          name: 'Max Concurrent Users',
          nameAr: 'الحد الأقصى للمستخدمين المتزامنين',
          type: 'range',
          value: [500],
          min: 100,
          max: 5000,
          unit: 'users'
        }
      ]
    },
    {
      id: 'localization',
      title: 'Localization',
      titleAr: 'التوطين',
      icon: Globe,
      settings: [
        {
          id: 'default_language',
          name: 'Default Language',
          nameAr: 'اللغة الافتراضية',
          type: 'select',
          value: 'en',
          options: ['en', 'ar']
        },
        {
          id: 'timezone',
          name: 'System Timezone',
          nameAr: 'المنطقة الزمنية للنظام',
          type: 'select',
          value: 'Asia/Riyadh',
          options: ['Asia/Riyadh', 'UTC', 'Asia/Dubai']
        },
        {
          id: 'date_format',
          name: 'Date Format',
          nameAr: 'تنسيق التاريخ',
          type: 'select',
          value: 'dd/mm/yyyy',
          options: ['dd/mm/yyyy', 'mm/dd/yyyy', 'yyyy-mm-dd']
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      titleAr: 'الإشعارات',
      icon: Bell,
      settings: [
        {
          id: 'email_notifications',
          name: 'Email Notifications',
          nameAr: 'إشعارات البريد الإلكتروني',
          type: 'boolean',
          value: true
        },
        {
          id: 'push_notifications',
          name: 'Push Notifications',
          nameAr: 'الإشعارات الفورية',
          type: 'boolean',
          value: true
        },
        {
          id: 'notification_retention',
          name: 'Notification Retention (days)',
          nameAr: 'الاحتفاظ بالإشعارات (أيام)',
          type: 'range',
          value: [30],
          min: 7,
          max: 365,
          unit: 'days'
        }
      ]
    },
    {
      id: 'performance',
      title: 'Performance',
      titleAr: 'الأداء',
      icon: Zap,
      settings: [
        {
          id: 'cache_enabled',
          name: 'Enable Caching',
          nameAr: 'تفعيل التخزين المؤقت',
          type: 'boolean',
          value: true
        },
        {
          id: 'cache_duration',
          name: 'Cache Duration (minutes)',
          nameAr: 'مدة التخزين المؤقت (دقائق)',
          type: 'range',
          value: [60],
          min: 5,
          max: 1440,
          unit: 'minutes'
        },
        {
          id: 'api_rate_limit',
          name: 'API Rate Limit (requests/minute)',
          nameAr: 'حد معدل API (طلبات/دقيقة)',
          type: 'range',
          value: [1000],
          min: 100,
          max: 10000,
          unit: 'req/min'
        }
      ]
    }
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (sectionId: string, settingId: string, newValue: any) => {
    setConfigurations(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          settings: section.settings.map(setting => 
            setting.id === settingId ? { ...setting, value: newValue } : setting
          )
        };
      }
      return section;
    }));
    setHasChanges(true);
  };

  const saveConfiguration = () => {
    // Simulate save
    console.log('Saving configuration:', configurations);
    setHasChanges(false);
  };

  const resetConfiguration = () => {
    // Reset to defaults
    setHasChanges(false);
  };

  const renderSettingControl = (sectionId: string, setting: ConfigSetting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Switch
            checked={setting.value}
            onCheckedChange={(checked) => updateSetting(sectionId, setting.id, checked)}
          />
        );
      
      case 'text':
        return (
          <Input
            value={setting.value}
            onChange={(e) => updateSetting(sectionId, setting.id, e.target.value)}
            className="text-sm"
          />
        );
      
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => updateSetting(sectionId, setting.id, e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'range':
        return (
          <div className="space-y-2">
            <Slider
              value={setting.value}
              onValueChange={(value) => updateSetting(sectionId, setting.id, value)}
              min={setting.min}
              max={setting.max}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{setting.min} {setting.unit}</span>
              <span className="font-medium">{setting.value[0]} {setting.unit}</span>
              <span>{setting.max} {setting.unit}</span>
            </div>
          </div>
        );
      
      default:
        return <span>Unsupported type</span>;
    }
  };

  return (
    <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              {isArabic ? 'أدوات تكوين النظام' : 'System Configuration Tools'}
            </div>
            {hasChanges && (
              <Badge variant="secondary" className="animate-pulse">
                {isArabic ? 'تغييرات غير محفوظة' : 'Unsaved Changes'}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={saveConfiguration} disabled={!hasChanges} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isArabic ? 'حفظ التغييرات' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={resetConfiguration} disabled={!hasChanges}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {isArabic ? 'إعادة تعيين' : 'Reset'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Sections */}
      {configurations.map((section) => {
        const Icon = section.icon;
        return (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon className="h-5 w-5 text-primary" />
                {isArabic ? section.titleAr : section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">
                          {isArabic ? setting.nameAr : setting.name}
                        </h4>
                        {(setting.description || setting.descriptionAr) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {isArabic ? setting.descriptionAr : setting.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="pt-2">
                      {renderSettingControl(section.id, setting)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};