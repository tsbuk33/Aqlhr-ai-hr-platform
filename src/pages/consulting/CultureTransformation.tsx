import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { AqlHRAIAssistant } from '@/components/ai';

const CultureTransformation = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'تحويل الثقافة التنظيمية' : 'Culture Transformation'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'تقييم الثقافة واستشارات التحويل' : 'Cultural assessment and transformation consulting'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'نقاط الثقافة' : 'Culture Score'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8.4/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'رفع الانخراط' : 'Engagement Lift'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">+32%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'جاهزية التغيير' : 'Change Readiness'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'عائد الاستثمار للتحويل' : 'Transformation ROI'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">420%</div>
          </CardContent>
        </Card>
      </div>
      
      <UniversalAIIntegrator 
        pageType="strategic" 
        moduleName="culture-transformation" 
        companyId="demo-company" 
        enabledFeatures={['culture-analysis', 'organizational-transformation', 'employee-engagement', 'change-management']}
      />
      
      <AqlHRAIAssistant 
        moduleContext="consulting.culture-transformation" 
        companyId="demo-company"
      />
    </div>
  );
};

export default CultureTransformation;