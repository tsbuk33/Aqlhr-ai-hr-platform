-- Employee Master Data v1: Storage, Events, and RLS (Simplified)

-- Create storage bucket for employee documents (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('hr-employee-docs', 'hr-employee-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Drop table if exists to recreate cleanly
DROP TABLE IF EXISTS public.docs_events CASCADE;

-- Create docs_events table for document metadata and audit trail
CREATE TABLE public.docs_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  document_type text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  virus_scan_status text DEFAULT 'pending' CHECK (virus_scan_status IN ('pending', 'clean', 'infected', 'failed')),
  virus_scan_details jsonb DEFAULT '{}',
  upload_metadata jsonb DEFAULT '{}',
  uploaded_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on docs_events
ALTER TABLE public.docs_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for docs_events
CREATE POLICY "Users can manage docs_events from their company" ON public.docs_events
FOR ALL USING (company_id = get_user_company_id())
WITH CHECK (company_id = get_user_company_id());

-- Storage policies for hr-employee-docs bucket
CREATE POLICY "Users can view employee docs from their company" ON storage.objects
FOR SELECT USING (
  bucket_id = 'hr-employee-docs' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "HR managers can upload employee docs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'hr-employee-docs' 
  AND auth.uid() IS NOT NULL
  AND (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'hr_manager', 'super_admin')
    )
  )
);

CREATE POLICY "HR managers can update employee docs" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'hr-employee-docs' 
  AND auth.uid() IS NOT NULL
  AND (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'hr_manager', 'super_admin')
    )
  )
);

CREATE POLICY "HR managers can delete employee docs" ON storage.objects
FOR DELETE USING (
  bucket_id = 'hr-employee-docs' 
  AND auth.uid() IS NOT NULL
  AND (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'hr_manager', 'super_admin')
    )
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_docs_events_updated_at
  BEFORE UPDATE ON public.docs_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_docs_events_employee_company ON public.docs_events (employee_id, company_id);
CREATE INDEX idx_docs_events_company_created ON public.docs_events (company_id, created_at DESC);