import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { AqlAIFileProcessor } from "@/components/aql/AqlAIFileProcessor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Package, 
  Truck, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Download,
  Upload,
  Eye,
  Navigation
} from "lucide-react";

const SaudiPostVerification = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const stats = [
    {
      title: isRTL ? 'عناوين محققة' : 'Verified Addresses',
      value: '12,456',
      icon: MapPin,
      variant: "primary" as const,
      trend: { value: isRTL ? '+567 هذا الشهر' : '+567 this month', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات التحقق' : 'Verification Requests',
      value: '3,892',
      icon: Package,
      variant: "success" as const,
      trend: { value: isRTL ? '+25% نمو' : '+25% growth', isPositive: true }
    },
    {
      title: isRTL ? 'معدل دقة العناوين' : 'Address Accuracy Rate',
      value: '94.8%',
      icon: Navigation,
      variant: "accent" as const,
      trend: { value: isRTL ? '+2.1% تحسن' : '+2.1% improvement', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات معلقة' : 'Pending Requests',
      value: '187',
      icon: AlertTriangle,
      variant: "warning" as const,
      trend: { value: isRTL ? '-23 هذا الأسبوع' : '-23 this week', isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: isRTL ? 'تحميل قوائم العناوين' : 'Upload Address Lists',
      description: isRTL ? 'رفع قوائم العناوين للتحقق منها' : 'Upload address lists for verification',
      icon: Upload,
      color: "bg-blue-500",
      onClick: () => console.log('Upload address lists')
    },
    {
      title: isRTL ? 'تحميل تقارير التحقق' : 'Download Verification Reports',
      description: isRTL ? 'تحميل تقارير التحقق من العناوين' : 'Download address verification reports',
      icon: Download,
      color: "bg-green-500",
      onClick: () => console.log('Download verification reports')
    },
    {
      title: isRTL ? 'تتبع الشحنات' : 'Track Shipments',
      description: isRTL ? 'تتبع الشحنات والتسليمات' : 'Track shipments and deliveries',
      icon: Truck,
      color: "bg-purple-500",
      onClick: () => console.log('Track shipments')
    },
    {
      title: isRTL ? 'مراجعة العناوين' : 'Review Addresses',
      description: isRTL ? 'مراجعة العناوين المشكوك فيها' : 'Review questionable addresses',
      icon: Eye,
      color: "bg-orange-500",
      onClick: () => console.log('Review addresses')
    }
  ];

  const documents = [
    {
      name: isRTL ? 'دليل_التحقق_من_العناوين.pdf' : 'address_verification_guide.pdf',
      type: isRTL ? 'دليل التحقق' : 'Verification Guide',
      date: '2024-12-17',
      size: '3.4 MB'
    },
    {
      name: isRTL ? 'تقرير_البريد_الشهري.xlsx' : 'monthly_postal_report.xlsx',
      type: isRTL ? 'تقرير شهري' : 'Monthly Report',
      date: '2024-12-15',
      size: '2.8 MB'
    },
    {
      name: isRTL ? 'معايير_العناوين_الوطنية.pdf' : 'national_address_standards.pdf',
      type: isRTL ? 'معايير العناوين' : 'Address Standards',
      date: '2024-12-13',
      size: '2.1 MB'
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
                <Package className="h-5 w-5" />
                {isRTL ? 'البريد السعودي - التحقق من العناوين' : 'Saudi Post - Address Verification'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'التحقق من صحة العناوين وإدارة خدمات البريد للموظفين' 
                  : 'Verify address accuracy and manage postal services for employees'
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
                      <span className="text-sm">{isRTL ? 'التحقق من العناوين الوطنية' : 'National Address Verification'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'تتبع الشحنات' : 'Shipment Tracking'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'تحديث العناوين' : 'Address Updates'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'إدارة الصناديق البريدية' : 'PO Box Management'}</span>
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
                      <span className="text-sm text-muted-foreground">2024-12-20 16:45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'عدد السجلات' : 'Total Records'}</span>
                      <span className="text-sm font-medium">12,456</span>
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
          platform="saudi_post"
          moduleType="government"
          acceptedTypes={[".pdf",".xlsx",".xls",".csv",".doc",".docx"]}
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
        title={isRTL ? 'البريد السعودي - التحقق من العناوين' : 'Saudi Post - Address Verification'}
        description={isRTL 
          ? 'التحقق من صحة العناوين وإدارة خدمات البريد للموظفين من خلال البريد السعودي' 
          : 'Verify address accuracy and manage postal services for employees through Saudi Post'
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

export default SaudiPostVerification;