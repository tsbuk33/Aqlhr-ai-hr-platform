import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Target, Award, MapPin, Calendar } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from '@/components/ai/AqlHRAIAssistant';

const Company: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  const companyModules = [
    {
      title: isArabic ? 'معلومات الشركة' : 'Company Information',
      description: isArabic ? 'إدارة البيانات الأساسية للشركة' : 'Manage basic company data',
      icon: Building,
      badge: 'Core'
    },
    {
      title: isArabic ? 'الهيكل التنظيمي' : 'Organizational Structure',
      description: isArabic ? 'تصميم وإدارة الهيكل التنظيمي' : 'Design and manage organizational structure',
      icon: Users,
      badge: 'Structure'
    },
    {
      title: isArabic ? 'الأهداف والمبادرات' : 'Goals & Initiatives',
      description: isArabic ? 'تحديد وتتبع أهداف الشركة' : 'Define and track company objectives',
      icon: Target,
      badge: 'Strategy'
    },
    {
      title: isArabic ? 'الإنجازات والتقديرات' : 'Achievements & Recognition',
      description: isArabic ? 'توثيق إنجازات وتقديرات الشركة' : 'Document company achievements and recognition',
      icon: Award,
      badge: 'Recognition'
    },
    {
      title: isArabic ? 'المواقع والفروع' : 'Locations & Branches',
      description: isArabic ? 'إدارة مواقع وفروع الشركة' : 'Manage company locations and branches',
      icon: MapPin,
      badge: 'Locations'
    },
    {
      title: isArabic ? 'تاريخ الشركة' : 'Company History',
      description: isArabic ? 'معلومات تاريخية عن الشركة' : 'Historical information about the company',
      icon: Calendar,
      badge: 'History'
    }
  ];

  const stats = [
    { label: isArabic ? 'عدد الموظفين' : 'Total Employees', value: '1,247', color: 'text-blue-600' },
    { label: isArabic ? 'الأقسام' : 'Departments', value: '12', color: 'text-green-600' },
    { label: isArabic ? 'المواقع' : 'Locations', value: '5', color: 'text-yellow-600' },
    { label: isArabic ? 'سنوات الخبرة' : 'Years of Experience', value: '25+', color: 'text-purple-600' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">
          {isArabic ? 'إدارة الشركة' : 'Company Management'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'نظام شامل لإدارة معلومات وبيانات الشركة'
            : 'Comprehensive system for managing company information and data'
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

      {/* Company Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companyModules.map((module, index) => (
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
      
      <AqlHRAIAssistant moduleContext="company.management" />
    </div>
  );
};

export default Company;