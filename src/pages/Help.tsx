import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  Users, 
  DollarSign, 
  Clock, 
  Calendar, 
  Award, 
  UserCheck, 
  Shield, 
  Building, 
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  Zap,
  Globe,
  BookOpen,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  XCircle,
  PlayCircle
} from 'lucide-react';

const Help = () => {
  const { language, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('hr-modules');

  const hrModules = [
    {
      id: 'employee-master',
      icon: Users,
      title: language === 'ar' ? 'البيانات الأساسية للموظفين' : 'Employee Master Data',
      description: language === 'ar' ? 'مستودع مركزي لمعلومات الموظفين والهيكل التنظيمي' : 'Central repository for employee information and organizational structure',
      tools: language === 'ar' ? ['ملفات الموظفين', 'الهيكل التنظيمي', 'الوصف الوظيفي'] : ['Employee Profiles', 'Organizational Chart', 'Job Descriptions'],
      usage: language === 'ar' ? 'التنقل ← إضافة/تعديل ← ملء الحقول ← حفظ ← التحقق من الدقة' : 'Navigate → Add/Edit → Fill fields → Save → Verify accuracy',
      benefits: language === 'ar' ? ['بيانات محدثة', 'مسميات موحدة', 'مراجعات دورية', 'تكامل بين الوحدات'] : ['Current data', 'Standardized titles', 'Regular audits', 'Cross-module integration']
    },
    {
      id: 'payroll',
      icon: DollarSign,
      title: language === 'ar' ? 'معالجة الرواتب' : 'Payroll Processing',
      description: language === 'ar' ? 'حساب شامل للرواتب ومعالجة الضرائب وإدارة المدفوعات' : 'Comprehensive salary calculation, tax processing, and payment management',
      tools: language === 'ar' ? ['حاسبة الراتب', 'معالجة الضرائب', 'إنتاج قسائم الراتب', 'تكامل التأمينات'] : ['Salary Calculator', 'Tax Processing', 'Payslip Generation', 'GOSI Integration'],
      usage: language === 'ar' ? 'إعداد الهياكل ← تكوين المعدلات ← استيراد البيانات ← الحساب ← المراجعة ← المعالجة' : 'Setup structures → Configure rates → Import data → Calculate → Review → Process',
      benefits: language === 'ar' ? ['حسابات آلية', 'مسارات الموافقة', 'التسوية', 'ضمان الامتثال'] : ['Automated calculations', 'Approval workflows', 'Reconciliation', 'Compliance assurance']
    },
    {
      id: 'time-attendance',
      icon: Clock,
      title: language === 'ar' ? 'الوقت والحضور' : 'Time & Attendance',
      description: language === 'ar' ? 'تتبع الوقت ومراقبة الحضور وإدارة الجداول' : 'Time tracking, attendance monitoring, and schedule management',
      tools: language === 'ar' ? ['إدارة الجداول الزمنية', 'حاسبة الإضافي', 'جدولة الورديات', 'تكامل البصمة'] : ['Timesheet Management', 'Overtime Calculator', 'Shift Scheduling', 'Biometric Integration'],
      usage: language === 'ar' ? 'تسجيل الدخول/الخروج ← تسجيل الأنشطة ← تقديم للموافقة ← حساب الإضافي ← إنتاج التقارير' : 'Clock in/out → Record activities → Submit approval → Calculate overtime → Generate reports',
      benefits: language === 'ar' ? ['تسجيل ثابت', 'تخصيص المشاريع', 'عمليات الموافقة المسبقة', 'بيانات رواتب دقيقة'] : ['Consistent recording', 'Project allocation', 'Pre-approval processes', 'Accurate payroll data']
    },
    {
      id: 'leave-management',
      icon: Calendar,
      title: language === 'ar' ? 'إدارة الإجازات' : 'Leave Management',
      description: language === 'ar' ? 'نظام شامل لطلبات الإجازة والموافقة وتتبع الأرصدة' : 'Complete leave request, approval, and balance tracking system',
      tools: language === 'ar' ? ['طلبات الإجازة', 'تتبع الأرصدة', 'مسارات الموافقة', 'إدارة أنواع الإجازات'] : ['Leave Requests', 'Balance Tracking', 'Approval Workflows', 'Leave Types Management'],
      usage: language === 'ar' ? 'تقديم الطلب ← موافقة المدير ← تحقق الموارد البشرية ← تحديث النظام ← تعديل الرصيد' : 'Submit request → Manager approval → HR verification → System update → Balance adjustment',
      benefits: language === 'ar' ? ['التخطيط المتقدم', 'فهم السياسات', 'سجلات دقيقة', 'مسارات عمل آلية'] : ['Advanced planning', 'Policy understanding', 'Accurate records', 'Automated workflows']
    },
    {
      id: 'performance',
      icon: Award,
      title: language === 'ar' ? 'إدارة الأداء' : 'Performance Management',
      description: language === 'ar' ? 'وضع الأهداف وتتبع الأداء ونظام تطوير الموظفين' : 'Goal setting, performance tracking, and employee development system',
      tools: language === 'ar' ? ['وضع الأهداف', 'مراجعات الأداء', 'تخطيط التطوير', 'التقييم 360'] : ['Goal Setting', 'Performance Reviews', 'Development Planning', '360 Feedback'],
      usage: language === 'ar' ? 'إنشاء أهداف ذكية ← مواءمة الأهداف ← تتبع التقدم ← إجراء المراجعات ← تخطيط التطوير' : 'Create SMART goals → Align objectives → Track progress → Conduct reviews → Plan development',
      benefits: language === 'ar' ? ['فحوصات منتظمة', 'ربط التطوير', 'مقاييس مدفوعة بالبيانات', 'نمو مهني'] : ['Regular check-ins', 'Development linking', 'Data-driven metrics', 'Career growth']
    },
    {
      id: 'recruitment',
      icon: UserCheck,
      title: language === 'ar' ? 'التوظيف والتعيين' : 'Recruitment & Hiring',
      description: language === 'ar' ? 'عملية توظيف شاملة من نشر الوظائف إلى التوظيف' : 'End-to-end recruitment process from job posting to onboarding',
      tools: language === 'ar' ? ['نشر الوظائف', 'تتبع المرشحين', 'جدولة المقابلات', 'إدارة العروض'] : ['Job Posting', 'Candidate Tracking', 'Interview Scheduling', 'Offer Management'],
      usage: language === 'ar' ? 'إنشاء وظيفة ← نشر في القنوات ← فحص المرشحين ← جدولة المقابلات ← تقديم العروض' : 'Create job → Post channels → Screen candidates → Schedule interviews → Make offers',
      benefits: language === 'ar' ? ['أوصاف واضحة', 'مقابلات منظمة', 'تجربة المرشح', 'توظيفات عالية الجودة'] : ['Clear descriptions', 'Structured interviews', 'Candidate experience', 'Quality hires']
    }
  ];

  const integrationCategories = [
    {
      id: 'communication',
      title: language === 'ar' ? 'التواصل والتعاون' : 'Communication & Collaboration',
      icon: MessageSquare,
      tools: [
        {
          name: 'Microsoft Teams',
          status: 'connected',
          description: language === 'ar' ? 'منصة تواصل المؤسسة للتعاون الجماعي وإشعارات الموارد البشرية' : 'Enterprise communication platform for team collaboration and HR notifications'
        },
        {
          name: 'Slack',
          status: 'connected',
          description: language === 'ar' ? 'مراسلة مكان العمل للتواصل الفوري والإشعارات الآلية' : 'Workplace messaging for instant communication and automated notifications'
        },
        {
          name: 'WhatsApp Business',
          status: 'configuring',
          description: language === 'ar' ? 'مراسلة الأعمال للتواصل المباشر مع الموظفين والإشعارات المحمولة' : 'Business messaging for direct employee communication and mobile notifications'
        },
        {
          name: 'Email Integration',
          status: 'connected',
          description: language === 'ar' ? 'اتصالات البريد الإلكتروني الآلية والمراسلات المهنية للموارد البشرية' : 'Automated email communications and professional HR correspondence'
        }
      ]
    },
    {
      id: 'document-management',
      title: language === 'ar' ? 'إدارة المستندات' : 'Document Management',
      icon: FileText,
      tools: [
        {
          name: 'SharePoint',
          status: 'connected',
          description: language === 'ar' ? 'إدارة مستندات مايكروسوفت ومنصة التعاون' : 'Microsoft document management and collaboration platform'
        },
        {
          name: 'Google Drive',
          status: 'connected',
          description: language === 'ar' ? 'تكامل التخزين السحابي لإدارة المستندات والمشاركة' : 'Cloud storage integration for document management and sharing'
        },
        {
          name: 'DocuSign',
          status: 'available',
          description: language === 'ar' ? 'منصة التوقيع الرقمي للتوقيع الإلكتروني على المستندات ومسارات العمل' : 'Digital signature platform for electronic document signing and workflows'
        },
        {
          name: 'Adobe Sign',
          status: 'connected',
          description: language === 'ar' ? 'حل التوقيع الإلكتروني من أدوبي لمسارات عمل المستندات المهنية' : 'Adobe electronic signature solution for professional document workflows'
        }
      ]
    },
    {
      id: 'analytics',
      title: language === 'ar' ? 'التحليلات وذكاء الأعمال' : 'Analytics & BI',
      icon: BarChart3,
      tools: [
        {
          name: 'Power BI',
          status: 'connected',
          description: language === 'ar' ? 'منصة تحليلات الأعمال من مايكروسوفت لتصور بيانات الموارد البشرية' : 'Microsoft business analytics platform for HR data visualization'
        },
        {
          name: 'Tableau',
          status: 'configuring',
          description: language === 'ar' ? 'تصور البيانات المتقدم ومنصة ذكاء الأعمال' : 'Advanced data visualization and business intelligence platform'
        },
        {
          name: 'Google Analytics',
          status: 'connected',
          description: language === 'ar' ? 'خدمة تحليلات الويب لتتبع سلوك المستخدمين ومشاركة النظام' : 'Web analytics service for tracking user behavior and system engagement'
        }
      ]
    },
    {
      id: 'learning',
      title: language === 'ar' ? 'التعلم والتطوير' : 'Learning & Development',
      icon: BookOpen,
      tools: [
        {
          name: 'LinkedIn Learning',
          status: 'connected',
          description: language === 'ar' ? 'منصة التطوير المهني مع دورات الأعمال والتقنية' : 'Professional development platform with business and technical courses'
        },
        {
          name: 'Coursera Business',
          status: 'connected',
          description: language === 'ar' ? 'دورات على مستوى الجامعة والشهادات المهنية لتطوير المهارات' : 'University-level courses and professional certificates for skill development'
        },
        {
          name: 'Udemy Business',
          status: 'available',
          description: language === 'ar' ? 'منصة التعلم التجاري مع المهارات العملية والدورات التطبيقية' : 'Business learning platform with practical skills and hands-on courses'
        }
      ]
    },
    {
      id: 'automation',
      title: language === 'ar' ? 'منصات الأتمتة' : 'Automation Platforms',
      icon: Zap,
      tools: [
        {
          name: 'Zapier',
          status: 'connected',
          description: language === 'ar' ? 'منصة الأتمتة التي تربط التطبيقات وتؤتمت مسارات عمل الموارد البشرية' : 'Automation platform connecting apps and automating HR workflows'
        },
        {
          name: 'Power Automate',
          status: 'configuring',
          description: language === 'ar' ? 'خدمة أتمتة مسارات العمل من مايكروسوفت لعمليات الأعمال' : 'Microsoft workflow automation service for business processes'
        },
        {
          name: 'Custom Workflows',
          status: 'connected',
          description: language === 'ar' ? 'حلول الأتمتة المخصصة لعمليات الأعمال الفريدة' : 'Bespoke automation solutions for unique business processes'
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'configuring':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'available':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'default',
      configuring: 'secondary',
      available: 'outline',
      disconnected: 'destructive'
    } as const;

    const labels = {
      connected: language === 'ar' ? 'متصل' : 'Connected',
      configuring: language === 'ar' ? 'جاري التكوين' : 'Configuring',
      available: language === 'ar' ? 'متاح' : 'Available',
      disconnected: language === 'ar' ? 'منقطع' : 'Disconnected'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="gap-1">
        {getStatusIcon(status)}
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const filteredModules = hrModules.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = integrationCategories.map(category => ({
    ...category,
    tools: category.tools.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.tools.length > 0 || searchQuery === '');

  return (
    <div className={`container mx-auto p-6 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {language === 'ar' ? 'نظام المساعدة التفاعلي' : 'Interactive Help System'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {language === 'ar' 
                ? 'دليل شامل لجميع وحدات الموارد البشرية وأدوات التكامل مع الدعم ثنائي اللغة'
                : 'Comprehensive guide for all HR modules and integration tools with bilingual support'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Globe className="h-3 w-3" />
              {language === 'ar' ? 'عربي/English' : 'Arabic/English'}
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ar' ? 'البحث في المساعدة...' : 'Search help...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hr-modules" className="gap-2">
            <Users className="h-4 w-4" />
            {language === 'ar' ? 'وحدات الموارد البشرية (14)' : 'HR Modules (14)'}
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Settings className="h-4 w-4" />
            {language === 'ar' ? 'أدوات التكامل (26)' : 'Integration Tools (26)'}
          </TabsTrigger>
        </TabsList>

        {/* HR Modules Tab */}
        <TabsContent value="hr-modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <Card key={module.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <module.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`${module.id}-tools`}>
                      <AccordionTrigger className="text-sm">
                        {language === 'ar' ? 'الأدوات المتاحة' : 'Available Tools'}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {module.tools.map((tool, index) => (
                            <Badge key={index} variant="outline" className="mr-2 mb-2">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={`${module.id}-usage`}>
                      <AccordionTrigger className="text-sm">
                        {language === 'ar' ? 'كيفية الاستخدام' : 'How to Use'}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">{module.usage}</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={`${module.id}-benefits`}>
                      <AccordionTrigger className="text-sm">
                        {language === 'ar' ? 'أفضل الممارسات' : 'Best Practices'}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1">
                          {module.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Integration Tools Tab */}
        <TabsContent value="integrations" className="space-y-6">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{category.title}</CardTitle>
                  <Badge variant="secondary">
                    {category.tools.length} {language === 'ar' ? 'أدوات' : 'Tools'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.tools.map((tool, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{tool.name}</h4>
                        {getStatusBadge(tool.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          {language === 'ar' ? 'دليل الإعداد' : 'Setup Guide'}
                        </Button>
                        <Button size="sm" variant="ghost">
                          {language === 'ar' ? 'استكشاف الأخطاء' : 'Troubleshoot'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Integration Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'ملخص حالة التكامل' : 'Integration Status Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'متصل' : 'Connected'}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-yellow-600">4</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'جاري التكوين' : 'Configuring'}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'متاح' : 'Available'}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'منقطع' : 'Disconnected'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Access Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            {language === 'ar' ? 'الوصول السريع للمساعدة' : 'Quick Help Access'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start gap-2 h-auto p-4">
              <BookOpen className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">
                  {language === 'ar' ? 'دليل البدء السريع' : 'Quick Start Guide'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'ابدأ بالأساسيات' : 'Get started with basics'}
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-auto p-4">
              <PlayCircle className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">
                  {language === 'ar' ? 'جولات تفاعلية' : 'Interactive Tours'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'تعلم بالممارسة' : 'Learn by doing'}
                </div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-auto p-4">
              <MessageSquare className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">
                  {language === 'ar' ? 'الدعم المباشر' : 'Live Support'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'تواصل مع الفريق' : 'Contact support team'}
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;