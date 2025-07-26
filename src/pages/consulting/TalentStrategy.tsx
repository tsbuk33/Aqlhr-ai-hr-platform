import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const TalentStrategy = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'استشارات استراتيجية المواهب' : 'Talent Strategy Consulting'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'التخطيط الاستراتيجي للمواهب والتحسين' : 'Strategic talent planning and optimization'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'خط أنابيب المواهب' : 'Talent Pipeline'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'نقاط الجودة' : 'Quality Score'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">9.1/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'وقت التوظيف' : 'Time to Hire'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isArabic ? '18 يوم' : '18 days'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'تكلفة التوظيف' : 'Cost per Hire'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isArabic ? '8,900 ريال' : 'SAR 8,900'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentStrategy;