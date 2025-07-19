-- Create tables for LEO-GEO integration
CREATE TABLE public.learning_engagement_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID,
  employee_id UUID,
  learning_engagement_score NUMERIC DEFAULT 0,
  skills_completion_rate NUMERIC DEFAULT 0,
  engagement_impact_on_learning NUMERIC DEFAULT 0,
  learning_impact_on_engagement NUMERIC DEFAULT 0,
  recommended_learning_actions JSONB DEFAULT '[]'::jsonb,
  recommended_engagement_actions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_engagement_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can manage learning engagement insights from their company" 
ON public.learning_engagement_insights 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create cross-system recommendations table
CREATE TABLE public.cross_system_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID,
  employee_id UUID,
  source_system TEXT NOT NULL, -- 'leo' or 'geo'
  target_system TEXT NOT NULL, -- 'geo' or 'leo'
  recommendation_type TEXT NOT NULL, -- 'learning_based_on_engagement', 'engagement_based_on_learning'
  recommendation_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  priority_score NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days')
);

-- Enable RLS
ALTER TABLE public.cross_system_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can view cross-system recommendations from their company" 
ON public.cross_system_recommendations 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create learning progress tracking table
CREATE TABLE public.learning_progress_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID,
  employee_id UUID,
  skill_name TEXT NOT NULL,
  skill_category TEXT,
  current_level NUMERIC DEFAULT 0,
  target_level NUMERIC DEFAULT 100,
  completion_percentage NUMERIC DEFAULT 0,
  learning_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  engagement_correlation NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_progress_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can manage learning progress from their company" 
ON public.learning_progress_tracking 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create engagement metrics tracking table
CREATE TABLE public.engagement_metrics_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID,
  employee_id UUID,
  engagement_score NUMERIC DEFAULT 0,
  pulse_response_rate NUMERIC DEFAULT 0,
  recognition_given INTEGER DEFAULT 0,
  recognition_received INTEGER DEFAULT 0,
  connections_made INTEGER DEFAULT 0,
  collaboration_score NUMERIC DEFAULT 0,
  learning_correlation NUMERIC DEFAULT 0,
  measurement_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.engagement_metrics_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can manage engagement metrics from their company" 
ON public.engagement_metrics_tracking 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create function to sync LEO-GEO data
CREATE OR REPLACE FUNCTION public.sync_leo_geo_insights()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update learning engagement insights
  INSERT INTO public.learning_engagement_insights (
    company_id,
    employee_id,
    learning_engagement_score,
    skills_completion_rate,
    engagement_impact_on_learning,
    learning_impact_on_engagement
  )
  SELECT 
    COALESCE(lpt.company_id, emt.company_id),
    COALESCE(lpt.employee_id, emt.employee_id),
    COALESCE(emt.engagement_score, 0) * 0.7 + COALESCE(AVG(lpt.completion_percentage), 0) * 0.3 as learning_engagement_score,
    COALESCE(AVG(lpt.completion_percentage), 0) as skills_completion_rate,
    CASE 
      WHEN emt.engagement_score > 80 THEN 15
      WHEN emt.engagement_score > 60 THEN 10
      ELSE 5
    END as engagement_impact_on_learning,
    CASE 
      WHEN AVG(lpt.completion_percentage) > 80 THEN 15
      WHEN AVG(lpt.completion_percentage) > 60 THEN 10
      ELSE 5
    END as learning_impact_on_engagement
  FROM public.learning_progress_tracking lpt
  FULL OUTER JOIN public.engagement_metrics_tracking emt 
    ON lpt.employee_id = emt.employee_id AND lpt.company_id = emt.company_id
  WHERE COALESCE(lpt.employee_id, emt.employee_id) = COALESCE(NEW.employee_id, OLD.employee_id)
  GROUP BY lpt.company_id, lpt.employee_id, emt.company_id, emt.employee_id, emt.engagement_score
  ON CONFLICT (employee_id) 
  DO UPDATE SET
    learning_engagement_score = EXCLUDED.learning_engagement_score,
    skills_completion_rate = EXCLUDED.skills_completion_rate,
    engagement_impact_on_learning = EXCLUDED.engagement_impact_on_learning,
    learning_impact_on_engagement = EXCLUDED.learning_impact_on_engagement,
    updated_at = now();

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-sync
CREATE TRIGGER learning_progress_sync_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.learning_progress_tracking
  FOR EACH ROW EXECUTE FUNCTION public.sync_leo_geo_insights();

CREATE TRIGGER engagement_metrics_sync_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.engagement_metrics_tracking
  FOR EACH ROW EXECUTE FUNCTION public.sync_leo_geo_insights();

-- Create indexes for better performance
CREATE INDEX idx_learning_engagement_insights_employee ON public.learning_engagement_insights(employee_id, company_id);
CREATE INDEX idx_cross_system_recommendations_employee ON public.cross_system_recommendations(employee_id, company_id, source_system);
CREATE INDEX idx_learning_progress_employee ON public.learning_progress_tracking(employee_id, company_id);
CREATE INDEX idx_engagement_metrics_employee ON public.engagement_metrics_tracking(employee_id, company_id);

-- Insert sample data for demonstration
INSERT INTO public.learning_progress_tracking (company_id, employee_id, skill_name, skill_category, current_level, target_level, completion_percentage, learning_streak_days) VALUES
(gen_random_uuid(), gen_random_uuid(), 'AI & Machine Learning', 'Technical', 75, 90, 83, 12),
(gen_random_uuid(), gen_random_uuid(), 'Cultural Intelligence', 'Cultural', 82, 95, 86, 8),
(gen_random_uuid(), gen_random_uuid(), 'Digital Leadership', 'Leadership', 68, 85, 80, 5);

INSERT INTO public.engagement_metrics_tracking (company_id, employee_id, engagement_score, pulse_response_rate, recognition_given, recognition_received, connections_made, collaboration_score) VALUES
(gen_random_uuid(), gen_random_uuid(), 87, 94, 5, 3, 8, 89),
(gen_random_uuid(), gen_random_uuid(), 82, 88, 3, 7, 12, 91),
(gen_random_uuid(), gen_random_uuid(), 78, 85, 8, 2, 6, 85);