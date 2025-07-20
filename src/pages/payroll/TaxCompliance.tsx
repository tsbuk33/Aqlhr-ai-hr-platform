import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIFloatingAssistant from '@/components/ai/AIFloatingAssistant';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { useLanguage } from '@/hooks/useLanguageCompat';

const TaxCompliance = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'امتثال الضرائب' : 'Tax Compliance'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'إدارة ضريبة القيمة المضافة وضريبة الدخل' : 'VAT and income tax management'}
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
            <CardTitle>VAT Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">SAR 45,600</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tax Returns Filed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">12/12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">100%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tax Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">SAR 23K</div>
          </CardContent>
        </Card>
      </div>

      <AIFloatingAssistant 
        moduleContext="payroll"
        companyId="demo-company"
        currentPageData={{ vatCollected: 45600, taxReturns: 12, complianceScore: 100 }}
      />
    </div>
  );
};

export default TaxCompliance;