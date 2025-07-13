-- Check if uploaded_files table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS public.uploaded_files (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    bucket_name TEXT NOT NULL,
    module_type TEXT NOT NULL,
    integration_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'uploaded',
    processing_status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage buckets for file uploads if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('government-documents', 'government-documents', false),
    ('hr-documents', 'hr-documents', false),
    ('payroll-files', 'payroll-files', false),
    ('compliance-files', 'compliance-files', false),
    ('training-certificates', 'training-certificates', false),
    ('medical-records', 'medical-records', false),
    ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on uploaded_files table
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- Create policies for file access (allow all for now)
CREATE POLICY "Allow file uploads for all users" ON public.uploaded_files
    FOR ALL USING (true);

-- Create storage policies for file access
CREATE POLICY "Allow all file operations" ON storage.objects
    FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_uploaded_files_updated_at
    BEFORE UPDATE ON public.uploaded_files
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();