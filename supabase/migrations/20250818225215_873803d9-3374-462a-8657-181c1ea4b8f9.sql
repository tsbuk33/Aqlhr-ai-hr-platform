-- Create audit table for authentication email events
CREATE TABLE public.auth_email_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('signup', 'magic')),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.auth_email_events ENABLE ROW LEVEL SECURITY;

-- Create policy for system access only (no user access needed for audit logs)
CREATE POLICY "Service role can manage auth email events" 
ON public.auth_email_events 
FOR ALL 
USING (false); -- Users cannot access audit logs directly

-- Create index for performance
CREATE INDEX idx_auth_email_events_email_sent_at ON public.auth_email_events(email, sent_at DESC);