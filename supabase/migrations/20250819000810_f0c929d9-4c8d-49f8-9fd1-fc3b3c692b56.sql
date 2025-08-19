-- Add indexes for faster queries on auth_email_events table
CREATE INDEX IF NOT EXISTS idx_auth_email_events_email ON public.auth_email_events (email);
CREATE INDEX IF NOT EXISTS idx_auth_email_events_sent_at ON public.auth_email_events (sent_at DESC);