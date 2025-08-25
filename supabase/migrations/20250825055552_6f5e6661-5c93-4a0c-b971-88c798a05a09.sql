-- Create ui_events table for frontend observability logging
CREATE TABLE IF NOT EXISTS public.ui_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  page text NOT NULL,
  level text NOT NULL CHECK (level IN ('info', 'error', 'warn')),
  message text NOT NULL,
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ui_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for tenant isolation
CREATE POLICY "Users can manage ui_events from their tenant" ON public.ui_events
FOR ALL USING (tenant_id = get_user_company_id())
WITH CHECK (tenant_id = get_user_company_id());

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_ui_events_tenant_created ON public.ui_events(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ui_events_page ON public.ui_events(page);
CREATE INDEX IF NOT EXISTS idx_ui_events_level ON public.ui_events(level);