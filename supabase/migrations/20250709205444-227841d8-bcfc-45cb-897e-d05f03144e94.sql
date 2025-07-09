-- Create storage buckets for SanadHR file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('government-documents', 'government-documents', false),
  ('employee-documents', 'employee-documents', false),
  ('hr-documents', 'hr-documents', false),
  ('payroll-files', 'payroll-files', false),
  ('compliance-files', 'compliance-files', false),
  ('training-certificates', 'training-certificates', false),
  ('medical-records', 'medical-records', false),
  ('public-assets', 'public-assets', true);

-- Create storage policies for government documents
CREATE POLICY "Users can upload government documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'government-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their government documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'government-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their government documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'government-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their government documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'government-documents' AND auth.uid() IS NOT NULL);

-- Create storage policies for employee documents
CREATE POLICY "Users can upload employee documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'employee-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their employee documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'employee-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their employee documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'employee-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their employee documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'employee-documents' AND auth.uid() IS NOT NULL);

-- Create storage policies for HR documents
CREATE POLICY "Users can upload HR documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'hr-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their HR documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hr-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their HR documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'hr-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their HR documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'hr-documents' AND auth.uid() IS NOT NULL);

-- Create storage policies for payroll files
CREATE POLICY "Users can upload payroll files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'payroll-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their payroll files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'payroll-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their payroll files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'payroll-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their payroll files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'payroll-files' AND auth.uid() IS NOT NULL);

-- Create storage policies for compliance files
CREATE POLICY "Users can upload compliance files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'compliance-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their compliance files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'compliance-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their compliance files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'compliance-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their compliance files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'compliance-files' AND auth.uid() IS NOT NULL);

-- Create storage policies for training certificates
CREATE POLICY "Users can upload training certificates" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'training-certificates' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their training certificates" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'training-certificates' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their training certificates" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'training-certificates' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their training certificates" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'training-certificates' AND auth.uid() IS NOT NULL);

-- Create storage policies for medical records
CREATE POLICY "Users can upload medical records" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'medical-records' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their medical records" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'medical-records' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their medical records" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'medical-records' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their medical records" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'medical-records' AND auth.uid() IS NOT NULL);

-- Create storage policies for public assets (open access)
CREATE POLICY "Public assets are viewable by everyone" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'public-assets');

CREATE POLICY "Users can upload public assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'public-assets' AND auth.uid() IS NOT NULL);

-- Create a table to track uploaded files metadata
CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES public.companies(id),
  module_type TEXT,
  integration_type TEXT,
  status TEXT DEFAULT 'uploaded',
  processing_status TEXT DEFAULT 'pending',
  extracted_data JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on uploaded_files table
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for uploaded_files table
CREATE POLICY "Users can view their uploaded files" 
ON public.uploaded_files 
FOR SELECT 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can insert their uploaded files" 
ON public.uploaded_files 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their uploaded files" 
ON public.uploaded_files 
FOR UPDATE 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their uploaded files" 
ON public.uploaded_files 
FOR DELETE 
USING (auth.uid() = uploaded_by);

-- Create trigger for updated_at
CREATE TRIGGER update_uploaded_files_updated_at
  BEFORE UPDATE ON public.uploaded_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();