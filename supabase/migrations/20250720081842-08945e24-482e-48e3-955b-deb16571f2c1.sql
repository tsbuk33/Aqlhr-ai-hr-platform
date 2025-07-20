-- Create comprehensive AI integration tables for Manus.im + AqlHR

-- AI Query History and Learning
CREATE TABLE public.ai_query_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID,
  user_id UUID,
  query_text TEXT NOT NULL,
  query_language TEXT DEFAULT 'en',
  module_context TEXT NOT NULL,
  ai_response JSONB NOT NULL,
  confidence_score NUMERIC DEFAULT 0,
  execution_time_ms INTEGER,
  feedback_score INTEGER CHECK (feedback_score >= 1 AND feedback_score <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Predictions and Forecasting
CREATE TABLE public.ai_workforce_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID,
  prediction_type TEXT NOT NULL, -- 'turnover', 'hiring_demand', 'performance', 'cost'
  target_date DATE NOT NULL,
  predicted_value NUMERIC NOT NULL,
  confidence_interval JSONB, -- {lower: number, upper: number}
  influencing_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
  actual_value NUMERIC,
  accuracy_score NUMERIC,
  model_version TEXT DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Automation Workflows
CREATE TABLE public.ai_automation_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID,
  workflow_name TEXT NOT NULL,
  trigger_conditions JSONB NOT NULL,
  actions JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  success_rate NUMERIC DEFAULT 0,
  last_executed TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Decision Support and Recommendations
CREATE TABLE public.ai_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID,
  target_type TEXT NOT NULL, -- 'employee', 'department', 'company'
  target_id UUID,
  recommendation_type TEXT NOT NULL,
  title TEXT NOT NULL,
  title_ar TEXT,
  description TEXT NOT NULL,
  description_ar TEXT,
  confidence_score NUMERIC NOT NULL,
  priority_level TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  expected_impact JSONB, -- {metric: string, value: number, timeline: string}
  implementation_steps JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'implemented'
  feedback JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Learning and Optimization
CREATE TABLE public.ai_learning_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID,
  metric_type TEXT NOT NULL,
  metric_category TEXT NOT NULL, -- 'accuracy', 'performance', 'user_satisfaction'
  current_value NUMERIC NOT NULL,
  target_value NUMERIC,
  trend_direction TEXT, -- 'improving', 'declining', 'stable'
  measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Security and Audit
CREATE TABLE public.ai_security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID,
  user_id UUID,
  event_type TEXT NOT NULL, -- 'query', 'prediction', 'automation', 'recommendation'
  security_level TEXT NOT NULL, -- 'public', 'internal', 'confidential', 'restricted'
  data_accessed JSONB,
  ip_address INET,
  user_agent TEXT,
  risk_score NUMERIC DEFAULT 0,
  anomaly_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Performance Analytics
CREATE TABLE public.ai_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID,
  module_name TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  baseline_value NUMERIC,
  improvement_percentage NUMERIC,
  measurement_period TEXT, -- 'daily', 'weekly', 'monthly'
  measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_query_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_workforce_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can manage AI data from their company" ON public.ai_query_history
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage AI predictions from their company" ON public.ai_workforce_predictions
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage AI workflows from their company" ON public.ai_automation_workflows
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage AI recommendations from their company" ON public.ai_recommendations
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage AI learning metrics from their company" ON public.ai_learning_metrics
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage AI security events from their company" ON public.ai_security_events
FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage AI performance metrics from their company" ON public.ai_performance_metrics
FOR ALL USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_ai_query_history_company_date ON public.ai_query_history(company_id, created_at DESC);
CREATE INDEX idx_ai_predictions_company_type ON public.ai_workforce_predictions(company_id, prediction_type);
CREATE INDEX idx_ai_recommendations_company_status ON public.ai_recommendations(company_id, status);
CREATE INDEX idx_ai_security_events_company_date ON public.ai_security_events(company_id, created_at DESC);

-- Create triggers for updated_at
CREATE TRIGGER update_ai_predictions_updated_at
BEFORE UPDATE ON public.ai_workforce_predictions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_workflows_updated_at
BEFORE UPDATE ON public.ai_automation_workflows
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_recommendations_updated_at
BEFORE UPDATE ON public.ai_recommendations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();