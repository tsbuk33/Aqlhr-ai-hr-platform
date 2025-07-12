import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const Organization = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      structure: "Organization Structure",
      dynamic_chart: "Dynamic organizational chart and reporting structure",
      total_departments: "Total Departments",
      management_levels: "Management Levels",
      saudization_rate: "Saudization Rate",
      open_positions: "Open Positions",
      org_chart: "Organization Chart",
      visual_representation: "Visual representation of company hierarchy",
      interactive_chart: "Interactive organizational chart will be displayed here"
    },
    ar: {
      structure: "الهيكل التنظيمي",
      dynamic_chart: "مخطط تنظيمي ديناميكي وهيكل التقارير",
      total_departments: "إجمالي الأقسام",
      management_levels: "مستويات الإدارة",
      saudization_rate: "معدل السعودة",
      open_positions: "المناصب الشاغرة",
      org_chart: "المخطط التنظيمي",
      visual_representation: "تمثيل مرئي للهيكل الهرمي للشركة",
      interactive_chart: "سيتم عرض المخطط التنظيمي التفاعلي هنا"
    }
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('structure')}</h1>
        <p className="text-muted-foreground">{t('dynamic_chart')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('total_departments')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-primary">28</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('management_levels')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-success">5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('saudization_rate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-accent">67.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('open_positions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-warning">23</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('org_chart')}</CardTitle>
          <CardDescription>{t('visual_representation')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">{t('interactive_chart')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Organization;