import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, Users, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WorkforcePlanning = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isArabic ? 'تخطيط القوى العاملة' : 'Workforce Planning'}</h1>
          <p className="text-muted-foreground">{isArabic ? 'نمذجة السيناريوهات والتخطيط الاستراتيجي للقوى العاملة' : 'Strategic workforce forecasting and scenario modeling'}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Upload className="h-4 w-4 mr-2" />{isArabic ? 'رفع اكسل' : 'Upload Excel'}</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />{isArabic ? 'تصدير التقرير' : 'Export Report'}</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-primary" />
              {isArabic ? 'العدد الحالي' : 'Current Headcount'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">2,847</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-success" />
              {isArabic ? 'النمو المخطط' : 'Planned Growth'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">+15%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'فجوات المهارات' : 'Skills Gaps'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'دقة التخطيط' : 'Planning Accuracy'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">94.2%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkforcePlanning;