import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIFloatingAssistant from '@/components/ai/AIFloatingAssistant';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { useLanguage } from '@/hooks/useLanguageCompat';

const DiversityInclusion = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'التنوع والشمول' : 'Diversity & Inclusion'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'بناء ثقافة مكان عمل شاملة' : 'Building inclusive workplace culture'}
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
            <CardTitle>Gender Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">42%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inclusion Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">8.1/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leadership Diversity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">35%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>D&I Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">18</div>
          </CardContent>
        </Card>
      </div>

      <AIFloatingAssistant 
        moduleContext="strategic"
        companyId="demo-company"
        currentPageData={{ genderBalance: 42, inclusionScore: 8.1, leadershipDiversity: 35 }}
      />
    </div>
  );
};

export default DiversityInclusion;