import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const TrainingDevelopment = () => {
  const { isRTL } = useLanguage();

  // Arabic translations for this page
  const translations = {
    ar: {
      title: "التدريب والتطوير",
      description: "إدارة برامج التدريب والتطوير المهني مع التكامل مع المنصات السعودية",
      active_programs: "البرامج النشطة",
      tvtc_certified: "شهادات التقنية والمهني", 
      training_hours: "ساعات التدريب",
      completion_rate: "معدل الإكمال"
    },
    en: {
      title: "Training & Development",
      description: "Professional training and development programs management with Saudi platform integration",
      active_programs: "Active Programs",
      tvtc_certified: "TVTC Certified",
      training_hours: "Training Hours", 
      completion_rate: "Completion Rate"
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
            <CardTitle>{t.active_programs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">34</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.tvtc_certified}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.training_hours}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">15,678</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.completion_rate}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">94%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingDevelopment;