-- Create storage bucket for CCI evidence files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cci-evidence', 
  'cci-evidence', 
  false, 
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Storage policies for CCI evidence
CREATE POLICY "Users can upload evidence to their tenant bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'cci-evidence' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = get_user_company_id()::text
);

CREATE POLICY "Users can view evidence from their tenant" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'cci-evidence' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = get_user_company_id()::text
);

CREATE POLICY "Users can update evidence from their tenant" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'cci-evidence' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = get_user_company_id()::text
);

CREATE POLICY "Users can delete evidence from their tenant" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'cci-evidence' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = get_user_company_id()::text
);

-- Add processing status and metadata columns to cci_evidence
ALTER TABLE cci_evidence 
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS extracted_text TEXT,
ADD COLUMN IF NOT EXISTS file_metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ai_confidence NUMERIC DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE;

-- Update balance score calculation to include evidence factor
CREATE OR REPLACE FUNCTION cci_evidence_quality_factor(p_tenant_id UUID, p_survey_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_evidence_count INTEGER;
  v_unique_types INTEGER;
  v_recent_count INTEGER;
  v_quality_factor NUMERIC;
BEGIN
  -- Count total evidence
  SELECT COUNT(*)
  INTO v_evidence_count
  FROM cci_evidence 
  WHERE tenant_id = p_tenant_id 
  AND (p_survey_id IS NULL OR survey_id = p_survey_id)
  AND processing_status = 'completed';
  
  -- Count unique evidence types (diversity)
  SELECT COUNT(DISTINCT type)
  INTO v_unique_types
  FROM cci_evidence 
  WHERE tenant_id = p_tenant_id 
  AND (p_survey_id IS NULL OR survey_id = p_survey_id)
  AND processing_status = 'completed';
  
  -- Count recent evidence (last 90 days)
  SELECT COUNT(*)
  INTO v_recent_count
  FROM cci_evidence 
  WHERE tenant_id = p_tenant_id 
  AND (p_survey_id IS NULL OR survey_id = p_survey_id)
  AND processing_status = 'completed'
  AND uploaded_at > NOW() - INTERVAL '90 days';
  
  -- Calculate normalized quality factor (0-1 scale)
  -- Formula: (count_factor * 0.4) + (diversity_factor * 0.4) + (recency_factor * 0.2)
  v_quality_factor := 
    (LEAST(v_evidence_count / 20.0, 1.0) * 0.4) +  -- Max at 20 pieces
    (LEAST(v_unique_types / 6.0, 1.0) * 0.4) +     -- Max at 6 types
    (LEAST(v_recent_count / 10.0, 1.0) * 0.2);     -- Max at 10 recent
    
  RETURN COALESCE(v_quality_factor, 0.0);
END;
$$;