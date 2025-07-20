import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const WelfareComplianceDashboard = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? "لوحة معلومات امتثال الرعاية" : "Welfare Compliance Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? "مراقبة رعاية الموظفين المتوافقة مع رؤية 2030" : "Vision 2030-aligned employee welfare monitoring"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "درجة الامتثال" : "Compliance Score"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">94.8%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "حالات الرعاية" : "Welfare Cases"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "معدل الحل" : "Resolution Rate"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">87.6%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "متوسط وقت الحل" : "Avg Resolution Time"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">{isArabic ? "2.3 أيام" : "2.3 days"}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelfareComplianceDashboard;