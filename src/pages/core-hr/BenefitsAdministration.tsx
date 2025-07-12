import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const BenefitsAdministration = () => {
  const { isRTL } = useLanguage();

  // Arabic translations for this page
  const translations = {
    ar: {
      title: "إدارة المزايا",
      description: "نظام شامل لإدارة مزايا الموظفين والمطالبات",
      enrolled_employees: "الموظفون المسجلون",
      active_benefits: "المزايا النشطة",
      claims_processed: "المطالبات المعالجة",
      satisfaction_rate: "معدل الرضا"
    },
    en: {
      title: "Benefits Administration",
      description: "Comprehensive employee benefits and claims management system",
      enrolled_employees: "Enrolled Employees",
      active_benefits: "Active Benefits",
      claims_processed: "Claims Processed",
      satisfaction_rate: "Satisfaction Rate"
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
            <CardTitle>{t.enrolled_employees}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.active_benefits}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">34</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.claims_processed}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">1,892</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.satisfaction_rate}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">94.7%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BenefitsAdministration;