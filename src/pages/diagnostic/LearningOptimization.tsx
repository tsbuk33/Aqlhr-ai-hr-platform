import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { PlanUpsellModal } from '@/components/plans/PlanUpsellModal';
import LEOOverview from '@/components/diagnostic/LEOOverview';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";
import { useLanguage } from '@/components/layout/UniversalLanguageProvider';

const LearningOptimization: React.FC = () => {
  const [caseId, setCaseId] = useState<string>('');
  const { companyId } = useUserCompany();
  const { hasAccess, upsellOpen, hideUpsell } = usePlanAccess('SKU_LEO');
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const createOrGetCase = async () => {
      if (!companyId) return;

      try {
        // Check for existing LEO case
        const { data: existingCase, error: fetchError } = await supabase
          .from('dx_cases')
          .select('id')
          .eq('tenant_id', companyId)
          .eq('module', 'LEO_ANALYSIS')
          .eq('status', 'active')
          .single();

        if (existingCase && !fetchError) {
          setCaseId(existingCase.id);
          return;
        }

        // Create new case
        const { data: newCase, error: createError } = await supabase
          .from('dx_cases')
          .insert({
            tenant_id: companyId,
            module: 'LEO_ANALYSIS',
            name: 'Learning Experience Optimization Analysis',
            status: 'active'
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating LEO case:', createError);
          return;
        }

        setCaseId(newCase.id);
      } catch (error) {
        console.error('Error managing LEO case:', error);
      }
    };

    createOrGetCase();
  }, [companyId]);

  if (!hasAccess) {
    return (
      <div className={`container mx-auto p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">{t('leo.title')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('leo.upgrade_message')}
          </p>
        </div>
        <PlanUpsellModal 
          isOpen={upsellOpen}
          onClose={hideUpsell}
          skuCode="SKU_LEO"
          featureName={t('leo.title')}
          description={t('leo.description')}
        />
      </div>
    );
  }

  if (!caseId) {
    return (
      <div className={`container mx-auto p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center py-12">
          <p>{t('leo.setting_up')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="overview">{t('leo.overview')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <LEOOverview caseId={caseId} />
        </TabsContent>
      </Tabs>
      
      <PlanUpsellModal
        isOpen={upsellOpen}
        onClose={hideUpsell}
        skuCode="SKU_LEO"
        featureName={t('leo.title')}
        description={t('leo.description')}
      />
      
      {/* AI Integration for Diagnostic Learning Optimization */}
      <UniversalAIIntegrator 
        pageType="training" 
        moduleName="learning-optimization" 
        companyId="demo-company" 
        enabledFeatures={['learning-optimization', 'skill-development', 'personalized-learning', 'training-analytics']}
      />
    </div>
  );
};

export default LearningOptimization;