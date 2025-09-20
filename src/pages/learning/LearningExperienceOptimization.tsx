import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdaptiveLearningEngine } from '@/components/learning/AdaptiveLearningEngine';
import { ContentManagementSystem } from '@/components/learning/ContentManagementSystem';
import { LearningAnalytics } from '@/components/learning/LearningAnalytics';
import { OrganizationalLearningIntelligence } from '@/components/learning/OrganizationalLearningIntelligence';
import { DeliveryMechanisms } from '@/components/learning/DeliveryMechanisms';
import { AssessmentCertification } from '@/components/learning/AssessmentCertification';
import { AILearningFeatures } from '@/components/learning/AILearningFeatures';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';
import { BookOpen, Brain, BarChart, Building, Smartphone, Award, Sparkles } from 'lucide-react';

const LearningExperienceOptimization: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`container mx-auto p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('leo.title')}</h1>
        <p className="text-muted-foreground text-lg">
          {t('leo.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="adaptive-engine" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="adaptive-engine" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">{t('leo.adaptive_engine', 'Adaptive Engine')}</span>
          </TabsTrigger>
          <TabsTrigger value="content-management" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t('leo.content_management', 'Content')}</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">{t('leo.analytics', 'Analytics')}</span>
          </TabsTrigger>
          <TabsTrigger value="organizational" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">{t('leo.organizational', 'Organizational')}</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">{t('leo.delivery', 'Delivery')}</span>
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">{t('leo.assessment', 'Assessment')}</span>
          </TabsTrigger>
          <TabsTrigger value="ai-features" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">{t('leo.ai_features', 'AI Features')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="adaptive-engine" className="space-y-6">
          <AdaptiveLearningEngine />
        </TabsContent>

        <TabsContent value="content-management" className="space-y-6">
          <ContentManagementSystem />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <LearningAnalytics />
        </TabsContent>

        <TabsContent value="organizational" className="space-y-6">
          <OrganizationalLearningIntelligence />
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <DeliveryMechanisms />
        </TabsContent>

        <TabsContent value="assessment" className="space-y-6">
          <AssessmentCertification />
        </TabsContent>

        <TabsContent value="ai-features" className="space-y-6">
          <AILearningFeatures />
        </TabsContent>
      </Tabs>

      {/* AI Integration for Learning Experience Optimization */}
      <UniversalAIIntegrator 
        pageType="learning" 
        moduleName="learning-experience-optimization" 
        companyId="demo-company" 
        enabledFeatures={['adaptive-learning', 'content-management', 'learning-analytics', 'personalized-paths', 'competency-tracking']}
      />
    </div>
  );
};

export default LearningExperienceOptimization;