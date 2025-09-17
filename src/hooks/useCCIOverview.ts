import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CCIOverviewData {
  balance_score: number | null;
  risk_index: number | null;
  psych_safety: number | null;
  barrett: {
    values_alignment?: number;
  } | null;
  cvf: {
    Clan?: number;
    Adhocracy?: number;
    Market?: number;
    Hierarchy?: number;
  } | null;
  web: {
    'Stories'?: number;
    'Symbols'?: number;
    'Power Structures'?: number;
    'Control Systems'?: number;
    'Rituals & Routines'?: number;
    'Organizational Structure'?: number;
  } | null;
  n: number;
  last_computed_at: string | null;
}

interface CCIOverviewRawData {
  balance_score: number | null;
  risk_index: number | null;
  psych_safety: number | null;
  barrett: any;
  cvf: any;
  web: any;
  n: number;
  last_computed_at: string | null;
}

export const useCCIOverview = (tenantId: string, surveyId: string, waveId: string) => {
  const [data, setData] = useState<CCIOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: overviewData, error } = await supabase.rpc('cci_get_overview_v1' as any, {
        p_tenant: tenantId,
        p_survey: surveyId,
        p_wave: waveId
      });

      if (error) {
        console.error('Error fetching CCI overview:', error);
        setError(error.message);
        toast({
          title: "Error fetching overview data",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (overviewData && Array.isArray(overviewData) && overviewData.length > 0) {
        const rawData = overviewData[0] as CCIOverviewRawData;
        setData({
          balance_score: rawData.balance_score,
          risk_index: rawData.risk_index,
          psych_safety: rawData.psych_safety,
          barrett: rawData.barrett as any,
          cvf: rawData.cvf as any,
          web: rawData.web as any,
          n: rawData.n,
          last_computed_at: rawData.last_computed_at
        });
      } else {
        setData(null);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "Failed to load overview data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const computeScores = async () => {
    try {
      const { error } = await supabase.rpc('cci_compute_scores_v1' as any, {
        p_tenant: tenantId,
        p_survey: surveyId,
        p_wave: waveId
      });

      if (error) {
        console.error('Error computing scores:', error);
        toast({
          title: "Error computing scores",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Scores computed successfully",
        description: "CCI scores have been updated",
      });

      // Refresh the data after computing scores
      await fetchOverviewData();
    } catch (err) {
      console.error('Unexpected error computing scores:', err);
      toast({
        title: "Error",
        description: "Failed to compute scores",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (tenantId && surveyId && waveId) {
      fetchOverviewData();
    }
  }, [tenantId, surveyId, waveId]);

  return {
    data,
    loading,
    error,
    refetch: fetchOverviewData,
    computeScores
  };
};