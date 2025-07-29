import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentProcessRequest {
  fileUrl: string;
  fileName: string;
  moduleKey?: string;
  companyId?: string;
  userId?: string;
}

interface DocumentChunk {
  content: string;
  embedding: number[];
  chunkIndex: number;
  startPosition: number;
  endPosition: number;
}

interface ProcessedDocument {
  documentId: string;
  fileName: string;
  totalChunks: number;
  chunks: DocumentChunk[];
  processingStatus: 'completed' | 'failed';
  errorMessage?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { fileUrl, fileName, moduleKey, companyId, userId }: DocumentProcessRequest = await req.json();

    if (!fileUrl || !fileName) {
      throw new Error('File URL and filename are required');
    }

    console.log(`Processing document: ${fileName}`);

    // Download the file content
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to download file: ${fileResponse.statusText}`);
    }

    const fileContent = await fileResponse.text();
    console.log(`Downloaded file content: ${fileContent.length} characters`);

    // Process the document content
    const processedDocument = await processDocumentContent({
      fileName,
      content: fileContent,
      moduleKey,
      companyId,
      userId
    });

    // Store the processed document and chunks in the database
    const { data: documentRecord, error: docError } = await supabase
      .from('ai_document_embeddings')
      .insert({
        file_name: fileName,
        file_url: fileUrl,
        module_key: moduleKey,
        company_id: companyId,
        user_id: userId,
        total_chunks: processedDocument.totalChunks,
        processing_status: processedDocument.processingStatus,
        processed_content: fileContent.substring(0, 10000), // Store first 10k chars for reference
        metadata: {
          fileSize: fileContent.length,
          processingDate: new Date().toISOString(),
          embeddingModel: 'mixedbread-ai/mxbai-embed-xsmall-v1'
        }
      })
      .select()
      .single();

    if (docError) {
      throw new Error(`Failed to store document record: ${docError.message}`);
    }

    // Store document chunks with embeddings
    if (processedDocument.chunks.length > 0) {
      const chunkInserts = processedDocument.chunks.map(chunk => ({
        document_id: documentRecord.id,
        content: chunk.content,
        embedding: chunk.embedding,
        chunk_index: chunk.chunkIndex,
        start_position: chunk.startPosition,
        end_position: chunk.endPosition,
        metadata: {
          wordCount: chunk.content.split(' ').length,
          language: detectLanguage(chunk.content)
        }
      }));

      const { error: chunksError } = await supabase
        .from('ai_document_chunks')
        .insert(chunkInserts);

      if (chunksError) {
        console.error('Failed to store document chunks:', chunksError);
        // Update document status to failed
        await supabase
          .from('ai_document_embeddings')
          .update({ processing_status: 'failed' })
          .eq('id', documentRecord.id);
        
        throw new Error(`Failed to store document chunks: ${chunksError.message}`);
      }
    }

    console.log(`Successfully processed document: ${fileName} with ${processedDocument.totalChunks} chunks`);

    return new Response(
      JSON.stringify({
        success: true,
        documentId: documentRecord.id,
        fileName: processedDocument.fileName,
        totalChunks: processedDocument.totalChunks,
        processingStatus: processedDocument.processingStatus
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Document processing error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function processDocumentContent({
  fileName,
  content,
  moduleKey,
  companyId,
  userId
}: {
  fileName: string;
  content: string;
  moduleKey?: string;
  companyId?: string;
  userId?: string;
}): Promise<ProcessedDocument> {
  try {
    // Use simple text chunking since we can't use Hugging Face in Deno edge functions
    const chunks = chunkText(content, 512, 50);
    console.log(`Created ${chunks.length} chunks from document`);

    // For now, we'll use a simple hash-based "embedding" as a placeholder
    // In a real implementation, you'd call an external embedding service
    const processedChunks: DocumentChunk[] = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: generateSimpleEmbedding(chunk), // Placeholder implementation
      chunkIndex: index,
      startPosition: content.indexOf(chunk),
      endPosition: content.indexOf(chunk) + chunk.length
    }));

    return {
      documentId: crypto.randomUUID(),
      fileName,
      totalChunks: processedChunks.length,
      chunks: processedChunks,
      processingStatus: 'completed'
    };

  } catch (error) {
    console.error('Error processing document content:', error);
    return {
      documentId: crypto.randomUUID(),
      fileName,
      totalChunks: 0,
      chunks: [],
      processingStatus: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown processing error'
    };
  }
}

function chunkText(text: string, chunkSize: number = 512, overlap: number = 50): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk.trim());
    }
  }
  
  return chunks;
}

// Simple embedding generation for server-side processing
// This is a placeholder - in production, you'd use a proper embedding service
function generateSimpleEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/);
  const embedding = new Array(384).fill(0); // Standard embedding size
  
  // Simple hash-based approach for demonstration
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = ((hash << 5) - hash + word.charCodeAt(j)) & 0xffffffff;
    }
    const index = Math.abs(hash) % embedding.length;
    embedding[index] += 1 / Math.sqrt(words.length);
  }
  
  // Normalize the embedding
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
}

function detectLanguage(text: string): 'ar' | 'en' | 'mixed' {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  const englishRegex = /[a-zA-Z]/;
  
  const hasArabic = arabicRegex.test(text);
  const hasEnglish = englishRegex.test(text);
  
  if (hasArabic && hasEnglish) return 'mixed';
  if (hasArabic) return 'ar';
  return 'en';
}