import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeEngagementEngine } from '@/components/engagement/EmployeeEngagementEngine';
import { PersonalizedEngagementStrategies } from '@/components/engagement/PersonalizedEngagementStrategies';
import { RetentionIntelligence } from '@/components/engagement/RetentionIntelligence';
import { InterventionStrategies } from '@/components/engagement/InterventionStrategies';
import { CommunicationOptimization } from '@/components/engagement/CommunicationOptimization';
import { WellnessSatisfaction } from '@/components/engagement/WellnessSatisfaction';
import { UniversalAIIntegrator } from '@/components/ai/UniversalAIIntegrator';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';

export default function GenerativeEngagementOptimization() {
  const { isRTL } = useUnifiedLocale();

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Generative Engagement Optimization (GEO)</h1>
        <p className="text-muted-foreground">
          AI-powered employee engagement and retention intelligence platform
        </p>
      </div>

      <Tabs defaultValue="engagement-engine" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="engagement-engine">Engagement Engine</TabsTrigger>
          <TabsTrigger value="personalized-strategies">Personalized Strategies</TabsTrigger>
          <TabsTrigger value="retention-intelligence">Retention Intelligence</TabsTrigger>
          <TabsTrigger value="intervention-strategies">Intervention Strategies</TabsTrigger>
          <TabsTrigger value="communication-optimization">Communication Optimization</TabsTrigger>
          <TabsTrigger value="wellness-satisfaction">Wellness & Satisfaction</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement-engine" className="space-y-6">
          <EmployeeEngagementEngine />
        </TabsContent>

        <TabsContent value="personalized-strategies" className="space-y-6">
          <PersonalizedEngagementStrategies />
        </TabsContent>

        <TabsContent value="retention-intelligence" className="space-y-6">
          <RetentionIntelligence />
        </TabsContent>

        <TabsContent value="intervention-strategies" className="space-y-6">
          <InterventionStrategies />
        </TabsContent>

        <TabsContent value="communication-optimization" className="space-y-6">
          <CommunicationOptimization />
        </TabsContent>

        <TabsContent value="wellness-satisfaction" className="space-y-6">
          <WellnessSatisfaction />
        </TabsContent>
      </Tabs>

      {/* AI Integration */}
      <UniversalAIIntegrator
        pageType="welfare"
        moduleName="GEO"
        enabledFeatures={[
          'engagement-analysis',
          'retention-prediction',
          'personalized-recommendations',
          'sentiment-analysis',
          'intervention-suggestions',
          'wellness-insights'
        ]}
      />
    </div>
  );
}