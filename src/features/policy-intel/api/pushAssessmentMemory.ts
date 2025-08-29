import { supabase } from '@/lib/supabase'
import type { PolicyListItem } from './listPolicies'

export interface AssessmentSummary {
  id: string
  title: string
  overall_score: number
  top_risks: Array<{
    category: string
    dimension: string
    score: number
    rationale?: string
  }>
  top_mitigations: Array<{
    title: string
    priority: string
    impact: string
    timeline: string
    roi?: number
  }>
  analysis_date: string
}

export interface SessionMemoryItem {
  type: 'policy_assessment'
  summary: AssessmentSummary
  context: string
}

export function createAssessmentSummary(policy: PolicyListItem): AssessmentSummary {
  // Extract top 3 risk dimensions across all families
  const allRisks = [
    { category: 'Compliance', dimension: 'Saudi Labor Law', score: policy.compliance_score.saudiLaborLaw },
    { category: 'Compliance', dimension: 'Workplace Rights', score: policy.compliance_score.workplaceRights },
    { category: 'Compliance', dimension: 'Discrimination Prevention', score: policy.compliance_score.discriminationPrevention },
    { category: 'Compliance', dimension: 'Data Protection', score: policy.compliance_score.dataProtection },
    { category: 'Business', dimension: 'Operational Complexity', score: policy.business_score.operationalComplexity },
    { category: 'Business', dimension: 'Resource Requirements', score: policy.business_score.resourceRequirements },
    { category: 'Business', dimension: 'Stakeholder Impact', score: policy.business_score.stakeholderImpact },
    { category: 'Business', dimension: 'Financial Implications', score: policy.business_score.financialImplications },
    { category: 'Implementation', dimension: 'System Complexity', score: policy.implementation_score.systemComplexity },
    { category: 'Implementation', dimension: 'Change Resistance', score: policy.implementation_score.changeResistance },
    { category: 'Implementation', dimension: 'Training Requirements', score: policy.implementation_score.trainingRequirements },
    { category: 'Implementation', dimension: 'Monitoring Difficulty', score: policy.implementation_score.monitoringDifficulty },
  ]

  const topRisks = allRisks
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return {
    id: policy.id,
    title: policy.title,
    overall_score: policy.overall_score,
    top_risks: topRisks,
    top_mitigations: [], // Will be populated from full assessment data if available
    analysis_date: policy.created_at
  }
}

export async function pushAssessmentMemory(policy: PolicyListItem): Promise<void> {
  try {
    // Get the full assessment data to extract mitigation strategies
    const { data: fullAssessment, error } = await supabase
      .from('policy_risk_assessments')
      .select('mitigation_strategies')
      .eq('id', policy.id)
      .single()

    if (error) {
      console.warn('Could not fetch full assessment for memory:', error)
    }

    const summary = createAssessmentSummary(policy)

    // Extract top 3 mitigation strategies if available
    if (fullAssessment?.mitigation_strategies) {
      summary.top_mitigations = fullAssessment.mitigation_strategies
        .slice(0, 3)
        .map((mitigation: any) => ({
          title: mitigation.title || '',
          priority: mitigation.priority || 'medium',
          impact: mitigation.impact || 'medium',
          timeline: mitigation.timeline || '',
          roi: mitigation.roi || 0
        }))
    }

    // Create context description for Ask Aql
    const contextDescription = `Policy Assessment: "${summary.title}" (ID: ${summary.id})
Overall Risk Score: ${summary.overall_score.toFixed(1)}/10
Analysis Date: ${new Date(summary.analysis_date).toLocaleDateString()}

Top Risk Areas:
${summary.top_risks.map(risk => 
  `• ${risk.category} - ${risk.dimension}: ${risk.score.toFixed(1)}/10`
).join('\n')}

${summary.top_mitigations.length > 0 ? `Key Mitigation Strategies:
${summary.top_mitigations.map(mitigation => 
  `• ${mitigation.title} (Priority: ${mitigation.priority}, Timeline: ${mitigation.timeline})`
).join('\n')}` : ''}

This assessment provides context for policy risk management discussions.`

    const memoryItem: SessionMemoryItem = {
      type: 'policy_assessment',
      summary,
      context: contextDescription
    }

    // Call Ask Aql memory endpoint (session-scoped, no persistence to vectors)
    const { error: memoryError } = await supabase.functions.invoke('ask-aql-session-memory', {
      method: 'POST',
      body: {
        type: 'ephemeral_context',
        content: memoryItem.context,
        metadata: {
          policy_id: summary.id,
          policy_title: summary.title,
          assessment_type: 'policy_risk',
          session_only: true
        }
      }
    })

    if (memoryError) {
      console.error('Failed to push assessment to Ask Aql memory:', memoryError)
      // Don't throw error - this is a nice-to-have feature
    } else {
      console.log('Successfully pushed policy assessment to Ask Aql session memory')
    }

  } catch (error) {
    console.error('Unexpected error pushing assessment memory:', error)
    // Don't throw error - this should not break the main flow
  }
}

// Utility to push multiple assessments (e.g., when viewing a list)
export async function pushMultipleAssessmentMemories(policies: PolicyListItem[]): Promise<void> {
  const summaries = policies.map(createAssessmentSummary)
  
  const contextDescription = `Policy Risk Assessment Session Context
${policies.length} policies under review:

${summaries.map(summary => 
  `• "${summary.title}" - Overall Risk: ${summary.overall_score.toFixed(1)}/10`
).join('\n')}

This session context helps with comparative policy risk discussions.`

  try {
    const { error } = await supabase.functions.invoke('ask-aql-session-memory', {
      method: 'POST',
      body: {
        type: 'ephemeral_context',
        content: contextDescription,
        metadata: {
          session_type: 'policy_list_review',
          policy_count: policies.length,
          session_only: true
        }
      }
    })

    if (error) {
      console.error('Failed to push batch assessment memory:', error)
    }

  } catch (error) {
    console.error('Unexpected error in batch memory push:', error)
  }
}

// React hook for pushing memory with feedback
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function usePushAssessmentMemory() {
  return useMutation({
    mutationFn: pushAssessmentMemory,
    onSuccess: () => {
      toast.success('Assessment context shared with Ask Aql', {
        description: 'You can now ask questions about this policy assessment'
      })
    },
    onError: (error: Error) => {
      console.error('Failed to share with Ask Aql:', error)
      // Don't show error toast as this is optional functionality
    }
  })
}

// Utility to clear session memory
export async function clearAssessmentMemory(): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('ask-aql-session-memory', {
      method: 'DELETE',
      body: {
        type: 'clear_session'
      }
    })

    if (error) {
      console.error('Failed to clear assessment memory:', error)
    }

  } catch (error) {
    console.error('Unexpected error clearing memory:', error)
  }
}