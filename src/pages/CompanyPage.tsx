import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Users, Globe, Target, Award, BarChart3 } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const CompanyPage: React.FC = () => {
  const { isArabic } = useSimpleLanguage();

  const companyModules = [
    {
      title: isArabic ? 'الهيكل التنظيمي' : 'Organizational Structure',
      description: isArabic ? 'تصميم وإدارة الهيكل التنظيمي للشركة' : 'Design and manage company organizational structure',
      icon: Building,
      badge: 'Structure',
      status: 'active'
    },
    {
      title: isArabic ? 'إدارة الأقسام' : 'Department Management',
      description: isArabic ? 'تنظيم وإدارة أقسام الشركة المختلفة' : 'Organize and manage different company departments',
      icon: Users,
      badge: 'Management',
      status: 'active'
    },
    {
      title: isArabic ? 'المواقع والفروع' : 'Locations & Branches',
      description: isArabic ? 'إدارة مواقع وفروع الشركة المتعددة' : 'Manage multiple company locations and branches',
      icon: Globe,
      badge: 'Geography',
      status: 'active'
    },
    {
      title: isArabic ? 'الأهداف الاستراتيجية' : 'Strategic Goals',
      description: isArabic ? 'تحديد ومتابعة الأهداف الاستراتيجية للشركة' : 'Define and track company strategic objectives',
      icon: Target,
      badge: 'Strategy',
      status: 'active'
    },
    {
      title: isArabic ? 'الاعتمادات والشهادات' : 'Certifications & Awards',
      description: isArabic ? 'إدارة شهادات واعتمادات الشركة' : 'Manage company certifications and accreditations',
      icon: Award,
      badge: 'Quality',
      status: 'active'
    },
    {
      title: isArabic ? 'تحليل الأداء المؤسسي' : 'Corporate Performance',
      description: isArabic ? 'تحليل وتقييم الأداء العام للشركة' : 'Analyze and evaluate overall company performance',
      icon: BarChart3,
      badge: 'Analytics',
      status: 'active'
    }
  ];

  const companyInfo = {
    name: isArabic ? 'شركة أقل للموارد البشرية' : 'AqlHR Company',
    employees: '2,847',
    departments: '12',
    locations: '8',
    founded: '2018'
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">
          {isArabic ? 'إدارة الشركة' : 'Company Management'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic 
            ? 'نظام شامل لإدارة بيانات ومعلومات الشركة'
            : 'Comprehensive system for managing company data and information'
          }
        </p>
      </div>

      {/* Company Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            {isArabic ? 'نظرة عامة على الشركة' : 'Company Overview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'اسم الشركة' : 'Company Name'}
              </p>
              <p className="text-lg font-semibold">{companyInfo.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'عدد الموظفين' : 'Total Employees'}
              </p>
              <p className="text-lg font-semibold text-blue-600">{companyInfo.employees}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'عدد الأقسام' : 'Departments'}
              </p>
              <p className="text-lg font-semibold text-green-600">{companyInfo.departments}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {isArabic ? 'المواقع' : 'Locations'}
              </p>
              <p className="text-lg font-semibold text-purple-600">{companyInfo.locations}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Management Modules */}
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

      {/* AI Integration */}
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="company-management" 
        companyId="demo-company" 
        enabledFeatures={['strategic-planning', 'organizational-insights', 'transformation-guidance']}
      />
      
      {/* AI Integration for Company Page */}
      <UniversalAIIntegrator 
        pageType="platform" 
        moduleName="company-dashboard" 
        companyId="demo-company" 
        enabledFeatures={['organizational-insights', 'company-analytics', 'strategic-intelligence', 'business-optimization']}
      />
    </div>
  );
};

export default CompanyPage;