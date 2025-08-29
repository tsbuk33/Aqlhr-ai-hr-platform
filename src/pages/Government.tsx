import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import AIFloatingAssistant from '@/components/ai/AIFloatingAssistant';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { AqlHRAIAssistant } from '@/components/ai';
import { AITestDemo } from '@/components/AITestDemo';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { DocumentUploader } from '@/components/docs/DocumentUploader';
import PageHeader from "@/components/common/PageHeader";
import { 
  useRegions, 
  useCities, 
  useSectors, 
  useGovEntities, 
  useTop500Companies 
} from "@/hooks/useSaudiReference";
import { 
  Globe, 
  Shield, 
  FileCheck, 
  CreditCard,
  Building,
  CheckCircle,
  AlertTriangle,
  Activity,
  Database,
  Settings,
  Monitor,
  MapPin,
  Users
} from "lucide-react";

const Government = () => {
  const { t, language } = useLanguage();
  const isArabic = language === 'ar';

  const stats = [
    {
      title: language === 'ar' ? 'منصات حكومية متصلة' : 'Gov Platforms Connected',
      value: 8,
      icon: Activity,
      variant: "primary" as const,
      trend: { value: "21 Government Platforms", isPositive: true }
    },
    {
      title: language === 'ar' ? 'امتثال وزارة العمل' : 'MOL Compliance',
      value: '100%',
      icon: CheckCircle,
      variant: "success" as const,
      trend: { value: "All requirements met", isPositive: true }
    },
    {
      title: language === 'ar' ? 'تحديثات تلقائية' : 'Auto Updates',
      value: language === 'ar' ? '24/7 نشط' : '24/7 Active',
      icon: Activity,
      variant: "accent" as const,
      trend: { value: "Real-time sync", isPositive: true }
    },
    {
      title: language === 'ar' ? 'تقييم الامتثال الشامل' : 'Overall Compliance Score',
      value: '98.9%',
      icon: Shield,
      variant: "warning" as const,
      trend: { value: "Above target", isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: language === 'ar' ? 'تكامل قوى' : 'Qiwa Integration',
      description: language === 'ar' ? 'عقود العمل والتنقلات' : 'Employment contracts and transfers',
      icon: Building,
      color: "bg-blue-500",
      onClick: () => console.log('Navigate to Qiwa')
    },
    {
      title: language === 'ar' ? 'تكامل التأمينات الاجتماعية' : 'GOSI Integration',
      description: language === 'ar' ? 'التأمين وتقديم الرواتب' : 'Insurance and payroll submissions',
      icon: Shield,
      color: "bg-green-500",
      onClick: () => console.log('Navigate to GOSI')
    },
    {
      title: language === 'ar' ? 'منصة أبشر' : 'Absher Platform',
      description: language === 'ar' ? 'التحقق من الهوية والتحقق' : 'Identity verification and validation',
      icon: CheckCircle,
      color: "bg-purple-500",
      onClick: () => console.log('Navigate to Absher')
    },
    {
      title: language === 'ar' ? 'منصة مداد' : 'Mudad Platform',
      description: language === 'ar' ? 'نظام حماية الأجور' : 'Wage protection system',
      icon: CreditCard,
      color: "bg-orange-500",
      onClick: () => console.log('Navigate to Mudad')
    }
  ];

  const documents = [
    {
      name: language === 'ar' ? 'دليل_التكاملات_الحكومية.pdf' : 'government_integrations_guide.pdf',
      type: language === 'ar' ? 'دليل التكامل' : 'Integration Guide',
      date: '2024-12-20',
      size: '3.8 MB'
    },
    {
      name: language === 'ar' ? 'تقرير_حالة_التكاملات.xlsx' : 'integration_status_report.xlsx',
      type: language === 'ar' ? 'تقرير الحالة' : 'Status Report',
      date: '2024-12-30',
      size: '1.2 MB'
    },
    {
      name: language === 'ar' ? 'مستندات_الامتثال_2024.pdf' : 'compliance_documentation_2024.pdf',
      type: language === 'ar' ? 'مستندات الامتثال' : 'Compliance Docs',
      date: '2024-12-15',
      size: '5.1 MB'
    }
  ];

  // Saudi Reference Database status
  const { data: regionsData } = useRegions();
  const { data: citiesData } = useCities();
  const { data: sectorsData } = useSectors();
  const { data: govEntitiesData } = useGovEntities();
  const { data: companiesData } = useTop500Companies({ limit: 10 });

  const tabs = [
    {
      id: 'overview',
      label: language === 'ar' ? 'نظرة عامة' : 'Overview',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    {language === 'ar' ? 'تكامل قوى' : 'Qiwa Integration'}
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    {language === 'ar' ? 'متصل' : 'Connected'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'عقود العمل والتنقلات' : 'Employment contracts and transfers'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? '98.1% صحة النظام' : '98.1% health'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-success" />
                    {language === 'ar' ? 'تكامل التأمينات' : 'GOSI Integration'}
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'التأمين وتقديم الرواتب' : 'Insurance and payroll submissions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? '99.2% صحة النظام' : '99.2% health'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    {language === 'ar' ? 'منصة أبشر' : 'Absher Platform'}
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    {language === 'ar' ? 'متصل' : 'Connected'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'التحقق من الهوية والتحقق' : 'Identity verification and validation'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? '97.8% صحة النظام' : '97.8% health'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-warning" />
                    {language === 'ar' ? 'منصة مداد' : 'Mudad Platform'}
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    {language === 'ar' ? 'متوافق' : 'Compliant'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'نظام حماية الأجور' : 'Wage protection system'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? '100% امتثال' : '100% compliance'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'reference-data',
      label: language === 'ar' ? 'البيانات المرجعية' : 'Reference Data',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'قاعدة البيانات المرجعية السعودية' : 'Saudi Reference Database'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'بيانات مرجعية شاملة للمناطق والمدن والقطاعات والشركات السعودية' : 'Comprehensive reference data for Saudi regions, cities, sectors, and companies'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{regionsData?.data?.length || 13}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المناطق' : 'Regions'}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Building className="h-8 w-8 mx-auto mb-2 text-success" />
                  <div className="text-2xl font-bold">{citiesData?.data?.length || 24}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'المدن' : 'Cities'}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">{sectorsData?.data?.length || 20}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'القطاعات' : 'Sectors'}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <div className="text-2xl font-bold">{companiesData?.data?.length || 15}</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'أكبر الشركات' : 'Top Companies'}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold">{language === 'ar' ? 'الجهات الحكومية المتكاملة' : 'Integrated Government Entities'}</h4>
                <div className="grid gap-3">
                  {govEntitiesData?.data?.slice(0, 5).map((entity: any) => (
                    <div key={entity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="font-medium">
                          {language === 'ar' ? entity.name_ar : entity.name_en}
                        </span>
                      </div>
                      <Badge className="bg-success text-white">
                        {language === 'ar' ? 'متاح' : 'Available'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'status',
      label: language === 'ar' ? 'حالة النظام' : 'System Status',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'مراقبة حالة النظام' : 'System Status Monitoring'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'مراقبة مباشرة لحالة جميع التكاملات الحكومية' : 'Real-time monitoring of all government integrations'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-medium">{language === 'ar' ? 'قوى - عقود العمل' : 'Qiwa - Employment Contracts'}</span>
                  </div>
                  <Badge className="bg-success text-white">
                    {language === 'ar' ? 'تعمل' : 'Operational'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-medium">{language === 'ar' ? 'التأمينات - الرواتب' : 'GOSI - Payroll'}</span>
                  </div>
                  <Badge className="bg-success text-white">
                    {language === 'ar' ? 'تعمل' : 'Operational'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-medium">{language === 'ar' ? 'أبشر - التحقق من الهوية' : 'Absher - Identity Verification'}</span>
                  </div>
                  <Badge className="bg-success text-white">
                    {language === 'ar' ? 'تعمل' : 'Operational'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-medium">{language === 'ar' ? 'مداد - حماية الأجور' : 'Mudad - Wage Protection'}</span>
                  </div>
                  <Badge className="bg-success text-white">
                    {language === 'ar' ? 'تعمل' : 'Operational'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className={`container mx-auto p-6 space-y-6 max-w-7xl ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <PageHeader 
        title={isArabic ? 'التكاملات الحكومية' : 'Government Integrations'}
        description={isArabic ? 'ربط سلس مع الأنظمة الحكومية السعودية' : 'Seamless integration with Saudi government systems'}
      />

      <div className="space-y-6">
      <AITestDemo />
      
      <AIInsightCard 
        moduleContext="government"
        companyId="demo-company"
        className="mb-6"
      />
      
      <EnhancedPageLayout
        title={language === 'ar' ? 'التكاملات الحكومية' : 'Government Integrations'}
        description={language === 'ar' ? 'تكامل سلس مع الأنظمة الحكومية السعودية' : 'Seamless integration with Saudi government systems'}
        showUserInfo={true}
        showQuickActions={true}
        showTabs={true}
        stats={stats}
        quickActions={quickActions}
        documents={documents}
        tabs={tabs}
      />
      
      {/* Government Document Management - PDPL Safe */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {language === 'ar' ? 'إدارة مستندات الجهات الحكومية' : 'Government Documents Management'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'رفع وإدارة المستندات الحكومية مع الامتثال للائحة حماية البيانات الشخصية'
                : 'Upload and manage government documents with PDPL compliance'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Qiwa Documents */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">{language === 'ar' ? 'مستندات قيوى' : 'Qiwa Documents'}</h4>
                <DocumentUploader 
                  module="qiwa"
                  className="border-primary/20"
                />
              </div>
              
              {/* GOSI Documents */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">{language === 'ar' ? 'مستندات التأمينات الاجتماعية' : 'GOSI Documents'}</h4>
                <DocumentUploader 
                  module="gosi"
                  className="border-green-500/20"
                />
              </div>
              
              {/* Absher Documents */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">{language === 'ar' ? 'مستندات أبشر' : 'Absher Documents'}</h4>
                <DocumentUploader 
                  module="absher"
                  className="border-blue-500/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AIFloatingAssistant 
        moduleContext="government"
        companyId="demo-company"
        currentPageData={{ connectedPlatforms: 8, complianceScore: 98.9 }}
      />

      <AqlHRAIAssistant 
        moduleContext="government" 
        companyId="demo-company"
      />
      
      {/* AI Integration for Government Compliance */}
      <UniversalAIIntegrator 
        pageType="government" 
        moduleName="government-compliance" 
        companyId="demo-company" 
        enabledFeatures={['compliance-monitoring', 'government-integration', 'saudi-regulations', 'regulatory-compliance']}
      />
      </div>
    </div>
  );
};

export default Government;