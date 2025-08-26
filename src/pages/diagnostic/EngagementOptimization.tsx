import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePlanAccess } from '@/hooks/usePlanAccess';
import { PlanUpsellModal } from '@/components/plans/PlanUpsellModal';
import GEOOverview from '@/components/diagnostic/GEOOverview';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';
import { UniversalAIIntegrator } from "@/components/ai/UniversalAIIntegrator";

const EngagementOptimization: React.FC = () => {
  const [caseId, setCaseId] = useState<string>('');
  const { companyId } = useUserCompany();
  const { hasAccess, upsellOpen, hideUpsell } = usePlanAccess('SKU_GEO');

  useEffect(() => {
    const createOrGetCase = async () => {
      if (!companyId) return;

      try {
        // Check for existing GEO case
        const { data: existingCase, error: fetchError } = await supabase
          .from('dx_cases')
          .select('id')
          .eq('tenant_id', companyId)
          .eq('module', 'GEO_ANALYSIS')
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
            module: 'GEO_ANALYSIS',
            name: 'Generative Engagement Optimization Analysis',
            status: 'active'
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating GEO case:', createError);
          return;
        }

        setCaseId(newCase.id);
      } catch (error) {
        console.error('Error managing GEO case:', error);
      }
    };

    createOrGetCase();
  }, [companyId]);

  if (!hasAccess) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Generative Engagement Optimization</h1>
          <p className="text-muted-foreground mb-6">
            This feature requires the GEO package. Please upgrade to access automated engagement optimization.
          </p>
        </div>
        <PlanUpsellModal 
          isOpen={upsellOpen}
          onClose={hideUpsell}
          skuCode="SKU_GEO"
          featureName="Generative Engagement Optimization"
          description="Get automated engagement pulses and targeted interventions for your teams"
        />
      </div>
    );
  }

  if (!caseId) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p>Setting up Engagement Optimization analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="overview">GEO Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <GEOOverview caseId={caseId} />
        </TabsContent>
      </Tabs>
      
      <PlanUpsellModal
        isOpen={upsellOpen}
        onClose={hideUpsell}
        skuCode="SKU_GEO"
        featureName="Generative Engagement Optimization"
        description="Get automated engagement pulses and targeted interventions for your teams"
      />
      
      {/* AI Integration for Engagement Optimization */}
      <UniversalAIIntegrator 
        pageType="diagnostic" 
        moduleName="engagement-optimization" 
        companyId="demo-company" 
        enabledFeatures={['engagement-insights', 'employee-wellbeing', 'performance-optimization', 'predictive-analytics']}
      />
    </div>
  );
};

export default EngagementOptimization;