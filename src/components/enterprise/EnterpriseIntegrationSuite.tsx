import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/useLanguageCompat';
import { 
  Building2, 
  Database, 
  MessageSquare, 
  Briefcase, 
  GraduationCap, 
  CreditCard,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Settings
} from 'lucide-react';

interface IntegrationSystem {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'pending';
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
}

export const EnterpriseIntegrationSuite = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [selectedSystem, setSelectedSystem] = useState<IntegrationSystem | null>(null);

  const integrationSystems: IntegrationSystem[] = [
    // HR Management Systems
    {
      id: 'sap-successfactors',
      name: 'SAP SuccessFactors',
      nameAr: 'إس إيه بي سكسيس فاكتورز',
      category: 'hr-systems',
      icon: Building2,
      status: 'disconnected',
      description: 'Complete HR cloud suite with talent management and workforce analytics',
      descriptionAr: 'مجموعة موارد بشرية سحابية شاملة مع إدارة المواهب وتحليل القوى العاملة',
      features: ['Employee Central', 'Performance & Goals', 'Learning Management', 'Recruiting', 'Compensation', 'Succession Planning'],
      featuresAr: ['مركز الموظفين', 'الأداء والأهداف', 'إدارة التعلم', 'التوظيف', 'التعويضات', 'تخطيط الخلافة']
    },
    {
      id: 'oracle-hcm',
      name: 'Oracle HCM Cloud',
      nameAr: 'أوراكل إتش سي إم كلاود',
      category: 'hr-systems',
      icon: Database,
      status: 'disconnected',
      description: 'Oracle\'s comprehensive human capital management solution',
      descriptionAr: 'حل إدارة رأس المال البشري الشامل من أوراكل',
      features: ['Core HR', 'Talent Management', 'Workforce Planning', 'Payroll', 'Time & Labor', 'Benefits'],
      featuresAr: ['الموارد البشرية الأساسية', 'إدارة المواهب', 'تخطيط القوى العاملة', 'الرواتب', 'الوقت والعمل', 'المزايا']
    },
    {
      id: 'adp-workforce',
      name: 'ADP Workforce Now',
      nameAr: 'إيه دي بي وورك فورس ناو',
      category: 'hr-systems',
      icon: Briefcase,
      status: 'disconnected',
      description: 'All-in-one HR solution for mid-market organizations',
      descriptionAr: 'حل شامل للموارد البشرية للمؤسسات متوسطة الحجم',
      features: ['Payroll Processing', 'Benefits Administration', 'Talent Management', 'Time & Attendance', 'Compliance'],
      featuresAr: ['معالجة الرواتب', 'إدارة المزايا', 'إدارة المواهب', 'الوقت والحضور', 'الامتثال']
    },
    {
      id: 'workday',
      name: 'Workday HCM',
      nameAr: 'وورك داي إتش سي إم',
      category: 'hr-systems',
      icon: Building2,
      status: 'disconnected',
      description: 'Cloud-based enterprise management suite for HR and finance',
      descriptionAr: 'مجموعة إدارة المؤسسات السحابية للموارد البشرية والمالية',
      features: ['Human Capital Management', 'Financial Management', 'Planning & Analytics', 'Student Information System'],
      featuresAr: ['إدارة رأس المال البشري', 'الإدارة المالية', 'التخطيط والتحليلات', 'نظام معلومات الطلاب']
    },
    {
      id: 'dynamics-365',
      name: 'Microsoft Dynamics 365',
      nameAr: 'مايكروسوفت دايناميكس ٣٦٥',
      category: 'hr-systems',
      icon: Building2,
      status: 'disconnected',
      description: 'Microsoft\'s business applications platform with HR capabilities',
      descriptionAr: 'منصة تطبيقات الأعمال من مايكروسوفت مع قدرات الموارد البشرية',
      features: ['Talent Management', 'Leave & Absence', 'Benefits', 'Personnel Management', 'Compensation Management'],
      featuresAr: ['إدارة المواهب', 'الإجازات والغياب', 'المزايا', 'إدارة الأفراد', 'إدارة التعويضات']
    },

    // Learning & Development
    {
      id: 'cornerstone',
      name: 'Cornerstone OnDemand',
      nameAr: 'كورنر ستون أون ديماند',
      category: 'learning',
      icon: GraduationCap,
      status: 'disconnected',
      description: 'Learning management and talent development platform',
      descriptionAr: 'منصة إدارة التعلم وتطوير المواهب',
      features: ['Learning Management', 'Performance Management', 'Extended Enterprise', 'Content Anytime', 'Recruiting Suite'],
      featuresAr: ['إدارة التعلم', 'إدارة الأداء', 'المؤسسة الموسعة', 'المحتوى في أي وقت', 'مجموعة التوظيف']
    },
    {
      id: 'linkedin-learning',
      name: 'LinkedIn Learning API',
      nameAr: 'واجهة برمجة تطبيقات لينكد إن ليرنينغ',
      category: 'learning',
      icon: GraduationCap,
      status: 'disconnected',
      description: 'Professional development courses and skill assessments',
      descriptionAr: 'دورات التطوير المهني وتقييم المهارات',
      features: ['Course Library', 'Learning Paths', 'Skill Assessments', 'Certificates', 'Progress Tracking'],
      featuresAr: ['مكتبة الدورات', 'مسارات التعلم', 'تقييم المهارات', 'الشهادات', 'تتبع التقدم']
    },

    // Banking APIs
    {
      id: 'ncb-api',
      name: 'NCB Banking API',
      nameAr: 'واجهة برمجة البنك الأهلي',
      category: 'banking',
      icon: CreditCard,
      status: 'disconnected',
      description: 'National Commercial Bank API for salary transfers and payments',
      descriptionAr: 'واجهة برمجة البنك الأهلي لتحويل الرواتب والمدفوعات',
      features: ['Salary Transfers', 'Account Verification', 'Payment Processing', 'Transaction History', 'Balance Inquiry'],
      featuresAr: ['تحويل الرواتب', 'التحقق من الحساب', 'معالجة المدفوعات', 'تاريخ المعاملات', 'استعلام الرصيد']
    },
    {
      id: 'rajhi-api',
      name: 'Rajhi Banking API',
      nameAr: 'واجهة برمجة مصرف الراجحي',
      category: 'banking',
      icon: CreditCard,
      status: 'disconnected',
      description: 'Al Rajhi Bank API for Islamic banking and payroll services',
      descriptionAr: 'واجهة برمجة مصرف الراجحي للخدمات المصرفية الإسلامية والرواتب',
      features: ['Islamic Banking', 'Salary Processing', 'Corporate Accounts', 'Bulk Transfers', 'Compliance Reports'],
      featuresAr: ['المصرفية الإسلامية', 'معالجة الرواتب', 'الحسابات المؤسسية', 'التحويلات المجمعة', 'تقارير الامتثال']
    },
    {
      id: 'sabb-api',
      name: 'SABB Banking API',
      nameAr: 'واجهة برمجة البنك السعودي البريطاني',
      category: 'banking',
      icon: CreditCard,
      status: 'disconnected',
      description: 'SABB API for corporate banking and employee financial services',
      descriptionAr: 'واجهة برمجة ساب للخدمات المصرفية المؤسسية والخدمات المالية للموظفين',
      features: ['Corporate Banking', 'Employee Cards', 'Loan Services', 'Treasury Management', 'Trade Finance'],
      featuresAr: ['الخدمات المصرفية المؤسسية', 'بطاقات الموظفين', 'خدمات القروض', 'إدارة الخزانة', 'تمويل التجارة']
    },

    // Communication & Collaboration
    {
      id: 'whatsapp-business',
      name: 'WhatsApp Business API',
      nameAr: 'واجهة برمجة واتساب بيزنس',
      category: 'communication',
      icon: MessageSquare,
      status: 'disconnected',
      description: 'WhatsApp Business integration for employee communication',
      descriptionAr: 'تكامل واتساب بيزنس للتواصل مع الموظفين',
      features: ['Message Templates', 'Interactive Messages', 'Media Sharing', 'Webhook Notifications', 'Analytics'],
      featuresAr: ['قوالب الرسائل', 'الرسائل التفاعلية', 'مشاركة الوسائط', 'إشعارات الويب هوك', 'التحليلات']
    },
    {
      id: 'slack-teams',
      name: 'Slack/Teams Integration',
      nameAr: 'تكامل سلاك/تيمز',
      category: 'communication',
      icon: MessageSquare,
      status: 'disconnected',
      description: 'Integration with Slack and Microsoft Teams for workplace collaboration',
      descriptionAr: 'تكامل مع سلاك ومايكروسوفت تيمز للتعاون في مكان العمل',
      features: ['Channel Management', 'Bot Integration', 'File Sharing', 'Meeting Scheduling', 'Workflow Automation'],
      featuresAr: ['إدارة القنوات', 'تكامل البوت', 'مشاركة الملفات', 'جدولة الاجتماعات', 'أتمتة سير العمل']
    }
  ];

  const categories = {
    'hr-systems': { name: 'HR Management Systems', nameAr: 'أنظمة إدارة الموارد البشرية' },
    'learning': { name: 'Learning & Development', nameAr: 'التعلم والتطوير' },
    'banking': { name: 'Saudi Banking APIs', nameAr: 'واجهات برمجة البنوك السعودية' },
    'communication': { name: 'Communication & Collaboration', nameAr: 'التواصل والتعاون' }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      connected: { text: 'Connected', textAr: 'متصل', variant: 'default' as const },
      pending: { text: 'Pending', textAr: 'معلق', variant: 'secondary' as const },
      disconnected: { text: 'Disconnected', textAr: 'غير متصل', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant}>
        {isArabic ? config.textAr : config.text}
      </Badge>
    );
  };

  const connectIntegration = (system: IntegrationSystem) => {
    // Simulate connection process
    console.log(`Connecting to ${system.name}...`);
    // In a real implementation, this would make API calls to establish the connection
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          {isArabic ? 'مجموعة التكامل المؤسسي' : 'Enterprise Integration Suite'}
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {isArabic 
            ? 'اتصال كامل مع النظام البيئي للأطراف الثالثة - أكثر من 10 أنظمة مؤسسية رئيسية ومنصات تعاون'
            : 'Full third-party ecosystem connectivity - 10+ major enterprise systems and collaboration platforms'
          }
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{isArabic ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="hr-systems">{isArabic ? 'أنظمة الموارد البشرية' : 'HR Systems'}</TabsTrigger>
          <TabsTrigger value="banking">{isArabic ? 'الأنظمة المصرفية' : 'Banking'}</TabsTrigger>
          <TabsTrigger value="communication">{isArabic ? 'التواصل' : 'Communication'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(categories).map(([key, category]) => {
              const systemsInCategory = integrationSystems.filter(s => s.category === key);
              const connectedCount = systemsInCategory.filter(s => s.status === 'connected').length;
              
              return (
                <Card key={key} className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {connectedCount}/{systemsInCategory.length}
                    </div>
                    <p className="text-sm font-medium mb-1">
                      {isArabic ? category.nameAr : category.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isArabic ? 'أنظمة متصلة' : 'Connected Systems'}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {Object.keys(categories).map(categoryKey => (
          <TabsContent key={categoryKey} value={categoryKey} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrationSystems
                .filter(system => system.category === categoryKey)
                .map((system) => (
                  <Card key={system.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <system.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {isArabic ? system.nameAr : system.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(system.status)}
                              {getStatusBadge(system.status)}
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => connectIntegration(system)}
                          disabled={system.status === 'connected'}
                          size="sm"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          {isArabic ? 'اتصال' : 'Connect'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {isArabic ? system.descriptionAr : system.description}
                      </p>
                      <div>
                        <h4 className="font-medium mb-2 text-sm">
                          {isArabic ? 'المزايا الرئيسية:' : 'Key Features:'}
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {(isArabic ? system.featuresAr : system.features).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};