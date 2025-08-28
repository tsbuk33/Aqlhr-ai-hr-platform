-- Create documents storage bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their tenant documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their tenant documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their tenant documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their tenant documents" ON storage.objects;

-- Create RLS policies for documents bucket
CREATE POLICY "Users can view their tenant documents" ON storage.objects
  FOR SELECT 
  TO authenticated
  USING (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can upload their tenant documents" ON storage.objects
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their tenant documents" ON storage.objects
  FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their tenant documents" ON storage.objects
  FOR DELETE 
  TO authenticated
  USING (bucket_id = 'documents' AND auth.uid() IS NOT NULL);