import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
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
  PlayCircle,
  Lock,
  Key,
  Grid,
  Eye,
  Edit,
  Trash2,
  Plus,
  Check,
  X
} from 'lucide-react';

import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { AqlHRAIAssistant } from '@/components/ai';
import ModuleDocumentUploader from '@/components/universal/ModuleDocumentUploader';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

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
      description: language === 'ar' ? 'حساب شامل للرواتب وإدارة المدفوعات' : 'Comprehensive salary calculation and payment management',
      tools: language === 'ar' ? ['حاسبة الراتب', 'إنتاج قسائم الراتب', 'تكامل التأمينات'] : ['Salary Calculator', 'Payslip Generation', 'GOSI Integration'],
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
    },
    {
      id: 'learning-development',
      icon: BookOpen,
      title: language === 'ar' ? 'التعلم والتطوير' : 'Learning & Development',
      description: language === 'ar' ? 'إدارة التدريب والتطوير المهني ومسارات التعلم' : 'Training management, professional development, and learning pathways',
      tools: language === 'ar' ? ['كتالوج التدريب', 'مسارات التعلم', 'تتبع التقدم', 'إدارة الشهادات'] : ['Training Catalog', 'Learning Paths', 'Progress Tracking', 'Certification Management'],
      usage: language === 'ar' ? 'تحديد الاحتياجات ← إنشاء البرامج ← تسجيل المشاركين ← تتبع التقدم ← تقييم النتائج' : 'Identify needs → Create programs → Enroll participants → Track progress → Evaluate outcomes',
      benefits: language === 'ar' ? ['تطوير المهارات', 'برامج مخصصة', 'تتبع شامل', 'تحسين الأداء'] : ['Skill development', 'Customized programs', 'Comprehensive tracking', 'Performance improvement']
    },
    {
      id: 'benefits-administration',
      icon: Shield,
      title: language === 'ar' ? 'إدارة المزايا' : 'Benefits Administration',
      description: language === 'ar' ? 'إدارة شاملة لمزايا الموظفين والتأمين والمساعدات' : 'Comprehensive employee benefits, insurance, and assistance management',
      tools: language === 'ar' ? ['حزم المزايا', 'إدارة التأمين', 'المساعدات المالية', 'برامج الرفاهية'] : ['Benefits Packages', 'Insurance Management', 'Financial Assistance', 'Wellness Programs'],
      usage: language === 'ar' ? 'تصميم الحزم ← تسجيل الموظفين ← معالجة المطالبات ← مراقبة الاستخدام ← تجديد السياسات' : 'Design packages → Enroll employees → Process claims → Monitor usage → Renew policies',
      benefits: language === 'ar' ? ['حزم شاملة', 'إدارة آلية', 'تتبع دقيق', 'رضا الموظفين'] : ['Comprehensive packages', 'Automated management', 'Accurate tracking', 'Employee satisfaction']
    },
    {
      id: 'succession-planning',
      icon: Building,
      title: language === 'ar' ? 'تخطيط التعاقب' : 'Succession Planning',
      description: language === 'ar' ? 'تحديد وتطوير القادة المستقبليين وتخطيط التعاقب الوظيفي' : 'Identifying and developing future leaders and career succession planning',
      tools: language === 'ar' ? ['خرائط المواهب', 'تحليل الفجوات', 'خطط التطوير', 'مسارات الترقية'] : ['Talent Maps', 'Gap Analysis', 'Development Plans', 'Promotion Pathways'],
      usage: language === 'ar' ? 'تحديد المواهب ← تقييم الاستعداد ← إنشاء خطط ← تنفيذ التطوير ← مراقبة التقدم' : 'Identify talent → Assess readiness → Create plans → Implement development → Monitor progress',
      benefits: language === 'ar' ? ['استمرارية القيادة', 'تطوير المواهب', 'تقليل المخاطر', 'نمو مهني'] : ['Leadership continuity', 'Talent development', 'Risk reduction', 'Career growth']
    },
    {
      id: 'compensation-benefits',
      icon: DollarSign,
      title: language === 'ar' ? 'التعويضات والمزايا' : 'Compensation & Benefits',
      description: language === 'ar' ? 'تصميم وإدارة هياكل الرواتب والمزايا والحوافز' : 'Design and management of salary structures, benefits, and incentives',
      tools: language === 'ar' ? ['هياكل الرواتب', 'تحليل السوق', 'إدارة الحوافز', 'مقارنات التعويضات'] : ['Salary Structures', 'Market Analysis', 'Incentive Management', 'Compensation Benchmarking'],
      usage: language === 'ar' ? 'تحليل السوق ← تصميم الهياكل ← تحديد المستويات ← تطبيق التغييرات ← مراجعة دورية' : 'Market analysis → Design structures → Set levels → Implement changes → Regular review',
      benefits: language === 'ar' ? ['تنافسية في السوق', 'عدالة داخلية', 'إدارة التكاليف', 'جذب المواهب'] : ['Market competitiveness', 'Internal equity', 'Cost management', 'Talent attraction']
    },
    {
      id: 'employee-relations',
      icon: Users,
      title: language === 'ar' ? 'علاقات الموظفين' : 'Employee Relations',
      description: language === 'ar' ? 'إدارة علاقات العمل والشكاوى والنزاعات والسياسات' : 'Managing workplace relationships, grievances, disputes, and policies',
      tools: language === 'ar' ? ['إدارة الشكاوى', 'حل النزاعات', 'سياسات العمل', 'برامج المشاركة'] : ['Grievance Management', 'Conflict Resolution', 'Workplace Policies', 'Engagement Programs'],
      usage: language === 'ar' ? 'استقبال الشكاوى ← التحقيق ← الوساطة ← حل النزاعات ← متابعة النتائج' : 'Receive complaints → Investigate → Mediate → Resolve disputes → Follow up outcomes',
      benefits: language === 'ar' ? ['بيئة عمل إيجابية', 'حل سريع للنزاعات', 'امتثال قانوني', 'رضا الموظفين'] : ['Positive workplace', 'Quick dispute resolution', 'Legal compliance', 'Employee satisfaction']
    },
    {
      id: 'compliance-reporting',
      icon: FileText,
      title: language === 'ar' ? 'الامتثال والتقارير' : 'Compliance & Reporting',
      description: language === 'ar' ? 'ضمان الامتثال للقوانين وإنتاج التقارير التنظيمية والإحصائية' : 'Ensuring legal compliance and producing regulatory and statistical reports',
      tools: language === 'ar' ? ['تقارير تنظيمية', 'مراقبة الامتثال', 'تحليلات الموارد البشرية', 'لوحات المعلومات'] : ['Regulatory Reports', 'Compliance Monitoring', 'HR Analytics', 'Dashboards'],
      usage: language === 'ar' ? 'جمع البيانات ← تحليل الامتثال ← إنتاج التقارير ← مراجعة النتائج ← اتخاذ الإجراءات' : 'Collect data → Analyze compliance → Generate reports → Review results → Take actions',
      benefits: language === 'ar' ? ['امتثال كامل', 'تقارير دقيقة', 'اتخاذ قرارات مبنية على البيانات', 'شفافية'] : ['Full compliance', 'Accurate reporting', 'Data-driven decisions', 'Transparency']
    },
    {
      id: 'workforce-planning',
      icon: BarChart3,
      title: language === 'ar' ? 'تخطيط القوى العاملة' : 'Workforce Planning',
      description: language === 'ar' ? 'التخطيط الاستراتيجي للموارد البشرية وتحليل الاحتياجات المستقبلية' : 'Strategic HR planning and future workforce needs analysis',
      tools: language === 'ar' ? ['تحليل الاحتياجات', 'نمذجة القوى العاملة', 'التنبؤ بالمهارات', 'تخطيط الميزانية'] : ['Needs Analysis', 'Workforce Modeling', 'Skills Forecasting', 'Budget Planning'],
      usage: language === 'ar' ? 'تحليل الوضع الحالي ← توقع الاحتياجات ← تخطيط الاستراتيجيات ← تنفيذ الخطط ← مراقبة النتائج' : 'Analyze current state → Forecast needs → Plan strategies → Implement plans → Monitor results',
      benefits: language === 'ar' ? ['تخطيط استراتيجي', 'تحسين الكفاءة', 'إدارة التكاليف', 'الاستعداد للمستقبل'] : ['Strategic planning', 'Efficiency optimization', 'Cost management', 'Future readiness']
    },
    {
      id: 'hse-management',
      icon: Shield,
      title: language === 'ar' ? 'الصحة والسلامة والبيئة' : 'Health, Safety & Environment',
      description: language === 'ar' ? 'إدارة شاملة للصحة المهنية والسلامة والمتطلبات البيئية' : 'Comprehensive occupational health, safety, and environmental requirements management',
      tools: language === 'ar' ? ['إدارة الحوادث', 'تقييم المخاطر', 'التدريب الأمني', 'مراقبة الامتثال'] : ['Incident Management', 'Risk Assessment', 'Safety Training', 'Compliance Monitoring'],
      usage: language === 'ar' ? 'تقييم المخاطر ← وضع الإجراءات ← تدريب الموظفين ← مراقبة الامتثال ← تحسين مستمر' : 'Assess risks → Set procedures → Train employees → Monitor compliance → Continuous improvement',
      benefits: language === 'ar' ? ['بيئة عمل آمنة', 'امتثال تنظيمي', 'تقليل الحوادث', 'حماية الموظفين'] : ['Safe workplace', 'Regulatory compliance', 'Incident reduction', 'Employee protection']
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
    <div className={`container mx-auto p-6 space-y-6 max-w-6xl ${isRTL ? 'rtl' : 'ltr'}`}>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hr-modules" className="gap-2">
            <Users className="h-4 w-4" />
            {language === 'ar' ? 'وحدات الموارد البشرية (14)' : 'HR Modules (14)'}
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Settings className="h-4 w-4" />
            {language === 'ar' ? 'أدوات التكامل (26)' : 'Integration Tools (26)'}
          </TabsTrigger>
          <TabsTrigger value="user-management" className="gap-2">
            <UserCheck className="h-4 w-4" />
            {language === 'ar' ? 'إدارة المستخدمين والأدوار' : 'User Management & Roles'}
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

        {/* User Management & Roles Tab */}
        <TabsContent value="user-management" className="space-y-6">
          {/* User Role Hierarchy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {language === 'ar' ? 'هيكل أدوار المستخدمين' : 'User Role Hierarchy'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'تعريف أدوار المستخدمين مع تكوينات الصلاحيات المرنة لجميع الوحدات والأدوات'
                  : 'Define user roles with flexible permission configurations for all modules and tools'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    role: 'super_admin',
                    icon: Shield,
                    title: language === 'ar' ? 'مدير النظام الرئيسي' : 'Super Admin',
                    description: language === 'ar' ? 'مدير النظام مع الوصول الكامل لجميع الوحدات والأدوات وإدارة المستخدمين' : 'System administrator with full access to all modules, tools, and user management',
                    access: language === 'ar' ? 'الوصول الكامل للوحدات والأدوات' : 'Full access to all modules and tools',
                    color: 'bg-red-500'
                  },
                  {
                    role: 'hrbp',
                    icon: Users,
                    title: language === 'ar' ? 'شريك الموارد البشرية' : 'HR Business Partner',
                    description: language === 'ar' ? 'شريك الموارد البشرية مع الوصول الشامل لوحدات الموارد البشرية وإدارة الفرق' : 'HR Business Partner with comprehensive HR module access and team management',
                    access: language === 'ar' ? 'الوصول الكامل لوحدات الموارد البشرية' : 'Full HR modules access',
                    color: 'bg-blue-500'
                  },
                  {
                    role: 'hr_manager',
                    icon: Building,
                    title: language === 'ar' ? 'مدير الموارد البشرية' : 'HR Manager',
                    description: language === 'ar' ? 'مدير الموارد البشرية مع إشراف على الأقسام والمسؤوليات التشغيلية' : 'HR Manager with departmental oversight and operational responsibilities',
                    access: language === 'ar' ? 'الوصول للقسم مع صلاحيات الموافقة' : 'Departmental access with approval authorities',
                    color: 'bg-green-500'
                  },
                  {
                    role: 'line_manager',
                    icon: UserCheck,
                    title: language === 'ar' ? 'المدير المباشر' : 'Line Manager',
                    description: language === 'ar' ? 'المشرف المباشر مع إشراف على الفريق ومسؤوليات الموافقة' : 'Direct supervisor with team oversight and approval responsibilities',
                    access: language === 'ar' ? 'الوصول للفريق مع قدرات الموافقة' : 'Team access with approval capabilities',
                    color: 'bg-yellow-500'
                  },
                  {
                    role: 'employee',
                    icon: Users,
                    title: language === 'ar' ? 'موظف' : 'Employee',
                    description: language === 'ar' ? 'موظف عادي مع وصول الخدمة الذاتية وإدارة البيانات الشخصية' : 'Standard employee with self-service access and personal data management',
                    access: language === 'ar' ? 'وحدات الخدمة الذاتية والبيانات الشخصية فقط' : 'Self-service modules and personal data only',
                    color: 'bg-purple-500'
                  },
                  {
                    role: 'it_admin',
                    icon: Settings,
                    title: language === 'ar' ? 'مدير تقنية المعلومات' : 'IT Administrator',
                    description: language === 'ar' ? 'مدير تقنية المعلومات مع الوصول التقني للنظام وإدارة التكامل' : 'IT Administrator with technical system access and integration management',
                    access: language === 'ar' ? 'الوصول للوحدات التقنية وأدوات التكامل' : 'Technical modules and integration tools access',
                    color: 'bg-gray-500'
                  }
                ].map((userRole) => (
                  <Card key={userRole.role} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${userRole.color} text-white`}>
                          <userRole.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{userRole.title}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {userRole.role}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <p className="text-xs text-muted-foreground">
                        {userRole.description}
                      </p>
                      <div className="space-y-2">
                        <div className="text-xs font-medium">
                          {language === 'ar' ? 'مستوى الوصول:' : 'Access Level:'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {userRole.access}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Authority Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="h-5 w-5" />
                {language === 'ar' ? 'مصفوفة الصلاحيات التفاعلية' : 'Interactive Authority Matrix'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'إدارة الصلاحيات التفصيلية لجميع الأدوار عبر وحدات الموارد البشرية وأدوات التكامل'
                  : 'Manage granular permissions for all roles across HR modules and integration tools'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* HR Modules Permissions Matrix */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {language === 'ar' ? 'صلاحيات وحدات الموارد البشرية' : 'HR Modules Permissions'}
                  </h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-40">
                            {language === 'ar' ? 'الوحدة' : 'Module'}
                          </TableHead>
                          <TableHead className="text-center">
                            {language === 'ar' ? 'مدير النظام' : 'Super Admin'}
                          </TableHead>
                          <TableHead className="text-center">
                            {language === 'ar' ? 'شريك الموارد البشرية' : 'HRBP'}
                          </TableHead>
                          <TableHead className="text-center">
                            {language === 'ar' ? 'مدير الموارد البشرية' : 'HR Manager'}
                          </TableHead>
                          <TableHead className="text-center">
                            {language === 'ar' ? 'المدير المباشر' : 'Line Manager'}
                          </TableHead>
                          <TableHead className="text-center">
                            {language === 'ar' ? 'موظف' : 'Employee'}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          {
                            module: language === 'ar' ? 'البيانات الأساسية للموظفين' : 'Employee Master Data',
                            permissions: [
                              { role: 'super_admin', level: 'full' },
                              { role: 'hrbp', level: 'full' },
                              { role: 'hr_manager', level: 'partial' },
                              { role: 'line_manager', level: 'read' },
                              { role: 'employee', level: 'own' }
                            ]
                          },
                          {
                            module: language === 'ar' ? 'معالجة الرواتب' : 'Payroll Processing',
                            permissions: [
                              { role: 'super_admin', level: 'full' },
                              { role: 'hrbp', level: 'full' },
                              { role: 'hr_manager', level: 'read' },
                              { role: 'line_manager', level: 'none' },
                              { role: 'employee', level: 'own' }
                            ]
                          },
                          {
                            module: language === 'ar' ? 'إدارة الأداء' : 'Performance Management',
                            permissions: [
                              { role: 'super_admin', level: 'full' },
                              { role: 'hrbp', level: 'full' },
                              { role: 'hr_manager', level: 'full' },
                              { role: 'line_manager', level: 'team' },
                              { role: 'employee', level: 'own' }
                            ]
                          },
                          {
                            module: language === 'ar' ? 'الوقت والحضور' : 'Time & Attendance',
                            permissions: [
                              { role: 'super_admin', level: 'full' },
                              { role: 'hrbp', level: 'partial' },
                              { role: 'hr_manager', level: 'partial' },
                              { role: 'line_manager', level: 'team' },
                              { role: 'employee', level: 'own' }
                            ]
                          }
                        ].map((row, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {row.module}
                            </TableCell>
                            {row.permissions.map((perm, permIndex) => (
                              <TableCell key={permIndex} className="text-center">
                                <Badge 
                                  variant={
                                    perm.level === 'full' ? 'default' :
                                    perm.level === 'partial' ? 'secondary' :
                                    perm.level === 'team' ? 'outline' :
                                    perm.level === 'own' ? 'outline' :
                                    'destructive'
                                  }
                                  className="text-xs"
                                >
                                  {perm.level === 'full' && (language === 'ar' ? 'كامل' : 'Full')}
                                  {perm.level === 'partial' && (language === 'ar' ? 'جزئي' : 'Partial')}
                                  {perm.level === 'team' && (language === 'ar' ? 'الفريق' : 'Team')}
                                  {perm.level === 'own' && (language === 'ar' ? 'شخصي' : 'Own')}
                                  {perm.level === 'read' && (language === 'ar' ? 'قراءة' : 'Read')}
                                  {perm.level === 'none' && (language === 'ar' ? 'لا يوجد' : 'None')}
                                </Badge>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Integration Tools Permissions */}
                <div className="pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {language === 'ar' ? 'صلاحيات أدوات التكامل' : 'Integration Tools Permissions'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        category: language === 'ar' ? 'أدوات التواصل' : 'Communication Tools',
                        tools: ['Microsoft Teams', 'Slack', 'WhatsApp Business'],
                        permissions: {
                          super_admin: 'configure',
                          hrbp: 'use',
                          hr_manager: 'use',
                          line_manager: 'use',
                          employee: 'use',
                          it_admin: 'configure'
                        }
                      },
                      {
                        category: language === 'ar' ? 'إدارة المستندات' : 'Document Management',
                        tools: ['SharePoint', 'Google Drive', 'DocuSign'],
                        permissions: {
                          super_admin: 'configure',
                          hrbp: 'manage',
                          hr_manager: 'use',
                          line_manager: 'use',
                          employee: 'use',
                          it_admin: 'configure'
                        }
                      },
                      {
                        category: language === 'ar' ? 'التحليلات وذكاء الأعمال' : 'Analytics & BI',
                        tools: ['Power BI', 'Tableau', 'Google Analytics'],
                        permissions: {
                          super_admin: 'configure',
                          hrbp: 'create',
                          hr_manager: 'use',
                          line_manager: 'use',
                          employee: 'none',
                          it_admin: 'configure'
                        }
                      }
                    ].map((category, index) => (
                      <Card key={index} className="border-dashed">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">{category.category}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {category.tools.map((tool, toolIndex) => (
                              <div key={toolIndex} className="text-xs text-muted-foreground">
                                {tool}
                              </div>
                            ))}
                            <div className="pt-2 space-y-1">
                              {Object.entries(category.permissions).map(([role, permission]) => (
                                <div key={role} className="flex justify-between items-center text-xs">
                                  <span className="capitalize">{role.replace('_', ' ')}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {permission}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role-Based Help Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {language === 'ar' ? 'محتوى المساعدة حسب الدور' : 'Role-Based Help Content'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'محتوى مساعدة مخصص ومرشد حسب دور المستخدم وصلاحياته'
                  : 'Personalized help content and guidance based on user role and permissions'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    role: 'super_admin',
                    title: language === 'ar' ? 'مساعدة مدير النظام' : 'Super Admin Help',
                    topics: language === 'ar' 
                      ? ['إدارة المستخدمين', 'تكوين النظام', 'إعدادات الأمان', 'إعداد التكامل']
                      : ['User Management', 'System Configuration', 'Security Settings', 'Integration Setup']
                  },
                  {
                    role: 'hrbp',
                    title: language === 'ar' ? 'مساعدة شريك الموارد البشرية' : 'HRBP Help',
                    topics: language === 'ar' 
                      ? ['إدارة الموظفين', 'عمليات الرواتب', 'تتبع الامتثال', 'تحليلات التقارير']
                      : ['Employee Management', 'Payroll Operations', 'Compliance Tracking', 'Reporting Analytics']
                  },
                  {
                    role: 'hr_manager',
                    title: language === 'ar' ? 'مساعدة مدير الموارد البشرية' : 'HR Manager Help',
                    topics: language === 'ar' 
                      ? ['إدارة القسم', 'التوظيف والتعيين', 'تطوير التدريب', 'التقارير التشغيلية']
                      : ['Department Management', 'Recruitment & Hiring', 'Training Development', 'Operational Reports']
                  },
                  {
                    role: 'employee',
                    title: language === 'ar' ? 'مساعدة الموظف' : 'Employee Help',
                    topics: language === 'ar' 
                      ? ['الخدمة الذاتية', 'تحديث البيانات الشخصية', 'تقديم الطلبات', 'الوصول للتعلم']
                      : ['Self Service', 'Personal Data Updates', 'Request Submission', 'Learning Access']
                  }
                ].map((helpSection, index) => (
                  <Card key={index} className="border-dashed">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        {helpSection.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {helpSection.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {topic}
                          </div>
                        ))}
                        <Button size="sm" variant="outline" className="w-full mt-3">
                          {language === 'ar' ? 'عرض الدليل الكامل' : 'View Complete Guide'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security & Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {language === 'ar' ? 'الأمان والامتثال' : 'Security & Compliance'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'ميزات الأمان وتتبع الامتثال مع التدقيق الآلي'
                  : 'Security features and compliance tracking with automated auditing'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      {language === 'ar' ? 'المصادقة المتعددة' : 'Multi-Factor Authentication'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' 
                        ? 'أمان إضافي مع التحقق عبر الرسائل النصية والبريد الإلكتروني'
                        : 'Enhanced security with SMS and email verification'
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      {language === 'ar' ? 'سجل التدقيق' : 'Audit Trail'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' 
                        ? 'تتبع شامل لجميع الأنشطة وتغييرات الصلاحيات'
                        : 'Comprehensive tracking of all activities and permission changes'
                      }
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === 'ar' ? 'مراقبة الامتثال' : 'Compliance Monitoring'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' 
                        ? 'مراقبة آلية للامتثال مع التنبيهات والتقارير'
                        : 'Automated compliance monitoring with alerts and reporting'
                      }
                    </p>
                  </CardContent>
                </Card>
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
      
      <ModuleDocumentUploader moduleKey="help.interactiveGuide" />
      <AqlHRAIAssistant moduleContext="help.interactiveGuide" />
      
      <UniversalAIIntegrator 
        pageType="general" 
        moduleName="help-center" 
        companyId="demo-company" 
        enabledFeatures={['contextual-help', 'interactive-guides', 'smart-assistance', 'knowledge-management']}
      />
    </div>
  );
};

export default Help;