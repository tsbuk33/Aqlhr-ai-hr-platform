-- Add AI module tables and real-time sync infrastructure
CREATE TABLE public.ai_sync_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'employee_update', 'payroll_change', etc.
  source_table TEXT NOT NULL,
  source_record_id UUID NOT NULL,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'processing', 'completed', 'failed')),
  affected_modules TEXT[] NOT NULL, -- array of modules that need updates
  payload JSONB NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  sync_latency_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI recommendations table
CREATE TABLE public.ai_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('promotion', 'transfer', 'warning', 'retention', 'training', 'salary_adjustment')),
  confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0.00 AND 1.00),
  reasoning TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected', 'implemented')),
  reviewed_by UUID REFERENCES public.employees(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  implementation_deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Predictive analytics models and results
CREATE TABLE public.ai_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  model_type TEXT NOT NULL CHECK (model_type IN ('attrition_risk', 'promotion_readiness', 'burnout_risk', 'training_impact', 'performance_trend')),
  prediction_score DECIMAL(5,2) NOT NULL, -- 0-100 or probability
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  influencing_factors JSONB NOT NULL, -- top factors affecting prediction
  confidence_interval JSONB, -- statistical confidence data
  model_version TEXT DEFAULT '1.0',
  prediction_date DATE DEFAULT CURRENT_DATE,
  expires_at DATE, -- when prediction becomes stale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Document intelligence processing log
CREATE TABLE public.ai_document_processing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'cv', 'resignation', 'complaint', 'certificate'
  file_name TEXT NOT NULL,
  file_url TEXT,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  extracted_data JSONB, -- structured data extracted from document
  language_detected TEXT, -- 'ar', 'en', 'mixed'
  confidence_score DECIMAL(3,2),
  processing_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on AI tables
ALTER TABLE public.ai_sync_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_document_processing ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view AI sync events from their company" ON public.ai_sync_events FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view AI recommendations from their company" ON public.ai_recommendations FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view AI predictions from their company" ON public.ai_predictions FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view AI document processing from their company" ON public.ai_document_processing FOR ALL USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_ai_sync_events_company_status ON public.ai_sync_events(company_id, sync_status);
CREATE INDEX idx_ai_sync_events_created_at ON public.ai_sync_events(created_at DESC);
CREATE INDEX idx_ai_recommendations_employee_status ON public.ai_recommendations(employee_id, status);
CREATE INDEX idx_ai_predictions_employee_model ON public.ai_predictions(employee_id, model_type);
CREATE INDEX idx_ai_document_processing_status ON public.ai_document_processing(processing_status);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ai_recommendations_updated_at BEFORE UPDATE ON public.ai_recommendations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to trigger AI sync when employee data changes
CREATE OR REPLACE FUNCTION public.trigger_ai_sync()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert sync event for employee changes
  INSERT INTO public.ai_sync_events (
    company_id,
    event_type,
    source_table,
    source_record_id,
    affected_modules,
    payload
  ) VALUES (
    NEW.company_id,
    TG_OP || '_employee',
    TG_TABLE_NAME,
    NEW.id,
    ARRAY['payroll', 'performance', 'org_chart', 'qiwa', 'gosi', 'succession_planning'],
    to_jsonb(NEW)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to employees table
CREATE TRIGGER employee_ai_sync_trigger
  AFTER INSERT OR UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.trigger_ai_sync();