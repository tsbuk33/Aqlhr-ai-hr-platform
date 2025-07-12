import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const CompensationManagementCore = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      compensation_management: "Compensation Management",
      compensation_management_desc: "Manage salary structures and compensation strategies",
      compensation_bands: "Compensation Bands",
      merit_increase: "Merit Increase",
      market_alignment: "Market Alignment",
      budget_variance: "Budget Variance"
    },
    ar: {
      compensation_management: "إدارة التعويضات",
      compensation_management_desc: "إدارة هياكل الرواتب واستراتيجيات التعويض",
      compensation_bands: "نطاقات التعويض",
      merit_increase: "زيادة الجدارة",
      market_alignment: "التوافق مع السوق",
      budget_variance: "تباين الميزانية"
    }
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('compensation_management')}</h1>
        <p className="text-muted-foreground">{t('compensation_management_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('compensation_bands')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">47</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('merit_increase')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">8.5%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('market_alignment')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">92%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('budget_variance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">-2.1%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompensationManagementCore;