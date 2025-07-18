import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  FileCheck, 
  User, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Download,
  Upload,
  Eye,
  Lock
} from "lucide-react";

const InteriorMinistry = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const stats = [
    {
      title: isRTL ? 'تصاريح أمنية صادرة' : 'Security Clearances Issued',
      value: '4,523',
      icon: Shield,
      variant: "primary" as const,
      trend: { value: isRTL ? '+67 هذا الشهر' : '+67 this month', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات التحقق' : 'Verification Requests',
      value: '1,892',
      icon: FileCheck,
      variant: "success" as const,
      trend: { value: isRTL ? '+12% نمو' : '+12% growth', isPositive: true }
    },
    {
      title: isRTL ? 'معدل الموافقة' : 'Approval Rate',
      value: '89.6%',
      icon: CheckCircle,
      variant: "accent" as const,
      trend: { value: isRTL ? '+2.3% تحسن' : '+2.3% improvement', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات معلقة' : 'Pending Requests',
      value: '234',
      icon: AlertTriangle,
      variant: "warning" as const,
      trend: { value: isRTL ? '-18 هذا الأسبوع' : '-18 this week', isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: isRTL ? 'تحميل طلبات التصاريح' : 'Upload Clearance Requests',
      description: isRTL ? 'رفع طلبات التصاريح الأمنية' : 'Upload security clearance requests',
      icon: Upload,
      color: "bg-blue-500",
      onClick: () => console.log('Upload clearance requests')
    },
    {
      title: isRTL ? 'تحميل تقارير الأمان' : 'Download Security Reports',
      description: isRTL ? 'تحميل تقارير التحقق الأمني' : 'Download security verification reports',
      icon: Download,
      color: "bg-green-500",
      onClick: () => console.log('Download security reports')
    },
    {
      title: isRTL ? 'التحقق من الحالة' : 'Check Status',
      description: isRTL ? 'التحقق من حالة الطلبات' : 'Check request status',
      icon: Eye,
      color: "bg-purple-500",
      onClick: () => console.log('Check status')
    },
    {
      title: isRTL ? 'إدارة التصاريح' : 'Manage Clearances',
      description: isRTL ? 'إدارة التصاريح الأمنية النشطة' : 'Manage active security clearances',
      icon: Lock,
      color: "bg-orange-500",
      onClick: () => console.log('Manage clearances')
    }
  ];

  const documents = [
    {
      name: isRTL ? 'دليل_التصاريح_الأمنية.pdf' : 'security_clearances_guide.pdf',
      type: isRTL ? 'دليل التصاريح' : 'Clearances Guide',
      date: '2024-12-19',
      size: '4.8 MB'
    },
    {
      name: isRTL ? 'تقرير_الأمان_الشهري.xlsx' : 'monthly_security_report.xlsx',
      type: isRTL ? 'تقرير أمني' : 'Security Report',
      date: '2024-12-17',
      size: '2.7 MB'
    },
    {
      name: isRTL ? 'نماذج_طلبات_التصاريح.pdf' : 'clearance_request_forms.pdf',
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
                <Shield className="h-5 w-5" />
                {isRTL ? 'وزارة الداخلية - التصاريح الأمنية' : 'Ministry of Interior - Security Clearances'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'إدارة التصاريح الأمنية والتحقق من الخلفيات للموظفين' 
                  : 'Manage security clearances and background checks for employees'
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
                      <span className="text-sm">{isRTL ? 'التصاريح الأمنية' : 'Security Clearances'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'التحقق من الخلفيات' : 'Background Verification'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'تقارير السجل الجنائي' : 'Criminal Record Reports'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'التحقق من الهوية' : 'Identity Verification'}</span>
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
                      <span className="text-sm text-muted-foreground">2024-12-20 12:30</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'عدد السجلات' : 'Total Records'}</span>
                      <span className="text-sm font-medium">4,523</span>
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
        <UniversalDocumentManager
          moduleName="Ministry of Interior - Security Clearances"
          moduleNameAr="وزارة الداخلية - التصاريح الأمنية"
          description="Upload security clearance requests and verification documents"
          descriptionAr="رفع طلبات التصاريح الأمنية ووثائق التحقق"
          platform="interior_ministry"
          moduleType="government"
          acceptedTypes={[".pdf",".jpg",".jpeg",".png",".xlsx",".xls",".doc",".docx"]}
          maxFileSize={20 * 1024 * 1024}
          maxFiles={50}
        />
      )
    }
  ];

  return (
    <div className={isRTL ? 'rtl' : 'ltr'} dir={isRTL ? 'rtl' : 'ltr'}>
      <EnhancedPageLayout
        title={isRTL ? 'وزارة الداخلية - التصاريح الأمنية' : 'Ministry of Interior - Security Clearances'}
        description={isRTL 
          ? 'إدارة التصاريح الأمنية والتحقق من الخلفيات للموظفين من خلال وزارة الداخلية' 
          : 'Manage security clearances and background checks for employees through Ministry of Interior'
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

export default InteriorMinistry;