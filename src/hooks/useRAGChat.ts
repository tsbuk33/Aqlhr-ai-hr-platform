import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTenantIdOrDemo } from '@/lib/api/osi';

interface RAGFilters {
  portal?: string;
  employee_id?: string;
  doc_type?: string;
  uploadedAfter?: string;
}

interface Citation {
  docId: string;
  filename: string;
  score: number;
  portal?: string;
  employee_id?: string;
  doc_type?: string;
  chunk?: string;
  pageNumber?: number;
  uploadedAt?: string;
}

interface RAGStreamMeta {
  provider?: string;
  model?: string;
  sessionId?: string;
  documentsSearched?: number;
  topDocuments?: number;
  language?: 'en' | 'ar';
}

interface RAGResponse {
  answer: string;
  citations: Citation[];
  suggestedFilters?: RAGFilters;
}

interface RAGChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
  filters?: RAGFilters;
  meta?: RAGStreamMeta;
}

interface UseRAGChatResult {
  messages: RAGChatMessage[];
  isStreaming: boolean;
  error: string | null;
  partial: string;
  meta: RAGStreamMeta | null;
  citations: Citation[];
  sendMessage: (query: string, filters?: RAGFilters) => Promise<void>;
  clearChat: () => void;
  stopStream: () => void;
}

export const useRAGChat = (): UseRAGChatResult => {
  const [messages, setMessages] = useState<RAGChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partial, setPartial] = useState('');
  const [meta, setMeta] = useState<RAGStreamMeta | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);
  const currentStreamingMessageRef = useRef<string | null>(null);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (readerRef.current) {
      readerRef.current.cancel();
    }
    setIsStreaming(false);
    currentStreamingMessageRef.current = null;
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setPartial('');
    setMeta(null);
    setCitations([]);
    stopStream();
  }, [stopStream]);

  const sendMessage = useCallback(async (query: string, filters?: RAGFilters) => {
    if (!query.trim() || isStreaming) return;

    // Add user message
    const userMessage: RAGChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: query,
      timestamp: new Date(),
      filters,
    };

    setMessages(prev => [...prev, userMessage]);
    setError(null);
    setPartial('');
    setCitations([]);
    setMeta(null);
    setIsStreaming(true);

    // Generate assistant message ID for streaming
    const assistantMessageId = `assistant-${Date.now()}`;
    currentStreamingMessageRef.current = assistantMessageId;

    // Create abort controller
    abortControllerRef.current = new AbortController();

    try {
      const tenantId = await getTenantIdOrDemo();

      // Call the RAG Edge Function with SSE streaming
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      if (!authToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/ask-aql-rag-v1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            query,
            filters: filters || {},
            tenantId,
            language: 'auto', // Auto-detect from query
            stream: true,
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Check if we got SSE response
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('text/event-stream')) {
        // Fall back to regular JSON response
        const jsonData = await response.json();
        const finalMessage: RAGChatMessage = {
          id: assistantMessageId,
          type: 'assistant',
          content: jsonData.answer || 'No response received',
          timestamp: new Date(),
          citations: jsonData.citations || [],
          meta: { provider: jsonData.provider, model: jsonData.model },
        };
        setMessages(prev => [...prev, finalMessage]);
        setCitations(jsonData.citations || []);
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
      let accumulatedContent = '';
      let streamCitations: Citation[] = [];
      let streamMeta: RAGStreamMeta | null = null;

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
              // Finalize the streaming message
              const finalMessage: RAGChatMessage = {
                id: assistantMessageId,
                type: 'assistant',
                content: accumulatedContent,
                timestamp: new Date(),
                citations: streamCitations,
                meta: streamMeta || undefined,
              };
              
              setMessages(prev => {
                // Replace any existing streaming message or add new one
                const existingIndex = prev.findIndex(msg => msg.id === assistantMessageId);
                if (existingIndex >= 0) {
                  const newMessages = [...prev];
                  newMessages[existingIndex] = finalMessage;
                  return newMessages;
                } else {
                  return [...prev, finalMessage];
                }
              });
              
              setCitations(streamCitations);
              setPartial('');
              setIsStreaming(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === 'meta') {
                streamMeta = {
                  provider: parsed.provider,
                  model: parsed.model,
                  sessionId: parsed.sessionId,
                  documentsSearched: parsed.documentsSearched,
                  topDocuments: parsed.topDocuments,
                  language: parsed.language,
                };
                setMeta(streamMeta);
              } else if (parsed.type === 'citations') {
                streamCitations = parsed.citations || [];
                setCitations(streamCitations);
              } else if (parsed.type === 'token') {
                accumulatedContent += parsed.content || '';
                setPartial(accumulatedContent);
              } else if (parsed.type === 'done') {
                // Same as [DONE] case
                const finalMessage: RAGChatMessage = {
                  id: assistantMessageId,
                  type: 'assistant',
                  content: accumulatedContent,
                  timestamp: new Date(),
                  citations: streamCitations,
                  meta: streamMeta || undefined,
                };
                
                setMessages(prev => {
                  const existingIndex = prev.findIndex(msg => msg.id === assistantMessageId);
                  if (existingIndex >= 0) {
                    const newMessages = [...prev];
                    newMessages[existingIndex] = finalMessage;
                    return newMessages;
                  } else {
                    return [...prev, finalMessage];
                  }
                });
                
                setCitations(streamCitations);
                setPartial('');
                setIsStreaming(false);
                return;
              }
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', data, parseError);
              // Treat as raw text if not JSON
              if (data && data !== 'undefined') {
                accumulatedContent += data;
                setPartial(accumulatedContent);
              }
            }
          } else if (line.startsWith('event: error')) {
            const errorLine = lines[lines.indexOf(line) + 1];
            if (errorLine?.startsWith('data: ')) {
              const errorData = errorLine.slice(6).trim();
              throw new Error(errorData);
            }
          }
        }
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setPartial(prev => prev + '\n\n[Canceled]');
        return;
      }

      console.error('RAG Stream error:', err);
      setError(err instanceof Error ? err.message : 'Unknown streaming error');
      
      // Add error message
      const errorMessage: RAGChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
      currentStreamingMessageRef.current = null;
      abortControllerRef.current = null;
      readerRef.current = null;
    }
  }, [isStreaming]);

  return {
    messages,
    isStreaming,
    error,
    partial,
    meta,
    citations,
    sendMessage,
    clearChat,
    stopStream,
  };
};