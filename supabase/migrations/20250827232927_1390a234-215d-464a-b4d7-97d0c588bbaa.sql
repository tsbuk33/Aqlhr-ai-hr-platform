-- Update gov_documents table to support comprehensive document management
-- Add missing columns for PDPL-safe document management with AI tagging

ALTER TABLE public.gov_documents 
ADD COLUMN IF NOT EXISTS module text,
ADD COLUMN IF NOT EXISTS entity_id text,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS uploaded_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS uploaded_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS mime_type text,
ADD COLUMN IF NOT EXISTS ai_tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS checksum text,
ADD COLUMN IF NOT EXISTS file_size bigint;

-- Update existing records to have proper timestamps if missing
UPDATE public.gov_documents 
SET uploaded_at = created_at 
WHERE uploaded_at IS NULL;

-- Create index for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_gov_documents_tenant_module ON public.gov_documents(tenant_id, module);
CREATE INDEX IF NOT EXISTS idx_gov_documents_entity ON public.gov_documents(entity_id) WHERE entity_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gov_documents_tags ON public.gov_documents USING GIN(tags) WHERE tags IS NOT NULL;

-- Enable RLS if not already enabled
ALTER TABLE public.gov_documents ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policy for tenant isolation
DROP POLICY IF EXISTS "tenant_rw_gov_docs" ON public.gov_documents;
CREATE POLICY "tenant_rw_gov_docs" ON public.gov_documents
  FOR ALL 
  TO authenticated
  USING (tenant_id = get_user_company_id())
  WITH CHECK (tenant_id = get_user_company_id());

-- Ensure proper PDPL compliance - no PII in ai_tags or tags
COMMENT ON COLUMN public.gov_documents.ai_tags IS 'AI-generated tags - MUST NOT contain PII';
COMMENT ON COLUMN public.gov_documents.tags IS 'User-defined tags - MUST NOT contain PII';