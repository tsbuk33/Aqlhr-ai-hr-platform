import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIFloatingAssistant from '@/components/ai/AIFloatingAssistant';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { useLanguage } from '@/hooks/useLanguageCompat';

const TalentAcquisition = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'اكتساب المواهب' : 'Talent Acquisition'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'التوظيف الاستراتيجي ومصادر المواهب' : 'Strategic hiring and talent sourcing'}
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
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time to Fill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">21 days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost per Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">SAR 12,500</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">8.4/10</div>
          </CardContent>
        </Card>
      </div>

      <AIFloatingAssistant 
        moduleContext="strategic"
        companyId="demo-company"
        currentPageData={{ openPositions: 45, timeToFill: 21, qualityScore: 8.4 }}
      />
    </div>
  );
};

export default TalentAcquisition;