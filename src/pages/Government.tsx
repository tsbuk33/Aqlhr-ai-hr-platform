import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
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
  Monitor
} from "lucide-react";

const Government = () => {
  const { t, language } = useLanguage();

  const stats = [
    {
      title: language === 'ar' ? 'التكاملات النشطة' : 'Active Integrations',
      value: 8,
      icon: Globe,
      variant: "primary" as const,
      trend: { value: "2", isPositive: true }
    },
    {
      title: language === 'ar' ? 'حالة الصحة الإجمالية' : 'Overall Health',
      value: '98.7%',
      icon: CheckCircle,
      variant: "success" as const,
      trend: { value: "0.3%", isPositive: true }
    },
    {
      title: language === 'ar' ? 'مستوى الامتثال' : 'Compliance Level',
      value: '100%',
      icon: Shield,
      variant: "accent" as const
    },
    {
      title: language === 'ar' ? 'المعاملات الشهرية' : 'Monthly Transactions',
      value: 12456,
      icon: Activity,
      variant: "warning" as const,
      trend: { value: "8%", isPositive: true }
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
  );
};

export default Government;