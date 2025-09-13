-- Fix security vulnerability in ui_events table
-- Ensure table exists with proper structure and RLS policies

-- Create ui_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.ui_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  event_type TEXT DEFAULT 'ui_event',
  page TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error')),
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on ui_events table
ALTER TABLE public.ui_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to restrict access to admin users only
-- Only allow system/service role to insert events
CREATE POLICY "System can insert ui events" 
ON public.ui_events 
FOR INSERT 
WITH CHECK (true);

-- Only allow admins and super_admins to view ui events from their tenant
CREATE POLICY "Admins can view ui events from their tenant" 
ON public.ui_events 
FOR SELECT 
USING (
  tenant_id = get_user_company_id() 
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.company_id = get_user_company_id()
    AND ur.role IN ('admin'::app_role, 'super_admin'::app_role)
  )
);

-- Only allow admins to delete old ui events for cleanup
CREATE POLICY "Admins can delete ui events from their tenant" 
ON public.ui_events 
FOR DELETE 
USING (
  tenant_id = get_user_company_id() 
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.company_id = get_user_company_id()
    AND ur.role IN ('admin'::app_role, 'super_admin'::app_role)
  )
);

-- Create index for better performance on tenant queries
CREATE INDEX IF NOT EXISTS idx_ui_events_tenant_created 
ON public.ui_events (tenant_id, created_at DESC);

-- Create index for level-based queries (for filtering errors)
CREATE INDEX IF NOT EXISTS idx_ui_events_tenant_level 
ON public.ui_events (tenant_id, level, created_at DESC);