-- Create job titles table
CREATE TABLE public.job_titles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  level TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create smart KPIs table
CREATE TABLE public.smart_kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  kpi_name TEXT NOT NULL,
  kpi_description TEXT NOT NULL,
  measurement_unit TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  frequency TEXT NOT NULL,
  weight_percentage NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  formula TEXT,
  data_source TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job title KPIs mapping table
CREATE TABLE public.job_title_kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title_id UUID NOT NULL,
  kpi_id UUID NOT NULL,
  is_mandatory BOOLEAN NOT NULL DEFAULT false,
  custom_target NUMERIC,
  weight_override NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employee KPI assignments table
CREATE TABLE public.employee_kpi_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  job_title_kpi_id UUID NOT NULL,
  target_value NUMERIC NOT NULL,
  current_value NUMERIC NOT NULL DEFAULT 0,
  achievement_percentage NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  review_period TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create performance agreements table
CREATE TABLE public.performance_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL,
  company_id UUID NOT NULL,
  agreement_period TEXT NOT NULL,
  total_kpis INTEGER NOT NULL DEFAULT 0,
  total_weight NUMERIC NOT NULL DEFAULT 0,
  overall_target NUMERIC NOT NULL DEFAULT 100,
  current_achievement NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  signed_date DATE,
  review_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_title_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_kpi_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_agreements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage job titles from their company" ON public.job_titles
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage smart KPIs from their company" ON public.smart_kpis
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage job title KPIs from their company" ON public.job_title_kpis
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage employee KPI assignments from their company" ON public.employee_kpi_assignments
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage performance agreements from their company" ON public.performance_agreements
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create indexes
CREATE INDEX idx_job_titles_company_id ON public.job_titles(company_id);
CREATE INDEX idx_smart_kpis_company_id ON public.smart_kpis(company_id);
CREATE INDEX idx_job_title_kpis_job_title_id ON public.job_title_kpis(job_title_id);
CREATE INDEX idx_job_title_kpis_kpi_id ON public.job_title_kpis(kpi_id);
CREATE INDEX idx_employee_kpi_assignments_employee_id ON public.employee_kpi_assignments(employee_id);
CREATE INDEX idx_performance_agreements_employee_id ON public.performance_agreements(employee_id);

-- Create update timestamp triggers
CREATE TRIGGER update_job_titles_updated_at
  BEFORE UPDATE ON public.job_titles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_smart_kpis_updated_at
  BEFORE UPDATE ON public.smart_kpis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_title_kpis_updated_at
  BEFORE UPDATE ON public.job_title_kpis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employee_kpi_assignments_updated_at
  BEFORE UPDATE ON public.employee_kpi_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();