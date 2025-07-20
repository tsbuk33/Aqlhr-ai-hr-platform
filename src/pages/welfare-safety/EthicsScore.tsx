import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIFloatingAssistant from '@/components/ai/AIFloatingAssistant';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { useLanguage } from '@/hooks/useLanguageCompat';

const EthicsScore = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'نقاط الأخلاق لكل مقاول فرعي' : 'Ethics Score per Subcontractor'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'مراقبة الامتثال الأخلاقي للمقاولين' : 'Ethical compliance monitoring for contractors'}
        </p>
      </div>

      <AIInsightCard 
        moduleContext="welfare"
        companyId="demo-company"
        className="mb-6"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subcontractors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">47</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Ethics Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">8.7/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">94.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Issues Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">23</div>
          </CardContent>
        </Card>
      </div>

      <AIFloatingAssistant 
        moduleContext="welfare"
        companyId="demo-company"
        currentPageData={{ subcontractors: 47, avgEthicsScore: 8.7, complianceRate: 94.2 }}
      />
    </div>
  );
};

export default EthicsScore;