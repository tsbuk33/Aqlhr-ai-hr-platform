import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { SanadAIFileProcessor } from "@/components/sanad/SanadAIFileProcessor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Download,
  Upload,
  Eye,
  BarChart3
} from "lucide-react";

const NCEIEmployment = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const stats = [
    {
      title: isRTL ? 'فرص عمل نشطة' : 'Active Job Opportunities',
      value: '3,842',
      icon: Briefcase,
      variant: "primary" as const,
      trend: { value: isRTL ? '+156 هذا الأسبوع' : '+156 this week', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات توظيف' : 'Employment Applications',
      value: '12,367',
      icon: Users,
      variant: "success" as const,
      trend: { value: isRTL ? '+28% نمو' : '+28% growth', isPositive: true }
    },
    {
      title: isRTL ? 'معدل التوظيف الناجح' : 'Successful Placement Rate',
      value: '76.8%',
      icon: TrendingUp,
      variant: "accent" as const,
      trend: { value: isRTL ? '+4.1% تحسن' : '+4.1% improvement', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات قيد المراجعة' : 'Under Review',
      value: '298',
      icon: AlertTriangle,
      variant: "warning" as const,
      trend: { value: isRTL ? '-12 اليوم' : '-12 today', isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: isRTL ? 'تحميل بيانات التوظيف' : 'Upload Employment Data',
      description: isRTL ? 'رفع بيانات فرص العمل والطلبات' : 'Upload job opportunities and application data',
      icon: Upload,
      color: "bg-blue-500",
      onClick: () => console.log('Upload employment data')
    },
    {
      title: isRTL ? 'تحميل تقارير التوظيف' : 'Download Employment Reports',
      description: isRTL ? 'تحميل تقارير سوق العمل' : 'Download labor market reports',
      icon: Download,
      color: "bg-green-500",
      onClick: () => console.log('Download employment reports')
    },
    {
      title: isRTL ? 'تحليل سوق العمل' : 'Analyze Labor Market',
      description: isRTL ? 'تحليل اتجاهات سوق العمل' : 'Analyze labor market trends',
      icon: BarChart3,
      color: "bg-purple-500",
      onClick: () => console.log('Analyze labor market')
    },
    {
      title: isRTL ? 'مراجعة الطلبات' : 'Review Applications',
      description: isRTL ? 'مراجعة طلبات التوظيف الجديدة' : 'Review new employment applications',
      icon: Eye,
      color: "bg-orange-500",
      onClick: () => console.log('Review applications')
    }
  ];

  const documents = [
    {
      name: isRTL ? 'تقرير_سوق_العمل_الفصلي.pdf' : 'quarterly_labor_market_report.pdf',
      type: isRTL ? 'تقرير سوق العمل' : 'Labor Market Report',
      date: '2024-12-18',
      size: '5.7 MB'
    },
    {
      name: isRTL ? 'إحصائيات_التوظيف_2024.xlsx' : 'employment_statistics_2024.xlsx',
      type: isRTL ? 'إحصائيات التوظيف' : 'Employment Statistics',
      date: '2024-12-16',
      size: '3.2 MB'
    },
    {
      name: isRTL ? 'دليل_خدمات_التوظيف.pdf' : 'employment_services_guide.pdf',
      type: isRTL ? 'دليل الخدمات' : 'Services Guide',
      date: '2024-12-14',
      size: '2.4 MB'
    }
  ];

  const tabs = [
    {
      id: 'overview',
      label: isRTL ? 'نظرة عامة' : 'Overview',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {isRTL ? 'المركز الوطني لمعلومات التوظيف' : 'NCEI - National Centre for Employment Information'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'إدارة معلومات التوظيف وتحليل سوق العمل السعودي' 
                  : 'Manage employment information and analyze Saudi labor market'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">{isRTL ? 'الخدمات المتاحة' : 'Available Services'}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'معلومات فرص العمل' : 'Job Opportunities Information'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'تحليل سوق العمل' : 'Labor Market Analysis'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'إحصائيات التوظيف' : 'Employment Statistics'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'تقارير المهارات المطلوبة' : 'Skills Demand Reports'}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">{isRTL ? 'حالة التكامل' : 'Integration Status'}</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'حالة الاتصال' : 'Connection Status'}</span>
                      <Badge className="bg-success text-white">{isRTL ? 'متصل' : 'Connected'}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'آخر مزامنة' : 'Last Sync'}</span>
                      <span className="text-sm text-muted-foreground">2024-12-20 15:40</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'عدد السجلات' : 'Total Records'}</span>
                      <span className="text-sm font-medium">12,367</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'upload',
      label: isRTL ? 'رفع الملفات' : 'File Upload',
      content: (
        <SanadAIFileProcessor
          platform="ncei"
          moduleType="government"
          acceptedTypes={[
            ".pdf", ".xlsx", ".xls", ".doc", ".docx", ".csv", ".tsv", 
            ".txt", ".rtf", ".png", ".jpg", ".jpeg", ".zip", ".rar"
          ]}
          maxFileSize={50 * 1024 * 1024}
          onFileProcessed={(files) => {
            setUploadedFiles(prev => [...prev, files]);
          }}
        />
      )
    }
  ];

  return (
    <div className={isRTL ? 'rtl' : 'ltr'} dir={isRTL ? 'rtl' : 'ltr'}>
      <EnhancedPageLayout
        title={isRTL ? 'المركز الوطني لمعلومات التوظيف' : 'NCEI - National Centre for Employment Information'}
        description={isRTL 
          ? 'إدارة معلومات التوظيف وتحليل سوق العمل السعودي من خلال المركز الوطني لمعلومات التوظيف' 
          : 'Manage employment information and analyze Saudi labor market through the National Centre for Employment Information'
        }
        showUserInfo={true}
        showQuickActions={true}
        showTabs={true}
        stats={stats}
        quickActions={quickActions}
        documents={documents}
        tabs={tabs}
      />
    </div>
  );
};

export default NCEIEmployment;