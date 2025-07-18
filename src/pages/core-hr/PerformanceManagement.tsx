import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, TrendingUp, Target, Users } from "lucide-react";

const PerformanceManagement = () => {
  const { isRTL, language } = useLanguage();
  const { toast } = useToast();

  // Arabic translations for this page
  const translations = {
    ar: {
      title: "إدارة الأداء",
      description: "نظام شامل لتقييم ومتابعة أداء الموظفين مع مؤشرات الأداء الرئيسية",
      total_employees: "إجمالي الموظفين",
      reviews_completed: "التقييمات المكتملة",
      satisfaction_rate: "معدل الرضا",
      performance_evaluations: "تقييمات الأداء"
    },
    en: {
      title: "Performance Management",
      description: "Comprehensive employee performance evaluation and monitoring system with KPIs",
      total_employees: "Total Employees",
      reviews_completed: "Reviews Completed",
      satisfaction_rate: "Satisfaction Rate",
      performance_evaluations: "Performance Evaluations"
    }
  };

  const t = isRTL ? translations.ar : translations.en;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.total_employees}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.reviews_completed}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">2,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.satisfaction_rate}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">94.7%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.performance_evaluations}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">178</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">{isRTL ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
          <TabsTrigger value="documents">{isRTL ? 'الوثائق' : 'Documents'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {isRTL
                  ? "نظام شامل لتقييم ومتابعة أداء الموظفين مع مؤشرات الأداء الرئيسية وتقييمات دورية."
                  : "Comprehensive employee performance evaluation and monitoring system with KPIs and periodic assessments."
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-6">
          <UniversalDocumentManager
            moduleName="Performance Management"
            moduleNameAr="إدارة الأداء"
            description="Upload performance reviews, KPI reports, evaluation forms, and goal-setting documents"
            descriptionAr="رفع مراجعات الأداء وتقارير مؤشرات الأداء ونماذج التقييم ووثائق وضع الأهداف"
            platform="performance-management"
            moduleType="hr"
            acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.pptx']}
            maxFileSize={15 * 1024 * 1024}
            maxFiles={25}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceManagement;