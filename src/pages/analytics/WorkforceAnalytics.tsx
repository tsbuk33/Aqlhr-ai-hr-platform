import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AqlHRAIAssistant } from "@/components/ai/AqlHRAIAssistant";
import { Button } from "@/components/ui/button";
import { Upload, Download, BarChart } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguageCompat";

const WorkforceAnalytics = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isArabic ? 'تحليلات القوى العاملة' : 'Workforce Analytics'}
          </h1>
          <p className="text-muted-foreground">
            {isArabic ? 'تحليل شامل لبيانات الموظفين والأداء التشغيلي' : 'Comprehensive analysis of employee data and operational performance'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            {isArabic ? 'رفع البيانات' : 'Upload Data'}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {isArabic ? 'تصدير التقرير' : 'Export Report'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-brand-primary" />
              {isArabic ? 'التقارير التحليلية' : 'Analytics Reports'}
            </CardTitle>
            <CardDescription>
              {isArabic ? 'تقارير مفصلة للأداء' : 'Detailed performance reports'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">247</div>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'تقرير نشط' : 'Active reports'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'دقة البيانات' : 'Data Accuracy'}</CardTitle>
            <CardDescription>
              {isArabic ? 'مستوى جودة البيانات' : 'Data quality level'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">99.2%</div>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'دقة عالية' : 'High accuracy'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'الرؤى المتولدة' : 'Insights Generated'}</CardTitle>
            <CardDescription>
              {isArabic ? 'تحليلات ذكية' : 'Smart analytics'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">1,234</div>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'رؤية ذكية' : 'Smart insights'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{isArabic ? 'تأثير القرارات' : 'Decision Impact'}</CardTitle>
            <CardDescription>
              {isArabic ? 'معدل تحسن الأداء' : 'Performance improvement rate'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">87%</div>
            <p className="text-sm text-muted-foreground">
              {isArabic ? 'تأثير إيجابي' : 'Positive impact'}
            </p>
          </CardContent>
        </Card>
      </div>

      <AqlHRAIAssistant 
        moduleContext="analytics.workforce" 
        companyId="demo-company"
      />
    </div>
  );
};

export default WorkforceAnalytics;