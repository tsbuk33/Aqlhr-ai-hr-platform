import { supabase } from '@/integrations/supabase/client'

export interface RecomputeProgress {
  phase: string
  message: string
  progress?: number
  result?: any
  error?: string
}

export async function recomputePolicy(
  id: string, 
  stream: boolean = true
): Promise<void | AsyncGenerator<RecomputeProgress, void, unknown>> {
  try {
    const { data, error } = await supabase.functions.invoke('policy-risk-recompute-v1', {
      method: 'POST',
      body: {
        id,
        stream
      }
    })

    if (error) {
      console.error('Recompute error:', error)
      throw new Error(`Recomputation failed: ${error.message}`)
    }

    if (!stream) {
      // Non-streaming mode, return immediately
      return
    }

    // For streaming mode, return an async generator
    return streamRecomputeProgress(id)

  } catch (error) {
    console.error('Unexpected error in recomputePolicy:', error)
    throw error instanceof Error ? error : new Error('Recomputation failed')
  }
}

async function* streamRecomputeProgress(id: string): AsyncGenerator<RecomputeProgress, void, unknown> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/policy-risk-recompute-v1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        stream: true
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response stream available')
    }

    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6).trim()
            
            if (data === '[DONE]') {
              return
            }

            try {
              const progress: RecomputeProgress = JSON.parse(data)
              yield progress
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', data)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

  } catch (error) {
    console.error('Stream error:', error)
    yield {
      phase: 'error',
      message: error instanceof Error ? error.message : 'Stream failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// React hook for recomputing with streaming
import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useRecomputePolicy() {
  const [progress, setProgress] = useState<RecomputeProgress | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ id, stream = true }: { id: string, stream?: boolean }) => {
      if (!stream) {
        return recomputePolicy(id, false)
      }

      setIsStreaming(true)
      setProgress({ phase: 'initializing', message: 'Starting recomputation...' })

      try {
        const generator = await recomputePolicy(id, true)
        
        if (generator) {
          for await (const update of generator) {
            setProgress(update)
            
            if (update.phase === 'error') {
              throw new Error(update.error || 'Recomputation failed')
            }
            
            if (update.phase === 'complete') {
              // Invalidate related queries
              await queryClient.invalidateQueries({ queryKey: ['policy-list'] })
              await queryClient.invalidateQueries({ queryKey: ['policy-trends'] })
              break
            }
          }
        }
      } finally {
        setIsStreaming(false)
      }
    },
    onSuccess: () => {
      toast.success('Policy recomputed successfully')
      setProgress(null)
    },
    onError: (error: Error) => {
      console.error('Recompute failed:', error)
      toast.error(`Recomputation failed: ${error.message}`)
      setProgress(null)
      setIsStreaming(false)
    }
  })

  const recompute = useCallback((id: string, stream: boolean = true) => {
    mutation.mutate({ id, stream })
  }, [mutation])

  return {
    recompute,
    progress,
    isStreaming,
    isLoading: mutation.isPending,
    error: mutation.error
  }
}

// Utility function for batch recomputation
export async function recomputeMultiplePolicies(
  ids: string[],
  onProgress?: (completed: number, total: number, currentId: string) => void
): Promise<void> {
  const total = ids.length
  let completed = 0

  for (const id of ids) {
    try {
      await recomputePolicy(id, false) // Use non-streaming for batch operations
      completed++
      onProgress?.(completed, total, id)
    } catch (error) {
      console.error(`Failed to recompute policy ${id}:`, error)
      // Continue with next policy instead of failing the whole batch
    }
  }
}

export function useBatchRecompute() {
  const [progress, setProgress] = useState<{ completed: number, total: number, currentId?: string } | null>(null)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (ids: string[]) => {
      setProgress({ completed: 0, total: ids.length })
      
      await recomputeMultiplePolicies(ids, (completed, total, currentId) => {
        setProgress({ completed, total, currentId })
      })
      
      // Invalidate queries after batch completion
      await queryClient.invalidateQueries({ queryKey: ['policy-list'] })
      await queryClient.invalidateQueries({ queryKey: ['policy-trends'] })
    },
    onSuccess: () => {
      toast.success('Batch recomputation completed')
      setProgress(null)
    },
    onError: (error: Error) => {
      console.error('Batch recompute failed:', error)
      toast.error(`Batch recomputation failed: ${error.message}`)
      setProgress(null)
    }
  })

  return {
    recomputeBatch: mutation.mutate,
    progress,
    isLoading: mutation.isPending,
    error: mutation.error
  }
}