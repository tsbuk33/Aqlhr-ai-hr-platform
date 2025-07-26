import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const MergerIntegration = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'تكامل عمليات الدمج والاستحواذ' : 'Merger & Acquisition Integration'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'تكامل الموارد البشرية لمعاملات الدمج والاستحواذ' : 'HR integration for M&A transactions'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'نقاط التكامل' : 'Integration Score'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">94%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'التآزر المحقق' : 'Synergy Achieved'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isArabic ? '12 مليون ريال' : 'SAR 12M'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'معدل الاحتفاظ' : 'Retention Rate'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">91%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الوقت لتحقيق القيمة' : 'Time to Value'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isArabic ? '6 أشهر' : '6 months'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MergerIntegration;