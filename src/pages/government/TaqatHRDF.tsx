import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { FileUploadSystem } from "@/components/government/FileUploadSystem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Download,
  Upload,
  Eye,
  BookOpen
} from "lucide-react";

const TaqatHRDF = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const stats = [
    {
      title: isRTL ? 'برامج تطوير نشطة' : 'Active Development Programs',
      value: '1,247',
      icon: BookOpen,
      variant: "primary" as const,
      trend: { value: isRTL ? '+89 هذا الشهر' : '+89 this month', isPositive: true }
    },
    {
      title: isRTL ? 'موظفين في التدريب' : 'Employees in Training',
      value: '8,532',
      icon: Users,
      variant: "success" as const,
      trend: { value: isRTL ? '+22% نمو' : '+22% growth', isPositive: true }
    },
    {
      title: isRTL ? 'معدل إكمال التدريب' : 'Training Completion Rate',
      value: '91.4%',
      icon: TrendingUp,
      variant: "accent" as const,
      trend: { value: isRTL ? '+3.2% تحسن' : '+3.2% improvement', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات تمويل معلقة' : 'Pending Funding Requests',
      value: '124',
      icon: AlertTriangle,
      variant: "warning" as const,
      trend: { value: isRTL ? '-15 هذا الأسبوع' : '-15 this week', isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: isRTL ? 'تحميل خطط التدريب' : 'Upload Training Plans',
      description: isRTL ? 'رفع خطط التطوير والتدريب' : 'Upload development and training plans',
      icon: Upload,
      color: "bg-blue-500",
      onClick: () => console.log('Upload training plans')
    },
    {
      title: isRTL ? 'تحميل تقارير التقدم' : 'Download Progress Reports',
      description: isRTL ? 'تحميل تقارير تقدم التدريب' : 'Download training progress reports',
      icon: Download,
      color: "bg-green-500",
      onClick: () => console.log('Download progress reports')
    },
    {
      title: isRTL ? 'مراجعة البرامج' : 'Review Programs',
      description: isRTL ? 'مراجعة برامج التطوير الحالية' : 'Review current development programs',
      icon: Eye,
      color: "bg-purple-500",
      onClick: () => console.log('Review programs')
    },
    {
      title: isRTL ? 'إدارة التمويل' : 'Manage Funding',
      description: isRTL ? 'إدارة طلبات التمويل والمنح' : 'Manage funding requests and grants',
      icon: Award,
      color: "bg-orange-500",
      onClick: () => console.log('Manage funding')
    }
  ];

  const documents = [
    {
      name: isRTL ? 'دليل_برامج_طاقات.pdf' : 'taqat_programs_guide.pdf',
      type: isRTL ? 'دليل البرامج' : 'Programs Guide',
      date: '2024-12-19',
      size: '6.2 MB'
    },
    {
      name: isRTL ? 'تقرير_التدريب_الفصلي.xlsx' : 'quarterly_training_report.xlsx',
      type: isRTL ? 'تقرير فصلي' : 'Quarterly Report',
      date: '2024-12-17',
      size: '4.1 MB'
    },
    {
      name: isRTL ? 'معايير_التمويل.pdf' : 'funding_criteria.pdf',
      type: isRTL ? 'معايير التمويل' : 'Funding Criteria',
      date: '2024-12-15',
      size: '2.9 MB'
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
                <Users className="h-5 w-5" />
                {isRTL ? 'طاقات - صندوق تنمية الموارد البشرية' : 'TAQAT - Human Resources Development Fund'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'إدارة برامج تطوير الموارد البشرية والتدريب المهني' 
                  : 'Manage human resources development programs and professional training'
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
                      <span className="text-sm">{isRTL ? 'برامج التدريب المهني' : 'Professional Training Programs'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'تمويل برامج التطوير' : 'Development Program Funding'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'شهادات التدريب المعتمدة' : 'Certified Training Certificates'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'تقييم فعالية التدريب' : 'Training Effectiveness Assessment'}</span>
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
                      <span className="text-sm text-muted-foreground">2024-12-20 13:15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'عدد السجلات' : 'Total Records'}</span>
                      <span className="text-sm font-medium">8,532</span>
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
        <FileUploadSystem
          integrationType="taqat"
          acceptedFileTypes=".pdf,.xlsx,.xls,.doc,.docx"
          maxFileSize={15}
          onUpload={(files) => {
            setUploadedFiles(prev => [...prev, ...files]);
          }}
          title={isRTL ? 'رفع ملفات طاقات' : 'Upload TAQAT Files'}
          description={isRTL 
            ? 'رفع خطط التدريب، تقارير التقدم، وطلبات التمويل' 
            : 'Upload training plans, progress reports, and funding requests'
          }
        />
      )
    }
  ];

  return (
    <div className={isRTL ? 'rtl' : 'ltr'} dir={isRTL ? 'rtl' : 'ltr'}>
      <EnhancedPageLayout
        title={isRTL ? 'طاقات - صندوق تنمية الموارد البشرية' : 'TAQAT - Human Resources Development Fund'}
        description={isRTL 
          ? 'إدارة برامج تطوير الموارد البشرية والتدريب المهني من خلال صندوق تنمية الموارد البشرية' 
          : 'Manage human resources development programs and professional training through the Human Resources Development Fund'
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

export default TaqatHRDF;