import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIFloatingAssistant from '@/components/ai/AIFloatingAssistant';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { useLanguage } from '@/hooks/useLanguageCompat';

const SuccessionPlanning = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'تخطيط التعاقب' : 'Succession Planning'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'خط أنابيب القيادة وتغطية المناصب الرئيسية' : 'Leadership pipeline and key position coverage'}
        </p>
      </div>

      <AIInsightCard 
        moduleContext="strategic"
        companyId="demo-company"
        className="mb-6"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Coverage Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">67%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ready Successors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">104</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Critical Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-danger">12</div>
          </CardContent>
        </Card>
      </div>

      <AIFloatingAssistant 
        moduleContext="strategic"
        companyId="demo-company"
        currentPageData={{ keyPositions: 156, coverageRate: 67, readySuccessors: 104 }}
      />
    </div>
  );
};

export default SuccessionPlanning;