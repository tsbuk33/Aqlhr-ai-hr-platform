import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const RiskAssessment = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'تقييم مخاطر الموارد البشرية' : 'HR Risk Assessment'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'تحليل شامل لمخاطر الموارد البشرية والتخفيف منها' : 'Comprehensive HR risk analysis and mitigation'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'نقاط المخاطر' : 'Risk Score'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">2.1/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'المخاطر المتخففة' : 'Risks Mitigated'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'معدل الامتثال' : 'Compliance Rate'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">98.7%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'تجنب التكاليف' : 'Cost Avoidance'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isArabic ? '1.2 مليون ريال' : 'SAR 1.2M'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskAssessment;