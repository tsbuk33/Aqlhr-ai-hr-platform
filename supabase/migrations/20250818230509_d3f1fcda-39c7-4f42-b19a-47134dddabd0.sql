-- Create audit table for auth emails if not exists
CREATE TABLE IF NOT EXISTS public.auth_email_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  mode text CHECK (mode IN ('signup','magic')),
  sent_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  success boolean NOT NULL DEFAULT true,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.auth_email_events ENABLE ROW LEVEL SECURITY;

-- Optional: Allow read to authenticated users with admin-like role in future (commented to keep minimal exposure)
-- CREATE POLICY "service role can do anything" ON public.auth_email_events
--   FOR ALL USING (true) WITH CHECK (true);

