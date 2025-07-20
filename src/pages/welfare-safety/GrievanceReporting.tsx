import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AIFloatingAssistant from '@/components/ai/AIFloatingAssistant';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { useLanguage } from '@/hooks/useLanguageCompat';

const GrievanceReporting = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {isArabic ? 'الإبلاغ عن المظالم والتحرش' : 'Grievance & Harassment Reporting'}
        </h1>
        <p className="text-muted-foreground">
          {isArabic ? 'نظام إبلاغ مجهول على مدار الساعة' : 'Anonymous 24/7 reporting system'}
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
            <CardTitle>Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Anonymous Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">67</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolved Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">82</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">4.2h</div>
          </CardContent>
        </Card>
      </div>

      <AIFloatingAssistant 
        moduleContext="welfare"
        companyId="demo-company"
        currentPageData={{ totalReports: 89, anonymousReports: 67, resolvedCases: 82 }}
      />
    </div>
  );
};

export default GrievanceReporting;