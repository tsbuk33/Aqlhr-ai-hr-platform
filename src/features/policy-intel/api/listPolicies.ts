import { supabase } from '@/lib/supabase'

export interface PolicyListParams {
  page?: number
  pageSize?: number
  q?: string
  from?: string
  to?: string
  orderBy?: 'created_at' | 'overall'
  dir?: 'asc' | 'desc'
}

export interface PolicyListItem {
  id: string
  title: string
  created_at: string
  overall_score: number
  compliance_score: {
    saudiLaborLaw: number
    workplaceRights: number
    discriminationPrevention: number
    dataProtection: number
  }
  business_score: {
    operationalComplexity: number
    resourceRequirements: number
    stakeholderImpact: number
    financialImplications: number
  }
  implementation_score: {
    systemComplexity: number
    changeResistance: number
    trainingRequirements: number
    monitoringDifficulty: number
  }
  mitigation_count: number
  citation_count: number
  policy_doc_id?: string
  source_text?: string
}

export interface PolicyListResponse {
  rows: PolicyListItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export async function listPolicies(params: PolicyListParams = {}): Promise<PolicyListResponse> {
  try {
    const {
      page = 1,
      pageSize = 20,
      q,
      from,
      to,
      orderBy = 'created_at',
      dir = 'desc'
    } = params

    // Build query parameters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      orderBy,
      dir
    })

    if (q) queryParams.set('q', q)
    if (from) queryParams.set('from', from)
    if (to) queryParams.set('to', to)

    const { data, error } = await supabase.functions.invoke('policy-risk-list-v1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (error) {
      console.error('Error fetching policy list:', error)
      throw new Error(`Failed to fetch policy list: ${error.message}`)
    }

    return data as PolicyListResponse

  } catch (error) {
    console.error('Unexpected error in listPolicies:', error)
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

// Hook for React components
import { useQuery } from '@tanstack/react-query'

export function usePolicyList(params: PolicyListParams = {}) {
  return useQuery({
    queryKey: ['policy-list', params],
    queryFn: () => listPolicies(params),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
    retry: 2
  })
}

// Get trends data from materialized view
export interface TrendData {
  day: string
  assessment_count: number
  overall_avg: number
  overall_max: number
  overall_min: number
  saudi_labor_avg: number
  workplace_rights_avg: number
  discrimination_prev_avg: number
  data_protection_avg: number
  operational_complexity_avg: number
  resource_requirements_avg: number
  stakeholder_impact_avg: number
  financial_implications_avg: number
  system_complexity_avg: number
  change_resistance_avg: number
  training_requirements_avg: number
  monitoring_difficulty_avg: number
}

export async function getPolicyTrends(from?: string, to?: string): Promise<TrendData[]> {
  try {
    let query = supabase
      .from('policy_risk_daily')
      .select('*')
      .order('day', { ascending: true })

    if (from) {
      query = query.gte('day', from)
    }
    if (to) {
      query = query.lte('day', to)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching trends:', error)
      throw new Error(`Failed to fetch trends: ${error.message}`)
    }

    return data || []

  } catch (error) {
    console.error('Unexpected error in getPolicyTrends:', error)
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}

export function usePolicyTrends(from?: string, to?: string) {
  return useQuery({
    queryKey: ['policy-trends', from, to],
    queryFn: () => getPolicyTrends(from, to),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2
  })
}