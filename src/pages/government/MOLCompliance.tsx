import { useLanguage } from "@/hooks/useLanguageCompat";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { AqlAIFileProcessor } from "@/components/aql/AqlAIFileProcessor";
import { Users, Building, Shield, FileText, TrendingUp, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MOLCompliance = () => {
  const { t, isRTL } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال وزارة الموارد البشرية والتنمية الاجتماعية" : "Testing HRSD Connection",
      description: isRTL ? "جاري فحص الاتصال مع أنظمة الوزارة..." : "Testing connection with ministry systems..."
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة وزارة الموارد البشرية والتنمية الاجتماعية" : "HRSD Sync",
      description: isRTL ? "جاري مزامنة البيانات والتشريعات..." : "Syncing data and regulations..."
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <UnifiedGovernmentInterface
      platformName="HRSD Integration"
      platformNameAr="تكامل وزارة الموارد البشرية والتنمية الاجتماعية"
      description="Ministry of Human Resources and Social Development Integration"
      descriptionAr="التكامل مع وزارة الموارد البشرية والتنمية الاجتماعية"
      icon={Users}
      connectionStatus={{
        status: 'connected',
        lastSync: '2024-01-15T16:20:00Z',
        responseTime: 180
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
          {/* Ministry Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            {isRTL ? 'الخدمات المقدمة' : 'Provided Services'}
          </h3>
          <div className="text-3xl font-bold text-brand-primary">855</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'خدمة متاحة للمواطنين والمؤسسات' : 'services available for citizens and organizations'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Building className="h-5 w-5" />
            {isRTL ? 'المعاملات المنجزة' : 'Completed Transactions'}
          </h3>
          <div className="text-3xl font-bold text-brand-success">36.7M</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'مليون معاملة منجزة' : 'million transactions completed'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {isRTL ? 'نسبة الامتثال' : 'Compliance Rate'}
          </h3>
          <div className="text-3xl font-bold text-brand-accent">98.7%</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'معدل الامتثال للأنظمة العمالية' : 'labor regulations compliance rate'}</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {isRTL ? 'التحديثات التشريعية' : 'Regulatory Updates'}
          </h3>
          <div className="text-3xl font-bold text-brand-warning">24</div>
          <p className="text-sm text-muted-foreground mt-2">{isRTL ? 'تحديث تشريعي هذا العام' : 'regulatory updates this year'}</p>
        </div>
      </div>

      {/* SanadHR Integration Section */}
      <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-r from-primary/5 to-success/5 mb-6">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Users className="h-6 w-6" />
            {isRTL ? 'التكامل المباشر مع سند الموارد البشرية - نظام الامتثال العمالي' : 'Direct SanadHR Integration - Labor Compliance System'}
          </CardTitle>
          <CardDescription>
            {isRTL ? 
              'تزامن تلقائي ثنائي الاتجاه مع أنظمة الوزارة لضمان الامتثال الكامل للأنظمة والتشريعات العمالية' :
              'Bi-directional automatic sync with ministry systems ensuring full compliance with labor laws and regulations'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {isRTL ? 'الأنظمة العمالية المحدثة' : 'Updated Labor Regulations'}
              </h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg border-l-4 border-l-primary">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'نظام العمل المحدث 2025' : 'Updated Labor Law 2025'}
                    </span>
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'مطبق' : 'Implemented'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'تطبيق التعديلات الجديدة على نظام العمل وساعات العمل المرنة' : 
                      'Implementation of new labor law amendments and flexible working hours'
                    }
                  </p>
                </div>

                <div className="p-3 bg-success/5 rounded-lg border-l-4 border-l-success">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'حماية الأجور والمكافآت' : 'Wage Protection & Bonuses'}
                    </span>
                    <Badge className="bg-status-success text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'مراقبة تطبيق أنظمة حماية الأجور وآليات احتساب المكافآت' : 
                      'Monitor wage protection systems implementation and bonus calculation mechanisms'
                    }
                  </p>
                </div>

                <div className="p-3 bg-warning/5 rounded-lg border-l-4 border-l-warning">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'إجازات الوالدين الجديدة' : 'New Parental Leave Policies'}
                    </span>
                    <Badge className="bg-status-warning text-white">
                      {isRTL ? 'قريباً' : 'Coming Soon'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? 
                      'تطبيق أنظمة إجازة الوالدين الجديدة وآليات احتساب البدلات' : 
                      'Implementation of new parental leave systems and allowance calculation mechanisms'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-success flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {isRTL ? 'الخدمات الرقمية المتكاملة' : 'Integrated Digital Services'}
              </h4>
              
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'خدمات ذوي الإعاقة' : 'Disability Services'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'برامج التأهيل المهني' : 'Professional Rehabilitation Programs'}
                    </span>
                    <Badge className="bg-primary text-white">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {isRTL ? 'تطوير رأس المال البشري' : 'Human Capital Development'}
                    </span>
                    <Badge className="bg-accent text-white">
                      {isRTL ? 'مستمر' : 'Ongoing'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h5 className="font-medium text-primary mb-2">
                  {isRTL ? 'التحديثات التشريعية الحديثة' : 'Recent Regulatory Updates'}
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{isRTL ? 'تعديلات نظام العمل:' : 'Labor Law Amendments:'}</span>
                    <span className="font-mono text-primary">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'قرارات جديدة:' : 'New Decisions:'}</span>
                    <span className="font-mono text-success">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'لوائح محدثة:' : 'Updated Regulations:'}</span>
                    <span className="font-mono text-accent">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRTL ? 'آخر تحديث:' : 'Last Update:'}</span>
                    <span className="font-mono text-warning">{isRTL ? 'منذ 3 أيام' : '3 days ago'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regulatory Updates Tracker */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
            <h5 className="font-medium mb-3 text-primary flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {isRTL ? 'متتبع التحديثات التشريعية المباشر' : 'Live Regulatory Updates Tracker'}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="text-sm font-medium text-primary">
                  {isRTL ? 'قرار رقم 2024/156' : 'Decision No. 2024/156'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'تعديل آلية احتساب الإجازات السنوية' : 'Amendment to annual leave calculation mechanism'}
                </div>
                <Badge className="mt-2 bg-status-success text-white text-xs">
                  {isRTL ? 'مطبق في النظام' : 'Applied in System'}
                </Badge>
              </div>

              <div className="p-3 bg-white rounded border border-warning/20 hover:border-warning/40 transition-colors">
                <div className="text-sm font-medium text-warning">
                  {isRTL ? 'مسودة قرار 2025/012' : 'Draft Decision 2025/012'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'تحديث أنظمة العمل عن بُعد' : 'Remote work systems update'}
                </div>
                <Badge className="mt-2 bg-status-warning text-white text-xs">
                  {isRTL ? 'تحت المراجعة' : 'Under Review'}
                </Badge>
              </div>

              <div className="p-3 bg-white rounded border border-accent/20 hover:border-accent/40 transition-colors">
                <div className="text-sm font-medium text-accent">
                  {isRTL ? 'لائحة تنفيذية جديدة' : 'New Executive Regulation'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {isRTL ? 'تطوير برامج التدريب المهني' : 'Professional training programs development'}
                </div>
                <Badge className="mt-2 bg-status-info text-white text-xs">
                  {isRTL ? 'في الطريق' : 'Coming Soon'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-6">
          <AqlAIFileProcessor
            platform="mol"
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

export default MOLCompliance;