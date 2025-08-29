-- Phase 26: Universal Document Ingestion (Gov + Employee)
-- Create tenant-safe, bilingual document pipeline with OCR and embeddings
-- Supports government portals (Qiwa/GOSI/Absher/Mudad) and employee docs

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS "vector";

-- Main documents table with comprehensive metadata
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  
  -- Storage information
  storage_bucket text NOT NULL CHECK (storage_bucket IN ('gov_docs','employee_docs')),
  storage_path text NOT NULL,
  
  -- Classification and metadata
  portal text NULL CHECK (portal IN ('qiwa','gosi','absher','mudad','mol','other')),
  doc_type text NULL, -- iqama, nitaqat_certificate, contract, gosi_certificate, visa, payroll_report, medical_insurance, work_permit, establishment_card, other
  title text NULL,
  lang text NOT NULL DEFAULT 'en' CHECK (lang IN ('en','ar')),
  
  -- Employee linking
  employee_id uuid NULL,
  iqama_id text NULL,
  national_id text NULL,
  
  -- Date tracking for compliance
  effective_date date NULL,
  expiry_date date NULL,
  
  -- Content and processing
  sha256 text NOT NULL, -- For duplicate detection
  ocr_text text NULL,   -- Extracted text content
  ai_tags text[] NULL,  -- AI-generated tags
  
  -- Audit trail
  created_by uuid NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Additional metadata for governance
  file_size bigint NULL,
  content_type text NULL,
  processing_status text DEFAULT 'pending' CHECK (processing_status IN ('pending','processing','completed','failed')),
  processing_error text NULL
);

-- Vector embeddings table for semantic search
CREATE TABLE IF NOT EXISTS public.document_vectors(
  document_id uuid PRIMARY KEY REFERENCES public.documents(id) ON DELETE CASCADE,
  embedding vector(1536),
  created_at timestamptz DEFAULT now()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_documents_tenant_portal 
  ON public.documents(tenant_id, portal) WHERE portal IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_documents_tenant_employee 
  ON public.documents(tenant_id, employee_id) WHERE employee_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_documents_tenant_expiry 
  ON public.documents(tenant_id, expiry_date) WHERE expiry_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_documents_tenant_type 
  ON public.documents(tenant_id, doc_type) WHERE doc_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_documents_tenant_created 
  ON public.documents(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_documents_processing_status 
  ON public.documents(tenant_id, processing_status);

-- Unique constraint for duplicate detection
CREATE UNIQUE INDEX IF NOT EXISTS u_documents_tenant_sha 
  ON public.documents(tenant_id, sha256);

-- Full-text search index on OCR text
CREATE INDEX IF NOT EXISTS idx_documents_ocr_text_search 
  ON public.documents USING gin(to_tsvector('english', COALESCE(ocr_text, '')))
  WHERE ocr_text IS NOT NULL;

-- Vector similarity index
CREATE INDEX IF NOT EXISTS idx_document_vectors_embedding 
  ON public.document_vectors USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_vectors ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Tenant isolation using existing helper function
DROP POLICY IF EXISTS "documents_tenant_rw" ON public.documents;
CREATE POLICY "documents_tenant_rw" ON public.documents
  FOR ALL USING (tenant_id = public.get_user_company_id())
  WITH CHECK (tenant_id = public.get_user_company_id());

DROP POLICY IF EXISTS "docvecs_tenant_rw" ON public.document_vectors;
CREATE POLICY "docvecs_tenant_rw" ON public.document_vectors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id AND d.tenant_id = public.get_user_company_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id AND d.tenant_id = public.get_user_company_id()
    )
  );

-- Storage bucket policies for secure document access
-- NOTE: These require the storage buckets 'gov_docs' and 'employee_docs' to exist as PRIVATE buckets
-- Path convention: {tenant_id}/{timestamp}_{filename}

-- Allow authenticated users to upload to their tenant prefix
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gov_docs', 'gov_docs', false), ('employee_docs', 'employee_docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for tenant isolation
CREATE POLICY IF NOT EXISTS "allow_upload_tenant_prefix" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id IN ('gov_docs', 'employee_docs')
    AND starts_with(name, (public.get_user_company_id()::text || '/'))
  );

CREATE POLICY IF NOT EXISTS "allow_read_own_tenant" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id IN ('gov_docs', 'employee_docs')
    AND starts_with(name, (public.get_user_company_id()::text || '/'))
  );

CREATE POLICY IF NOT EXISTS "allow_delete_own_tenant" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id IN ('gov_docs', 'employee_docs')
    AND starts_with(name, (public.get_user_company_id()::text || '/'))
  );

CREATE POLICY IF NOT EXISTS "allow_update_own_tenant" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id IN ('gov_docs', 'employee_docs')
    AND starts_with(name, (public.get_user_company_id()::text || '/'))
  );

-- Helper function to search documents with vector similarity
CREATE OR REPLACE FUNCTION public.search_documents_knn_v1(
  p_query_embedding real[],
  p_top_k int DEFAULT 10,
  p_portal text DEFAULT NULL,
  p_doc_type text DEFAULT NULL,
  p_employee_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  title text,
  portal text,
  doc_type text,
  storage_bucket text,
  storage_path text,
  similarity real,
  employee_id uuid,
  created_at timestamptz,
  expiry_date date
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.title,
    d.portal,
    d.doc_type,
    d.storage_bucket,
    d.storage_path,
    1 - (dv.embedding <=> p_query_embedding::vector) AS similarity,
    d.employee_id,
    d.created_at,
    d.expiry_date
  FROM public.documents d
  INNER JOIN public.document_vectors dv ON d.id = dv.document_id
  WHERE d.tenant_id = public.get_user_company_id()
    AND d.processing_status = 'completed'
    AND (p_portal IS NULL OR d.portal = p_portal)
    AND (p_doc_type IS NULL OR d.doc_type = p_doc_type)
    AND (p_employee_id IS NULL OR d.employee_id = p_employee_id)
  ORDER BY dv.embedding <=> p_query_embedding::vector
  LIMIT p_top_k;
END;
$$;

-- Helper function to get document stats
CREATE OR REPLACE FUNCTION public.get_document_stats_v1()
RETURNS TABLE (
  total_documents bigint,
  by_portal jsonb,
  by_doc_type jsonb,
  expiring_soon bigint,
  processing_pending bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint AS total_documents,
    jsonb_object_agg(COALESCE(portal, 'unknown'), portal_count) AS by_portal,
    jsonb_object_agg(COALESCE(doc_type, 'unknown'), type_count) AS by_doc_type,
    COUNT(*) FILTER (WHERE expiry_date <= CURRENT_DATE + INTERVAL '30 days')::bigint AS expiring_soon,
    COUNT(*) FILTER (WHERE processing_status = 'pending')::bigint AS processing_pending
  FROM (
    SELECT 
      portal,
      doc_type,
      expiry_date,
      processing_status,
      COUNT(*) OVER (PARTITION BY portal) AS portal_count,
      COUNT(*) OVER (PARTITION BY doc_type) AS type_count
    FROM public.documents
    WHERE tenant_id = public.get_user_company_id()
  ) stats;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.search_documents_knn_v1(real[], int, text, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_document_stats_v1() TO authenticated;

-- Add helpful comments for documentation
COMMENT ON TABLE public.documents IS 'Universal document storage for government and employee documents with tenant isolation';
COMMENT ON TABLE public.document_vectors IS 'Vector embeddings for semantic document search';
COMMENT ON FUNCTION public.search_documents_knn_v1 IS 'Semantic search across documents using vector similarity';
COMMENT ON FUNCTION public.get_document_stats_v1 IS 'Get document statistics and compliance metrics for tenant';

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();