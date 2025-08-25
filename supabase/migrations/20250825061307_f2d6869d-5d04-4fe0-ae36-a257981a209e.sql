-- Create ui_events table for observability logging
CREATE TABLE public.ui_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL,
  event_type text NOT NULL,
  level text NOT NULL CHECK (level IN ('info', 'warn', 'error', 'debug')),
  page text NOT NULL,
  message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ui_events ENABLE ROW LEVEL SECURITY;

-- Create policies for ui_events
CREATE POLICY "Users can insert their own events" 
ON public.ui_events 
FOR INSERT 
WITH CHECK (true); -- Allow all inserts for logging

CREATE POLICY "Users can view their tenant events" 
ON public.ui_events 
FOR SELECT 
USING (true); -- Allow reading for debugging (can be restricted later)

-- Create index for better performance
CREATE INDEX idx_ui_events_tenant_created ON public.ui_events (tenant_id, created_at DESC);
CREATE INDEX idx_ui_events_page_level ON public.ui_events (page, level, created_at DESC);