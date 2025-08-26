import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAPITranslations } from "@/hooks/useAPITranslations";
import { useLanguage } from "@/hooks/useLanguageCompat";
import CenteredLayout from "@/components/layout/CenteredLayout";
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

import HowToUsePanel from "@/components/universal/HowToUsePanel";
import ModuleDocumentUploader from "@/components/universal/ModuleDocumentUploader";
import ModuleAIChat from "@/components/universal/ModuleAIChat";
import ModuleDiagnosticPanel from "@/components/universal/ModuleDiagnosticPanel";

const LeadershipConsulting = () => {
  const { t } = useAPITranslations();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <CenteredLayout 
      title={t('consulting.leadership_consulting')} 
      description={t('consulting.leadership_consulting_desc')}
    >
      <div className="w-full space-y-6">
        <HowToUsePanel moduleKey="leadership-consulting" />
        <ModuleDocumentUploader moduleKey="leadership-consulting" />
        <ModuleAIChat moduleKey="leadership-consulting" />
        <ModuleDiagnosticPanel moduleKey="leadership-consulting" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leaders Coached</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-primary">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leadership Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-success">8.7/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance Lift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-accent">+34%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ROI on Coaching</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-warning">520%</div>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Integration for Leadership Consulting */}
      <UniversalAIIntegrator 
        pageType="consulting" 
        moduleName="leadership-consulting" 
        companyId="demo-company" 
        enabledFeatures={['leadership-development', 'executive-coaching', 'strategic-guidance', 'organizational-leadership']}
      />
      </div>
    </CenteredLayout>
  );
};

export default LeadershipConsulting;