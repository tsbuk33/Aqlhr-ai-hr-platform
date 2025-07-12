import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const SuccessionPlanningCore = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      succession_planning: "Succession Planning",
      succession_planning_desc: "Identify and develop talent for key leadership positions",
      key_positions: "Key Positions",
      ready_successors: "Ready Successors",
      succession_coverage: "Succession Coverage",
      risk_score: "Risk Score"
    },
    ar: {
      succession_planning: "تخطيط التعاقب الوظيفي",
      succession_planning_desc: "تحديد وتطوير المواهب للمناصب القيادية الرئيسية",
      key_positions: "المناصب الرئيسية",
      ready_successors: "الخلفاء المستعدون",
      succession_coverage: "تغطية التعاقب",
      risk_score: "درجة المخاطر"
    }
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('succession_planning')}</h1>
        <p className="text-muted-foreground">{t('succession_planning_desc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('key_positions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('ready_successors')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('succession_coverage')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">57%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('risk_score')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">2.8/10</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessionPlanningCore;