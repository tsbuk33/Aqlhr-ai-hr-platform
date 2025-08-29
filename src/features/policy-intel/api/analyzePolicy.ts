import { supabase } from '@/integrations/supabase/client';
import { useLocale } from '@/i18n/locale';

export interface PolicyAnalysisRequest {
  lang?: 'en' | 'ar';
  policyDocId?: string;
  text?: string;
  title?: string;
  tags?: string[];
  stream?: boolean;
}

export interface Score {
  value: number;
  confidence: number;
}

export interface PolicyRiskResult {
  request_id: string;
  lang: 'en' | 'ar';
  company_id: string;
  policy_source: { type: 'doc' | 'text'; id?: string; title?: string };
  scores: {
    complianceRisk: {
      saudiLaborLaw: Score;
      hrsdRequirements: Score;
      internationalStandards: Score;
      futureRegulations: Score;
    };
    businessRisk: {
      financialImpact: Score;
      operationalRisk: Score;
      reputationalRisk: Score;
      competitiveRisk: Score;
    };
    implementationRisk: {
      resourceRequirements: Score;
      changeManagement: Score;
      trainingNeeds: Score;
      technologyIntegration: Score;
    };
    overall: Score;
  };
  score_details: Array<{
    dimension: string;
    score: number;
    confidence: number;
    rationale: string;
  }>;
  mitigations: Array<{
    strategy: string;
    impact: 'low' | 'medium' | 'high';
    effort: 'low' | 'medium' | 'high';
    roi: number;
    actions: string[];
  }>;
  citations: Array<{
    doc_id: string;
    score: number;
    snippet: string;
    page?: number;
    tag?: string;
  }>;
  created_at: string;
}

export interface ProgressEvent {
  type: 'progress';
  phase: 'embedding' | 'retrieval' | 'analysis' | 'mitigation' | 'done';
  message: string;
  timestamp: string;
}

export interface ResultEvent {
  type: 'result';
  data: PolicyRiskResult;
}

export type AnalysisEvent = ProgressEvent | ResultEvent;

/**
 * Analyze policy with optional SSE streaming
 */
export async function analyzePolicy(
  request: PolicyAnalysisRequest,
  onProgress?: (event: ProgressEvent) => void
): Promise<PolicyRiskResult> {
  
  // Get auth token
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.access_token) {
    throw new Error('Authentication required');
  }

  // Auto-fill language from locale if not provided
  const { locale } = useLocale();
  const lang = request.lang || (locale as 'en' | 'ar');
  
  const body = {
    ...request,
    lang
  };

  // Determine if streaming is requested
  const useStreaming = request.stream ?? false;
  
  // Build URL with streaming parameter
  const url = new URL('/functions/v1/policy-risk-analyze-v1', supabase.supabaseUrl);
  if (useStreaming) {
    url.searchParams.set('stream', 'sse');
  }

  const headers: HeadersInit = {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };

  if (useStreaming) {
    headers['Accept'] = 'text/event-stream';
    headers['Cache-Control'] = 'no-cache';
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Analysis failed: ${response.status} ${errorText}`);
  }

  if (useStreaming && response.body) {
    return handleStreamingResponse(response.body, onProgress);
  } else {
    // Non-streaming response
    const result = await response.json();
    return result as PolicyRiskResult;
  }
}

/**
 * Handle Server-Sent Events streaming response
 */
async function handleStreamingResponse(
  body: ReadableStream<Uint8Array>,
  onProgress?: (event: ProgressEvent) => void
): Promise<PolicyRiskResult> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let result: PolicyRiskResult | null = null;

  try {
    while (true) {
      const { value, done } = await reader.read();
      
      if (done) {
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6).trim();
          
          if (data === '') continue; // Keep-alive
          
          try {
            const event = JSON.parse(data) as AnalysisEvent;
            
            if (event.type === 'progress') {
              onProgress?.(event as ProgressEvent);
            } else if (event.type === 'result') {
              result = (event as ResultEvent).data;
            }
          } catch (parseError) {
            console.warn('Failed to parse SSE data:', data, parseError);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (!result) {
    throw new Error('No result received from streaming analysis');
  }

  return result;
}

/**
 * Get recent policy assessments for the current company
 */
export async function getPolicyAssessments(limit = 10): Promise<PolicyRiskResult[]> {
  const { data, error } = await supabase
    .from('policy_risk_assessments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch assessments: ${error.message}`);
  }

  return data?.map(row => ({
    request_id: row.id,
    lang: row.lang,
    company_id: row.company_id,
    policy_source: {
      type: row.policy_doc_id ? 'doc' : 'text',
      id: row.policy_doc_id,
      title: row.title
    },
    scores: row.scores,
    score_details: [], // Not stored separately
    mitigations: row.mitigations,
    citations: row.citations,
    created_at: row.created_at
  })) || [];
}

/**
 * Create a task from a mitigation strategy
 */
export async function createMitigationTask(
  mitigation: PolicyRiskResult['mitigations'][0],
  policyTitle: string,
  assigneeId?: string
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Authentication required');
  }

  // Call the task creation edge function
  const response = await fetch('/functions/v1/create-task-v1', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `Policy Risk Mitigation: ${mitigation.strategy}`,
      description: `Mitigation strategy for policy: ${policyTitle}\n\nActions:\n${mitigation.actions.map(a => `• ${a}`).join('\n')}\n\nImpact: ${mitigation.impact}\nEffort: ${mitigation.effort}\nROI: ${Math.round(mitigation.roi * 100)}%`,
      priority: mitigation.impact === 'high' ? 'high' : mitigation.impact === 'medium' ? 'medium' : 'low',
      category: 'policy_compliance',
      assignee_id: assigneeId,
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      metadata: {
        source: 'policy_risk_analysis',
        mitigation_strategy: mitigation.strategy,
        impact: mitigation.impact,
        effort: mitigation.effort,
        roi: mitigation.roi
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create task: ${response.status} ${errorText}`);
  }
}

/**
 * Format risk score for display with localization
 */
export function formatRiskScore(score: Score, locale: string = 'en'): string {
  const percentage = Math.round(score.value * 100);
  
  if (locale === 'ar') {
    // Convert to Arabic-Indic numerals
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return percentage.toString().replace(/[0-9]/g, digit => arabicNumerals[parseInt(digit)]) + '٪';
  }
  
  return `${percentage}%`;
}

/**
 * Get risk level color based on score
 */
export function getRiskColor(score: number): string {
  if (score <= 0.3) return 'text-green-600 bg-green-50 border-green-200';
  if (score <= 0.6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-red-600 bg-red-50 border-red-200';
}

/**
 * Get risk level text
 */
export function getRiskLevel(score: number, isArabic: boolean = false): string {
  if (score <= 0.3) return isArabic ? 'منخفض' : 'Low';
  if (score <= 0.6) return isArabic ? 'متوسط' : 'Medium';
  return isArabic ? 'عالي' : 'High';
}