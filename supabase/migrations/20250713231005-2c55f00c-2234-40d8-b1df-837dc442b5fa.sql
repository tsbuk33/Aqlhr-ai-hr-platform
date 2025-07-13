-- Clean up all existing storage policies and create one simple permissive policy
DO $$ 
DECLARE 
    pol_name text;
BEGIN
    -- Drop all existing policies on storage.objects
    FOR pol_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol_name);
    END LOOP;
END $$;

-- Create a single, very permissive policy for all storage operations
CREATE POLICY "Enable all storage operations for everyone" ON storage.objects
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Also ensure RLS is enabled on storage.objects  
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;