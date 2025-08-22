import { serve, createClient, corsHeaders } from "../_shared/deps.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context = {} } = await req.json();

    // First, search for relevant AqlHR knowledge
    const { data: knowledgeData, error: knowledgeError } = await supabase
      .from('ai_document_chunks')
      .select('content, metadata')
      .textSearch('content', query)
      .eq('company_id', 'aqlhr-platform')
      .limit(5);

    let contextualKnowledge = '';
    if (knowledgeData && knowledgeData.length > 0) {
      contextualKnowledge = knowledgeData
        .map(chunk => `Page: ${chunk.metadata?.title || 'Unknown'}\nURL: ${chunk.metadata?.url || 'Unknown'}\nContent: ${chunk.content}`)
        .join('\n\n---\n\n');
    }

    // Use AI orchestrator with enhanced context
    const { data: orchestratorData, error: orchestratorError } = await supabase.functions.invoke('ai-agent-orchestrator', {
      body: {
        query,
        context: {
          ...context,
          aqlhr_knowledge: contextualKnowledge,
          enhanced_instructions: `You are an expert AqlHR platform assistant. Use the provided AqlHR knowledge base to answer questions about:
          
          1. How to use AqlHR modules and features
          2. Platform functionality and navigation
          3. HR processes and workflows
          4. Saudi compliance and regulations
          5. System configuration and setup
          
          If the AqlHR knowledge base doesn't contain the answer, you can also provide general HR expertise and latest industry updates.
          
          AqlHR Knowledge Base:
          ${contextualKnowledge}
          
          Always prioritize AqlHR-specific information when available, but supplement with general knowledge when helpful.`
        }
      }
    });

    if (orchestratorError) {
      throw new Error(orchestratorError.message);
    }

    // Enhance the response with knowledge source citations
    let enhancedResponse = orchestratorData.response;
    
    if (knowledgeData && knowledgeData.length > 0) {
      const sources = knowledgeData
        .filter(chunk => chunk.metadata?.url)
        .map(chunk => `• [${chunk.metadata.title || 'AqlHR Page'}](${chunk.metadata.url})`)
        .join('\n');
      
      if (sources) {
        enhancedResponse += `\n\n**📚 Sources from AqlHR Platform:**\n${sources}`;
      }
    }

    return new Response(JSON.stringify({
      ...orchestratorData,
      response: enhancedResponse,
      knowledge_sources: knowledgeData?.length || 0,
      has_platform_knowledge: (knowledgeData?.length || 0) > 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Enhanced AqlHR AI error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      response: context?.language === 'ar' 
        ? 'عذراً، واجهت مشكلة في الوصول إلى قاعدة المعرفة. يرجى المحاولة مرة أخرى.'
        : 'Sorry, I encountered an issue accessing the knowledge base. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});