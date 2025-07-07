-- KPI Management System Tables
CREATE TABLE public.module_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_ar TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.module_categories(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, name)
);

CREATE TABLE public.module_kpis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  kpi_name TEXT NOT NULL,
  kpi_name_ar TEXT,
  kpi_order INTEGER NOT NULL CHECK (kpi_order BETWEEN 1 AND 5),
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2),
  unit TEXT, -- %, ms, score, rate, etc.
  calculation_method TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(module_id, kpi_order)
);

CREATE TABLE public.kpi_measurements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID REFERENCES public.module_kpis(id) ON DELETE CASCADE,
  measured_value DECIMAL(10,2) NOT NULL,
  measurement_date DATE DEFAULT CURRENT_DATE,
  measurement_source TEXT, -- 'system', 'manual', 'ai_sync', etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.module_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_measurements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view module categories" ON public.module_categories FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can manage their company modules" ON public.modules FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can manage their module KPIs" ON public.module_kpis FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can manage their KPI measurements" ON public.kpi_measurements FOR ALL USING (auth.uid() IS NOT NULL);

-- Indexes for performance
CREATE INDEX idx_modules_category_company ON public.modules(category_id, company_id);
CREATE INDEX idx_module_kpis_module ON public.module_kpis(module_id);
CREATE INDEX idx_kpi_measurements_kpi_date ON public.kpi_measurements(kpi_id, measurement_date);

-- Triggers for timestamps
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_module_kpis_updated_at BEFORE UPDATE ON public.module_kpis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert module categories
INSERT INTO public.module_categories (name, name_ar, description) VALUES
('AI & Automation Modules', 'وحدات الذكاء الاصطناعي والأتمتة', 'AI-powered modules for automation and intelligent processing'),
('Additional Platform Features', 'ميزات إضافية للمنصة', 'Additional platform capabilities and integrations'),
('Advanced Analytics Modules', 'وحدات التحليلات المتقدمة', 'Advanced analytics and reporting modules'),
('Core HR Modules', 'الوحدات الأساسية للموارد البشرية', 'Core human resources management modules'),
('Diagnostic Frameworks', 'أطر العمل التشخيصية', 'Diagnostic and assessment frameworks'),
('Employee Welfare & Safety', 'رفاهية وسلامة الموظفين', 'Employee welfare and safety management'),
('Final Modules', 'الوحدات النهائية', 'Final system modules and tools'),
('Governance & Legal Compliance', 'الحوكمة والامتثال القانوني', 'Governance and legal compliance tools'),
('Government Integrations', 'التكاملات الحكومية', 'Government system integrations'),
('Local Content Compliance', 'امتثال المحتوى المحلي', 'Local content compliance monitoring'),
('Payroll & Financial Modules', 'وحدات الرواتب والمالية', 'Payroll and financial management modules'),
('Premium Consulting Tools', 'أدوات الاستشارات المتميزة', 'Premium consulting and advisory tools'),
('Strategic HR & Analytics', 'الموارد البشرية الاستراتيجية والتحليلات', 'Strategic HR and advanced analytics');

-- Insert sample modules and KPIs for each company (from the provided matrix)
DO $$
DECLARE
    company_record RECORD;
    category_record RECORD;
    module_id UUID;
    kpi_data RECORD;
BEGIN
    -- Loop through each company
    FOR company_record IN SELECT id FROM public.companies LOOP
        -- AI & Automation Modules
        SELECT id INTO category_record FROM public.module_categories WHERE name = 'AI & Automation Modules';
        
        -- AI Sync Engine
        INSERT INTO public.modules (category_id, company_id, name, name_ar, description) 
        VALUES (category_record.id, company_record.id, 'AI Sync Engine', 'محرك المزامنة الذكي', 'Real-time AI synchronization engine')
        RETURNING id INTO module_id;
        
        INSERT INTO public.module_kpis (module_id, kpi_name, kpi_order, unit) VALUES
        (module_id, 'Sync Accuracy %', 1, '%'),
        (module_id, 'Latency (ms)', 2, 'ms'),
        (module_id, 'Failed Events', 3, 'count');
        
        -- Arabic-English NLP Engine
        INSERT INTO public.modules (category_id, company_id, name, name_ar, description) 
        VALUES (category_record.id, company_record.id, 'Arabic-English NLP Engine', 'محرك معالجة اللغة العربية الإنجليزية', 'Natural language processing for Arabic and English')
        RETURNING id INTO module_id;
        
        INSERT INTO public.module_kpis (module_id, kpi_name, kpi_order, unit) VALUES
        (module_id, 'Arabic-English NLP Engine Performance Score', 1, 'score'),
        (module_id, 'Arabic-English NLP Engine Compliance %', 2, '%'),
        (module_id, 'Arabic-English NLP Engine Efficiency Index', 3, 'index');
        
        -- Core HR Modules examples
        SELECT id INTO category_record FROM public.module_categories WHERE name = 'Core HR Modules';
        
        -- Employee Management
        INSERT INTO public.modules (category_id, company_id, name, name_ar, description) 
        VALUES (category_record.id, company_record.id, 'Employee Management', 'إدارة الموظفين', 'Comprehensive employee management system')
        RETURNING id INTO module_id;
        
        INSERT INTO public.module_kpis (module_id, kpi_name, kpi_order, unit) VALUES
        (module_id, 'Total Active Employees', 1, 'count'),
        (module_id, 'Attrition Rate', 2, '%'),
        (module_id, 'Data Completeness %', 3, '%');
        
        -- Payroll Processing (WPS)
        INSERT INTO public.modules (category_id, company_id, name, name_ar, description) 
        VALUES (category_record.id, company_record.id, 'Payroll Processing (WPS)', 'معالجة الرواتب (نظام حماية الأجور)', 'WPS compliant payroll processing')
        RETURNING id INTO module_id;
        
        INSERT INTO public.module_kpis (module_id, kpi_name, kpi_order, unit) VALUES
        (module_id, 'Payroll Processing (WPS) Performance Score', 1, 'score'),
        (module_id, 'Payroll Processing (WPS) Compliance %', 2, '%'),
        (module_id, 'Payroll Processing (WPS) Efficiency Index', 3, 'index');
        
    END LOOP;
END $$;