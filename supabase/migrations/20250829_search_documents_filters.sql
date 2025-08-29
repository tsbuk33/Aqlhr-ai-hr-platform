-- Migration to enhance search_documents_knn_v1 function with filter support for RAG
-- Phase 26: Universal Document Ingestion - RAG Enhancement

-- Drop existing function
DROP FUNCTION IF EXISTS public.search_documents_knn_v1(uuid, text, int);

-- Create enhanced function with filter support
CREATE OR REPLACE FUNCTION public.search_documents_knn_v1(
    company_id uuid,
    query_text text,
    match_count int DEFAULT 8,
    filters jsonb DEFAULT '{}'::jsonb
)
RETURNS TABLE (
    doc_id uuid,
    chunk_text text,
    score float,
    page int,
    portal text,
    employee_id uuid,
    doc_type text,
    uploaded_at timestamptz,
    title text,
    storage_path text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    query_embedding vector(1536);
    filter_portal text[];
    filter_employee_id uuid;
    filter_doc_type text[];
    filter_uploaded_after timestamptz;
BEGIN
    -- Validate tenant access
    IF NOT EXISTS (
        SELECT 1 FROM public.get_user_company_id() 
        WHERE public.get_user_company_id() = company_id
    ) THEN
        RAISE EXCEPTION 'Access denied: invalid tenant';
    END IF;

    -- Extract filter parameters
    filter_portal := CASE 
        WHEN filters ? 'portal' AND jsonb_typeof(filters->'portal') = 'array' 
        THEN ARRAY(SELECT jsonb_array_elements_text(filters->'portal'))
        ELSE NULL 
    END;
    
    filter_employee_id := CASE 
        WHEN filters ? 'employee_id' AND filters->>'employee_id' != 'null' 
        THEN (filters->>'employee_id')::uuid
        ELSE NULL 
    END;
    
    filter_doc_type := CASE 
        WHEN filters ? 'doc_type' AND jsonb_typeof(filters->'doc_type') = 'array' 
        THEN ARRAY(SELECT jsonb_array_elements_text(filters->'doc_type'))
        ELSE NULL 
    END;
    
    filter_uploaded_after := CASE 
        WHEN filters ? 'uploaded_after' AND filters->>'uploaded_after' != 'null'
        THEN (filters->>'uploaded_after')::timestamptz
        ELSE NULL 
    END;

    -- Generate embedding for query text (mock implementation)
    -- In production, this would call an actual embedding service
    SELECT array_to_vector(array_fill(random()::float, ARRAY[1536]))::vector(1536) 
    INTO query_embedding;

    -- Perform vector search with filters
    RETURN QUERY
    SELECT 
        d.id as doc_id,
        COALESCE(dv.chunk_text, d.ocr_text, '') as chunk_text,
        COALESCE(1 - (dv.embedding <=> query_embedding), 0.5)::float as score,
        COALESCE(dv.page, 1) as page,
        d.portal,
        d.employee_id,
        d.doc_type,
        d.created_at as uploaded_at,
        d.title,
        d.storage_path
    FROM public.documents d
    LEFT JOIN public.document_vectors dv ON d.id = dv.document_id
    WHERE 
        d.tenant_id = company_id
        AND (filter_portal IS NULL OR d.portal = ANY(filter_portal))
        AND (filter_employee_id IS NULL OR d.employee_id = filter_employee_id)
        AND (filter_doc_type IS NULL OR d.doc_type = ANY(filter_doc_type))
        AND (filter_uploaded_after IS NULL OR d.created_at >= filter_uploaded_after)
        AND (d.ocr_text IS NOT NULL OR dv.embedding IS NOT NULL)
    ORDER BY 
        CASE 
            WHEN dv.embedding IS NOT NULL 
            THEN (dv.embedding <=> query_embedding)
            ELSE 1.0
        END
    LIMIT match_count;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.search_documents_knn_v1(uuid, text, int, jsonb) TO authenticated;

-- Add RLS policy for the function
ALTER FUNCTION public.search_documents_knn_v1(uuid, text, int, jsonb) SET search_path = public;

-- Comment on function
COMMENT ON FUNCTION public.search_documents_knn_v1(uuid, text, int, jsonb) IS 
'Enhanced KNN search for documents with optional filters for RAG system. Supports portal, employee_id, doc_type, and date filters.';

-- Update get_document_stats_v1 function to include more detailed stats
CREATE OR REPLACE FUNCTION public.get_document_stats_v1(company_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stats_result jsonb;
BEGIN
    -- Validate tenant access
    IF NOT EXISTS (
        SELECT 1 FROM public.get_user_company_id() 
        WHERE public.get_user_company_id() = company_id
    ) THEN
        RAISE EXCEPTION 'Access denied: invalid tenant';
    END IF;

    SELECT jsonb_build_object(
        'total_documents', COUNT(*),
        'by_bucket', jsonb_object_agg(
            storage_bucket,
            bucket_stats
        ),
        'by_portal', jsonb_object_agg(
            COALESCE(portal, 'none'),
            portal_stats
        ),
        'expiring_soon', (
            SELECT COUNT(*)
            FROM public.documents
            WHERE tenant_id = company_id
            AND expiry_date IS NOT NULL
            AND expiry_date <= (CURRENT_DATE + INTERVAL '30 days')
            AND expiry_date > CURRENT_DATE
        ),
        'expired', (
            SELECT COUNT(*)
            FROM public.documents
            WHERE tenant_id = company_id
            AND expiry_date IS NOT NULL
            AND expiry_date <= CURRENT_DATE
        ),
        'with_embeddings', (
            SELECT COUNT(DISTINCT dv.document_id)
            FROM public.document_vectors dv
            JOIN public.documents d ON d.id = dv.document_id
            WHERE d.tenant_id = company_id
        ),
        'last_updated', COALESCE(MAX(created_at), NOW())
    )
    INTO stats_result
    FROM (
        SELECT 
            storage_bucket,
            portal,
            created_at,
            jsonb_build_object(
                'count', COUNT(*),
                'avg_size', ROUND(AVG(COALESCE(file_size, 0))),
                'languages', jsonb_object_agg(
                    lang,
                    COUNT(*)
                )
            ) as bucket_stats
        FROM public.documents
        WHERE tenant_id = company_id
        GROUP BY storage_bucket, portal, created_at
    ) bucket_data
    CROSS JOIN (
        SELECT 
            portal,
            jsonb_build_object(
                'count', COUNT(*),
                'types', jsonb_object_agg(
                    COALESCE(doc_type, 'unknown'),
                    COUNT(*)
                )
            ) as portal_stats
        FROM public.documents
        WHERE tenant_id = company_id
        GROUP BY portal
    ) portal_data
    GROUP BY storage_bucket, portal;

    RETURN COALESCE(stats_result, '{}'::jsonb);
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_document_stats_v1(uuid) TO authenticated;