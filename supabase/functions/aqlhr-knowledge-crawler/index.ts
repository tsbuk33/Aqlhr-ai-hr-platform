import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, action = 'crawl', limit = 50 } = await req.json();

    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      throw new Error('Firecrawl API key not configured');
    }

    if (action === 'crawl') {
      // Crawl the website using Firecrawl API
      const response = await fetch('https://api.firecrawl.dev/v0/crawl', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firecrawlApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          crawlerOptions: {
            limit: limit,
            allowBackwardCrawling: true,
            allowExternalContentLinks: false
          },
          pageOptions: {
            onlyMainContent: true,
            includeHtml: false,
            includeMarkdown: true,
            includeMetadata: true
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Firecrawl API error: ${response.status} ${errorData}`);
      }

      const crawlData = await response.json();
      
      if (crawlData.success) {
        // Store crawled data in Supabase for future AI queries
        const { error } = await supabase.from('ai_knowledge_base').insert({
          source_url: url,
          content_type: 'website_crawl',
          content_data: crawlData,
          crawl_id: crawlData.jobId,
          status: 'processing',
          company_id: 'aqlhr-platform'
        });

        if (error) {
          console.error('Error storing crawl data:', error);
        }

        return new Response(JSON.stringify({
          success: true,
          jobId: crawlData.jobId,
          message: 'Crawl started successfully',
          estimated_pages: crawlData.estimated_pages || limit
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        throw new Error(crawlData.error || 'Crawl failed');
      }
    } else if (action === 'status') {
      // Check crawl status
      const { jobId } = await req.json();
      
      const response = await fetch(`https://api.firecrawl.dev/v0/crawl/status/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${firecrawlApiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const statusData = await response.json();
      
      if (statusData.status === 'completed' && statusData.data) {
        // Process and store the completed crawl data
        for (const page of statusData.data) {
          if (page.markdown) {
            await supabase.from('ai_document_chunks').insert({
              document_id: jobId,
              content: page.markdown,
              metadata: {
                url: page.url,
                title: page.metadata?.title,
                description: page.metadata?.description,
                source: 'aqlhr_platform_crawl'
              },
              chunk_index: statusData.data.indexOf(page),
              company_id: 'aqlhr-platform'
            });
          }
        }

        // Update knowledge base status
        await supabase
          .from('ai_knowledge_base')
          .update({ 
            status: 'completed',
            pages_crawled: statusData.data.length,
            completed_at: new Date().toISOString()
          })
          .eq('crawl_id', jobId);
      }

      return new Response(JSON.stringify({
        success: true,
        status: statusData.status,
        completed: statusData.completed || 0,
        total: statusData.total || 0,
        data: statusData.data || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('AqlHR Knowledge Crawler error:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});