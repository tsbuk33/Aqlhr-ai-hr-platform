import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { FileUploadSystem } from "@/components/government/FileUploadSystem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  QrCode, 
  Heart, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Download,
  Upload,
  Eye,
  UserCheck
} from "lucide-react";

const TawakkalnaCompliance = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const stats = [
    {
      title: isRTL ? 'حالات صحية محققة' : 'Verified Health Status',
      value: '9,234',
      icon: Heart,
      variant: "primary" as const,
      trend: { value: isRTL ? '+145 اليوم' : '+145 today', isPositive: true }
    },
    {
      title: isRTL ? 'شهادات تطعيم نشطة' : 'Active Vaccination Certificates',
      value: '8,756',
      icon: Shield,
      variant: "success" as const,
      trend: { value: isRTL ? '94.8% معدل التطعيم' : '94.8% vaccination rate', isPositive: true }
    },
    {
      title: isRTL ? 'معدل الامتثال' : 'Compliance Rate',
      value: '97.2%',
      icon: CheckCircle,
      variant: "accent" as const,
      trend: { value: isRTL ? '+0.8% تحسن' : '+0.8% improvement', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات معلقة' : 'Pending Requests',
      value: '43',
      icon: AlertTriangle,
      variant: "warning" as const,
      trend: { value: isRTL ? '-7 اليوم' : '-7 today', isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: isRTL ? 'تحميل بيانات الحالة الصحية' : 'Upload Health Status Data',
      description: isRTL ? 'رفع بيانات الحالة الصحية للموظفين' : 'Upload employee health status data',
      icon: Upload,
      color: "bg-blue-500",
      onClick: () => console.log('Upload health status data')
    },
    {
      title: isRTL ? 'تحميل تقارير الامتثال' : 'Download Compliance Reports',
      description: isRTL ? 'تحميل تقارير الامتثال الصحي' : 'Download health compliance reports',
      icon: Download,
      color: "bg-green-500",
      onClick: () => console.log('Download compliance reports')
    },
    {
      title: isRTL ? 'مسح رموز QR' : 'Scan QR Codes',
      description: isRTL ? 'مسح رموز توكلنا للتحقق' : 'Scan Tawakkalna QR codes for verification',
      icon: QrCode,
      color: "bg-purple-500",
      onClick: () => console.log('Scan QR codes')
    },
    {
      title: isRTL ? 'التحقق من الهوية' : 'Verify Identity',
      description: isRTL ? 'التحقق من هوية الموظفين' : 'Verify employee identity',
      icon: UserCheck,
      color: "bg-orange-500",
      onClick: () => console.log('Verify identity')
    }
  ];

  const documents = [
    {
      name: isRTL ? 'دليل_استخدام_توكلنا.pdf' : 'tawakkalna_usage_guide.pdf',
      type: isRTL ? 'دليل الاستخدام' : 'Usage Guide',
      date: '2024-12-19',
      size: '4.1 MB'
    },
    {
      name: isRTL ? 'تقرير_الامتثال_الصحي.xlsx' : 'health_compliance_report.xlsx',
      type: isRTL ? 'تقرير الامتثال' : 'Compliance Report',
      date: '2024-12-17',
      size: '2.9 MB'
    },
    {
      name: isRTL ? 'بروتوكولات_الأمان_الصحي.pdf' : 'health_safety_protocols.pdf',
      type: isRTL ? 'بروتوكولات الأمان' : 'Safety Protocols',
      date: '2024-12-15',
      size: '3.2 MB'
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
                <QrCode className="h-5 w-5" />
                {isRTL ? 'توكلنا - الامتثال الصحي والتحقق' : 'Tawakkalna - Health Compliance & Verification'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'إدارة الامتثال الصحي والتحقق من حالة الموظفين عبر توكلنا' 
                  : 'Manage health compliance and verify employee status through Tawakkalna'
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
                      <span className="text-sm">{isRTL ? 'التحقق من الحالة الصحية' : 'Health Status Verification'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'شهادات التطعيم' : 'Vaccination Certificates'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'تتبع الامتثال' : 'Compliance Tracking'}</span>
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
                      <span className="text-sm text-muted-foreground">2024-12-20 17:30</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'عدد السجلات' : 'Total Records'}</span>
                      <span className="text-sm font-medium">9,234</span>
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
          integrationType="tawakkalna"
          acceptedFileTypes=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
          maxFileSize={10}
          onUpload={(files) => {
            setUploadedFiles(prev => [...prev, ...files]);
          }}
          title={isRTL ? 'رفع ملفات توكلنا' : 'Upload Tawakkalna Files'}
          description={isRTL 
            ? 'رفع بيانات الحالة الصحية، شهادات التطعيم، وتقارير الامتثال' 
            : 'Upload health status data, vaccination certificates, and compliance reports'
          }
        />
      )
    }
  ];

  return (
    <div className={isRTL ? 'rtl' : 'ltr'} dir={isRTL ? 'rtl' : 'ltr'}>
      <EnhancedPageLayout
        title={isRTL ? 'توكلنا - الامتثال الصحي والتحقق' : 'Tawakkalna - Health Compliance & Verification'}
        description={isRTL 
          ? 'إدارة الامتثال الصحي والتحقق من حالة الموظفين عبر منصة توكلنا الرسمية' 
          : 'Manage health compliance and verify employee status through the official Tawakkalna platform'
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

export default TawakkalnaCompliance;