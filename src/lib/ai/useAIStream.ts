import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StreamPayload {
  tenantId?: string;
  userId?: string;
  lang: 'en' | 'ar';
  moduleContext?: string;
  pageType?: string;
  intent?: string;
  message?: string;
  surveyId?: string;
  waveId?: string;
}

interface StreamMeta {
  provider?: string;
  model?: string;
  sessionId?: string;
  estimatedTokens?: number;
  lang?: 'en' | 'ar';
}

export type AIProgressPhase = 'planning' | 'generating' | 'saving' | 'ready';

interface StreamResult {
  start: (payload: StreamPayload, endpoint?: string) => Promise<void>;
  cancel: () => void;
  isStreaming: boolean;
  error: string | null;
  partial: string;
  meta: StreamMeta | null;
  phase: AIProgressPhase | null;
  pct: number;
}

export const useAIStream = (): StreamResult => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partial, setPartial] = useState('');
  const [meta, setMeta] = useState<StreamMeta | null>(null);
  const [phase, setPhase] = useState<AIProgressPhase | null>(null);
  const [pct, setPct] = useState<number>(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (readerRef.current) {
      readerRef.current.cancel();
    }
    setIsStreaming(false);
  }, []);

  const start = useCallback(async (payload: StreamPayload, endpoint?: string) => {
    // Reset state
    setError(null);
    setPartial('');
    setMeta(null);
    setPhase(null);
    setPct(0);
    setIsStreaming(true);

    // Create abort controller
    abortControllerRef.current = new AbortController();

    try {
      // First try SSE streaming
      const streamEndpoint = endpoint || `https://qcuhjcyjlkfizesndmth.functions.supabase.co/ai-agent-orchestrator`;
      const response = await fetch(
        streamEndpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWhqY3lqbGtmaXplc25kbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDY4NzgsImV4cCI6MjA2MzQyMjg3OH0.Vr1tBpNjv8e6sNtjfISJul12Mg9ROQVrlRTgWB1dPoc`,
          },
          body: JSON.stringify({
            ...payload,
            stream: true,
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check if we got SSE response
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('text/event-stream')) {
        // Fall back to regular JSON response
        const jsonData = await response.json();
        setPartial(jsonData.response || jsonData.text || 'No response received');
        setMeta({ provider: jsonData.provider, model: jsonData.model });
        setIsStreaming(false);
        return;
      }

      // Process SSE stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No stream reader available');
      }

      readerRef.current = reader;
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              setIsStreaming(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === 'meta') {
                setMeta({
                  provider: parsed.provider,
                  model: parsed.model,
                  sessionId: parsed.sessionId,
                  estimatedTokens: parsed.estimatedTokens,
                  lang: parsed.lang,
                });
              } else if (parsed.type === 'progress') {
                // Progress events injected by edge agents
                setPhase(parsed.phase);
                if (typeof parsed.pct === 'number') setPct(parsed.pct);
                // We do not append progress text to partial
              } else if (parsed.type === 'ready') {
                // Final ready state
                setPhase('ready');
                setPct((p) => (p < 100 ? 100 : p));
              } else if (parsed.type === 'chunk') {
                setPartial(prev => prev + (parsed.content || ''));
              } else if (parsed.type === 'final') {
                setIsStreaming(false);
                return;
              }
            } catch (parseError) {
              // If not JSON, treat as raw text chunk
              if (data && data !== 'undefined') {
                setPartial(prev => prev + data);
              }
            }
          } else if (line.startsWith('event: error')) {
            const errorLine = lines[lines.indexOf(line) + 1];
            if (errorLine?.startsWith('data: ')) {
              const errorData = errorLine.slice(6).trim();
              throw new Error(errorData);
            }
          }
          // Ignore keepalive pings (lines starting with ':')
        }
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setPartial(prev => prev + '\n\n[Canceled]');
        return;
      }

      console.error('SSE Stream error:', err);
      setError(err instanceof Error ? err.message : 'Unknown streaming error');
      
      // Fall back to non-streaming call
      try {
        const { data, error: supabaseError } = await supabase.functions.invoke('ai-agent-orchestrator', {
          body: {
            ...payload,
            stream: false,
          },
        });

        if (supabaseError) throw supabaseError;

        setPartial(data?.response || data?.text || 'No response received');
        setMeta({ provider: data?.provider, model: data?.model });
        setError(null); // Clear error since fallback worked
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setError(fallbackError instanceof Error ? fallbackError.message : 'Failed to get AI response');
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
      readerRef.current = null;
    }
  }, []);

  return {
    start,
    cancel,
    isStreaming,
    error,
    partial,
    meta,
    phase,
    pct,
  };
};
