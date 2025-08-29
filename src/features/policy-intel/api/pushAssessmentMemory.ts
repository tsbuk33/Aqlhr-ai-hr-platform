import { supabase } from '@/integrations/supabase/client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { PolicyListItem } from './listPolicies'

export interface AssessmentSummary {
  policy_id: string
  title: string
  overall_risk_score: number
  top_risk_categories: string[]
  key_mitigations: string[]
  compliance_status: string
}

export interface SessionMemoryItem {
  summary: AssessmentSummary
  context: string
}

export function createAssessmentSummary(policy: PolicyListItem): AssessmentSummary {
  return {
    policy_id: policy.id,
    title: policy.title,
    overall_risk_score: policy.overall_score,
    top_risk_categories: ['compliance', 'business_impact', 'implementation'],
    key_mitigations: ['Regular review', 'Staff training', 'Process updates'],
    compliance_status: policy.status
  }
}

export async function pushAssessmentMemory(policy: PolicyListItem): Promise<void> {
  // Mock implementation
  console.log('Pushing assessment memory for policy:', policy.title)
}

export async function pushMultipleAssessmentMemories(policies: PolicyListItem[]): Promise<void> {
  // Mock implementation
  console.log('Pushing multiple assessment memories for', policies.length, 'policies')
}

export function usePushAssessmentMemory() {
  return useMutation({
    mutationFn: pushAssessmentMemory,
    onSuccess: () => {
      toast.success('Assessment memory updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update assessment memory: ${error.message}`)
    }
  })
}

export async function clearAssessmentMemory(): Promise<void> {
  // Mock implementation
  console.log('Clearing assessment memory')
}