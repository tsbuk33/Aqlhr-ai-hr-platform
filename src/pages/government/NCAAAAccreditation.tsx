import { useLanguage } from "@/hooks/useLanguageCompat";
import { usePerformantLocalization } from "@/hooks/usePerformantLocalization";
import { MemoizedMetricCard } from "@/components/performance/MemoizedMetricCard";
import { FocusManager } from "@/components/accessibility/FocusManager";
import { ScreenReaderText } from "@/components/accessibility/ScreenReaderText";
import { UnifiedGovernmentInterface } from "@/components/government/UnifiedGovernmentInterface";
import { Activity, CheckCircle, Clock, Shield, GraduationCap, Users, FileText, TrendingUp, Award, School } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const NCAAAAccreditation = () => {
  const { t, isRTL } = useLanguage();
  const { formatters, dateFormatters } = usePerformantLocalization();

  const handleTestConnection = async () => {
    toast({
      title: isRTL ? "اختبار اتصال NCAAA" : "Testing NCAAA Connection",
      description: isRTL ? "جاري فحص الاتصال مع مركز الاعتماد الأكاديمي..." : "Testing connection with NCAAA platform..."
    });
    
    try {
      // Call NCAAA integration edge function
      const { data, error } = await supabase.functions.invoke('ncaaa-integration');
      
      if (error) throw error;
      
      toast({
        title: isRTL ? "تم الاتصال بنجاح" : "Connection Successful",
        description: isRTL ? "تم ربط مركز الاعتماد الأكاديمي مع عقل الموارد البشرية بنجاح" : "NCAAA platform successfully connected with AqlHR"
      });
    } catch (error) {
      toast({
        title: isRTL ? "فشل في الاتصال" : "Connection Failed",
        description: isRTL ? "حدث خطأ أثناء الاتصال بمركز الاعتماد الأكاديمي" : "Error connecting to NCAAA platform"
      });
    }
  };

  const handleSyncNow = async () => {
    toast({
      title: isRTL ? "مزامنة NCAAA مع عقل" : "NCAAA-AqlHR Sync",
      description: isRTL ? "جاري مزامنة بيانات الاعتماد الأكاديمي..." : "Syncing academic accreditation data..."
    });
    
    try {
      // Call NCAAA integration for accreditation sync
      const { data, error } = await supabase.functions.invoke('ncaaa-integration', {
        body: { 
          action: 'sync_accreditations',
          institution_id: 'sample-institution-id',
          accreditation_type: 'academic_program'
        }
      });
      
      if (error) throw error;
      
      toast({
        title: isRTL ? "اكتملت المزامنة" : "Sync Completed",
        description: isRTL ? "تم تحديث جميع بيانات الاعتماد في عقل الموارد البشرية" : "All accreditation data updated in AqlHR system"
      });
    } catch (error) {
      toast({
        title: isRTL ? "فشل في المزامنة" : "Sync Failed",
        description: isRTL ? "حدث خطأ أثناء مزامنة البيانات" : "Error during data synchronization"
      });
    }
  };

  return (
    <FocusManager autoFocus restoreFocus>
      <UnifiedGovernmentInterface
        platformName="NCAAA Accreditation Platform Integration"
        platformNameAr="تكامل مركز الاعتماد الأكاديمي"
        description="Academic accreditation verification, quality assurance, and institutional standards"
        descriptionAr="التحقق من الاعتماد الأكاديمي وضمان الجودة ومعايير المؤسسات"
        icon={School}
        connectionStatus={{
          status: 'connected',
          lastSync: '2024-01-15T10:30:00Z'
        }}
        onTestConnection={handleTestConnection}
        onSyncNow={handleSyncNow}
      >
        <ScreenReaderText>{isRTL ? "إحصائيات تكامل مركز الاعتماد الأكاديمي" : "NCAAA academic accreditation platform integration statistics"}</ScreenReaderText>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MemoizedMetricCard
            title={isRTL ? "البرامج المعتمدة" : "Accredited Programs"}
            value="1,456"
            description={`+43 ${isRTL ? 'هذا الشهر' : 'this month'}`}
            icon={<School className="h-6 w-6" />}
            variant="primary"
            trend={{
              value: "43",
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={isRTL ? "نسبة نجاح العمليات" : "Process Success Rate"}
            value="97.8%"
            description={isRTL ? "معاملات ناجحة عبر الواجهة البرمجية" : "Successful API transactions"}
            icon={<CheckCircle className="h-6 w-6" />}
            variant="success"
          />
          <MemoizedMetricCard
            title={isRTL ? "المؤسسات المعتمدة" : "Accredited Institutions"}
            value="234"
            description={`+12 ${isRTL ? 'الشهر الماضي' : 'last month'}`}
            icon={<GraduationCap className="h-6 w-6" />}
            variant="accent"
            trend={{
              value: "12",
              isPositive: true
            }}
          />
          <MemoizedMetricCard
            title={isRTL ? "معدل ضمان الجودة" : "Quality Assurance Rate"}
            value="94.5%"
            description={isRTL ? "نسبة الامتثال لمعايير الجودة" : "Quality standards compliance rate"}
            icon={<TrendingUp className="h-6 w-6" />}
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <School className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">
                {isRTL ? "خدمات الاعتماد الأكاديمي" : "Academic Accreditation Services"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "اعتماد البرامج الأكاديمية" : "Academic Program Accreditation"}
                </span>
                <span className="text-sm text-muted-foreground">1,456</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "اعتماد المؤسسات التعليمية" : "Educational Institution Accreditation"}
                </span>
                <span className="text-sm text-muted-foreground">234</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <span className="text-sm font-medium">
                  {isRTL ? "تقييمات ضمان الجودة" : "Quality Assurance Evaluations"}
                </span>
                <span className="text-sm text-muted-foreground">892</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-6 w-6 text-success" />
              <h3 className="text-lg font-semibold">
                {isRTL ? "تكامل NCAAA مع عقل الموارد البشرية" : "NCAAA-AqlHR Integration"}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">{isRTL ? "مزامنة البيانات" : "Data Synchronization"}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-success">{isRTL ? "نشط" : "Active"}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{isRTL ? "آخر مزامنة" : "Last Sync"}</span>
                <span className="text-sm text-muted-foreground">
                  {dateFormatters.date(new Date())}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{isRTL ? "معدل نجاح المزامنة" : "Sync Success Rate"}</span>
                <span className="text-sm text-success">97.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{isRTL ? "السجلات المزامنة" : "Records Synchronized"}</span>
                <span className="text-sm text-muted-foreground">1,456</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border mt-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-accent" />
            <h3 className="text-lg font-semibold">
              {isRTL ? "تقارير الاعتماد وضمان الجودة" : "Accreditation & Quality Assurance Reports"}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-primary">1,456</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "برامج معتمدة" : "Accredited Programs"}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-success">234</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "مؤسسات معتمدة" : "Accredited Institutions"}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="text-2xl font-bold text-warning">94.5%</div>
              <div className="text-sm text-muted-foreground">
                {isRTL ? "معدل ضمان الجودة" : "Quality Assurance Rate"}
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Integration for NCAAA Accreditation */}
        <UniversalAIIntegrator 
          pageType="government" 
          moduleName="ncaaa-accreditation" 
          companyId="demo-company" 
          enabledFeatures={['government-integration', 'academic-accreditation', 'quality-assurance', 'ncaaa-services']}
        />
      </UnifiedGovernmentInterface>
    </FocusManager>
  );
};

export default NCAAAAccreditation;