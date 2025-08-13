-- Fix function search path security issues
-- Update all functions to have proper search_path set

CREATE OR REPLACE FUNCTION public.cosine_similarity(a double precision[], b double precision[])
RETURNS double precision
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.find_similar_chunks(query_embedding double precision[], similarity_threshold double precision DEFAULT 0.5, max_results integer DEFAULT 10, target_company_id uuid DEFAULT NULL::uuid, target_module_key text DEFAULT NULL::text)
RETURNS TABLE(chunk_id uuid, document_id uuid, content text, similarity_score double precision, file_name text, module_key text, chunk_index integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.get_cities_by_region(region_code text)
RETURNS TABLE(id uuid, code text, name_en text, name_ar text, timezone text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.code, c.name_en, c.name_ar, c.timezone
  FROM public.saudi_cities c
  JOIN public.saudi_regions r ON c.region_id = r.id
  WHERE r.code = region_code
  ORDER BY c.name_en;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_activities_by_sector(sector_code text)
RETURNS TABLE(id uuid, classification_code text, name_en text, name_ar text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT a.id, a.classification_code, a.name_en, a.name_ar
  FROM public.saudi_activities a
  JOIN public.saudi_sectors s ON a.sector_id = s.id
  WHERE s.sic_code = sector_code
  ORDER BY a.name_en;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_leo_geo_insights()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_employee_id UUID;
  v_company_id UUID;
  v_avg_completion NUMERIC;
  v_engagement_score NUMERIC;
BEGIN
  -- Get employee and company ID from the triggered row
  v_employee_id := COALESCE(NEW.employee_id, OLD.employee_id);
  v_company_id := COALESCE(NEW.company_id, OLD.company_id);
  
  -- Get average completion percentage for learning
  SELECT AVG(completion_percentage) INTO v_avg_completion
  FROM public.learning_progress_tracking 
  WHERE employee_id = v_employee_id AND company_id = v_company_id;
  
  -- Get latest engagement score
  SELECT engagement_score INTO v_engagement_score
  FROM public.engagement_metrics_tracking 
  WHERE employee_id = v_employee_id AND company_id = v_company_id
  ORDER BY measurement_date DESC 
  LIMIT 1;
  
  -- Insert or update learning engagement insights
  INSERT INTO public.learning_engagement_insights (
    company_id,
    employee_id,
    learning_engagement_score,
    skills_completion_rate,
    engagement_impact_on_learning,
    learning_impact_on_engagement
  ) VALUES (
    v_company_id,
    v_employee_id,
    COALESCE(v_engagement_score, 0) * 0.7 + COALESCE(v_avg_completion, 0) * 0.3,
    COALESCE(v_avg_completion, 0),
    CASE 
      WHEN COALESCE(v_engagement_score, 0) > 80 THEN 15
      WHEN COALESCE(v_engagement_score, 0) > 60 THEN 10
      ELSE 5
    END,
    CASE 
      WHEN COALESCE(v_avg_completion, 0) > 80 THEN 15
      WHEN COALESCE(v_avg_completion, 0) > 60 THEN 10
      ELSE 5
    END
  )
  ON CONFLICT (employee_id, company_id) 
  DO UPDATE SET
    learning_engagement_score = COALESCE(v_engagement_score, 0) * 0.7 + COALESCE(v_avg_completion, 0) * 0.3,
    skills_completion_rate = COALESCE(v_avg_completion, 0),
    engagement_impact_on_learning = CASE 
      WHEN COALESCE(v_engagement_score, 0) > 80 THEN 15
      WHEN COALESCE(v_engagement_score, 0) > 60 THEN 10
      ELSE 5
    END,
    learning_impact_on_engagement = CASE 
      WHEN COALESCE(v_avg_completion, 0) > 80 THEN 15
      WHEN COALESCE(v_avg_completion, 0) > 60 THEN 10
      ELSE 5
    END,
    updated_at = now();
    
  RETURN COALESCE(NEW, OLD);
END;
$$;