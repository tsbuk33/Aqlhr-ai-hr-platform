import { useLanguage } from "@/hooks/useLanguageCompat";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { SanadAIFileProcessor } from "@/components/sanad/SanadAIFileProcessor";
import { GraduationCap, Users, Award, BookOpen, Clock, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TVTCIntegration = () => {
  const { t, isRTL } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال منصة دروب - التدريب التقني والمهني" : "Testing Doroob Platform Connection",
      description: isRTL ? "جاري فحص الاتصال مع منصة دروب..." : "Testing connection with Doroob platform..."
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة منصة دروب" : "Doroob Platform Sync",
      description: isRTL ? "جاري مزامنة بيانات التدريب والتطوير..." : "Syncing training and development data..."
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <UnifiedGovernmentInterface
      platformName="TVTC/Doroob Training Platform"
      platformNameAr="منصة التدريب التقني والمهني - دروب"
      description="Technical and Vocational Training Corporation - Doroob Platform"
      descriptionAr="المؤسسة العامة للتدريب التقني والمهني - منصة دروب"
      icon={GraduationCap}
      connectionStatus={{
        status: 'connected',
        lastSync: '2024-01-15T13:45:00Z',
        responseTime: 150
      }}
      onTestConnection={handleTestConnection}
      onSyncNow={handleSyncNow}
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="upload">{isRTL ? 'رفع الملفات' : 'File Upload'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Doroob Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            {isRTL ? 'المستفيدون' : 'Total Beneficiaries'}
          </h3>
          <div className="text-3xl font-bold text-brand-primary">1.8M</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'مليون مستفيد من دروب' : 'Million beneficiaries on Doroob'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {isRTL ? 'البرامج التدريبية' : 'Training Programs'}
          </h3>
          <div className="text-3xl font-bold text-brand-success">16.2M</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'مليون برنامج تدريبي مكمل' : 'Million completed training programs'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {isRTL ? 'الساعات التدريبية' : 'Training Hours'}
          </h3>
          <div className="text-3xl font-bold text-brand-accent">10M</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'مليون ساعة تدريبية' : 'Million training hours'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Award className="h-5 w-5" />
            {isRTL ? 'الشهادات المعتمدة' : 'Certified Completions'}
          </h3>
          <div className="text-3xl font-bold text-brand-warning">94.2%</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'معدل إنجاز البرامج التدريبية' : 'Training program completion rate'}</p>
        </div>
      </div>

      {/* SanadHR Integration Section */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-success/5 mb-6">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            {isRTL ? 'التكامل المباشر مع سند الموارد البشرية - نظام التدريب والتطوير' : 'Direct SanadHR Integration - Training & Development System'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 
              'تزامن تلقائي ثنائي الاتجاه مع نظام الموارد البشرية لإدارة التدريب والتطوير والشهادات المهنية' :
              'Bi-directional automatic sync with HR system for training, development and professional certifications management'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {isRTL ? 'برامج التدريب المتكاملة' : 'Integrated Training Programs'}
              </h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'الجلسات التفاعلية (Webinars)' : 'Interactive Training Sessions'}
                    </span>
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'متصل' : 'Connected'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'تسجيل الموظفين تلقائياً في الجلسات التدريبية وتتبع الحضور' : 
                      'Automatic employee enrollment in training sessions and attendance tracking'
                    }
                  </p>
                </div>

                <div className="p-3 bg-success/5 rounded-lg border-l-4 border-l-success">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'الشهادات المهنية والتخصصية' : 'Professional Certifications'}
                    </span>
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'تتبع وإدارة الشهادات المهنية والتخصصية للموظفين' : 
                      'Track and manage professional and specialized certifications for employees'
                    }
                  </p>
                </div>

                <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-l-warning">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'خطط التطوير الوظيفي' : 'Career Development Plans'}
                    </span>
                    <Badge className="bg-status-warning text-white">
                      {isRTL ? 'مجدول' : 'Scheduled'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'إنشاء وتتبع خطط التطوير الوظيفي المبنية على المهارات المطلوبة' : 
                      'Create and track career development plans based on required skills'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-success flex items-center gap-2">
                <Award className="h-4 w-4" />
                {isRTL ? 'البرامج التدريبية النشطة' : 'Active Training Programs'}
              </h4>
              
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'الصحة النفسية في بيئة العمل' : 'Mental Health in Workplace'}
                    </span>
                    <Badge className="bg-success text-white">
                      {isRTL ? 'متاح' : 'Available'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'القيادة التحولية في الرعاية الصحية' : 'Transformational Leadership in Healthcare'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'الرعاية الوقائية وتحسين جودة الحياة' : 'Preventive Care & Quality of Life'}
                    </span>
                    <Badge className="bg-accent text-white">
                      {isRTL ? 'قريباً' : 'Coming Soon'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h5 className="font-medium text-primary mb-2">
                  {isRTL ? 'إحصائيات التدريب للشركة' : 'Company Training Statistics'}
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{isRTL ? 'الموظفون المسجلون:' : 'Enrolled Employees:'}</span>
                    <span className="font-mono text-primary">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'البرامج المكتملة:' : 'Completed Programs:'}</span>
                    <span className="font-mono text-success">856</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'الشهادات المحصلة:' : 'Certificates Earned:'}</span>
                    <span className="font-mono text-accent">623</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'متوسط ساعات التدريب:' : 'Avg Training Hours:'}</span>
                    <span className="font-mono text-warning">42.5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-6">
          <SanadAIFileProcessor
            platform="tvtc"
            moduleType="government"
            onFileProcessed={(file) => {
              setUploadedFiles(prev => [...prev, file]);
              toast({
                title: isRTL ? "تم رفع الملف بنجاح" : "File uploaded successfully",
                description: isRTL ? `تم رفع ${file.name} بنجاح` : `${file.name} uploaded successfully`
              });
            }}
            acceptedTypes={['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']}
            maxFileSize={10}
          />
        </TabsContent>
      </Tabs>
    </UnifiedGovernmentInterface>
  );
};

export default TVTCIntegration;