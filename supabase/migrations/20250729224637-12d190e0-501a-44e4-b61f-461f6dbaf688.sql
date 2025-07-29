-- Create table for storing document embeddings metadata
CREATE TABLE IF NOT EXISTS public.ai_document_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  module_key TEXT,
  company_id UUID,
  user_id UUID,
  total_chunks INTEGER DEFAULT 0,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  processed_content TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing document chunks with embeddings
CREATE TABLE IF NOT EXISTS public.ai_document_chunks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.ai_document_embeddings(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding FLOAT8[] NOT NULL, -- Store as array of float8 for similarity search
  chunk_index INTEGER NOT NULL,
  start_position INTEGER DEFAULT 0,
  end_position INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient similarity search and retrieval
CREATE INDEX IF NOT EXISTS idx_ai_document_embeddings_company_id ON public.ai_document_embeddings(company_id);
CREATE INDEX IF NOT EXISTS idx_ai_document_embeddings_user_id ON public.ai_document_embeddings(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_document_embeddings_module_key ON public.ai_document_embeddings(module_key);
CREATE INDEX IF NOT EXISTS idx_ai_document_embeddings_status ON public.ai_document_embeddings(processing_status);

CREATE INDEX IF NOT EXISTS idx_ai_document_chunks_document_id ON public.ai_document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_ai_document_chunks_chunk_index ON public.ai_document_chunks(document_id, chunk_index);

-- Enable Row Level Security
ALTER TABLE public.ai_document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_document_chunks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_document_embeddings
CREATE POLICY "Users can view their own document embeddings" 
ON public.ai_document_embeddings 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own document embeddings" 
ON public.ai_document_embeddings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own document embeddings" 
ON public.ai_document_embeddings 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own document embeddings" 
ON public.ai_document_embeddings 
FOR DELETE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for ai_document_chunks
CREATE POLICY "Users can view chunks of their documents" 
ON public.ai_document_chunks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.ai_document_embeddings 
    WHERE id = ai_document_chunks.document_id 
    AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

CREATE POLICY "Users can insert chunks for their documents" 
ON public.ai_document_chunks 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.ai_document_embeddings 
    WHERE id = ai_document_chunks.document_id 
    AND (user_id = auth.uid() OR user_id IS NULL)
  )
);

-- Create function for cosine similarity search
CREATE OR REPLACE FUNCTION cosine_similarity(a FLOAT8[], b FLOAT8[])
RETURNS FLOAT8 AS $$
DECLARE
  dot_product FLOAT8 := 0;
  norm_a FLOAT8 := 0;
  norm_b FLOAT8 := 0;
  i INTEGER;
BEGIN
  IF array_length(a, 1) != array_length(b, 1) THEN
    RAISE EXCEPTION 'Array dimensions must match';
  END IF;
  
  FOR i IN 1..array_length(a, 1) LOOP
    dot_product := dot_product + (a[i] * b[i]);
    norm_a := norm_a + (a[i] * a[i]);
    norm_b := norm_b + (b[i] * b[i]);
  END LOOP;
  
  IF norm_a = 0 OR norm_b = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN dot_product / (sqrt(norm_a) * sqrt(norm_b));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to find similar document chunks
CREATE OR REPLACE FUNCTION find_similar_chunks(
  query_embedding FLOAT8[],
  similarity_threshold FLOAT8 DEFAULT 0.5,
  max_results INTEGER DEFAULT 10,
  target_company_id UUID DEFAULT NULL,
  target_module_key TEXT DEFAULT NULL
)
RETURNS TABLE(
  chunk_id UUID,
  document_id UUID,
  content TEXT,
  similarity_score FLOAT8,
  file_name TEXT,
  module_key TEXT,
  chunk_index INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as chunk_id,
    c.document_id,
    c.content,
    cosine_similarity(c.embedding, query_embedding) as similarity_score,
    d.file_name,
    d.module_key,
    c.chunk_index
  FROM public.ai_document_chunks c
  JOIN public.ai_document_embeddings d ON c.document_id = d.id
  WHERE 
    cosine_similarity(c.embedding, query_embedding) >= similarity_threshold
    AND (target_company_id IS NULL OR d.company_id = target_company_id)
    AND (target_module_key IS NULL OR d.module_key = target_module_key)
    AND d.processing_status = 'completed'
  ORDER BY cosine_similarity(c.embedding, query_embedding) DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamps
CREATE TRIGGER update_ai_document_embeddings_updated_at
  BEFORE UPDATE ON public.ai_document_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();