import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthOptional } from '@/hooks/useAuthOptional';
import { toast } from 'sonner';

interface ExecutiveProfile {
  id: string;
  user_id: string;
  title: string;
  department?: string;
  level?: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface ExecutiveMetric {
  id: string;
  metric_date: string;
  metric_period: string;
  total_employees?: number;
  new_hires?: number;
  terminations?: number;
  turnover_rate?: number;
  saudization_ratio?: number;
  nitaqat_status?: string;
  government_compliance_score?: number;
  mol_penalties?: number;
  gosi_penalties?: number;
  nitaqat_incentives?: number;
  vision_2030_score?: number;
  local_content_percentage?: number;
  total_payroll_cost?: number;
  average_salary?: number;
  cost_per_employee?: number;
  created_at?: string;
}

interface ExecutiveInsight {
  id: string;
  title: string;
  description: string;
  priority?: string;
  actionable?: boolean;
  confidence_score?: number;
  data_sources?: any;
  recommendations?: any;
  created_at?: string;
  // Additional fields from ai_insights table
  insight_type?: string;
  impact_description?: string;
  status?: string;
  expires_at?: string;
  executive_id?: string;
  updated_at?: string;
}

interface ExecutiveData {
  profile: ExecutiveProfile | null;
  metrics: ExecutiveMetric[];
  insights: ExecutiveInsight[];
  loading: boolean;
  error: string | null;
}

export const useExecutiveData = () => {
  const { session } = useAuthOptional();
  const [data, setData] = useState<ExecutiveData>({
    profile: null,
    metrics: [],
    insights: [],
    loading: true,
    error: null
  });

  const [demoSeeded, setDemoSeeded] = useState(false);

  // Demo data seeding function
  const seedDemoData = async () => {
    if (demoSeeded || !session?.user?.id) return;

    try {
      console.log('AqlHR: Seeding executive demo data...');

      // Create executive profile if it doesn't exist
      const { data: existingProfile } = await supabase
        .from('executive_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('executive_profiles')
          .insert({
            user_id: session.user.id,
            title: 'Chief Executive Officer',
            department: 'Executive',
            level: 'C-Level',
            company_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' // Demo company ID
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      // Create executive metrics
      const currentDate = new Date();
      const metricsData = [
        {
          metric_date: currentDate.toISOString().split('T')[0],
          metric_period: 'monthly',
          total_employees: 1247,
          new_hires: 45,
          terminations: 12,
          turnover_rate: 3.2,
          saudization_ratio: 78.5,
          nitaqat_status: 'Green',
          government_compliance_score: 94.2,
          mol_penalties: 0,
          gosi_penalties: 0,
          nitaqat_incentives: 15000,
          vision_2030_score: 89.3,
          local_content_percentage: 82.1,
          total_payroll_cost: 8450000,
          average_salary: 6780,
          cost_per_employee: 6780
        }
      ];

      const { error: metricsError } = await supabase
        .from('executive_metrics')
        .upsert(metricsData, { 
          onConflict: 'metric_date,metric_period',
          ignoreDuplicates: false 
        });

      if (metricsError) {
        console.error('Metrics creation error:', metricsError);
      }

      setDemoSeeded(true);
      console.log('AqlHR: Executive demo data seeded successfully');
      
    } catch (error) {
      console.error('AqlHR: Failed to seed executive demo data:', error);
    }
  };

  // Load executive data
  const loadExecutiveData = async () => {
    if (!session?.user?.id) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Load executive profile
      const { data: profile, error: profileError } = await supabase
        .from('executive_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Failed to load executive profile:', profileError);
      }

      // Load executive metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('executive_metrics')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(12);

      if (metricsError) {
        console.error('Failed to load executive metrics:', metricsError);
      }

      // Load AI insights
      let insights: ExecutiveInsight[] = [];
      try {
        const { data: aiInsights, error: insightsError } = await supabase
          .from('ai_insights')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (insightsError) {
          console.error('Failed to load AI insights:', insightsError);
        } else {
          insights = aiInsights || [];
        }
      } catch (err) {
        console.log('AI insights table not available, using mock data');
        insights = getMockInsights();
      }

      setData({
        profile: profile || null,
        metrics: metrics || [],
        insights,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('AqlHR: Failed to load executive data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load executive data'
      }));
    }
  };

  // Mock insights for when AI insights table is not available
  const getMockInsights = (): ExecutiveInsight[] => [
    {
      id: '1',
      title: 'Workforce Optimization Opportunity',
      description: 'Analysis shows potential for 15% efficiency improvement through strategic workforce planning',
      priority: 'high',
      actionable: true,
      confidence_score: 89,
      insight_type: 'hr',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Saudization Compliance Alert',
      description: 'Current Saudization ratio is 78.5%. Consider strategic hiring to maintain Green status',
      priority: 'medium',
      actionable: true,
      confidence_score: 95,
      insight_type: 'compliance',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Cost Optimization Opportunity',
      description: 'Payroll cost analysis suggests potential savings of SAR 125,000 through strategic restructuring',
      priority: 'medium',
      actionable: true,
      confidence_score: 78,
      insight_type: 'finance',
      created_at: new Date().toISOString()
    }
  ];

  // Generate AI insights
  const generateInsights = async () => {
    try {
      console.log('AqlHR: Generating executive insights...');
      
      const { data: response, error } = await supabase.functions.invoke('generate-executive-insights', {
        body: {
          executiveId: data.profile?.id,
          metrics: data.metrics,
          analysisType: 'comprehensive'
        }
      });

      if (error) {
        console.error('Failed to generate insights:', error);
        toast.error('Failed to generate AI insights');
        return;
      }

      toast.success('AI insights generated successfully');
      await loadExecutiveData(); // Refresh data
      
    } catch (error) {
      console.error('AqlHR: Failed to generate insights:', error);
      toast.error('Failed to generate insights');
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      seedDemoData().then(() => {
        loadExecutiveData();
      });
    }
  }, [session?.user?.id, demoSeeded]);

  const refetch = () => {
    loadExecutiveData();
  };

  return {
    ...data,
    refetch,
    seedDemoData,
    generateInsights
  };
};