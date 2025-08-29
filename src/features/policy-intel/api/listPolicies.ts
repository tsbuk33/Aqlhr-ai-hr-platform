import { supabase } from '@/integrations/supabase/client'
import { useQuery } from '@tanstack/react-query'

export interface PolicyListParams {
  q?: string
  from?: string
  to?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PolicyListItem {
  id: string
  title: string
  description: string
  created_at: string
  updated_at: string
  overall_score: number
  compliance_score: Record<string, number>
  business_score: Record<string, number>
  implementation_score: Record<string, number>
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  status: string
}

export interface PolicyListResponse {
  rows: PolicyListItem[]
  total: number
  page: number
  pageSize: number
}

export interface TrendData {
  date: string
  total_policies: number
  avg_risk_score: number
  high_risk_count: number
  medium_risk_count: number
  low_risk_count: number
}

export async function listPolicies(params: PolicyListParams = {}): Promise<PolicyListResponse> {
  // Mock data for policy intelligence
  const mockData: PolicyListItem[] = [
    {
      id: '1',
      title: 'Employee Data Protection Policy',
      description: 'Guidelines for handling employee personal data',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T14:30:00Z',
      overall_score: 7.5,
      compliance_score: { legal: 8, regulatory: 7, internal: 7, industry: 8 },
      business_score: { impact: 6, operations: 7, financial: 8, reputation: 9 },
      implementation_score: { complexity: 6, resources: 7, timeline: 8, risk: 7 },
      risk_level: 'medium',
      status: 'active'
    }
  ]

  return {
    rows: mockData,
    total: mockData.length,
    page: params.page || 1,
    pageSize: params.pageSize || 10
  }
}

export function usePolicyList(params: PolicyListParams = {}) {
  return useQuery({
    queryKey: ['policy-list', params],
    queryFn: () => listPolicies(params),
    staleTime: 5 * 60 * 1000
  })
}

export async function getPolicyTrends(from?: string, to?: string): Promise<TrendData[]> {
  return [
    { date: '2024-01-01', total_policies: 45, avg_risk_score: 6.2, high_risk_count: 8, medium_risk_count: 22, low_risk_count: 15 }
  ]
}

export function usePolicyTrends(from?: string, to?: string) {
  return useQuery({
    queryKey: ['policy-trends', from, to],
    queryFn: () => getPolicyTrends(from, to),
    staleTime: 10 * 60 * 1000
  })
}