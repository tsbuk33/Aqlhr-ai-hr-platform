-- Enable RLS on core tables that currently don't have it
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gosi_rate_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_sync_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_integrations ENABLE ROW LEVEL SECURITY;

-- Create company-scoped policies for companies table
CREATE POLICY "Users can view their own company" 
ON public.companies 
FOR SELECT 
USING (id = public.get_user_company_id());

CREATE POLICY "Admins can update their company" 
ON public.companies 
FOR UPDATE 
USING (id = public.get_user_company_id());

-- Create company-scoped policies for employees table
CREATE POLICY "Users can view employees from their company" 
ON public.employees 
FOR SELECT 
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can manage employees from their company" 
ON public.employees 
FOR ALL 
USING (company_id = public.get_user_company_id());

-- Create policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

-- Create policies for other tables with company isolation
CREATE POLICY "Users can view departments from their company" 
ON public.departments 
FOR SELECT 
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can manage departments from their company" 
ON public.departments 
FOR ALL 
USING (company_id = public.get_user_company_id());

CREATE POLICY "GOSI rates are publicly viewable" 
ON public.gosi_rate_history 
FOR SELECT 
USING (true);

CREATE POLICY "Users can view reports from their company" 
ON public.employee_reports 
FOR ALL 
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can view sync events from their company" 
ON public.ai_sync_events 
FOR ALL 
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can manage integrations from their company" 
ON public.tool_integrations 
FOR ALL 
USING (company_id = public.get_user_company_id());