-- Update RLS policies for uploaded_files to allow uploads without authentication for now
DROP POLICY IF EXISTS "Users can view their uploaded files" ON public.uploaded_files;
DROP POLICY IF EXISTS "Users can insert their uploaded files" ON public.uploaded_files;
DROP POLICY IF EXISTS "Users can update their uploaded files" ON public.uploaded_files;
DROP POLICY IF EXISTS "Users can delete their uploaded files" ON public.uploaded_files;

-- Create more permissive policies for file uploads
CREATE POLICY "Allow file uploads for all users" ON public.uploaded_files
    FOR ALL USING (true);

-- Also update storage policies to be more permissive
DROP POLICY IF EXISTS "Allow all file operations" ON storage.objects;

CREATE POLICY "Allow all storage operations" ON storage.objects
    FOR ALL USING (true);