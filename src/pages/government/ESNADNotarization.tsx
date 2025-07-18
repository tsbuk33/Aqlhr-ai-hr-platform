import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { AqlAIFileProcessor } from "@/components/aql/AqlAIFileProcessor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileCheck, 
  Stamp, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Download,
  Upload,
  Eye,
  Signature
} from "lucide-react";

const ESNADNotarization = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const stats = [
    {
      title: isRTL ? 'وثائق موثقة' : 'Notarized Documents',
      value: '7,821',
      icon: Stamp,
      variant: "primary" as const,
      trend: { value: isRTL ? '+234 هذا الشهر' : '+234 this month', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات التوثيق' : 'Notarization Requests',
      value: '2,134',
      icon: FileText,
      variant: "success" as const,
      trend: { value: isRTL ? '+18% نمو' : '+18% growth', isPositive: true }
    },
    {
      title: isRTL ? 'معدل المعالجة' : 'Processing Rate',
      value: '96.2%',
      icon: CheckCircle,
      variant: "accent" as const,
      trend: { value: isRTL ? '+1.8% تحسن' : '+1.8% improvement', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات معلقة' : 'Pending Requests',
      value: '81',
      icon: AlertTriangle,
      variant: "warning" as const,
      trend: { value: isRTL ? '-9 اليوم' : '-9 today', isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: isRTL ? 'تحميل وثائق للتوثيق' : 'Upload Documents for Notarization',
      description: isRTL ? 'رفع الوثائق المطلوب توثيقها' : 'Upload documents for notarization',
      icon: Upload,
      color: "bg-blue-500",
      onClick: () => console.log('Upload documents for notarization')
    },
    {
      title: isRTL ? 'تحميل الوثائق الموثقة' : 'Download Notarized Documents',
      description: isRTL ? 'تحميل الوثائق المكتملة التوثيق' : 'Download completed notarized documents',
      icon: Download,
      color: "bg-green-500",
      onClick: () => console.log('Download notarized documents')
    },
    {
      title: isRTL ? 'التحقق من الطوابع' : 'Verify Stamps',
      description: isRTL ? 'التحقق من صحة الطوابع والتوقيعات' : 'Verify authenticity of stamps and signatures',
      icon: Signature,
      color: "bg-purple-500",
      onClick: () => console.log('Verify stamps')
    },
    {
      title: isRTL ? 'مراجعة الطلبات' : 'Review Requests',
      description: isRTL ? 'مراجعة طلبات التوثيق الجديدة' : 'Review new notarization requests',
      icon: Eye,
      color: "bg-orange-500",
      onClick: () => console.log('Review requests')
    }
  ];

  const documents = [
    {
      name: isRTL ? 'دليل_التوثيق_الإلكتروني.pdf' : 'electronic_notarization_guide.pdf',
      type: isRTL ? 'دليل التوثيق' : 'Notarization Guide',
      date: '2024-12-18',
      size: '3.6 MB'
    },
    {
      name: isRTL ? 'تقرير_التوثيق_الشهري.xlsx' : 'monthly_notarization_report.xlsx',
      type: isRTL ? 'تقرير شهري' : 'Monthly Report',
      date: '2024-12-16',
      size: '2.4 MB'
    },
    {
      name: isRTL ? 'أنواع_الوثائق_المقبولة.pdf' : 'accepted_document_types.pdf',
      type: isRTL ? 'أنواع الوثائق' : 'Document Types',
      date: '2024-12-14',
      size: '1.8 MB'
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
                <Stamp className="h-5 w-5" />
                {isRTL ? 'إسناد - خدمات التوثيق الإلكتروني' : 'ESNAD - Electronic Notarization Services'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'إدارة خدمات التوثيق الإلكتروني للوثائق الرسمية والعقود' 
                  : 'Manage electronic notarization services for official documents and contracts'
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
                      <span className="text-sm">{isRTL ? 'توثيق الوثائق الرسمية' : 'Official Document Notarization'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'توثيق العقود' : 'Contract Notarization'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'التوقيع الإلكتروني' : 'Electronic Signatures'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'التحقق من الوثائق' : 'Document Verification'}</span>
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
                      <span className="text-sm text-muted-foreground">2024-12-20 14:15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{isRTL ? 'عدد السجلات' : 'Total Records'}</span>
                      <span className="text-sm font-medium">7,821</span>
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
          platform="esnad"
          moduleType="government"
          acceptedTypes={[".pdf",".jpg",".jpeg",".png",".doc",".docx"]}
          maxFileSize={15 * 1024 * 1024}
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
        title={isRTL ? 'إسناد - خدمات التوثيق الإلكتروني' : 'ESNAD - Electronic Notarization Services'}
        description={isRTL 
          ? 'إدارة خدمات التوثيق الإلكتروني للوثائق الرسمية والعقود من خلال منصة إسناد' 
          : 'Manage electronic notarization services for official documents and contracts through ESNAD platform'
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

export default ESNADNotarization;