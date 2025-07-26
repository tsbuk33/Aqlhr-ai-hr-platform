import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguageCompat";

const BenchmarkingAnalysis = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'تحليل المقارنات المرجعية' : 'Benchmarking Analysis'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'مقارنة السوق والتحليل التنافسي' : 'Market comparison and competitive analysis'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الموقع في السوق' : 'Market Position'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {isArabic ? 'أعلى 25%' : 'Top 25%'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الشركات النظيرة' : 'Peer Companies'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'نقاط البيانات' : 'Data Points'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'نقاط الدقة' : 'Accuracy Score'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">96.8%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BenchmarkingAnalysis;