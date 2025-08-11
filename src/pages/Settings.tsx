import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings2, User, Shield, Bell, Globe, Database, Palette, Key, Users, UserCheck } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from '@/components/ai';
import { RoleBasedAccessMatrix } from '@/components/RoleBasedAccessMatrix';

const Settings: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  const settingsModules = [
    {
      title: isArabic ? 'إعدادات الحساب' : 'Account Settings',
      description: isArabic ? 'إدارة بيانات الحساب الشخصي' : 'Manage personal account information',
      icon: User,
      badge: 'Account'
    },
    {
      title: isArabic ? 'إعدادات الأمان' : 'Security Settings',
      description: isArabic ? 'إدارة كلمات المرور والأمان' : 'Manage passwords and security',
      icon: Shield,
      badge: 'Security'
    },
    {
      title: isArabic ? 'إعدادات الإشعارات' : 'Notification Settings',
      description: isArabic ? 'تخصيص الإشعارات والتنبيهات' : 'Customize notifications and alerts',
      icon: Bell,
      badge: 'Notifications'
    },
    {
      title: isArabic ? 'إعدادات اللغة' : 'Language Settings',
      description: isArabic ? 'تغيير لغة النظام والتفضيلات' : 'Change system language and preferences',
      icon: Globe,
      badge: 'Language'
    },
    {
      title: isArabic ? 'إعدادات قاعدة البيانات' : 'Database Settings',
      description: isArabic ? 'إدارة اتصالات قاعدة البيانات' : 'Manage database connections',
      icon: Database,
      badge: 'Database'
    },
    {
      title: isArabic ? 'إعدادات المظهر' : 'Theme Settings',
      description: isArabic ? 'تخصيص مظهر وألوان النظام' : 'Customize system appearance and colors',
      icon: Palette,
      badge: 'Theme'
    },
    {
      title: isArabic ? 'مفاتيح API' : 'API Keys',
      description: isArabic ? 'إدارة مفاتيح API والتكاملات' : 'Manage API keys and integrations',
      icon: Key,
      badge: 'API'
    },
    {
      title: isArabic ? 'الإعدادات العامة' : 'General Settings',
      description: isArabic ? 'إعدادات النظام العامة' : 'General system settings',
      icon: Settings2,
      badge: 'General'
    }
  ];

  const stats = [
    { label: isArabic ? 'المستخدمين النشطين' : 'Active Users', value: '24', color: 'text-blue-600' },
    { label: isArabic ? 'الجلسات اليوم' : 'Sessions Today', value: '156', color: 'text-green-600' },
    { label: isArabic ? 'إجمالي التكوينات' : 'Total Configurations', value: '8', color: 'text-yellow-600' },
    { label: isArabic ? 'آخر تحديث' : 'Last Update', value: '2h', color: 'text-purple-600' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">
          {isArabic ? 'الإعدادات' : 'Settings'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'إدارة إعدادات النظام والتكوينات'
            : 'Manage system settings and configurations'
          }
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            {isArabic ? 'الإعدادات العامة' : 'General Settings'}
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            {isArabic ? 'أدوار المستخدمين' : 'User Roles & Access'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsModules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <module.icon className="h-8 w-8 text-primary" />
                <Badge variant="secondary">{module.badge}</Badge>
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {module.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
        </div>
        
        <AqlHRAIAssistant moduleContext="settings.management" />
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <RoleBasedAccessMatrix />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;