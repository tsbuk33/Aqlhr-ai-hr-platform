import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { EnhancedPageLayout } from "@/components/enhanced/EnhancedPageLayout";
import { FileUploadSystem } from "@/components/government/FileUploadSystem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Building, 
  Award, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Download,
  Upload,
  Eye,
  FileCheck
} from "lucide-react";

const NCAAAccreditation = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const stats = [
    {
      title: isRTL ? 'برامج معتمدة' : 'Accredited Programs',
      value: '487',
      icon: Award,
      variant: "primary" as const,
      trend: { value: isRTL ? '+23 هذا العام' : '+23 this year', isPositive: true }
    },
    {
      title: isRTL ? 'مؤسسات معتمدة' : 'Accredited Institutions',
      value: '89',
      icon: Building,
      variant: "success" as const,
      trend: { value: isRTL ? '+7 جديدة' : '+7 new', isPositive: true }
    },
    {
      title: isRTL ? 'شهادات صادرة' : 'Certificates Issued',
      value: '12,456',
      icon: FileCheck,
      variant: "accent" as const,
      trend: { value: isRTL ? '+18% نمو' : '+18% growth', isPositive: true }
    },
    {
      title: isRTL ? 'طلبات قيد المراجعة' : 'Under Review',
      value: '67',
      icon: AlertTriangle,
      variant: "warning" as const,
      trend: { value: isRTL ? 'قيد المعالجة' : 'In progress', isPositive: true }
    }
  ];

  const quickActions = [
    {
      title: isRTL ? 'تحميل وثائق الاعتماد' : 'Upload Accreditation Documents',
      description: isRTL ? 'رفع وثائق الاعتماد الأكاديمي' : 'Upload academic accreditation documents',
      icon: Upload,
      color: "bg-blue-500",
      onClick: () => console.log('Upload accreditation docs')
    },
    {
      title: isRTL ? 'تحميل تقارير الجودة' : 'Download Quality Reports',
      description: isRTL ? 'تحميل تقارير ضمان الجودة' : 'Download quality assurance reports',
      icon: Download,
      color: "bg-green-500",
      onClick: () => console.log('Download quality reports')
    },
    {
      title: isRTL ? 'مراجعة الاعتمادات' : 'Review Accreditations',
      description: isRTL ? 'مراجعة حالة الاعتمادات' : 'Review accreditation status',
      icon: Eye,
      color: "bg-purple-500",
      onClick: () => console.log('Review accreditations')
    },
    {
      title: isRTL ? 'التحقق من الشهادات' : 'Verify Certificates',
      description: isRTL ? 'التحقق من صحة الشهادات' : 'Verify certificate authenticity',
      icon: FileCheck,
      color: "bg-orange-500",
      onClick: () => console.log('Verify certificates')
    }
  ];

  const documents = [
    {
      name: isRTL ? 'دليل_الاعتماد_الأكاديمي.pdf' : 'academic_accreditation_guide.pdf',
      type: isRTL ? 'دليل الاعتماد' : 'Accreditation Guide',
      date: '2024-12-19',
      size: '5.1 MB'
    },
    {
      name: isRTL ? 'تقرير_ضمان_الجودة_2024.xlsx' : 'quality_assurance_report_2024.xlsx',
      type: isRTL ? 'تقرير الجودة' : 'Quality Report',
      date: '2024-12-17',
      size: '3.4 MB'
    },
    {
      name: isRTL ? 'معايير_الاعتماد.pdf' : 'accreditation_standards.pdf',
      type: isRTL ? 'معايير' : 'Standards',
      date: '2024-12-15',
      size: '2.7 MB'
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
                <Building className="h-5 w-5" />
                {isRTL ? 'الهيئة الوطنية للتقويم والاعتماد الأكاديمي' : 'National Commission for Academic Accreditation & Assessment'}
              </CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'إدارة الاعتماد الأكاديمي وضمان الجودة للبرامج التعليمية' 
                  : 'Manage academic accreditation and quality assurance for educational programs'
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
                      <span className="text-sm">{isRTL ? 'اعتماد البرامج الأكاديمية' : 'Academic Program Accreditation'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'ضمان الجودة' : 'Quality Assurance'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'التحقق من الشهادات' : 'Certificate Verification'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{isRTL ? 'تقييم المؤسسات' : 'Institutional Assessment'}</span>
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
                      <span className="text-sm text-muted-foreground">2024-12-20 11:45</span>
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
        <FileUploadSystem
          platform="ncaaa"
          moduleType="government"
          acceptedTypes={[".pdf",".xlsx",".xls",".doc",".docx"]}
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
        title={isRTL ? 'الهيئة الوطنية للتقويم والاعتماد الأكاديمي' : 'NCAAA - Academic Accreditation'}
        description={isRTL 
          ? 'إدارة الاعتماد الأكاديمي وضمان الجودة للبرامج التعليمية والمؤسسات' 
          : 'Manage academic accreditation and quality assurance for educational programs and institutions'
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

export default NCAAAccreditation;