import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const ChangeManagement = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'إدارة التغيير' : 'Change Management'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'استراتيجية وتنفيذ التغيير التنظيمي' : 'Organizational change strategy and implementation'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'جاهزية التغيير' : 'Change Readiness'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">84%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'معدل التبني' : 'Adoption Rate'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">91%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'معدل النجاح' : 'Success Rate'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الوقت لتحقيق القيمة' : 'Time to Value'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isArabic ? '4.2 أشهر' : '4.2 months'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangeManagement;