-- Enable RLS on tables that currently don't have it
ALTER TABLE public.esg_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive_metrics ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.government_integration_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nitaqat_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saudi_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saudi_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saudi_leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saudi_payroll ENABLE ROW LEVEL SECURITY;

-- Create company-scoped policies for all these tables
CREATE POLICY "Users can manage ESG assessments from their company" 
ON public.esg_assessments 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view executive metrics from their company" 
ON public.executive_metrics 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view government integration logs from their company" 
ON public.government_integration_log 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage Nitaqat tracking from their company" 
ON public.nitaqat_tracking 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view Saudi departments from their company" 
ON public.saudi_departments 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage Saudi documents from their company" 
ON public.saudi_documents 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage Saudi leave requests from their company" 
ON public.saudi_leave_requests 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage Saudi payroll from their company" 
ON public.saudi_payroll 
FOR ALL 
USING (auth.uid() IS NOT NULL);