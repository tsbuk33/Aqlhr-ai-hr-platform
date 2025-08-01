-- Enable RLS and add company-scoped policies for the remaining tables

-- ESG Assessments
ALTER TABLE public.esg_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "esg_assessments_select" ON public.esg_assessments
  FOR SELECT USING (company_id = public.get_user_company_id());
CREATE POLICY "esg_assessments_insert" ON public.esg_assessments
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());
CREATE POLICY "esg_assessments_update" ON public.esg_assessments
  FOR UPDATE USING (company_id = public.get_user_company_id());
CREATE POLICY "esg_assessments_delete" ON public.esg_assessments
  FOR DELETE USING (company_id = public.get_user_company_id());

-- Executive Metrics
ALTER TABLE public.executive_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "executive_metrics_select" ON public.executive_metrics
  FOR SELECT USING (company_id = public.get_user_company_id());
CREATE POLICY "executive_metrics_insert" ON public.executive_metrics
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());
CREATE POLICY "executive_metrics_update" ON public.executive_metrics
  FOR UPDATE USING (company_id = public.get_user_company_id());
CREATE POLICY "executive_metrics_delete" ON public.executive_metrics
  FOR DELETE USING (company_id = public.get_user_company_id());

-- Government Integration Log
ALTER TABLE public.government_integration_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "government_integration_log_select" ON public.government_integration_log
  FOR SELECT USING (company_id = public.get_user_company_id());
CREATE POLICY "government_integration_log_insert" ON public.government_integration_log
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());
CREATE POLICY "government_integration_log_update" ON public.government_integration_log
  FOR UPDATE USING (company_id = public.get_user_company_id());
CREATE POLICY "government_integration_log_delete" ON public.government_integration_log
  FOR DELETE USING (company_id = public.get_user_company_id());

-- Nitaqat Tracking
ALTER TABLE public.nitaqat_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nitaqat_tracking_select" ON public.nitaqat_tracking
  FOR SELECT USING (company_id = public.get_user_company_id());
CREATE POLICY "nitaqat_tracking_insert" ON public.nitaqat_tracking
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());
CREATE POLICY "nitaqat_tracking_update" ON public.nitaqat_tracking
  FOR UPDATE USING (company_id = public.get_user_company_id());
CREATE POLICY "nitaqat_tracking_delete" ON public.nitaqat_tracking
  FOR DELETE USING (company_id = public.get_user_company_id());

-- Saudi Payroll
ALTER TABLE public.saudi_payroll ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saudi_payroll_select" ON public.saudi_payroll
  FOR SELECT USING (company_id = public.get_user_company_id());
CREATE POLICY "saudi_payroll_insert" ON public.saudi_payroll
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());
CREATE POLICY "saudi_payroll_update" ON public.saudi_payroll
  FOR UPDATE USING (company_id = public.get_user_company_id());
CREATE POLICY "saudi_payroll_delete" ON public.saudi_payroll
  FOR DELETE USING (company_id = public.get_user_company_id());

-- Saudi Leave Requests
ALTER TABLE public.saudi_leave_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saudi_leave_requests_select" ON public.saudi_leave_requests
  FOR SELECT USING (company_id = public.get_user_company_id());
CREATE POLICY "saudi_leave_requests_insert" ON public.saudi_leave_requests
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());
CREATE POLICY "saudi_leave_requests_update" ON public.saudi_leave_requests
  FOR UPDATE USING (company_id = public.get_user_company_id());
CREATE POLICY "saudi_leave_requests_delete" ON public.saudi_leave_requests
  FOR DELETE USING (company_id = public.get_user_company_id());

-- Saudi Departments (Reference table - public access)
ALTER TABLE public.saudi_departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saudi_departments_public_select" ON public.saudi_departments
  FOR SELECT USING (true);

-- Saudi Documents
ALTER TABLE public.saudi_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saudi_documents_select" ON public.saudi_documents
  FOR SELECT USING (company_id = public.get_user_company_id());
CREATE POLICY "saudi_documents_insert" ON public.saudi_documents
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());
CREATE POLICY "saudi_documents_update" ON public.saudi_documents
  FOR UPDATE USING (company_id = public.get_user_company_id());
CREATE POLICY "saudi_documents_delete" ON public.saudi_documents
  FOR DELETE USING (company_id = public.get_user_company_id());