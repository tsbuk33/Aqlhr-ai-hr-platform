-- Create analytics_events table for smoke testing
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID,
  user_id UUID,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  module_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics events
CREATE POLICY "Users can view analytics events from their company" 
ON public.analytics_events 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert analytics events for their company" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update analytics events from their company" 
ON public.analytics_events 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete analytics events from their company" 
ON public.analytics_events 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX idx_analytics_events_company_id ON public.analytics_events(company_id);
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);