import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFeatureGating } from '@/hooks/useFeatureGating';
import { UpsellModal } from '@/components/common/UpsellModal';
import LEOOverview from '@/components/diagnostic/LEOOverview';
import { supabase } from '@/integrations/supabase/client';
import { useUserCompany } from '@/hooks/useUserCompany';

const LearningOptimization: React.FC = () => {
  const [caseId, setCaseId] = useState<string>('');
  const { companyId } = useUserCompany();
  const { hasAccess, upsellOpen, hideUpsell } = useFeatureGating('SKU_LEO');

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
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Learning Experience Optimization</h1>
          <p className="text-muted-foreground mb-6">
            This feature requires the LEO package. Please upgrade to access AI-powered learning optimization.
          </p>
        </div>
        <UpsellModal 
          isOpen={upsellOpen}
          onClose={hideUpsell}
          feature="Learning Experience Optimization"
          description="Get AI-powered skill gap analysis and personalized learning paths"
        />
      </div>
    );
  }

  if (!caseId) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p>Setting up Learning Optimization analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="overview">LEO Overview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <LEOOverview caseId={caseId} />
        </TabsContent>
      </Tabs>
      
      <UpsellModal 
        isOpen={upsellOpen}
        onClose={hideUpsell}
        feature="Learning Experience Optimization"
        description="Get AI-powered skill gap analysis and personalized learning paths"
      />
    </div>
  );
};

export default LearningOptimization;