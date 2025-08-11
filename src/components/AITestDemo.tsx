import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from 'react-router-dom';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { Brain, MapPin, Users, DollarSign, Building, Shield, TrendingUp, Bot } from 'lucide-react';

export const AITestDemo: React.FC = () => {
  const { isArabic } = useSimpleLanguage();
  const location = useLocation();
  const [testResults, setTestResults] = useState<any[]>([]);

  // Test routes to demonstrate context-awareness
  const testRoutes = [
    { path: '/employees', icon: Users, name: 'Employee Management', module: 'employees' },
    { path: '/payroll', icon: DollarSign, name: 'Payroll & Finance', module: 'payroll' },
    { path: '/government', icon: Shield, name: 'Government Integration', module: 'government' },
    { path: '/analytics', icon: TrendingUp, name: 'Analytics & Reports', module: 'analytics' },
    { path: '/executive-center', icon: Brain, name: 'Executive Intelligence', module: 'executive' },
    { path: '/core-hr', icon: Building, name: 'Core HR Systems', module: 'core-hr' }
  ];

  // Get AI expertise based on route
  const getAIExpertise = (module: string): { title: string; expertise: string[] } => {
    const expertiseMap: Record<string, { title: string; expertise: string[] }> = {
      'employees': {
        title: 'Employee Management Expert',
        expertise: [
          'Complete employee lifecycle management',
          'Saudi labor law compliance',
          'Visa and work permit processing', 
          'Performance evaluation systems',
          'Saudization and Nitaqat compliance',
          'Recruitment and onboarding procedures'
        ]
      },
      'payroll': {
        title: 'Payroll & Financial Expert',
        expertise: [
          'Advanced payroll processing',
          'GOSI calculations and compliance',
          'Wage Protection System (WPS)',
          'End-of-service benefit calculations',
          'Saudi tax and financial regulations',
          'Multi-currency salary management'
        ]
      },
      'government': {
        title: 'Government Integration Specialist',
        expertise: [
          'Qiwa platform integration',
          'Ministry of Labor procedures',
          'GOSI services and compliance',
          'Work permit renewal processes',
          'Labor office procedures',
          'Government digital transformation'
        ]
      },
      'analytics': {
        title: 'HR Analytics Intelligence',
        expertise: [
          'Predictive workforce analytics',
          'Advanced KPI monitoring',
          'Real-time dashboard creation',
          'Employee performance insights',
          'Turnover prediction models',
          'ROI analysis for HR initiatives'
        ]
      },
      'executive': {
        title: 'Executive Decision Support',
        expertise: [
          'Strategic HR planning',
          'Executive-level reporting',
          'Business intelligence insights',
          'Organizational effectiveness',
          'Leadership development analytics',
          'Risk assessment and mitigation'
        ]
      },
      'core-hr': {
        title: 'Core HR Systems Expert',
        expertise: [
          'Time and attendance management',
          'Leave management systems',
          'Performance management workflows',
          'Benefits administration',
          'Training and development tracking',
          'Workflow automation'
        ]
      }
    };
    
    return expertiseMap[module] || { title: 'HR Generalist', expertise: ['General HR support'] };
  };

  const getCurrentModuleInfo = () => {
    const currentPath = location.pathname;
    const currentRoute = testRoutes.find(route => currentPath.includes(route.path.slice(1))) || 
                        { path: currentPath, icon: Bot, name: 'Current Page', module: 'default' };
    return { currentRoute, expertise: getAIExpertise(currentRoute.module) };
  };

  const { currentRoute, expertise } = getCurrentModuleInfo();

  return (
    <Card className="w-full max-w-4xl mx-auto mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-primary" />
          {isArabic ? 'اختبار الذكاء الاصطناعي المتخصص' : 'Context-Aware AI Specialist Test'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Page Detection */}
        <div className="bg-background/50 rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {isArabic ? 'الصفحة الحالية:' : 'Current Page:'}
            </span>
            <Badge variant="outline" className="gap-1">
              <currentRoute.icon className="h-3 w-3" />
              {currentRoute.name}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {isArabic ? 'المسار:' : 'Route:'} {location.pathname}
          </p>
        </div>

        {/* AI Expertise for Current Page */}
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            {isArabic ? 'خبرة الذكاء الاصطناعي المتخصصة:' : 'Specialized AI Expertise:'}
          </h4>
          <p className="text-sm font-medium text-primary mb-2">{expertise.title}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {expertise.expertise.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Test Other Modules */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">
            {isArabic ? 'اختبار التخصصات الأخرى:' : 'Test Other Specializations:'}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {testRoutes.map((route) => {
              const routeExpertise = getAIExpertise(route.module);
              const Icon = route.icon;
              const isActive = location.pathname.includes(route.path.slice(1));
              
              return (
                <Card 
                  key={route.path} 
                  className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                    isActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => window.location.href = route.path}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-medium truncate">{route.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {routeExpertise.title}
                  </p>
                  <p className="text-xs text-primary mt-1">
                    {routeExpertise.expertise.length} {isArabic ? 'مجالات خبرة' : 'expertise areas'}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 border">
          <p className="text-xs text-muted-foreground text-center">
            {isArabic 
              ? '🤖 المساعد الذكي يكتشف تلقائياً الصفحة الحالية ويوفر خبرة متخصصة لكل وحدة'
              : '🤖 AI Assistant automatically detects current page and provides specialized expertise for each module'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};