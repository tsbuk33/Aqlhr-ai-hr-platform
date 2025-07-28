import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Heart, Shield, TrendingUp, Users, Award, Zap, Target } from 'lucide-react';
import { useSimpleLanguage } from '@/contexts/SimpleLanguageContext';
import { AqlHRAIAssistant } from "@/components/ai/AqlHRAIAssistant";

const WelfareConsultancy = () => {
  const { isArabic } = useSimpleLanguage();

  const consultancyServices = [
    {
      id: 'ai-welfare-engine',
      title: isArabic ? 'محرك الرفاهية بالذكاء الاصطناعي' : 'AI-Powered Welfare Engine',
      description: isArabic ? 'تحليل شامل لرفاهية الموظفين باستخدام الذكاء الاصطناعي' : 'Comprehensive AI-driven employee wellbeing analysis',
      icon: Brain,
      features: [
        isArabic ? 'تحليل مؤشرات الصحة النفسية' : 'Mental health indicators analysis',
        isArabic ? 'توقع الإرهاق المهني' : 'Burnout prediction',
        isArabic ? 'توصيات شخصية للرفاهية' : 'Personalized welfare recommendations',
        isArabic ? 'ذكاء ثقافي سعودي' : 'Saudi cultural intelligence'
      ]
    },
    {
      id: 'compliance-framework',
      title: isArabic ? 'إطار الامتثال السعودي' : 'Saudi Compliance Framework',
      description: isArabic ? 'ضمان الامتثال الكامل لقوانين العمل السعودية' : 'Complete compliance with Saudi labor laws',
      icon: Shield,
      features: [
        isArabic ? 'حقوق الموظفين وفق النظام السعودي' : 'Employee rights per Saudi law',
        isArabic ? 'معايير مكان العمل الآمن' : 'Safe workplace standards',
        isArabic ? 'التوافق مع رؤية 2030' : 'Vision 2030 alignment',
        isArabic ? 'التكامل الحكومي' : 'Government integration'
      ]
    },
    {
      id: 'wellness-assessment',
      title: isArabic ? 'تقييم الرفاهية الشامل' : 'Comprehensive Wellness Assessment',
      description: isArabic ? 'تقييم متعدد الأبعاد لرفاهية الموظفين' : 'Multi-dimensional employee wellbeing evaluation',
      icon: Heart,
      features: [
        isArabic ? 'الرفاهية الجسدية والنفسية' : 'Physical & mental wellbeing',
        isArabic ? 'العوامل الثقافية والروحانية' : 'Cultural & spiritual factors',
        isArabic ? 'خطط التدخل الشخصية' : 'Personalized intervention plans',
        isArabic ? 'مبادرات رفاهية الفريق' : 'Team welfare initiatives'
      ]
    },
    {
      id: 'service-portfolio',
      title: isArabic ? 'محفظة خدمات الرفاهية' : 'Welfare Services Portfolio',
      description: isArabic ? 'خدمات شاملة للصحة والرفاهية المالية والمهنية' : 'Comprehensive health, financial & professional wellness services',
      icon: Award,
      features: [
        isArabic ? 'خدمات الرعاية الصحية الوقائية' : 'Preventive healthcare services',
        isArabic ? 'الخدمات المالية الإسلامية' : 'Islamic financial services',
        isArabic ? 'دعم النمو المهني' : 'Professional development support',
        isArabic ? 'برامج اللياقة والعافية' : 'Fitness & wellness programs'
      ]
    }
  ];

  const performanceMetrics = [
    { metric: isArabic ? 'رضا الموظفين' : 'Employee Satisfaction', value: '95%', trend: '+12%' },
    { metric: isArabic ? 'معدل الاحتفاظ' : 'Retention Rate', value: '89%', trend: '+8%' },
    { metric: isArabic ? 'مؤشر الرفاهية' : 'Wellbeing Index', value: '4.7/5', trend: '+0.5' },
    { metric: isArabic ? 'الامتثال القانوني' : 'Legal Compliance', value: '100%', trend: '0%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {isArabic ? 'الاستشارات المستقلة لرفاهية الموظفين' : 'Independent Employee-Welfare Consultancy'}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {isArabic 
              ? 'خدمة استشارية رائدة تستخدم الذكاء الاصطناعي وإطار الامتثال لتقديم أفضل حلول الرفاهية في السعودية'
              : 'Flagship consultancy service leveraging AI intelligence and compliance frameworks to deliver best-in-class welfare solutions for Saudi Arabia'
            }
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-accent/10">
              <Zap className="h-3 w-3 mr-1" />
              {isArabic ? 'مدعوم بالذكاء الاصطناعي' : 'AI-Powered'}
            </Badge>
            <Badge variant="secondary" className="bg-gradient-to-r from-accent/10 to-primary/10">
              <Shield className="h-3 w-3 mr-1" />
              {isArabic ? 'متوافق مع القوانين السعودية' : 'Saudi Law Compliant'}
            </Badge>
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-accent/10">
              <Target className="h-3 w-3 mr-1" />
              {isArabic ? 'رؤية 2030' : 'Vision 2030'}
            </Badge>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.metric}</p>
                    <p className="text-2xl font-bold text-primary">{metric.value}</p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">{metric.trend}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">{isArabic ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="ai-engine">{isArabic ? 'محرك الذكاء الاصطناعي' : 'AI Engine'}</TabsTrigger>
            <TabsTrigger value="compliance">{isArabic ? 'الامتثال' : 'Compliance'}</TabsTrigger>
            <TabsTrigger value="services">{isArabic ? 'الخدمات' : 'Services'}</TabsTrigger>
            <TabsTrigger value="analytics">{isArabic ? 'التحليلات' : 'Analytics'}</TabsTrigger>
            <TabsTrigger value="documents">{isArabic ? 'الوثائق' : 'Documents'}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {consultancyServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                        <service.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4" variant="outline">
                      {isArabic ? 'استكشاف الخدمة' : 'Explore Service'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-engine" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-primary" />
                  {isArabic ? 'محرك الرفاهية بالذكاء الاصطناعي' : 'AI-Powered Welfare Engine'}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? 'نظام ذكي متقدم لتحليل وتحسين رفاهية الموظفين'
                    : 'Advanced intelligent system for analyzing and improving employee wellbeing'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      {isArabic ? 'تحليل الرفاهية' : 'Welfare Assessment'}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {isArabic 
                        ? 'تحليل شامل لمؤشرات الصحة النفسية والتوازن بين العمل والحياة'
                        : 'Comprehensive analysis of mental health indicators and work-life balance'
                      }
                    </p>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                    <h4 className="font-semibold text-emerald-900 mb-2">
                      {isArabic ? 'التحليلات التنبؤية' : 'Predictive Analytics'}
                    </h4>
                    <p className="text-sm text-emerald-700">
                      {isArabic 
                        ? 'توقع معدلات الدوران وتأثير الرفاهية على الأداء'
                        : 'Predicting turnover rates and welfare impact on performance'
                      }
                    </p>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">
                      {isArabic ? 'الذكاء الثقافي' : 'Cultural Intelligence'}
                    </h4>
                    <p className="text-sm text-purple-700">
                      {isArabic 
                        ? 'دمج القيم الإسلامية والثقافة السعودية في حلول الرفاهية'
                        : 'Integrating Islamic values and Saudi culture into welfare solutions'
                      }
                    </p>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  {isArabic ? 'إطار الامتثال السعودي' : 'Saudi Compliance Framework'}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? 'ضمان الامتثال الكامل للوائح السعودية ومتطلبات رؤية 2030'
                    : 'Ensuring complete compliance with Saudi regulations and Vision 2030 requirements'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">{isArabic ? 'قوانين العمل السعودية' : 'Saudi Labor Laws'}</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          {isArabic ? 'حقوق الموظفين' : 'Employee Rights'}
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          {isArabic ? 'معايير مكان العمل' : 'Workplace Standards'}
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          {isArabic ? 'حماية الأجور' : 'Wage Protection'}
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">{isArabic ? 'التكامل الحكومي' : 'Government Integration'}</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {isArabic ? 'امتثال وزارة الموارد البشرية' : 'HRSD Compliance'}
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {isArabic ? 'تكامل التأمينات الاجتماعية' : 'GOSI Integration'}
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {isArabic ? 'تكامل قوى' : 'Qiwa Integration'}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  {isArabic ? 'محفظة خدمات الرفاهية الشاملة' : 'Comprehensive Welfare Services Portfolio'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">{isArabic ? 'خدمات الصحة والعافية' : 'Health & Wellness Services'}</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• {isArabic ? 'الرعاية الصحية الوقائية' : 'Preventive Healthcare'}</li>
                      <li>• {isArabic ? 'برامج اللياقة البدنية' : 'Fitness Programs'}</li>
                      <li>• {isArabic ? 'الدعم النفسي' : 'Mental Health Support'}</li>
                      <li>• {isArabic ? 'تحديات الصحة' : 'Health Challenges'}</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">{isArabic ? 'خدمات الرفاهية المالية' : 'Financial Wellness Services'}</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• {isArabic ? 'التخطيط للتقاعد' : 'Retirement Planning'}</li>
                      <li>• {isArabic ? 'الخدمات المالية الإسلامية' : 'Islamic Financial Services'}</li>
                      <li>• {isArabic ? 'إدارة الديون' : 'Debt Management'}</li>
                      <li>• {isArabic ? 'التمويل الطارئ' : 'Emergency Funding'}</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">{isArabic ? 'التطوير المهني' : 'Professional Development'}</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• {isArabic ? 'دعم النمو المهني' : 'Career Growth Support'}</li>
                      <li>• {isArabic ? 'برامج الإرشاد' : 'Mentorship Programs'}</li>
                      <li>• {isArabic ? 'الدعم التعليمي' : 'Educational Support'}</li>
                      <li>• {isArabic ? 'التدريب التقني' : 'Technical Training'}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  {isArabic ? 'قياس الأداء وعائد الاستثمار' : 'Performance Measurement & ROI'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">{isArabic ? 'مقاييس نتائج الموظفين' : 'Employee Outcome Metrics'}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                        <span className="text-sm">{isArabic ? 'تقليل الضغط النفسي' : 'Stress Reduction'}</span>
                        <span className="font-semibold text-emerald-600">-45%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                        <span className="text-sm">{isArabic ? 'رضا الموظفين' : 'Job Satisfaction'}</span>
                        <span className="font-semibold text-emerald-600">+35%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                        <span className="text-sm">{isArabic ? 'التوازن بين العمل والحياة' : 'Work-Life Balance'}</span>
                        <span className="font-semibold text-emerald-600">+50%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">{isArabic ? 'المنافع التنظيمية' : 'Organizational Benefits'}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                        <span className="text-sm">{isArabic ? 'توفير تكاليف الرعاية الصحية' : 'Healthcare Cost Savings'}</span>
                        <span className="font-semibold text-blue-600">-25%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                        <span className="text-sm">{isArabic ? 'تحسين الإنتاجية' : 'Productivity Improvement'}</span>
                        <span className="font-semibold text-blue-600">+40%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                        <span className="text-sm">{isArabic ? 'سمعة صاحب العمل' : 'Employer Reputation'}</span>
                        <span className="font-semibold text-blue-600">+60%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <UniversalDocumentManager
              moduleName={isArabic ? "استشارات رفاهية الموظفين" : "Employee Welfare Consultancy"}
              description={isArabic ? "إدارة شاملة لوثائق الرفاهية والسياسات والتقارير" : "Comprehensive management of welfare documents, policies and reports"}
              platform="welfare_consultancy"
              moduleType="hr"
              acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.jpg', '.png']}
              maxFileSize={25}
              maxFiles={150}
            />
          </TabsContent>

        </Tabs>

        <AqlHRAIAssistant 
          moduleContext="welfare-consultancy" 
          companyId="demo-company"
        />
      </div>
    </div>
  );
};

export default WelfareConsultancy;