-- Add missing event_type column to existing ui_events table
ALTER TABLE public.ui_events 
ADD COLUMN IF NOT EXISTS event_type text NOT NULL DEFAULT 'info';

-- Rename 'details' column to 'metadata' to match the logging code
ALTER TABLE public.ui_events 
RENAME COLUMN details TO metadata;