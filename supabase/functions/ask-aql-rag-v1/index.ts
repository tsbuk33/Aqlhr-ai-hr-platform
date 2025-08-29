import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface RAGRequest {
  companyId: string;
  query: string;
  k?: number;
  filters?: {
    portal?: string[];
    employeeId?: string | null;
    docType?: string[];
    uploadedAfter?: string | null;
  };
  stream?: boolean;
}

interface DocumentChunk {
  doc_id: string;
  chunk_text: string;
  score: number;
  page?: number;
  portal?: string;
  employee_id?: string | null;
  doc_type?: string;
  uploaded_at: string;
  title: string;
  storage_path: string;
}

interface Citation {
  id: string;
  title: string;
  portal?: string;
  page?: number;
  score: number;
  storagePath: string;
  docType?: string;
  employeeId?: string | null;
  url?: string;
}

interface RAGResponse {
  answer: string;
  citations: Citation[];
  usage: {
    tokensIn: number;
    tokensOut: number;
    provider: string;
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const body: RAGRequest = await req.json();
    const { companyId, query, k = 8, filters = {}, stream = false } = body;

    if (!companyId || !query) {
      return new Response(
        JSON.stringify({ error: 'Missing companyId or query' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    // Validate tenant access
    const { data: userData, error: authError } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    );

    if (authError || !userData.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get relevant document chunks using KNN search
    const chunks = await retrieveRelevantChunks(supabase, companyId, query, k, filters);

    if (chunks.length === 0) {
      const noDocsResponse: RAGResponse = {
        answer: 'I couldn\'t find any relevant documents to answer your question. Please try uploading relevant documents first or rephrase your query.',
        citations: [],
        usage: { tokensIn: 0, tokensOut: 0, provider: 'none' }
      };

      return new Response(
        JSON.stringify(noDocsResponse), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Build context from chunks
    const context = buildContextFromChunks(chunks);
    
    // Build citations array
    const citations: Citation[] = chunks.map((chunk, index) => ({
      id: chunk.doc_id,
      title: chunk.title,
      portal: chunk.portal,
      page: chunk.page,
      score: chunk.score,
      storagePath: chunk.storage_path,
      docType: chunk.doc_type,
      employeeId: chunk.employee_id,
    }));

    if (stream) {
      // Stream response using SSE
      return streamRAGResponse(query, context, citations, chunks);
    } else {
      // Generate non-streaming response
      const answer = await generateAnswer(query, context);
      
      const response: RAGResponse = {
        answer,
        citations,
        usage: {
          tokensIn: estimateTokens(query + context),
          tokensOut: estimateTokens(answer),
          provider: 'genspark'
        }
      };

      return new Response(
        JSON.stringify(response), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('RAG Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function retrieveRelevantChunks(
  supabase: any, 
  companyId: string, 
  query: string, 
  k: number, 
  filters: any
): Promise<DocumentChunk[]> {
  try {
    // Build filter conditions for the search function
    const filterConditions = {
      portal: filters.portal?.length ? filters.portal : null,
      employee_id: filters.employeeId || null,
      doc_type: filters.docType?.length ? filters.docType : null,
      uploaded_after: filters.uploadedAfter || null,
    };

    const { data, error } = await supabase.rpc('search_documents_knn_v1', {
      company_id: companyId,
      query_text: query,
      match_count: k,
      filters: filterConditions
    });

    if (error) {
      console.error('Search error:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error retrieving chunks:', error);
    return [];
  }
}

function buildContextFromChunks(chunks: DocumentChunk[]): string {
  const contextParts = chunks.map((chunk, index) => {
    const metadata = [
      chunk.portal && `Portal: ${chunk.portal.toUpperCase()}`,
      chunk.doc_type && `Type: ${chunk.doc_type}`,
      chunk.page && `Page: ${chunk.page}`,
      `Score: ${chunk.score.toFixed(2)}`
    ].filter(Boolean).join(', ');

    // Redact sensitive information (keep only last 4 digits of IDs)
    let text = chunk.chunk_text;
    if (text) {
      // Redact Iqama IDs (keep last 4 digits)
      text = text.replace(/(\d{6})\d{4}/g, '****$1');
      // Redact National IDs (keep last 4 digits) 
      text = text.replace(/(\d{6})\d{4}/g, '****$1');
    }

    return `[${index + 1}] ${chunk.title} (${metadata})\n${text}\n`;
  });

  return contextParts.join('\n---\n');
}

async function generateAnswer(query: string, context: string): Promise<string> {
  const systemPrompt = `You are an AI assistant for Saudi HR compliance and document management. Answer questions concisely based on the provided document context. 

Guidelines:
- Cite sources using [1], [2], etc. based on document numbers in context
- Focus on Saudi HR compliance, labor law, and government regulations
- When uncertain, acknowledge limitations
- Never reveal sensitive personal information (IDs, etc.)
- Respond in the same language as the query

Context Documents:
${context}`;

  try {
    // Use Universal AI Orchestrator with Genspark.ai first
    const gensparkResponse = await callGenspark(systemPrompt, query);
    if (gensparkResponse) {
      return gensparkResponse;
    }

    // Fallback to OpenAI
    const openaiResponse = await callOpenAI(systemPrompt, query);
    if (openaiResponse) {
      return openaiResponse;
    }

    throw new Error('All AI providers failed');

  } catch (error) {
    console.error('Error generating answer:', error);
    return `I encountered an error while processing your question about the documents. Please try rephrasing your query or contact support if the issue persists.`;
  }
}

async function callGenspark(systemPrompt: string, query: string): Promise<string | null> {
  try {
    const gensparkApiKey = Deno.env.get('GENSPARK_API_KEY');
    if (!gensparkApiKey) return null;

    const response = await fetch('https://api.genspark.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${gensparkApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Genspark API error:', error);
    return null;
  }
}

async function callOpenAI(systemPrompt: string, query: string): Promise<string | null> {
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) return null;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return null;
  }
}

function streamRAGResponse(query: string, context: string, citations: Citation[], chunks: DocumentChunk[]): Response {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        // Send initial event
        controller.enqueue(encoder.encode(`event: token\ndata: {"delta": ""}\n\n`));

        const systemPrompt = `You are an AI assistant for Saudi HR compliance and document management. Answer questions concisely based on the provided document context.

Guidelines:
- Cite sources using [1], [2], etc. based on document numbers in context
- Focus on Saudi HR compliance, labor law, and government regulations
- When uncertain, acknowledge limitations
- Never reveal sensitive personal information (IDs, etc.)
- Respond in the same language as the query

Context Documents:
${context}`;

        // Stream from Genspark AI
        await streamFromGenspark(controller, encoder, systemPrompt, query);

        // Send citations
        controller.enqueue(encoder.encode(
          `event: citations\ndata: ${JSON.stringify(citations)}\n\n`
        ));

        // End stream
        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));

      } catch (error) {
        console.error('Streaming error:', error);
        controller.enqueue(encoder.encode(
          `event: error\ndata: {"error": "Streaming failed"}\n\n`
        ));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

async function streamFromGenspark(controller: any, encoder: TextEncoder, systemPrompt: string, query: string) {
  try {
    const gensparkApiKey = Deno.env.get('GENSPARK_API_KEY');
    if (!gensparkApiKey) {
      throw new Error('Genspark API key not available');
    }

    const response = await fetch('https://api.genspark.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${gensparkApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Genspark streaming failed');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No readable stream');
    }

    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              controller.enqueue(encoder.encode(
                `event: token\ndata: ${JSON.stringify({ delta })}\n\n`
              ));
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

  } catch (error) {
    console.error('Genspark streaming error:', error);
    
    // Fallback to non-streaming response
    const answer = await generateAnswer(query, systemPrompt);
    const words = answer.split(' ');
    
    for (let i = 0; i < words.length; i += 5) {
      const chunk = words.slice(i, i + 5).join(' ') + ' ';
      controller.enqueue(encoder.encode(
        `event: token\ndata: ${JSON.stringify({ delta: chunk })}\n\n`
      ));
      
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
}

function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}