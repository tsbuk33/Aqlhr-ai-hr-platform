import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIFloatingAssistant from '@/components/ai/AIFloatingAssistant';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { useLanguage } from '@/hooks/useLanguageCompat';

const WPSProcessing = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'معالجة الرواتب WPS' : 'WPS Payroll Processing'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'إنتاج ومعالجة ملفات البنك WPS الآلية' : 'Automated WPS bank file generation and processing'}
        </p>
      </div>

      <AIInsightCard 
        moduleContext="payroll"
        companyId="demo-company"
        className="mb-6"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>This Month's Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">SAR 456,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>WPS Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">100%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">2.3 min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bank Files Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">12</div>
          </CardContent>
        </Card>
      </div>

      <AIFloatingAssistant 
        moduleContext="payroll"
        companyId="demo-company"
        currentPageData={{ monthlyPayroll: 456000, compliance: 100 }}
      />
    </div>
  );
};

export default WPSProcessing;