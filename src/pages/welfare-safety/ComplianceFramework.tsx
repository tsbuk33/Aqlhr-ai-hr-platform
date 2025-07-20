import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const ComplianceFramework = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? "محرك إطار الامتثال" : "Compliance Framework Engine"}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? "أتمتة الامتثال لوزارة الموارد البشرية والتنمية الاجتماعية والحوكمة البيئية والاجتماعية ومنظمة العمل الدولية" : "HRSD, ESG, and ILO compliance automation"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "الأطر" : "Frameworks"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">17</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "درجة الامتثال" : "Compliance Score"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">96.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "الفحوصات التلقائية" : "Auto Checks"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "تنبيهات المخاطر" : "Risk Alerts"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">12</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplianceFramework;