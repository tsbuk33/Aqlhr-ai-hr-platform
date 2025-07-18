import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { AqlAIFileProcessor } from "@/components/aql/AqlAIFileProcessor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  FileCheck, 
  Award, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Download,
  Upload,
  Eye,
  Search
} from "lucide-react";

const EducationMinistry = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const stats = [
    {
      title: isRTL ? 'شهادات محققة' : 'Verified Degrees',
      value: '15,823',
      icon: Award,
      variant: "primary" as const,
      trend: { value: isRTL ? '+342 هذا الشهر' : '+342 this month', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات التحقق' : 'Verification Requests',
      value: '892',
      icon: FileCheck,
      variant: "success" as const,
      trend: { value: isRTL ? '+15% نمو' : '+15% growth', isPositive: true }
    },
    {
      title: isRTL ? 'معدل التحقق' : 'Verification Rate',
      value: '94.7%',
      icon: CheckCircle,
      variant: "accent" as const,
      trend: { value: isRTL ? '+1.2% تحسن' : '+1.2% improvement', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات معلقة' : 'Pending Requests',
      value: '47',
      icon: AlertTriangle,
      variant: "warning" as const,
      trend: { value: isRTL ? '-8 هذا الأسبوع' : '-8 this week', isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: isRTL ? 'تحميل شهادات التحقق' : 'Upload Verification Certificates',
      description: isRTL ? 'رفع شهادات التحقق من الدرجات العلمية' : 'Upload degree verification certificates',
      icon: Upload,
      color: "bg-blue-500",
      onClick: () => console.log('Upload verification certificates')
    },
    {
      title: isRTL ? 'تحميل تقارير التحقق' : 'Download Verification Reports',
      description: isRTL ? 'تحميل تقارير التحقق المكتملة' : 'Download completed verification reports',
      icon: Download,
      color: "bg-green-500",
      onClick: () => console.log('Download verification reports')
    },
    {
      title: isRTL ? 'البحث في الشهادات' : 'Search Certificates',
      description: isRTL ? 'البحث في قاعدة بيانات الشهادات' : 'Search certificate database',
      icon: Search,
      color: "bg-purple-500",
      onClick: () => console.log('Search certificates')
    },
    {
      title: isRTL ? 'مراجعة الطلبات' : 'Review Requests',
      description: isRTL ? 'مراجعة طلبات التحقق الجديدة' : 'Review new verification requests',
      icon: Eye,
      color: "bg-orange-500",
      onClick: () => console.log('Review requests')
    }
  ];

  const documents = [
    {
      name: isRTL ? 'دليل_التحقق_من_الشهادات.pdf' : 'degree_verification_guide.pdf',
      type: isRTL ? 'دليل التحقق' : 'Verification Guide',
      date: '2024-12-18',
      size: '3.8 MB'
    },
    {
      name: isRTL ? 'تقرير_التحقق_الشهري.xlsx' : 'monthly_verification_report.xlsx',
      type: isRTL ? 'تقرير شهري' : 'Monthly Report',
      date: '2024-12-16',
      size: '2.1 MB'
    },
    {
      name: isRTL ? 'نماذج_طلبات_التحقق.pdf' : 'verification_request_forms.pdf',
      type: isRTL ? 'نماذج' : 'Forms',
      date: '2024-12-14',
      size: '1.6 MB'
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
                {isRTL ? 'وزارة التعليم - التحقق من الدرجات العلمية' : 'Ministry of Education - Degree Verification'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'التحقق من صحة الشهادات والدرجات العلمية للموظفين' 
                  : 'Verify authenticity of certificates and academic degrees for employees'
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
                      <span className="text-sm">{isRTL ? 'التحقق من الدرجات العلمية' : 'Academic Degree Verification'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'التحقق من الشهادات المهنية' : 'Professional Certificate Verification'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'معادلة الشهادات الأجنبية' : 'Foreign Certificate Equivalency'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'تقارير التحقق الرسمية' : 'Official Verification Reports'}</span>
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
                      <span className="text-sm text-muted-foreground">2024-12-20 16:20</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'عدد السجلات' : 'Total Records'}</span>
                      <span className="text-sm font-medium">15,823</span>
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
        <AqlAIFileProcessor
          platform="education_ministry"
          moduleType="government"
          acceptedTypes={[
            ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp",
            ".xlsx", ".xls", ".doc", ".docx", ".ppt", ".pptx", ".txt", ".rtf"
          ]}
          maxFileSize={25 * 1024 * 1024}
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
        title={isRTL ? 'وزارة التعليم - التحقق من الدرجات العلمية' : 'Ministry of Education - Degree Verification'}
        description={isRTL 
          ? 'التحقق من صحة الشهادات والدرجات العلمية للموظفين من خلال وزارة التعليم' 
          : 'Verify authenticity of certificates and academic degrees for employees through Ministry of Education'
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

export default EducationMinistry;