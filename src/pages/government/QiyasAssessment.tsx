import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { FileUploadSystem } from "@/components/government/FileUploadSystem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  FileText, 
  Award, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Download,
  Upload,
  Eye,
  Users
} from "lucide-react";

const QiyasAssessment = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const stats = [
    {
      title: isRTL ? 'تقييمات مكتملة' : 'Completed Assessments',
      value: '2,847',
      icon: GraduationCap,
      variant: "primary" as const,
      trend: { value: isRTL ? '+12% هذا الشهر' : '+12% this month', isPositive: true }
    },
    {
      title: isRTL ? 'شهادات صادرة' : 'Certificates Issued',
      value: '1,923',
      icon: Award,
      variant: "success" as const,
      trend: { value: isRTL ? '+8% هذا الشهر' : '+8% this month', isPositive: true }
    },
    {
      title: isRTL ? 'معدل النجاح' : 'Success Rate',
      value: '87.3%',
      icon: CheckCircle,
      variant: "accent" as const,
      trend: { value: isRTL ? '+2.1% تحسن' : '+2.1% improvement', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات معلقة' : 'Pending Requests',
      value: '156',
      icon: AlertTriangle,
      variant: "warning" as const,
      trend: { value: isRTL ? '-5% هذا الأسبوع' : '-5% this week', isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: isRTL ? 'تحميل تقرير التقييم' : 'Upload Assessment Report',
      description: isRTL ? 'رفع تقارير التقييم المهني' : 'Upload professional assessment reports',
      icon: Upload,
      color: "bg-blue-500",
      onClick: () => console.log('Upload assessment report')
    },
    {
      title: isRTL ? 'تحميل نتائج الشهادات' : 'Download Certificate Results',
      description: isRTL ? 'تحميل نتائج الشهادات المهنية' : 'Download professional certificate results',
      icon: Download,
      color: "bg-green-500",
      onClick: () => console.log('Download certificates')
    },
    {
      title: isRTL ? 'عرض التقييمات' : 'View Assessments',
      description: isRTL ? 'مراجعة التقييمات الحالية' : 'Review current assessments',
      icon: Eye,
      color: "bg-purple-500",
      onClick: () => console.log('View assessments')
    },
    {
      title: isRTL ? 'إدارة المرشحين' : 'Manage Candidates',
      description: isRTL ? 'إدارة بيانات المرشحين' : 'Manage candidate information',
      icon: Users,
      color: "bg-orange-500",
      onClick: () => console.log('Manage candidates')
    }
  ];

  const documents = [
    {
      name: isRTL ? 'دليل_التقييم_المهني.pdf' : 'professional_assessment_guide.pdf',
      type: isRTL ? 'دليل التقييم' : 'Assessment Guide',
      date: '2024-12-20',
      size: '4.2 MB'
    },
    {
      name: isRTL ? 'تقرير_الشهادات_2024.xlsx' : 'certificates_report_2024.xlsx',
      type: isRTL ? 'تقرير الشهادات' : 'Certificates Report',
      date: '2024-12-18',
      size: '2.8 MB'
    },
    {
      name: isRTL ? 'نماذج_التقييم.pdf' : 'assessment_forms.pdf',
      type: isRTL ? 'نماذج' : 'Forms',
      date: '2024-12-15',
      size: '1.9 MB'
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
                <GraduationCap className="h-5 w-5" />
                {isRTL ? 'منصة قياس - المركز الوطني للقياس' : 'Qiyas Platform - National Assessment Center'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'إدارة التقييمات المهنية والشهادات للموظفين' 
                  : 'Manage professional assessments and certifications for employees'
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
                      <span className="text-sm">{isRTL ? 'التقييمات المهنية' : 'Professional Assessments'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'الشهادات المعتمدة' : 'Accredited Certificates'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'تقييم الكفاءات' : 'Skills Assessment'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'التقييم اللغوي' : 'Language Assessment'}</span>
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
                      <span className="text-sm text-muted-foreground">2024-12-20 14:30</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'عدد السجلات' : 'Total Records'}</span>
                      <span className="text-sm font-medium">2,847</span>
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
          platform="qiwa"
          moduleType="government"
          acceptedTypes={[".pdf",".xlsx",".xls",".doc",".docx"]}
          maxFileSize={10 * 1024 * 1024}
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
        title={isRTL ? 'منصة قياس - المركز الوطني للقياس' : 'Qiyas Platform - National Assessment Center'}
        description={isRTL 
          ? 'إدارة التقييمات المهنية والشهادات للموظفين من خلال المركز الوطني للقياس' 
          : 'Manage professional assessments and certifications for employees through the National Assessment Center'
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

export default QiyasAssessment;