import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const StrategicPlanning = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'التخطيط الاستراتيجي للموارد البشرية' : 'Strategic HR Planning'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'تطوير وتنفيذ استراتيجيات الموارد البشرية طويلة المدى' : 'Long-term HR strategy development and execution'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الأهداف الاستراتيجية' : 'Strategic Goals'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'معدل الإنجاز' : 'Achievement Rate'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'أفق التخطيط' : 'Planning Horizon'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isArabic ? '5 سنوات' : '5 Years'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'عائد الاستثمار الاستراتيجي' : 'Strategic ROI'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">450%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrategicPlanning;