import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIFloatingAssistant from '@/components/ai/AIFloatingAssistant';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { useLanguage } from '@/hooks/useLanguageCompat';

const BudgetForecasting = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'التنبؤ بالميزانية' : 'Budget Forecasting'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'ميزانية الرواتب والتخطيط المالي' : 'Payroll budgeting and financial planning'}
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
            <CardTitle>Annual Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">SAR 5.47M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">78.9%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Forecast Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">94.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">-2.1%</div>
          </CardContent>
        </Card>
      </div>

      <AIFloatingAssistant 
        moduleContext="payroll"
        companyId="demo-company"
        currentPageData={{ annualBudget: 5470000, budgetUtilization: 78.9, forecastAccuracy: 94.2 }}
      />
    </div>
  );
};

export default BudgetForecasting;