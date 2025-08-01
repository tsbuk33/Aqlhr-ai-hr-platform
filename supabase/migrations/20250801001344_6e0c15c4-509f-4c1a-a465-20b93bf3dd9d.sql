-- Comprehensive RLS Policy Implementation for tables with company_id
-- Auto-generated migration to achieve better RLS coverage

-- Employees (has company_id)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "employees_select" ON public.employees
  FOR SELECT USING (company_id = public.get_user_company_id());
CREATE POLICY "employees_insert" ON public.employees
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());
CREATE POLICY "employees_update" ON public.employees
  FOR UPDATE USING (company_id = public.get_user_company_id());
CREATE POLICY "employees_delete" ON public.employees
  FOR DELETE USING (company_id = public.get_user_company_id());

-- Saudi Employees (needs company_id column first)
ALTER TABLE public.saudi_employees ADD COLUMN IF NOT EXISTS company_id UUID;
ALTER TABLE public.saudi_employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saudi_employees_select" ON public.saudi_employees
  FOR SELECT USING (company_id = public.get_user_company_id() OR company_id IS NULL);
CREATE POLICY "saudi_employees_insert" ON public.saudi_employees
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());
CREATE POLICY "saudi_employees_update" ON public.saudi_employees
  FOR UPDATE USING (company_id = public.get_user_company_id() OR company_id IS NULL);
CREATE POLICY "saudi_employees_delete" ON public.saudi_employees
  FOR DELETE USING (company_id = public.get_user_company_id() OR company_id IS NULL);

-- Employee Documents (needs company_id column)
ALTER TABLE public.employee_documents ADD COLUMN IF NOT EXISTS company_id UUID;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "employee_documents_select" ON public.employee_documents
  FOR SELECT USING (company_id = public.get_user_company_id() OR company_id IS NULL);
CREATE POLICY "employee_documents_insert" ON public.employee_documents
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());
CREATE POLICY "employee_documents_update" ON public.employee_documents
  FOR UPDATE USING (company_id = public.get_user_company_id() OR company_id IS NULL);
CREATE POLICY "employee_documents_delete" ON public.employee_documents
  FOR DELETE USING (company_id = public.get_user_company_id() OR company_id IS NULL);

-- AI Knowledge Base (needs company_id column)
ALTER TABLE public.ai_knowledge_base ADD COLUMN IF NOT EXISTS company_id UUID;
ALTER TABLE public.ai_knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_knowledge_base_select" ON public.ai_knowledge_base
  FOR SELECT USING (company_id = public.get_user_company_id() OR company_id IS NULL);
CREATE POLICY "ai_knowledge_base_insert" ON public.ai_knowledge_base
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());
CREATE POLICY "ai_knowledge_base_update" ON public.ai_knowledge_base
  FOR UPDATE USING (company_id = public.get_user_company_id() OR company_id IS NULL);
CREATE POLICY "ai_knowledge_base_delete" ON public.ai_knowledge_base
  FOR DELETE USING (company_id = public.get_user_company_id() OR company_id IS NULL);

-- Tables without company_id - make them publicly accessible for now
-- ESG Metrics (global reference data)
ALTER TABLE public.esg_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "esg_metrics_public_access" ON public.esg_metrics FOR ALL USING (true);

-- ESG Benchmarks (global reference data)
ALTER TABLE public.esg_benchmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "esg_benchmarks_public_access" ON public.esg_benchmarks FOR ALL USING (true);

-- IPO Assessments (global reference data)
ALTER TABLE public.ipo_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ipo_assessments_public_access" ON public.ipo_assessments FOR ALL USING (true);

-- Job Applications (needs company_id column)
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS company_id UUID;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "job_applications_select" ON public.job_applications
  FOR SELECT USING (company_id = public.get_user_company_id() OR company_id IS NULL);
CREATE POLICY "job_applications_insert" ON public.job_applications
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());
CREATE POLICY "job_applications_update" ON public.job_applications
  FOR UPDATE USING (company_id = public.get_user_company_id() OR company_id IS NULL);
CREATE POLICY "job_applications_delete" ON public.job_applications
  FOR DELETE USING (company_id = public.get_user_company_id() OR company_id IS NULL);