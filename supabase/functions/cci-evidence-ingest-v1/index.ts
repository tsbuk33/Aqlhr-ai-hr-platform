import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

// Create Supabase client with service role for full access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface EvidenceProcessingResult {
  tokens: number;
  ai_tags: string[];
  extracted_text: string;
  confidence: number;
}

// Schein's model levels and Cultural Web dimensions for classification
const CLASSIFICATION_CATEGORIES = {
  schein_levels: ['Artifacts', 'Espoused', 'Underlying'],
  cultural_web: ['Stories', 'Rituals', 'Symbols', 'Power', 'Structure', 'Controls']
};

async function extractTextFromFile(fileBuffer: ArrayBuffer, mimeType: string, fileName: string): Promise<string> {
  try {
    console.log(`Extracting text from ${fileName} (${mimeType})`);
    
    if (mimeType.startsWith('text/')) {
      // Plain text files
      const decoder = new TextDecoder();
      return decoder.decode(fileBuffer);
    }
    
    if (mimeType === 'application/pdf') {
      // For PDF processing, we'll use a simplified approach
      // In production, you'd want to use a proper PDF parser
      console.log('PDF text extraction would require additional libraries');
      return `[PDF Content: ${fileName}]`;
    }
    
    if (mimeType.startsWith('image/')) {
      // For images, we'll use OpenAI Vision API for OCR
      const base64Image = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
      const imageUrl = `data:${mimeType};base64,${base64Image}`;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all visible text from this image. Focus on any organizational culture-related content like policies, values, communications, etc. Return only the extracted text.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        }),
      });

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    }
    
    // For other document types, return placeholder
    return `[Document content: ${fileName}]`;
    
  } catch (error) {
    console.error('Text extraction error:', error);
    return `[Error extracting text from ${fileName}]`;
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    console.log('Generating embedding for text length:', text.length);
    
    // Truncate text if too long for embedding
    const truncatedText = text.length > 8000 ? text.substring(0, 8000) + '...' : text;
    
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: truncatedText,
      }),
    });

    const data = await response.json();
    return data.data[0].embedding;
    
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw error;
  }
}

async function classifyContent(text: string): Promise<{ tags: string[], confidence: number }> {
  try {
    console.log('Classifying content for AI tagging');
    
    const prompt = `Analyze this organizational culture evidence and classify it according to:

1. Schein's Three Levels:
   - Artifacts: Observable behaviors, dress codes, office layout, ceremonies
   - Espoused: Stated values, mission statements, policies, official communications
   - Underlying: Basic assumptions, unconscious beliefs, deeply held values

2. Cultural Web Dimensions:
   - Stories: Organizational narratives, legends, myths
   - Rituals: Regular activities, meetings, celebrations
   - Symbols: Language, logos, physical objects, status symbols
   - Power: Decision-making patterns, influence networks
   - Structure: Organizational hierarchy, reporting lines
   - Controls: Measurement systems, rewards, procedures

Return ONLY a JSON object with this format:
{
  "schein_level": ["Artifacts", "Espoused", or "Underlying"],
  "cultural_web": ["Stories", "Rituals", "Symbols", "Power", "Structure", "Controls"],
  "confidence": 0.85
}

Evidence text:
${text.substring(0, 2000)}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini-2025-04-14',
        messages: [
          { role: 'system', content: 'You are an expert in organizational culture analysis. Return only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 200,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No classification response');
    }
    
    try {
      const classification = JSON.parse(content);
      const tags = [...(classification.schein_level || []), ...(classification.cultural_web || [])];
      return {
        tags: tags.filter(tag => tag && typeof tag === 'string'),
        confidence: classification.confidence || 0.5
      };
    } catch (parseError) {
      console.error('Failed to parse classification JSON:', content);
      return { tags: ['Artifacts'], confidence: 0.3 };
    }
    
  } catch (error) {
    console.error('Content classification error:', error);
    return { tags: ['Artifacts'], confidence: 0.3 };
  }
}

async function performBasicVirusScan(fileBuffer: ArrayBuffer, fileName: string): Promise<boolean> {
  // Basic virus scan - check for suspicious patterns
  // In production, integrate with ClamAV or similar
  
  const suspicious_patterns = [
    /\x4D\x5A.{58}\x50\x45\x00\x00/, // PE executable header
    /<script[^>]*>[\s\S]*?<\/script>/gi, // Script tags
    /eval\s*\(/gi, // Eval functions
  ];
  
  const fileString = new TextDecoder('utf-8', { fatal: false }).decode(fileBuffer.slice(0, 1024));
  
  for (const pattern of suspicious_patterns) {
    if (pattern.test(fileString)) {
      console.warn(`Suspicious pattern detected in ${fileName}`);
      return false; // File rejected
    }
  }
  
  return true; // File appears clean
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('CCI Evidence Ingest V1 started');
    
    const { evidence_id } = await req.json();
    
    if (!evidence_id) {
      throw new Error('evidence_id is required');
    }

    console.log('Processing evidence:', evidence_id);

    // Get evidence record
    const { data: evidence, error: evidenceError } = await supabase
      .from('cci_evidence')
      .select('*')
      .eq('id', evidence_id)
      .single();

    if (evidenceError || !evidence) {
      throw new Error(`Evidence not found: ${evidenceError?.message}`);
    }

    if (!evidence.storage_path) {
      throw new Error('No storage path found for evidence');
    }

    console.log('Found evidence:', evidence.title, 'at path:', evidence.storage_path);

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('cci-evidence')
      .download(evidence.storage_path);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download file: ${downloadError?.message}`);
    }

    const fileBuffer = await fileData.arrayBuffer();
    const fileName = evidence.storage_path.split('/').pop() || 'unknown';
    const mimeType = fileData.type || 'application/octet-stream';

    console.log(`Processing file: ${fileName}, type: ${mimeType}, size: ${fileBuffer.byteLength}`);

    // Virus scan
    const isClean = await performBasicVirusScan(fileBuffer, fileName);
    if (!isClean) {
      // Update evidence as rejected
      await supabase
        .from('cci_evidence')
        .update({
          processing_status: 'rejected',
          processed_at: new Date().toISOString(),
          file_metadata: { rejection_reason: 'virus_scan_failed' }
        })
        .eq('id', evidence_id);

      throw new Error('File rejected by virus scan');
    }

    // Extract text
    const extractedText = await extractTextFromFile(fileBuffer, mimeType, fileName);
    console.log('Extracted text length:', extractedText.length);

    // Generate embedding
    const embedding = await generateEmbedding(extractedText);
    console.log('Generated embedding with dimensions:', embedding.length);

    // Classify content for AI tags
    const { tags: aiTags, confidence } = await classifyContent(extractedText);
    console.log('AI classification:', aiTags, 'confidence:', confidence);

    // Store embedding
    await supabase
      .from('cci_evidence_vectors')
      .upsert({
        evidence_id: evidence_id,
        embedding: embedding
      });

    // Update evidence record
    const { error: updateError } = await supabase
      .from('cci_evidence')
      .update({
        processing_status: 'completed',
        extracted_text: extractedText.substring(0, 10000), // Truncate for storage
        description: evidence.description || extractedText.substring(0, 1000),
        ai_tags: aiTags,
        ai_confidence: confidence,
        processed_at: new Date().toISOString(),
        file_metadata: {
          file_size: fileBuffer.byteLength,
          mime_type: mimeType,
          text_length: extractedText.length,
          embedding_dimensions: embedding.length
        }
      })
      .eq('id', evidence_id);

    if (updateError) {
      throw new Error(`Failed to update evidence: ${updateError.message}`);
    }

    console.log('Evidence processing completed successfully');

    const result: EvidenceProcessingResult = {
      tokens: Math.ceil(extractedText.length / 4), // Approximate token count
      ai_tags: aiTags,
      extracted_text: extractedText.substring(0, 500), // Return preview
      confidence: confidence
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in CCI evidence ingest:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Evidence processing failed'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});