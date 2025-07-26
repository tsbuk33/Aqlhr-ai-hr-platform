import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const DigitalTransformation = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'التحول الرقمي للموارد البشرية' : 'Digital HR Transformation'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'استشارات الرقمنة الشاملة من البداية إلى النهاية' : 'End-to-end digitalization consulting'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'النضج الرقمي' : 'Digital Maturity'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8.2/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'أتمتة العمليات' : 'Process Automation'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">89%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'كسب الكفاءة' : 'Efficiency Gain'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">+67%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'تحقيق عائد الاستثمار' : 'ROI Achievement'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">280%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DigitalTransformation;