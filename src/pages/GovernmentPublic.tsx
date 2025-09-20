import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Globe, Link, CheckCircle, Clock, AlertCircle, Building2 } from 'lucide-react';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function GovernmentPublic() {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';

  const portals = [
    {
      name: isArabic ? 'قوى' : 'Qiwa',
      description: isArabic ? 'منصة وزارة الموارد البشرية والتنمية الاجتماعية' : 'Ministry of Human Resources platform',
      status: 'connected',
      icon: Building2
    },
    {
      name: isArabic ? 'التأمينات الاجتماعية' : 'GOSI',
      description: isArabic ? 'المؤسسة العامة للتأمينات الاجتماعية' : 'General Organization for Social Insurance',
      status: 'connected',
      icon: Globe
    },
    {
      name: isArabic ? 'أبشر' : 'Absher',
      description: isArabic ? 'منصة وزارة الداخلية للخدمات الإلكترونية' : 'Ministry of Interior digital services platform',
      status: 'connected',
      icon: CheckCircle
    },
    {
      name: isArabic ? 'مقيم' : 'Muqeem',
      description: isArabic ? 'منصة خدمات الإقامة والعمالة الوافدة' : 'Residency and expatriate worker services',
      status: 'pending',
      icon: Clock
    },
    {
      name: isArabic ? 'مداد' : 'Mudad',
      description: isArabic ? 'نظام إدارة العقود الموحد' : 'Unified contract management system',
      status: 'connected',
      icon: Link
    },
    {
      name: isArabic ? 'إلم' : 'ELM',
      description: isArabic ? 'منصة الخدمات الرقمية المتقدمة' : 'Advanced digital services platform',
      status: 'maintenance',
      icon: AlertCircle
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'maintenance': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return isArabic ? 'متصل' : 'Connected';
      case 'pending': return isArabic ? 'قيد الانتظار' : 'Pending';
      case 'maintenance': return isArabic ? 'صيانة' : 'Maintenance';
      default: return status;
    }
  };

  const features = [
    {
      title: isArabic ? 'المزامنة التلقائية' : 'Auto Sync',
      description: isArabic ? 'مزامنة تلقائية للبيانات مع جميع البوابات الحكومية' : 'Automatic data synchronization with all government portals'
    },
    {
      title: isArabic ? 'التحديث الفوري' : 'Real-time Updates',
      description: isArabic ? 'تحديثات فورية لحالة الطلبات والمعاملات' : 'Real-time updates for application and transaction status'
    },
    {
      title: isArabic ? 'إدارة موحدة' : 'Unified Management',
      description: isArabic ? 'إدارة جميع الخدمات الحكومية من مكان واحد' : 'Manage all government services from one place'
    },
    {
      title: isArabic ? 'امتثال تلقائي' : 'Auto Compliance',
      description: isArabic ? 'ضمان الامتثال التلقائي للوائح والأنظمة' : 'Ensure automatic compliance with regulations and laws'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isArabic ? 'التكاملات الحكومية' : 'Government Integrations'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isArabic 
            ? 'تكامل مباشر مع أكثر من 21 بوابة حكومية سعودية لإدارة جميع الخدمات الرسمية'
            : 'Direct integration with 21+ Saudi government portals for comprehensive official services management'
          }
        </p>
      </div>

      {/* Portal Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {portals.map((portal, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <portal.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{portal.name}</CardTitle>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(portal.status)}`}>
                  {getStatusText(portal.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {portal.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="text-center border-2 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3 text-primary">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="text-xl text-green-700">
              {isArabic ? '📊 إحصائيات التكامل' : '📊 Integration Statistics'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">{isArabic ? 'البوابات المتصلة' : 'Connected Portals'}</span>
              <span className="font-bold text-green-600">18/21</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{isArabic ? 'معدل النجاح' : 'Success Rate'}</span>
              <span className="font-bold text-green-600">99.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{isArabic ? 'المعاملات اليومية' : 'Daily Transactions'}</span>
              <span className="font-bold text-blue-600">1,247</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">{isArabic ? 'وقت الاستجابة المتوسط' : 'Avg Response Time'}</span>
              <span className="font-bold text-purple-600">2.1s</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl text-blue-700">
              {isArabic ? '🔧 الخدمات المتاحة' : '🔧 Available Services'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">{isArabic ? 'إدارة تأشيرات العمل' : 'Work visa management'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">{isArabic ? 'تقارير التأمينات الاجتماعية' : 'GOSI reports'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">{isArabic ? 'تحديث بيانات قوى' : 'Qiwa data updates'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">{isArabic ? 'إدارة العقود' : 'Contract management'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">{isArabic ? 'خدمات أبشر' : 'Absher services'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          {isArabic 
            ? '🔒 قم بتسجيل الدخول للوصول إلى جميع الخدمات الحكومية والتكاملات المباشرة'
            : '🔒 Login to access all government services and direct integrations'
          }
        </p>
      </div>
    </div>
  );
}