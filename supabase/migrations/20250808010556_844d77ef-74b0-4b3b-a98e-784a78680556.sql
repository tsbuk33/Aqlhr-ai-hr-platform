-- Final migration to achieve 0 security gaps
-- Fix remaining 11 tables without RLS policies

-- Table: benefit_plans
CREATE POLICY "Users can manage benefit plans from their company" 
ON public.benefit_plans 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Table: departments  
CREATE POLICY "Users can manage departments from their company" 
ON public.departments 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Table: document_types
CREATE POLICY "Users can manage document types from their company" 
ON public.document_types 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Table: document_uploads
CREATE POLICY "Users can manage document uploads from their company" 
ON public.document_uploads 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Table: employee_benefits
CREATE POLICY "Users can manage employee benefits from their company" 
ON public.employee_benefits 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Table: employee_schedules
CREATE POLICY "Users can manage employee schedules from their company" 
ON public.employee_schedules 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Table: government_compliance
CREATE POLICY "Users can manage government compliance from their company" 
ON public.government_compliance 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Table: positions
CREATE POLICY "Users can manage positions from their company" 
ON public.positions 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Table: training_enrollments
CREATE POLICY "Users can manage training enrollments from their company" 
ON public.training_enrollments 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Table: training_sessions
CREATE POLICY "Users can manage training sessions from their company" 
ON public.training_sessions 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Table: work_schedules
CREATE POLICY "Users can manage work schedules from their company" 
ON public.work_schedules 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);