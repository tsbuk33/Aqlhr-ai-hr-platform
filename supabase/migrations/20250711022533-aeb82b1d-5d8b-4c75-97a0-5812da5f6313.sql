-- Create tables for Translation Integrity & Self-Healing Engine

-- Translation registry for all extracted strings and keys
CREATE TABLE public.translation_registry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_key TEXT NOT NULL,
  source_file TEXT NOT NULL,
  source_line INTEGER,
  context_info TEXT,
  english_text TEXT,
  arabic_text TEXT,
  is_ai_generated BOOLEAN DEFAULT false,
  needs_review BOOLEAN DEFAULT false,
  last_updated_en TIMESTAMP WITH TIME ZONE,
  last_updated_ar TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(translation_key)
);

-- Translation audit results and health monitoring
CREATE TABLE public.translation_audits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_type TEXT NOT NULL, -- 'automated', 'deploy', 'manual'
  audit_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  total_keys_scanned INTEGER DEFAULT 0,
  missing_arabic_keys INTEGER DEFAULT 0,
  ai_patched_keys INTEGER DEFAULT 0,
  needs_review_count INTEGER DEFAULT 0,
  hardcoded_strings_found INTEGER DEFAULT 0,
  audit_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Self-healing patches applied in real-time
CREATE TABLE public.translation_patches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_key TEXT NOT NULL,
  patched_text TEXT NOT NULL,
  language TEXT NOT NULL, -- 'ar' or 'en'
  patch_source TEXT DEFAULT 'ai', -- 'ai', 'manual', 'fallback'
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_by UUID,
  approval_status TEXT DEFAULT 'pending' -- 'pending', 'approved', 'rejected'
);

-- Translation cache invalidation tracking
CREATE TABLE public.translation_cache_invalidations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invalidation_reason TEXT NOT NULL,
  affected_keys TEXT[],
  triggered_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.translation_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_patches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_cache_invalidations ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access (update when auth is implemented)
CREATE POLICY "Allow admin access to translation_registry" 
ON public.translation_registry FOR ALL USING (true);

CREATE POLICY "Allow admin access to translation_audits" 
ON public.translation_audits FOR ALL USING (true);

CREATE POLICY "Allow admin access to translation_patches" 
ON public.translation_patches FOR ALL USING (true);

CREATE POLICY "Allow admin access to translation_cache_invalidations" 
ON public.translation_cache_invalidations FOR ALL USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_translation_registry_updated_at
BEFORE UPDATE ON public.translation_registry
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to register a new translation key
CREATE OR REPLACE FUNCTION public.register_translation_key(
  p_key TEXT,
  p_source_file TEXT,
  p_source_line INTEGER DEFAULT NULL,
  p_context TEXT DEFAULT NULL,
  p_english_text TEXT DEFAULT NULL,
  p_arabic_text TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_registry_id UUID;
BEGIN
  -- Insert or update translation key
  INSERT INTO public.translation_registry (
    translation_key,
    source_file,
    source_line,
    context_info,
    english_text,
    arabic_text,
    needs_review
  ) VALUES (
    p_key,
    p_source_file,
    p_source_line,
    p_context,
    p_english_text,
    p_arabic_text,
    CASE WHEN p_arabic_text IS NULL THEN true ELSE false END
  )
  ON CONFLICT (translation_key) 
  DO UPDATE SET
    source_file = EXCLUDED.source_file,
    source_line = EXCLUDED.source_line,
    context_info = EXCLUDED.context_info,
    english_text = COALESCE(EXCLUDED.english_text, translation_registry.english_text),
    arabic_text = COALESCE(EXCLUDED.arabic_text, translation_registry.arabic_text),
    updated_at = now()
  RETURNING id INTO v_registry_id;
  
  RETURN v_registry_id;
END;
$$;

-- Function to apply self-healing patch
CREATE OR REPLACE FUNCTION public.apply_translation_patch(
  p_key TEXT,
  p_language TEXT,
  p_text TEXT,
  p_confidence DECIMAL DEFAULT 0.8
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_patch_id UUID;
BEGIN
  -- Insert the patch
  INSERT INTO public.translation_patches (
    translation_key,
    patched_text,
    language,
    confidence_score
  ) VALUES (
    p_key,
    p_text,
    p_language,
    p_confidence
  )
  RETURNING id INTO v_patch_id;
  
  -- Update the registry with the patch
  UPDATE public.translation_registry
  SET 
    arabic_text = CASE WHEN p_language = 'ar' THEN p_text ELSE arabic_text END,
    english_text = CASE WHEN p_language = 'en' THEN p_text ELSE english_text END,
    is_ai_generated = true,
    needs_review = true,
    last_updated_ar = CASE WHEN p_language = 'ar' THEN now() ELSE last_updated_ar END,
    last_updated_en = CASE WHEN p_language = 'en' THEN now() ELSE last_updated_en END
  WHERE translation_key = p_key;
  
  RETURN v_patch_id;
END;
$$;