-- Create auth_email_events table for audit logging
CREATE TABLE IF NOT EXISTS public.auth_email_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('signup', 'magic', 'reset')),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip TEXT,
  ua TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.auth_email_events ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (Edge Functions) to insert records
CREATE POLICY "Service role can insert auth email events" 
ON public.auth_email_events 
FOR INSERT 
WITH CHECK (true);

-- Create policy for authenticated users to view their own records
CREATE POLICY "Users can view their own auth email events" 
ON public.auth_email_events 
FOR SELECT 
USING (auth.uid() IS NOT NULL);