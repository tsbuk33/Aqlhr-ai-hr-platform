import { supabase } from '@/integrations/supabase/client';

export interface CCIOverviewData {
  balance_score: number | null;
  risk_index: number | null;
  psych_safety: number | null;
  values_alignment: number | null;
  cvf: any;
  web: any;
  barrett: any;
  n: number | null;
  last_computed_at: string | null;
}

export interface CCIInitiative {
  title_en: string;
  title_ar: string;
  priority: string;
  owner_role: string;
  milestones: any[];
}

export interface CCIPlaybookData {
  summary_en: string;
  summary_ar: string;
  initiatives: CCIInitiative[];
  pulses: { day: 30 | 60 | 90 }[];
}

export async function fetchOverview(tenantId: string, surveyId: string, waveId?: string): Promise<CCIOverviewData | null> {
  try {
    const { data, error } = await supabase.rpc('cci_get_overview_v1', {
      p_tenant: tenantId,
      p_survey: surveyId,
      p_wave: waveId || null
    });

    if (error) {
      console.error('Error fetching CCI overview:', error);
      return null;
    }

    if (data && data.length > 0) {
      const rawData = data[0];
      return {
        balance_score: rawData.balance_score,
        risk_index: rawData.risk_index,
        psych_safety: rawData.psych_safety,
        values_alignment: (rawData.barrett as any)?.values_alignment || null,
        cvf: rawData.cvf,
        web: rawData.web,
        barrett: rawData.barrett,
        n: rawData.n,
        last_computed_at: rawData.last_computed_at
      };
    }
  } catch (error) {
    console.error('Error fetching CCI overview:', error);
    return null;
  }
}

export async function fetchHeatmap(tenantId: string, surveyId: string, waveId: string, scope: 'dept' | 'project' | 'grade') {
  try {
    const { data, error } = await supabase.rpc('cci_get_heatmap_v1', {
      p_tenant: tenantId,
      p_survey: surveyId,
      p_wave: waveId,
      p_scope: scope
    });

    if (error) {
      console.error('Error fetching CCI heatmap:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching CCI heatmap:', error);
    return null;
  }
}

export async function fetchPlaybook(tenantId: string, surveyId: string, waveId: string): Promise<CCIPlaybookData | null> {
  try {
    const { data, error } = await supabase
      .from('cci_playbooks')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('survey_id', surveyId)
      .eq('wave_id', waveId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching CCI playbook:', error);
      return null;
    }

    if (!data) {
      return {
        summary_en: 'No playbook available',
        summary_ar: 'لا توجد خطة عمل متاحة',
        initiatives: [],
        pulses: [{ day: 30 }, { day: 60 }, { day: 90 }]
      };
    }

    return {
      summary_en: data.ai_summary || data.comms_en || 'No summary available',
      summary_ar: data.comms_ar || 'لا يوجد ملخص متاح',
      initiatives: Array.isArray(data.initiatives) ? (data.initiatives as unknown) as CCIInitiative[] : [],
      pulses: (data.schedule as any)?.pulses || [{ day: 30 }, { day: 60 }, { day: 90 }]
    };
  } catch (error) {
    console.error('Error fetching CCI playbook:', error);
    return null;
  }
}

export async function fetchCSVData(tenantId: string, surveyId: string, waveId: string) {
  try {
    // Fetch aggregated scores from cci_scores table
    const { data, error } = await supabase
      .from('cci_scores')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('survey_id', surveyId)
      .eq('wave_id', waveId)
      .gte('n', 7); // Only include groups with n >= 7 for anonymity

    if (error) {
      console.error('Error fetching CCI CSV data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching CCI CSV data:', error);
    return null;
  }
}

export function generateCSVContent(data: any[]): string {
  if (!data || data.length === 0) {
    return 'No data available\n';
  }

  // Define CSV headers
  const headers = [
    'scope',
    'scope_id', 
    'n',
    'balance_score',
    'risk_index',
    'psych_safety',
    'values_alignment',
    'cvf_clan',
    'cvf_adhocracy', 
    'cvf_market',
    'cvf_hierarchy',
    'web_stories',
    'web_symbols',
    'web_power_structures',
    'web_control_systems',
    'web_rituals_routines',
    'web_organizational_structure',
    'last_computed_at'
  ];

  // Build CSV content
  let csvContent = headers.join(',') + '\n';

  data.forEach(row => {
    const csvRow = headers.map(header => {
      let value = '';
      
      switch (header) {
        case 'cvf_clan':
          value = row.cvf?.Clan || '';
          break;
        case 'cvf_adhocracy':
          value = row.cvf?.Adhocracy || '';
          break;
        case 'cvf_market':
          value = row.cvf?.Market || '';
          break;
        case 'cvf_hierarchy':
          value = row.cvf?.Hierarchy || '';
          break;
        case 'web_stories':
          value = row.web?.Stories || '';
          break;
        case 'web_symbols':
          value = row.web?.Symbols || '';
          break;
        case 'web_power_structures':
          value = row.web?.['Power Structures'] || '';
          break;
        case 'web_control_systems':
          value = row.web?.['Control Systems'] || '';
          break;
        case 'web_rituals_routines':
          value = row.web?.['Rituals & Routines'] || '';
          break;
        case 'web_organizational_structure':
          value = row.web?.['Organizational Structure'] || '';
          break;
        case 'values_alignment':
          value = row.barrett?.values_alignment || '';
          break;
        default:
          value = row[header] || '';
      }
      
      // Escape commas in values
      if (typeof value === 'string' && value.includes(',')) {
        value = `"${value}"`;
      }
      
      return value;
    });
    
    csvContent += csvRow.join(',') + '\n';
  });

  return csvContent;
}