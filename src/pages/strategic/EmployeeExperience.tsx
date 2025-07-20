import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIFloatingAssistant from '@/components/ai/AIFloatingAssistant';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { useLanguage } from '@/hooks/useLanguageCompat';

const EmployeeExperience = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'تجربة الموظف' : 'Employee Experience'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'رسم خريطة الرحلة وتحسين التجربة' : 'Journey mapping and experience optimization'}
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
            <CardTitle>Experience Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">8.3/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Satisfaction Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">89%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">94%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Touchpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">45</div>
          </CardContent>
        </Card>
      </div>

      <AIFloatingAssistant 
        moduleContext="strategic"
        companyId="demo-company"
        currentPageData={{ experienceScore: 8.3, satisfactionRate: 89, retentionRate: 94 }}
      />
    </div>
  );
};

export default EmployeeExperience;