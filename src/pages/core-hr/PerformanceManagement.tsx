import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const PerformanceManagement = () => {
  const { isRTL } = useLanguage();

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
    </div>
  );
};

export default PerformanceManagement;