import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const AIDiagnosisRecommendations = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? "تشخيص وتوصيات الذكاء الاصطناعي" : "AI Diagnosis & Recommendations"}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? "12 نموذج تعلم آلي لرؤى الرعاية" : "12 ML models for welfare insights"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "نماذج التعلم الآلي" : "ML Models"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "التوصيات" : "Recommendations"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">287</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "معدل الدقة" : "Accuracy Rate"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">89.4%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "معدل التطبيق" : "Implementation Rate"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">76.8%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIDiagnosisRecommendations;