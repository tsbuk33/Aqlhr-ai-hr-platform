-- Create roi-reports storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('roi-reports', 'roi-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for roi-reports bucket
CREATE POLICY "Users can manage ROI reports from their company" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'roi-reports' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = get_user_company_id()::text
);

-- Add get_demo_tenant_id function if it doesn't exist
CREATE OR REPLACE FUNCTION public.get_demo_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- Return a demo tenant ID for testing/demo purposes
  SELECT '550e8400-e29b-41d4-a716-446655440000'::uuid;
$$;