import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Search, Calendar, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';

const RecruitmentPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  const recruitmentModules = [
    {
      title: isArabic ? 'إدارة الوظائف' : 'Job Management',
      description: isArabic ? 'إنشاء وإدارة الوظائف الشاغرة' : 'Create and manage job openings',
      icon: FileText,
      badge: 'Core',
      status: 'active'
    },
    {
      title: isArabic ? 'البحث عن المواهب' : 'Talent Search',
      description: isArabic ? 'البحث الذكي عن المرشحين المناسبين' : 'Smart search for suitable candidates',
      icon: Search,
      badge: 'AI',
      status: 'active'
    },
    {
      title: isArabic ? 'جدولة المقابلات' : 'Interview Scheduling',
      description: isArabic ? 'جدولة وإدارة المقابلات الشخصية' : 'Schedule and manage interviews',
      icon: Calendar,
      badge: 'Process',
      status: 'active'
    },
    {
      title: isArabic ? 'تقييم المرشحين' : 'Candidate Assessment',
      description: isArabic ? 'تقييم شامل لقدرات المرشحين' : 'Comprehensive candidate evaluation',
      icon: CheckCircle,
      badge: 'Assessment',
      status: 'active'
    },
    {
      title: isArabic ? 'إدارة المرشحين' : 'Candidate Management',
      description: isArabic ? 'متابعة حالة المرشحين عبر مراحل التوظيف' : 'Track candidate status through hiring stages',
      icon: Users,
      badge: 'Management',
      status: 'active'
    },
    {
      title: isArabic ? 'تحليلات التوظيف' : 'Recruitment Analytics',
      description: isArabic ? 'تحليل وتقارير شاملة لعملية التوظيف' : 'Comprehensive recruitment analysis and reports',
      icon: TrendingUp,
      badge: 'Analytics',
      status: 'active'
    }
  ];

  const stats = [
    { label: isArabic ? 'الوظائف النشطة' : 'Active Jobs', value: '24', color: 'text-blue-600' },
    { label: isArabic ? 'المرشحين الجدد' : 'New Candidates', value: '156', color: 'text-green-600' },
    { label: isArabic ? 'المقابلات المجدولة' : 'Scheduled Interviews', value: '8', color: 'text-yellow-600' },
    { label: isArabic ? 'التوظيفات هذا الشهر' : 'Hires This Month', value: '12', color: 'text-purple-600' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">
          {isArabic ? 'منصة التوظيف والاستقطاب' : 'Recruitment & Talent Acquisition'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'نظام شامل لإدارة عمليات التوظيف واستقطاب المواهب'
            : 'Comprehensive system for managing recruitment and talent acquisition processes'
          }
        </p>
      </div>

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

      {/* Recruitment Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recruitmentModules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <module.icon className="h-8 w-8 text-primary" />
                <Badge variant="secondary">{module.badge}</Badge>
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm leading-relaxed">
                {module.description}
              </CardDescription>
              <Button className="w-full" variant="outline">
                {isArabic ? 'فتح الوحدة' : 'Open Module'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecruitmentPage;