import { HSEDashboard } from "@/components/hse/HSEDashboard";
import { UniversalDocumentManager } from "@/components/common/UniversalDocumentManager";
import AIQueryInterface from "@/components/ai/AIQueryInterface";
import AIRecommendationCenter from "@/components/ai/AIRecommendationCenter";
import AutomationWorkflowEngine from "@/components/ai/AutomationWorkflowEngine";
import CrossModuleIntelligence from "@/components/ai/CrossModuleIntelligence";
import { useLanguage } from '@/hooks/useLanguageCompat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AqlHRAIAssistant } from '@/components/ai';

const HealthSafety = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {isArabic ? 'الصحة والسلامة المهنية' : 'Health & Safety'}
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {isArabic ? 'نظام شامل لإدارة الصحة والسلامة المهنية مع أدوات الذكاء الاصطناعي المتقدمة' : 'Comprehensive occupational health and safety management system with advanced AI tools'}
        </p>
      </div>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">
            {isArabic ? 'لوحة القيادة' : 'Dashboard'}
          </TabsTrigger>
          <TabsTrigger value="ai-assistant">
            {isArabic ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'}
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            {isArabic ? 'التوصيات الذكية' : 'Smart Recommendations'}
          </TabsTrigger>
          <TabsTrigger value="ai-automation">
            {isArabic ? 'الأتمتة الذكية' : 'AI Automation'}
          </TabsTrigger>
          <TabsTrigger value="cross-intelligence">
            {isArabic ? 'الذكاء المتقاطع' : 'Cross-Module Intelligence'}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {isArabic ? 'إدارة الوثائق' : 'Document Management'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <HSEDashboard />
        </TabsContent>

        <TabsContent value="ai-assistant">
          <AIQueryInterface 
            moduleContext="health_safety"
            companyId="demo-company"
            className="mb-6"
          />
        </TabsContent>

        <TabsContent value="recommendations">
          <AIRecommendationCenter 
            companyId="demo-company"
          />
        </TabsContent>

        <TabsContent value="ai-automation">
          <AutomationWorkflowEngine />
        </TabsContent>

        <TabsContent value="cross-intelligence">
          <CrossModuleIntelligence />
        </TabsContent>

        <TabsContent value="documents">
          <UniversalDocumentManager
            moduleName={isArabic ? "الصحة والسلامة المهنية" : "Health & Safety"}
            description={isArabic ? "إدارة شاملة لوثائق الصحة والسلامة والتقارير" : "Comprehensive management of health, safety documents and reports"}
            platform="health_safety"
            moduleType="medical"
            acceptedTypes={['.pdf', '.doc', '.docx', '.xlsx', '.jpg', '.png', '.mp4']}
            maxFileSize={50}
            maxFiles={300}
          />
        </TabsContent>
      </Tabs>

      <AqlHRAIAssistant 
        moduleContext="health-safety" 
        companyId="demo-company"
      />
    </div>
  );
};

export default HealthSafety;