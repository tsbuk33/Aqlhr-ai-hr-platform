import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RecomputeParams {
  id: string
  stream?: boolean
}

// Simple in-memory lock store (in production, use Redis or similar)
const lockStore = new Map<string, number>()
const LOCK_TTL = 10 * 60 * 1000 // 10 minutes

function acquireLock(key: string): boolean {
  const now = Date.now()
  const lockTime = lockStore.get(key)
  
  if (lockTime && (now - lockTime) < LOCK_TTL) {
    return false // Lock exists and hasn't expired
  }
  
  lockStore.set(key, now)
  return true
}

function releaseLock(key: string): void {
  lockStore.delete(key)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    const body: RecomputeParams = await req.json()
    const { id, stream = false } = body

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Assessment ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check for idempotency lock
    const lockKey = `policy_recompute_lock:${id}`
    if (!acquireLock(lockKey)) {
      return new Response(
        JSON.stringify({ error: 'Recomputation already in progress for this assessment' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    try {
      // Fetch the existing assessment
      const { data: assessment, error: fetchError } = await supabaseClient
        .from('policy_risk_assessments')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !assessment) {
        releaseLock(lockKey)
        return new Response(
          JSON.stringify({ error: 'Assessment not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Prepare the analysis request
      let analysisBody: any = {}

      if (assessment.policy_doc_id) {
        // Use the uploaded document
        analysisBody = {
          source: 'upload',
          file_id: assessment.policy_doc_id
        }
      } else if (assessment.source_text) {
        // Use the stored text
        analysisBody = {
          source: 'text',
          text: assessment.source_text
        }
      } else {
        releaseLock(lockKey)
        return new Response(
          JSON.stringify({ error: 'No source data available for recomputation' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Call the policy analysis function
      const analysisFunctionUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/policy-risk-analyze-v1`
      
      if (stream) {
        // Set up SSE streaming
        const responseHeaders = {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }

        const { readable, writable } = new TransformStream()
        const writer = writable.getWriter()

        // Start the analysis in the background
        (async () => {
          try {
            const analysisResponse = await fetch(analysisFunctionUrl, {
              method: 'POST',
              headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(analysisBody)
            })

            if (!analysisResponse.ok) {
              await writer.write(new TextEncoder().encode(
                `data: ${JSON.stringify({ error: 'Analysis failed', phase: 'error' })}\n\n`
              ))
              await writer.close()
              releaseLock(lockKey)
              return
            }

            const analysisReader = analysisResponse.body?.getReader()
            if (!analysisReader) {
              await writer.write(new TextEncoder().encode(
                `data: ${JSON.stringify({ error: 'No response stream', phase: 'error' })}\n\n`
              ))
              await writer.close()
              releaseLock(lockKey)
              return
            }

            // Stream the analysis progress
            while (true) {
              const { done, value } = await analysisReader.read()
              if (done) break

              const chunk = new TextDecoder().decode(value)
              const lines = chunk.split('\n')

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.substring(6)
                  
                  try {
                    const parsed = JSON.parse(data)
                    
                    // Forward the progress event
                    await writer.write(new TextEncoder().encode(`data: ${data}\n\n`))
                    
                    // If it's the final result, update the database
                    if (parsed.phase === 'complete' && parsed.result) {
                      const { error: updateError } = await supabaseClient
                        .from('policy_risk_assessments')
                        .update({
                          scores: parsed.result.riskMatrix,
                          mitigation_strategies: parsed.result.mitigationStrategies,
                          citations: parsed.result.citations,
                          updated_at: new Date().toISOString()
                        })
                        .eq('id', id)

                      if (updateError) {
                        console.error('Error updating assessment:', updateError)
                      }
                    }
                  } catch (parseError) {
                    // If parsing fails, just forward the line as-is
                    await writer.write(new TextEncoder().encode(`${line}\n`))
                  }
                }
              }
            }

            await writer.close()
          } catch (error) {
            console.error('Streaming error:', error)
            await writer.write(new TextEncoder().encode(
              `data: ${JSON.stringify({ error: 'Streaming failed', phase: 'error' })}\n\n`
            ))
            await writer.close()
          } finally {
            releaseLock(lockKey)
          }
        })()

        return new Response(readable, { headers: responseHeaders })
      } else {
        // Non-streaming mode
        const analysisResponse = await fetch(analysisFunctionUrl, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(analysisBody)
        })

        if (!analysisResponse.ok) {
          releaseLock(lockKey)
          return new Response(
            JSON.stringify({ error: 'Analysis failed' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const result = await analysisResponse.json()

        // Update the assessment
        const { error: updateError } = await supabaseClient
          .from('policy_risk_assessments')
          .update({
            scores: result.riskMatrix,
            mitigation_strategies: result.mitigationStrategies,
            citations: result.citations,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)

        releaseLock(lockKey)

        if (updateError) {
          console.error('Error updating assessment:', updateError)
          return new Response(
            JSON.stringify({ error: 'Failed to update assessment' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

    } catch (error) {
      releaseLock(lockKey)
      throw error
    }

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})