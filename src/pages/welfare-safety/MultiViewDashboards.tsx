import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const MultiViewDashboards = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? "لوحات المعلومات متعددة الطرق" : "Multi-View Dashboards"}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? "طرق عرض مسؤول الموارد البشرية والعامل ومدير الموقع واللجنة التنفيذية" : "HR Admin, Worker, Site Manager, and ExCom views"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "طرق عرض لوحة المعلومات" : "Dashboard Views"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "المستخدمون النشطون" : "Active Users"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "الأدوات" : "Widgets"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">67</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? "معدل التخصيص" : "Customization Rate"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">82.4%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultiViewDashboards;