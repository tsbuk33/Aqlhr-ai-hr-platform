import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Users, Shield, Settings, FileText, PieChart, Database } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguageCompat';

const AdminOverview = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const adminCards = [
    {
      title: isArabic ? 'إدارة المستخدمين' : 'User Management',
      description: isArabic ? 'إدارة المستخدمين والأدوار' : 'Manage users and roles',
      icon: Users,
      path: '/admin/users',
      color: 'text-blue-600'
    },
    {
      title: isArabic ? 'الامتثال' : 'Compliance',
      description: isArabic ? 'الرقابة التنظيمية والامتثال' : 'Regulatory oversight and compliance',
      icon: Shield,
      path: '/compliance',
      color: 'text-green-600'
    },
    {
      title: isArabic ? 'إعدادات النظام' : 'System Settings',
      description: isArabic ? 'تكوين النظام والإعدادات' : 'System configuration and settings',
      icon: Settings,
      path: '/settings',
      color: 'text-purple-600'
    },
    {
      title: isArabic ? 'إدارة السياسات' : 'Policy Management',
      description: isArabic ? 'إدارة السياسات والإجراءات' : 'Manage policies and procedures',
      icon: FileText,
      path: '/compliance/policies',
      color: 'text-orange-600'
    },
    {
      title: isArabic ? 'تحليلات الأداء' : 'Performance Analytics',
      description: isArabic ? 'تحليلات شاملة للأداء' : 'Comprehensive performance analytics',
      icon: PieChart,
      path: '/analytics/performance',
      color: 'text-red-600'
    },
    {
      title: isArabic ? 'مركز الذكاء الاصطناعي' : 'AI Command Center',
      description: isArabic ? 'إدارة أنظمة الذكاء الاصطناعي' : 'Manage AI systems and automation',
      icon: Database,
      path: '/ai-ecosystem/command-center',
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? 'لوحة تحكم الإدارة' : 'Administration Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isArabic ? 'إدارة شاملة لنظام الموارد البشرية' : 'Comprehensive HR system administration'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={index} to={card.path}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Icon className={`h-6 w-6 ${card.color}`} />
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? 'انقر للوصول' : 'Click to access'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'إحصائيات سريعة' : 'Quick Stats'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {isArabic ? 'إجمالي المستخدمين' : 'Total Users'}
                </span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {isArabic ? 'المستخدمين النشطين' : 'Active Users'}
                </span>
                <span className="font-semibold">1,156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {isArabic ? 'المديرين' : 'Administrators'}
                </span>
                <span className="font-semibold">23</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'حالة النظام' : 'System Status'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  {isArabic ? 'حالة الخادم' : 'Server Status'}
                </span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  {isArabic ? 'متصل' : 'Online'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  {isArabic ? 'قاعدة البيانات' : 'Database'}
                </span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  {isArabic ? 'متصلة' : 'Connected'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  {isArabic ? 'النسخ الاحتياطي' : 'Backup'}
                </span>
                <span className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  {isArabic ? 'محدث' : 'Up to date'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;